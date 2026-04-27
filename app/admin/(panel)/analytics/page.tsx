import type { Metadata } from "next";
import { analyticsRepository } from "@/lib/analytics-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AnalyticsClient } from "@/components/admin/AnalyticsClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const to = new Date().toISOString();
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const data = await analyticsRepository.getAnalytics(from, to);
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Analytics"
        subtitle="Receita, itens populares e horários de pico (últimos 30 dias)"
      />
      <AnalyticsClient data={data} />
    </div>
  );
}
