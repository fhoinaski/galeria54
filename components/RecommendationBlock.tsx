import { Sparkles } from "lucide-react";
import Image from "next/image";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/utils/formatCurrency";

interface RecommendationBlockProps {
  language: Language;
  suggestions: MenuItem[];
  onProductClick: (item: MenuItem) => void;
}

export function RecommendationBlock({ language, suggestions, onProductClick }: RecommendationBlockProps) {
  if (!suggestions.length) return null;
  const t = translations[language];

  return (
    <div className="bg-olive-700 text-warm-white py-12 px-4 mt-8 rounded-3xl mx-4 sm:mx-auto max-w-7xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://picsum.photos/id/1059/1920/1080')] bg-cover bg-center" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2 text-gold">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-serif text-2xl font-bold">{t.notSure}</h3>
        </div>
        <p className="text-center text-warm-white/80 mb-8">{t.ourSuggestions}</p>

        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-4 px-2 snap-x">
          {suggestions.map(item => (
            <div 
              key={item.id} 
              onClick={() => onProductClick(item)}
              className="snap-start shrink-0 w-64 bg-warm-white/10 backdrop-blur border border-warm-white/20 rounded-2xl overflow-hidden p-3 cursor-pointer hover:bg-warm-white/20 transition-all"
            >
              {item.image && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                  <Image src={item.image} alt="" fill referrerPolicy="no-referrer" className="object-cover" />
                </div>
              )}
              <h4 className="font-serif font-medium line-clamp-1">{item.name[language]}</h4>
              <p className="text-sm text-gold mt-1">{formatCurrency(item.price, item.currency)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
