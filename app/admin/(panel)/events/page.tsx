import type { Metadata } from "next";
import { eventsRepository } from "@/lib/events-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventsClient } from "@/components/admin/EventsClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Eventos & Promoções" };

export default async function EventsPage() {
  const events = await eventsRepository.list();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Eventos & Promoções"
        subtitle="Gerencie eventos especiais e campanhas com desconto"
      />
      <EventsClient initial={events} />
    </div>
  );
}
