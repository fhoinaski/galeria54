import type { Metadata } from "next";
import { sessionsRepository } from "@/lib/sessions-repository";
import { tablesRepository } from "@/lib/tables-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SessionsClient } from "@/components/admin/SessionsClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sessões de mesa" };

export default async function SessionsPage() {
  const [sessions, tables] = await Promise.all([
    sessionsRepository.list(),
    tablesRepository.list(),
  ]);
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Sessões de mesa"
        subtitle="Abra, acompanhe e encerre sessões por mesa"
      />
      <SessionsClient initial={sessions} tables={tables} />
    </div>
  );
}
