import { Globe } from "lucide-react";
import type { Language } from "@/types/menu";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-warm-white/80 backdrop-blur-md border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1">
          {/* Menu Drawer Toggle or Empty space */}
        </div>
        
        <div className="flex-1 flex justify-center">
          <h1 className="font-serif text-2xl font-bold tracking-wider text-olive-700">CAFFÈ 54</h1>
        </div>

        <div className="flex-1 flex justify-end items-center gap-2">
          <Globe className="w-4 h-4 text-olive-500" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-olive-700"
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>
    </header>
  );
}
