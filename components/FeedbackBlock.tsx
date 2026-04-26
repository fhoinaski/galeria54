import { useState } from "react";
import { Star } from "lucide-react";
import type { Language } from "@/types/menu";
import { translations } from "@/utils/translations";

export function FeedbackBlock({ language }: { language: Language }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const t = translations[language];

  if (submitted) {
    return (
      <div className="bg-cream border border-beige rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
        <div className="w-12 h-12 bg-olive-700/10 text-olive-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 fill-olive-700" />
        </div>
        <h3 className="font-serif text-xl text-olive-700 font-bold mb-2">{t.feedbackThanks}</h3>
      </div>
    );
  }

  return (
    <div className="bg-cream/50 border border-beige/40 rounded-3xl p-8 max-w-lg mx-auto my-12 text-center">
      <h3 className="font-serif text-2xl font-bold text-olive-700 mb-2">{t.feedbackTitle}</h3>
      <p className="text-sm text-text-main/70 mb-6">{t.feedbackSubtitle}</p>
      
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-gold text-gold"
                  : "text-beige"
              }`}
            />
          </button>
        ))}
      </div>

      <button 
        disabled={rating === 0}
        onClick={() => setSubmitted(true)}
        className="bg-olive-700 text-warm-white px-8 py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-olive-700/90 active:scale-95"
      >
        {t.feedbackSubmit}
      </button>
    </div>
  );
}
