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
      className={`group flex gap-4 py-4 border-b border-[#2F2F2F]/10 cursor-pointer transition-opacity ${!isAvailable ? 'opacity-60' : ''}`}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-baseline gap-2 mb-1">
            <h3 className="font-serif text-[19px] font-semibold text-text-main leading-tight line-clamp-1 group-hover:text-olive-700 transition-colors flex-1">
              {item.name[language]}
            </h3>
            <div className="flex items-baseline gap-1 shrink-0">
               <span className="text-[9px] text-text-main/60 tracking-[0.1em]">R$</span>
               <span className="font-serif text-[20px] font-medium text-olive-700">
                 {formatCurrency(item.price, item.currency).replace('R$', '').trim()}
               </span>
            </div>
          </div>
          <p className="text-[12.5px] text-text-main/70 line-clamp-2 mt-1 leading-[1.5]">
            {item.description[language]}
          </p>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
           {item.featured && (
              <span className="inline-flex items-center text-[9px] uppercase tracking-[0.14em] bg-gold/10 text-gold-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                {t.featured}
              </span>
            )}
          {!isAvailable && (
            <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-red-800 bg-red-100 px-2 py-1 rounded-full">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>

      {item.image && (
        <div className="relative w-24 h-24 shrink-0 rounded-[10px] overflow-hidden bg-[#F1ECDC]">
          <Image
            src={item.image}
            alt={item.name[language]}
            fill
            referrerPolicy="no-referrer"
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!isAvailable ? 'grayscale opacity-75' : ''}`}
            sizes="96px"
          />
        </div>
      )}
    </div>
  );
}
