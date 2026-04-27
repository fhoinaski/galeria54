import type { Metadata } from "next";
import { businessRepository } from "@/lib/business-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BusinessClient } from "@/components/admin/BusinessClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Configurações do negócio" };

export default async function BusinessPage() {
  const settings = await businessRepository.get();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Configurações do negócio"
        subtitle="Nome, contato, horários e redes sociais"
      />
      <BusinessClient initial={settings} />
    </div>
  );
}
