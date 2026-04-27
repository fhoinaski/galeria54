"use client";

import { useState } from "react";
import type { BusinessSettings } from "@/types/business";
import { LoadingSpinner } from "./LoadingState";

const DAYS = [
  { key: "mon", label: "Seg" },
  { key: "tue", label: "Ter" },
  { key: "wed", label: "Qua" },
  { key: "thu", label: "Qui" },
  { key: "fri", label: "Sex" },
  { key: "sat", label: "Sáb" },
  { key: "sun", label: "Dom" },
];

export function BusinessClient({ initial }: { initial: BusinessSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BusinessSettings>(k: K, v: BusinessSettings[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
    setSaved(false);
  }

  function setHours(day: string, value: string) {
    setForm(prev => ({
      ...prev,
      openingHours: { ...prev.openingHours, [day]: value || null },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      setSaved(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      {saved && <p className="text-green-700 text-sm bg-green-50 px-3 py-2 rounded-lg">Configurações salvas com sucesso.</p>}

      {/* Informações gerais */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Informações gerais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome do estabelecimento</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} className={inp()} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Telefone</label>
            <input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} className={inp()} placeholder="+55 (11) 99999-9999" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className={`${inp()} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Endereço</label>
            <input value={form.address ?? ""} onChange={e => set("address", e.target.value)} className={inp()} />
          </div>
        </div>
      </div>

      {/* Contato & redes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Contato e redes sociais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">E-mail</label>
            <input value={form.email ?? ""} onChange={e => set("email", e.target.value)} className={inp()} type="email" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Website</label>
            <input value={form.website ?? ""} onChange={e => set("website", e.target.value)} className={inp()} placeholder="https://" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Instagram</label>
            <input value={form.instagram ?? ""} onChange={e => set("instagram", e.target.value)} className={inp()} placeholder="@usuario" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Facebook</label>
            <input value={form.facebook ?? ""} onChange={e => set("facebook", e.target.value)} className={inp()} placeholder="facebook.com/..." />
          </div>
        </div>
      </div>

      {/* Horários */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Horários de funcionamento</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={e => set("isOpen", e.target.checked)}
              className="w-4 h-4 accent-olive-700"
            />
            <span className="text-xs text-gray-600">Aberto agora</span>
          </label>
        </div>
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-8 text-xs font-medium text-gray-500">{label}</span>
              <input
                value={(form.openingHours?.[key] as string | null | undefined) ?? ""}
                onChange={e => setHours(key, e.target.value)}
                className={`${inp()} flex-1 text-xs`}
                placeholder="08:00-22:00 (ou vazio = fechado)"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-olive-700 text-white text-sm font-semibold rounded-xl hover:bg-olive-700/90 disabled:opacity-50 transition-colors"
      >
        {saving && <LoadingSpinner size={14} />}
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </div>
  );
}

function inp() {
  return "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500";
}
