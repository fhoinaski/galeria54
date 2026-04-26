/**
 * Database abstraction layer.
 *
 * Local provider  — JSON file at data/.local-db.json (dev, zero deps)
 * D1 provider     — Cloudflare D1 via Workers binding caffe54_menu_db
 *
 * Provider selection:
 *   DATABASE_PROVIDER=local  → always use JSON (default)
 *   DATABASE_PROVIDER=d1     → use D1 binding; falls back to local if CF
 *                              context is not available (plain `next dev`)
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Category, MenuItem, MenuData, AdminStats } from "@/types/menu";
import { seedCategories, seedItems } from "@/data/seed-menu";
import { env } from "./env";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbProvider {
  // Categories
  listCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  createCategory(cat: Category): Promise<Category>;
  updateCategory(id: string, patch: Partial<Omit<Category, "id">>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  categoryHasItems(id: string): Promise<boolean>;

  // Items
  listItems(): Promise<MenuItem[]>;
  getItem(id: string): Promise<MenuItem | null>;
  createItem(item: MenuItem): Promise<MenuItem>;
  updateItem(id: string, patch: Partial<Omit<MenuItem, "id">>): Promise<MenuItem>;
  deleteItem(id: string): Promise<void>;

  // Aggregates
  getMenuData(): Promise<MenuData & { updatedAt: string }>;
  getStats(): Promise<AdminStats>;
}

// ════════════════════════════════════════════════════════════════════════════
// LOCAL JSON PROVIDER
// ════════════════════════════════════════════════════════════════════════════

type LocalDB = {
  categories: Category[];
  items: MenuItem[];
  meta: { updatedAt: string };
};

const DB_PATH = path.join(process.cwd(), "data", ".local-db.json");

// globalThis cache — survives Next.js HMR
const g = globalThis as unknown as { _caffe54Db: LocalDB | null };
if (!g._caffe54Db) g._caffe54Db = null;

async function readLocal(): Promise<LocalDB> {
  if (g._caffe54Db) return g._caffe54Db;
  try {
    const content = await readFile(DB_PATH, "utf-8");
    g._caffe54Db = JSON.parse(content) as LocalDB;
    return g._caffe54Db;
  } catch {
    const initial: LocalDB = {
      categories: seedCategories,
      items: seedItems,
      meta: { updatedAt: now() },
    };
    await writeLocal(initial);
    return initial;
  }
}

async function writeLocal(data: LocalDB): Promise<void> {
  data.meta.updatedAt = now();
  g._caffe54Db = data;
  try {
    await mkdir(path.dirname(DB_PATH), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch { /* silent — cache still updated */ }
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

// ════════════════════════════════════════════════════════════════════════════
// D1 PROVIDER
// ════════════════════════════════════════════════════════════════════════════

// Row → TypeScript mappers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(row: Record<string, any>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: { pt: row.name_pt, en: row.name_en, es: row.name_es },
    imageUrl: (row.image_url as string | null) ?? undefined,
    order: row.display_order as number,
    active: (row.active as number) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: Record<string, any>): MenuItem {
  const hasBadge = !!row.badge_pt;
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    name: row.name as string,
    description: { pt: row.description_pt, en: row.description_en, es: row.description_es },
    price: row.price as number,
    imageUrl: (row.image_url as string | null) ?? undefined,
    badge: hasBadge
      ? {
          pt: row.badge_pt as string,
          en: (row.badge_en as string | null) ?? row.badge_pt,
          es: (row.badge_es as string | null) ?? row.badge_pt,
        }
      : undefined,
    featured: (row.featured as number) === 1,
    available: (row.available as number) === 1,
    order: row.display_order as number,
    tags: JSON.parse((row.tags as string) || "[]") as string[],
    allergens: JSON.parse((row.allergens as string) || "[]") as string[],
    pairings: JSON.parse((row.pairings as string) || "[]") as string[],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function createD1Provider(d1: D1Database): DbProvider {
  return {
    async listCategories() {
      const { results } = await d1
        .prepare("SELECT * FROM categories ORDER BY display_order ASC")
        .all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToCategory);
    },

    async getCategory(id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM categories WHERE id=?").bind(id).first() as any;
      return row ? rowToCategory(row) : null;
    },

    async createCategory(cat) {
      await d1
        .prepare(
          `INSERT INTO categories
            (id, slug, name_pt, name_en, name_es, image_url, display_order, active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          cat.id, cat.slug,
          cat.name.pt, cat.name.en, cat.name.es,
          cat.imageUrl ?? null,
          cat.order, cat.active ? 1 : 0,
          cat.createdAt, cat.updatedAt
        )
        .run();
      return cat;
    },

    async updateCategory(id, patch) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = await d1.prepare("SELECT * FROM categories WHERE id=?").bind(id).first() as any;
      if (!current) throw new Error(`Category "${id}" not found.`);
      const merged = { ...rowToCategory(current), ...patch, id, updatedAt: now() };
      await d1
        .prepare(
          `UPDATE categories
           SET slug=?, name_pt=?, name_en=?, name_es=?, image_url=?,
               display_order=?, active=?, updated_at=?
           WHERE id=?`
        )
        .bind(
          merged.slug, merged.name.pt, merged.name.en, merged.name.es,
          merged.imageUrl ?? null,
          merged.order, merged.active ? 1 : 0,
          merged.updatedAt, id
        )
        .run();
      return merged;
    },

    async deleteCategory(id) {
      await d1.prepare("DELETE FROM categories WHERE id=?").bind(id).run();
    },

    async categoryHasItems(id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT COUNT(*) AS cnt FROM menu_items WHERE category_id=?").bind(id).first() as any;
      return (row?.cnt as number ?? 0) > 0;
    },

    async listItems() {
      const { results } = await d1
        .prepare("SELECT * FROM menu_items ORDER BY category_id, display_order ASC")
        .all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToItem);
    },

    async getItem(id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM menu_items WHERE id=?").bind(id).first() as any;
      return row ? rowToItem(row) : null;
    },

    async createItem(item) {
      await d1
        .prepare(
          `INSERT INTO menu_items
            (id, category_id, name, description_pt, description_en, description_es,
             price, image_url, badge_pt, badge_en, badge_es,
             featured, available, display_order,
             tags, allergens, pairings, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          item.id, item.categoryId, item.name,
          item.description.pt, item.description.en, item.description.es,
          item.price, item.imageUrl ?? null,
          item.badge?.pt ?? null, item.badge?.en ?? null, item.badge?.es ?? null,
          item.featured ? 1 : 0, item.available ? 1 : 0, item.order,
          JSON.stringify(item.tags),
          JSON.stringify(item.allergens),
          JSON.stringify(item.pairings),
          item.createdAt, item.updatedAt
        )
        .run();
      return item;
    },

    async updateItem(id, patch) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = await d1.prepare("SELECT * FROM menu_items WHERE id=?").bind(id).first() as any;
      if (!current) throw new Error(`Item "${id}" not found.`);
      const merged = { ...rowToItem(current), ...patch, id, updatedAt: now() };
      await d1
        .prepare(
          `UPDATE menu_items
           SET category_id=?, name=?,
               description_pt=?, description_en=?, description_es=?,
               price=?, image_url=?, badge_pt=?, badge_en=?, badge_es=?,
               featured=?, available=?, display_order=?,
               tags=?, allergens=?, pairings=?, updated_at=?
           WHERE id=?`
        )
        .bind(
          merged.categoryId, merged.name,
          merged.description.pt, merged.description.en, merged.description.es,
          merged.price, merged.imageUrl ?? null,
          merged.badge?.pt ?? null, merged.badge?.en ?? null, merged.badge?.es ?? null,
          merged.featured ? 1 : 0, merged.available ? 1 : 0, merged.order,
          JSON.stringify(merged.tags),
          JSON.stringify(merged.allergens),
          JSON.stringify(merged.pairings),
          merged.updatedAt, id
        )
        .run();
      return merged;
    },

    async deleteItem(id) {
      // Remove from pairings in other items first (best-effort)
      const { results } = await d1
        .prepare("SELECT id, pairings FROM menu_items WHERE pairings LIKE ?")
        .bind(`%${id}%`)
        .all();
      const updates = (results as Array<{ id: string; pairings: string }>).map(row => {
        const arr = (JSON.parse(row.pairings || "[]") as string[]).filter(p => p !== id);
        return d1.prepare("UPDATE menu_items SET pairings=? WHERE id=?")
          .bind(JSON.stringify(arr), row.id);
      });
      if (updates.length) await d1.batch(updates);
      await d1.prepare("DELETE FROM menu_items WHERE id=?").bind(id).run();
    },

    async getMenuData() {
      const [catResult, itemResult] = await d1.batch([
        d1.prepare("SELECT * FROM categories WHERE active=1 ORDER BY display_order ASC"),
        d1.prepare("SELECT * FROM menu_items ORDER BY category_id, display_order ASC"),
      ]);
      const lastUpdated = await d1
        .prepare(
          `SELECT MAX(updated_at) AS ts FROM (
             SELECT updated_at FROM categories
             UNION ALL
             SELECT updated_at FROM menu_items
           )`
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .first() as any;
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        categories: (catResult.results as any[]).map(rowToCategory),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (itemResult.results as any[]).map(rowToItem),
        updatedAt: (lastUpdated?.ts as string) ?? now(),
      };
    },

    async getStats() {
      const [itemStats, catStats] = await d1.batch([
        d1.prepare(
          `SELECT
             COUNT(*) AS total,
             SUM(CASE WHEN available=1 THEN 1 ELSE 0 END) AS avail,
             SUM(CASE WHEN available=0 THEN 1 ELSE 0 END) AS unavail,
             SUM(CASE WHEN featured=1 THEN 1 ELSE 0 END) AS feat,
             MAX(updated_at) AS last_item
           FROM menu_items`
        ),
        d1.prepare(
          `SELECT
             SUM(CASE WHEN active=1 THEN 1 ELSE 0 END) AS active_cats,
             MAX(updated_at) AS last_cat
           FROM categories`
        ),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ir = (itemStats.results[0] ?? {}) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cr = (catStats.results[0] ?? {}) as any;
      const lastUpdated = ir.last_item > cr.last_cat ? ir.last_item : cr.last_cat;
      return {
        totalProducts:       ir.total        as number ?? 0,
        availableProducts:   ir.avail        as number ?? 0,
        unavailableProducts: ir.unavail      as number ?? 0,
        featuredProducts:    ir.feat         as number ?? 0,
        activeCategories:    cr.active_cats  as number ?? 0,
        lastUpdated:         lastUpdated     as string ?? now(),
      };
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Provider selector
// ════════════════════════════════════════════════════════════════════════════

type CFContextFn = { getCloudflareContext: <T>() => { env: T } };

function tryGetD1(): D1Database | null {
  if (env.databaseProvider !== "d1") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@cloudflare/next-on-pages") as CFContextFn;
    const ctx = getCloudflareContext<CloudflareEnv>();
    return ctx.env.caffe54_menu_db;
  } catch {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[db] DATABASE_PROVIDER=d1 but CF context unavailable — using local JSON.");
    }
    return null;
  }
}

// Re-use a cached provider within the same request / module lifetime
let _provider: DbProvider | null = null;

export function getDbProvider(): DbProvider {
  if (_provider) return _provider;
  const d1 = tryGetD1();
  _provider = d1 ? createD1Provider(d1) : localProvider;
  return _provider;
}

/** Invalidate provider cache (useful after hot-reload or test setup) */
export function invalidateDbCache(): void {
  _provider = null;
  g._caffe54Db = null;
}
