import type { Character, Item } from "../types";
import { calendarDayKey, calendarProgress, calendarRewardForDay, calendarUnlockedSkins, calendarWeekStart, calendarWeeklyMilestoneKey, CALENDAR_WEEK_DAYS, CALENDAR_WEEK_FRAGMENTS } from "../data/dailyCalendar";
import { ALL_ITEM_TEMPLATES, createItem, FRAGMENT_TEMPLATES } from "../data/items";
import { addItem } from "./inventory";
import { generateId } from "../utils/id";

export type CalendarClaimResult =
  | { success: false; error: string }
  | { success: true; character: Character; reward: string; weekly: boolean; monthly: boolean; delivery?: "mochila" | "depósito" };

function calendarItem(templateId: string, quantity: number): Item | null {
  const template = ALL_ITEM_TEMPLATES[templateId];
  if (!template) return null;
  return { ...createItem({ ...template, templateId: template.templateId, name: template.name, quantity }), uid: generateId(), quantity, stats: { ...template.stats }, upgradeLevel: 0 };
}

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
  const daily = progress.todayReward;
  if (daily.templateId) {
    const item = calendarItem(daily.templateId, daily.quantity ?? 1);
    if (!item) return { success: false, error: "A recompensa diária está indisponível. Tente novamente mais tarde." };
    const dailyDelivery = deliverCalendarItem(next, item);
    if (!dailyDelivery) return { success: false, error: "Libere um espaço na mochila ou no depósito para receber a recompensa de hoje." };
    delivery = dailyDelivery;
  }
  if (weekly) {
    const location = deliverCalendarItem(next, createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_RARO, quantity: CALENDAR_WEEK_FRAGMENTS }));
    if (!location) return { success: false, error: "Libere um espaço na mochila ou no depósito para receber o bônus semanal. Seu cupom foi preservado." };
    delivery = location;
    next.calendarWeeklyRewardKey = milestone;
  }
  next.calendarClaimedDays = [...progress.days, progress.today];
  next.calendarLastClaimDay = progress.today;
  next.calendarStreak = progress.nextStreak;
  next.calendarUnlockedSkins = calendarUnlockedSkins(character);
  next.gold += progress.nextGold + (daily.gold ?? 0);

  const monthly = !!progress.month.reward && next.calendarClaimedDays.length >= progress.month.requiredPresence && !progress.monthlyUnlocked;
  if (monthly && progress.month.reward) {
    next.calendarUnlockedSkins = [...new Set([...next.calendarUnlockedSkins, progress.month.reward.templateId])];
    next.calendarMonthlySkinKey = progress.month.key;
  }
  let reward = `${daily.icon} ${daily.label} ×${daily.quantity ?? 1} + ${progress.nextGold.toLocaleString("pt-BR")} gold`;
  if (weekly) reward += ` + ${CALENDAR_WEEK_FRAGMENTS} Fragmentos Raros (${delivery})`;
  if (monthly) reward += " + " + progress.month.reward!.name + " (liberada no guarda-roupa)";
  return { success: true, character: next, reward, weekly, monthly, delivery };
}

export function recoverCalendarDay(character: Character, day: string, now = Date.now()): CalendarClaimResult {
  const today = calendarDayKey(now), progress = calendarProgress(character, now);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day >= today || day.slice(0, 7) !== progress.month.key) return { success: false, error: "Escolha um dia perdido deste mês." };
  if (progress.days.includes(day)) return { success: false, error: "Esse dia já foi resgatado." };
  if (!Number.isSafeInteger(character.calendarCoupons) || Number(character.calendarCoupons) < 1) return { success: false, error: "Você precisa de um Cupom de Resgate para recuperar um dia." };
  const reward = calendarRewardForDay(day), item = reward.templateId ? calendarItem(reward.templateId, reward.quantity ?? 1) : null;
  if (!item) return { success: false, error: "A recompensa deste dia está indisponível." };
  const next = structuredClone(character), delivery = deliverCalendarItem(next, item);
  if (!delivery) return { success: false, error: "Libere espaço na mochila ou no depósito antes de recuperar o dia." };
  next.calendarCoupons = Number(next.calendarCoupons) - 1;
  next.calendarClaimedDays = [...new Set([...progress.days, day])].sort();
  next.calendarLastClaimDay = day;
  next.calendarStreak = 1;
  next.gold += reward.gold ?? 0;
  return { success: true, character: next, reward: `${reward.icon} ${reward.label} ×${reward.quantity ?? 1} recuperado`, weekly: false, monthly: false, delivery };
}

export function recoverCalendarWeek(character: Character, now = Date.now()): CalendarClaimResult {
  const today = calendarDayKey(now), progress = calendarProgress(character, now), start = calendarWeekStart(today);
  const missing = Array.from({ length: 7 }, (_, index) => calendarDayKey(Date.parse(start + "T00:00:00Z") + index * 86_400_000)).filter(day => day < today && !progress.days.includes(day) && day.startsWith(progress.month.key));
  if (!missing.length) return { success: false, error: "Não há dias perdidos nesta semana para recuperar." };
  if (Number(character.calendarCoupons ?? 0) < missing.length) return { success: false, error: `Você precisa de ${missing.length} Cupons de Resgate para recuperar os dias restantes desta semana.` };
  let next = structuredClone(character), labels: string[] = [];
  for (const day of missing) {
    const result = recoverCalendarDay(next, day, now);
    if (!result.success) return result;
    next = result.character; labels.push(result.reward);
  }
  return { success: true, character: next, reward: `${missing.length} dias recuperados · ${labels.join(", ")}`, weekly: false, monthly: false };
}
