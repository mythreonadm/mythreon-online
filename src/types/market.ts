import type { Item } from "./index";
export interface MarketSaleStats {
  template_id: string; rarity: string; tier: number; upgrade_level: number; currency: "GOLD" | "COINS";
  sale_events: number; units_sold: number; average_unit_price: number; lowest_unit_price: number; highest_unit_price: number;
  last_sold_at: string;
  daily: { day: string; units: number; average: number }[];
}
export function marketVariantKey(item: Pick<Item, "templateId" | "rarity" | "tier" | "upgradeLevel">, currency: string) {
  return JSON.stringify([item.templateId, item.rarity, Number(item.tier), Number(item.upgradeLevel ?? 0), currency]);
}
export function marketSaleKey(stat: MarketSaleStats) {
  return JSON.stringify([stat.template_id, stat.rarity, Number(stat.tier), Number(stat.upgrade_level), stat.currency]);
}
