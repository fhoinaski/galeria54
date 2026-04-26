export type Language = "pt" | "en" | "es";

export type LocalizedText = Record<Language, string>;

// ─── Domain types ─────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  imageUrl?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  /** Product name — same in all languages (Italian/universal names) */
  name: string;
  description: LocalizedText;
  /** Price stored in centavos (e.g. 4600 = R$ 46,00) */
  price: number;
  imageUrl?: string;
  badge?: LocalizedText;
  featured: boolean;
  available: boolean;
  tags: string[];
  allergens: string[];
  /** IDs of related/paired items */
  pairings: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type MenuData = {
  categories: Category[];
  items: MenuItem[];
};

// ─── Admin input types ────────────────────────────────────────────────────────

export type CreateCategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt">;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CreateMenuItemInput = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;
export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

// ─── Admin stats ──────────────────────────────────────────────────────────────

export type AdminStats = {
  totalProducts: number;
  availableProducts: number;
  unavailableProducts: number;
  activeCategories: number;
  featuredProducts: number;
  lastUpdated: string;
};
