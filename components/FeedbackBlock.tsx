"use client";

import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import type { Language } from "@/types/menu";
import { translations } from "@/utils/translations";

type FeedbackCategory = "atendimento" | "tempo" | "sabor" | "ambiente" | "cardapio";

const CATEGORIES: FeedbackCategory[] = ["atendimento", "tempo", "sabor", "ambiente", "cardapio"];

export function FeedbackBlock({ language }: { language: Language }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState<FeedbackCategory[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = translations[language];

  function toggleCategory(cat: FeedbackCategory) {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  if (submitted) {
    return (
      <section className="max-w-lg mx-auto my-16 px-4">
        <div className="bg-olive-700/6 border border-olive-500/20 rounded-3xl p-10 text-center">
          <CheckCircle className="w-10 h-10 text-olive-700 mx-auto mb-4" />
          <h3 className="font-serif text-[22px] text-olive-700 font-bold">{t.feedbackThanks}</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-lg mx-auto my-16 px-4">
      <div className="bg-cream/50 border border-beige/50 rounded-3xl p-7 sm:p-9">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="font-serif text-[24px] font-bold text-olive-700">{t.feedbackTitle}</h3>
          <p className="text-sm text-text-main/60 mt-1">{t.feedbackSubtitle}</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1.5 mb-7" role="radiogroup" aria-label="Avaliação">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-full"
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  star <= (hovered || rating) ? "fill-gold text-gold" : "text-beige"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CATEGORIES.map(cat => {
            const isSelected = selected.includes(cat);
            const label = t[`feedbackCat_${cat}`] ?? cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-[12.5px] font-medium border transition-all
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500/50
                  ${isSelected
                    ? "bg-olive-700 text-warm-white border-olive-700"
                    : "bg-white text-text-main/70 border-[#2F2F2F]/12 hover:border-olive-500/30"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={t.feedbackComment}
          rows={3}
          className="w-full bg-white border border-[#2F2F2F]/10 text-text-main rounded-xl p-3.5 resize-none focus:outline-none focus:ring-2 focus:ring-olive-500/30 transition-all placeholder:text-text-main/40 text-[13px] mb-5"
        />

        <button
          disabled={rating === 0}
          onClick={() => setSubmitted(true)}
          className="w-full bg-olive-700 text-warm-white py-3.5 rounded-full font-semibold text-[14px] tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-olive-700/90 active:scale-[0.98]"
        >
          {t.feedbackSubmit}
        </button>
      </div>
    </section>
  );
}
