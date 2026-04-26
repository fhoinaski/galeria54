"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { BellRing, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { FeaturedSection } from "@/components/FeaturedSection";
import { RecommendationBlock } from "@/components/RecommendationBlock";
import { FeedbackBlock } from "@/components/FeedbackBlock";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { menuData, allMenuItems } from "@/data/menu";
import type { MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";

// IDs for "Escolhas da Casa"
const FEATURED_IDS = ["colazione-del-mattino", "tiramisu", "latte-vaniglia"];

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [waiterToast, setWaiterToast] = useState(false);

  const t = translations[language];

  // Show waiter toast and auto-dismiss after 4s
  const callWaiter = useCallback(() => {
    setWaiterToast(true);
  }, []);

  useEffect(() => {
    if (!waiterToast) return;
    const timer = setTimeout(() => setWaiterToast(false), 4000);
    return () => clearTimeout(timer);
  }, [waiterToast]);

  // "Escolhas da Casa" items
  const featuredItems = useMemo(
    () => allMenuItems.filter(i => FEATURED_IDS.includes(i.id) && i.available),
    []
  );

  // Filtered categories for menu grid
  const filteredCategories = useMemo(() => {
    let rawData = menuData;

    if (activeCategory) {
      rawData = rawData.filter(cat => cat.id === activeCategory);
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      rawData = rawData
        .map(cat => ({
          ...cat,
          items: cat.items.filter(
            item =>
              item.name[language].toLowerCase().includes(lower) ||
              item.description[language].toLowerCase().includes(lower) ||
              item.tags?.some(tag => tag.toLowerCase().includes(lower)) ||
              item.badge?.toLowerCase().includes(lower)
          ),
        }))
        .filter(cat => cat.items.length > 0);
    }

    return rawData;
  }, [activeCategory, searchTerm, language]);

  // Suggestions for guided block (fallback when no guided choice)
  const defaultSuggestions = useMemo(
    () => allMenuItems.filter(i => i.featured && i.available).slice(0, 6),
    []
  );

  const isHome = !searchTerm && !activeCategory;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-gold/25 bg-[#FCFAF3]">
      <Header language={language} setLanguage={setLanguage} onCallWaiter={callWaiter} />

      <main className="flex-1">
        <Hero
          language={language}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Sticky category tabs — only when not in pure search mode */}
        {!searchTerm && (
          <CategoryTabs
            categories={menuData.map(c => ({ id: c.id, name: c.name[language] }))}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            language={language}
          />
        )}

        {/* Escolhas da Casa — only on home */}
        {isHome && featuredItems.length > 0 && (
          <FeaturedSection
            items={featuredItems}
            language={language}
            onProductClick={setSelectedProduct}
          />
        )}

        {/* Menu grid */}
        <div id="cardapio" className="max-w-7xl mx-auto px-4 py-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-main/50 text-base">{t.emptySearch}</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-olive-700 font-semibold underline underline-offset-4 text-sm"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="space-y-14">
              {filteredCategories.map(category => (
                <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                  {/* Category heading — hide when a single category is active */}
                  {(!activeCategory || searchTerm) && (
                    <div className="mb-6 flex items-end gap-3">
                      <div>
                        <h2
                          id={`cat-${category.id}`}
                          className="font-serif text-[24px] font-bold text-olive-700 leading-tight"
                        >
                          {category.name[language]}
                        </h2>
                        {category.description && (
                          <p className="text-text-main/55 text-[13px] mt-0.5">
                            {category.description[language]}
                          </p>
                        )}
                      </div>
                      <span className="text-[12px] text-text-main/35 mb-0.5 ml-auto">
                        {category.items.length} {category.items.length === 1 ? "item" : "itens"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.items.map(item => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        language={language}
                        onClick={() => setSelectedProduct(item)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Guided recommendation block — only on home */}
        {isHome && (
          <RecommendationBlock
            language={language}
            suggestions={defaultSuggestions}
            onProductClick={setSelectedProduct}
          />
        )}

        <FeedbackBlock language={language} />
      </main>

      <Footer />

      {/* Product detail modal */}
      <ProductModal
        item={selectedProduct}
        language={language}
        onClose={() => setSelectedProduct(null)}
        onCallWaiter={callWaiter}
        allMenuItems={allMenuItems}
      />

      {/* Waiter toast notification */}
      <AnimatePresence>
        {waiterToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm"
          >
            <div className="flex items-center gap-3 bg-olive-700 text-warm-white px-4 py-3.5 rounded-2xl shadow-xl shadow-olive-700/30">
              <div className="w-8 h-8 rounded-full bg-warm-white/15 flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <p className="text-[13.5px] font-medium flex-1 leading-snug">{t.waiterCalled}</p>
              <button
                onClick={() => setWaiterToast(false)}
                aria-label="Fechar"
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-warm-white/15 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
