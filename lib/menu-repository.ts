import { getDbProvider } from "./db";
import { slugify } from "./slugify";
import type {
  Category,
  MenuItem,
  MenuData,
  AdminStats,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "@/types/menu";

function now(): string {
  return new Date().toISOString();
}

function shortId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function getCategories(): Promise<Category[]> {
  return getDbProvider().listCategories();
}

async function getActiveCategories(): Promise<Category[]> {
  const all = await getCategories();
  return all.filter(c => c.active);
}

async function getCategoryById(id: string): Promise<Category | null> {
  return getDbProvider().getCategory(id);
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const db = getDbProvider();
  const id = input.slug || slugify(input.name.pt);
  const existing = await db.getCategory(id);
  if (existing) throw new Error(`Category with slug "${id}" already exists.`);
  const category: Category = {
    ...input,
    id,
    slug: id,
    createdAt: now(),
    updatedAt: now(),
  };
  return db.createCategory(category);
}

async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const db = getDbProvider();
  const existing = await db.getCategory(id);
  if (!existing) throw new Error(`Category "${id}" not found.`);
  return db.updateCategory(id, input);
}

async function deleteCategory(id: string): Promise<void> {
  const db = getDbProvider();
  const hasItems = await db.categoryHasItems(id);
  if (hasItems) {
    throw new Error("Não é possível excluir uma categoria com produtos associados.");
  }
  await db.deleteCategory(id);
}

// ─── Menu items ───────────────────────────────────────────────────────────────

async function getMenuItems(): Promise<MenuItem[]> {
  return getDbProvider().listItems();
}

async function getMenuItemById(id: string): Promise<MenuItem | null> {
  return getDbProvider().getItem(id);
}

async function createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
  const id = `${slugify(input.name)}-${shortId()}`;
  const item: MenuItem = {
    ...input,
    id,
    createdAt: now(),
    updatedAt: now(),
  };
  return getDbProvider().createItem(item);
}

async function updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
  const existing = await getDbProvider().getItem(id);
  if (!existing) throw new Error(`Item "${id}" not found.`);
  return getDbProvider().updateItem(id, input);
}

async function deleteMenuItem(id: string): Promise<void> {
  return getDbProvider().deleteItem(id);
}

async function duplicateMenuItem(id: string): Promise<MenuItem> {
  const original = await getDbProvider().getItem(id);
  if (!original) throw new Error(`Item "${id}" not found.`);
  const newId = `${slugify(original.name)}-${shortId()}`;
  const copy: MenuItem = {
    ...original,
    id: newId,
    name: `${original.name} (cópia)`,
    available: false,
    featured: false,
    createdAt: now(),
    updatedAt: now(),
  };
  return getDbProvider().createItem(copy);
}

// ─── Aggregates ───────────────────────────────────────────────────────────────

async function getMenuData(): Promise<MenuData> {
  const { categories, items } = await getDbProvider().getMenuData();
  return { categories, items };
}

async function getMenuDataWithMeta(): Promise<MenuData & { updatedAt: string }> {
  return getDbProvider().getMenuData();
}

async function getAdminStats(): Promise<AdminStats> {
  return getDbProvider().getStats();
}

// ─── Exported repository ──────────────────────────────────────────────────────

export const menuRepository = {
  getMenuData,
  getMenuDataWithMeta,
  getCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  duplicateMenuItem,
  getAdminStats,
};
