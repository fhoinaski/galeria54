"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/menu";
import { CategoryTable } from "@/components/admin/CategoryTable";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);

  const handleSave = useCallback(async (data: Partial<Category>, id?: string) => {
    const url    = id ? `/api/admin/categories/${id}` : "/api/admin/categories";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Erro ao salvar");
    }
    const { category } = await res.json();
    if (id) {
      setCategories(prev => prev.map(c => c.id === id ? category : c));
    } else {
      setCategories(prev => [...prev, category]);
    }
    router.refresh();
  }, [router]);

  const handleToggleActive = useCallback(async (id: string, val: boolean) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: val } : c));
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: val }),
    });
    if (!res.ok) {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !val } : c));
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!confirm(`Excluir a categoria "${cat?.name.pt}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Erro ao excluir");
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    router.refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, router]);

  return (
    <CategoryTable
      categories={categories}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}
