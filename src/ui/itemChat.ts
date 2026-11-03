import { Item } from "../types";

const LINK_PREFIX = "[[MYTHREON_ITEM:";
const LINK_SUFFIX = "]]";

export function createItemChatLink(item: Item): string {
  const stats = Object.entries(item.stats ?? {})
    .filter(([, value]) => Number(value) !== 0)
    .slice(0, 8)
    .map(([key, value]) => `${key}=${Number(value).toFixed(2)}`)
    .join(",");
  const payload = [item.templateId, item.name, item.rarity, item.tier, item.upgradeLevel ?? 0, stats]
    .map(value => encodeURIComponent(String(value ?? "")))
    .join("|");
  return `${LINK_PREFIX}${payload}${LINK_SUFFIX}`;
}

export function emitItemChatLink(item: Item) {
  window.dispatchEvent(new CustomEvent("mythreon:item-link", { detail: { item, link: createItemChatLink(item) } }));
}

export function parseItemChatLink(value: string): { label: string; rarity: string; tier: string; upgrade: number; stats: string } | null {
  const match = value.match(/\[\[MYTHREON_ITEM:([^\]]+)\]\]/);
  if (!match) return null;
  const parts = match[1].split("|").map(part => decodeURIComponent(part));
  if (parts.length < 5) return null;
  return { label: parts[1] || "Item de Mythreon", rarity: parts[2] || "COMUM", tier: parts[3] || "1", upgrade: Number(parts[4]) || 0, stats: parts[5] || "" };
}

export function displayItemChatText(value: string): string {
  return value.replace(/\[\[MYTHREON_ITEM:[^\]]+\]\]/g, token => {
    const parsed = parseItemChatLink(token);
    return parsed ? `🔗 ${parsed.label}${parsed.upgrade > 0 ? ` +${parsed.upgrade}` : ""} · ${parsed.rarity} · T${parsed.tier}` : token;
  });
}
