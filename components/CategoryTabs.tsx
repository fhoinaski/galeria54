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
    <div className="sticky top-[52px] z-30 bg-[#FCFAF3]/95 backdrop-blur py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[12.5px] tracking-wide transition-all ${
              activeCategory === null
                ? "bg-olive-500 text-warm-white font-semibold shadow-sm shadow-olive-700/10"
                : "bg-transparent text-text-main border border-text-main/10 font-medium hover:bg-olive-500/5"
            }`}
          >
            {t.allCategories}
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[12.5px] tracking-wide transition-all ${
                activeCategory === cat.id
                  ? "bg-olive-500 text-warm-white font-semibold shadow-sm shadow-olive-700/10"
                  : "bg-transparent text-text-main border border-text-main/10 font-medium hover:bg-olive-500/5"
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
