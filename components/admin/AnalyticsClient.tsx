"use client";

import { TrendingUp, ShoppingBag, Clock, Star } from "lucide-react";
import type { AnalyticsData } from "@/types/business";
import { formatCurrency } from "@/lib/currency";

function BarChart({ data, maxVal, label, color = "bg-olive-700" }: {
  data: { label: string; value: number }[];
  maxVal: number;
  label: string;
  color?: string;
}) {
  if (!data.length) return <p className="text-gray-400 text-sm py-4 text-center">Sem dados no período.</p>;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-20 shrink-0 truncate">{d.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`${color} h-full rounded-full transition-all`}
                style={{ width: `${maxVal > 0 ? (d.value / maxVal) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-20 text-right shrink-0">{d.label.match(/^\d{4}/) ? formatCurrency(d.value) : d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const maxRevenue = Math.max(1, ...data.revenueByDay.map(d => d.revenue));
  const maxPopular = Math.max(1, ...data.popularItems.map(d => d.quantity));
  const maxPeak = Math.max(1, ...data.peakHours.map(d => d.count));

  const revenueChartData = data.revenueByDay.map(d => ({
    label: d.date.slice(5),
    value: d.revenue,
  }));
  const popularChartData = data.popularItems.slice(0, 8).map(d => ({
    label: d.name,
    value: d.quantity,
  }));
  const peakChartData = data.peakHours.map(d => ({
    label: `${String(d.hour).padStart(2, "0")}h`,
    value: d.count,
  }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="inline-flex p-2.5 rounded-xl bg-olive-700/8 mb-3">
            <TrendingUp className="w-5 h-5 text-olive-700" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Receita total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="inline-flex p-2.5 rounded-xl bg-blue-50 mb-3">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.totalSessions}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sessões encerradas</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="inline-flex p-2.5 rounded-xl bg-amber-50 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.avgTicket)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Ticket médio</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="inline-flex p-2.5 rounded-xl bg-amber-50 mb-3">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.ratings.average > 0 ? data.ratings.average.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Avaliação média ({data.ratings.total})</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BarChart
            data={revenueChartData}
            maxVal={maxRevenue}
            label="Receita por dia (R$)"
            color="bg-olive-700"
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BarChart
            data={popularChartData}
            maxVal={maxPopular}
            label="Itens mais pedidos"
            color="bg-blue-500"
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Horários de pico</p>
          </div>
          <div className="mt-3">
            {data.peakHours.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">Sem dados no período.</p>
            ) : (
              <div className="flex items-end gap-1.5 h-24">
                {Array.from({ length: 24 }, (_, h) => {
                  const found = data.peakHours.find(p => p.hour === h);
                  const val = found?.count ?? 0;
                  const pct = maxPeak > 0 ? (val / maxPeak) * 100 : 0;
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gray-100 rounded-t flex-1 flex items-end overflow-hidden" style={{ minHeight: 4 }}>
                        {pct > 0 && (
                          <div className="w-full bg-amber-400 rounded-t" style={{ height: `${pct}%` }} />
                        )}
                      </div>
                      {h % 4 === 0 && <span className="text-[9px] text-gray-400">{h}h</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Período: {data.period.from.slice(0, 10)} → {data.period.to.slice(0, 10)}
      </p>
    </div>
  );
}
