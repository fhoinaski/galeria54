"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, MenuItem } from "@/types/menu";
import { inputToCents } from "@/lib/currency";
import { parseTagList } from "@/lib/validation";
import { ImageUploader } from "./ImageUploader";
import { PriceInput } from "./PriceInput";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { LoadingSpinner } from "./LoadingState";

interface ProductFormProps {
  categories: Category[];
  initialData?: MenuItem;
}

type FormState = {
  name: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  descriptionPt: string;
  descriptionEn: string;
  descriptionEs: string;
  badgePt: string;
  badgeEn: string;
  badgeEs: string;
  available: boolean;
  featured: boolean;
  tags: string;
  allergens: string;
  pairings: string;
  order: string;
};

function toFormState(item?: MenuItem): FormState {
  return {
    name:          item?.name ?? "",
    categoryId:    item?.categoryId ?? "",
    price:         item?.price ?? 0,
    imageUrl:      item?.imageUrl ?? "",
    descriptionPt: item?.description.pt ?? "",
    descriptionEn: item?.description.en ?? "",
    descriptionEs: item?.description.es ?? "",
    badgePt:       item?.badge?.pt ?? "",
    badgeEn:       item?.badge?.en ?? "",
    badgeEs:       item?.badge?.es ?? "",
    available:     item?.available ?? true,
    featured:      item?.featured ?? false,
    tags:          item?.tags.join(", ") ?? "",
    allergens:     item?.allergens.join(", ") ?? "",
    pairings:      item?.pairings.join(", ") ?? "",
    order:         String(item?.order ?? 0),
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const isEdit = !!initialData;

  function set(field: keyof FormState, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim())        errs.name = "Nome é obrigatório";
    if (!form.categoryId)         errs.categoryId = "Categoria é obrigatória";
    if (!form.price || form.price <= 0) errs.price = "Preço deve ser maior que zero";
    if (!form.descriptionPt.trim()) errs.descriptionPt = "Descrição em PT é obrigatória";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        name:        form.name.trim(),
        categoryId:  form.categoryId,
        price:       form.price,
        imageUrl:    form.imageUrl || undefined,
        description: { pt: form.descriptionPt.trim(), en: form.descriptionEn.trim(), es: form.descriptionEs.trim() },
        badge:       form.badgePt.trim()
          ? { pt: form.badgePt.trim(), en: form.badgeEn.trim() || form.badgePt.trim(), es: form.badgeEs.trim() || form.badgePt.trim() }
          : undefined,
        available:   form.available,
        featured:    form.featured,
        tags:        parseTagList(form.tags),
        allergens:   parseTagList(form.allergens),
        pairings:    parseTagList(form.pairings),
        order:       parseInt(form.order) || 0,
      };

      const url  = isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Erro ao salvar");
      }
      setToast(isEdit ? "Produto atualizado!" : "Produto criado!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch (err) {
      setToast(`Erro: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${toast.startsWith("Erro") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {toast}
        </div>
      )}

      {/* Section: Básico */}
      <Section title="Informações básicas">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome do produto *" error={errors.name}>
            <input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls(errors.name)} placeholder="Ex: Latte Vaniglia" />
          </Field>

          <Field label="Categoria *" error={errors.categoryId}>
            <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)} className={inputCls(errors.categoryId)}>
              <option value="">Selecionar...</option>
              {categories.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.name.pt}</option>
              ))}
            </select>
          </Field>

          <Field label="Preço *" error={errors.price}>
            <PriceInput value={form.price} onChange={v => set("price", v)} error={errors.price} />
          </Field>

          <Field label="Ordem de exibição">
            <input type="number" min={0} value={form.order} onChange={e => set("order", e.target.value)} className={inputCls()} />
          </Field>
        </div>

        <div className="flex gap-6 mt-2">
          <AvailabilityToggle checked={form.available} onChange={v => set("available", v)} label="Disponível" />
          <AvailabilityToggle checked={form.featured} onChange={v => set("featured", v)} label="Em destaque" />
        </div>
      </Section>

      {/* Section: Imagem */}
      <Section title="Imagem">
        <ImageUploader value={form.imageUrl} onChange={v => set("imageUrl", v)} />
      </Section>

      {/* Section: Descrições */}
      <Section title="Descrições" subtitle="Descrição em PT é obrigatória; EN e ES são opcionais.">
        <div className="space-y-3">
          <Field label="Descrição PT *" error={errors.descriptionPt}>
            <textarea rows={2} value={form.descriptionPt} onChange={e => set("descriptionPt", e.target.value)} className={inputCls(errors.descriptionPt)} placeholder="Descrição em português..." />
          </Field>
          <Field label="Descrição EN">
            <textarea rows={2} value={form.descriptionEn} onChange={e => set("descriptionEn", e.target.value)} className={inputCls()} placeholder="Description in English..." />
          </Field>
          <Field label="Descrição ES">
            <textarea rows={2} value={form.descriptionEs} onChange={e => set("descriptionEs", e.target.value)} className={inputCls()} placeholder="Descripción en español..." />
          </Field>
        </div>
      </Section>

      {/* Section: Badge */}
      <Section title="Badge / Selo" subtitle="Opcional. Aparece no card do produto.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Badge PT">
            <input value={form.badgePt} onChange={e => set("badgePt", e.target.value)} className={inputCls()} placeholder="Ex: Especial da casa" />
          </Field>
          <Field label="Badge EN">
            <input value={form.badgeEn} onChange={e => set("badgeEn", e.target.value)} className={inputCls()} placeholder="Ex: House Special" />
          </Field>
          <Field label="Badge ES">
            <input value={form.badgeEs} onChange={e => set("badgeEs", e.target.value)} className={inputCls()} placeholder="Ex: Especial de la casa" />
          </Field>
        </div>
      </Section>

      {/* Section: Tags & Allergens */}
      <Section title="Tags e Alergênicos" subtitle="Separados por vírgula.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tags">
            <input value={form.tags} onChange={e => set("tags", e.target.value)} className={inputCls()} placeholder="Vegetariano, Proteico..." />
          </Field>
          <Field label="Alergênicos">
            <input value={form.allergens} onChange={e => set("allergens", e.target.value)} className={inputCls()} placeholder="Glúten, Lactose..." />
          </Field>
        </div>
        <Field label="Combinações (IDs dos produtos)">
          <input value={form.pairings} onChange={e => set("pairings", e.target.value)} className={inputCls()} placeholder="c-espresso, latte-vaniglia..." />
        </Field>
      </Section>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white text-sm font-semibold rounded-xl hover:bg-olive-700/90 disabled:opacity-50 transition-colors"
        >
          {saving && <LoadingSpinner size={16} />}
          {saving ? "Salvando..." : isEdit ? "Atualizar produto" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 text-gray-600 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-3 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500 ${
    error ? "border-red-400" : "border-gray-200"
  }`;
}
