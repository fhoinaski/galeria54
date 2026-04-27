import type {
  Session,
  SessionItem,
  SessionWithItems,
  CreateSessionInput,
  AddSessionItemInput,
} from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore, writeExtStore } from "./ext-store";

function now() { return new Date().toISOString(); }
function shortId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSession(row: Record<string, any>): Session {
  return {
    id: row.id as string,
    tableId: row.table_id as string,
    tableLabel: (row.table_label as string | null) ?? undefined,
    status: row.status as Session["status"],
    totalAmount: row.total_amount as number,
    notes: (row.notes as string | null) ?? undefined,
    openedAt: row.opened_at as string,
    closedAt: (row.closed_at as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: Record<string, any>): SessionItem {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    menuItemId: row.menu_item_id as string,
    menuItemName: (row.menu_item_name as string | null) ?? undefined,
    quantity: row.quantity as number,
    unitPrice: row.unit_price as number,
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

export const sessionsRepository = {
  async list(status?: string): Promise<Session[]> {
    const d1 = tryGetD1();
    if (d1) {
      const sql = `SELECT s.*, t.label AS table_label
                   FROM sessions s
                   LEFT JOIN restaurant_tables t ON s.table_id = t.id
                   ${status ? "WHERE s.status=?" : ""}
                   ORDER BY s.opened_at DESC`;
      const { results } = status
        ? await d1.prepare(sql).bind(status).all()
        : await d1.prepare(sql).all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToSession);
    }
    const s = await readExtStore();
    const list = status ? s.sessions.filter(x => x.status === status) : s.sessions;
    return [...list]
      .sort((a, b) => b.openedAt.localeCompare(a.openedAt))
      .map(sess => {
        const table = s.tables.find(t => t.id === sess.tableId);
        return { ...sess, tableLabel: table?.label };
      });
  },

  async get(id: string): Promise<SessionWithItems | null> {
    const d1 = tryGetD1();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1
        .prepare(
          `SELECT s.*, t.label AS table_label
           FROM sessions s
           LEFT JOIN restaurant_tables t ON s.table_id = t.id
           WHERE s.id=?`
        )
        .bind(id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .first() as any;
      if (!row) return null;
      const { results } = await d1
        .prepare(
          `SELECT si.*, mi.name AS menu_item_name
           FROM session_items si
           LEFT JOIN menu_items mi ON si.menu_item_id = mi.id
           WHERE si.session_id=?`
        )
        .bind(id)
        .all();
      return {
        ...rowToSession(row),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (results as any[]).map(rowToItem),
      };
    }
    const s = await readExtStore();
    const session = s.sessions.find(x => x.id === id);
    if (!session) return null;
    const table = s.tables.find(t => t.id === session.tableId);
    const items = s.sessionItems.filter(i => i.sessionId === id);
    return { ...session, tableLabel: table?.label, items };
  },

  async create(input: CreateSessionInput): Promise<Session> {
    const id = `sess-${shortId()}`;
    const ts = now();
    const session: Session = {
      id,
      tableId: input.tableId,
      status: "active",
      totalAmount: 0,
      notes: input.notes,
      openedAt: ts,
      createdAt: ts,
    };
    const d1 = tryGetD1();
    if (d1) {
      await d1
        .prepare(
          "INSERT INTO sessions (id, table_id, status, total_amount, notes, opened_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id, input.tableId, "active", 0, input.notes ?? null, ts, ts)
        .run();
      await d1
        .prepare("UPDATE restaurant_tables SET status='occupied', updated_at=? WHERE id=?")
        .bind(ts, input.tableId)
        .run();
      return session;
    }
    const s = await readExtStore();
    s.sessions.push(session);
    const tidx = s.tables.findIndex(t => t.id === input.tableId);
    if (tidx !== -1) s.tables[tidx] = { ...s.tables[tidx], status: "occupied", updatedAt: ts };
    await writeExtStore(s);
    return session;
  },

  async close(id: string): Promise<Session> {
    const d1 = tryGetD1();
    const ts = now();
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await d1.prepare("SELECT * FROM sessions WHERE id=?").bind(id).first() as any;
      if (!row) throw new Error(`Session "${id}" not found`);
      await d1.prepare("UPDATE sessions SET status='closed', closed_at=? WHERE id=?").bind(ts, id).run();
      await d1
        .prepare("UPDATE restaurant_tables SET status='available', updated_at=? WHERE id=?")
        .bind(ts, row.table_id as string)
        .run();
      return { ...rowToSession(row), status: "closed", closedAt: ts };
    }
    const s = await readExtStore();
    const idx = s.sessions.findIndex(x => x.id === id);
    if (idx === -1) throw new Error(`Session "${id}" not found`);
    const updated = { ...s.sessions[idx], status: "closed" as const, closedAt: ts };
    s.sessions[idx] = updated;
    const tidx = s.tables.findIndex(t => t.id === updated.tableId);
    if (tidx !== -1) s.tables[tidx] = { ...s.tables[tidx], status: "available", updatedAt: ts };
    await writeExtStore(s);
    return updated;
  },

  async addItem(input: AddSessionItemInput): Promise<SessionItem> {
    const itemId = `si-${shortId()}`;
    const ts = now();
    const item: SessionItem = {
      id: itemId,
      sessionId: input.sessionId,
      menuItemId: input.menuItemId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      notes: input.notes,
      createdAt: ts,
    };
    const d1 = tryGetD1();
    if (d1) {
      await d1
        .prepare(
          "INSERT INTO session_items (id, session_id, menu_item_id, quantity, unit_price, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(itemId, input.sessionId, input.menuItemId, input.quantity, input.unitPrice, input.notes ?? null, ts)
        .run();
      await d1
        .prepare("UPDATE sessions SET total_amount = total_amount + ? WHERE id=?")
        .bind(input.quantity * input.unitPrice, input.sessionId)
        .run();
      return item;
    }
    const s = await readExtStore();
    s.sessionItems.push(item);
    const sidx = s.sessions.findIndex(x => x.id === input.sessionId);
    if (sidx !== -1) {
      s.sessions[sidx] = {
        ...s.sessions[sidx],
        totalAmount: s.sessions[sidx].totalAmount + input.quantity * input.unitPrice,
      };
    }
    await writeExtStore(s);
    return item;
  },
};
