import type { Metadata } from "next";
import { feedbacksRepository } from "@/lib/feedbacks-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FeedbacksClient } from "@/components/admin/FeedbacksClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Feedbacks" };

export default async function FeedbacksPage() {
  const [feedbacks, summary] = await Promise.all([
    feedbacksRepository.list(100),
    feedbacksRepository.getSummary(),
  ]);
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Feedbacks dos clientes"
        subtitle="Avaliações e comentários recebidos"
      />
      <FeedbacksClient feedbacks={feedbacks} summary={summary} />
    </div>
  );
}
