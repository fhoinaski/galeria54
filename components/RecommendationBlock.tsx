"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ImageOff } from "lucide-react";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/lib/currency";

interface RecommendationBlockProps {
  language: Language;
  allItems: MenuItem[];
  suggestions: MenuItem[];
  onProductClick: (item: MenuItem) => void;
}

type GuidedKey = "guided1" | "guided2" | "guided3" | "guided4" | "guided5" | "guided6";

function getGuidedItems(key: GuidedKey, allItems: MenuItem[]): MenuItem[] {
  switch (key) {
    case "guided1":
      return allItems.filter(i => i.available && i.categoryId === "doces").slice(0, 4);
    case "guided2":
      return allItems.filter(i => i.available && (
        i.tags?.includes("Vegetariano") || i.tags?.includes("Sem glúten") || i.tags?.includes("Leve")
      )).slice(0, 4);
    case "guided3":
      return allItems.filter(i => i.available && (
        i.categoryId === "cafes-quentes" || i.categoryId === "cafes-gelados"
      ) && i.featured).slice(0, 4);
    case "guided4":
      return allItems.filter(i => i.available && i.categoryId === "breakfast").slice(0, 4);
    case "guided5":
      return allItems.filter(i => i.available && i.price <= 4000).slice(0, 6);
    case "guided6":
      return allItems.filter(i => i.available && i.featured).slice(0, 4);
    default:
      return [];
  }
}

const GUIDED_KEYS: GuidedKey[] = ["guided1", "guided2", "guided3", "guided4", "guided5", "guided6"];

export function RecommendationBlock({ language, allItems, suggestions, onProductClick }: RecommendationBlockProps) {
  const [activeGuided, setActiveGuided] = useState<GuidedKey | null>(null);
  const t = translations[language];

  const guidedItems = activeGuided ? getGuidedItems(activeGuided, allItems) : suggestions;

  function handleGuided(key: GuidedKey) {
    setActiveGuided(prev => prev === key ? null : key);
  }

  return (
    <div className="py-16 px-4 mt-4 space-y-16">
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 text-gold">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] tracking-[0.28em] uppercase font-semibold">
              {t.guidedTitle}
            </span>
          </div>
          <p className="text-text-main/60 text-sm">{t.guidedSubtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center mb-6">
          {GUIDED_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleGuided(key)}
              className={`
                px-5 py-3 rounded-full text-[13px] font-medium transition-all border
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500/50
                ${activeGuided === key
                  ? "bg-olive-700 text-warm-white border-olive-700 shadow-sm"
                  : "bg-white border-[#2F2F2F]/12 text-text-main hover:border-olive-500/40 hover:bg-olive-500/5"
                }
              `}
            >
              {t[key]}
            </button>
          ))}
        </div>

        {activeGuided && (
          <div className="bg-cream border border-beige rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-[13.5px] text-text-main/80 leading-relaxed italic font-serif">
              &ldquo;{(t as Record<string, string>)[`${activeGuided}Msg`]}&rdquo;
            </p>
          </div>
        )}

        {guidedItems.length > 0 && (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory -mx-1 px-1">
            {guidedItems.map(item => (
              <SuggestionCard
                key={item.id}
                item={item}
                language={language}
                t={t}
                onClick={() => onProductClick(item)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SuggestionCard({
  item,
  language,
  t,
  onClick,
}: {
  item: MenuItem;
  language: Language;
  t: Record<string, string>;
  onClick: () => void;
}) {
  const badge = item.badge?.[language];
  return (
    <article
      onClick={onClick}
      className="snap-start shrink-0 w-52 cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#2F2F2F]/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
      aria-label={item.name}
    >
      {item.imageUrl ? (
        <div className="relative w-full h-32 bg-[#F1ECDC] overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="208px"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-[#F1ECDC] flex items-center justify-center">
          <ImageOff className="w-6 h-6 text-[#2F2F2F]/20" />
        </div>
      )}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h4 className="font-serif font-semibold text-[14px] leading-tight text-text-main line-clamp-1">
          {item.name}
        </h4>
        {badge && (
          <span className="text-[10px] text-gold font-semibold tracking-wide">{badge}</span>
        )}
        <p className="font-serif text-[13px] text-olive-700 font-medium mt-auto pt-1">
          {formatCurrency(item.price)}
        </p>
      </div>
    </article>
  );
}
