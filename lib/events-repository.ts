import type { Event as AppEvent, CreateEventInput, UpdateEventInput } from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore, writeExtStore } from "./ext-store";

function now() { return new Date().toISOString(); }
function shortId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEvent(row: Record<string, any>): AppEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? undefined,
    imageUrl: (row.image_url as string | null) ?? undefined,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    active: (row.active as number) === 1,
    discountPercentage: (row.discount_percentage as number | null) ?? undefined,
    categoryIds: JSON.parse((row.category_ids as string) || "[]"),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

export const eventsRepository = {
  async list(activeOnly = false): Promise<AppEvent[]> {
    const d1 = tryGetD1();
    if (d1) {
      const sql = activeOnly
        ? "SELECT * FROM events WHERE active=1 ORDER BY start_date DESC"
        : "SELECT * FROM events ORDER BY start_date DESC";
      const { results } = await d1.prepare(sql).all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToEvent);
    }
    const s = await readExtStore();
    const list = activeOnly ? s.events.filter(e => e.active) : s.events;
    return [...list].sort((a, b) => b.startDate.localeCompare(a.startDate));
  },

  async get(id: string): Promise<AppEvent | null> {
    const d1 = tryGetD1();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM events WHERE id=?").bind(id).first() as any;
      return row ? rowToEvent(row) : null;
    }
    const s = await readExtStore();
    return s.events.find(e => e.id === id) ?? null;
  },

  async create(input: CreateEventInput): Promise<AppEvent> {
    const id = `evt-${shortId()}`;
    const ts = now();
    const event: AppEvent = { ...input, id, createdAt: ts, updatedAt: ts };
    const d1 = tryGetD1();
    if (d1) {
      await d1
        .prepare(
          `INSERT INTO events (id, title, description, image_url, start_date, end_date, active, discount_percentage, category_ids, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          id, event.title, event.description ?? null, event.imageUrl ?? null,
          event.startDate, event.endDate, event.active ? 1 : 0,
          event.discountPercentage ?? null, JSON.stringify(event.categoryIds), ts, ts
        )
        .run();
      return event;
    }
    const s = await readExtStore();
    s.events.push(event);
    await writeExtStore(s);
    return event;
  },

  async update(id: string, patch: UpdateEventInput): Promise<AppEvent> {
    const d1 = tryGetD1();
    const ts = now();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = await d1.prepare("SELECT * FROM events WHERE id=?").bind(id).first() as any;
      if (!current) throw new Error(`Event "${id}" not found`);
      const merged = { ...rowToEvent(current), ...patch, id, updatedAt: ts };
      await d1
        .prepare(
          `UPDATE events
           SET title=?, description=?, image_url=?, start_date=?, end_date=?,
               active=?, discount_percentage=?, category_ids=?, updated_at=?
           WHERE id=?`
        )
        .bind(
          merged.title, merged.description ?? null, merged.imageUrl ?? null,
          merged.startDate, merged.endDate, merged.active ? 1 : 0,
          merged.discountPercentage ?? null, JSON.stringify(merged.categoryIds), ts, id
        )
        .run();
      return merged;
    }
    const s = await readExtStore();
    const idx = s.events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error(`Event "${id}" not found`);
    s.events[idx] = { ...s.events[idx], ...patch, id, updatedAt: ts };
    await writeExtStore(s);
    return s.events[idx];
  },

  async delete(id: string): Promise<void> {
    const d1 = tryGetD1();
    if (d1) {
      await d1.prepare("DELETE FROM events WHERE id=?").bind(id).run();
      return;
    }
    const s = await readExtStore();
    s.events = s.events.filter(e => e.id !== id);
    await writeExtStore(s);
  },
};
