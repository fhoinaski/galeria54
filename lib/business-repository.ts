import type { BusinessSettings, UpdateBusinessSettingsInput } from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore, writeExtStore } from "./ext-store";

function now() { return new Date().toISOString(); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSettings(row: Record<string, any>): BusinessSettings {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    logoUrl: (row.logo_url as string | null) ?? undefined,
    phone: (row.phone as string | null) ?? undefined,
    address: (row.address as string | null) ?? undefined,
    email: (row.email as string | null) ?? undefined,
    website: (row.website as string | null) ?? undefined,
    instagram: (row.instagram as string | null) ?? undefined,
    facebook: (row.facebook as string | null) ?? undefined,
    openingHours: JSON.parse((row.opening_hours as string) || "{}"),
    currency: row.currency as string,
    timezone: row.timezone as string,
    isOpen: (row.is_open as number) === 1,
    updatedAt: row.updated_at as string,
  };
}

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

const fallback: BusinessSettings = {
  id: "main",
  name: "Caffè 54",
  description: "",
  currency: "BRL",
  timezone: "America/Sao_Paulo",
  openingHours: {},
  isOpen: true,
  updatedAt: now(),
};

export const businessRepository = {
  async get(): Promise<BusinessSettings> {
    const d1 = tryGetD1();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM business_settings WHERE id='main'").first() as any;
      return row ? rowToSettings(row) : { ...fallback };
    }
    const s = await readExtStore();
    return s.business;
  },

  async update(patch: UpdateBusinessSettingsInput): Promise<BusinessSettings> {
    const d1 = tryGetD1();
    const ts = now();
    if (d1) {
      const current = await this.get();
      const merged: BusinessSettings = { ...current, ...patch, id: "main", updatedAt: ts };
      await d1
        .prepare(
          `UPDATE business_settings
           SET name=?, description=?, logo_url=?, phone=?, address=?, email=?,
               website=?, instagram=?, facebook=?, opening_hours=?,
               currency=?, timezone=?, is_open=?, updated_at=?
           WHERE id='main'`
        )
        .bind(
          merged.name, merged.description, merged.logoUrl ?? null,
          merged.phone ?? null, merged.address ?? null, merged.email ?? null,
          merged.website ?? null, merged.instagram ?? null, merged.facebook ?? null,
          JSON.stringify(merged.openingHours),
          merged.currency, merged.timezone, merged.isOpen ? 1 : 0, ts
        )
        .run();
      return merged;
    }
    const s = await readExtStore();
    s.business = { ...s.business, ...patch, id: "main", updatedAt: ts };
    await writeExtStore(s);
    return s.business;
  },
};
