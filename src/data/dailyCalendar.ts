import type { Character } from "../types";

export const CALENDAR_COUPON_PRICE = 1;
export const CALENDAR_WEEK_DAYS = 7;
export const CALENDAR_WEEK_FRAGMENTS = 3;
export const CALENDAR_MAX_GOLD_STREAK = 30;
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
  return { today, month, days, claimedToday, streak, nextStreak, nextGold, nextResetAt, monthlyUnlocked, weekProgress };
}
export function calendarWeeklyMilestoneKey(today: string, streak: number) {
  const started = calendarDayKey(Date.parse(today + "T00:00:00Z") - (streak - 1) * DAY_MS);
  return started + ":" + Math.floor(streak / CALENDAR_WEEK_DAYS);
}
