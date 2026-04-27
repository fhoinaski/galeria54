import type { Metadata } from "next";
import { tablesRepository } from "@/lib/tables-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TablesClient } from "@/components/admin/TablesClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mesas & QR Codes" };

export default async function TablesPage() {
  const tables = await tablesRepository.list();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Mesas & QR Codes"
        subtitle="Gerencie as mesas e gere QR Codes para acesso ao cardápio"
      />
      <TablesClient initial={tables} />
    </div>
  );
}
