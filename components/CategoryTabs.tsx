import type { Language } from "@/types/menu";
import { translations } from "@/utils/translations";

interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
  language: Language;
}

export function CategoryTabs({ categories, activeCategory, setActiveCategory, language }: CategoryTabsProps) {
  const t = translations[language];

  return (
    <div className="sticky top-16 z-30 bg-warm-white border-b border-beige/40 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-olive-700 text-warm-white shadow-md shadow-olive-700/20"
                : "bg-cream text-olive-700 hover:bg-beige"
            }`}
          >
            {t.allCategories}
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-olive-700 text-warm-white shadow-md shadow-olive-700/20"
                  : "bg-cream text-olive-700 hover:bg-beige"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
