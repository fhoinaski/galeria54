import { X, WheatOff, Milk, Leaf } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductModalProps {
  item: MenuItem | null;
  language: Language;
  onClose: () => void;
  allMenuItems: MenuItem[];
}

export function ProductModal({ item, language, onClose, allMenuItems }: ProductModalProps) {
  if (!item) return null;
  
  const t = translations[language];
  const isAvailable = item.available;

  const pairedItems = item.pairings
    ? allMenuItems.filter(m => item.pairings?.includes(m.id))
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-text-main/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-warm-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-warm-white/80 hover:bg-warm-white text-olive-700 rounded-full shadow-sm backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto overflow-x-hidden p-6 sm:p-8 pt-8">
            {item.image && (
              <div className="relative w-full h-56 rounded-[14px] overflow-hidden mb-6 bg-[#F1ECDC] shadow-inner">
                <Image
                  src={item.image}
                  alt={item.name[language]}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-baseline gap-4 mb-2">
              <h2 className="font-serif text-[28px] font-semibold text-text-main leading-tight flex-1">
                {item.name[language]}
              </h2>
              <div className="flex items-baseline gap-1 shrink-0">
                 <span className="text-[12px] text-text-main/60 tracking-[0.1em]">R$</span>
                 <span className="font-serif text-[26px] font-medium text-olive-700">
                   {formatCurrency(item.price, item.currency).replace('R$', '').trim()}
                 </span>
              </div>
            </div>
            
            {!isAvailable && (
              <span className="inline-block mt-1 mb-4 text-[10px] tracking-[0.14em] uppercase font-semibold text-red-800 bg-red-100 px-3 py-1.5 rounded-full">
                {t.unavailable}
              </span>
            )}

            <p className="text-text-main/80 text-[14px] leading-[1.6] mb-8">
              {item.description[language]}
            </p>

            {/* Tags / Allergens */}
            {(item.tags?.length || item.allergens?.length) ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-px bg-gold" />
                  <span className="text-[10px] tracking-[0.28em] uppercase text-gold font-semibold">
                    {t.ingredientsAndDetails}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-[#F1ECDC] text-text-main rounded-full text-[11px] font-medium border border-text-main/5">
                      {tag}
                    </span>
                  ))}
                  {item.allergens?.map(allergen => (
                    <span key={allergen} className="px-3 py-1.5 bg-orange-50 text-orange-800 rounded-full text-[11px] font-medium border border-orange-200/50">
                      Cuidado: {allergen}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Pairings */}
            {pairedItems.length > 0 && (
              <div className="mt-8 pt-6 border-t border-text-main/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-px bg-gold" />
                  <span className="text-[10px] tracking-[0.28em] uppercase text-gold font-semibold">
                    {t.pairings}
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {pairedItems.map(pairedItem => (
                    <div key={pairedItem.id} className="w-[130px] shrink-0 rounded-[12px] bg-white border border-text-main/10 overflow-hidden flex flex-col">
                       {pairedItem.image && (
                         <div className="relative w-full h-[78px] bg-[#F1ECDC] overflow-hidden shrink-0">
                           <Image src={pairedItem.image} alt="" fill referrerPolicy="no-referrer" className="object-cover" sizes="130px" />
                         </div>
                       )}
                       <div className="p-3">
                         <h5 className="font-serif font-semibold text-[14px] leading-[1.15] text-text-main mb-1 line-clamp-2">{pairedItem.name[language]}</h5>
                         <p className="text-[12px] font-serif italic text-olive-700">{formatCurrency(pairedItem.price, pairedItem.currency)}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <button 
                onClick={onClose}
                className="w-full bg-olive-700 text-[#FBF6E9] py-3.5 rounded-xl font-medium tracking-[0.1em] text-[13px] uppercase"
              >
                Gostei desse
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
