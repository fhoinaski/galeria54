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
    <div className="sticky top-14 z-30 bg-[#FCFAF3]/97 backdrop-blur-sm border-b border-[#2F2F2F]/6 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
        >
          <Tab
            label={t.allCategories}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => (
            <Tab
              key={cat.id}
              label={cat.name}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`
        whitespace-nowrap px-4 py-2 rounded-full text-[12.5px] font-medium tracking-wide transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500/50
        ${active
          ? "bg-olive-700 text-warm-white shadow-sm shadow-olive-700/20"
          : "bg-transparent text-text-main/70 border border-text-main/12 hover:bg-olive-500/8 hover:text-text-main"
        }
      `}
    >
      {label}
    </button>
  );
}
