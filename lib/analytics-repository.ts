import type { AnalyticsData, DayRevenue, PopularItem, HourCount } from "@/types/business";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { readExtStore } from "./ext-store";
import { feedbacksRepository } from "./feedbacks-repository";

function tryGetD1() {
  if (env.databaseProvider !== "d1") return null;
  const ctx = getOptionalRequestContext();
  return ctx ? ctx.env.caffe54_menu_db : null;
}

export const analyticsRepository = {
  async getAnalytics(from: string, to: string): Promise<AnalyticsData> {
    const ratings = await feedbacksRepository.getSummary();
    const d1 = tryGetD1();

    if (d1) {
      const [revenueRows, popularRows, peakRows, totalRow] = await d1.batch([
        d1
          .prepare(
            `SELECT date(opened_at) AS date,
                    SUM(total_amount) AS revenue,
                    COUNT(*) AS sessions
             FROM sessions
             WHERE status='closed' AND opened_at >= ? AND opened_at <= ?
             GROUP BY date(opened_at)
             ORDER BY date ASC`
          )
          .bind(from, to),
        d1
          .prepare(
            `SELECT mi.id, mi.name,
                    SUM(si.quantity) AS quantity,
                    SUM(si.quantity * si.unit_price) AS revenue
             FROM session_items si
             JOIN sessions s ON si.session_id = s.id
             JOIN menu_items mi ON si.menu_item_id = mi.id
             WHERE s.opened_at >= ? AND s.opened_at <= ?
             GROUP BY mi.id
             ORDER BY quantity DESC
             LIMIT 10`
          )
          .bind(from, to),
        d1
          .prepare(
            `SELECT strftime('%H', opened_at) AS hour, COUNT(*) AS count
             FROM sessions
             WHERE opened_at >= ? AND opened_at <= ?
             GROUP BY hour
             ORDER BY hour ASC`
          )
          .bind(from, to),
        d1
          .prepare(
            `SELECT COUNT(*) AS total, COALESCE(SUM(total_amount), 0) AS revenue
             FROM sessions
             WHERE status='closed' AND opened_at >= ? AND opened_at <= ?`
          )
          .bind(from, to),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const revenueByDay: DayRevenue[] = (revenueRows.results as any[]).map(r => ({
        date: r.date as string,
        revenue: (r.revenue as number) ?? 0,
        sessions: (r.sessions as number) ?? 0,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const popularItems: PopularItem[] = (popularRows.results as any[]).map(r => ({
        id: r.id as string,
        name: r.name as string,
        quantity: (r.quantity as number) ?? 0,
        revenue: (r.revenue as number) ?? 0,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const peakHours: HourCount[] = (peakRows.results as any[]).map(r => ({
        hour: parseInt(r.hour as string, 10),
        count: (r.count as number) ?? 0,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tr = (totalRow.results[0] ?? {}) as any;
      const totalSessions = (tr.total as number) ?? 0;
      const totalRevenue = (tr.revenue as number) ?? 0;

      return {
        revenueByDay,
        popularItems,
        peakHours,
        ratings,
        totalSessions,
        totalRevenue,
        avgTicket: totalSessions > 0 ? Math.round(totalRevenue / totalSessions) : 0,
        period: { from, to },
      };
    }

    // Local provider — compute from in-memory data
    const s = await readExtStore();
    const closed = s.sessions.filter(
      x => x.status === "closed" && x.openedAt >= from && x.openedAt <= to
    );

    const dayMap: Record<string, { revenue: number; sessions: number }> = {};
    for (const sess of closed) {
      const day = sess.openedAt.slice(0, 10);
      if (!dayMap[day]) dayMap[day] = { revenue: 0, sessions: 0 };
      dayMap[day].revenue += sess.totalAmount;
      dayMap[day].sessions += 1;
    }
    const revenueByDay: DayRevenue[] = Object.entries(dayMap)
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const sessionIds = new Set(closed.map(x => x.id));
    const relevant = s.sessionItems.filter(i => sessionIds.has(i.sessionId));
    const itemMap: Record<string, { quantity: number; revenue: number }> = {};
    for (const it of relevant) {
      if (!itemMap[it.menuItemId]) itemMap[it.menuItemId] = { quantity: 0, revenue: 0 };
      itemMap[it.menuItemId].quantity += it.quantity;
      itemMap[it.menuItemId].revenue += it.quantity * it.unitPrice;
    }
    const popularItems: PopularItem[] = Object.entries(itemMap)
      .map(([id, v]) => ({ id, name: id, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const hourMap: Record<number, number> = {};
    for (const sess of closed) {
      const h = new Date(sess.openedAt).getHours();
      hourMap[h] = (hourMap[h] ?? 0) + 1;
    }
    const peakHours: HourCount[] = Object.entries(hourMap)
      .map(([h, count]) => ({ hour: parseInt(h, 10), count }))
      .sort((a, b) => a.hour - b.hour);

    const totalSessions = closed.length;
    const totalRevenue = closed.reduce((acc, x) => acc + x.totalAmount, 0);

    return {
      revenueByDay,
      popularItems,
      peakHours,
      ratings,
      totalSessions,
      totalRevenue,
      avgTicket: totalSessions > 0 ? Math.round(totalRevenue / totalSessions) : 0,
      period: { from, to },
    };
  },
};
