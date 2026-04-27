import type { MenuItem } from "@/types/menu";
import type { Recommendation, PopularItem } from "@/types/business";

interface ScoringContext {
  popularItems?: PopularItem[];
}

export function getRecommendations(
  allItems: MenuItem[],
  context: ScoringContext = {},
  limit = 6
): Recommendation[] {
  const available = allItems.filter(i => i.available);
  if (!available.length) return [];

  const popularityMap = new Map(
    (context.popularItems ?? []).map(p => [p.id, p.quantity])
  );
  const maxPopularity = Math.max(1, ...Array.from(popularityMap.values()));

  const scored = available.map(item => {
    let score = 0;
    let reason = "Sugestão do barista";

    if (item.featured) {
      score += 20;
      reason = "Destaque do cardápio";
    }

    const pop = popularityMap.get(item.id) ?? 0;
    if (pop > 0) {
      score += Math.round((pop / maxPopularity) * 15);
      reason = "Mais pedido";
    }

    const pairingCount = available.filter(i => i.pairings?.includes(item.id)).length;
    if (pairingCount > 0) {
      score += pairingCount * 3;
      if (score <= 3) reason = "Combina muito bem";
    }

    if (item.badge) {
      score += 5;
      if (reason === "Sugestão do barista") reason = item.badge.pt || "Especial";
    }

    return { item, score, reason };
  });

  return scored
    .sort((a, b) => b.score - a.score || (a.item.featured ? -1 : 1))
    .slice(0, limit);
}
