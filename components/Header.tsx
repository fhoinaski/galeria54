import { Globe } from "lucide-react";
import type { Language } from "@/types/menu";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  const isPt = language === 'pt';
  const isEn = language === 'en';
  const isEs = language === 'es';

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF3]/90 backdrop-blur-md border-b border-[#2F2F2F]/10">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-serif text-lg text-olive-700 leading-none">
            <span className="italic">Caffè</span>
            <span className="ml-1.5 not-italic tracking-wide">54</span>
          </div>
          <span className="w-px h-3 bg-[#2F2F2F]/20" />
          <span className="text-[10px] tracking-[0.16em] uppercase text-text-main/60 font-medium">
            Mesa 12
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-[10px] tracking-[0.14em] font-medium uppercase text-text-main">
            <button 
              onClick={() => setLanguage('pt')} 
              className={`p-1 transition-opacity ${isPt ? 'font-semibold opacity-100 text-olive-700' : 'opacity-40'}`}
            >
              PT
            </button>
            <span className="opacity-30">·</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`p-1 transition-opacity ${isEn ? 'font-semibold opacity-100 text-olive-700' : 'opacity-40'}`}
            >
              EN
            </button>
             <span className="opacity-30">·</span>
            <button 
              onClick={() => setLanguage('es')} 
              className={`p-1 transition-opacity ${isEs ? 'font-semibold opacity-100 text-olive-700' : 'opacity-40'}`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
