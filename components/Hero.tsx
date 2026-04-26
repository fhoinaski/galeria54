import { Search } from "lucide-react";
import { translations } from "@/utils/translations";
import type { Language } from "@/types/menu";

interface HeroProps {
  language: Language;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function Hero({ language, searchTerm, setSearchTerm }: HeroProps) {
  const t = translations[language];

  const tagline = language === 'pt' ? 'Alma europeia e coração praiano.' 
                : language === 'en' ? 'European soul, coastal heart.' 
                : 'Alma europea, corazón de playa.';

  const splitTagline = tagline.split(' e ');

  return (
    <div className="relative pt-12 pb-6 px-4 flex flex-col items-center">
      <div className="relative z-10 w-full max-w-xl text-center space-y-6">
        <div className="text-center mb-2">
          <span className="text-[9px] tracking-[0.32em] uppercase text-gold font-semibold">
            · Florianópolis ·
          </span>
        </div>
        
        <h2 className="font-serif text-4xl md:text-5xl text-text-main font-medium leading-[1.05] tracking-tight">
          {splitTagline.map((part, index) => (
             <span key={index}>
               {index > 0 && <span className="italic text-olive-500"> e </span>}
               {part}
             </span>
          ))}
        </h2>
        
        <p className="text-sm leading-relaxed text-text-main/70 text-center max-w-xs mx-auto text-pretty">
          {language === 'pt' ? 'Escolha sua experiência e descubra sabores preparados para bons momentos.'
          : language === 'en' ? 'Choose your experience and discover flavors crafted for good moments.'
          : 'Elige tu experiencia y descubre sabores preparados para buenos momentos.'}
        </p>

        <div className="relative group max-w-md mx-auto mt-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-main/40" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-text-main/10 text-text-main rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-olive-500/50 transition-all placeholder:text-text-main/40 text-[13px]"
          />
        </div>
      </div>
    </div>
  );
}
