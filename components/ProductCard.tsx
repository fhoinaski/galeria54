import { Star } from "lucide-react";
import Image from "next/image";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  item: MenuItem;
  language: Language;
  onClick: () => void;
}

export function ProductCard({ item, language, onClick }: ProductCardProps) {
  const t = translations[language];
  const isAvailable = item.available;

  return (
    <div 
      onClick={onClick}
      className={`group flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer bg-white border border-beige/30 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] hover:border-gold/30 ${!isAvailable ? 'opacity-50 grayscale-[50%]' : ''}`}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-lg font-medium text-text-main line-clamp-1 group-hover:text-olive-700 transition-colors">
              {item.name[language]}
            </h3>
            {item.featured && (
              <span className="inline-flex items-center text-[10px] uppercase tracking-wider bg-gold/10 text-gold-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                <Star className="w-3 h-3 mr-1 fill-gold text-gold" /> {t.featured}
              </span>
            )}
          </div>
          <p className="text-sm text-text-main/70 line-clamp-2 mt-1 leading-relaxed">
            {item.description[language]}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium text-olive-700">
            {formatCurrency(item.price, item.currency)}
          </span>
          {!isAvailable && (
            <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-1 rounded-full">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>

      {item.image && (
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-cream">
          <Image
            src={item.image}
            alt={item.name[language]}
            fill
            referrerPolicy="no-referrer"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>
      )}
    </div>
  );
}
