"use client";

import { useState } from "react";
import { X, BellRing, Heart, ImageOff } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Language, MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductModalProps {
  item: MenuItem | null;
  language: Language;
  onClose: () => void;
  onCallWaiter: () => void;
  allMenuItems: MenuItem[];
}

export function ProductModal({ item, language, onClose, onCallWaiter, allMenuItems }: ProductModalProps) {
  const [liked, setLiked] = useState(false);

  if (!item) return null;

  const t = translations[language];
  const isAvailable = item.available;

  const pairedItems = item.pairings
    ? allMenuItems.filter(m => item.pairings?.includes(m.id))
    : [];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={item.name[language]}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2F2F2F]/50 backdrop-blur-sm"
        />

        {/* Sheet / Modal */}
        <motion.div
          initial={{ y: "100%", opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-lg bg-warm-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
        >
          {/* Handle bar (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-[#2F2F2F]/15" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={t.closeModal}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[#2F2F2F]/8 hover:bg-[#2F2F2F]/14 text-text-main rounded-full transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            {/* Product image */}
            {item.image ? (
              <div className="relative w-full h-52 sm:h-64 bg-[#F1ECDC] shrink-0">
                <Image
                  src={item.image}
                  alt={item.name[language]}
                  fill
                  referrerPolicy="no-referrer"
                  className={`object-cover ${!isAvailable ? "grayscale" : ""}`}
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
                {!isAvailable && (
                  <div className="absolute inset-0 bg-[#2F2F2F]/40 flex items-center justify-center">
                    <span className="bg-white/95 text-[#2F2F2F] text-[11px] font-bold tracking-[0.12em] uppercase px-4 py-2 rounded-full shadow">
                      {t.unavailableShort}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-40 bg-[#F1ECDC] flex items-center justify-center shrink-0">
                <ImageOff className="w-8 h-8 text-[#2F2F2F]/20" />
              </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col gap-5">
              {/* Name + Price */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {item.badge && (
                    <span className="inline-block text-[10px] font-bold tracking-[0.12em] uppercase text-gold mb-1.5">
                      {item.badge}
                    </span>
                  )}
                  <h2 className="font-serif text-[26px] font-semibold text-text-main leading-tight">
                    {item.name[language]}
                  </h2>
                </div>
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span className="text-[11px] text-text-main/50 tracking-[0.08em]">R$</span>
                  <span className="font-serif text-[28px] font-semibold text-olive-700 leading-none">
                    {formatCurrency(item.price, item.currency).replace("R$", "").trim()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-main/75 text-[14px] leading-[1.7]">
                {item.description[language]}
              </p>

              {/* Tags + Allergens */}
              {(item.tags?.length || item.allergens?.length) ? (
                <div>
                  <SectionLabel label={t.ingredientsAndDetails} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-[#F1ECDC] text-text-main rounded-full text-[11.5px] font-medium border border-text-main/6">
                        {tag}
                      </span>
                    ))}
                    {item.allergens?.map(allergen => (
                      <span key={allergen} className="px-3 py-1.5 bg-orange-50 text-orange-800 rounded-full text-[11.5px] font-medium border border-orange-200/60">
                        ⚠ {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Pairings */}
              {pairedItems.length > 0 && (
                <div>
                  <SectionLabel label={t.pairings} />
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 mt-3 -mx-1 px-1 snap-x">
                    {pairedItems.map(paired => (
                      <PairingCard key={paired.id} item={paired} language={language} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 pt-1 pb-2">
                <button
                  onClick={() => setLiked(prev => !prev)}
                  className={`
                    flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-[14px] tracking-wide transition-all
                    ${liked
                      ? "bg-olive-700 text-warm-white"
                      : "bg-olive-700 text-warm-white hover:bg-olive-700/90 active:scale-[0.98]"
                    }
                  `}
                  aria-pressed={liked}
                >
                  <Heart className={`w-4 h-4 transition-all ${liked ? "fill-warm-white scale-110" : ""}`} />
                  {liked ? `${t.liked} ✓` : t.liked}
                </button>

                <button
                  onClick={() => { onCallWaiter(); onClose(); }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-[14px] tracking-wide border-2 border-olive-700 text-olive-700 hover:bg-olive-700/5 active:scale-[0.98] transition-all"
                >
                  <BellRing className="w-4 h-4" />
                  {t.callWaiter}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-px bg-gold" />
      <span className="text-[10px] tracking-[0.26em] uppercase text-gold font-semibold">
        {label}
      </span>
    </div>
  );
}

function PairingCard({ item, language }: { item: MenuItem; language: Language }) {
  return (
    <div className="snap-start shrink-0 w-[120px] rounded-xl bg-white border border-[#2F2F2F]/8 overflow-hidden flex flex-col">
      {item.image ? (
        <div className="relative w-full h-[72px] bg-[#F1ECDC] overflow-hidden">
          <Image
            src={item.image}
            alt=""
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="120px"
          />
        </div>
      ) : (
        <div className="w-full h-[72px] bg-[#F1ECDC] flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-[#2F2F2F]/20" />
        </div>
      )}
      <div className="p-2.5">
        <h5 className="font-serif font-semibold text-[13px] leading-tight text-text-main line-clamp-2">
          {item.name[language]}
        </h5>
        <p className="text-[11px] font-serif italic text-olive-700 mt-1">
          {formatCurrency(item.price, item.currency)}
        </p>
      </div>
    </div>
  );
}
