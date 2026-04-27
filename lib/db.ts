/**
 * Database abstraction layer.
 *
 * Local provider  — in-memory store, starts empty (populate via admin panel)
 * D1 provider     — Cloudflare D1 via Workers binding caffe54_menu_db
 *
 * This file must stay Edge-compatible because Cloudflare Pages requires dynamic
 * routes to run on the Edge Runtime. Do not import Node-only modules here.
 */

import type { Category, MenuItem, MenuData, AdminStats } from "@/types/menu";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

function now(): string {
  return new Date().toISOString();
}

export interface DbProvider {
  listCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  createCategory(cat: Category): Promise<Category>;
  updateCategory(id: string, patch: Partial<Omit<Category, "id">>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  categoryHasItems(id: string): Promise<boolean>;

  listItems(): Promise<MenuItem[]>;
  getItem(id: string): Promise<MenuItem | null>;
  createItem(item: MenuItem): Promise<MenuItem>;
  updateItem(id: string, patch: Partial<Omit<MenuItem, "id">>): Promise<MenuItem>;
  deleteItem(id: string): Promise<void>;

  getMenuData(): Promise<MenuData & { updatedAt: string }>;
  getStats(): Promise<AdminStats>;
}

type LocalDB = {
  categories: Category[];
  items: MenuItem[];
  meta: { updatedAt: string };
};

const g = globalThis as unknown as { _caffe54Db?: LocalDB | null };

async function readLocal(): Promise<LocalDB> {
  if (!g._caffe54Db) g._caffe54Db = { categories: [], items: [], meta: { updatedAt: now() } };
  return g._caffe54Db;
}

async function writeLocal(data: LocalDB): Promise<void> {
  data.meta.updatedAt = now();
  g._caffe54Db = data;
}

const localProvider: DbProvider = {
  async listCategories() {
    const d = await readLocal();
    return [...d.categories].sort((a, b) => a.order - b.order);
  },
  async getCategory(id) {
    const d = await readLocal();
    return d.categories.find(c => c.id === id) ?? null;
  },
  async createCategory(cat) {
    const d = await readLocal();
    d.categories.push(cat);
    await writeLocal(d);
    return cat;
  },
  async updateCategory(id, patch) {
    const d = await readLocal();
    const idx = d.categories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error(`Category "${id}" not found.`);
    const updated = { ...d.categories[idx], ...patch, id, updatedAt: now() };
    d.categories[idx] = updated;
    await writeLocal(d);
    return updated;
  },
  async deleteCategory(id) {
    const d = await readLocal();
    d.categories = d.categories.filter(c => c.id !== id);
    await writeLocal(d);
  },
  async categoryHasItems(id) {
    const d = await readLocal();
    return d.items.some(i => i.categoryId === id);
  },
  async listItems() {
    const d = await readLocal();
    return [...d.items].sort((a, b) => {
      const catCmp = a.categoryId.localeCompare(b.categoryId);
      return catCmp !== 0 ? catCmp : a.order - b.order;
    });
  },
  async getItem(id) {
    const d = await readLocal();
    return d.items.find(i => i.id === id) ?? null;
  },
  async createItem(item) {
    const d = await readLocal();
    d.items.push(item);
    await writeLocal(d);
    return item;
  },
  async updateItem(id, patch) {
    const d = await readLocal();
    const idx = d.items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Item "${id}" not found.`);
    const updated = { ...d.items[idx], ...patch, id, updatedAt: now() };
    d.items[idx] = updated;
    await writeLocal(d);
    return updated;
  },
  async deleteItem(id) {
    const d = await readLocal();
    d.items = d.items.filter(i => i.id !== id);
    d.items = d.items.map(i => ({ ...i, pairings: i.pairings.filter(p => p !== id) }));
    await writeLocal(d);
  },
  async getMenuData() {
    const d = await readLocal();
    return {
      categories: [...d.categories].filter(c => c.active).sort((a, b) => a.order - b.order),
      items: [...d.items].sort((a, b) => a.order - b.order),
      updatedAt: d.meta.updatedAt,
    };
  },
  async getStats() {
    const d = await readLocal();
    return {
      totalProducts: d.items.length,
      availableProducts: d.items.filter(i => i.available).length,
      unavailableProducts: d.items.filter(i => !i.available).length,
      activeCategories: d.categories.filter(c => c.active).length,
      featuredProducts: d.items.filter(i => i.featured).length,
      lastUpdated: d.meta.updatedAt,
    };
  },
};

function parseJsonArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: { pt: String(row.name_pt ?? ""), en: String(row.name_en ?? ""), es: String(row.name_es ?? "") },
    imageUrl: typeof row.image_url === "string" && row.image_url ? row.image_url : undefined,
    order: Number(row.display_order ?? 0),
    active: Number(row.active ?? 0) === 1,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function rowToItem(row: Record<string, unknown>): MenuItem {
  const badgePt = typeof row.badge_pt === "string" && row.badge_pt ? row.badge_pt : undefined;
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name: String(row.name ?? ""),
    description: {
      pt: String(row.description_pt ?? ""),
      en: String(row.description_en ?? ""),
      es: String(row.description_es ?? ""),
    },
    price: Number(row.price ?? 0),
    imageUrl: typeof row.image_url === "string" && row.image_url ? row.image_url : undefined,
    badge: badgePt
      ? {
          pt: badgePt,
          en: typeof row.badge_en === "string" && row.badge_en ? row.badge_en : badgePt,
          es: typeof row.badge_es === "string" && row.badge_es ? row.badge_es : badgePt,
        }
      : undefined,
    featured: Number(row.featured ?? 0) === 1,
    available: Number(row.available ?? 0) === 1,
    order: Number(row.display_order ?? 0),
    tags: parseJsonArray(row.tags),
    allergens: parseJsonArray(row.allergens),
    pairings: parseJsonArray(row.pairings),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function createD1Provider(d1: D1Database): DbProvider {
  return {
    async listCategories() {
      const { results } = await d1.prepare("SELECT * FROM categories ORDER BY display_order ASC").all();
      return (results as Record<string, unknown>[]).map(rowToCategory);
    },
    async getCategory(id) {
      const row = await d1.prepare("SELECT * FROM categories WHERE id=?").bind(id).first<Record<string, unknown>>();
      return row ? rowToCategory(row) : null;
    },
    async createCategory(cat) {
      await d1.prepare(
        `INSERT INTO categories
          (id, slug, name_pt, name_en, name_es, image_url, display_order, active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        cat.id, cat.slug, cat.name.pt, cat.name.en, cat.name.es, cat.imageUrl ?? null,
        cat.order, cat.active ? 1 : 0, cat.createdAt, cat.updatedAt
      ).run();
      return cat;
    },
    async updateCategory(id, patch) {
      const current = await d1.prepare("SELECT * FROM categories WHERE id=?").bind(id).first<Record<string, unknown>>();
      if (!current) throw new Error(`Category "${id}" not found.`);
      const merged = { ...rowToCategory(current), ...patch, id, updatedAt: now() };
      await d1.prepare(
        `UPDATE categories
         SET slug=?, name_pt=?, name_en=?, name_es=?, image_url=?, display_order=?, active=?, updated_at=?
         WHERE id=?`
      ).bind(
        merged.slug, merged.name.pt, merged.name.en, merged.name.es, merged.imageUrl ?? null,
        merged.order, merged.active ? 1 : 0, merged.updatedAt, id
      ).run();
      return merged;
    },
    async deleteCategory(id) {
      await d1.prepare("DELETE FROM categories WHERE id=?").bind(id).run();
    },
    async categoryHasItems(id) {
      const row = await d1.prepare("SELECT COUNT(*) AS cnt FROM menu_items WHERE category_id=?").bind(id).first<{ cnt: number }>();
      return Number(row?.cnt ?? 0) > 0;
    },
    async listItems() {
      const { results } = await d1.prepare("SELECT * FROM menu_items ORDER BY category_id, display_order ASC").all();
      return (results as Record<string, unknown>[]).map(rowToItem);
    },
    async getItem(id) {
      const row = await d1.prepare("SELECT * FROM menu_items WHERE id=?").bind(id).first<Record<string, unknown>>();
      return row ? rowToItem(row) : null;
    },
    async createItem(item) {
      await d1.prepare(
        `INSERT INTO menu_items
          (id, category_id, name, description_pt, description_en, description_es,
           price, image_url, badge_pt, badge_en, badge_es,
           featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        item.id, item.categoryId, item.name,
        item.description.pt, item.description.en, item.description.es,
        item.price, item.imageUrl ?? null,
        item.badge?.pt ?? null, item.badge?.en ?? null, item.badge?.es ?? null,
        item.featured ? 1 : 0, item.available ? 1 : 0, item.order,
        JSON.stringify(item.tags), JSON.stringify(item.allergens), JSON.stringify(item.pairings),
        item.createdAt, item.updatedAt
      ).run();
      return item;
    },
    async updateItem(id, patch) {
      const current = await d1.prepare("SELECT * FROM menu_items WHERE id=?").bind(id).first<Record<string, unknown>>();
      if (!current) throw new Error(`Item "${id}" not found.`);
      const merged = { ...rowToItem(current), ...patch, id, updatedAt: now() };
      await d1.prepare(
        `UPDATE menu_items
         SET category_id=?, name=?, description_pt=?, description_en=?, description_es=?,
             price=?, image_url=?, badge_pt=?, badge_en=?, badge_es=?, featured=?, available=?, display_order=?,
             tags=?, allergens=?, pairings=?, updated_at=?
         WHERE id=?`
      ).bind(
        merged.categoryId, merged.name,
        merged.description.pt, merged.description.en, merged.description.es,
        merged.price, merged.imageUrl ?? null,
        merged.badge?.pt ?? null, merged.badge?.en ?? null, merged.badge?.es ?? null,
        merged.featured ? 1 : 0, merged.available ? 1 : 0, merged.order,
        JSON.stringify(merged.tags), JSON.stringify(merged.allergens), JSON.stringify(merged.pairings),
        merged.updatedAt, id
      ).run();
      return merged;
    },
    async deleteItem(id) {
      const { results } = await d1.prepare("SELECT id, pairings FROM menu_items WHERE pairings LIKE ?").bind(`%${id}%`).all();
      const updates = (results as Array<{ id: string; pairings: string }>).map(row => {
        const arr = parseJsonArray(row.pairings).filter(p => p !== id);
        return d1.prepare("UPDATE menu_items SET pairings=? WHERE id=?").bind(JSON.stringify(arr), row.id);
      });
      if (updates.length) await d1.batch(updates);
      await d1.prepare("DELETE FROM menu_items WHERE id=?").bind(id).run();
    },
    async getMenuData() {
      const [catResult, itemResult] = await d1.batch([
        d1.prepare("SELECT * FROM categories WHERE active=1 ORDER BY display_order ASC"),
        d1.prepare("SELECT * FROM menu_items ORDER BY category_id, display_order ASC"),
      ]);
      const lastUpdated = await d1.prepare(
        `SELECT MAX(updated_at) AS ts FROM (
           SELECT updated_at FROM categories
           UNION ALL
           SELECT updated_at FROM menu_items
         )`
      ).first<{ ts: string }>();
      return {
        categories: (catResult.results as Record<string, unknown>[]).map(rowToCategory),
        items: (itemResult.results as Record<string, unknown>[]).map(rowToItem),
        updatedAt: lastUpdated?.ts ?? now(),
      };
    },
    async getStats() {
      const [itemStats, catStats] = await d1.batch([
        d1.prepare(
          `SELECT COUNT(*) AS total,
                  SUM(CASE WHEN available=1 THEN 1 ELSE 0 END) AS avail,
                  SUM(CASE WHEN available=0 THEN 1 ELSE 0 END) AS unavail,
                  SUM(CASE WHEN featured=1 THEN 1 ELSE 0 END) AS feat,
                  MAX(updated_at) AS last_item
           FROM menu_items`
        ),
        d1.prepare(
          `SELECT SUM(CASE WHEN active=1 THEN 1 ELSE 0 END) AS active_cats,
                  MAX(updated_at) AS last_cat
           FROM categories`
        ),
      ]);
      const ir = (itemStats.results[0] ?? {}) as Record<string, unknown>;
      const cr = (catStats.results[0] ?? {}) as Record<string, unknown>;
      const lastItem = typeof ir.last_item === "string" ? ir.last_item : "";
      const lastCat = typeof cr.last_cat === "string" ? cr.last_cat : "";
      return {
        totalProducts: Number(ir.total ?? 0),
        availableProducts: Number(ir.avail ?? 0),
        unavailableProducts: Number(ir.unavail ?? 0),
        featuredProducts: Number(ir.feat ?? 0),
        activeCategories: Number(cr.active_cats ?? 0),
        lastUpdated: lastItem > lastCat ? lastItem : (lastCat || now()),
      };
    },
  };
}

function tryGetD1(): D1Database | null {
  if (env.databaseProvider !== "d1") return null;
  try {
    const ctx = getOptionalRequestContext();
    return ctx?.env?.caffe54_menu_db ?? null;
  } catch {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[db] DATABASE_PROVIDER=d1 but Cloudflare request context is unavailable — using local seed data.");
    }
    return null;
  }
}

let _provider: DbProvider | null = null;

export function getDbProvider(): DbProvider {
  if (_provider) return _provider;
  const d1 = tryGetD1();
  _provider = d1 ? createD1Provider(d1) : localProvider;
  return _provider;
}

export function invalidateDbCache(): void {
  _provider = null;
  g._caffe54Db = null;
}
