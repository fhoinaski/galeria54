"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";
import type { Session, RestaurantTable } from "@/types/business";
import { formatCurrency } from "@/lib/currency";

const STATUS_LABELS: Record<Session["status"], string> = {
  active: "Ativa",
  closed: "Encerrada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<Session["status"], string> = {
  active: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-500",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  initial: Session[];
  tables: RestaurantTable[];
}

export function SessionsClient({ initial, tables }: Props) {
  const [sessions, setSessions] = useState(initial);
  const [filter, setFilter] = useState<"all" | Session["status"]>("all");
  const [showNew, setShowNew] = useState(false);
  const [tableId, setTableId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableTables = tables.filter(t => t.status === "available");

  const visible = filter === "all" ? sessions : sessions.filter(s => s.status === filter);

  async function createSession() {
    if (!tableId) { setError("Selecione uma mesa"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, notes: notes || undefined }),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      const session = await res.json() as Session;
      setSessions(prev => [session, ...prev]);
      setShowNew(false); setTableId(""); setNotes("");
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  async function closeSession(id: string) {
    if (!confirm("Encerrar sessão?")) return;
    try {
      const res = await fetch(`/api/admin/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "close" }),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      const updated = await res.json() as Session;
      setSessions(prev => prev.map(s => s.id === id ? updated : s));
    } catch (e) { setError(String(e)); }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "active", "closed", "cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-olive-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Todas" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white text-sm font-semibold rounded-xl hover:bg-olive-700/90 transition-colors"
        >
          <Users className="w-4 h-4" /> Nova sessão
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Abrir sessão</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Mesa</label>
              <select value={tableId} onChange={e => setTableId(e.target.value)} className={inp()}>
                <option value="">Selecionar...</option>
                {availableTables.map(t => (
                  <option key={t.id} value={t.id}>{t.label} (cap. {t.capacity})</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Observações</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} className={inp()} placeholder="Opcional..." />
            </div>
            <div className="flex gap-2">
              <button onClick={createSession} disabled={loading} className="px-4 py-2.5 bg-olive-700 text-white text-sm rounded-lg hover:bg-olive-700/90 disabled:opacity-50">
                Abrir
              </button>
              <button onClick={() => setShowNew(false)} className="p-2.5 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">Nenhuma sessão encontrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Mesa</th>
                <th className="text-left px-5 py-3">Abertura</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-right px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-700">{s.tableLabel ?? s.tableId}</td>
                  <td className="px-5 py-3 text-gray-500">{fmtDate(s.openedAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-800">
                    {formatCurrency(s.totalAmount)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.status === "active" && (
                      <button
                        onClick={() => closeSession(s.id)}
                        className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        Encerrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function inp() {
  return "px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500";
}
