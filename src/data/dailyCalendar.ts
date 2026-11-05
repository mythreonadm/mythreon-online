import type { Character } from "../types";

export const CALENDAR_COUPON_PRICE = 1;
export const CALENDAR_WEEK_DAYS = 7;
export const CALENDAR_WEEK_FRAGMENTS = 3;
export const CALENDAR_MAX_GOLD_STREAK = 30;
export type CalendarDailyReward = {
  day: number;
  label: string;
  icon: string;
  templateId?: string;
  quantity?: number;
  gold?: number;
};

/** Recompensas visíveis do mês. Os itens usam templates reais para que o jogador veja e receba exatamente o mesmo recurso. */
export const CALENDAR_DAILY_REWARDS: Record<number, CalendarDailyReward> = {
  1: { day: 1, label: "Fragmentos Comuns", icon: "🪨", templateId: "FRAGMENTO_COMUM", quantity: 5 },
  2: { day: 2, label: "Cenouras Crocantes", icon: "🥕", templateId: "CENOURA_PET", quantity: 8 },
  3: { day: 3, label: "Poção de Vida Pequena", icon: "🧪", templateId: "POCAO_VIDA_1", quantity: 3 },
  4: { day: 4, label: "Minério de Ferro", icon: "⛏️", templateId: "MINERIO_FERRO", quantity: 10 },
  5: { day: 5, label: "Poção de Mana Pequena", icon: "🔵", templateId: "POCAO_MANA_1", quantity: 3 },
  6: { day: 6, label: "Fruta de Mel", icon: "🍯", templateId: "FRUTA_MEL", quantity: 5 },
  7: { day: 7, label: "Fragmentos Raros", icon: "💎", templateId: "FRAGMENTO_RARO", quantity: 2 },
  8: { day: 8, label: "Peixe do Refúgio", icon: "🐟", templateId: "PEIXE_RIO", quantity: 8 },
  9: { day: 9, label: "Fragmentos Comuns", icon: "🪨", templateId: "FRAGMENTO_COMUM", quantity: 10 },
  10: { day: 10, label: "Ovo de Besta Divina", icon: "🥚", templateId: "OVO_BESTA_T1", quantity: 1 },
  11: { day: 11, label: "Lingote de Ferro", icon: "🔩", templateId: "LINGOTE_FERRO", quantity: 3 },
  12: { day: 12, label: "Poção de Vida Média", icon: "🍷", templateId: "POCAO_VIDA_2", quantity: 2 },
  13: { day: 13, label: "Melancia Lunar", icon: "🍉", templateId: "MELANCIA_LUNAR", quantity: 2 },
  14: { day: 14, label: "Fragmentos Raros", icon: "💎", templateId: "FRAGMENTO_RARO", quantity: 4 },
  15: { day: 15, label: "Cristal de Essência", icon: "💎", templateId: "CRISTAL_ESSENCIA", quantity: 2 },
  16: { day: 16, label: "Poção de Mana Média", icon: "💙", templateId: "POCAO_MANA_2", quantity: 2 },
  17: { day: 17, label: "Minério Obsidiano", icon: "🪨", templateId: "MINERIO_OBSIDIANO", quantity: 2 },
  18: { day: 18, label: "Fragmentos Comuns", icon: "🪨", templateId: "FRAGMENTO_COMUM", quantity: 20 },
  19: { day: 19, label: "Ração Especial", icon: "🍖", templateId: "RACAO_DOMADOR", quantity: 1 },
  20: { day: 20, label: "Ovo de Besta Divina", icon: "🥚", templateId: "OVO_BESTA_T2", quantity: 1 },
  21: { day: 21, label: "Fragmentos Épicos", icon: "🔮", templateId: "FRAGMENTO_EPICO", quantity: 1 },
  22: { day: 22, label: "Cristal Refinado", icon: "💠", templateId: "CRISTAL_REFINADO", quantity: 1 },
  23: { day: 23, label: "Peixe-Cicatriz", icon: "🐠", templateId: "PEIXE_CICATRIZ", quantity: 1 },
  24: { day: 24, label: "Poção de Vida Grande", icon: "⚗️", templateId: "POCAO_VIDA_3", quantity: 2 },
  25: { day: 25, label: "Fragmentos Raros", icon: "💎", templateId: "FRAGMENTO_RARO", quantity: 8 },
  26: { day: 26, label: "Ovo de Besta Divina", icon: "🥚", templateId: "OVO_BESTA_T3", quantity: 1 },
  27: { day: 27, label: "Chave da Roleta Arcana", icon: "🗝️", templateId: "CHAVE_ROLETA_ARCANA", quantity: 1 },
  28: { day: 28, label: "Baú de Suprimentos", icon: "🎁", templateId: "BAU_SUPRIMENTOS_MYTHREON", quantity: 1 },
  29: { day: 29, label: "Fragmentos Épicos", icon: "🔮", templateId: "FRAGMENTO_EPICO", quantity: 2 },
  30: { day: 30, label: "Ovo de Besta Divina Raro", icon: "🥚", templateId: "OVO_BESTA_T3", quantity: 1 },
  31: { day: 31, label: "Fragmentos Raros", icon: "💎", templateId: "FRAGMENTO_RARO", quantity: 12 },
};
export const CALENDAR_MONTHLY_REWARDS: Record<string, { templateId: string; name: string; image: string }> = {
  "2026-11": { templateId: "SKIN_CAPA_PRIMEIRO_CANTO", name: "Capa do Primeiro Canto", image: "/assets/items/SKIN_PREMIUM_MES_01.png" },
};
const DAY_MS = 86_400_000;

export function calendarDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
export function validCalendarDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const time = Date.parse(day + "T00:00:00Z");
  return Number.isFinite(time) && calendarDayKey(time) === day;
}
export function calendarMonthInfo(now = Date.now()) {
  const date = new Date(now), year = date.getUTCFullYear(), month = date.getUTCMonth();
  const key = calendarDayKey(now).slice(0, 7);
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return { key, days, firstWeekday, requiredPresence: Math.min(30, days), reward: CALENDAR_MONTHLY_REWARDS[key] };
}
export function calendarClaimedDays(character: Character, now = Date.now()) {
  const today = calendarDayKey(now), month = today.slice(0, 7);
  return [...new Set((character.calendarClaimedDays ?? []).filter(day => typeof day === "string" && validCalendarDay(day) && day.startsWith(month + "-") && day <= today))].sort();
}
export function calendarUnlockedSkins(character: Character) {
  // Old monthly markers are official award receipts, including the former full-bag delivery bug.
  const legacy = character.calendarMonthlySkinKey ? CALENDAR_MONTHLY_REWARDS[character.calendarMonthlySkinKey]?.templateId : undefined;
  const allowed = new Set(Object.values(CALENDAR_MONTHLY_REWARDS).map(reward => reward.templateId));
  return [...new Set([...(character.calendarUnlockedSkins ?? []), ...(legacy ? [legacy] : [])])].filter(id => allowed.has(id));
}
export function calendarProgress(character: Character, now = Date.now()) {
  const today = calendarDayKey(now), yesterday = calendarDayKey(now - DAY_MS);
  const month = calendarMonthInfo(now), days = calendarClaimedDays(character, now);
  const stored = Number.isSafeInteger(character.calendarStreak) && Number(character.calendarStreak) >= 0 && Number(character.calendarStreak) <= 36500 ? Number(character.calendarStreak) : 0;
  const claimedToday = days.includes(today) || character.calendarLastClaimDay === today;
  const streak = character.calendarLastClaimDay === today || character.calendarLastClaimDay === yesterday ? stored : 0;
  const nextStreak = claimedToday || character.calendarLastClaimDay === yesterday ? stored + 1 : 1;
  const nextGold = 500 + Math.min(nextStreak, CALENDAR_MAX_GOLD_STREAK) * 250;
  const nextResetAt = Date.parse(today + "T00:00:00Z") + DAY_MS;
  const monthlyUnlocked = !!month.reward && calendarUnlockedSkins(character).includes(month.reward.templateId);
  const weekProgress = streak > 0 && streak % CALENDAR_WEEK_DAYS === 0 ? CALENDAR_WEEK_DAYS : streak % CALENDAR_WEEK_DAYS;
  const todayNumber = Number(today.slice(-2));
  return { today, month, days, claimedToday, streak, nextStreak, nextGold, nextResetAt, monthlyUnlocked, weekProgress, todayReward: CALENDAR_DAILY_REWARDS[todayNumber] ?? CALENDAR_DAILY_REWARDS[1] };
}

export function calendarRewardForDay(day: string) {
  const number = Number(day.slice(-2));
  return CALENDAR_DAILY_REWARDS[number] ?? CALENDAR_DAILY_REWARDS[1];
}

export function calendarWeekStart(day: string) {
  const date = new Date(day + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return calendarDayKey(date.getTime());
}
export function calendarWeeklyMilestoneKey(today: string, streak: number) {
  const started = calendarDayKey(Date.parse(today + "T00:00:00Z") - (streak - 1) * DAY_MS);
  return started + ":" + Math.floor(streak / CALENDAR_WEEK_DAYS);
}
