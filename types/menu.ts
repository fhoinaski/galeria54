export type Language = "pt" | "en" | "es";

export type TranslatedString = Record<Language, string>;

export type MenuCategory = {
  id: string;
  name: TranslatedString;
  description?: TranslatedString;
  items: MenuItem[];
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: TranslatedString;
  description: TranslatedString;
  price: number;
  currency: "BRL";
  image?: string;
  badge?: string;
  tags?: string[];
  featured?: boolean;
  available: boolean;
  allergens?: string[];
  pairings?: string[];
};
