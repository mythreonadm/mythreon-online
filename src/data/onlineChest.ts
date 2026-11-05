export const ONLINE_CHEST_MILESTONES = [
  { id: "CHEST_5M", label: "5 minutos", seconds: 5 * 60, gold: 300, shards: 1 },
  { id: "CHEST_30M", label: "30 minutos", seconds: 30 * 60, gold: 1000, shards: 2 },
  { id: "CHEST_2H", label: "2 horas", seconds: 2 * 60 * 60, gold: 3500, shards: 5 },
  { id: "CHEST_6H", label: "6 horas", seconds: 6 * 60 * 60, gold: 10000, shards: 10 },
  { id: "CHEST_12H", label: "12 horas", seconds: 12 * 60 * 60, gold: 25000, shards: 25 },
] as const;

export type OnlineChestMilestone = (typeof ONLINE_CHEST_MILESTONES)[number];

/** UTC keeps the reset identical on PC, mobile and server. */
export function onlineChestDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

export function normalizeOnlineChest(character: {
  onlineChestDay?: string;
  onlineChestClaims?: string[];
  onlineChestSeconds?: number;
}, now = Date.now()) {
  const day = onlineChestDayKey(now);
  if (character.onlineChestDay !== day) {
    character.onlineChestDay = day;
    character.onlineChestClaims = [];
    character.onlineChestSeconds = 0;
  } else {
    character.onlineChestClaims = [...new Set((character.onlineChestClaims ?? []).filter(id => ONLINE_CHEST_MILESTONES.some(milestone => milestone.id === id)))];
    character.onlineChestSeconds = Math.max(0, Number(character.onlineChestSeconds ?? 0) || 0);
  }
  return character;
}

export function nextOnlineChest(character: { onlineChestClaims?: string[]; onlineChestSeconds?: number }) {
  const claimed = new Set(character.onlineChestClaims ?? []);
  return ONLINE_CHEST_MILESTONES.find(milestone => !claimed.has(milestone.id)) ?? null;
}
