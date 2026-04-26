"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { RecommendationBlock } from "@/components/RecommendationBlock";
import { FeedbackBlock } from "@/components/FeedbackBlock";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { menuData, allMenuItems } from "@/data/menu";
import type { MenuItem } from "@/types/menu";
import { translations } from "@/utils/translations";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const t = translations[language];

  // Filtering Logic
  const filteredCategories = useMemo(() => {
    let rawData = menuData;
    
    // Filter by Category
    if (activeCategory) {
      rawData = rawData.filter(cat => cat.id === activeCategory);
    }
    
    // Filter by Search Term
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      rawData = rawData.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.name[language].toLowerCase().includes(lowerTerm) ||
          item.description[language].toLowerCase().includes(lowerTerm) ||
          item.tags?.some(tag => tag.toLowerCase().includes(lowerTerm))
        )
      })).filter(cat => cat.items.length > 0);
    }

    return rawData;
  }, [activeCategory, searchTerm, language]);

  // Derived mock suggestions: take top 3 featured items
  const featuredSuggestions = useMemo(() => {
    const featured = allMenuItems.filter(i => i.featured);
    // Sort deterministically to avoid purity issues
    return [...featured].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-gold/30">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-1">
        <Hero 
          language={language} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        {/* Only show categories if not searching hard */}
        {!searchTerm && (
          <CategoryTabs 
            categories={menuData.map(c => ({ id: c.id, name: c.name[language] }))}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            language={language}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-olive-500/80 text-lg">{t.emptySearch}</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-olive-700 font-medium underline underline-offset-4"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map(category => (
                <section key={category.id}>
                  {(!activeCategory || searchTerm) && (
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl font-bold text-olive-700">{category.name[language]}</h2>
                      {category.description && (
                         <p className="text-text-main/60 mt-1">{category.description[language]}</p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
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

        {/* Dynamic Recommendations - Only show on home context */}
        {!searchTerm && !activeCategory && (
          <RecommendationBlock 
            language={language} 
            suggestions={featuredSuggestions} 
            onProductClick={setSelectedProduct} 
          />
        )}

        <FeedbackBlock language={language} />

      </main>

      <Footer />

      <ProductModal 
        item={selectedProduct} 
        language={language} 
        onClose={() => setSelectedProduct(null)} 
        allMenuItems={allMenuItems}
      />
    </div>
  );
}
