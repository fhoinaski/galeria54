"use client";

import { BellRing } from "lucide-react";
import type { Language } from "@/types/menu";
import { translations } from "@/utils/translations";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onCallWaiter: () => void;
}

export function Header({ language, setLanguage, onCallWaiter }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#2F2F2F]/8">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* Logo + Mesa */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="font-serif text-[18px] leading-none text-olive-700">
            <span className="italic">Caffè</span>
            <span className="ml-1 not-italic font-semibold tracking-wide">54</span>
          </div>
          <span className="w-px h-3.5 bg-[#2F2F2F]/15" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] tracking-[0.15em] uppercase text-text-main/50 font-medium">
              {t.tableLabel}
            </span>
            <span className="text-[10px] tracking-[0.1em] font-semibold text-olive-700">12</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex items-center text-[11px] tracking-[0.12em] font-medium uppercase text-text-main/60 bg-[#2F2F2F]/5 rounded-full px-2 py-1 gap-0.5">
            {(["pt", "en", "es"] as Language[]).map((lang, i) => (
              <span key={lang} className="flex items-center gap-0.5">
                {i > 0 && <span className="opacity-30 text-[9px]">·</span>}
                <button
                  onClick={() => setLanguage(lang)}
                  className={`px-1 py-0.5 rounded transition-all ${
                    language === lang
                      ? "text-olive-700 font-bold"
                      : "hover:text-text-main/80"
                  }`}
                  aria-label={`Switch to ${lang.toUpperCase()}`}
                >
                  {lang.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          {/* Call waiter button */}
          <button
            onClick={onCallWaiter}
            className="flex items-center gap-1.5 bg-olive-700 hover:bg-olive-700/90 active:scale-95 text-warm-white rounded-full pl-3 pr-3.5 py-2 transition-all text-[11px] font-semibold tracking-wide whitespace-nowrap"
            aria-label={t.callWaiter}
          >
            <BellRing className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.callWaiter}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
