"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/menu";
import { slugify } from "@/lib/slugify";
import { LoadingSpinner } from "./LoadingState";

interface CategoryFormProps {
  initialData?: Category;
  onSave: (data: Partial<Category>) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSave, onCancel }: CategoryFormProps) {
  const [namePt, setNamePt] = useState(initialData?.name.pt ?? "");
  const [nameEn, setNameEn] = useState(initialData?.name.en ?? "");
  const [nameEs, setNameEs] = useState(initialData?.name.es ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [order, setOrder] = useState(String(initialData?.order ?? 0));
  const [active, setActive] = useState(initialData?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from PT name (only when creating)
  useEffect(() => {
    if (!initialData) {
      setSlug(slugify(namePt));
    }
  }, [namePt, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!namePt.trim()) { setError("Nome em PT é obrigatório"); return; }
    if (!slug.trim())  { setError("Slug é obrigatório"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({
        name: { pt: namePt.trim(), en: nameEn.trim() || namePt.trim(), es: nameEs.trim() || namePt.trim() },
        slug: slug.trim(),
        order: parseInt(order) || 0,
        active,
      });
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome PT *</label>
          <input value={namePt} onChange={e => setNamePt(e.target.value)} className={input()} placeholder="Ex: Cafés Quentes" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome EN</label>
          <input value={nameEn} onChange={e => setNameEn(e.target.value)} className={input()} placeholder="Ex: Hot Coffees" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome ES</label>
          <input value={nameEs} onChange={e => setNameEs(e.target.value)} className={input()} placeholder="Ex: Cafés Calientes" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} className={`${input()} font-mono`} placeholder="cafes-quentes" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Ordem</label>
          <input type="number" min={0} value={order} onChange={e => setOrder(e.target.value)} className={input()} />
        </div>
        <div className="flex items-center gap-2 pb-1">
          <input type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4 accent-olive-700" />
          <label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">Ativa</label>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white text-sm font-semibold rounded-lg hover:bg-olive-700/90 disabled:opacity-50 transition-colors"
        >
          {saving && <LoadingSpinner size={14} />}
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function input() {
  return "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500";
}
