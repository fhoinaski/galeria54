"use client";

import { useState } from "react";
import { Plus, Trash2, QrCode, Edit2, Check, X } from "lucide-react";
import type { RestaurantTable } from "@/types/business";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { LoadingSpinner } from "./LoadingState";

const STATUS_LABELS: Record<RestaurantTable["status"], string> = {
  available: "Disponível",
  occupied: "Ocupada",
  reserved: "Reservada",
  inactive: "Inativa",
};

const STATUS_COLORS: Record<RestaurantTable["status"], string> = {
  available: "bg-green-100 text-green-700",
  occupied: "bg-red-100 text-red-700",
  reserved: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-500",
};

export function TablesClient({ initial }: { initial: RestaurantTable[] }) {
  const [tables, setTables] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [qrTable, setQrTable] = useState<RestaurantTable | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<RestaurantTable["status"]>("available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New table form
  const [num, setNum] = useState("");
  const [label, setLabel] = useState("");
  const [cap, setCap] = useState("4");

  async function createTable() {
    if (!num || !label) { setError("Número e nome são obrigatórios"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: parseInt(num), label, capacity: parseInt(cap) }),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      const table = await res.json() as RestaurantTable;
      setTables(prev => [...prev, table].sort((a, b) => a.number - b.number));
      setShowForm(false); setNum(""); setLabel(""); setCap("4");
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: RestaurantTable["status"]) {
    try {
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json() as { error: string }).error);
      const updated = await res.json() as RestaurantTable;
      setTables(prev => prev.map(t => t.id === id ? updated : t));
      setEditId(null);
    } catch (e) { setError(String(e)); }
  }

  async function deleteTable(id: string) {
    if (!confirm("Excluir mesa?")) return;
    try {
      const res = await fetch(`/api/admin/tables/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Erro ao excluir");
      setTables(prev => prev.filter(t => t.id !== id));
    } catch (e) { setError(String(e)); }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white text-sm font-semibold rounded-xl hover:bg-olive-700/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova mesa
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Nova mesa</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Número</label>
              <input type="number" min={1} value={num} onChange={e => setNum(e.target.value)} className={inp()} style={{ width: 80 }} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome / label</label>
              <input value={label} onChange={e => setLabel(e.target.value)} className={inp()} placeholder="Mesa 01" style={{ width: 140 }} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Capacidade</label>
              <input type="number" min={1} value={cap} onChange={e => setCap(e.target.value)} className={inp()} style={{ width: 80 }} />
            </div>
            <div className="flex gap-2">
              <button onClick={createTable} disabled={loading} className="flex items-center gap-1.5 px-4 py-2.5 bg-olive-700 text-white text-sm rounded-lg hover:bg-olive-700/90 disabled:opacity-50">
                {loading ? <LoadingSpinner size={14} /> : <Check className="w-4 h-4" />}
                Criar
              </button>
              <button onClick={() => setShowForm(false)} className="px-3 py-2.5 text-gray-500 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR modal */}
      {qrTable && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setQrTable(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-800 mb-1 text-center">{qrTable.label}</h3>
            <p className="text-xs text-gray-400 text-center mb-4 break-all">{qrTable.qrUrl}</p>
            <QRCodeDisplay url={qrTable.qrUrl} size={200} />
            <button onClick={() => setQrTable(null)} className="mt-4 w-full py-2.5 text-sm text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
              Fechar
            </button>
          </div>
        </div>
      )}

      {tables.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">Nenhuma mesa cadastrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Nº</th>
                <th className="text-left px-5 py-3">Nome</th>
                <th className="text-left px-5 py-3">Cap.</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tables.map(t => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-700">{t.number}</td>
                  <td className="px-5 py-3 text-gray-800">{t.label}</td>
                  <td className="px-5 py-3 text-gray-500">{t.capacity}</td>
                  <td className="px-5 py-3">
                    {editId === t.id ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value as RestaurantTable["status"])}
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                        <button onClick={() => updateStatus(t.id, editStatus)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setQrTable(t); }}
                        title="Ver QR Code"
                        className="p-1.5 text-gray-400 hover:text-olive-700 hover:bg-olive-50 rounded-lg transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditId(t.id); setEditStatus(t.status); }}
                        title="Editar status"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTable(t.id)}
                        title="Excluir"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
