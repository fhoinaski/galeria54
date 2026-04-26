"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Category, MenuItem } from "@/types/menu";
import { ProductTable } from "@/components/admin/ProductTable";

interface ProductsClientProps {
  initialItems: MenuItem[];
  categories: Category[];
}

export function ProductsClient({ initialItems, categories }: ProductsClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  async function mutate(url: string, method: string, onSuccess: (data: unknown) => void) {
    const res = await fetch(url, { method });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Erro ao processar");
      return;
    }
    const data = await res.json().catch(() => ({}));
    onSuccess(data);
    router.refresh();
  }

  const handleToggleAvailable = useCallback(async (id: string, val: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: val } : i));
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: val }),
    });
    if (!res.ok) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, available: !val } : i));
    }
  }, []);

  const handleToggleFeatured = useCallback(async (id: string, val: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, featured: val } : i));
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: val }),
    });
    if (!res.ok) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, featured: !val } : i));
    }
  }, []);

  const handleDuplicate = useCallback(async (id: string) => {
    await mutate(`/api/admin/products/${id}?action=duplicate`, "POST", (data) => {
      const dup = (data as { item: MenuItem }).item;
      if (dup) setItems(prev => [...prev, dup]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!confirm(`Excluir "${item?.name}"? Esta ação não pode ser desfeita.`)) return;
    setItems(prev => prev.filter(i => i.id !== id));
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setItems(prev => [...prev, item!]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <ProductTable
      items={items}
      categories={categories}
      onToggleAvailable={handleToggleAvailable}
      onToggleFeatured={handleToggleFeatured}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
    />
  );
}
