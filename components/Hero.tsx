"use client";

import Image from "next/image";
import { Search, ChevronDown, Star } from "lucide-react";
import { translations } from "@/utils/translations";
import type { Language } from "@/types/menu";

interface HeroProps {
  language: Language;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const taglines: Record<Language, { line1: string; line2: string }> = {
  pt: { line1: "Alma europeia.", line2: "Coração praiano." },
  en: { line1: "European soul.", line2: "Coastal heart." },
  es: { line1: "Alma europea.", line2: "Corazón costero." },
};

const subtitles: Record<Language, string> = {
  pt: "Escolha sua experiência no Caffè 54.",
  en: "Choose your experience at Caffè 54.",
  es: "Elige tu experiencia en el Caffè 54.",
};

export function Hero({ language, searchTerm, setSearchTerm }: HeroProps) {
  const t = translations[language];
  const { line1, line2 } = taglines[language];

  function scrollToMenu() {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToChoices() {
    document.getElementById("escolhas-da-casa")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-[72vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/caffe54food/1920/1080"
          alt="Caffè 54"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay — dark at top (for header legibility), rich at center */}
        <div className="absolute inset-0 bg-gradient-to-b from-coffee/70 via-coffee/55 to-[#3F4F36]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 pt-8 pb-12 flex flex-col items-center text-center gap-6">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 bg-warm-white/10 border border-warm-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="text-[10px] tracking-[0.28em] uppercase text-warm-white/80 font-semibold">
            Florianópolis
          </span>
          <Star className="w-3 h-3 text-gold fill-gold" />
        </div>

        {/* Tagline */}
        <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[64px] leading-[1.0] font-medium text-warm-white tracking-tight">
          <span className="block">{line1}</span>
          <span className="block italic text-gold">{line2}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-warm-white/70 text-base sm:text-lg max-w-sm leading-relaxed">
          {subtitles[language]}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            onClick={scrollToMenu}
            className="flex items-center justify-center gap-2 bg-olive-700 hover:bg-olive-700/90 active:scale-[0.98] text-warm-white font-semibold px-7 py-3.5 rounded-full transition-all text-[14px] tracking-wide shadow-lg shadow-olive-700/30"
          >
            {t.viewMenu}
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={scrollToChoices}
            className="flex items-center justify-center gap-2 bg-warm-white/10 hover:bg-warm-white/20 active:scale-[0.98] border border-warm-white/30 text-warm-white font-medium px-7 py-3.5 rounded-full transition-all text-[14px] tracking-wide backdrop-blur-sm"
          >
            {t.morePedidos}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md mt-2">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-main/50" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-warm-white/95 backdrop-blur border-0 text-text-main rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all placeholder:text-text-main/45 text-[13.5px] shadow-lg"
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FCFAF3] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
