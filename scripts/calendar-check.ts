import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { freshWorld, executeGame } from "../server/game";
import { ALL_ITEM_TEMPLATES, createItem } from "../src/data/items";
import { claimCalendarReward } from "../src/engine/dailyCalendar";
import { calendarDayKey, calendarMonthInfo, calendarProgress, calendarUnlockedSkins, validCalendarDay } from "../src/data/dailyCalendar";

const at = (day: string) => Date.parse(day + "T12:00:00Z");
function fixture() {
  const world = freshWorld("Calendário", randomUUID());
  world.character.introSeen = true; world.character.tutorialCompleted = true;
  world.character.inventory.items = []; world.character.calendarCoupons = 100; world.character.mythreonCoins = 10;
  return world;
}
assert.equal(calendarMonthInfo(at("2026-01-10")).days, 31);
assert.equal(calendarMonthInfo(at("2026-02-10")).days, 28);
assert.equal(calendarMonthInfo(at("2028-02-10")).days, 29);
assert.equal(calendarMonthInfo(at("2028-02-10")).requiredPresence, 29);
assert.equal(calendarMonthInfo(at("2026-04-10")).days, 30);
assert.equal(validCalendarDay("2026-02-30"), false);
assert.equal(validCalendarDay("2028-02-29"), true);
assert.equal(validCalendarDay("2026-2-1"), false);
assert.equal(calendarDayKey(Date.parse("2026-11-04T20:59:59-03:00")), "2026-11-04");
assert.equal(calendarDayKey(Date.parse("2026-11-04T21:00:00-03:00")), "2026-11-05");

let character = fixture().character, weeklyRewards = 0;
for (let day = 1; day <= 30; day++) {
  const now = at("2026-11-" + String(day).padStart(2, "0"));
  const before = structuredClone(character), claim = claimCalendarReward(character, now);
  assert(claim.success, "Presença " + day);
  assert.deepEqual(character, before, "O motor não deve modificar a entrada");
  character = claim.character;
  assert.equal(character.calendarStreak, day);
  assert.equal(claim.weekly, day % 7 === 0, "Somente marcos 7/14/21/28");
  if (claim.weekly) weeklyRewards++;
  assert.equal(claim.monthly, day === 30, "Presença de mês é independente da sequência anterior");
  const duplicate = claimCalendarReward(character, now);
  assert.equal(duplicate.success, false);
}
assert.equal(weeklyRewards, 4);
assert.equal(character.calendarCoupons, 70);
assert.equal(character.inventory.items.filter(item => item.templateId === "FRAGMENTO_RARO").reduce((sum, item) => sum + item.quantity, 0), 12);
assert.deepEqual(character.calendarUnlockedSkins, ["SKIN_CAPA_PRIMEIRO_CANTO"]);
assert.equal(character.calendarMonthlySkinKey, "2026-11");
assert.equal(character.inventory.items.some(item => item.templateId.startsWith("SKIN_")), false, "Skin conquistada não ocupa bolsa");
assert.equal(calendarProgress(character, at("2026-12-01")).days.length, 0);
assert(calendarUnlockedSkins(character).includes("SKIN_CAPA_PRIMEIRO_CANTO"), "Virada de mês mantém conquista");

const resumed = claimCalendarReward(character, at("2026-12-02"));
assert(resumed.success);assert.equal(resumed.character.calendarStreak, 1);
assert(calendarUnlockedSkins(resumed.character).includes("SKIN_CAPA_PRIMEIRO_CANTO"));
const highStreak = fixture().character;
highStreak.calendarStreak = 99;highStreak.calendarLastClaimDay = "2026-11-03";
const capped = claimCalendarReward(highStreak, at("2026-11-04"));
assert(capped.success);assert.equal(capped.character.gold - highStreak.gold, 8000, "Gold diário tem teto, sem escala infinita");

const legacy = fixture().character;legacy.calendarMonthlySkinKey = "2026-11";legacy.inventory.items = [];
assert(calendarUnlockedSkins(legacy).includes("SKIN_CAPA_PRIMEIRO_CANTO"), "Repara direito à skin de marcador antigo");
const equippedWorld = fixture();equippedWorld.character = legacy;
assert.equal((executeGame(equippedWorld, "equipCosmetic", ["SKIN_CAPA_PRIMEIRO_CANTO"]).result as any).success, true);
assert.equal(executeGame(equippedWorld, "equipCosmetic", ["SKIN_CAPA_PRIMEIRO_CANTO"]).world.character.cosmeticLoadout!.skinTemplateId, "SKIN_CAPA_PRIMEIRO_CANTO");
assert.throws(() => executeGame(fixture(), "equipCosmetic", ["SKIN_CAPA_PRIMEIRO_CANTO"]), /não possui/);
assert.throws(() => executeGame(fixture(), "claimDailyCalendar", ["2026-11-30"]), /Parâmetros inesperados/);
assert.throws(() => executeGame(fixture(), "buyCalendarCoupon", ["gratuito"]), /Parâmetros inesperados/);

// A streak crossing a month does not fabricate 30 presences in the new month.
const priorMonth = fixture().character;priorMonth.calendarLastClaimDay = "2026-10-31";priorMonth.calendarStreak = 29;
const firstDay = claimCalendarReward(priorMonth, at("2026-11-01"));assert(firstDay.success);assert.equal(firstDay.monthly, false);
assert.equal(firstDay.character.calendarClaimedDays!.length, 1);
const dirtyDays = fixture().character;
dirtyDays.calendarClaimedDays = ["2026-11-01", "2026-11-01", "2026-11-31", "2026-11-25", "2026-10-01"];
assert.deepEqual(calendarProgress(dirtyDays, at("2026-11-04")).days, ["2026-11-01"]);
const sameDay = fixture().character;sameDay.calendarLastClaimDay = "2026-11-04";sameDay.calendarClaimedDays = [];
assert.equal(claimCalendarReward(sameDay, at("2026-11-04")).success, false, "Marcador diário protege saves sem lista");

const full = fixture().character;
full.calendarStreak = 6;full.calendarLastClaimDay = "2026-11-06";
full.inventory.backpack.slots = 1;full.inventory.items = [createItem({ ...ALL_ITEM_TEMPLATES.FRAGMENTO_RARO, quantity: 998 })];
full.depotMax = 1;full.depot = [createItem(ALL_ITEM_TEMPLATES.MINERIO_FERRO)];
const unchanged = structuredClone(full);
assert.equal(claimCalendarReward(full, at("2026-11-07")).success, false);
assert.deepEqual(full, unchanged, "Bolsa/depósito cheios preservam cupom, gold, stack e presença");
full.depot = [];
const depot = claimCalendarReward(full, at("2026-11-07"));assert(depot.success);
assert.equal(depot.delivery, "depósito");assert.equal(depot.character.inventory.items[0].quantity, 998);
assert.equal(depot.character.depot[0].quantity, 3);assert.equal(depot.character.calendarCoupons, 99);

// A monthly skin is guaranteed even with both stores full.
const monthly = fixture().character;
monthly.calendarClaimedDays = Array.from({ length: 29 }, (_, i) => "2026-11-" + String(i + 1).padStart(2, "0"));
monthly.calendarLastClaimDay = "2026-11-29";monthly.calendarStreak = 29;
monthly.calendarWeeklyRewardKey = "2026-11-01:4";
monthly.inventory.backpack.slots = 1;monthly.inventory.items = [createItem(ALL_ITEM_TEMPLATES.MINERIO_FERRO)];
monthly.depotMax = 1;monthly.depot = [createItem(ALL_ITEM_TEMPLATES.MINERIO_FERRO)];
const monthlyClaim = claimCalendarReward(monthly, at("2026-11-30"));assert(monthlyClaim.success);
assert(monthlyClaim.monthly);assert(calendarUnlockedSkins(monthlyClaim.character).includes("SKIN_CAPA_PRIMEIRO_CANTO"));
assert.equal(monthlyClaim.character.inventory.items.length, 1);
assert.equal(monthlyClaim.character.depot.length, 1);
const reloaded = JSON.parse(JSON.stringify(monthlyClaim.character));
assert(calendarUnlockedSkins(reloaded).includes("SKIN_CAPA_PRIMEIRO_CANTO"));
const legacyWeek = fixture().character;
legacyWeek.calendarWeeklyRewardKey = "2026-W45";legacyWeek.calendarStreak = 7;legacyWeek.calendarLastClaimDay = "2026-11-07";
const legacyWeekClaim = claimCalendarReward(legacyWeek, at("2026-11-08"));assert(legacyWeekClaim.success);assert.equal(legacyWeekClaim.weekly, false, "Marcador ISO anterior não gera prêmio no oitavo dia");
const pendingWeek = fixture().character;
pendingWeek.calendarStreak = 8;pendingWeek.calendarLastClaimDay = "2026-11-08";pendingWeek.calendarWeeklyRewardKey = undefined;
const recoveredWeek = claimCalendarReward(pendingWeek, at("2026-11-09"));assert(recoveredWeek.success);assert.equal(recoveredWeek.weekly, true, "Marco sem recibo pode ser recuperado");
const nextDay = claimCalendarReward(recoveredWeek.character, at("2026-11-10"));assert(nextDay.success);assert.equal(nextDay.weekly, false, "Recuperação não duplica o marco no dia seguinte");
console.log("Calendário: meses reais/UTC, 30 presenças, marcos semanais, teto de gold, conservação, depósito, skin permanente/legada e equipar aprovados.");
