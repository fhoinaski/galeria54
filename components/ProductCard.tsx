import Image from "next/image";
import { ArrowRight, ImageOff } from "lucide-react";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  item: MenuItem;
  language: Language;
  onClick: () => void;
}

const BADGE_STYLES: Record<string, string> = {
  "Especial da casa": "bg-gold/15 text-[#7A6030] border-gold/25",
  "Mais pedido":      "bg-[#E8DDCB] text-coffee border-[#C4B49A]/40",
  "Premium":          "bg-coffee/10 text-coffee border-coffee/20",
  "Combina com café": "bg-olive-500/10 text-olive-700 border-olive-500/20",
  "Leve":             "bg-green-50 text-green-800 border-green-200/60",
  "Refrescante":      "bg-sky-50 text-sky-800 border-sky-200/60",
  "Especial":         "bg-gold/15 text-[#7A6030] border-gold/25",
};

function BadgeChip({ badge }: { badge: string }) {
  const style = BADGE_STYLES[badge] ?? "bg-beige text-coffee border-beige";
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border ${style}`}>
      {badge}
    </span>
  );
}

export function ProductCard({ item, language, onClick }: ProductCardProps) {
  const t = translations[language];
  const isAvailable = item.available;

  return (
    <article
      onClick={isAvailable ? onClick : undefined}
      className={`
        group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#2F2F2F]/8
        shadow-sm hover:shadow-md transition-all duration-300
        ${isAvailable ? "cursor-pointer hover:-translate-y-0.5" : "opacity-75 cursor-default"}
      `}
      aria-label={item.name[language]}
    >
      {/* Image area */}
      <div className="relative w-full aspect-[4/3] bg-[#F1ECDC] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name[language]}
            fill
            referrerPolicy="no-referrer"
            className={`object-cover transition-transform duration-500 ${
              isAvailable ? "group-hover:scale-105" : "grayscale"
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-[#2F2F2F]/20" />
          </div>
        )}

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-[#2F2F2F]/50 flex items-center justify-center">
            <span className="bg-white/95 text-[#2F2F2F] text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full shadow-sm">
              {t.unavailableShort}
            </span>
          </div>
        )}

        {/* Badge overlay */}
        {item.badge && isAvailable && (
          <div className="absolute top-2.5 left-2.5">
            <BadgeChip badge={item.badge} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-serif text-[17px] font-semibold text-text-main leading-tight line-clamp-1 group-hover:text-olive-700 transition-colors">
          {item.name[language]}
        </h3>

        <p className="text-[12.5px] text-text-main/65 leading-[1.5] line-clamp-2 flex-1">
          {item.description[language]}
        </p>

        {/* Price + Action */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-[#2F2F2F]/6">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] text-text-main/50 tracking-[0.08em] font-medium">R$</span>
            <span className="font-serif text-[22px] font-semibold text-olive-700 leading-none">
              {formatCurrency(item.price, item.currency).replace("R$", "").trim()}
            </span>
          </div>

          {isAvailable && (
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex items-center gap-1 text-[11.5px] font-semibold text-olive-700 hover:text-olive-700/80 transition-colors"
              aria-label={`${t.viewDetails}: ${item.name[language]}`}
            >
              {t.viewDetails}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
