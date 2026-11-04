import type { Character, Item } from "../types";
import { calendarProgress, calendarUnlockedSkins, calendarWeeklyMilestoneKey, CALENDAR_WEEK_DAYS, CALENDAR_WEEK_FRAGMENTS } from "../data/dailyCalendar";
import { createItem, FRAGMENT_TEMPLATES } from "../data/items";
import { addItem } from "./inventory";

export type CalendarClaimResult =
  | { success: false; error: string }
  | { success: true; character: Character; reward: string; weekly: boolean; monthly: boolean; delivery?: "mochila" | "depósito" };

function deliverCalendarItem(character: Character, item: Item): "mochila" | "depósito" | null {
  // addItem can partially fill a stack before returning false. Keep that attempt isolated.
  const inventory = structuredClone(character.inventory);
  if (addItem(inventory, structuredClone(item))) { character.inventory = inventory; return "mochila"; }
  if ((character.depot ?? []).length >= (character.depotMax ?? 300)) return null;
  character.depot = [...(character.depot ?? []), item];
  return "depósito";
}

export function claimCalendarReward(character: Character, now = Date.now()): CalendarClaimResult {
  const progress = calendarProgress(character, now);
  if (progress.claimedToday) return { success: false, error: "A recompensa de hoje já foi resgatada." };
  if (character.calendarLastClaimDay && character.calendarLastClaimDay > progress.today) return { success: false, error: "O relógio está anterior ao último resgate. Aguarde o dia correto do servidor." };
  if (!Number.isSafeInteger(character.calendarCoupons) || Number(character.calendarCoupons) < 1) return { success: false, error: "Adquira um Cupom de Resgate com Mythreon Coin." };

  const next = structuredClone(character);
  const milestone = calendarWeeklyMilestoneKey(progress.today, progress.nextStreak);
  let lastMilestone = next.calendarWeeklyRewardKey;
  // Preserve an old ISO receipt as the last completed milestone of the continuing streak.
  // Missing receipts may be recovered once; the new key prevents a second grant on days 8–13.
  if (lastMilestone && /^\d{4}-W\d{2}$/.test(lastMilestone) && progress.streak >= CALENDAR_WEEK_DAYS && character.calendarLastClaimDay) {
    lastMilestone = calendarWeeklyMilestoneKey(character.calendarLastClaimDay, progress.streak);
  }
  const weekly = progress.nextStreak >= CALENDAR_WEEK_DAYS && lastMilestone !== milestone;
  let delivery: "mochila" | "depósito" | undefined;
  if (weekly) {
    const location = deliverCalendarItem(next, createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_RARO, quantity: CALENDAR_WEEK_FRAGMENTS }));
    if (!location) return { success: false, error: "Libere um espaço na mochila ou no depósito para receber o bônus semanal. Seu cupom foi preservado." };
    delivery = location;
    next.calendarWeeklyRewardKey = milestone;
  }
  next.calendarCoupons = Number(next.calendarCoupons) - 1;
  next.calendarClaimedDays = [...progress.days, progress.today];
  next.calendarLastClaimDay = progress.today;
  next.calendarStreak = progress.nextStreak;
  next.calendarUnlockedSkins = calendarUnlockedSkins(character);
  next.gold += progress.nextGold;

  const monthly = !!progress.month.reward && next.calendarClaimedDays.length >= progress.month.requiredPresence && !progress.monthlyUnlocked;
  if (monthly && progress.month.reward) {
    next.calendarUnlockedSkins = [...new Set([...next.calendarUnlockedSkins, progress.month.reward.templateId])];
    next.calendarMonthlySkinKey = progress.month.key;
  }
  let reward = progress.nextGold.toLocaleString("pt-BR") + " gold";
  if (weekly) reward += ` + ${CALENDAR_WEEK_FRAGMENTS} Fragmentos Raros (${delivery})`;
  if (monthly) reward += " + " + progress.month.reward!.name + " (liberada no guarda-roupa)";
  return { success: true, character: next, reward, weekly, monthly, delivery };
}
