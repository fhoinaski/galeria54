import Image from "next/image";
import { ArrowRight, ImageOff } from "lucide-react";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/lib/currency";

interface FeaturedSectionProps {
  items: MenuItem[];
  language: Language;
  onProductClick: (item: MenuItem) => void;
}

const BADGE_ACCENT: Record<string, string> = {
  "Especial da casa": "text-gold border-gold/40",
  "Mais pedido":      "text-[#C4B49A] border-[#C4B49A]/40",
  "Especial":         "text-gold border-gold/40",
};

export function FeaturedSection({ items, language, onProductClick }: FeaturedSectionProps) {
  const t = translations[language];

  if (!items.length) return null;

  return (
    <section id="escolhas-da-casa" className="py-12 px-4 bg-olive-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">
            · {t.choicesTitle} ·
          </span>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-medium text-warm-white mt-2 leading-tight">
            {t.choicesSubtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              language={language}
              t={t}
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
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
  const badgeStyle = badge ? (BADGE_ACCENT[badge] ?? "text-warm-white/60 border-warm-white/30") : "";

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white/8 border border-warm-white/15 hover:bg-white/14 transition-all duration-300"
      aria-label={item.name}
    >
      <div className="relative w-full aspect-[4/3] bg-olive-700/50 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            referrerPolicy="no-referrer"
            className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-warm-white/20" />
          </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border bg-olive-700/80 backdrop-blur-sm ${badgeStyle}`}>
              {badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-[18px] font-semibold text-warm-white leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-[12.5px] text-warm-white/60 leading-relaxed line-clamp-2 flex-1">
          {item.description[language]}
        </p>
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-warm-white/10">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] text-warm-white/40 tracking-[0.08em]">R$</span>
            <span className="font-serif text-[22px] font-semibold text-gold leading-none">
              {formatCurrency(item.price).replace("R$", "").replace(/ /, "").trim()}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1 text-[11.5px] font-semibold text-gold hover:text-gold/80 transition-colors"
            aria-label={`${t.viewDetails}: ${item.name}`}
          >
            {t.viewDetails}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
