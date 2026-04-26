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

          <div className="overflow-y-auto overflow-x-hidden p-6 sm:p-8 pt-10">
            {item.image && (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-cream shadow-inner">
                <Image
                  src={item.image}
                  alt={item.name[language]}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-start gap-4 mb-2">
              <h2 className="font-serif text-2xl font-semibold text-text-main leading-tight">
                {item.name[language]}
              </h2>
              <span className="font-medium text-xl text-olive-700 whitespace-nowrap">
                {formatCurrency(item.price, item.currency)}
              </span>
            </div>
            
            {!isAvailable && (
              <span className="inline-block mt-1 mb-4 text-xs font-semibold text-red-800 bg-red-100 px-3 py-1 rounded-full">
                {t.unavailable}
              </span>
            )}

            <p className="text-text-main/80 text-base leading-relaxed mb-6">
              {item.description[language]}
            </p>

            {/* Tags / Allergens */}
            {(item.tags?.length || item.allergens?.length) ? (
              <div className="mb-8">
                <h4 className="text-xs uppercase tracking-wider text-olive-500 font-semibold mb-3">
                  {t.ingredientsAndDetails}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-olive-700/5 text-olive-700 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-olive-700/10">
                      <Leaf className="w-3.5 h-3.5" /> {tag}
                    </span>
                  ))}
                  {item.allergens?.map(allergen => (
                    <span key={allergen} className="px-3 py-1.5 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium border border-orange-200/50">
                      Cuidado: {allergen}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Pairings */}
            {pairedItems.length > 0 && (
              <div className="mt-8 pt-6 border-t border-beige/40">
                <h4 className="text-xs uppercase tracking-wider text-olive-500 font-semibold mb-4">
                  {t.pairings}
                </h4>
                <div className="space-y-3">
                  {pairedItems.map(pairedItem => (
                    <div key={pairedItem.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-beige/50">
                       {pairedItem.image && (
                         <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                           <Image src={pairedItem.image} alt="" fill referrerPolicy="no-referrer" className="object-cover" />
                         </div>
                       )}
                       <div>
                         <h5 className="font-medium text-sm text-text-main">{pairedItem.name[language]}</h5>
                         <p className="text-xs text-text-main/60">{formatCurrency(pairedItem.price, pairedItem.currency)}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
