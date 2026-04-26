import { db } from "./db";
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
  const data = await db.read();
  return [...data.categories].sort((a, b) => a.order - b.order);
}

async function getActiveCategories(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter(c => c.active);
}

async function getCategoryById(id: string): Promise<Category | null> {
  const data = await db.read();
  return data.categories.find(c => c.id === id) ?? null;
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const data = await db.read();
  const id = input.slug || slugify(input.name.pt);
  if (data.categories.some(c => c.id === id)) {
    throw new Error(`Category with slug "${id}" already exists.`);
  }
  const category: Category = {
    ...input,
    id,
    slug: id,
    createdAt: now(),
    updatedAt: now(),
  };
  data.categories.push(category);
  await db.write(data);
  return category;
}

async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const data = await db.read();
  const idx = data.categories.findIndex(c => c.id === id);
  if (idx === -1) throw new Error(`Category "${id}" not found.`);
  const updated: Category = {
    ...data.categories[idx],
    ...input,
    id,
    updatedAt: now(),
  };
  data.categories[idx] = updated;
  await db.write(data);
  return updated;
}

async function deleteCategory(id: string): Promise<void> {
  const data = await db.read();
  const hasItems = data.items.some(i => i.categoryId === id);
  if (hasItems) {
    throw new Error("Não é possível excluir uma categoria com produtos associados.");
  }
  data.categories = data.categories.filter(c => c.id !== id);
  await db.write(data);
}

// ─── Menu items ───────────────────────────────────────────────────────────────

async function getMenuItems(): Promise<MenuItem[]> {
  const data = await db.read();
  return [...data.items].sort((a, b) => {
    if (a.categoryId !== b.categoryId) return 0;
    return a.order - b.order;
  });
}

async function getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const items = await getMenuItems();
  return items.filter(i => i.categoryId === categoryId);
}

async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const data = await db.read();
  return data.items.find(i => i.id === id) ?? null;
}

async function createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
  const data = await db.read();
  const id = `${slugify(input.name)}-${shortId()}`;
  const item: MenuItem = {
    ...input,
    id,
    createdAt: now(),
    updatedAt: now(),
  };
  data.items.push(item);
  await db.write(data);
  return item;
}

async function updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
  const data = await db.read();
  const idx = data.items.findIndex(i => i.id === id);
  if (idx === -1) throw new Error(`Item "${id}" not found.`);
  const updated: MenuItem = {
    ...data.items[idx],
    ...input,
    id,
    updatedAt: now(),
  };
  data.items[idx] = updated;
  await db.write(data);
  return updated;
}

async function deleteMenuItem(id: string): Promise<void> {
  const data = await db.read();
  data.items = data.items.filter(i => i.id !== id);
  // Remove from pairings of other items
  data.items = data.items.map(i => ({
    ...i,
    pairings: i.pairings.filter(p => p !== id),
  }));
  await db.write(data);
}

async function duplicateMenuItem(id: string): Promise<MenuItem> {
  const data = await db.read();
  const original = data.items.find(i => i.id === id);
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
  data.items.push(copy);
  await db.write(data);
  return copy;
}

// ─── Aggregates ───────────────────────────────────────────────────────────────

async function getMenuData(): Promise<MenuData> {
  const data = await db.read();
  return {
    categories: [...data.categories].sort((a, b) => a.order - b.order),
    items: [...data.items].sort((a, b) => a.order - b.order),
  };
}

async function getAdminStats(): Promise<AdminStats> {
  const data = await db.read();
  return {
    totalProducts: data.items.length,
    availableProducts: data.items.filter(i => i.available).length,
    unavailableProducts: data.items.filter(i => !i.available).length,
    activeCategories: data.categories.filter(c => c.active).length,
    featuredProducts: data.items.filter(i => i.featured).length,
    lastUpdated: data.meta.updatedAt,
  };
}

// ─── Exported repository ──────────────────────────────────────────────────────

export const menuRepository = {
  getMenuData,
  getCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getItemsByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  duplicateMenuItem,
  getAdminStats,
};
