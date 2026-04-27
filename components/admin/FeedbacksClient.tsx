"use client";

import { Star, MessageSquare } from "lucide-react";
import type { Feedback, RatingSummary } from "@/types/business";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function StarBar({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

interface Props {
  feedbacks: Feedback[];
  summary: RatingSummary;
}

export function FeedbacksClient({ feedbacks, summary }: Props) {
  const maxDist = Math.max(1, ...Object.values(summary.distribution));

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Avaliação média</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {summary.average > 0 ? summary.average.toFixed(1) : "—"}
            </span>
            <div className="pb-1">
              <StarBar rating={Math.round(summary.average)} />
              <p className="text-xs text-gray-400 mt-0.5">{summary.total} avaliações</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Distribuição</p>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = summary.distribution[String(star)] ?? 0;
              const pct = Math.round((count / maxDist) * 100);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedbacks list */}
      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nenhum feedback recebido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map(fb => (
            <div key={fb.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <StarBar rating={fb.rating} />
                  {fb.comment && (
                    <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{fb.comment}</p>
                  )}
                  <div className="flex gap-3 mt-1.5">
                    {fb.tableLabel && (
                      <span className="text-xs text-gray-400">{fb.tableLabel}</span>
                    )}
                    {fb.menuItemName && (
                      <span className="text-xs text-gray-400">Item: {fb.menuItemName}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{fmtDate(fb.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
