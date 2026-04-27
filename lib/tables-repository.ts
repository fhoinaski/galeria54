import type { RestaurantTable, CreateTableInput, UpdateTableInput } from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore, writeExtStore } from "./ext-store";

function now() { return new Date().toISOString(); }
function shortId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTable(row: Record<string, any>): RestaurantTable {
  return {
    id: row.id as string,
    number: row.number as number,
    label: row.label as string,
    capacity: row.capacity as number,
    status: row.status as RestaurantTable["status"],
    qrUrl: row.qr_url as string,
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

export const tablesRepository = {
  async list(): Promise<RestaurantTable[]> {
    const d1 = tryGetD1();
    if (d1) {
      const { results } = await d1.prepare("SELECT * FROM restaurant_tables ORDER BY number ASC").all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToTable);
    }
    const s = await readExtStore();
    return [...s.tables].sort((a, b) => a.number - b.number);
  },

  async get(id: string): Promise<RestaurantTable | null> {
    const d1 = tryGetD1();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM restaurant_tables WHERE id=?").bind(id).first() as any;
      return row ? rowToTable(row) : null;
    }
    const s = await readExtStore();
    return s.tables.find(t => t.id === id) ?? null;
  },

  async create(input: CreateTableInput): Promise<RestaurantTable> {
    const id = `mesa-${shortId()}`;
    const ts = now();
    const table: RestaurantTable = { ...input, id, createdAt: ts, updatedAt: ts };
    const d1 = tryGetD1();
    if (d1) {
      await d1
        .prepare(
          `INSERT INTO restaurant_tables (id, number, label, capacity, status, qr_url, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(id, table.number, table.label, table.capacity, table.status, table.qrUrl, table.notes ?? null, ts, ts)
        .run();
      return table;
    }
    const s = await readExtStore();
    s.tables.push(table);
    await writeExtStore(s);
    return table;
  },

  async update(id: string, patch: UpdateTableInput): Promise<RestaurantTable> {
    const d1 = tryGetD1();
    const ts = now();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = await d1.prepare("SELECT * FROM restaurant_tables WHERE id=?").bind(id).first() as any;
      if (!current) throw new Error(`Table "${id}" not found`);
      const merged = { ...rowToTable(current), ...patch, id, updatedAt: ts };
      await d1
        .prepare(
          `UPDATE restaurant_tables
           SET number=?, label=?, capacity=?, status=?, qr_url=?, notes=?, updated_at=?
           WHERE id=?`
        )
        .bind(merged.number, merged.label, merged.capacity, merged.status, merged.qrUrl, merged.notes ?? null, ts, id)
        .run();
      return merged;
    }
    const s = await readExtStore();
    const idx = s.tables.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Table "${id}" not found`);
    s.tables[idx] = { ...s.tables[idx], ...patch, id, updatedAt: ts };
    await writeExtStore(s);
    return s.tables[idx];
  },

  async delete(id: string): Promise<void> {
    const d1 = tryGetD1();
    if (d1) {
      await d1.prepare("DELETE FROM restaurant_tables WHERE id=?").bind(id).run();
      return;
    }
    const s = await readExtStore();
    s.tables = s.tables.filter(t => t.id !== id);
    await writeExtStore(s);
  },
};
