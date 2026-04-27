import type { Feedback, CreateFeedbackInput, RatingSummary } from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore, writeExtStore } from "./ext-store";

function now() { return new Date().toISOString(); }
function shortId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToFeedback(row: Record<string, any>): Feedback {
  return {
    id: row.id as string,
    sessionId: (row.session_id as string | null) ?? undefined,
    tableId: (row.table_id as string | null) ?? undefined,
    tableLabel: (row.table_label as string | null) ?? undefined,
    rating: row.rating as number,
    comment: (row.comment as string | null) ?? undefined,
    menuItemId: (row.menu_item_id as string | null) ?? undefined,
    menuItemName: (row.menu_item_name as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

export const feedbacksRepository = {
  async list(limit = 100): Promise<Feedback[]> {
    const d1 = tryGetD1();
    if (d1) {
      const { results } = await d1
        .prepare(
          `SELECT f.*, t.label AS table_label, mi.name AS menu_item_name
           FROM feedbacks f
           LEFT JOIN restaurant_tables t ON f.table_id = t.id
           LEFT JOIN menu_items mi ON f.menu_item_id = mi.id
           ORDER BY f.created_at DESC
           LIMIT ?`
        )
        .bind(limit)
        .all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (results as any[]).map(rowToFeedback);
    }
    const s = await readExtStore();
    return [...s.feedbacks]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map(f => {
        const table = f.tableId ? s.tables.find(t => t.id === f.tableId) : undefined;
        return { ...f, tableLabel: table?.label };
      });
  },

  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const id = `fb-${shortId()}`;
    const ts = now();
    const feedback: Feedback = { ...input, id, createdAt: ts };
    const d1 = tryGetD1();
    if (d1) {
      await d1
        .prepare(
          "INSERT INTO feedbacks (id, session_id, table_id, rating, comment, menu_item_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          id,
          input.sessionId ?? null,
          input.tableId ?? null,
          input.rating,
          input.comment ?? null,
          input.menuItemId ?? null,
          ts
        )
        .run();
      return feedback;
    }
    const s = await readExtStore();
    s.feedbacks.push(feedback);
    await writeExtStore(s);
    return feedback;
  },

  async getSummary(): Promise<RatingSummary> {
    const d1 = tryGetD1();
    if (d1) {
      const { results } = await d1
        .prepare("SELECT rating, COUNT(*) AS cnt FROM feedbacks GROUP BY rating ORDER BY rating ASC")
        .all();
      const distribution: Record<string, number> = {};
      let total = 0;
      let sum = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const row of results as any[]) {
        const r = String(row.rating as number);
        distribution[r] = row.cnt as number;
        total += row.cnt as number;
        sum += (row.rating as number) * (row.cnt as number);
      }
      return { average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0, total, distribution };
    }
    const s = await readExtStore();
    const distribution: Record<string, number> = {};
    let sum = 0;
    for (const f of s.feedbacks) {
      const r = String(f.rating);
      distribution[r] = (distribution[r] ?? 0) + 1;
      sum += f.rating;
    }
    return {
      average: s.feedbacks.length > 0 ? Math.round((sum / s.feedbacks.length) * 10) / 10 : 0,
      total: s.feedbacks.length,
      distribution,
    };
  },
};
