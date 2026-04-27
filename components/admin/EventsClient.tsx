"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Calendar } from "lucide-react";
import type { Event as AppEvent } from "@/types/business";
import { LoadingSpinner } from "./LoadingState";

export function EventsClient({ initial }: { initial: AppEvent[] }) {
  const [events, setEvents] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [active, setActive] = useState(true);

  function openNew() {
    setEditEvent(null);
    setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setDiscount(""); setActive(true);
    setShowForm(true);
  }

  function openEdit(evt: AppEvent) {
    setEditEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description ?? "");
    setStartDate(evt.startDate.slice(0, 10));
    setEndDate(evt.endDate.slice(0, 10));
    setDiscount(String(evt.discountPercentage ?? ""));
    setActive(evt.active);
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditEvent(null); setError(""); }

  async function save() {
    if (!title || !startDate || !endDate) { setError("Título e datas são obrigatórios"); return; }
    setLoading(true); setError("");
    const payload = {
      title, description: description || undefined,
      startDate, endDate, active,
      discountPercentage: discount ? parseInt(discount) : undefined,
      categoryIds: editEvent?.categoryIds ?? [],
    };
    try {
      const url = editEvent ? `/api/admin/events/${editEvent.id}` : "/api/admin/events";
      const method = editEvent ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      const evt = await res.json() as AppEvent;
      if (editEvent) {
        setEvents(prev => prev.map(e => e.id === evt.id ? evt : e));
      } else {
        setEvents(prev => [evt, ...prev]);
      }
      closeForm();
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Excluir evento?")) return;
    try {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e) { setError(String(e)); }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex justify-end">
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white text-sm font-semibold rounded-xl hover:bg-olive-700/90 transition-colors">
          <Plus className="w-4 h-4" /> Novo evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">{editEvent ? "Editar evento" : "Novo evento"}</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Título *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className={inp()} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${inp()} resize-none w-full`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Data início *</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inp()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Data fim *</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inp()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Desconto (%)</label>
              <input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(e.target.value)} className={inp()} placeholder="0-100" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="evtActive" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4 accent-olive-700" />
              <label htmlFor="evtActive" className="text-sm text-gray-700 cursor-pointer">Ativo</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white text-sm font-semibold rounded-lg hover:bg-olive-700/90 disabled:opacity-50">
              {loading && <LoadingSpinner size={14} />}
              {loading ? "Salvando..." : <><Check className="w-4 h-4" /> Salvar</>}
            </button>
            <button onClick={closeForm} className="px-4 py-2 text-gray-600 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nenhum evento cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(evt => (
            <div key={evt.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{evt.title}</h3>
                  {evt.active ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Ativo</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Inativo</span>
                  )}
                  {evt.discountPercentage && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      -{evt.discountPercentage}%
                    </span>
                  )}
                </div>
                {evt.description && <p className="text-xs text-gray-500 line-clamp-1">{evt.description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {evt.startDate.slice(0, 10)} → {evt.endDate.slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(evt)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteEvent(evt.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function inp() {
  return "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500";
}
