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

  return (
    <div className="relative bg-olive-700 py-16 px-4 flex flex-col items-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://picsum.photos/id/1060/1920/1080')] bg-cover bg-center" />
      
      <div className="relative z-10 w-full max-w-xl text-center space-y-6">
        <h2 className="font-serif text-3xl md:text-4xl text-warm-white font-medium">
          {language === 'pt' ? 'Sabor em cada detalhe' : language === 'en' ? 'Flavor in every detail' : 'Sabor en cada detalle'}
        </h2>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-olive-500 group-focus-within:text-gold transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-warm-white/95 text-text-main rounded-full py-3.5 pl-12 pr-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all placeholder:text-olive-500/60"
          />
        </div>
      </div>
    </div>
  );
}
