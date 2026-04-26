import { useState } from 'react';
import type { Language } from '@/types/menu';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string) => {
    // We'll import translations in the hook or component directly to avoid circular deps
    // For simplicity, we just return the language state and setter here
  };

  return { language, setLanguage };
}
