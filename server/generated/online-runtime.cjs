// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/http.ts
var http_exports = {};
__export(http_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(http_exports);
var import_pg = require("pg");

// src/data/cosmetics.ts
var COSMETIC_SLOTS = [
  { key: "skinTemplateId", label: "Skin humana" },
  { key: "matrixGlowTemplateId", label: "Luminesc\xEAncia da Matriz" },
  { key: "petAuraTemplateId", label: "Aura do Pet" },
  { key: "bossAddonTemplateId", label: "Addon do Boss" }
];
var COSMETIC_DEFINITIONS = {
  SKIN_MANTO_NEBULOSA: { slot: "skinTemplateId", label: "Manto da Nebulosa", className: "cosmetic-skin-nebula", sprite: "/assets/players/skins/SKIN_MANTO_NEBULOSA.png" },
  SKIN_CAPA_PRIMEIRO_CANTO: { slot: "skinTemplateId", label: "Capa do Primeiro Canto", className: "cosmetic-skin-first-canto", sprite: "/assets/items/SKIN_PREMIUM_MES_01.png" },
  LUMINESCENCIA_MATRIZ: { slot: "matrixGlowTemplateId", label: "Luminesc\xEAncia da Matriz", className: "cosmetic-matrix-luminescence" },
  LUMINESCENCIA_PET: { slot: "petAuraTemplateId", label: "Aura da Besta Divina", className: "cosmetic-pet-luminescence" },
  ADDON_BOSS_LUMINESCENTE: { slot: "bossAddonTemplateId", label: "Addon do Boss Luminescente", className: "cosmetic-addon-boss", sprite: "/assets/items/ADDON_BOSS_LUMINESCENTE.png" }
};

// src/data/dailyCalendar.ts
var CALENDAR_COUPON_PRICE = 1;
var CALENDAR_WEEK_DAYS = 7;
var CALENDAR_WEEK_FRAGMENTS = 3;
var CALENDAR_MAX_GOLD_STREAK = 30;
var CALENDAR_DAILY_REWARDS = {
  1: { day: 1, label: "Fragmentos Comuns", icon: "\u{1FAA8}", templateId: "FRAGMENTO_COMUM", quantity: 5 },
  2: { day: 2, label: "Cenouras Crocantes", icon: "\u{1F955}", templateId: "CENOURA_PET", quantity: 8 },
  3: { day: 3, label: "Po\xE7\xE3o de Vida Pequena", icon: "\u{1F9EA}", templateId: "POCAO_VIDA_1", quantity: 3 },
  4: { day: 4, label: "Min\xE9rio de Ferro", icon: "\u26CF\uFE0F", templateId: "MINERIO_FERRO", quantity: 10 },
  5: { day: 5, label: "Po\xE7\xE3o de Mana Pequena", icon: "\u{1F535}", templateId: "POCAO_MANA_1", quantity: 3 },
  6: { day: 6, label: "Fruta de Mel", icon: "\u{1F36F}", templateId: "FRUTA_MEL", quantity: 5 },
  7: { day: 7, label: "Fragmentos Raros", icon: "\u{1F48E}", templateId: "FRAGMENTO_RARO", quantity: 2 },
  8: { day: 8, label: "Peixe do Ref\xFAgio", icon: "\u{1F41F}", templateId: "PEIXE_RIO", quantity: 8 },
  9: { day: 9, label: "Fragmentos Comuns", icon: "\u{1FAA8}", templateId: "FRAGMENTO_COMUM", quantity: 10 },
  10: { day: 10, label: "Ovo de Besta Divina", icon: "\u{1F95A}", templateId: "OVO_BESTA_T1", quantity: 1 },
  11: { day: 11, label: "Lingote de Ferro", icon: "\u{1F529}", templateId: "LINGOTE_FERRO", quantity: 3 },
  12: { day: 12, label: "Po\xE7\xE3o de Vida M\xE9dia", icon: "\u{1F377}", templateId: "POCAO_VIDA_2", quantity: 2 },
  13: { day: 13, label: "Melancia Lunar", icon: "\u{1F349}", templateId: "MELANCIA_LUNAR", quantity: 2 },
  14: { day: 14, label: "Fragmentos Raros", icon: "\u{1F48E}", templateId: "FRAGMENTO_RARO", quantity: 4 },
  15: { day: 15, label: "Cristal de Ess\xEAncia", icon: "\u{1F48E}", templateId: "CRISTAL_ESSENCIA", quantity: 2 },
  16: { day: 16, label: "Po\xE7\xE3o de Mana M\xE9dia", icon: "\u{1F499}", templateId: "POCAO_MANA_2", quantity: 2 },
  17: { day: 17, label: "Min\xE9rio Obsidiano", icon: "\u{1FAA8}", templateId: "MINERIO_OBSIDIANO", quantity: 2 },
  18: { day: 18, label: "Fragmentos Comuns", icon: "\u{1FAA8}", templateId: "FRAGMENTO_COMUM", quantity: 20 },
  19: { day: 19, label: "Ra\xE7\xE3o Especial", icon: "\u{1F356}", templateId: "RACAO_DOMADOR", quantity: 1 },
  20: { day: 20, label: "Ovo de Besta Divina", icon: "\u{1F95A}", templateId: "OVO_BESTA_T2", quantity: 1 },
  21: { day: 21, label: "Fragmentos \xC9picos", icon: "\u{1F52E}", templateId: "FRAGMENTO_EPICO", quantity: 1 },
  22: { day: 22, label: "Cristal Refinado", icon: "\u{1F4A0}", templateId: "CRISTAL_REFINADO", quantity: 1 },
  23: { day: 23, label: "Peixe-Cicatriz", icon: "\u{1F420}", templateId: "PEIXE_CICATRIZ", quantity: 1 },
  24: { day: 24, label: "Po\xE7\xE3o de Vida Grande", icon: "\u2697\uFE0F", templateId: "POCAO_VIDA_3", quantity: 2 },
  25: { day: 25, label: "Fragmentos Raros", icon: "\u{1F48E}", templateId: "FRAGMENTO_RARO", quantity: 8 },
  26: { day: 26, label: "Ovo de Besta Divina", icon: "\u{1F95A}", templateId: "OVO_BESTA_T3", quantity: 1 },
  27: { day: 27, label: "Chave da Roleta Arcana", icon: "\u{1F5DD}\uFE0F", templateId: "CHAVE_ROLETA_ARCANA", quantity: 1 },
  28: { day: 28, label: "Ba\xFA de Suprimentos", icon: "\u{1F381}", templateId: "BAU_SUPRIMENTOS_MYTHREON", quantity: 1 },
  29: { day: 29, label: "Fragmentos \xC9picos", icon: "\u{1F52E}", templateId: "FRAGMENTO_EPICO", quantity: 2 },
  30: { day: 30, label: "Ovo de Besta Divina Raro", icon: "\u{1F95A}", templateId: "OVO_BESTA_T3", quantity: 1 },
  31: { day: 31, label: "Fragmentos Raros", icon: "\u{1F48E}", templateId: "FRAGMENTO_RARO", quantity: 12 }
};
var CALENDAR_MONTHLY_REWARDS = {
  "2026-11": { templateId: "SKIN_CAPA_PRIMEIRO_CANTO", name: "Capa do Primeiro Canto", image: "/assets/items/SKIN_PREMIUM_MES_01.png" }
};
var DAY_MS = 864e5;
function calendarDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
function validCalendarDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const time = Date.parse(day + "T00:00:00Z");
  return Number.isFinite(time) && calendarDayKey(time) === day;
}
function calendarMonthInfo(now = Date.now()) {
  const date = new Date(now), year = date.getUTCFullYear(), month = date.getUTCMonth();
  const key = calendarDayKey(now).slice(0, 7);
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return { key, days, firstWeekday, requiredPresence: Math.min(30, days), reward: CALENDAR_MONTHLY_REWARDS[key] };
}
function calendarClaimedDays(character, now = Date.now()) {
  const today = calendarDayKey(now), month = today.slice(0, 7);
  return [...new Set((character.calendarClaimedDays ?? []).filter((day) => typeof day === "string" && validCalendarDay(day) && day.startsWith(month + "-") && day <= today))].sort();
}
function calendarUnlockedSkins(character) {
  const legacy = character.calendarMonthlySkinKey ? CALENDAR_MONTHLY_REWARDS[character.calendarMonthlySkinKey]?.templateId : void 0;
  const allowed = new Set(Object.values(CALENDAR_MONTHLY_REWARDS).map((reward) => reward.templateId));
  return [.../* @__PURE__ */ new Set([...character.calendarUnlockedSkins ?? [], ...legacy ? [legacy] : []])].filter((id) => allowed.has(id));
}
function calendarProgress(character, now = Date.now()) {
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
function calendarRewardForDay(day) {
  const number = Number(day.slice(-2));
  return CALENDAR_DAILY_REWARDS[number] ?? CALENDAR_DAILY_REWARDS[1];
}
function calendarWeekStart(day) {
  const date = /* @__PURE__ */ new Date(day + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return calendarDayKey(date.getTime());
}
function calendarWeeklyMilestoneKey(today, streak) {
  const started = calendarDayKey(Date.parse(today + "T00:00:00Z") - (streak - 1) * DAY_MS);
  return started + ":" + Math.floor(streak / CALENDAR_WEEK_DAYS);
}

// src/engine/cosmeticOwnership.ts
function ownedCosmeticLoadout(character) {
  if (!character.cosmeticLoadout || !Object.values(character.cosmeticLoadout).some(Boolean)) return {};
  const owned = /* @__PURE__ */ new Set([
    ...character.unlockedCosmetics ?? [],
    ...calendarUnlockedSkins(character),
    ...[...character.inventory.items, ...character.depot ?? [], ...Object.values(character.equipped ?? {})].filter((item) => item && COSMETIC_DEFINITIONS[item.templateId]).map((item) => item.templateId)
  ]);
  const valid = {};
  for (const { key } of COSMETIC_SLOTS) {
    const id = character.cosmeticLoadout[key];
    if (id && COSMETIC_DEFINITIONS[id]?.slot === key && owned.has(id)) valid[key] = id;
  }
  return valid;
}
function normalizeCosmeticOwnership(character) {
  if (character.cosmeticLoadout) character.cosmeticLoadout = ownedCosmeticLoadout(character);
}

// server/world.ts
var import_node_crypto2 = require("node:crypto");

// server/marketAnalytics.ts
async function marketSalesHistory(db, templateIds) {
  if (!templateIds.length) return [];
  const result = await db.query(`
    with sales as (
      select item->>'templateId' as template_id,coalesce(item->>'rarity','COMUM') as rarity,
        coalesce((item->>'tier')::int,1) as tier,coalesce((item->>'upgradeLevel')::int,0) as upgrade_level,
        currency,price::numeric as price,greatest(1,coalesce((item->>'quantity')::numeric,1)) as units,sold_at
      from public.world_market_listings
      where status='sold' and sold_at is not null and item->>'templateId'=any($1::text[])
      union all
      select lot.template_id,lot.rarity,lot.tier,lot.upgrade_level,
        case when tx.gold_price>0 then 'GOLD' else 'COINS' end,
        case when tx.gold_price>0 then tx.gold_price else tx.mythreon_coins_price end::numeric,
        lot.units,tx.completed_at
      from public.world_trade_transactions tx
      cross join lateral (
        select min(item->>'templateId') as template_id,min(coalesce(item->>'rarity','COMUM')) as rarity,
          min(coalesce((item->>'tier')::int,1)) as tier,min(coalesce((item->>'upgradeLevel')::int,0)) as upgrade_level,
          sum(greatest(1,coalesce((item->>'quantity')::numeric,1))) as units
        from jsonb_array_elements(tx.items) item
        having count(*)>0 and count(distinct jsonb_build_array(item->>'templateId',coalesce(item->>'rarity','COMUM'),coalesce((item->>'tier')::int,1),coalesce((item->>'upgradeLevel')::int,0)))=1
      ) lot
      where lot.template_id=any($1::text[]) and tx.counterparty_items='[]'::jsonb
        and ((tx.gold_price>0 and tx.mythreon_coins_price=0) or (tx.gold_price=0 and tx.mythreon_coins_price>0))
    ), totals as (
      select template_id,rarity,tier,upgrade_level,currency,count(*)::int as sale_events,sum(units) as units_sold,
        round(sum(price)/sum(units),2) as average_unit_price,
        round(min(price/units),2) as lowest_unit_price,round(max(price/units),2) as highest_unit_price,max(sold_at) as last_sold_at
      from sales group by template_id,rarity,tier,upgrade_level,currency
    ), days as (
      select template_id,rarity,tier,upgrade_level,currency,(sold_at at time zone 'UTC')::date as day,
        sum(units) as units,round(sum(price)/sum(units),2) as average
      from sales where sold_at>=now()-interval '30 days'
      group by template_id,rarity,tier,upgrade_level,currency,(sold_at at time zone 'UTC')::date
    )
    select totals.*,coalesce((
      select jsonb_agg(jsonb_build_object('day',day,'units',units,'average',average) order by day)
      from days where days.template_id=totals.template_id and days.rarity=totals.rarity and days.tier=totals.tier
        and days.upgrade_level=totals.upgrade_level and days.currency=totals.currency
    ),'[]'::jsonb) as daily from totals order by template_id,rarity,tier,upgrade_level,currency
  `, [templateIds]);
  return result.rows.map((row) => ({
    ...row,
    sale_events: Number(row.sale_events),
    units_sold: Number(row.units_sold),
    tier: Number(row.tier),
    upgrade_level: Number(row.upgrade_level),
    average_unit_price: Number(row.average_unit_price),
    lowest_unit_price: Number(row.lowest_unit_price),
    highest_unit_price: Number(row.highest_unit_price),
    daily: (row.daily ?? []).map((day) => ({ ...day, units: Number(day.units), average: Number(day.average) }))
  }));
}

// src/data/worldJourney.ts
var JOURNEY_CHAPTERS = [
  { id: "BOSQUE_LYSS", name: "Bosque de Lyss", subtitle: "O primeiro eco", story: "Ap\xF3s a Grande Ruptura, o Primeiro Canto sobrevive em fragmentos. Em Lyss, Mirelle acolhe os rec\xE9m-despertos e Sinax ensina a ouvir as mem\xF3rias das Consci\xEAncias.", conflict: "O Espectro de Brasa contamina ra\xEDzes e criaturas. Aprender a ca\xE7ar \xE9 apenas o come\xE7o: voc\xEA precisa decidir como carregar os ecos do mundo.", resolution: "A brasa vencida revela uma cicatriz que aponta para Dhor. A jornada prossegue quando o bosque estiver protegido.", mission: "Praga de Vespas", bossId: "ESPECTRO", bossTitle: "O Espectro de Brasa", bossLevel: 15, hunts: [{ id: "VESPA", name: "Vespas", count: 25 }] },
  { id: "PICO_DHOR", name: "Pico de Dhor", subtitle: "A Fenda T\xE9rmica", story: "Em Dhor, duas lembran\xE7as da Ruptura disputam a mesma montanha: lava de um lado, inverno im\xF3vel do outro. A neve n\xE3o apaga a chama e a chama n\xE3o derrete toda a neve.", conflict: "Estude os Elementais de Gelo e os Morcegos de Magma. Bolk precisa das duas assinaturas para estabilizar uma rota entre as encostas.", resolution: "O Colosso guarda o ponto onde as for\xE7as se encontram. Venc\xEA-lo permite preparar a descida at\xE9 Azhar ou desviar para Veyra.", mission: "Entre a Geada e a Brasa", bossId: "COLOSSO", bossTitle: "O Colosso de Dhor", bossLevel: 24, hunts: [{ id: "ELEMENTAL_GELO", name: "Elementais de Gelo", count: 40 }, { id: "MORCEGO_MAGMA", name: "Morcegos de Magma", count: 40 }], pass: { questId: "PASS_DHOR", npc: "Ferreiro Bolk", level: 15, gold: 3500, requires: "LYSS_BOSS", items: [{ id: "A1", count: 30 }, { id: "A2", count: 20 }, { id: "S1", count: 10 }] } },
  { id: "MAR_AZHAR", name: "Mar de Azhar", subtitle: "As vozes submersas", story: "O degelo de Dhor encontra Azhar, onde os pilares afogados ainda vibram com o Primeiro Canto. O mar guarda mem\xF3rias que a terra esqueceu.", conflict: "Serpentes e Medusas cercam os pilares de navega\xE7\xE3o. Recolha sinais das criaturas para que a expedi\xE7\xE3o alcance o santu\xE1rio submerso.", resolution: "O Leviat\xE3 protege a mem\xF3ria das primeiras cidades. Sua derrota revela a rota para Asterion e as dunas de Kaelor.", mission: "Cartografia das Mar\xE9s", bossId: "LEVIATA", bossTitle: "Leviat\xE3 de Azhar", bossLevel: 43, hunts: [{ id: "SERPENTE", name: "Serpentes", count: 60 }, { id: "MEDUSA", name: "Medusas", count: 60 }], pass: { questId: "PASS_AZHAR", npc: "Cart\xF3grafa Nara", level: 26, gold: 18e3, requires: "PICO_DHOR_BOSS", items: [{ id: "A9", count: 40 }, { id: "A11", count: 30 }, { id: "S7", count: 15 }] } },
  { id: "PANTANO_VEYRA", name: "P\xE2ntano de Veyra", subtitle: "A mem\xF3ria que cria ra\xEDzes", story: "A oeste de Dhor, a \xE1gua da montanha alimenta um p\xE2ntano luminoso. Aqui as mem\xF3rias crescem como cip\xF3s, e o veneno protege aquilo que n\xE3o deve ser esquecido.", conflict: "A resina da Ruptura tornou os Sapos-Miasma e os Cip\xF3s da Mem\xF3ria agressivos. Separe a lembran\xE7a viva da contamina\xE7\xE3o.", resolution: "A Matriarca do Lodo mant\xE9m o \xFAltimo c\xEDrculo de ra\xEDzes. Ao venc\xEA-la, voc\xEA preserva uma mem\xF3ria de Lyss que o fogo n\xE3o conseguiu consumir.", mission: "Ra\xEDzes que Recordam", bossId: "MATRIARCA_LODO", bossTitle: "Matriarca do Lodo", bossLevel: 44, hunts: [{ id: "SAPO_MIASMA", name: "Sapos-Miasma", count: 60 }, { id: "CIPO_MEMORIA", name: "Cip\xF3s da Mem\xF3ria", count: 60 }], pass: { questId: "PASS_VEYRA", npc: "Herbalista Tom\xE9", level: 26, gold: 15e3, requires: "PICO_DHOR_BOSS", items: [{ id: "A4", count: 40 }, { id: "A11", count: 25 }, { id: "S5", count: 15 }] } },
  { id: "RUINAS_ASTERION", name: "Ru\xEDnas de Asterion", subtitle: "O arquivo partido", story: "Asterion tentou aprisionar o Primeiro Canto em pedra. Seus corredores guardam tanto conhecimento como os erros que antecederam a Ruptura.", conflict: "M\xFAmias e Cultistas disputam os registros. Recupere o caminho at\xE9 o arquivo sem repetir a obsess\xE3o de seus antigos mestres.", resolution: "O Guardi\xE3o distingue herdeiros de saqueadores. Ao superar sua prova, a Cicatriz Profunda deixa de ser apenas uma hist\xF3ria proibida.", mission: "P\xE1ginas sob a Areia", bossId: "GUARDIAO", bossTitle: "Guardi\xE3o de Asterion", bossLevel: 66, hunts: [{ id: "MUMIA", name: "M\xFAmias", count: 80 }, { id: "CULTISTA", name: "Cultistas", count: 80 }], pass: { questId: "PASS_ASTERION", npc: "Arquivista Sinax", level: 46, gold: 5e4, requires: "MAR_AZHAR_BOSS", items: [{ id: "A12", count: 60 }, { id: "A5", count: 40 }, { id: "S6", count: 20 }] } },
  { id: "DESERTO_KAELOR", name: "Deserto de Kaelor", subtitle: "O sol aprisionado", story: "Al\xE9m de Azhar, o calor da Ruptura vitrificou as dunas. Metal, fogo e miragens guardam os caminhos entre observat\xF3rios enterrados.", conflict: "Escaravelhos V\xEDtreos e Espectros Solares alimentam um farol quebrado. Silencie seus reflexos antes de cruzar as dunas.", resolution: "A Sentinela do Z\xEAnite confunde viajantes com invasores. Desfaz\xEA-la devolve \xE0 noite o c\xE9u de Kaelor.", mission: "Reflexos do Sol Partido", bossId: "SENTINELA_ZENITE", bossTitle: "Sentinela do Z\xEAnite", bossLevel: 68, hunts: [{ id: "ESCARAVELHO_VITREO", name: "Escaravelhos V\xEDtreos", count: 80 }, { id: "ESPECTRO_SOLAR", name: "Espectros Solares", count: 80 }], pass: { questId: "PASS_KAELOR", npc: "Cart\xF3grafa Nara", level: 46, gold: 65e3, requires: "MAR_AZHAR_BOSS", items: [{ id: "A13", count: 60 }, { id: "A6", count: 40 }, { id: "S10", count: 20 }] } },
  { id: "CICATRIZ_PROFUNDA", name: "Cicatriz Profunda", subtitle: "O sil\xEAncio entre os ecos", story: "Na Cicatriz, o mundo ainda n\xE3o decidiu que forma ter\xE1. O Vazio devora identidades e oferece poder \xE0queles que abandonam suas mem\xF3rias.", conflict: "Crias do Vazio e Olhos do Vazio vigiam o caminho. Leve consigo o que aprendeu, sem confundir transforma\xE7\xE3o com esquecimento.", resolution: "O Devorador \xE9 a fome deixada pela Ruptura. Enfrent\xE1-lo n\xE3o apaga o passado: abre espa\xE7o para escrever o pr\xF3ximo canto.", mission: "Conservar o Pr\xF3prio Nome", bossId: "DEVORADOR", bossTitle: "O Devorador", bossLevel: 95, hunts: [{ id: "CRIA_VAZIO", name: "Crias do Vazio", count: 100 }, { id: "OLHO_VAZIO", name: "Olhos do Vazio", count: 100 }], pass: { questId: "PASS_CICATRIZ", npc: "Anci\xE3 Seraphine", level: 71, gold: 2e5, requires: "RUINAS_ASTERION_BOSS", items: [{ id: "A14", count: 80 }, { id: "A15", count: 40 }, { id: "S7", count: 30 }] } }
];

// src/utils/id.ts
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : random & 3 | 8;
    return value.toString(16);
  });
}

// src/data/items.ts
function createItem(template) {
  return { uid: generateId(), category: "ARMA", tier: 1, rarity: "COMUM", stats: {}, affixes: [], stackable: false, maxStack: 1, quantity: 1, icon: "\u{1F4E6}", upgradeLevel: 0, ...template };
}
var TIERS = [1, 2, 3, 4, 5];
var FAMILIES = [
  // ARMAS (ATK/MATK focado)
  { key: "ESPADA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u2694\uFE0F", names: ["Espada de Aprendiz", "L\xE2mina de A\xE7o-Estrela", "Sabre de Coral Negro", "Espada Real de Asterion", "L\xE2mina da Cicatriz"], stats: { atk: [12, 28, 65, 130, 260], def: [2, 5, 10, 20, 40] } },
  { key: "MACHADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1FA93}", names: ["Machado de Lenhador", "Machado de Pedra-Fenda", "Machado de Mar\xE9 Funda", "Machado Carrasco", "Cutelo Abissal"], stats: { atk: [15, 35, 80, 160, 320] } },
  { key: "CAJADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1FA84}", names: ["Cajado de Aprendiz", "Cajado de Cristal", "Cajado de P\xE9rola", "Cajado Astral", "Cajado do Vazio"], stats: { matk: [10, 25, 55, 110, 220], mp: [20, 50, 120, 250, 500] } },
  { key: "VARINHA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u2728", names: ["Varinha de Galho", "Varinha de Quartzo", "Varinha de Concha", "Varinha de Obsidiana", "Varinha do Abismo"], stats: { matk: [8, 18, 40, 80, 160], mp: [30, 70, 160, 320, 640], crit: [0.02, 0.04, 0.06, 0.08, 0.1] } },
  { key: "ARCO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1F3F9}", names: ["Arco de Ca\xE7a", "Arco de Chifre", "Arco de Barbatana", "Arco Celeste", "Arco do Eclipse"], stats: { atk: [10, 24, 55, 110, 220], hit: [0.02, 0.04, 0.06, 0.08, 0.1] } },
  // ARMADURAS (ARM/HP focado)
  { key: "CAPACETE", category: "ARMADURA", slot: "CAPACETE", icon: "\u{1F3A9}", names: ["Capuz de Folha", "Elmo de Granito", "Elmo de Escamas", "Elmo de Bronze", "Coroa da Cicatriz"], stats: { arm: [3, 8, 18, 35, 70], hp: [30, 80, 180, 380, 800] } },
  { key: "PEITORAL", category: "ARMADURA", slot: "ARMADURA", icon: "\u{1F455}", names: ["T\xFAnica de Casca", "Coura\xE7a de Fenda", "Peitoral de Coral", "Coura\xE7a de Asterion", "Armadura do Abismo"], stats: { arm: [5, 12, 28, 55, 110], hp: [50, 120, 280, 580, 1200] } },
  { key: "LUVAS", category: "ARMADURA", slot: "LUVAS", icon: "\u{1F9E4}", names: ["Manoplas de Vinha", "Luvas de Couro", "Manoplas de Escama", "Manoplas de Bronze", "Garras da Cicatriz"], stats: { arm: [2, 5, 10, 20, 40], atk: [2, 5, 12, 25, 50] } },
  { key: "CALCAS", category: "ARMADURA", slot: "CALCAS", icon: "\u{1F456}", names: ["Perneiras de Musgo", "Perneiras de Pedra", "Cal\xE7as de Algas", "Grevas de Asterion", "Grevas do Abismo"], stats: { arm: [4, 9, 20, 40, 80], hp: [40, 90, 200, 420, 850] } },
  { key: "BOTAS", category: "ARMADURA", slot: "BOTAS", icon: "\u{1F462}", names: ["Botas de Raiz", "Botas de Pele", "Botas de Mar\xE9", "Botas das Ru\xEDnas", "Botas do Vazio"], stats: { arm: [2, 6, 12, 25, 50], spd: [0.05, 0.08, 0.12, 0.16, 0.2] } },
  // JOIAS (Mistas)
  { key: "COLAR", category: "JOIA", slot: "COLAR", icon: "\u{1F4FF}", names: ["Colar de Semente", "Colar de Presa", "Colar de P\xE9rola", "Colar de Asterion", "Colar da Cicatriz"], stats: { hp: [30, 70, 160, 330, 680], mp: [15, 35, 80, 165, 340] } },
  { key: "ANEL", category: "JOIA", slot: "ANEL_I", icon: "\u{1F48D}", names: ["Anel de Seiva", "Anel de Quartzo", "Anel de Coral", "Anel Estelar", "Anel do Abismo"], stats: { hp: [15, 35, 80, 165, 340], atk: [3, 7, 15, 30, 60], matk: [3, 7, 15, 30, 60] } },
  { key: "PULSEIRA", category: "PULSEIRA", slot: "PULSEIRA", icon: "\u{1F4FF}", names: ["Bracelete de Broto", "Pulseira da Seiva", "Bracelete de Mar\xE9", "Manilha Estelar", "Bracelete do Eclipse Sereno"], stats: { hp: [20, 45, 100, 220, 450], mp: [15, 35, 80, 180, 360], hpRegen: [1, 2, 3, 5, 8], mpRegen: [1, 2, 3, 5, 8] } },
  // ESCUDOS
  { key: "ESCUDO", category: "ESCUDO", slot: "OFF_HAND", icon: "\u{1F6E1}\uFE0F", names: ["Escudo de Corti\xE7a", "Escudo de Granito", "Escudo de Carapa\xE7a", "Escudo de Asterion", "Escudo do Abismo"], stats: { def: [4, 10, 22, 45, 90], arm: [2, 5, 12, 25, 50], blk: [0.05, 0.08, 0.1, 0.12, 0.15] } }
];
function buildTemplates() {
  const out = {};
  for (const f of FAMILIES) {
    TIERS.forEach((tier, i) => {
      const stats = {};
      for (const [k, arr] of Object.entries(f.stats)) {
        const v = arr[i];
        if (v) stats[k] = v;
      }
      const id = `${f.key}_T${tier}`;
      out[id] = createItem({ templateId: id, name: f.names[i], category: f.category, slot: f.slot, tier, stats, icon: f.icon });
    });
  }
  return out;
}
var SWAMP_EQUIPMENT_TEMPLATES = {
  CAPUZ_MIASMA_T3: createItem({ templateId: "CAPUZ_MIASMA_T3", name: "Capuz do Miasma", category: "ARMADURA", slot: "CAPACETE", tier: 3, stats: { arm: 22, hp: 240, mp: 60, resMagico: 0.04 }, icon: "\u2623\uFE0F" }),
  MANTO_MEMORIA_T3: createItem({ templateId: "MANTO_MEMORIA_T3", name: "Manto da Mem\xF3ria", category: "ARMADURA", slot: "ARMADURA", tier: 3, stats: { arm: 32, hp: 360, matk: 25 }, icon: "\u{1F9E5}" }),
  LUVAS_LAMINA_T3: createItem({ templateId: "LUVAS_LAMINA_T3", name: "Luvas da L\xE2mina", category: "ARMADURA", slot: "LUVAS", tier: 3, stats: { arm: 14, atk: 22, hit: 0.04 }, icon: "\u{1FABD}" }),
  BOTAS_SILTE_T3: createItem({ templateId: "BOTAS_SILTE_T3", name: "Botas do Silte", category: "ARMADURA", slot: "BOTAS", tier: 3, stats: { arm: 15, spd: 0.14, dge: 0.03 }, icon: "\u{1F97E}" }),
  PULSEIRA_VEYRA_T3: createItem({ templateId: "PULSEIRA_VEYRA_T3", name: "Pulseira da Matriarca", category: "PULSEIRA", slot: "PULSEIRA", tier: 3, stats: { hp: 120, mp: 100, hpRegen: 4, mpRegen: 5, resMagico: 0.04 }, icon: "\u{1FAB7}" }),
  ARCO_LIBELULA_T3: createItem({ templateId: "ARCO_LIBELULA_T3", name: "Arco da Lib\xE9lula", category: "ARMA", slot: "ARMA_PRINCIPAL", tier: 3, stats: { atk: 68, hit: 0.08, spd: 0.05 }, icon: "\u{1F3F9}" }),
  ESCUDO_CARAPACA_VEYRA_T3: createItem({ templateId: "ESCUDO_CARAPACA_VEYRA_T3", name: "Escudo de Carapa\xE7a", category: "ESCUDO", slot: "OFF_HAND", tier: 3, stats: { def: 26, arm: 15, blk: 0.11, resFisico: 0.04 }, icon: "\u{1F6E1}\uFE0F" }),
  COLAR_RAIZ_MEMORIA_T3: createItem({ templateId: "COLAR_RAIZ_MEMORIA_T3", name: "Colar da Raiz-Mem\xF3ria", category: "JOIA", slot: "COLAR", tier: 3, stats: { hp: 210, mp: 140, resMagico: 0.05, hpRegen: 2 }, icon: "\u{1F33F}" })
};
var ALL_EQUIPMENT_TEMPLATES = { ...buildTemplates(), ...SWAMP_EQUIPMENT_TEMPLATES };
var SWAMP_MATERIAL_TEMPLATES = {
  RESINA_MIASMA: createItem({ templateId: "RESINA_MIASMA", name: "Resina de Miasma", category: "MATERIAL", tier: 3, rarity: "COMUM", icon: "\u{1F9EA}", stackable: true, maxStack: 999 }),
  ASA_LAMINA: createItem({ templateId: "ASA_LAMINA", name: "Asa Laminada", category: "MATERIAL", tier: 3, rarity: "COMUM", icon: "\u{1FABD}", stackable: true, maxStack: 999 }),
  NO_MEMORIA: createItem({ templateId: "NO_MEMORIA", name: "N\xF3 de Mem\xF3ria", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1FAA2}", stackable: true, maxStack: 999 }),
  DENTE_SILTE: createItem({ templateId: "DENTE_SILTE", name: "Dente de Silte", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1F9B7}", stackable: true, maxStack: 999 }),
  COROA_LODO: createItem({ templateId: "COROA_LODO", name: "Coroa de Lodo", category: "MATERIAL", tier: 3, rarity: "EPICO", icon: "\u{1F451}", stackable: true, maxStack: 999 })
};
var PROFESSION_TEMPLATES = {
  MINERIO_COBRE: createItem({ templateId: "MINERIO_COBRE", name: "Min\xE9rio de Cobre", category: "MATERIAL", tier: 2, rarity: "INCOMUM", icon: "\u{1F7E0}", stackable: true, maxStack: 999 }),
  MINERIO_ECLIPSE: createItem({ templateId: "MINERIO_ECLIPSE", name: "Min\xE9rio do Eclipse", category: "MATERIAL", tier: 5, rarity: "LENDARIO", icon: "\u{1F311}", stackable: true, maxStack: 999 }),
  TRUTA_GELO: createItem({ templateId: "TRUTA_GELO", name: "Truta de Gelo", category: "MATERIAL", tier: 2, rarity: "INCOMUM", icon: "\u{1F41F}", stackable: true, maxStack: 999 }),
  PEIXE_CORAL: createItem({ templateId: "PEIXE_CORAL", name: "Peixe-Coral", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1F420}", stackable: true, maxStack: 999 }),
  PEIXE_ASTRAL: createItem({ templateId: "PEIXE_ASTRAL", name: "Peixe Astral", category: "MATERIAL", tier: 5, rarity: "LENDARIO", icon: "\u2728", stackable: true, maxStack: 999 }),
  MINERIO_FERRO: createItem({ templateId: "MINERIO_FERRO", name: "Min\xE9rio de Ferro", category: "MATERIAL", tier: 1, rarity: "COMUM", icon: "\u26CF\uFE0F", stackable: true, maxStack: 999 }),
  CRISTAL_ESSENCIA: createItem({ templateId: "CRISTAL_ESSENCIA", name: "Cristal de Ess\xEAncia", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1F48E}", stackable: true, maxStack: 999 }),
  MINERIO_OBSIDIANO: createItem({ templateId: "MINERIO_OBSIDIANO", name: "Min\xE9rio Obsidiano", category: "MATERIAL", tier: 4, rarity: "EPICO", icon: "\u{1FAA8}", stackable: true, maxStack: 999 }),
  PEIXE_RIO: createItem({ templateId: "PEIXE_RIO", name: "Peixe do Ref\xFAgio", category: "MATERIAL", tier: 1, rarity: "COMUM", icon: "\u{1F41F}", stackable: true, maxStack: 999 }),
  PEIXE_CICATRIZ: createItem({ templateId: "PEIXE_CICATRIZ", name: "Peixe-Cicatriz", category: "MATERIAL", tier: 4, rarity: "EPICO", icon: "\u{1F420}", stackable: true, maxStack: 999 }),
  LINGOTE_FERRO: createItem({ templateId: "LINGOTE_FERRO", name: "Lingote de Ferro de Lyss", category: "MATERIAL", tier: 2, rarity: "INCOMUM", icon: "\u{1F529}", stackable: true, maxStack: 999 }),
  CRISTAL_REFINADO: createItem({ templateId: "CRISTAL_REFINADO", name: "Cristal de Ess\xEAncia Refinado", category: "MATERIAL", tier: 4, rarity: "EPICO", icon: "\u{1F4A0}", stackable: true, maxStack: 999 }),
  ISCA_CICATRIZ: createItem({ templateId: "ISCA_CICATRIZ", name: "Isca da Cicatriz", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1FAB1}", stackable: true, maxStack: 999 }),
  CALDO_MARCA_DAGUA: createItem({ templateId: "CALDO_MARCA_DAGUA", name: "Caldo da Marca-d'\xC1gua", category: "MATERIAL", tier: 4, rarity: "EPICO", icon: "\u{1F372}", stackable: true, maxStack: 999 })
};
var PROFESSION_TOOL_TEMPLATES = Object.fromEntries(
  TIERS.flatMap((tier) => {
    const pickaxe = createItem({
      templateId: `PICARETA_T${tier}`,
      name: `Picareta ${["de Madeira", "de Pedra", "de A\xE7o", "de Cristal", "do Eclipse"][tier - 1]}`,
      category: "FERRAMENTA",
      tier,
      rarity: tier === 1 ? "COMUM" : tier === 2 ? "INCOMUM" : tier === 3 ? "RARO" : tier === 4 ? "EPICO" : "LENDARIO",
      profession: "MINERACAO",
      requiredSkill: (tier - 1) * 20,
      stackable: false,
      maxStack: 1,
      icon: "\u26CF\uFE0F",
      stats: { spd: 0.01 * tier },
      uniqueEffect: `Permite minera\xE7\xE3o T${tier}`
    });
    const rod = createItem({
      templateId: `VARA_PESCA_T${tier}`,
      name: `Vara de Pesca ${["de Bambu", "Refor\xE7ada", "de A\xE7o", "de Cristal", "da Mar\xE9 Eterna"][tier - 1]}`,
      category: "FERRAMENTA",
      tier,
      rarity: tier === 1 ? "COMUM" : tier === 2 ? "INCOMUM" : tier === 3 ? "RARO" : tier === 4 ? "EPICO" : "LENDARIO",
      profession: "PESCA",
      requiredSkill: (tier - 1) * 20,
      stackable: false,
      maxStack: 1,
      icon: "\u{1F3A3}",
      stats: { spd: 0.01 * tier },
      uniqueEffect: `Permite pesca T${tier}`
    });
    return [[pickaxe.templateId, pickaxe], [rod.templateId, rod]];
  })
);
var ARROW_TEMPLATES = Object.fromEntries(TIERS.map((tier) => {
  const names = ["Flecha de Madeira", "Flecha de Pedra", "Flecha de A\xE7o", "Flecha Estelar", "Flecha do Eclipse"];
  const item = createItem({ templateId: `FLECHA_T${tier}`, name: names[tier - 1], category: "FLECHA", slot: "MUNICAO", tier, rarity: "COMUM", stats: { atk: [4, 9, 18, 36, 72][tier - 1], hit: [0, 0.01, 0.02, 0.03, 0.04][tier - 1] }, stackable: false, maxStack: 1, quantity: 1, icon: "\u{1F3F9}" });
  return [item.templateId, item];
}));
var POTION_DATA = [
  { heal: 100, name: "Po\xE7\xE3o de Vida Pequena", icon: "\u{1F9EA}" },
  { heal: 300, name: "Po\xE7\xE3o de Vida M\xE9dia", icon: "\u{1F377}" },
  { heal: 800, name: "Po\xE7\xE3o de Vida Grande", icon: "\u2697\uFE0F" },
  { heal: 2e3, name: "Po\xE7\xE3o de Vida Superior", icon: "\u{1F3FA}" },
  { heal: 5e3, name: "Po\xE7\xE3o de Vida Suprema", icon: "\u{1F52E}" }
];
var POTION_TEMPLATES = {};
POTION_DATA.forEach((p, i) => {
  const id = `POCAO_VIDA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: i + 1, stats: { hp: p.heal }, stackable: true, maxStack: 50, icon: p.icon });
});
var MANA_POTION_DATA = [
  { mana: 50, name: "Po\xE7\xE3o de Mana Pequena", icon: "\u{1F535}" },
  { mana: 150, name: "Po\xE7\xE3o de Mana M\xE9dia", icon: "\u{1F499}" },
  { mana: 400, name: "Po\xE7\xE3o de Mana Grande", icon: "\u{1F30A}" }
];
MANA_POTION_DATA.forEach((p, i) => {
  const id = `POCAO_MANA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: i + 1, stats: { mp: p.mana }, stackable: true, maxStack: 50, icon: p.icon });
});
var UNIQUE_TEMPLATES = {
  SKIN_CAPA_PRIMEIRO_CANTO: createItem({ templateId: "SKIN_CAPA_PRIMEIRO_CANTO", name: "Capa do Primeiro Canto", category: "MATERIAL", tier: 5, rarity: "LENDARIO", stats: {}, uniqueEffect: "Cosm\xE9tico exclusivo do calend\xE1rio do primeiro m\xEAs", icon: "\u{1F9E5}" }),
  UNICO_BRASA_ETERNA: createItem({ templateId: "UNICO_BRASA_ETERNA", name: "Brasa Eterna", category: "PULSEIRA", slot: "PULSEIRA", tier: 1, rarity: "LENDARIO", stats: { atk: 10, matk: 10, hp: 100 }, xpBonus: 0.1, icon: "\u{1F525}", uniqueEffect: "+10% de XP \xB7 rel\xEDquia de pulso" }),
  UNICO_CORACAO_GRANITO: createItem({ templateId: "UNICO_CORACAO_GRANITO", name: "Cora\xE7\xE3o de Granito", category: "JOIA", slot: "COLAR", tier: 2, rarity: "LENDARIO", stats: { hp: 500, arm: 25, resFisico: 0.08 }, icon: "\u{1FAA8}", uniqueEffect: "-8% de dano f\xEDsico recebido" }),
  UNICO_ESCAMA_LEVIATA: createItem({ templateId: "UNICO_ESCAMA_LEVIATA", name: "Escama do Leviat\xE3", category: "ESCUDO", slot: "OFF_HAND", tier: 3, rarity: "LENDARIO", stats: { def: 50, arm: 40, blk: 0.15, resMagico: 0.15 }, goldBonus: 0.15, icon: "\u{1F41A}", uniqueEffect: "+15% de ouro" }),
  UNICO_OLHO_ASTERION: createItem({ templateId: "UNICO_OLHO_ASTERION", name: "Olho de Asterion", category: "ARMADURA", slot: "CAPACETE", tier: 4, rarity: "LENDARIO", stats: { arm: 100, hp: 1500, crit: 0.1, hit: 0.1 }, rareDropBonus: 0.15, dropBonus: 0.05, icon: "\u{1F441}\uFE0F", uniqueEffect: "+15% de raridade alta" }),
  UNICO_PRESA_DEVORADOR: createItem({ templateId: "UNICO_PRESA_DEVORADOR", name: "Presa do Devorador", category: "ARMA", slot: "ARMA_PRINCIPAL", tier: 5, rarity: "LENDARIO", stats: { atk: 500, def: 80 }, lifesteal: 0.08, icon: "\u{1F9B7}", uniqueEffect: "Rouba 8% do dano como vida" }),
  UNICO_ANEL_GUARDIA: createItem({ templateId: "UNICO_ANEL_GUARDIA", name: "Anel da Guarda Eterna", category: "JOIA", slot: "ANEL_I", tier: 5, rarity: "LENDARIO", stats: { hp: 250, arm: 20 }, preventsDeathDrop: true, icon: "\u{1F48D}", uniqueEffect: "Impede 100% das perdas de itens ao morrer" }),
  UNICO_SIGILO_INICIACAO: createItem({ templateId: "UNICO_SIGILO_INICIACAO", name: "Pulseira do Primeiro Eco", category: "PULSEIRA", slot: "PULSEIRA", tier: 1, rarity: "LENDARIO", stats: { hp: 60, mp: 40, hpRegen: 2, mpRegen: 2 }, icon: "\u2728", uniqueEffect: "Rel\xEDquia exclusiva por concluir o tutorial de Mythreon" }),
  SKIN_MANTO_NEBULOSA: createItem({ templateId: "SKIN_MANTO_NEBULOSA", name: "Manto da Nebulosa", category: "MATERIAL", tier: 5, rarity: "LENDARIO", stats: {}, icon: "\u{1F9E5}", uniqueEffect: "Skin cosm\xE9tica: part\xEDculas de estrelas e brilho violeta; n\xE3o altera combate." }),
  LUMINESCENCIA_MATRIZ: createItem({ templateId: "LUMINESCENCIA_MATRIZ", name: "Luminesc\xEAncia da Matriz", category: "MATERIAL", tier: 5, rarity: "LENDARIO", stats: {}, icon: "\u{1F30C}", uniqueEffect: "Efeito visual cosm\xE9tico para a Matriz equipada; n\xE3o altera atributos." }),
  LUMINESCENCIA_PET: createItem({ templateId: "LUMINESCENCIA_PET", name: "Aura da Besta Divina", category: "MATERIAL", tier: 5, rarity: "LENDARIO", stats: {}, icon: "\u{1F43E}", uniqueEffect: "Aura cosm\xE9tica do Pet ativo; n\xE3o altera dano, nutri\xE7\xE3o ou atributos." }),
  ADDON_BOSS_LUMINESCENTE: createItem({ templateId: "ADDON_BOSS_LUMINESCENTE", name: "Addon do Boss Luminescente", category: "MATERIAL", tier: 5, rarity: "LENDARIO", stats: {}, icon: "\u2728", uniqueEffect: "Aura cosm\xE9tica para aparecer no Boss Di\xE1rio; n\xE3o altera combate." })
};
var FRAGMENT_TEMPLATES = {
  FRAGMENTO_COMUM: createItem({ templateId: "FRAGMENTO_COMUM", name: "Fragmento Comum", category: "FRAGMENTO", tier: 1, rarity: "COMUM", icon: "\u{1FAA8}", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_RARO: createItem({ templateId: "FRAGMENTO_RARO", name: "Fragmento Raro", category: "FRAGMENTO", tier: 1, rarity: "RARO", icon: "\u{1F48E}", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_EPICO: createItem({ templateId: "FRAGMENTO_EPICO", name: "Fragmento \xC9pico", category: "FRAGMENTO", tier: 1, rarity: "EPICO", icon: "\u{1F52E}", stackable: true, maxStack: 999, quantity: 1, stats: {} })
};
var DIVINE_BEAST_EGG_TEMPLATES = {
  OVO_BESTA_T1: createItem({ templateId: "OVO_BESTA_T1", name: "Ovo de Besta Divina Comum", category: "MATERIAL", tier: 1, rarity: "COMUM", icon: "\u{1F95A}", stackable: true, maxStack: 999 }),
  OVO_BESTA_T2: createItem({ templateId: "OVO_BESTA_T2", name: "Ovo de Besta Divina Incomum", category: "MATERIAL", tier: 2, rarity: "INCOMUM", icon: "\u{1F95A}", stackable: true, maxStack: 999 }),
  OVO_BESTA_T3: createItem({ templateId: "OVO_BESTA_T3", name: "Ovo de Besta Divina Raro", category: "MATERIAL", tier: 3, rarity: "RARO", icon: "\u{1F95A}", stackable: true, maxStack: 999 }),
  OVO_BESTA_T4: createItem({ templateId: "OVO_BESTA_T4", name: "Ovo de Besta Divina \xC9pico", category: "MATERIAL", tier: 4, rarity: "EPICO", icon: "\u{1F95A}", stackable: true, maxStack: 999 }),
  OVO_BESTA_T5: createItem({ templateId: "OVO_BESTA_T5", name: "Ovo de Besta Divina Lend\xE1rio", category: "MATERIAL", tier: 5, rarity: "LENDARIO", icon: "\u{1F95A}", stackable: true, maxStack: 999 })
};
var BEAST_TAMER_TEMPLATES = {
  RACAO_DOMADOR: createItem({ templateId: "RACAO_DOMADOR", name: "Ra\xE7\xE3o Especial do Domador", category: "MATERIAL", tier: 2, rarity: "RARO", icon: "\u{1F356}", stackable: true, maxStack: 999 })
};
var PET_FOOD_TEMPLATES = {
  CENOURA_PET: createItem({ templateId: "CENOURA_PET", name: "Cenoura Crocante", category: "MATERIAL", tier: 1, rarity: "COMUM", icon: "\u{1F955}", stackable: true, maxStack: 999 }),
  FRUTA_MEL: createItem({ templateId: "FRUTA_MEL", name: "Fruta de Mel", category: "MATERIAL", tier: 1, rarity: "INCOMUM", icon: "\u{1F36F}", stackable: true, maxStack: 999 }),
  MELANCIA_LUNAR: createItem({ templateId: "MELANCIA_LUNAR", name: "Melancia Lunar", category: "MATERIAL", tier: 2, rarity: "RARO", icon: "\u{1F349}", stackable: true, maxStack: 999 })
};
var MYTHREON_STORE_TEMPLATES = {
  BAU_SUPRIMENTOS_MYTHREON: createItem({ templateId: "BAU_SUPRIMENTOS_MYTHREON", name: "Ba\xFA de Suprimentos Mythreon", category: "MATERIAL", tier: 2, rarity: "RARO", icon: "\u{1F381}", stackable: true, maxStack: 999 }),
  CHAVE_ROLETA_ARCANA: createItem({ templateId: "CHAVE_ROLETA_ARCANA", name: "Chave da Roleta Arcana", category: "MATERIAL", tier: 3, rarity: "EPICO", icon: "\u{1F5DD}\uFE0F", stackable: true, maxStack: 999 })
};
var ALL_ITEM_TEMPLATES = { ...ALL_EQUIPMENT_TEMPLATES, ...SWAMP_MATERIAL_TEMPLATES, ...PROFESSION_TEMPLATES, ...PROFESSION_TOOL_TEMPLATES, ...ARROW_TEMPLATES, ...POTION_TEMPLATES, ...UNIQUE_TEMPLATES, ...FRAGMENT_TEMPLATES, ...DIVINE_BEAST_EGG_TEMPLATES, ...BEAST_TAMER_TEMPLATES, ...PET_FOOD_TEMPLATES, ...MYTHREON_STORE_TEMPLATES };

// src/engine/training.ts
var TRAINING_MILESTONES = [
  { id: "PRIMEIRO_RITUAL", name: "Primeiro Ritual", seconds: 300, gold: 100, fragments: 2 },
  { id: "DISCIPULO", name: "Disc\xEDpulo da Ess\xEAncia", seconds: 1800, gold: 250, fragments: 5 },
  { id: "DEDICADO", name: "Disciplina Inabal\xE1vel", seconds: 7200, gold: 500, fragments: 10 },
  { id: "MESTRE", name: "Guardi\xE3o da Disciplina", seconds: 36e3, gold: 1500, fragments: 25 }
];
function masteryBonus(char, skill) {
  return Math.min(0.3, Math.max(0, char.trainingMastery?.[skill] ?? 0) * 0.01);
}
function trainingXpNeeded(level) {
  const n = Math.max(0, level - 10);
  return Math.floor(900 + 120 * n + 18 * n * n + Math.max(0, n - 10) ** 3 * 12);
}
function applyTrainingDeathPenalty(char) {
  const entries = Object.keys(char.skills).filter((skill2) => (char.skills[skill2] ?? 0) > 10).sort((a, b) => (char.skills[b] ?? 0) - (char.skills[a] ?? 0));
  const skill = entries[0];
  if (!skill) return null;
  const previous = char.skills[skill];
  char.skills[skill] = Math.max(10, previous - 1);
  const needed = trainingXpNeeded(char.skills[skill]);
  char.skillXp[skill] = Math.floor(Math.min(char.skillXp[skill] ?? 0, needed - 1) * 0.9);
  return `\u2620\uFE0F A morte interrompeu sua disciplina: ${skill} caiu de ${previous} para ${char.skills[skill]}.`;
}
function applyTraining(char, now) {
  const skill = char.trainingSkill;
  if (!skill) return [];
  const previous = char.trainingLastTick ?? now;
  const ticks = Math.min(20, Math.max(0, Math.floor((now - previous) / 3e3)));
  if (!ticks) return [];
  const start = now - ticks * 3e3;
  const boostedSeconds = Math.max(0, Math.min(now, char.trainingBoostUntil ?? 0) - start) / 1e3;
  char.trainingLastTick = now;
  char.lastTick = now;
  char.trainingSeconds ??= {};
  char.trainingMastery ??= {};
  char.trainingAchievements ??= [];
  char.trainingSeconds[skill] = (char.trainingSeconds[skill] ?? 0) + ticks * 3;
  char.skillXp[skill] += ticks * 15 + boostedSeconds * 2.5;
  const log = [];
  while (char.skillXp[skill] >= trainingXpNeeded(char.skills[skill])) {
    char.skillXp[skill] -= trainingXpNeeded(char.skills[skill]);
    char.skills[skill]++;
    char.trainingMastery[skill] = (char.trainingMastery[skill] ?? 0) + 1;
    log.push(`Maestria em ${skill}: n\xEDvel ${char.skills[skill]}!`);
  }
  const seconds = Object.values(char.trainingSeconds).reduce((sum, n) => sum + (n ?? 0), 0);
  for (const reward of TRAINING_MILESTONES) {
    if (seconds < reward.seconds || char.trainingAchievements.includes(reward.id)) continue;
    char.trainingAchievements.push(reward.id);
    char.gold += reward.gold;
    const fragments = createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_COMUM, quantity: reward.fragments });
    const stackSpace = char.inventory.items.filter((item) => item.templateId === fragments.templateId && item.stackable).reduce((sum, item) => sum + Math.max(0, item.maxStack - item.quantity), 0);
    if (char.inventory.items.length < char.inventory.backpack.slots || stackSpace >= fragments.quantity) addItem(char.inventory, fragments);
    else char.depot.push(fragments);
    log.push(`Conquista: ${reward.name}! +${reward.gold} gold e ${reward.fragments} Fragmentos Comuns.`);
  }
  return log;
}

// src/data/balance.ts
var BALANCE = {
  resistanceCap: 0.6,
  armorCap: 0.7,
  killRecovery: 0.02,
  equipmentDrop: 0.18,
  bossEquipmentDrop: 0.65
};
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function mitigatedDamage(raw, armor) {
  if (raw <= 0) return 0;
  const reduction = clamp(Math.max(0, armor) / (Math.max(0, armor) + raw + 40), 0, BALANCE.armorCap);
  return Math.max(1, raw * (1 - reduction));
}

// src/data/elementalChart.ts
var ELEMENTS = [
  { id: "FOGO", name: "Fogo", icon: "\u{1F525}" },
  { id: "ELETRICIDADE", name: "Eletricidade", icon: "\u26A1" },
  { id: "VENTO", name: "Vento", icon: "\u{1F32A}\uFE0F" },
  { id: "TERRA", name: "Terra", icon: "\u{1FAA8}" },
  { id: "AGUA", name: "\xC1gua", icon: "\u{1F30A}" },
  { id: "GELO", name: "Gelo", icon: "\u2744\uFE0F" },
  { id: "MORTE", name: "Morte", icon: "\u2620\uFE0F" },
  { id: "SAGRADO", name: "Sagrado", icon: "\u2728" },
  { id: "PSIQUICO", name: "Ps\xEDquico", icon: "\u{1F52E}" },
  { id: "VENENO", name: "Veneno", icon: "\u2623\uFE0F" },
  { id: "METAL", name: "Metal", icon: "\u2699\uFE0F" },
  { id: "BASE", name: "Base", icon: "\u2694\uFE0F" }
];
var ADVANTAGES = {
  FOGO: ["GELO", "METAL"],
  ELETRICIDADE: ["AGUA", "VENTO"],
  VENTO: ["TERRA", "VENENO"],
  TERRA: ["ELETRICIDADE", "METAL", "FOGO"],
  AGUA: ["FOGO", "TERRA"],
  GELO: ["VENTO", "TERRA"],
  MORTE: ["SAGRADO", "PSIQUICO"],
  SAGRADO: ["MORTE", "VENENO"],
  PSIQUICO: ["VENENO", "MORTE"],
  VENENO: ["AGUA", "VENTO"],
  METAL: ["GELO", "PSIQUICO"],
  BASE: []
};
function elementMultiplier(attack, defense) {
  if (!attack || !defense || attack === "BASE" || defense === "BASE") return 1;
  if (ADVANTAGES[attack]?.includes(defense) && ADVANTAGES[defense]?.includes(attack)) return 1;
  if (ADVANTAGES[attack]?.includes(defense)) return 1.25;
  if (ADVANTAGES[defense]?.includes(attack)) return 0.75;
  return 1;
}
function attackElement(attackId) {
  const byAttack = {
    A1: "BASE",
    A2: "VENENO",
    A3: "FOGO",
    A4: "BASE",
    A5: "VENENO",
    A6: "METAL",
    A7: "VENTO",
    A8: "MORTE",
    A9: "TERRA",
    A10: "PSIQUICO",
    A11: "GELO",
    A12: "AGUA",
    A13: "ELETRICIDADE",
    A14: "MORTE",
    A15: "SAGRADO"
  };
  return byAttack[attackId ?? ""] ?? "BASE";
}

// src/data/skills.ts
var ATTACK_SKILLS = {
  A1: { mult: 2, pierce: 0.1, manaCost: 10, desc: "Mordida Feral: Dano f\xEDsico pesado." },
  A2: { mult: 1.8, pierce: 0.3, manaCost: 12, desc: "Ferr\xE3o Venenoso: Dano com veneno." },
  A3: { mult: 2.2, pierce: 0.5, manaCost: 15, desc: "Chama Espectral: Dano m\xE1gico em \xE1rea." },
  A4: { mult: 2.1, pierce: 0.4, manaCost: 15, desc: "Garra Perfurante: Ignora defesa." },
  A5: { mult: 1.9, pierce: 0.2, manaCost: 12, desc: "Pe\xE7onha: Dano e lentid\xE3o." },
  A6: { mult: 2, pierce: 0.35, manaCost: 14, desc: "Corte: Dano perfurante r\xE1pido." },
  A7: { mult: 1.8, pierce: 0.2, manaCost: 12, desc: "Espinho: Causa sangramento." },
  A8: { mult: 2.2, pierce: 0.2, manaCost: 16, desc: "Mordida Medonha: Causa medo." },
  A9: { mult: 2.5, pierce: 0, manaCost: 18, desc: "Impacto: Dano em cone brutal." },
  A10: { mult: 2, pierce: 0.3, manaCost: 14, desc: "Corte Silencioso: Dano e sil\xEAncio." },
  A11: { mult: 2.3, pierce: 0.4, manaCost: 16, desc: "Lan\xE7a G\xE9lida: Congela o alvo." },
  A12: { mult: 2.4, pierce: 0.8, manaCost: 20, desc: "Chicote Abissal: Ignora quase toda armadura." },
  A13: { mult: 2.6, pierce: 0.5, manaCost: 22, desc: "Descarga: Dano de trov\xE3o em cadeia." },
  A14: { mult: 2.2, pierce: 0.3, manaCost: 18, lifesteal: 0.4, desc: "Devorar: Drena vida do alvo." },
  A15: { mult: 3, pierce: 0.6, manaCost: 25, desc: "Julgamento Estelar: Dano sagrado devastador." },
  A16: { mult: 2.1, pierce: 0.25, manaCost: 16, desc: "N\xE9voa T\xF3xica: Dano de veneno e corros\xE3o." },
  A17: { mult: 2.3, pierce: 0.45, manaCost: 17, desc: "Corte Prism\xE1tico: Dano de vento e precis\xE3o." },
  A18: { mult: 2.2, pierce: 0.35, manaCost: 18, desc: "La\xE7o da Mem\xF3ria: Dano ps\xEDquico e eco." },
  A19: { mult: 2.4, pierce: 0.3, manaCost: 19, desc: "Mordida Lodosa: Dano de \xE1gua e lentid\xE3o." },
  A20: { mult: 3.2, pierce: 0.55, manaCost: 28, desc: "Dil\xFAvio de Lodo: Dano de veneno em \xE1rea." }
};
var ATTACK_SKILL_COOLDOWN = 4;
var SUPPORT_EFFECTS = {
  S1: { cd: 5, healPct: 0.15, desc: "B\xEAn\xE7\xE3o de Lyss: Cura 15% do HP a cada 15s." },
  S2: { cd: 6, dur: 3, atkPct: 0.15, armPct: 0.15, desc: "V\xEDnculo: +15% ATK/ARM por 9s a cada 18s." },
  S3: { cd: 6, healPct: 0.12, desc: "Aurora: Cura 12% do HP a cada 18s." },
  S4: { cd: 6, dur: 2, dmgReduction: 0.35, desc: "V\xE9u: Escudo de -35% de dano por 6s." },
  S5: { cd: 4, doubleStrike: true, desc: "Acelera\xE7\xE3o: Ataque duplo a cada 12s." },
  S6: { cd: 5, dur: 3, ignoreArmor: 0.3, desc: "Revela\xE7\xE3o: Ignora 30% da armadura inimiga." },
  S7: { cd: 5, dur: 3, armPct: 0.25, desc: "Baluarte: +25% armadura por 9s." },
  S8: { cd: 4, dodgeEvery: 4, desc: "Passo: Esquiva 1 ataque a cada 12s." },
  S9: { cd: 1, permDmgReduction: 0.1, desc: "Adapta\xE7\xE3o: -10% de dano recebido." },
  S10: { cd: 1, critBonus: 0.08, hitBonus: 0.05, desc: "C\xE1lculo: +8% cr\xEDtico, +5% precis\xE3o." },
  S11: { cd: 1, permAtkPct: 0.1, permArmPct: 0.1, desc: "Equil\xEDbrio: +10% ATK e ARM." },
  S12: { cd: 1, lifesteal: 0.1, desc: "Fus\xE3o: Rouba 10% do dano causado." },
  S13: { cd: 1, executeBonus: 0.5, desc: "Preda\xE7\xE3o: +50% dano em alvos com <40% HP." }
};
var PASSIVE_EFFECTS = {
  P1: { healPct: 0.25, desc: "+25% de cura recebida." },
  P2: { armPct: 0.15, stats: { def: 5 }, desc: "+15% armadura, +5 DEF." },
  P3: { stats: { resMagico: 0.1, resFisico: 0.05 }, desc: "+10% resist. m\xE1gica, +5% f\xEDsica." },
  P4: { stats: { spd: 0.15 }, desc: "+15% de chance de ataque extra." },
  P5: { healPct: 0.2, hpPct: 0.1, desc: "+20% cura recebida, +10% HP." },
  P6: { stats: { dge: 0.08 }, desc: "+8% esquiva." },
  P7: { skillDmgPct: 0.3, desc: "+30% de dano nas habilidades." },
  P8: { cdReduce: 1, desc: "Habilidade recarrega 1 tick mais r\xE1pido." },
  P9: { stats: { crit: 0.1 }, desc: "+10% de cr\xEDtico." },
  P10: { xpPct: 0.15, desc: "+15% de XP." },
  P11: { rareDropPct: 0.2, desc: "+20% de chance de raridade alta." },
  P12: { goldPct: 0.2, desc: "+20% de ouro." }
};

// src/data/vials.ts
var VIALS = {
  VIAL_XP_RUSH: { id: "VIAL_XP_RUSH", name: "Elixir da Ascens\xE3o", description: "+1000% de XP por 1 hora (modo de testes)", durationMinutes: 60, icon: "\u{1F31F}", stats: {}, xpPct: 10, price: 1e3 },
  VIAL_TITAN_1: { id: "VIAL_TITAN_1", name: "Vial do Tit\xE3 I", description: "+15 For\xE7a (ATK) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { atk: 15 }, price: 500 },
  VIAL_SAGE_1: { id: "VIAL_SAGE_1", name: "Vial do S\xE1bio I", description: "+15 Intelig\xEAncia (MATK) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { matk: 15 }, price: 500 },
  VIAL_SHADOW_1: { id: "VIAL_SHADOW_1", name: "Vial da Sombra I", description: "+5% Cr\xEDtico e +5% Precis\xE3o por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { crit: 0.05, hit: 0.05 }, price: 500 },
  VIAL_GALE_1: { id: "VIAL_GALE_1", name: "Vial da Ventania I", description: "+10% Vel. Ataque (SPD) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { spd: 0.1 }, price: 500 },
  VIAL_AEGIS_1: { id: "VIAL_AEGIS_1", name: "Vial da \xC9gide I", description: "+20 Armadura e +100 Vida por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { arm: 20, hp: 100 }, price: 500 },
  VIAL_TITAN_2: { id: "VIAL_TITAN_2", name: "Vial do Tit\xE3 II", description: "+40 For\xE7a (ATK) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { atk: 40 }, price: 2500 },
  VIAL_SAGE_2: { id: "VIAL_SAGE_2", name: "Vial do S\xE1bio II", description: "+40 Intelig\xEAncia (MATK) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { matk: 40 }, price: 2500 },
  VIAL_SHADOW_2: { id: "VIAL_SHADOW_2", name: "Vial da Sombra II", description: "+10% Cr\xEDtico e +10% Precis\xE3o por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { crit: 0.1, hit: 0.1 }, price: 2500 },
  VIAL_GALE_2: { id: "VIAL_GALE_2", name: "Vial da Ventania II", description: "+20% Vel. Ataque (SPD) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { spd: 0.2 }, price: 2500 },
  VIAL_AEGIS_2: { id: "VIAL_AEGIS_2", name: "Vial da \xC9gide II", description: "+50 Armadura e +300 Vida por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { arm: 50, hp: 300 }, price: 2500 },
  VIAL_TITAN_3: { id: "VIAL_TITAN_3", name: "Vial do Tit\xE3 III", description: "+100 For\xE7a (ATK) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { atk: 100 }, price: 1e4 },
  VIAL_SAGE_3: { id: "VIAL_SAGE_3", name: "Vial do S\xE1bio III", description: "+100 Intelig\xEAncia (MATK) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { matk: 100 }, price: 1e4 },
  VIAL_SHADOW_3: { id: "VIAL_SHADOW_3", name: "Vial da Sombra III", description: "+15% Cr\xEDtico e +15% Precis\xE3o por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { crit: 0.15, hit: 0.15 }, price: 1e4 },
  VIAL_GALE_3: { id: "VIAL_GALE_3", name: "Vial da Ventania III", description: "+30% Vel. Ataque (SPD) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { spd: 0.3 }, price: 1e4 },
  VIAL_AEGIS_3: { id: "VIAL_AEGIS_3", name: "Vial da \xC9gide III", description: "+100 Armadura e +800 Vida por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { arm: 100, hp: 800 }, price: 1e4 }
};

// src/data/divineBeasts.ts
var DIVINE_BEAST_SELL_VALUES = {
  COMUM: 150,
  INCOMUM: 450,
  RARO: 1200,
  EPICO: 3500,
  LENDARIO: 12e3
};
function divineBeastSellValue(rarity) {
  return DIVINE_BEAST_SELL_VALUES[rarity ?? "COMUM"];
}
var DIVINE_BEASTS = {
  LYSS_STAG: {
    id: "LYSS_STAG",
    name: "Elarion",
    title: "Cervo das Ra\xEDzes Luminosas",
    region: "Bosque de Lyss",
    bossId: "ESPECTRO",
    rarity: "RARO",
    emoji: "\u{1F98C}",
    sprite: "/assets/pets/divine-beast-lyss.png",
    lore: "Quando a primeira floresta sentiu a ruptura da Ess\xEAncia, um cervo permaneceu entre as ra\xEDzes. Lyss guardou sua lembran\xE7a e a fez renascer como um eco vivo do Primeiro Canto.",
    bond: "Elarion acompanha quem protege a vida mesmo quando a floresta est\xE1 ferida.",
    bonus: { hp: 35, dge: 0.01 },
    dropChance: 0.12
  },
  DHOR_GRIFFIN: {
    id: "DHOR_GRIFFIN",
    name: "Kharad",
    title: "Grifo da Coroa de Basalto",
    region: "Pico de Dhor",
    bossId: "COLOSSO",
    rarity: "RARO",
    emoji: "\u{1F985}",
    sprite: "/assets/pets/divine-beast-dhor.png",
    lore: "Nascido no instante em que uma montanha resistiu \xE0 Grande Ruptura, Kharad carrega a mem\xF3ria da pedra que n\xE3o cedeu. Suas asas guardam poeira de basalto e luz primordial.",
    bond: "Kharad responde \xE0 firmeza: ele protege quem permanece de p\xE9 diante da adversidade.",
    bonus: { arm: 4, def: 2 },
    dropChance: 0.12
  },
  AZHAR_SERPENT: {
    id: "AZHAR_SERPENT",
    name: "Nerith",
    title: "Serpe das Mar\xE9s de Nacre",
    region: "Mar de Azhar",
    bossId: "LEVIATA",
    rarity: "EPICO",
    emoji: "\u{1F409}",
    sprite: "/assets/pets/divine-beast-azhar.png",
    lore: "Nerith surgiu onde a mar\xE9 tocou uma veia primordial. Seu corpo guarda o ritmo de Azhar: recuar, lembrar e voltar com a for\xE7a de um oceano inteiro.",
    bond: "Nerith segue quem aprende a mudar de caminho sem abandonar o pr\xF3prio prop\xF3sito.",
    bonus: { mp: 35, resMagico: 0.02 },
    dropChance: 0.12
  },
  ASTERION_OWL: {
    id: "ASTERION_OWL",
    name: "Orivane",
    title: "Coruja dos Arquivos Celestes",
    region: "Ru\xEDnas de Asterion",
    bossId: "GUARDIAO",
    rarity: "EPICO",
    emoji: "\u{1F989}",
    sprite: "/assets/pets/divine-beast-asterion.png",
    lore: "As ru\xEDnas registraram cada voz que se perdeu na queda. Orivane nasceu dessa mem\xF3ria: uma testemunha alada que nunca esquece um nome, uma promessa ou uma batalha.",
    bond: "Orivane escolhe quem observa antes de agir e honra aquilo que aprendeu.",
    bonus: { hit: 0.02, crit: 0.01 },
    dropChance: 0.12
  },
  VOID_FOX: {
    id: "VOID_FOX",
    name: "Vesper",
    title: "Raposa do Limiar Silencioso",
    region: "Cicatriz Profunda",
    bossId: "DEVORADOR",
    rarity: "LENDARIO",
    emoji: "\u{1F98A}",
    sprite: "/assets/pets/divine-beast-void.png",
    lore: "Na Cicatriz, at\xE9 a mem\xF3ria parece se desfazer. Vesper nasceu do \xFAltimo fio de Ess\xEAncia que se recusou a desaparecer e aprendeu a caminhar entre o que o mundo lembra e o que teme esquecer.",
    bond: "Vesper se aproxima de quem atravessa a escurid\xE3o sem permitir que ela decida quem essa pessoa ser\xE1.",
    bonus: { atk: 6, dge: 0.02 },
    dropChance: 0.12
  },
  ASTER_PHOENIX: {
    id: "ASTER_PHOENIX",
    name: "Solenne",
    title: "F\xEAnix da Primeira Luz",
    region: "Ecos de Aster",
    bossId: "ESPECTRO",
    rarity: "EPICO",
    emoji: "\u{1F426}\u200D\u{1F525}",
    sprite: "/assets/pets/divine-beast-aster.png",
    lore: "Solenne n\xE3o \xE9 Aster, mas um eco de tudo que come\xE7a. Sua chama nasceu na primeira alvorada ap\xF3s a Ruptura e reacende a esperan\xE7a nos lugares esquecidos.",
    bond: "Solenne acompanha quem encontra um come\xE7o mesmo depois de uma grande perda.",
    bonus: { hp: 20, crit: 0.01 },
    dropChance: 0.12
  },
  NOCTHAR_MOTH: {
    id: "NOCTHAR_MOTH",
    name: "Nhal",
    title: "Mariposa do Sil\xEAncio Sereno",
    region: "Ecos de Nocthar",
    bossId: "COLOSSO",
    rarity: "EPICO",
    emoji: "\u{1F98B}",
    sprite: "/assets/pets/divine-beast-nocthar.png",
    lore: "As asas de Nhal guardam o instante quieto entre o fim de um ciclo e o in\xEDcio do pr\xF3ximo. Sua escurid\xE3o oferece repouso, nunca amea\xE7a.",
    bond: "Nhal escolhe viajantes que entendem que descansar tamb\xE9m \xE9 continuar.",
    bonus: { mp: 25, resMagico: 0.01 },
    dropChance: 0.12
  },
  KAELOR_SALAMANDER: {
    id: "KAELOR_SALAMANDER",
    name: "Cindervane",
    title: "Salamandra da Mudan\xE7a",
    region: "Ecos de Kaelor",
    bossId: "LEVIATA",
    rarity: "EPICO",
    emoji: "\u{1F98E}",
    sprite: "/assets/pets/divine-beast-kaelor.png",
    lore: "Cindervane muda de cor conforme a Ess\xEAncia ao redor se transforma. Ela sobrevive \xE0 mudan\xE7a porque nunca tenta voltar a ser aquilo que j\xE1 foi.",
    bond: "Cindervane se aproxima de quem aprende, se adapta e segue em frente.",
    bonus: { atk: 3, spd: 0.01 },
    dropChance: 0.12
  },
  VEYRA_TORTOISE: {
    id: "VEYRA_TORTOISE",
    name: "Memnora",
    title: "Tartaruga do Arquivo Vivo",
    region: "Ecos de Veyra",
    bossId: "GUARDIAO",
    rarity: "EPICO",
    emoji: "\u{1F422}",
    sprite: "/assets/pets/divine-beast-veyra.png",
    lore: "Cada marca no casco de Memnora \xE9 uma lembran\xE7a preservada. Ela carrega hist\xF3rias sem aprision\xE1-las e nunca confunde mem\xF3ria com destino.",
    bond: "Memnora caminha com quem guarda o passado sem deixar de escolher o futuro.",
    bonus: { hp: 25, arm: 2 },
    dropChance: 0.12
  },
  DHOR_BEETLE: {
    id: "DHOR_BEETLE",
    name: "Orruk",
    title: "Besouro-Cristal da Mat\xE9ria",
    region: "Ecos de Dhor",
    bossId: "COLOSSO",
    rarity: "RARO",
    emoji: "\u{1FAB2}",
    sprite: "/assets/pets/divine-beast-dhor-beetle.png",
    lore: "Orruk molda cristais com as patas e deixa caminhos firmes por onde passa. Seu corpo lembra que toda ideia precisa de mat\xE9ria para permanecer no mundo.",
    bond: "Orruk segue quem constr\xF3i com paci\xEAncia e cuida daquilo que criou.",
    bonus: { def: 3, blk: 0.01 },
    dropChance: 0.12
  },
  LYSS_MOTH: {
    id: "LYSS_MOTH",
    name: "Floravelle",
    title: "Mariposa dos Brotos de Lyss",
    region: "Ecos de Lyss",
    bossId: "ESPECTRO",
    rarity: "RARO",
    emoji: "\u{1F98B}",
    sprite: "/assets/pets/divine-beast-floravelle.png",
    lore: "Floravelle surge onde a vida insiste em crescer. O p\xF3 luminoso de suas asas n\xE3o cura feridas; ele desperta sementes adormecidas na Ess\xEAncia.",
    bond: "Floravelle escolhe quem protege o crescimento dos outros sem exigir recompensa.",
    bonus: { hp: 20, hit: 0.01 },
    dropChance: 0.12
  },
  NYR_SKY_RAY: {
    id: "NYR_SKY_RAY",
    name: "Aeralis",
    title: "Raia-Celeste das Correntes de Nyr",
    region: "Ecos de Nyr",
    bossId: "LEVIATA",
    rarity: "LENDARIO",
    emoji: "\u{1FABD}",
    sprite: "/assets/pets/divine-beast-nyr.png",
    lore: "Aeralis nada pelo ar seguindo correntes que olhos mortais n\xE3o veem. Para ela, dist\xE2ncia \xE9 apenas outro nome para o pr\xF3ximo caminho.",
    bond: "Aeralis acompanha quem continua explorando mesmo sem conhecer o destino.",
    bonus: { spd: 0.02, dge: 0.01 },
    dropChance: 0.12
  }
};

// src/data/beastCombat.ts
var ATTACKS = {
  LYSS_STAG: ["Lan\xE7as de Raiz", "TERRA"],
  DHOR_GRIFFIN: ["Queda de Basalto", "TERRA"],
  AZHAR_SERPENT: ["Mar\xE9 de Nacre", "AGUA"],
  ASTERION_OWL: ["Senten\xE7a Celeste", "PSIQUICO"],
  VOID_FOX: ["Rasgo do Limiar", "MORTE"],
  ASTER_PHOENIX: ["Aurora Incandescente", "FOGO"],
  NOCTHAR_MOTH: ["P\xF3 do Sil\xEAncio", "MORTE"],
  KAELOR_SALAMANDER: ["Sopro da Mudan\xE7a", "FOGO"],
  VEYRA_TORTOISE: ["Pulso da Mem\xF3ria", "SAGRADO"],
  DHOR_BEETLE: ["Estilha\xE7o Cristalino", "METAL"],
  LYSS_MOTH: ["P\xF3len Vital", "VENENO"],
  NYR_SKY_RAY: ["L\xE2mina das Correntes", "VENTO"]
};
function getBeastCombat(char) {
  const id = char.activeDivineBeastId;
  if (!id || !(char.divineBeasts ?? []).some((b) => b.id === id)) return null;
  const beast = DIVINE_BEASTS[id];
  const [name, element] = ATTACKS[id];
  return { beast, name, element, cooldown: 2, cooldownSeconds: 5, mana: 8 + Math.floor(char.level * 0.5), multiplier: 2.4 };
}
function beastGrowth(level) {
  return { hp: 60 + level * 6, mp: 30 + level * 3, atk: 6 + level, matk: 6 + level, arm: 3 + Math.floor(level * 0.6), hpRegen: 1 + Math.floor(level / 15), mpRegen: 2 + Math.floor(level / 15) };
}

// src/data/cards.ts
var CARD_TEMPLATES = {
  // ─── BOSQUE DE LYSS (T1) ───
  CARD_LOBO: {
    monsterId: "LOBO",
    name: "Lobo-Feral",
    region: "BOSQUE_LYSS",
    rarity: "RARO",
    trait: "FURIA",
    baseStats: { hp: 100, atk: 25, def: 10, spd: 30 },
    ability: "Mordida Sangrenta",
    abilityDesc: "Causa 30% do ATK como dano extra no primeiro ataque.",
    emoji: "\u{1F43A}"
  },
  CARD_VESPA: {
    monsterId: "VESPA",
    name: "Vespa-Cinza",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "VENENO",
    baseStats: { hp: 50, atk: 15, def: 5, spd: 45 },
    ability: "Ferr\xE3o Letal",
    abilityDesc: "Aplica 1 stack extra de veneno no primeiro ataque.",
    emoji: "\u{1F41D}"
  },
  CARD_ESPINHEIRO: {
    monsterId: "ESPINHEIRO",
    name: "Espinheiro-Vivo",
    region: "BOSQUE_LYSS",
    rarity: "RARO",
    trait: "ESPINHOS",
    baseStats: { hp: 180, atk: 10, def: 30, spd: 10 },
    ability: "Enraizar",
    abilityDesc: "Impede o inimigo de esquivar por 2 turnos.",
    emoji: "\u{1FAB4}"
  },
  CARD_FALCAO: {
    monsterId: "FALCAO",
    name: "Falc\xE3o-Ruivo",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "PRECISAO",
    baseStats: { hp: 80, atk: 30, def: 8, spd: 40 },
    ability: "Voo Rasante",
    abilityDesc: "Ataques t\xEAm 30% de chance de ignorar defesa.",
    emoji: "\u{1F985}"
  },
  CARD_JAVALI: {
    monsterId: "JAVALI",
    name: "Javali-Musgoso",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 20, def: 20, spd: 15 },
    ability: "Coura\xE7a de Musgo",
    abilityDesc: "Reduz em 20% o dano m\xE1gico recebido.",
    emoji: "\u{1F417}"
  },
  CARD_FADA_CORROMPIDA: {
    monsterId: "FADA_CORROMPIDA",
    name: "Fada Corrompida",
    region: "BOSQUE_LYSS",
    rarity: "INCOMUM",
    trait: "REGENERACAO",
    baseStats: { hp: 60, atk: 20, def: 5, spd: 50 },
    ability: "P\xF3len Curativo",
    abilityDesc: "Cura 15% do HP de aliados no 3x3/5x5.",
    emoji: "\u{1F9DA}"
  },
  CARD_ARANHA_GIGANTE: {
    monsterId: "ARANHA_GIGANTE",
    name: "Aranha Gigante",
    region: "BOSQUE_LYSS",
    rarity: "INCOMUM",
    trait: "VENENO",
    baseStats: { hp: 120, atk: 25, def: 12, spd: 25 },
    ability: "Teia Pegajosa",
    abilityDesc: "Reduz SPD do inimigo em 20% por 3 turnos.",
    emoji: "\u{1F577}\uFE0F"
  },
  CARD_ESPECTRO: {
    monsterId: "ESPECTRO",
    name: "Espectro de Brasa",
    region: "BOSQUE_LYSS",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 200, atk: 45, def: 15, spd: 50 },
    ability: "Chama Espectral",
    abilityDesc: "Causa dano em \xE1rea (afeta 2 inimigos no 3x3/5x5).",
    emoji: "\u{1F47B}"
  },
  // ─── PICO DE DHOR (T2) ───
  CARD_GOLEM: {
    monsterId: "GOLEM",
    name: "Golem-Rocha",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "ESPINHOS",
    baseStats: { hp: 250, atk: 15, def: 40, spd: 10 },
    ability: "Pele de Pedra",
    abilityDesc: "Bloqueia 10% do dano recebido permanentemente.",
    emoji: "\u{1F5FF}"
  },
  CARD_URSO: {
    monsterId: "URSO",
    name: "Urso-Fenda",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "FURIA",
    baseStats: { hp: 220, atk: 35, def: 20, spd: 20 },
    ability: "F\xFAria Selvagem",
    abilityDesc: "Quando abaixo de 50% HP, ganha +30% ATK.",
    emoji: "\u{1F43B}"
  },
  CARD_BANDIDO: {
    monsterId: "BANDIDO",
    name: "Bandido do Desfiladeiro",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 40, def: 10, spd: 35 },
    ability: "Golpe Furtivo",
    abilityDesc: "Primeiro ataque sempre \xE9 cr\xEDtico.",
    emoji: "\u{1F977}"
  },
  CARD_ELEMENTAL_GELO: {
    monsterId: "ELEMENTAL_GELO",
    name: "Elemental de Gelo",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 180, atk: 30, def: 25, spd: 25 },
    ability: "Armadura de Gelo",
    abilityDesc: "Gera escudo de 20% HP a cada 3 turnos.",
    emoji: "\u{1F9CA}"
  },
  CARD_YETI: {
    monsterId: "YETI",
    name: "Yeti-do-Cume",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 280, atk: 30, def: 20, spd: 15 },
    ability: "Pele de Neve",
    abilityDesc: "Imune a dano de gelo.",
    emoji: "\u{1F98D}"
  },
  CARD_MORCEGO_MAGMA: {
    monsterId: "MORCEGO_MAGMA",
    name: "Morcego de Magma",
    region: "PICO_DHOR",
    rarity: "INCOMUM",
    trait: "SANGRAMENTO",
    baseStats: { hp: 130, atk: 45, def: 8, spd: 50 },
    ability: "Mordida Incandescente",
    abilityDesc: "Aplica sangramento que ignora cura.",
    emoji: "\u{1F987}"
  },
  CARD_CENTURIAO: {
    monsterId: "CENTURIAO",
    name: "Centuri\xE3o de Bronze",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESPINHOS",
    baseStats: { hp: 300, atk: 25, def: 35, spd: 10 },
    ability: "Forma\xE7\xE3o de Escudo",
    abilityDesc: "Reflete 30% do dano recebido.",
    emoji: "\u{1F916}"
  },
  CARD_COLOSSO: {
    monsterId: "COLOSSO",
    name: "Colosso de Dhor",
    region: "PICO_DHOR",
    rarity: "LENDARIO",
    trait: "INVESTIDA",
    baseStats: { hp: 500, atk: 60, def: 40, spd: 15 },
    ability: "Investida S\xEDsmica",
    abilityDesc: "Primeiro ataque atordoa o inimigo por 1 turno.",
    emoji: "\u{1F3D4}\uFE0F"
  },
  // ─── MAR DE AZHAR (T3) ───
  CARD_CARANGUEJO: {
    monsterId: "CARANGUEJO",
    name: "Caranguejo-Colosso",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "ESCUDO",
    baseStats: { hp: 400, atk: 35, def: 35, spd: 15 },
    ability: "Carapa\xE7a Dura",
    abilityDesc: "Reduz dano f\xEDsico recebido em 25%.",
    emoji: "\u{1F980}"
  },
  CARD_SERPENTE: {
    monsterId: "SERPENTE",
    name: "Serpente-N\xE9voa",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "VENENO",
    baseStats: { hp: 320, atk: 50, def: 15, spd: 40 },
    ability: "Pe\xE7onha Paralisante",
    abilityDesc: "Veneno reduz SPD do inimigo em 15%.",
    emoji: "\u{1F40D}"
  },
  CARD_MEDUSA: {
    monsterId: "MEDUSA",
    name: "Medusa-Trov\xE3o",
    region: "MAR_AZHAR",
    rarity: "INCOMUM",
    trait: "SILENCIO",
    baseStats: { hp: 280, atk: 45, def: 20, spd: 35 },
    ability: "Descarga El\xE9trica",
    abilityDesc: "25% de chance de atordoar o inimigo por 1 turno.",
    emoji: "\u{1FABC}"
  },
  CARD_SEREIA: {
    monsterId: "SEREIA",
    name: "Sereia-Cantora",
    region: "MAR_AZHAR",
    rarity: "INCOMUM",
    trait: "REGENERACAO",
    baseStats: { hp: 300, atk: 40, def: 20, spd: 30 },
    ability: "Canto Curativo",
    abilityDesc: "Cura 10% HP de si mesma por turno.",
    emoji: "\u{1F9DC}"
  },
  CARD_POLVO: {
    monsterId: "POLVO",
    name: "Polvo-Abissal",
    region: "MAR_AZHAR",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 380, atk: 55, def: 25, spd: 25 },
    ability: "Tent\xE1culos Sufocantes",
    abilityDesc: "Impede o inimigo de usar habilidade por 2 turnos.",
    emoji: "\u{1F419}"
  },
  CARD_TRITAO: {
    monsterId: "TRITAO",
    name: "Trit\xE3o Guerreiro",
    region: "MAR_AZHAR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 420, atk: 50, def: 30, spd: 20 },
    ability: "Tridente de Coral",
    abilityDesc: "Gera escudo equivalente a 15% do HP m\xE1ximo.",
    emoji: "\u{1F531}"
  },
  CARD_ENGUIA_ELETRICA: {
    monsterId: "ENGUIA_ELETRICA",
    name: "Enguia El\xE9trica",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "SILENCIO",
    baseStats: { hp: 350, atk: 60, def: 15, spd: 45 },
    ability: "Choque Paralisante",
    abilityDesc: "Cada ataque tem 20% de chance de silenciar.",
    emoji: "\u26A1"
  },
  CARD_LEVIATA: {
    monsterId: "LEVIATA",
    name: "Leviat\xE3 de Azhar",
    region: "MAR_AZHAR",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 800, atk: 90, def: 45, spd: 25 },
    ability: "Rugido Abissal",
    abilityDesc: "Reduz ATK de todos os inimigos em 20%.",
    emoji: "\u{1F40B}"
  },
  // ─── RUÍNAS DE ASTERION (T4) ───
  CARD_HIENA: {
    monsterId: "HIENA",
    name: "Hiena-Abissal",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 600, atk: 70, def: 25, spd: 50 },
    ability: "Risada Sanguin\xE1ria",
    abilityDesc: "Aplica sangramento de 8% HP por turno.",
    emoji: "\u{1F415}"
  },
  CARD_SENTINELA: {
    monsterId: "SENTINELA",
    name: "Sentinela de Pedra",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "ESPINHOS",
    baseStats: { hp: 750, atk: 50, def: 50, spd: 15 },
    ability: "Guarda Eterna",
    abilityDesc: "Reflete 30% do dano f\xEDsico recebido.",
    emoji: "\u{1F5FF}"
  },
  CARD_ESCORPIAO: {
    monsterId: "ESCORPIAO",
    name: "Escorpi\xE3o-R\xFAnico",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "VENENO",
    baseStats: { hp: 650, atk: 75, def: 30, spd: 40 },
    ability: "Ferr\xE3o R\xFAnico",
    abilityDesc: "Veneno causa dano dobrado por 2 turnos.",
    emoji: "\u{1F982}"
  },
  CARD_CULTISTA: {
    monsterId: "CULTISTA",
    name: "Cultista do Eclipse",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "MEDO",
    baseStats: { hp: 550, atk: 80, def: 20, spd: 35 },
    ability: "Maldi\xE7\xE3o do Eclipse",
    abilityDesc: "Reduz ATK do inimigo em 30% por 3 turnos.",
    emoji: "\u{1F9FF}"
  },
  CARD_MUMIA: {
    monsterId: "MUMIA",
    name: "M\xFAmia Ancestral",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 700, atk: 65, def: 40, spd: 15 },
    ability: "Maldi\xE7\xE3o Milenar",
    abilityDesc: "Impede a cura do inimigo por 3 turnos.",
    emoji: "\u{1F9DF}"
  },
  CARD_GARGULA: {
    monsterId: "GARGULA",
    name: "G\xE1rgula de Pedra",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 800, atk: 60, def: 45, spd: 25 },
    ability: "Est\xE1tua Viva",
    abilityDesc: "Fica imune a dano por 1 turno a cada 4 turnos.",
    emoji: "\u{1F987}"
  },
  CARD_GUARDIAO: {
    monsterId: "GUARDIAO",
    name: "Guardi\xE3o de Asterion",
    region: "RUINAS_ASTERION",
    rarity: "LENDARIO",
    trait: "ESPINHOS",
    baseStats: { hp: 1500, atk: 120, def: 60, spd: 20 },
    ability: "Juramento de Asterion",
    abilityDesc: "Reflete 50% de todo dano recebido.",
    emoji: "\u{1F6E1}\uFE0F"
  },
  // ─── CICATRIZ PROFUNDA (T5) ───
  CARD_CRIA_VAZIO: {
    monsterId: "CRIA_VAZIO",
    name: "Cria do Vazio",
    region: "CICATRIZ_PROFUNDA",
    rarity: "RARO",
    trait: "MEDO",
    baseStats: { hp: 1200, atk: 90, def: 30, spd: 45 },
    ability: "Sussurro do Vazio",
    abilityDesc: "Reduz ATK do inimigo em 25%.",
    emoji: "\u{1F47E}"
  },
  CARD_VERME: {
    monsterId: "VERME",
    name: "Verme-Abissal",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 1400, atk: 100, def: 40, spd: 20 },
    ability: "Devorar",
    abilityDesc: "Aplica sangramento permanente.",
    emoji: "\u{1FAB1}"
  },
  CARD_ABERRACAO: {
    monsterId: "ABERRACAO",
    name: "Aberra\xE7\xE3o Tentacular",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 1300, atk: 110, def: 35, spd: 30 },
    ability: "Sil\xEAncio Abissal",
    abilityDesc: "Bloqueia habilidade do inimigo por 3 turnos.",
    emoji: "\u{1F991}"
  },
  CARD_SOMBRA: {
    monsterId: "SOMBRA",
    name: "Sombra Faminta",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "MEDO",
    baseStats: { hp: 1e3, atk: 120, def: 25, spd: 50 },
    ability: "Consumir Medo",
    abilityDesc: "Cada ataque reduz ATK do inimigo em 5% (acumula).",
    emoji: "\u{1F311}"
  },
  CARD_CEIFADOR_ALMAS: {
    monsterId: "CEIFADOR_ALMAS",
    name: "Ceifador de Almas",
    region: "CICATRIZ_PROFUNDA",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 1500, atk: 130, def: 40, spd: 35 },
    ability: "Ceifa Final",
    abilityDesc: "Dano dobrado contra inimigos com <30% HP.",
    emoji: "\u{1F480}"
  },
  CARD_OLHO_VAZIO: {
    monsterId: "OLHO_VAZIO",
    name: "Olho do Vazio",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 1100, atk: 140, def: 25, spd: 40 },
    ability: "Olhar Petrificante",
    abilityDesc: "Impede o inimigo de usar habilidade.",
    emoji: "\u{1F441}\uFE0F"
  },
  CARD_DEVORADOR: {
    monsterId: "DEVORADOR",
    name: "Devorador da Cicatriz",
    region: "CICATRIZ_PROFUNDA",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 3e3, atk: 200, def: 70, spd: 30 },
    ability: "Fim de Todas as Coisas",
    abilityDesc: "Ignora 50% da defesa do inimigo.",
    emoji: "\u{1F479}"
  },
  // ─── PÂNTANO DE VEYRA (T3 — catálogo Pack 60) ───
  CARD_SAPO_MIASMA: {
    monsterId: "SAPO_MIASMA",
    name: "Sapo-Miasma",
    region: "PANTANO_VEYRA",
    rarity: "COMUM",
    trait: "VENENO",
    baseStats: { hp: 420, atk: 48, def: 18, spd: 24 },
    ability: "N\xE9voa T\xF3xica",
    abilityDesc: "A presen\xE7a do sapo enfraquece a cura recebida pelo inimigo.",
    emoji: "\u{1F438}"
  },
  CARD_LIBELULA_LAMINA: {
    monsterId: "LIBELULA_LAMINA",
    name: "Lib\xE9lula-L\xE2mina",
    region: "PANTANO_VEYRA",
    rarity: "INCOMUM",
    trait: "PRECISAO",
    baseStats: { hp: 360, atk: 68, def: 14, spd: 58 },
    ability: "Asa Cortante",
    abilityDesc: "A velocidade da lib\xE9lula favorece golpes precisos contra alvos expostos.",
    emoji: "\u{1F98B}"
  },
  CARD_CIPO_MEMORIA: {
    monsterId: "CIPO_MEMORIA",
    name: "Cip\xF3 da Mem\xF3ria",
    region: "PANTANO_VEYRA",
    rarity: "RARO",
    trait: "SILENCIO",
    baseStats: { hp: 520, atk: 58, def: 30, spd: 20 },
    ability: "La\xE7o Mn\xEAmico",
    abilityDesc: "Ra\xEDzes antigas interrompem o ritmo de uma habilidade inimiga.",
    emoji: "\u{1F33F}"
  },
  CARD_CROCODILO_SILTE: {
    monsterId: "CROCODILO_SILTE",
    name: "Crocodilo de Silte",
    region: "PANTANO_VEYRA",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 760, atk: 76, def: 48, spd: 16 },
    ability: "Coura\xE7a de Silte",
    abilityDesc: "A carapa\xE7a absorve parte do primeiro impacto recebido.",
    emoji: "\u{1F40A}"
  },
  CARD_MATRIARCA_LODO: {
    monsterId: "MATRIARCA_LODO",
    name: "Matriarca do Lodo",
    region: "PANTANO_VEYRA",
    rarity: "LENDARIO",
    trait: "REGENERACAO",
    baseStats: { hp: 1800, atk: 108, def: 42, spd: 18 },
    ability: "Ninhada Regenerativa",
    abilityDesc: "A ess\xEAncia do lodo recupera vitalidade quando a batalha se prolonga.",
    emoji: "\u{1F451}"
  },
  // ─── DESERTO DE KAELOR (T4 — catálogo Pack 60) ───
  CARD_ESCARAVELHO_VITREO: {
    monsterId: "ESCARAVELHO_VITREO",
    name: "Escaravelho V\xEDtreo",
    region: "DESERTO_KAELOR",
    rarity: "RARO",
    trait: "ESPINHOS",
    baseStats: { hp: 980, atk: 112, def: 44, spd: 28 },
    ability: "Carapa\xE7a Prism\xE1tica",
    abilityDesc: "O cristal do casco devolve parte da for\xE7a de um golpe f\xEDsico.",
    emoji: "\u{1FAB2}"
  },
  CARD_ESPECTRO_SOLAR: {
    monsterId: "ESPECTRO_SOLAR",
    name: "Espectro Solar",
    region: "DESERTO_KAELOR",
    rarity: "INCOMUM",
    trait: "MEDO",
    baseStats: { hp: 900, atk: 136, def: 34, spd: 42 },
    ability: "Clar\xE3o Sepulcral",
    abilityDesc: "A luz do deserto reduz a confian\xE7a do advers\xE1rio por alguns instantes.",
    emoji: "\u2600\uFE0F"
  },
  CARD_SERPENTE_MIRAGEM: {
    monsterId: "SERPENTE_MIRAGEM",
    name: "Serpente de Miragem",
    region: "DESERTO_KAELOR",
    rarity: "RARO",
    trait: "VENENO",
    baseStats: { hp: 1180, atk: 142, def: 42, spd: 54 },
    ability: "Presa Ilus\xF3ria",
    abilityDesc: "A miragem cria uma abertura e prolonga o efeito de veneno.",
    emoji: "\u{1F40D}"
  },
  CARD_GOLEM_OBSIDIANA: {
    monsterId: "GOLEM_OBSIDIANA",
    name: "Golem de Obsidiana",
    region: "DESERTO_KAELOR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 1480, atk: 148, def: 58, spd: 14 },
    ability: "Muralha Negra",
    abilityDesc: "A obsidiana mant\xE9m uma prote\xE7\xE3o densa contra o pr\xF3ximo impacto.",
    emoji: "\u{1F5FF}"
  },
  CARD_SENTINELA_ZENITE: {
    monsterId: "SENTINELA_ZENITE",
    name: "Sentinela do Z\xEAnite",
    region: "DESERTO_KAELOR",
    rarity: "LENDARIO",
    trait: "INVESTIDA",
    baseStats: { hp: 3e3, atk: 188, def: 64, spd: 22 },
    ability: "Veredito do Z\xEAnite",
    abilityDesc: "O guardi\xE3o concentra a luz do c\xE9u em sua primeira investida.",
    emoji: "\u{1F506}"
  }
};
var PACK60_CARD_TEMPLATE_IDS = [
  "CARD_SAPO_MIASMA",
  "CARD_LIBELULA_LAMINA",
  "CARD_CIPO_MEMORIA",
  "CARD_CROCODILO_SILTE",
  "CARD_MATRIARCA_LODO",
  "CARD_ESCARAVELHO_VITREO",
  "CARD_ESPECTRO_SOLAR",
  "CARD_SERPENTE_MIRAGEM",
  "CARD_GOLEM_OBSIDIANA",
  "CARD_SENTINELA_ZENITE"
];
var CARD_SEASON_EXPANSION_KEY = "2026-12";
function seasonCardTemplateIds(seasonKey) {
  const all = Object.keys(CARD_TEMPLATES);
  if (seasonKey < CARD_SEASON_EXPANSION_KEY) return all.filter((id) => !PACK60_CARD_TEMPLATE_IDS.includes(id));
  return all;
}
function seasonCardCatalogSize(seasonKey) {
  return seasonCardTemplateIds(seasonKey).length;
}
function seasonUniqueCards(cards, seasonKey) {
  const known = new Set(seasonCardTemplateIds(seasonKey));
  return new Set((cards ?? []).map((card) => card.templateId).filter((templateId) => known.has(templateId))).size;
}
function getCardStats(template, level) {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.min(5, Math.floor(level))) : 1;
  const mult = 1 + (safeLevel - 1) * 0.2;
  return {
    hp: Math.floor(template.baseStats.hp * mult),
    atk: Math.floor(template.baseStats.atk * mult),
    def: Math.floor(template.baseStats.def * mult),
    spd: Math.floor(template.baseStats.spd * mult)
  };
}
function createCardInstance(templateId) {
  return {
    uid: generateId(),
    templateId,
    level: 1,
    obtainedAt: Date.now()
  };
}
function cardDropChance(tier, isBoss) {
  return isBoss ? 5e-3 : tier === 1 ? 0.03 : tier === 2 ? 0.02 : tier === 3 ? 0.015 : tier === 4 ? 0.01 : 5e-3;
}
function rollCardDrop(monsterId, tier, isBoss) {
  const templateId = `CARD_${monsterId}`;
  if (!CARD_TEMPLATES[templateId]) return null;
  const chance = cardDropChance(tier, isBoss);
  if (Math.random() < chance) {
    return createCardInstance(templateId);
  }
  return null;
}

// src/engine/cardCollection.ts
var CARD_LOADOUT_LIMIT = 5;
var CARD_MAX_LEVEL = 5;
var CARD_HERO_WEIGHTS = { hp: 0.15, atk: 0.2, def: 0.15, spd: 2e-3 };
var CARD_EVOLUTION_GOLD = { COMUM: 150, INCOMUM: 300, RARO: 600, EPICO: 1200, LENDARIO: 2400 };
var CARD_RARITY_ORDER = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
function cardDuplicateBag(c) {
  if (!c) return [];
  const equipped = new Set(c.cardLoadout ?? []);
  const groups = /* @__PURE__ */ new Map();
  for (const card of c.cards ?? []) {
    if (!CARD_TEMPLATES[card.templateId]) continue;
    const group = groups.get(card.templateId) ?? [];
    group.push(card);
    groups.set(card.templateId, group);
  }
  const duplicateIds = /* @__PURE__ */ new Set();
  for (const group of groups.values()) {
    const ordered = [...group].sort((a, b) => {
      const aEquipped = equipped.has(a.uid) ? 1 : 0;
      const bEquipped = equipped.has(b.uid) ? 1 : 0;
      return bEquipped - aEquipped || b.level - a.level || a.obtainedAt - b.obtainedAt || a.uid.localeCompare(b.uid);
    });
    ordered.slice(1).forEach((card) => duplicateIds.add(card.uid));
  }
  return (c.cards ?? []).filter((card) => duplicateIds.has(card.uid));
}
function cardRarityRank(rarity) {
  return CARD_RARITY_ORDER.indexOf(rarity);
}
function recycleCardCopies(c, sourceTemplateId, materialUids) {
  const source = CARD_TEMPLATES[sourceTemplateId];
  if (!source) return { success: false, error: "Esta criatura n\xE3o existe no \xE1lbum de mem\xF3rias." };
  const ids = [...new Set(materialUids)];
  if (ids.length !== 4 || materialUids.length !== 4) return { success: false, error: "A roleta exige exatamente 4 c\xF3pias repetidas." };
  const bag = new Set(cardDuplicateBag(c).map((card) => card.uid));
  const selected = ids.map((uid) => c.cards.find((card) => card.uid === uid));
  if (selected.some((card) => !card) || selected.some((card) => card.templateId !== sourceTemplateId || card.level !== 1 || !bag.has(card.uid))) {
    return { success: false, error: "Use quatro c\xF3pias livres de n\xEDvel 1 da mesma criatura." };
  }
  const sourceRank = cardRarityRank(source.rarity);
  const candidates = Object.entries(CARD_TEMPLATES).filter(([, template]) => cardRarityRank(template.rarity) >= sourceRank);
  if (!candidates.length) return { success: false, error: "Nenhuma mem\xF3ria compat\xEDvel foi encontrada na roleta." };
  const equal = candidates.filter(([, template]) => cardRarityRank(template.rarity) === sourceRank);
  const higher = candidates.filter(([, template]) => cardRarityRank(template.rarity) > sourceRank);
  const pool2 = higher.length && Math.random() < 0.15 ? higher : equal.length ? equal : higher;
  const [rewardTemplateId, rewardTemplate] = pool2[Math.floor(Math.random() * pool2.length)];
  const reward = createCardInstance(rewardTemplateId);
  c.cards = (c.cards ?? []).filter((card) => !ids.includes(card.uid));
  c.cards.push(reward);
  return { success: true, reward, consumed: ids, sourceRarity: source.rarity, rewardRarity: rewardTemplate.rarity };
}
function equippedCards(c) {
  if (!c) return [];
  const byId = new Map((c.cards ?? []).map((card) => [card.uid, card]));
  return [...new Set(c.cardLoadout ?? [])].map((uid) => byId.get(uid)).filter((card) => !!card && !!CARD_TEMPLATES[card.templateId]).slice(0, CARD_LOADOUT_LIMIT);
}
function cardHeroBonus(card) {
  const template = CARD_TEMPLATES[card.templateId];
  if (!template) return { hp: 0, atk: 0, def: 0, spd: 0 };
  const s = getCardStats(template, card.level);
  return { hp: s.hp * CARD_HERO_WEIGHTS.hp, atk: s.atk * CARD_HERO_WEIGHTS.atk, def: s.def * CARD_HERO_WEIGHTS.def, spd: s.spd * CARD_HERO_WEIGHTS.spd };
}
function formationBonus(c) {
  return equippedCards(c).reduce((sum, card) => {
    const b = cardHeroBonus(card);
    return { hp: sum.hp + b.hp, atk: sum.atk + b.atk, def: sum.def + b.def, spd: sum.spd + b.spd };
  }, { hp: 0, atk: 0, def: 0, spd: 0 });
}
function cardFormationScore(c) {
  return equippedCards(c).reduce((sum, card) => {
    const s = getCardStats(CARD_TEMPLATES[card.templateId], card.level);
    return sum + s.atk * 0.35 + s.hp * 0.02 + s.def * 0.45 + s.spd * 0.1;
  }, 0);
}
function cardEvolutionQuote(c, uid) {
  const card = c.cards.find((entry) => entry.uid === uid), template = card && CARD_TEMPLATES[card.templateId];
  if (!card || !template) return null;
  const level = card.level, validLevel = Number.isInteger(level) && level >= 1 && level < CARD_MAX_LEVEL;
  const copiesNeeded = validLevel ? 2 ** level : 0;
  const gold = validLevel ? CARD_EVOLUTION_GOLD[template.rarity] * level ** 2 : 0;
  const equipped = new Set(c.cardLoadout ?? []);
  const eligible = c.cards.filter((entry) => entry.uid !== uid && entry.templateId === card.templateId && entry.level === 1 && !equipped.has(entry.uid)).sort((a, b) => a.obtainedAt - b.obtainedAt || a.uid.localeCompare(b.uid));
  return { card, template, level, nextLevel: validLevel ? level + 1 : CARD_MAX_LEVEL, maxed: !validLevel, copiesNeeded, gold, eligible, suggested: eligible.slice(0, copiesNeeded).map((entry) => entry.uid) };
}
function evolveCard(c, uid, materialUids, expectedLevel) {
  const quote = cardEvolutionQuote(c, uid);
  if (!quote) return { success: false, error: "Escolha uma carta conhecida da sua cole\xE7\xE3o." };
  if (quote.card.level !== expectedLevel) return { success: false, error: "O n\xEDvel desta carta mudou. Revise a evolu\xE7\xE3o novamente." };
  if (quote.maxed) return { success: false, error: "Esta carta j\xE1 atingiu o limite de evolu\xE7\xE3o (n\xEDvel 5)." };
  const ids = new Set(materialUids);
  if (materialUids.length !== quote.copiesNeeded || ids.size !== materialUids.length) return { success: false, error: `Selecione exatamente ${quote.copiesNeeded} c\xF3pias diferentes.` };
  const eligible = new Set(quote.eligible.map((card) => card.uid));
  if (materialUids.some((id) => !eligible.has(id))) return { success: false, error: "Use somente c\xF3pias iguais de n\xEDvel 1, livres da forma\xE7\xE3o." };
  if (c.cards.filter((card) => card.uid === uid).length !== 1 || materialUids.some((id) => c.cards.filter((card) => card.uid === id).length !== 1)) return { success: false, error: "H\xE1 identificadores repetidos na cole\xE7\xE3o. A evolu\xE7\xE3o foi interrompida." };
  if (!Number.isSafeInteger(c.gold) || c.gold < quote.gold) return { success: false, error: "Gold insuficiente para evoluir esta carta." };
  c.cards = c.cards.filter((card) => !ids.has(card.uid)).map((card) => card.uid === uid ? { ...card, level: card.level + 1 } : card);
  c.gold -= quote.gold;
  return { success: true, level: quote.nextLevel, spentGold: quote.gold, consumed: [...materialUids] };
}

// src/engine/stats.ts
function getBaseStats(level) {
  level = Number.isFinite(Number(level)) ? Math.max(1, Math.floor(Number(level))) : 1;
  return {
    hp: 150 + (level - 1) * 25,
    mp: 50 + (level - 1) * 15,
    atk: 12 + Math.floor((level - 1) * 2.5),
    matk: 12 + Math.floor((level - 1) * 2.5),
    def: 3 + Math.floor((level - 1) * 0.8),
    arm: 3 + Math.floor((level - 1) * 0.8),
    spd: 0,
    crit: 0.05,
    hit: 0.9,
    dge: 0.05,
    blk: 0,
    // NOVOS ATRIBUTOS BASE
    hpRegen: 1,
    mpRegen: 1,
    luck: 0,
    critDmg: 0.5
  };
}
function recalcStats(char) {
  const base = getBaseStats(char.level);
  const numeric = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  const fromGear = {};
  const fromRace = {};
  const fromVials = {};
  const fromBeast = {};
  const fromCards = {};
  const elementalResistances = {};
  const isUsingBow = char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO") ?? false;
  for (const slot of Object.keys(char.equipped)) {
    const item = char.equipped[slot];
    if (!item?.stats) continue;
    if (item.category === "FLECHA" && !isUsingBow) continue;
    for (const [k, v] of Object.entries(item.stats)) fromGear[k] = (fromGear[k] || 0) + numeric(v);
    for (const affix of item.affixes ?? []) fromGear[affix.stat] = (fromGear[affix.stat] || 0) + numeric(affix.value);
    for (const [element, value] of Object.entries(item.elementalResistances ?? {})) elementalResistances[element] = (elementalResistances[element] ?? 0) + numeric(value);
    if (item.enchantment) {
      if (item.enchantment.luckBonus) fromGear.luck = (fromGear.luck || 0) + numeric(item.enchantment.luckBonus);
      const enchantedWeapon = item.category === "ARMA" || item.category === "FLECHA" && isUsingBow;
      if (!enchantedWeapon && item.enchantment.element) {
        const element = item.enchantment.element;
        elementalResistances[element] = (elementalResistances[element] ?? 0) + numeric(item.enchantment.armorResistancePct);
      }
    }
  }
  if (char.activeRace && char.activeRace.bonus) {
    for (const [k, v] of Object.entries(char.activeRace.bonus)) fromRace[k] = numeric(v);
  }
  const now = Date.now();
  if (char.activeVials) {
    for (const [vialId, expiry] of Object.entries(char.activeVials)) {
      const family = vialId.replace(/_[0-9]+$/, "");
      const superseded = Object.entries(char.activeVials).some(([other, until]) => until > now && other.replace(/_[0-9]+$/, "") === family && Number(other.split("_").at(-1)) > Number(vialId.split("_").at(-1)));
      if (expiry > now && !superseded) {
        const vial = VIALS[vialId];
        if (vial) {
          for (const [k, v] of Object.entries(vial.stats)) fromVials[k] = (fromVials[k] || 0) + numeric(v);
        }
      }
    }
  }
  const passive = char.activeRace ? PASSIVE_EFFECTS[char.activeRace.passivaId] : void 0;
  const support = char.activeRace ? SUPPORT_EFFECTS[char.activeRace.suporteId] : void 0;
  const fromPassive = passive?.stats ?? {};
  const activeBeast = char.activeDivineBeastId ? DIVINE_BEASTS[char.activeDivineBeastId] : void 0;
  if (activeBeast && (char.divineBeasts ?? []).some((beast) => beast.id === activeBeast.id)) {
    for (const [k, v] of Object.entries(beastGrowth(char.level))) fromBeast[k] = v;
    for (const [k, v] of Object.entries(activeBeast.bonus)) fromBeast[k] = (fromBeast[k] ?? 0) + numeric(v);
  }
  Object.assign(fromCards, formationBonus(char));
  const skills = char.skills || { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  const skillAtkBonus = isUsingBow ? 0 : skills.melee * 1.5;
  const skillDistBonus = isUsingBow ? skills.distance * 1.5 : 0;
  const skillMatkBonus = skills.magic * 1.5;
  const skillArmBonus = skills.defense;
  const skillDefBonus = skills.defense * 0.5;
  const skillHitBonus = isUsingBow ? skills.distance * 5e-3 : 0;
  const atkMult = (1 + (support?.permAtkPct ?? 0)) * (1 + masteryBonus(char, isUsingBow ? "distance" : "melee"));
  const armMult = 1 + (passive?.armPct ?? 0) + (support?.permArmPct ?? 0);
  const hpMult = 1 + numeric(passive?.hpPct);
  const sum = (k) => numeric(fromGear[k]) + numeric(fromRace[k]) + numeric(fromPassive[k]) + numeric(fromVials[k]) + numeric(fromBeast[k]) + numeric(fromCards[k]);
  char.baseStats = {
    hp: Math.max(1, Math.floor((base.hp + sum("hp")) * hpMult)),
    mp: Math.max(0, Math.floor(base.mp + sum("mp"))),
    atk: Math.floor((base.atk + sum("atk") + skillAtkBonus + skillDistBonus) * atkMult),
    matk: Math.floor((base.matk + sum("matk") + skillMatkBonus) * (1 + masteryBonus(char, "magic"))),
    def: base.def + sum("def") + skillDefBonus,
    arm: Math.floor((base.arm + sum("arm") + skillArmBonus) * armMult * (1 + masteryBonus(char, "defense"))),
    spd: Math.min(base.spd + sum("spd"), 0.8),
    crit: Math.min(base.crit + sum("crit") + (support?.critBonus ?? 0), 0.85),
    hit: Math.min(base.hit + sum("hit") + (support?.hitBonus ?? 0) + skillHitBonus, 1),
    dge: Math.min(base.dge + sum("dge"), 0.5),
    blk: Math.min(base.blk + sum("blk"), 0.5),
    resFisico: Math.max(0, Math.min(sum("resFisico"), BALANCE.resistanceCap)),
    resMagico: Math.max(0, Math.min(sum("resMagico"), BALANCE.resistanceCap)),
    // NOVOS ATRIBUTOS
    hpRegen: (base.hpRegen ?? 0) + sum("hpRegen"),
    mpRegen: (base.mpRegen ?? 0) + sum("mpRegen") + Math.min(5, Math.floor((char.trainingMastery?.soul ?? 0) / 5)),
    luck: Math.min((base.luck ?? 0) + sum("luck"), 0.5),
    critDmg: (base.critDmg ?? 0.5) + sum("critDmg")
  };
  for (const element of ELEMENTS) elementalResistances[element.id] = Math.max(0, Math.min(BALANCE.resistanceCap, elementalResistances[element.id] ?? 0));
  char.elementalResistances = elementalResistances;
  char.hpMax = char.baseStats.hp;
  char.mpMax = char.baseStats.mp;
  char.hp = Math.min(Number.isFinite(char.hp) ? Math.max(0, char.hp) : char.hpMax, char.hpMax);
  char.mp = Math.min(Number.isFinite(char.mp) ? Math.max(0, char.mp) : char.mpMax, char.mpMax);
}
function xpToNextLevel(level) {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel <= 25) return Math.floor(Math.max(200 * Math.pow(safeLevel, 1.35), 100 * Math.pow(1.25, safeLevel - 1)));
  return Math.floor(100 * Math.pow(1.25, 24) * Math.pow(safeLevel / 25, 3.5));
}

// src/engine/itemCompare.ts
var STAT_WEIGHTS = {
  atk: 1,
  matk: 1,
  def: 1,
  arm: 1,
  hp: 0.3,
  mp: 0.1,
  crit: 4,
  critDmg: 4,
  hit: 4,
  dge: 4,
  blk: 4,
  spd: 2,
  resFisico: 3,
  resMagico: 3,
  hpRegen: 2,
  mpRegen: 2,
  luck: 5
};
function getItemScore(item) {
  if (!item) return 0;
  let score = 0;
  for (const [k, v] of Object.entries(item.stats)) {
    if (typeof v === "number") score += v * (STAT_WEIGHTS[k] ?? 1);
  }
  for (const affix of item.affixes ?? []) {
    score += affix.value * (STAT_WEIGHTS[affix.stat] ?? 1);
  }
  score *= 1 + (item.upgradeLevel ?? 0) * 0.1;
  return score;
}

// src/data/backpacks.ts
var BACKPACKS = {
  // A mochila inicial precisa permitir uma sessão de caça confortável.
  // As bolsas encontradas continuam sendo upgrades por bônus e capacidade.
  NORMAL: { templateId: "BACKPACK_NORMAL", name: "Normal Backpack", slots: 100, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  OLD: { templateId: "BACKPACK_OLD", name: "Old Backpack", slots: 60, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  COURO: { templateId: "BACKPACK_COURO", name: "Mochila de Couro", slots: 70, dropBonus: 0, rareDropBonus: 0, xpBonus: 0.02 },
  REFORCADA: { templateId: "BACKPACK_REFORCADA", name: "Mochila Refor\xE7ada", slots: 80, dropBonus: 0.03, rareDropBonus: 0, xpBonus: 0.03 },
  EXPLORADOR: { templateId: "BACKPACK_EXPLORADOR", name: "Mochila do Explorador", slots: 90, dropBonus: 0.06, rareDropBonus: 0.04, xpBonus: 0.04 },
  ARCANA: { templateId: "BACKPACK_ARCANA", name: "Mochila Arcana", slots: 100, dropBonus: 0.1, rareDropBonus: 0.08, xpBonus: 0.06 }
};
var DEFAULT_BACKPACK = BACKPACKS.NORMAL;

// src/engine/inventory.ts
function getUsedSlots(inv) {
  return inv.items.length;
}
function canAddItem(inv, item) {
  if (item.stackable) {
    const existing = inv.items.find((i) => i.templateId === item.templateId && i.quantity < i.maxStack);
    if (existing) return true;
  }
  return getUsedSlots(inv) < inv.backpack.slots;
}
function addItem(inv, item) {
  if (item.stackable) {
    let remaining = item.quantity;
    for (const existing of inv.items) {
      if (existing.templateId !== item.templateId || existing.quantity >= existing.maxStack) continue;
      const add = Math.min(existing.maxStack - existing.quantity, remaining);
      existing.quantity += add;
      remaining -= add;
      if (remaining === 0) return true;
    }
    if (remaining < item.quantity) item = { ...item, quantity: remaining };
  }
  if (getUsedSlots(inv) >= inv.backpack.slots) return false;
  inv.items.push({ ...item, uid: item.uid || Math.random().toString() });
  return true;
}
function removeItem(inv, uid, qty = 1) {
  const idx = inv.items.findIndex((i) => i.uid === uid);
  if (idx === -1) return false;
  if (inv.items[idx].stackable && inv.items[idx].quantity > qty) inv.items[idx].quantity -= qty;
  else inv.items.splice(idx, 1);
  return true;
}
function countByTemplate(inv, templateId) {
  return inv.items.filter((i) => i.templateId === templateId).reduce((n, i) => n + i.quantity, 0);
}
function equipBackpack(char, item, force = false) {
  const current = char.inventory.backpack;
  if ((item.slots ?? 0) <= current.slots && !force) return { success: false, error: "Voc\xEA j\xE1 usa uma mochila igual ou melhor. Confirme a troca para continuar." };
  const prev = char.equipped.BACKPACK;
  removeItem(char.inventory, item.uid);
  if (prev) addItem(char.inventory, prev);
  char.inventory.backpack = { templateId: item.templateId, name: item.name, slots: item.slots ?? current.slots, dropBonus: item.dropBonus ?? 0, rareDropBonus: item.rareDropBonus ?? 0, xpBonus: item.xpBonus ?? 0 };
  char.equipped.BACKPACK = item;
  return { success: true };
}
function equipItem(char, itemUid, force = false) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item || !item.slot) return { success: false, error: "Item inv\xE1lido" };
  const validSlot = item.category === "JOIA" && ["ANEL_I", "ANEL_II", "COLAR"].includes(item.slot) || item.category === "FLECHA" && item.slot === "MUNICAO" || item.category === "BACKPACK" && item.slot === "BACKPACK" || item.category === "PULSEIRA" && item.slot === "PULSEIRA" || item.category === "ARMA" && item.slot === "ARMA_PRINCIPAL" || item.category === "ESCUDO" && item.slot === "OFF_HAND" || item.category === "ARMADURA" && ["CAPACETE", "ARMADURA", "LUVAS", "CALCAS", "BOTAS"].includes(item.slot);
  if (!validSlot) return { success: false, error: "Este item n\xE3o pertence a esse slot de equipamento." };
  if (item.slot === "BACKPACK") return equipBackpack(char, item, force);
  let slot = item.slot;
  if (slot === "ANEL_I") {
    if (!char.equipped.ANEL_I) slot = "ANEL_I";
    else if (!char.equipped.ANEL_II) slot = "ANEL_II";
    else slot = getItemScore(char.equipped.ANEL_I) <= getItemScore(char.equipped.ANEL_II) ? "ANEL_I" : "ANEL_II";
  }
  const current = char.equipped[slot];
  if (current) {
    if (!canAddItem(char.inventory, current)) return { success: false, error: "Bolsa cheia! Jogue algo fora antes de trocar." };
    addItem(char.inventory, current);
  }
  removeItem(char.inventory, itemUid);
  char.equipped[slot] = item;
  recalcStats(char);
  return { success: true };
}
function unequipItem(char, slot) {
  const item = char.equipped[slot];
  if (!item) return { success: false, error: "Nenhum item equipado" };
  if (slot === "BACKPACK") {
    if (getUsedSlots(char.inventory) + 1 > DEFAULT_BACKPACK.slots) return { success: false, error: "Esvazie a bolsa para voltar \xE0 mochila padr\xE3o." };
    addItem(char.inventory, item);
    char.inventory.backpack = { ...DEFAULT_BACKPACK };
    delete char.equipped[slot];
    return { success: true };
  }
  if (!canAddItem(char.inventory, item)) return { success: false, error: "Bolsa cheia! Libere espa\xE7o." };
  addItem(char.inventory, item);
  delete char.equipped[slot];
  recalcStats(char);
  return { success: true };
}

// src/engine/journey.ts
function isGuided(c) {
  return c.journeyVersion === 1 && !c.tutorialCompleted;
}
function canUseTab(c, tab) {
  if (tab === "online" || tab === "ranking") return true;
  if (tab === "boss" || tab === "profissoes" || tab === "cards" || tab === "calendario") return !isGuided(c);
  if (!isGuided(c)) return true;
  if (!c.introSeen) return tab === "missoes";
  const done = c.quests.completed;
  const stages = { zona: "TUT_WIKI", matriz: "TUT_1", personagem: "TUT_2", backpack: "TUT_2", depot: "TUT_1", loja: "TUT_3", pets: "TUT_SELL", fazenda: "TUT_SELL", shop: "TUT_SELL", laboratorio: "TUT_TRAIN" };
  if (tab === "missoes" || tab === "wiki") return true;
  return !!stages[tab] && done.includes(stages[tab]);
}
function canEnterZone(c, id) {
  return id === "BOSQUE_LYSS" || !!c.unlockedZoneIds?.includes(id);
}
function canTutorialHunt(c) {
  if (!isGuided(c)) return true;
  if (!c.introSeen) return c.level > 1 || c.quests.completed.length > 0;
  return true;
}
function repairLegacyJourney(c) {
  if (!isGuided(c) || c.level <= 1) return false;
  const activeTutorial = ["TUT_1", "TUT_POTIONS", "TUT_3", "TUT_TRAIN", "TUT_SELL"].some((id) => !!c.quests.active[id]);
  if (activeTutorial) return false;
  const changed = !c.introSeen || !c.tutorialCompleted;
  if (changed) {
    c.introSeen = true;
    c.tutorialCompleted = true;
  }
  return changed;
}
function unlockJourneyZone(c, id) {
  const chapter = JOURNEY_CHAPTERS.find((x) => x.id === id), pass = chapter?.pass;
  if (!pass) return { success: false, error: "Passagem inv\xE1lida." };
  if (canEnterZone(c, id)) return { success: false, error: "Passagem j\xE1 liberada." };
  if (isGuided(c) || c.level < pass.level || !c.quests.completed.includes(pass.requires) || !c.quests.active[pass.questId]) return { success: false, error: "Aceite a miss\xE3o de travessia e conclua os pr\xE9-requisitos." };
  if (c.gold < pass.gold || pass.items.some((i) => countByTemplate(c.inventory, i.id) < i.count)) return { success: false, error: "Gold ou materiais insuficientes na mochila." };
  c.gold -= pass.gold;
  for (const requirement of pass.items) {
    let remaining = requirement.count;
    for (const item of [...c.inventory.items].filter((i) => i.templateId === requirement.id)) {
      const take = Math.min(item.quantity, remaining);
      if (take > 0) removeItem(c.inventory, item.uid, take);
      remaining -= take;
    }
  }
  c.unlockedZoneIds = [.../* @__PURE__ */ new Set([...c.unlockedZoneIds ?? ["BOSQUE_LYSS"], id])];
  delete c.quests.active[pass.questId];
  c.quests.completed.push(pass.questId);
  return { success: true };
}

// src/data/quests.ts
var kill = (target, count, name) => ({ type: "KILL", target, count, description: `Derrote ${count} ${name}` });
var boss = (target, name) => ({ type: "KILL_BOSS", target, count: 1, description: `Derrote o chefe ${name}` });
var collect = (target, count, name) => ({ type: "COLLECT", target, count, description: `Obtenha ${count}x ${name}` });
var discoverTotal = (count) => ({ type: "DISCOVER_TOTAL", count, description: `Descubra ${count} ra\xE7as na Matriz` });
var discoverNamed = (count) => ({ type: "DISCOVER_NAMED", count, description: `Descubra ${count} ra\xE7as lend\xE1rias` });
var QUESTS = [
  // ═══════════════════════════════════════════════════════════════
  // COMPÊNDIO — MILESTONES DE DESCOBERTA (Auto-aceitas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "COMP_T10",
    name: "Colecionador Iniciante",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    description: "A Matriz espera por voc\xEA. Descubra 10 ra\xE7as diferentes.",
    objectives: [discoverTotal(10)],
    rewards: { gold: 1300, xp: 25 }
  },
  {
    id: "COMP_T25",
    name: "Explorador da Matriz",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T10"],
    description: "O caminho do Arquivista \xE9 longo. Descubra 25 ra\xE7as.",
    objectives: [discoverTotal(25)],
    rewards: { gold: 5550, xp: 25 }
  },
  {
    id: "COMP_T50",
    name: "Arquivista Dedicado",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T25"],
    description: "Metade do caminho para a maestria. Descubra 50 ra\xE7as.",
    objectives: [discoverTotal(50)],
    rewards: { gold: 25e3, xp: 25, items: [{ templateId: "FRAGMENTO_RARO", quantity: 50 }] }
  },
  {
    id: "COMP_T100",
    name: "Mestre da Matriz",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T50"],
    description: "Voc\xEA domina a arte da s\xEDntese. Descubra 100 ra\xE7as.",
    objectives: [discoverTotal(100)],
    rewards: { gold: 1e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 25 }] }
  },
  {
    id: "COMP_T200",
    name: "O Caminho Infinito",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T100"],
    description: "Nenhum limite te det\xE9m. Descubra 200 ra\xE7as.",
    objectives: [discoverTotal(200)],
    rewards: { gold: 5e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] }
  },
  // ─── NOMEADAS (LENDÁRIAS) ───
  {
    id: "COMP_N1",
    name: "Primeira Lenda",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    description: "Descubra sua primeira ra\xE7a nomeada. Cada uma guarda um fragmento da hist\xF3ria de Mythreon.",
    objectives: [discoverNamed(1)],
    rewards: { gold: 3100, xp: 25 }
  },
  {
    id: "COMP_N5",
    name: "Ca\xE7ador de Lendas",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N1"],
    description: "Cinco nomes lend\xE1rios em sua cole\xE7\xE3o. Continue.",
    objectives: [discoverNamed(5)],
    rewards: { gold: 15e3, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 10 }] }
  },
  {
    id: "COMP_N10",
    name: "Guardi\xE3o das Hist\xF3rias",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N5"],
    description: "Dez ra\xE7as nomeadas descobertas. Voc\xEA est\xE1 entre os grandes Arquivistas.",
    objectives: [discoverNamed(10)],
    rewards: { gold: 75e3, xp: 25, items: [{ templateId: "FRAGMENTO_RARO", quantity: 25 }] }
  },
  {
    id: "COMP_N20",
    name: "Voz das Consci\xEAncias",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N10"],
    description: "Vinte lendas em sua cole\xE7\xE3o. Poucos chegam t\xE3o longe.",
    objectives: [discoverNamed(20)],
    rewards: { gold: 3e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] }
  },
  {
    id: "COMP_N33",
    name: "O \xDAltimo Arquivista",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N20"],
    description: "Todas as 33 ra\xE7as nomeadas descobertas. Voc\xEA \xE9 a lenda viva de Mythreon.",
    objectives: [discoverNamed(33)],
    rewards: { gold: 15e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 100 }] }
  },
  // ═══════════════════════════════════════════════════════════════
  // TUTORIAL / ONBOARDING
  // ═══════════════════════════════════════════════════════════════
  {
    id: "TUT_WIKI",
    name: "O Arquivo de Mythreon",
    giver: "Arquivista Sinax",
    category: "TUTORIAL",
    minLevel: 1,
    description: "Antes de partir, consulte a Wiki para conhecer o mundo e os caminhos de evolu\xE7\xE3o.",
    objectives: [{ type: "VISIT_WIKI", count: 1, description: "Visite o Arquivo / Wiki" }],
    rewards: { gold: 100, xp: 25 }
  },
  {
    id: "TUT_1",
    name: "O Primeiro Passo",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_POTIONS"],
    description: "Bem-vindo a Mythreon. Derrote 10 Lobos-Ferais para testar suas for\xE7as.",
    objectives: [kill("LOBO", 10, "Lobos")],
    rewards: { gold: 190, xp: 25 }
  },
  {
    id: "TUT_MATRIX",
    name: "Uma Matriz, Muitas Possibilidades",
    giver: "Arquivista Sinax",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_1"],
    description: "Conhe\xE7a a Matriz e descubra como combinar componentes para criar uma ra\xE7a \xFAnica.",
    objectives: [{ type: "VISIT_MATRIX", count: 1, description: "Visite a aba Matriz" }],
    rewards: { gold: 100, xp: 20, items: [{ templateId: "A1" }, { templateId: "S1" }, { templateId: "P1" }] }
  },
  {
    id: "TUT_POTIONS",
    name: "Preparar os Elixires",
    giver: "Herbalista Tom\xE9",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_WIKI"],
    description: "Na tela de ca\xE7a, escolha uma po\xE7\xE3o e ajuste o limite autom\xE1tico. Ativar o consumo \xE9 opcional e cada uso custa gold.",
    objectives: [{ type: "CONFIGURE_POTIONS", count: 1, description: "Configure uma po\xE7\xE3o de HP ou MP" }],
    rewards: { gold: 150, xp: 25 }
  },
  {
    id: "TUT_2",
    name: "A Forja da Alma",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_MATRIX"],
    description: "Combine um Ataque, um Suporte e uma Passiva na Matriz; depois equipe a ra\xE7a criada para concluir sua inicia\xE7\xE3o.",
    objectives: [{ type: "SYNTHESIZE", count: 1, description: "Crie uma ra\xE7a na Matriz" }, { type: "EQUIP_RACE", count: 1, description: "Equipe a ra\xE7a criada" }],
    rewards: { gold: 300, xp: 25 }
  },
  {
    id: "TUT_3",
    name: "Ciclo de Renova\xE7\xE3o",
    giver: "Herbalista Tom\xE9",
    category: "TUTORIAL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_2"],
    description: "Derrote criaturas para ganhar ouro e encontrar equipamentos. Bolk entrega tr\xEAs espadas de pr\xE1tica nesta etapa: uma para desmanchar, uma para aprimorar e uma para vender. Depois, seus equipamentos vir\xE3o dos drops.",
    objectives: [kill("ANY", 20, "criaturas"), { type: "EARN_GOLD", count: 300, description: "Ganhe 300 de Ouro" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "ESPADA_T1" }, { templateId: "ESPADA_T1" }, { templateId: "ESPADA_T1" }] }
  },
  {
    id: "TUT_FORGE_VISIT",
    name: "Conhe\xE7a o Ferreiro",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_3"],
    description: "O Ferreiro transforma drops em poder e Fragmentos. Visite a oficina para aprender os servi\xE7os dispon\xEDveis.",
    objectives: [{ type: "VISIT_FORGE", count: 1, description: "Visite o Ferreiro" }],
    rewards: { gold: 200, xp: 25 }
  },
  {
    id: "TUT_4",
    name: "Limpeza de Invent\xE1rio",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_FORGE_VISIT"],
    description: "Escolha um equipamento indesejado no Ferreiro e transforme-os em Fragmentos. Reserve pelo menos um equipamento de drop para aprimorar na pr\xF3xima etapa.",
    objectives: [{ type: "SALVAGE", count: 1, description: "Desmanche 1 equipamento" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 10 }] }
  },
  {
    id: "TUT_FORGE",
    name: "M\xE3os \xE0 Forja",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_4"],
    description: "Aprimore um equipamento no Ferreiro. Cada n\xEDvel exige ouro e Fragmentos; escolha um item que pretende manter.",
    objectives: [{ type: "FORGE", count: 1, description: "Aprimore um equipamento uma vez" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 5 }] }
  },
  {
    id: "TUT_SELL",
    name: "Uma Troca Justa",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_FORGE"],
    description: "Venda no Ferreiro um item que n\xE3o pretende usar. O valor em gold aparece antes da confirma\xE7\xE3o.",
    objectives: [{ type: "SELL", count: 1, description: "Venda 1 item ao Ferreiro" }],
    rewards: { gold: 100, xp: 25 }
  },
  { id: "TUT_PATHS", name: "Escolher quem se tornar", giver: "Anci\xE3 Seraphine", category: "TUTORIAL", minLevel: 1, requires: ["TUT_SELL"], description: "A Matriz transforma sua linhagem. Os pets nascem de Ovos de Besta Divina e lutam ao seu lado. Examine seus atributos em Personagem, conhe\xE7a a Incubadora de Pets e veja os recursos por gold no Shop. Voc\xEA n\xE3o precisa comprar nem possuir um pet para concluir.", objectives: [{ type: "VISIT_CHARACTER", count: 1, description: "Veja seus atributos em Personagem" }, { type: "VISIT_BEASTS", count: 1, description: "Conhe\xE7a os Pets e os Ovos de Besta" }, { type: "VISIT_SHOP", count: 1, description: "Conhe\xE7a o Shop, sem obriga\xE7\xE3o de comprar" }], rewards: { gold: 50, xp: 20 } },
  { id: "TUT_TRAIN", name: "Disciplina antes da for\xE7a", giver: "Guardi\xE3 Mirelle", category: "TUTORIAL", minLevel: 1, requires: ["TUT_PATHS"], description: "Na Casa em Explorar, clique em Treinar, escolha uma habilidade e pratique por 30 segundos. Treinar troca tempo de ca\xE7a por for\xE7a permanente; n\xE3o fornece XP de personagem. A inicia\xE7\xE3o pausa o treino ao cumprir o objetivo.", objectives: [{ type: "TRAIN", count: 30, description: "Treine uma habilidade por 30 segundos" }], rewards: { gold: 50, xp: 20 } },
  { id: "TUT_LAB", name: "Preparar antes de arriscar", giver: "Arquivista Sinax", category: "TUTORIAL", minLevel: 1, requires: ["TUT_TRAIN"], description: "Conhe\xE7a o Laborat\xF3rio de Builds. Ele estima resultados de combate com seu personagem e ajuda a planejar equipamentos, treino e sustento. As proje\xE7\xF5es n\xE3o liberam mapas nem garantem vit\xF3rias.", objectives: [{ type: "VISIT_LAB", count: 1, description: "Visite o Laborat\xF3rio de Builds" }], rewards: { gold: 50, xp: 20 } },
  {
    id: "TUT_BACKPACK",
    name: "Preparar a Jornada",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_LAB"],
    description: "Revise sua mochila e conhe\xE7a o dep\xF3sito. O Sigilo do Primeiro Eco reconhece sua inicia\xE7\xE3o: agora a jornada \xE9 livre. Procure Mirelle e siga as miss\xF5es do Bosque antes de enfrentar o Espectro de Brasa no n\xEDvel 15.",
    objectives: [{ type: "VISIT_BACKPACK", count: 1, description: "Visite sua Mochila" }, { type: "VISIT_DEPOT", count: 1, description: "Conhe\xE7a o Dep\xF3sito para guardar recursos" }],
    rewards: { gold: 300, xp: 25, items: [{ templateId: "UNICO_SIGILO_INICIACAO" }] }
  },
  // ═══════════════════════════════════════════════════════════════
  // HISTÓRIA POR ZONA
  // ═══════════════════════════════════════════════════════════════
  {
    id: "LYSS_1",
    name: "Praga de Vespas",
    giver: "Guardi\xE3 Mirelle",
    category: "HISTORIA",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_BACKPACK"],
    description: "Elimine 25 vespas e traga 3 ferr\xF5es. Equipamentos continuam sendo encontrados durante a ca\xE7a.",
    objectives: [kill("VESPA", 25, "Vespas"), collect("A2", 3, "Ferr\xF5es")],
    rewards: { gold: 500, xp: 150 }
  },
  {
    id: "LYSS_BOSS",
    name: "O Espectro de Brasa",
    giver: "Guardi\xE3 Mirelle",
    category: "DESAFIO",
    zoneId: "BOSQUE_LYSS",
    minLevel: 15,
    requires: ["LYSS_1"],
    description: "Derrote o Espectro de Brasa. Ele pode deixar sua mochila ou equipamento como drop ao ser derrotado.",
    objectives: [boss("ESPECTRO", "Espectro de Brasa")],
    rewards: { gold: 1e3, xp: 300 }
  },
  // ═══════════════════════════════════════════════════════════════
  // REPETÍVEIS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "REP_LYSS",
    name: "Patrulha do Bosque",
    giver: "Ca\xE7ador Brann",
    category: "REPETIVEL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 5,
    repeatable: true,
    requires: ["TUT_BACKPACK"],
    description: "Cace 100 criaturas em qualquer lugar do Bosque.",
    objectives: [kill("ANY", 100, "monstros")],
    rewards: { gold: 350, xp: 150 }
  }
];
for (const chapter of JOURNEY_CHAPTERS.filter((c) => c.pass)) {
  const pass = chapter.pass;
  QUESTS.push({ id: pass.questId, name: "Travessia: " + chapter.name, giver: pass.npc, category: "HISTORIA", minLevel: pass.level, requires: [pass.requires], description: chapter.story + " Entregue os recursos \xE0 expedi\xE7\xE3o para abrir permanentemente a passagem.", objectives: [{ type: "UNLOCK_ZONE", target: chapter.id, count: 1, description: "Financie a travessia de " + chapter.name }], rewards: {} });
  QUESTS.push({ id: chapter.id + "_STORY", name: chapter.mission, giver: pass.npc, category: "HISTORIA", zoneId: chapter.id, minLevel: pass.level, requires: [pass.questId], description: chapter.conflict, objectives: chapter.hunts.map((h) => kill(h.id, h.count, h.name)), rewards: { gold: Math.floor(pass.gold * 0.08), xp: 150 } });
  QUESTS.push({ id: chapter.id + "_BOSS", name: chapter.bossTitle, giver: pass.npc, category: "DESAFIO", zoneId: chapter.id, minLevel: chapter.bossLevel, requires: [chapter.id + "_STORY"], description: chapter.resolution, objectives: [boss(chapter.bossId, chapter.bossTitle)], rewards: { gold: Math.floor(pass.gold * 0.12), xp: 300 } });
}
var QUESTS_BY_ID = Object.fromEntries(QUESTS.map((q) => [q.id, q]));

// src/data/components.ts
var ATAQUES = {
  A1: { id: "A1", name: "Presa de Lobo-Feral", type: "ATAQUE", law: "RAAN", icon: "\u{1F9B7}", skillName: "Mordida Feral", skillDescription: "Dano f\xEDsico" },
  A2: { id: "A2", name: "Ferr\xE3o de Vespa", type: "ATAQUE", law: "VORO", icon: "\u{1F41D}", skillName: "Ferr\xE3o Venenoso", skillDescription: "Dano + veneno" },
  A3: { id: "A3", name: "Chama de Espectro", type: "ATAQUE", law: "KAELOR", icon: "\u{1F525}", skillName: "Chama Espectral", skillDescription: "Dano m\xE1gico" },
  A4: { id: "A4", name: "Garra de Urso", type: "ATAQUE", law: "DHOR", icon: "\u{1F43E}", skillName: "Garra Perfurante", skillDescription: "Dano + quebra DEF" },
  A5: { id: "A5", name: "Pe\xE7onha de Serpente", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1F40D}", skillName: "Pe\xE7onha", skillDescription: "Dano + lentid\xE3o" },
  A6: { id: "A6", name: "L\xE2mina de Bandido", type: "ATAQUE", law: "VORO", icon: "\u{1F5E1}\uFE0F", skillName: "Corte", skillDescription: "Dano perfurante" },
  A7: { id: "A7", name: "Espinho de Planta", type: "ATAQUE", law: "LYSS", icon: "\u{1F33F}", skillName: "Espinho", skillDescription: "Dano + sangramento" },
  A8: { id: "A8", name: "Mand\xEDbula de Hiena", type: "ATAQUE", law: "VORO", icon: "\u{1F9B4}", skillName: "Mordida", skillDescription: "Dano + medo" },
  A9: { id: "A9", name: "N\xFAcleo de Golem", type: "ATAQUE", law: "DHOR", icon: "\u{1FAA8}", skillName: "Impacto", skillDescription: "Dano em cone" },
  A10: { id: "A10", name: "Pena de Falc\xE3o", type: "ATAQUE", law: "RAAN", icon: "\u{1FAB6}", skillName: "Corte", skillDescription: "Dano + sil\xEAncio" },
  A11: { id: "A11", name: "Cristal de Gelo", type: "ATAQUE", law: "CHRONOS", icon: "\u2744\uFE0F", skillName: "Lan\xE7a G\xE9lida", skillDescription: "Dano m\xE1gico + lentid\xE3o" },
  A12: { id: "A12", name: "Tent\xE1culo Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1F419}", skillName: "Chicote Abissal", skillDescription: "Dano sombrio que ignora armadura" },
  A13: { id: "A13", name: "Fragmento de Tempestade", type: "ATAQUE", law: "KAELOR", icon: "\u26A1", skillName: "Descarga", skillDescription: "Dano de trov\xE3o em cadeia" },
  A14: { id: "A14", name: "Presa de Verme-Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1FAB1}", skillName: "Devorar", skillDescription: "Dano + drena vida" },
  A15: { id: "A15", name: "Fragmento de Asterion", type: "ATAQUE", law: "ASTER", icon: "\u2604\uFE0F", skillName: "Julgamento Estelar", skillDescription: "Dano sagrado devastador" },
  A16: { id: "A16", name: "Gl\xE2ndula de Miasma", type: "ATAQUE", law: "VEYRA", icon: "\u{1F9EA}", skillName: "N\xE9voa T\xF3xica", skillDescription: "Dano de veneno + corros\xE3o" },
  A17: { id: "A17", name: "Asa de Lib\xE9lula-L\xE2mina", type: "ATAQUE", law: "RAAN", icon: "\u{1FABD}", skillName: "Corte Prism\xE1tico", skillDescription: "Dano de vento + precis\xE3o" },
  A18: { id: "A18", name: "N\xF3 de Mem\xF3ria", type: "ATAQUE", law: "VEYRA", icon: "\u{1FAA2}", skillName: "La\xE7o da Mem\xF3ria", skillDescription: "Dano ps\xEDquico + eco" },
  A19: { id: "A19", name: "Dente de Silte", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1F9B7}", skillName: "Mordida Lodosa", skillDescription: "Dano de \xE1gua + lentid\xE3o" },
  A20: { id: "A20", name: "Coroa da Matriarca", type: "ATAQUE", law: "VEYRA", icon: "\u{1F451}", skillName: "Dil\xFAvio de Lodo", skillDescription: "Dano de veneno em \xE1rea" }
};
var SUPORTES = {
  S1: { id: "S1", name: "N\xFAcleo de Lyss", type: "SUPORTE", law: "LYSS", icon: "\u{1F49A}", skillName: "B\xEAn\xE7\xE3o de Lyss", skillDescription: "Cura" },
  S2: { id: "S2", name: "N\xFAcleo de Emohna", type: "SUPORTE", law: "EMOHNA", icon: "\u{1F91D}", skillName: "V\xEDnculo", skillDescription: "Buff ATK/DEF" },
  S3: { id: "S3", name: "N\xFAcleo de Aster", type: "SUPORTE", law: "ASTER", icon: "\u2728", skillName: "Aurora", skillDescription: "Cura + limpa debuff" },
  S4: { id: "S4", name: "N\xFAcleo de Nocthar", type: "SUPORTE", law: "NOCTHAR", icon: "\u{1F319}", skillName: "V\xE9u", skillDescription: "Escudo" },
  S5: { id: "S5", name: "N\xFAcleo de Chronos", type: "SUPORTE", law: "CHRONOS", icon: "\u23F3", skillName: "Acelera\xE7\xE3o", skillDescription: "Cooldown" },
  S6: { id: "S6", name: "N\xFAcleo de Veyra", type: "SUPORTE", law: "VEYRA", icon: "\u{1F4D6}", skillName: "Revela\xE7\xE3o", skillDescription: "Revela fraqueza" },
  S7: { id: "S7", name: "N\xFAcleo de Dhor", type: "SUPORTE", law: "DHOR", icon: "\u{1F6E1}\uFE0F", skillName: "Baluarte", skillDescription: "Buff DEF" },
  S8: { id: "S8", name: "N\xFAcleo de Raan", type: "SUPORTE", law: "RAAN", icon: "\u{1F4A8}", skillName: "Passo", skillDescription: "Velocidade" },
  S9: { id: "S9", name: "N\xFAcleo de Kaelor", type: "SUPORTE", law: "KAELOR", icon: "\u{1F300}", skillName: "Adapta\xE7\xE3o", skillDescription: "Resist\xEAncia" },
  S10: { id: "S10", name: "N\xFAcleo de Loghis", type: "SUPORTE", law: "LOGHIS", icon: "\u{1F9EE}", skillName: "C\xE1lculo", skillDescription: "Aumenta precis\xE3o e cr\xEDtico" },
  S11: { id: "S11", name: "N\xFAcleo de Prime", type: "SUPORTE", law: "PRIME", icon: "\u262F\uFE0F", skillName: "Equil\xEDbrio", skillDescription: "Buff ATK/DEF permanente" },
  S12: { id: "S12", name: "N\xFAcleo de Synthes", type: "SUPORTE", law: "SYNTHES", icon: "\u{1F517}", skillName: "Fus\xE3o", skillDescription: "Rouba vida dos golpes" },
  S13: { id: "S13", name: "N\xFAcleo de Voro", type: "SUPORTE", law: "VORO", icon: "\u{1FA78}", skillName: "Preda\xE7\xE3o", skillDescription: "Mais dano em alvos feridos" },
  S14: { id: "S14", name: "N\xFAcleo de Miasma", type: "SUPORTE", law: "VEYRA", icon: "\u2623\uFE0F", skillName: "V\xE9u Contaminado", skillDescription: "Resist\xEAncia a veneno" },
  S15: { id: "S15", name: "N\xFAcleo de L\xE2mina", type: "SUPORTE", law: "RAAN", icon: "\u{1F300}", skillName: "Corrente Cortante", skillDescription: "Precis\xE3o e velocidade" },
  S16: { id: "S16", name: "N\xFAcleo de Mem\xF3ria", type: "SUPORTE", law: "VEYRA", icon: "\u{1F4DC}", skillName: "Revela\xE7\xE3o Profunda", skillDescription: "Revela fraquezas e aumenta XP" },
  S17: { id: "S17", name: "N\xFAcleo de Silte", type: "SUPORTE", law: "NOCTHAR", icon: "\u{1F30A}", skillName: "Coura\xE7a de Lodo", skillDescription: "Escudo contra \xE1gua e f\xEDsico" },
  S18: { id: "S18", name: "N\xFAcleo da Matriarca", type: "SUPORTE", law: "VEYRA", icon: "\u{1F331}", skillName: "Raiz Regeneradora", skillDescription: "Regenera\xE7\xE3o de vida e mana" }
};
var PASSIVAS = {
  P1: { id: "P1", name: "Passiva da Floresta", type: "PASSIVA", law: "LYSS", icon: "\u{1F332}", skillName: "Mem\xF3ria", skillDescription: "+Cura recebida" },
  P2: { id: "P2", name: "Passiva da Montanha", type: "PASSIVA", law: "DHOR", icon: "\u26F0\uFE0F", skillName: "Granito", skillDescription: "+DEF" },
  P3: { id: "P3", name: "Passiva do Deserto", type: "PASSIVA", law: "PRIME", icon: "\u{1F3DC}\uFE0F", skillName: "Resist\xEAncia", skillDescription: "+Resist calor" },
  P4: { id: "P4", name: "Passiva do Cume", type: "PASSIVA", law: "RAAN", icon: "\u{1F32C}\uFE0F", skillName: "Vento", skillDescription: "+Velocidade" },
  P5: { id: "P5", name: "Passiva da Aurora", type: "PASSIVA", law: "ASTER", icon: "\u{1F305}", skillName: "Alvorecer", skillDescription: "+Cura aliados" },
  P6: { id: "P6", name: "Passiva da N\xE9voa", type: "PASSIVA", law: "NOCTHAR", icon: "\u{1F32B}\uFE0F", skillName: "N\xE9voa", skillDescription: "+Esquiva" },
  P7: { id: "P7", name: "Passiva do Vulc\xE3o", type: "PASSIVA", law: "KAELOR", icon: "\u{1F30B}", skillName: "F\xFAria", skillDescription: "+Dano fogo" },
  P8: { id: "P8", name: "Passiva das Esta\xE7\xF5es", type: "PASSIVA", law: "CHRONOS", icon: "\u{1F342}", skillName: "Ritmo", skillDescription: "+Recarga" },
  P9: { id: "P9", name: "Passiva da Encruzilhada", type: "PASSIVA", law: "VORO", icon: "\u{1F6E4}\uFE0F", skillName: "Ceticismo", skillDescription: "+Cr\xEDtico" },
  P10: { id: "P10", name: "Passiva da Biblioteca", type: "PASSIVA", law: "VEYRA", icon: "\u{1F3DB}\uFE0F", skillName: "Erudi\xE7\xE3o", skillDescription: "+XP" },
  P11: { id: "P11", name: "Passiva das Ru\xEDnas", type: "PASSIVA", law: "VEYRA", icon: "\u{1F3DA}\uFE0F", skillName: "Eco", skillDescription: "+Drops raros" },
  P12: { id: "P12", name: "Passiva da Forja", type: "PASSIVA", law: "SYNTHES", icon: "\u2692\uFE0F", skillName: "Forja", skillDescription: "+Crafting" },
  P13: { id: "P13", name: "Passiva do P\xE2ntano", type: "PASSIVA", law: "VEYRA", icon: "\u{1FAB7}", skillName: "Resili\xEAncia", skillDescription: "+Resist\xEAncia a veneno e \xE1gua" },
  P14: { id: "P14", name: "Passiva da Resina", type: "PASSIVA", law: "VEYRA", icon: "\u{1F7E2}", skillName: "Crescimento", skillDescription: "+Regenera\xE7\xE3o e vida m\xE1xima" }
};
var ALL_COMPONENTS = { ...ATAQUES, ...SUPORTES, ...PASSIVAS };

// src/data/affixes.ts
var PERCENT_AFFIX_RANGES = {
  COMUM: { crit: [5e-3, 0.015], critDmg: [0.05, 0.1], hit: [5e-3, 0.015], spd: [5e-3, 0.015], luck: [5e-3, 0.015], dge: [5e-3, 0.015], blk: [5e-3, 0.015], resFisico: [5e-3, 0.015], resMagico: [5e-3, 0.015] },
  INCOMUM: { crit: [0.012, 0.025], critDmg: [0.08, 0.15], hit: [0.012, 0.025], spd: [0.012, 0.025], luck: [0.012, 0.025], dge: [0.012, 0.025], blk: [0.012, 0.025], resFisico: [0.012, 0.025], resMagico: [0.012, 0.025] },
  RARO: { crit: [0.02, 0.04], critDmg: [0.12, 0.22], hit: [0.02, 0.04], spd: [0.02, 0.04], luck: [0.02, 0.04], dge: [0.02, 0.04], blk: [0.02, 0.04], resFisico: [0.02, 0.04], resMagico: [0.02, 0.04] },
  EPICO: { crit: [0.035, 0.06], critDmg: [0.18, 0.3], hit: [0.035, 0.06], spd: [0.035, 0.06], luck: [0.035, 0.06], dge: [0.035, 0.06], blk: [0.035, 0.06], resFisico: [0.035, 0.06], resMagico: [0.035, 0.06] },
  LENDARIO: { crit: [0.055, 0.09], critDmg: [0.25, 0.4], hit: [0.055, 0.09], spd: [0.055, 0.09], luck: [0.055, 0.09], dge: [0.055, 0.09], blk: [0.055, 0.09], resFisico: [0.055, 0.09], resMagico: [0.055, 0.09] }
};
var WEAPON_AFFIXES = [
  { stat: "atk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "matk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "crit", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "critDmg", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "hit", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "spd", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "luck", minBase: 0, maxBase: 0, isPercent: true, weight: 10 }
  // Sorte = chance de drop raro
];
var ARMOR_AFFIXES = [
  { stat: "hp", minBase: 10, maxBase: 30, isPercent: false, weight: 20 },
  { stat: "arm", minBase: 1, maxBase: 3, isPercent: false, weight: 20 },
  { stat: "def", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "hpRegen", minBase: 1, maxBase: 5, isPercent: false, weight: 15 },
  { stat: "resFisico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "dge", minBase: 0, maxBase: 0, isPercent: true, weight: 10 }
];
var SHIELD_AFFIXES = [
  { stat: "arm", minBase: 2, maxBase: 6, isPercent: false, weight: 30 },
  { stat: "blk", minBase: 0, maxBase: 0, isPercent: true, weight: 30 },
  { stat: "hp", minBase: 10, maxBase: 20, isPercent: false, weight: 20 },
  { stat: "resFisico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 }
];
var JEWELRY_AFFIXES = [
  { stat: "hp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mpRegen", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "crit", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "atk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "matk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "luck", minBase: 0, maxBase: 0, isPercent: true, weight: 20 }
];
function getPoolForCategory(category) {
  switch (category) {
    case "ARMA":
      return WEAPON_AFFIXES;
    case "ARMADURA":
      return ARMOR_AFFIXES;
    case "ESCUDO":
      return SHIELD_AFFIXES;
    case "JOIA":
      return JEWELRY_AFFIXES;
    case "PULSEIRA":
      return JEWELRY_AFFIXES;
    default:
      return [];
  }
}

// src/engine/drops.ts
var RARITY_ORDER = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
var RARITY_MULT = { COMUM: 1, INCOMUM: 1.3, RARO: 1.7, EPICO: 2.2, LENDARIO: 3 };
var ZONE_BACKPACK_DROPS = { 1: "OLD", 2: "COURO", 3: "REFORCADA", 4: "EXPLORADOR", 5: "ARCANA" };
var AFFIX_COUNT = { COMUM: 1, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 4 };
var FLAT_AFFIX_MULT = { COMUM: 0.8, INCOMUM: 1, RARO: 1.35, EPICO: 1.75, LENDARIO: 2.2 };
function rollRarity(bonus = 0) {
  const r = Math.random() / (1 + clamp(bonus, 0, 1));
  if (r < 2e-3) return "LENDARIO";
  if (r < 0.02) return "EPICO";
  if (r < 0.1) return "RARO";
  if (r < 0.35) return "INCOMUM";
  return "COMUM";
}
function generateRandomAffixes(category, rarity, tier) {
  const pool2 = getPoolForCategory(category);
  if (!pool2 || pool2.length === 0) return [];
  const count = AFFIX_COUNT[rarity];
  if (count === 0) return [];
  const chosen = [];
  const usedStats = /* @__PURE__ */ new Set();
  for (let i = 0; i < count; i++) {
    const available = pool2.filter((p) => !usedStats.has(p.stat));
    if (available.length === 0) break;
    const totalWeight = available.reduce((acc, p) => acc + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let selected = available[0];
    for (const p of available) {
      rand -= p.weight;
      if (rand <= 0) {
        selected = p;
        break;
      }
    }
    usedStats.add(selected.stat);
    const tierMult = selected.isPercent ? 1 + (tier - 1) * 0.12 : 1 + (tier - 1) * 0.35;
    const rarityRange = selected.isPercent ? PERCENT_AFFIX_RANGES[rarity]?.[selected.stat] : void 0;
    const min = rarityRange?.[0] ?? selected.minBase;
    const max = rarityRange?.[1] ?? selected.maxBase;
    const rawValue = (min + Math.random() * (max - min)) * tierMult * (selected.isPercent ? 1 : FLAT_AFFIX_MULT[rarity]);
    const value = selected.isPercent ? Math.round(rawValue * 100) / 100 : Math.round(rawValue);
    chosen.push({
      law: "PRIME",
      stat: selected.stat,
      value
    });
  }
  return chosen;
}
function makeEquipment(templateId, rarity = "COMUM") {
  const base = ALL_ITEM_TEMPLATES[templateId];
  if (!base) return null;
  if (UNIQUE_TEMPLATES[templateId] || base.category === "POCAO") {
    return { ...base, uid: generateId(), stats: { ...base.stats }, upgradeLevel: 0 };
  }
  const mult = RARITY_MULT[rarity];
  const stats = {};
  for (const [k, v] of Object.entries(base.stats)) stats[k] = Math.round(v * mult * 100) / 100;
  const affixes = generateRandomAffixes(base.category, rarity, base.tier);
  const elementalChance = { COMUM: 0, INCOMUM: 0.35, RARO: 0.6, EPICO: 0.8, LENDARIO: 1 };
  const getsElement = base.category === "ARMA" && Math.random() < (elementalChance[rarity] ?? 0);
  const element = getsElement ? ELEMENTS.filter((item) => item.id !== "BASE")[Math.floor(Math.random() * 11)].id : void 0;
  const elementalDamagePct = getsElement ? { INCOMUM: 0.08, RARO: 0.12, EPICO: 0.16, LENDARIO: 0.2 }[rarity] : void 0;
  return { ...base, uid: generateId(), rarity, stats, affixes, upgradeLevel: 0, element, elementalDamagePct };
}
function makeComponent(templateId) {
  const t = ALL_COMPONENTS[templateId];
  return createItem({ templateId: t.id, name: t.name, category: "COMPONENTE", tier: 1, componentType: t.type, law: t.law, icon: t.icon, stackable: true, maxStack: 999, quantity: 1, upgradeLevel: 0 });
}
function makeMaterial(templateId) {
  const t = ALL_ITEM_TEMPLATES[templateId];
  if (!t || t.category !== "MATERIAL") return null;
  return { ...t, uid: generateId(), stats: { ...t.stats }, quantity: 1, upgradeLevel: 0 };
}
function makeBackpack(key, tier = 1) {
  const bp = BACKPACKS[key];
  if (!bp) return null;
  return createItem({ templateId: bp.templateId, name: bp.name, category: "BACKPACK", slot: "BACKPACK", tier, icon: "\u{1F392}", slots: bp.slots, dropBonus: bp.dropBonus, rareDropBonus: bp.rareDropBonus, xpBonus: bp.xpBonus, upgradeLevel: 0 });
}
function rollAmbient(zone) {
  const pool2 = zone.ambientPool && zone.ambientPool.length ? zone.ambientPool : [zone.ambientDrop];
  return makeComponent(pool2[Math.floor(Math.random() * pool2.length)]);
}
function rollDrops(enemy, zone, _char, mods = { dropBonus: 0, rareBonus: 0 }) {
  const drops = [];
  const chance = (p) => mods.force || Math.random() < Math.min(1, p * (1 + clamp(mods.dropBonus, 0, 1)));
  const progressionScale = enemy.isBoss ? 1 : 0.68;
  if (chance(enemy.componentChance * progressionScale)) drops.push(makeComponent(enemy.componentId));
  if (enemy.essenceId && chance((enemy.essenceChance ?? 0) * (enemy.isBoss ? 1 : 0.58))) drops.push(makeComponent(enemy.essenceId));
  if (enemy.materialDropId && chance(enemy.materialChance ?? 0.35)) {
    const material = makeMaterial(enemy.materialDropId);
    if (material) drops.push(material);
  }
  if (chance(enemy.isBoss ? 0.25 : 0.08)) {
    const arrow = ARROW_TEMPLATES[`FLECHA_T${zone.tier}`];
    if (arrow) drops.push({ ...arrow, uid: generateId(), quantity: 1 });
  }
  if (chance(enemy.isBoss ? BALANCE.bossEquipmentDrop : BALANCE.equipmentDrop)) {
    const pool2 = enemy.equipmentDropIds?.length ? enemy.equipmentDropIds.map((id) => ALL_EQUIPMENT_TEMPLATES[id]).filter(Boolean) : Object.values(ALL_EQUIPMENT_TEMPLATES).filter((t) => t.tier === zone.tier);
    if (pool2.length > 0) {
      const base = pool2[Math.floor(Math.random() * pool2.length)];
      const eq = makeEquipment(base.templateId, rollRarity(mods.rareBonus + (enemy.isBoss ? 0.5 : 0)));
      if (eq) drops.push(eq);
    }
  }
  const regionalBackpack = enemy.backpackDrop ?? (enemy.isBoss || enemy.isElite || enemy.difficulty >= 3 ? ZONE_BACKPACK_DROPS[zone.tier] : void 0);
  const regionalBackpackChance = enemy.backpackChance ?? (enemy.isBoss ? 0.08 : enemy.isElite ? 0.04 : enemy.difficulty >= 3 ? 0.012 : 0);
  if (regionalBackpack && chance(regionalBackpackChance)) {
    const bp = makeBackpack(regionalBackpack, zone.tier);
    if (bp) drops.push(bp);
  }
  if (enemy.uniqueDropId && chance(enemy.uniqueDropChance ?? 0)) {
    const u = makeEquipment(enemy.uniqueDropId);
    if (u) drops.push(u);
  }
  if (enemy.protectionRingChance && chance(enemy.protectionRingChance)) {
    const ring = makeEquipment("UNICO_ANEL_GUARDIA");
    if (ring) drops.push(ring);
  }
  return drops;
}

// src/data/potionEconomy.ts
var POTION_GOLD_BY_TIER = [30, 110, 320, 900, 2600];
function getPotionUsePrice(templateId) {
  if (!templateId) return 0;
  const match = templateId.match(/_(\d+)$/);
  if (!match) return 0;
  const tier = Number(match[1]);
  return POTION_GOLD_BY_TIER[tier - 1] ?? 0;
}

// src/engine/questEngine.ts
function updateQuestProgress(char, result) {
  if (!char.quests || !char.quests.active) return;
  const activeQuests = Object.keys(char.quests.active);
  for (const questId of activeQuests) {
    const template = QUESTS.find((q) => q.id === questId);
    if (!template) continue;
    if (template.category === "COMPENDIO" || template.zoneId && result.zoneId && template.zoneId !== result.zoneId) continue;
    const progress = char.quests.active[questId].progress;
    template.objectives.forEach((obj, index) => {
      if (obj.type === "KILL" && result.killed) {
        if (obj.target === "ANY") {
          const totalKills = Object.values(result.killed).reduce((a, b) => a + b, 0);
          progress[index] = (progress[index] || 0) + totalKills;
        } else if (obj.target && result.killed[obj.target]) {
          progress[index] = (progress[index] || 0) + result.killed[obj.target];
        }
      }
      if (obj.type === "KILL_BOSS" && result.bossKills) {
        if (obj.target === "ANY") {
          const total = Object.values(result.bossKills).reduce((a, b) => a + b, 0);
          progress[index] = (progress[index] || 0) + total;
        } else if (obj.target && result.bossKills[obj.target]) {
          progress[index] = (progress[index] || 0) + result.bossKills[obj.target];
        }
      }
      if (obj.type === "COLLECT" && result.dropCounts && obj.target) {
        if (result.dropCounts[obj.target]) {
          progress[index] = (progress[index] || 0) + result.dropCounts[obj.target];
        }
      }
      if (obj.type === "EARN_GOLD") progress[index] = (progress[index] || 0) + result.gold;
      if (obj.type === "SALVAGE" && result.salvagedItems) progress[index] = (progress[index] || 0) + result.salvagedItems;
    });
  }
}
function trackQuestAction(char, action, amount = 1) {
  if (!char.quests?.active) return;
  for (const [questId, state] of Object.entries(char.quests.active)) {
    const template = QUESTS.find((quest) => quest.id === questId);
    if (!template || template.category !== "TUTORIAL") continue;
    template.objectives.forEach((objective, index) => {
      if (objective.type === action) state.progress[index] = Math.min(objective.count, (state.progress[index] ?? 0) + amount);
    });
  }
}
function trackRaceDiscovery(char, races) {
  if (!char.quests) char.quests = { active: {}, completed: [] };
  if (!char.quests.active) char.quests.active = {};
  if (!char.quests.completed) char.quests.completed = [];
  const totalRaces = races.length;
  const namedRaces = races.filter((r) => r.tier === "NOMEADA").length;
  QUESTS.filter((q) => q.category === "COMPENDIO").forEach((q) => {
    const achieved = q.objectives.every((o) => (o.type === "DISCOVER_NAMED" ? namedRaces : totalRaces) >= o.count);
    const eligible = achieved && (!q.requires || q.requires.every((id) => char.quests.completed.includes(id)));
    if (!eligible && char.quests.active[q.id]) delete char.quests.active[q.id];
    if (eligible && !char.quests.active[q.id] && !char.quests.completed.includes(q.id)) {
      char.quests.active[q.id] = { progress: [0] };
    }
  });
  Object.keys(char.quests.active).forEach((questId) => {
    const template = QUESTS.find((q) => q.id === questId);
    if (!template || template.category !== "COMPENDIO") return;
    template.objectives.forEach((obj, idx) => {
      if (obj.type === "DISCOVER_TOTAL") {
        char.quests.active[questId].progress[idx] = totalRaces;
      }
      if (obj.type === "DISCOVER_NAMED") {
        char.quests.active[questId].progress[idx] = namedRaces;
      }
    });
  });
}
function checkQuestCompletion(char, questId) {
  const template = QUESTS.find((q) => q.id === questId);
  const progress = char.quests.active[questId]?.progress;
  if (!template || !progress) return false;
  return template.objectives.every((obj, idx) => (progress[idx] || 0) >= obj.count);
}
function claimQuestReward(char, questId) {
  const template = QUESTS.find((q) => q.id === questId);
  if (!template || template.objectives.some((o) => o.type === "UNLOCK_ZONE") || !checkQuestCompletion(char, questId)) return { success: false, msg: "Miss\xE3o incompleta" };
  if (template.rewards.gold) char.gold += template.rewards.gold;
  if (template.rewards.xp) char.xp += template.rewards.xp;
  if (template.rewards.items) {
    for (const itemReward of template.rewards.items) {
      const quantity = itemReward.quantity || 1;
      if (itemReward.templateId.startsWith("POCAO_")) {
        char.gold += getPotionUsePrice(itemReward.templateId) * quantity;
        continue;
      }
      const backpackKey = itemReward.templateId.startsWith("BACKPACK_") ? itemReward.templateId.slice("BACKPACK_".length) : null;
      const reward = backpackKey ? makeBackpack(backpackKey) : ALL_COMPONENTS[itemReward.templateId] ? makeComponent(itemReward.templateId) : makeEquipment(itemReward.templateId, itemReward.rarity || "COMUM");
      if (reward) {
        reward.quantity = quantity;
        const inventory = structuredClone(char.inventory);
        if (addItem(inventory, reward)) char.inventory = inventory;
        else char.depot.push(reward);
      }
    }
  }
  delete char.quests.active[questId];
  if (!template.repeatable) {
    char.quests.completed.push(questId);
  }
  return { success: true, msg: `Recompensas resgatadas com sucesso!` };
}

// src/utils/questSignals.ts
function getAvailableQuests(character) {
  const active = character.quests?.active || {};
  const completed = new Set(character.quests?.completed || []);
  return QUESTS.filter(
    (quest) => (quest.category !== "TUTORIAL" || !character.tutorialCompleted) && (character.tutorialCompleted || quest.category === "TUTORIAL") && (quest.category !== "COMPENDIO" || !!active[quest.id]) && !active[quest.id] && !completed.has(quest.id) && character.level >= quest.minLevel && (!quest.requires || quest.requires.every((requiredId) => completed.has(requiredId) || requiredId === "TUT_BACKPACK" && !!character.tutorialCompleted))
  );
}

// src/store/gameStore.ts
var import_zustand = require("zustand");

// src/data/zones.ts
var ZONES = {
  // ═══════════════════════════════════════════════════════════════
  // ZONA 1: BOSQUE DE LYSS (T1 - Nível 1-10)
  // Tema: Floresta encantada (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  BOSQUE_LYSS: {
    id: "BOSQUE_LYSS",
    name: "Bosque de Lyss",
    tier: 1,
    minLevel: 1,
    maxLevel: 10,
    ambientDrop: "P1",
    ambientPool: ["P1", "P8", "P9"],
    theme: "forest",
    enemies: [
      { id: "LOBO", name: "Lobo-Feral", hp: 30, atk: 4, arm: 1, xp: 15, goldMin: 5, goldMax: 12, componentId: "A1", componentChance: 0.6, essenceId: "S1", essenceChance: 0.1, isBoss: false, emoji: "\u{1F43A}", difficulty: 1, minLevel: 1, sprite: "/assets/monsters/LOBO.png" },
      { id: "VESPA", name: "Vespa-Cinza", hp: 25, atk: 6, arm: 0, xp: 18, goldMin: 6, goldMax: 15, componentId: "A2", componentChance: 0.6, essenceId: "S1", essenceChance: 0.1, isBoss: false, emoji: "\u{1F41D}", difficulty: 2, minLevel: 1, sprite: "/assets/monsters/VESPA.png" },
      { id: "ESPINHEIRO", name: "Espinheiro-Vivo", hp: 20, atk: 4, arm: 2, xp: 21, goldMin: 9, goldMax: 16, componentId: "A7", componentChance: 0.55, essenceId: "S2", essenceChance: 0.12, isBoss: false, emoji: "\u{1FAB4}", difficulty: 2, minLevel: 3, sprite: "/assets/monsters/ESPINHEIRO.png" },
      { id: "FALCAO", name: "Falc\xE3o-Ruivo", hp: 18, atk: 6, arm: 1, xp: 25, goldMin: 10, goldMax: 18, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "\u{1F985}", difficulty: 3, minLevel: 5, sprite: "/assets/monsters/FALCAO.png" },
      { id: "JAVALI", name: "Javali-Musgoso", hp: 32, atk: 5, arm: 2, xp: 29, goldMin: 12, goldMax: 22, componentId: "A1", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "\u{1F417}", difficulty: 3, minLevel: 7, sprite: "/assets/monsters/JAVALI.png" },
      // NOVOS MOBS T1
      { id: "FADA_CORROMPIDA", name: "Fada Corrompida", hp: 22, atk: 8, arm: 0, xp: 35, goldMin: 15, goldMax: 25, componentId: "A3", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DA}", difficulty: 2, minLevel: 4, sprite: "/assets/monsters/FADA_CORROMPIDA.png" },
      { id: "ARANHA_GIGANTE", name: "Aranha Gigante", hp: 40, atk: 7, arm: 3, xp: 40, goldMin: 18, goldMax: 28, componentId: "A2", componentChance: 0.6, essenceId: "S2", essenceChance: 0.1, isBoss: false, emoji: "\u{1F577}\uFE0F", difficulty: 2, minLevel: 6, sprite: "/assets/monsters/ARANHA_GIGANTE.png" },
      { id: "ESPECTRO", name: "Espectro de Brasa", hp: 160, atk: 16, arm: 8, xp: 80, goldMin: 60, goldMax: 100, componentId: "A3", componentChance: 1, essenceId: "S9", essenceChance: 0.3, isBoss: true, emoji: "\u{1F47B}", difficulty: 4, minLevel: 15, damageType: "MAGICO", element: "FOGO", backpackDrop: "OLD", backpackChance: 0.08, uniqueDropId: "UNICO_BRASA_ETERNA", uniqueDropChance: 0.06, sprite: "/assets/monsters/ESPECTRO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 2: PICO DE DHOR (T2 - Nível 11-25)
  // Tema: Montanha vulcânica (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  PICO_DHOR: {
    id: "PICO_DHOR",
    name: "Pico de Dhor",
    tier: 2,
    minLevel: 11,
    maxLevel: 25,
    ambientDrop: "P2",
    ambientPool: ["P2", "P4", "P7"],
    theme: "mountain",
    enemies: [
      { id: "GOLEM", name: "Golem-Rocha", hp: 150, atk: 15, arm: 8, xp: 50, goldMin: 20, goldMax: 40, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "\u{1F5FF}", difficulty: 3, minLevel: 11, sprite: "/assets/monsters/GOLEM.png" },
      { id: "URSO", name: "Urso-Fenda", hp: 120, atk: 20, arm: 5, xp: 60, goldMin: 25, goldMax: 50, componentId: "A4", componentChance: 0.55, essenceId: "S5", essenceChance: 0.12, isBoss: false, emoji: "\u{1F43B}", difficulty: 2, minLevel: 13, sprite: "/assets/monsters/URSO.png" },
      { id: "BANDIDO", name: "Bandido do Desfiladeiro", hp: 110, atk: 22, arm: 6, xp: 70, goldMin: 40, goldMax: 80, componentId: "A6", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F977}", difficulty: 3, minLevel: 16, sprite: "/assets/monsters/BANDIDO.png" },
      { id: "ELEMENTAL_GELO", name: "Elemental de Gelo", hp: 130, atk: 21, arm: 8, xp: 85, goldMin: 35, goldMax: 65, componentId: "A11", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "\u{1F9CA}", difficulty: 4, minLevel: 19, damageType: "MAGICO", element: "GELO", elementalResistances: { GELO: 0.35, AGUA: 0.15 }, sprite: "/assets/monsters/ELEMENTAL_GELO.png" },
      { id: "YETI", name: "Yeti-do-Cume", hp: 180, atk: 25, arm: 7, xp: 100, goldMin: 45, goldMax: 85, componentId: "A4", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "\u{1F98D}", difficulty: 4, minLevel: 22, sprite: "/assets/monsters/YETI.png" },
      // NOVOS MOBS T2
      { id: "MORCEGO_MAGMA", name: "Morcego de Magma", hp: 90, atk: 28, arm: 4, xp: 75, goldMin: 30, goldMax: 55, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "\u{1F987}", difficulty: 3, minLevel: 15, element: "FOGO", sprite: "/assets/monsters/MORCEGO_MAGMA.png" },
      { id: "CENTURIAO", name: "Centuri\xE3o de Bronze", hp: 200, atk: 18, arm: 15, xp: 90, goldMin: 50, goldMax: 90, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F916}", difficulty: 4, minLevel: 20, sprite: "/assets/monsters/CENTURIAO.png" },
      { id: "COLOSSO", name: "Colosso de Dhor", hp: 450, atk: 35, arm: 15, xp: 300, goldMin: 300, goldMax: 500, componentId: "A9", componentChance: 1, essenceId: "S7", essenceChance: 0.3, isBoss: true, emoji: "\u{1F3D4}\uFE0F", difficulty: 5, minLevel: 24, element: "TERRA", elementalResistances: { TERRA: 0.25, METAL: 0.2 }, backpackDrop: "COURO", backpackChance: 0.05, uniqueDropId: "UNICO_CORACAO_GRANITO", uniqueDropChance: 0.06, sprite: "/assets/monsters/COLOSSO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 3: MAR DE AZHAR (T3 - Nível 26-45)
  // Tema: Oceano profundo (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  MAR_AZHAR: {
    id: "MAR_AZHAR",
    name: "Mar de Azhar",
    tier: 3,
    minLevel: 26,
    maxLevel: 45,
    ambientDrop: "P6",
    ambientPool: ["P6", "P5", "P10"],
    theme: "ocean",
    enemies: [
      { id: "CARANGUEJO", name: "Caranguejo-Colosso", hp: 400, atk: 40, arm: 20, xp: 150, goldMin: 60, goldMax: 100, componentId: "A9", componentChance: 0.5, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "\u{1F980}", difficulty: 3, minLevel: 26, sprite: "/assets/monsters/CARANGUEJO.png" },
      { id: "SERPENTE", name: "Serpente-N\xE9voa", hp: 380, atk: 45, arm: 15, xp: 170, goldMin: 70, goldMax: 120, componentId: "A5", componentChance: 0.55, essenceId: "S3", essenceChance: 0.12, isBoss: false, emoji: "\u{1F40D}", difficulty: 4, minLevel: 28, sprite: "/assets/monsters/SERPENTE.png" },
      { id: "MEDUSA", name: "Medusa-Trov\xE3o", hp: 350, atk: 50, arm: 12, xp: 190, goldMin: 80, goldMax: 130, componentId: "A13", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "\u{1FABC}", difficulty: 3, minLevel: 32, damageType: "MAGICO", sprite: "/assets/monsters/MEDUSA.png" },
      { id: "SEREIA", name: "Sereia-Cantora", hp: 420, atk: 48, arm: 16, xp: 210, goldMin: 90, goldMax: 140, componentId: "A5", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DC}", difficulty: 4, minLevel: 35, damageType: "MAGICO", sprite: "/assets/monsters/SEREIA.png" },
      { id: "POLVO", name: "Polvo-Abissal", hp: 550, atk: 52, arm: 18, xp: 240, goldMin: 100, goldMax: 160, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "\u{1F419}", difficulty: 4, minLevel: 38, sprite: "/assets/monsters/POLVO.png" },
      // NOVOS MOBS T3
      { id: "TRITAO", name: "Trit\xE3o Guerreiro", hp: 450, atk: 55, arm: 25, xp: 250, goldMin: 110, goldMax: 180, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F531}", difficulty: 4, minLevel: 40, sprite: "/assets/monsters/TRITAO.png" },
      { id: "ENGUIA_ELETRICA", name: "Enguia El\xE9trica", hp: 380, atk: 62, arm: 14, xp: 280, goldMin: 120, goldMax: 200, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "\u26A1", difficulty: 4, minLevel: 42, damageType: "MAGICO", sprite: "/assets/monsters/ENGUIA_ELETRICA.png" },
      { id: "LEVIATA", name: "Leviat\xE3 de Azhar", hp: 1500, atk: 85, arm: 30, xp: 1200, goldMin: 1500, goldMax: 2500, componentId: "A12", componentChance: 1, essenceId: "S5", essenceChance: 0.3, isBoss: true, emoji: "\u{1F40B}", difficulty: 5, minLevel: 43, element: "AGUA", elementalResistances: { AGUA: 0.35, GELO: 0.1 }, backpackDrop: "REFORCADA", backpackChance: 0.04, uniqueDropId: "UNICO_ESCAMA_LEVIATA", uniqueDropChance: 0.06, sprite: "/assets/monsters/LEVIATA.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 4: RUÍNAS DE ASTERION (T4 - Nível 46-70)
  // Tema: Cidade antiga (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  RUINAS_ASTERION: {
    id: "RUINAS_ASTERION",
    name: "Ru\xEDnas de Asterion",
    tier: 4,
    minLevel: 46,
    maxLevel: 70,
    ambientDrop: "P11",
    ambientPool: ["P11", "P10", "P3"],
    theme: "ruins",
    enemies: [
      { id: "HIENA", name: "Hiena-Abissal", hp: 900, atk: 80, arm: 30, xp: 350, goldMin: 150, goldMax: 250, componentId: "A8", componentChance: 0.55, essenceId: "S9", essenceChance: 0.12, isBoss: false, emoji: "\u{1F415}", difficulty: 4, minLevel: 46, sprite: "/assets/monsters/HIENA.png" },
      { id: "SENTINELA", name: "Sentinela de Pedra", hp: 1100, atk: 75, arm: 40, xp: 400, goldMin: 180, goldMax: 280, componentId: "A9", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "\u{1F5FF}", difficulty: 4, minLevel: 50, sprite: "/assets/monsters/SENTINELA.png" },
      { id: "ESCORPIAO", name: "Escorpi\xE3o-R\xFAnico", hp: 850, atk: 95, arm: 25, xp: 450, goldMin: 200, goldMax: 320, componentId: "A2", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F982}", difficulty: 4, minLevel: 55, sprite: "/assets/monsters/ESCORPIAO.png" },
      { id: "CULTISTA", name: "Cultista do Eclipse", hp: 800, atk: 110, arm: 20, xp: 500, goldMin: 220, goldMax: 350, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9FF}", difficulty: 5, minLevel: 60, damageType: "MAGICO", sprite: "/assets/monsters/CULTISTA.png" },
      // NOVOS MOBS T4
      { id: "MUMIA", name: "M\xFAmia Ancestral", hp: 1e3, atk: 90, arm: 35, xp: 550, goldMin: 250, goldMax: 400, componentId: "A14", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DF}", difficulty: 4, minLevel: 52, sprite: "/assets/monsters/MUMIA.png" },
      { id: "GARGULA", name: "G\xE1rgula de Pedra", hp: 1200, atk: 100, arm: 45, xp: 600, goldMin: 280, goldMax: 450, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "\u{1F987}", difficulty: 5, minLevel: 58, sprite: "/assets/monsters/GARGULA.png" },
      { id: "GUARDIAO", name: "Guardi\xE3o de Asterion", hp: 2500, atk: 150, arm: 50, xp: 3e3, goldMin: 3e3, goldMax: 5e3, componentId: "A15", componentChance: 1, essenceId: "S12", essenceChance: 0.3, isBoss: true, emoji: "\u{1F6E1}\uFE0F", difficulty: 5, minLevel: 66, backpackDrop: "EXPLORADOR", backpackChance: 0.03, uniqueDropId: "UNICO_OLHO_ASTERION", uniqueDropChance: 0.06, sprite: "/assets/monsters/GUARDIAO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 5: CICATRIZ PROFUNDA (T5 - Nível 71-100)
  // Tema: Abismo cósmico (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  CICATRIZ_PROFUNDA: {
    id: "CICATRIZ_PROFUNDA",
    name: "Cicatriz Profunda",
    tier: 5,
    minLevel: 71,
    maxLevel: 100,
    ambientDrop: "P12",
    ambientPool: ["P12", "P9", "P3"],
    theme: "abyss",
    enemies: [
      { id: "CRIA_VAZIO", name: "Cria do Vazio", hp: 1800, atk: 150, arm: 40, xp: 800, goldMin: 400, goldMax: 600, componentId: "A14", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1F47E}", difficulty: 4, minLevel: 71, damageType: "MAGICO", sprite: "/assets/monsters/CRIA_VAZIO.png" },
      { id: "VERME", name: "Verme-Abissal", hp: 2200, atk: 160, arm: 45, xp: 900, goldMin: 450, goldMax: 650, componentId: "A14", componentChance: 0.55, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1FAB1}", difficulty: 5, minLevel: 75, sprite: "/assets/monsters/VERME.png" },
      { id: "ABERRACAO", name: "Aberra\xE7\xE3o Tentacular", hp: 2500, atk: 180, arm: 50, xp: 1e3, goldMin: 500, goldMax: 700, componentId: "A12", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1F991}", difficulty: 5, minLevel: 82, element: "AGUA", sprite: "/assets/monsters/ABERRACAO.png" },
      { id: "SOMBRA", name: "Sombra Faminta", hp: 2e3, atk: 200, arm: 35, xp: 1100, goldMin: 550, goldMax: 750, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.12, isBoss: false, emoji: "\u{1F311}", difficulty: 5, minLevel: 88, damageType: "MAGICO", element: "MORTE", sprite: "/assets/monsters/SOMBRA.png" },
      // NOVOS MOBS T5
      { id: "CEIFADOR_ALMAS", name: "Ceifador de Almas", hp: 2800, atk: 220, arm: 55, xp: 1500, goldMin: 600, goldMax: 900, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "\u{1F480}", difficulty: 5, minLevel: 80, sprite: "/assets/monsters/CEIFADOR_ALMAS.png" },
      { id: "OLHO_VAZIO", name: "Olho do Vazio", hp: 2200, atk: 250, arm: 40, xp: 1600, goldMin: 650, goldMax: 950, componentId: "A15", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "\u{1F441}\uFE0F", difficulty: 5, minLevel: 85, damageType: "MAGICO", sprite: "/assets/monsters/OLHO_VAZIO.png" },
      { id: "DEVORADOR", name: "Devorador da Cicatriz", hp: 5e3, atk: 220, arm: 60, xp: 8e3, goldMin: 6e3, goldMax: 1e4, componentId: "A14", componentChance: 1, essenceId: "S13", essenceChance: 0.3, isBoss: true, emoji: "\u{1F479}", difficulty: 5, minLevel: 95, element: "MORTE", backpackDrop: "ARCANA", backpackChance: 0.02, uniqueDropId: "UNICO_PRESA_DEVORADOR", uniqueDropChance: 0.06, protectionRingChance: 0.015, sprite: "/assets/monsters/DEVORADOR.png" }
    ]
  }
};
ZONES.PANTANO_VEYRA = { id: "PANTANO_VEYRA", name: "P\xE2ntano de Veyra", tier: 3, minLevel: 26, maxLevel: 45, theme: "swamp", ambientDrop: "P3", ambientPool: ["P3", "P5"], enemies: [
  { id: "SAPO_MIASMA", name: "Sapo-Miasma", hp: 360, atk: 45, arm: 15, xp: 190, goldMin: 65, goldMax: 110, componentId: "A16", componentChance: 0.5, essenceId: "S14", essenceChance: 0.14, materialDropId: "RESINA_MIASMA", materialChance: 0.42, equipmentDropIds: ["CAPUZ_MIASMA_T3"], element: "VENENO", elementalResistances: { VENENO: 0.35, AGUA: 0.15 }, isBoss: false, difficulty: 2, minLevel: 26, emoji: "\u{1F438}" },
  { id: "LIBELULA_LAMINA", name: "Lib\xE9lula-L\xE2mina", hp: 310, atk: 55, arm: 12, xp: 220, goldMin: 75, goldMax: 120, componentId: "A17", componentChance: 0.5, essenceId: "S15", essenceChance: 0.14, materialDropId: "ASA_LAMINA", materialChance: 0.42, equipmentDropIds: ["LUVAS_LAMINA_T3", "ARCO_LIBELULA_T3"], element: "VENTO", isBoss: false, difficulty: 3, minLevel: 29, emoji: "\u{1F98B}" },
  { id: "CIPO_MEMORIA", name: "Cip\xF3 da Mem\xF3ria", hp: 420, atk: 48, arm: 23, xp: 260, goldMin: 90, goldMax: 140, componentId: "A18", componentChance: 0.5, essenceId: "S16", essenceChance: 0.14, materialDropId: "NO_MEMORIA", materialChance: 0.42, equipmentDropIds: ["MANTO_MEMORIA_T3", "COLAR_RAIZ_MEMORIA_T3"], element: "PSIQUICO", damageType: "MAGICO", isBoss: false, difficulty: 3, minLevel: 33, emoji: "\u{1F33F}" },
  { id: "CROCODILO_SILTE", name: "Crocodilo de Silte", hp: 600, atk: 60, arm: 28, xp: 320, goldMin: 110, goldMax: 170, componentId: "A19", componentChance: 0.5, essenceId: "S17", essenceChance: 0.14, materialDropId: "DENTE_SILTE", materialChance: 0.42, equipmentDropIds: ["BOTAS_SILTE_T3", "ESCUDO_CARAPACA_VEYRA_T3"], element: "AGUA", elementalResistances: { AGUA: 0.3 }, isBoss: false, difficulty: 4, minLevel: 38, emoji: "\u{1F40A}" },
  { id: "MATRIARCA_LODO", name: "Matriarca do Lodo", hp: 1500, atk: 82, arm: 32, xp: 1150, goldMin: 500, goldMax: 750, componentId: "A20", componentChance: 1, essenceId: "S18", essenceChance: 0.3, materialDropId: "COROA_LODO", materialChance: 0.8, equipmentDropIds: ["PULSEIRA_VEYRA_T3", "MANTO_MEMORIA_T3"], element: "VENENO", damageType: "MAGICO", elementalResistances: { VENENO: 0.4, AGUA: 0.2 }, isBoss: true, difficulty: 5, minLevel: 44, emoji: "\u{1F333}" }
] };
ZONES.DESERTO_KAELOR = { id: "DESERTO_KAELOR", name: "Deserto de Kaelor", tier: 4, minLevel: 46, maxLevel: 70, theme: "desert", ambientDrop: "P4", ambientPool: ["P4", "P7"], enemies: [
  { id: "ESCARAVELHO_VITREO", name: "Escaravelho V\xEDtreo", hp: 850, atk: 95, arm: 36, xp: 450, goldMin: 160, goldMax: 250, componentId: "A2", componentChance: 0.55, essenceId: "S10", essenceChance: 0.15, element: "METAL", elementalResistances: { METAL: 0.35 }, isBoss: false, difficulty: 3, minLevel: 46, emoji: "\u{1FAB2}" },
  { id: "ESPECTRO_SOLAR", name: "Espectro Solar", hp: 760, atk: 115, arm: 28, xp: 560, goldMin: 190, goldMax: 290, componentId: "A3", componentChance: 0.55, essenceId: "S9", essenceChance: 0.15, element: "FOGO", damageType: "MAGICO", elementalResistances: { FOGO: 0.35 }, isBoss: false, difficulty: 3, minLevel: 51, emoji: "\u2600\uFE0F" },
  { id: "SERPENTE_MIRAGEM", name: "Serpente de Miragem", hp: 1e3, atk: 120, arm: 35, xp: 650, goldMin: 220, goldMax: 320, componentId: "A5", componentChance: 0.55, essenceId: "S6", essenceChance: 0.15, element: "PSIQUICO", isBoss: false, difficulty: 4, minLevel: 56, emoji: "\u{1F40D}" },
  { id: "GOLEM_OBSIDIANA", name: "Golem de Obsidiana", hp: 1250, atk: 125, arm: 48, xp: 800, goldMin: 260, goldMax: 380, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.15, element: "TERRA", elementalResistances: { TERRA: 0.35, FOGO: 0.15 }, isBoss: false, difficulty: 4, minLevel: 61, emoji: "\u{1F5FF}" },
  { id: "SENTINELA_ZENITE", name: "Sentinela do Z\xEAnite", hp: 2600, atk: 155, arm: 52, xp: 3100, goldMin: 1e3, goldMax: 1600, componentId: "A15", componentChance: 1, essenceId: "S10", essenceChance: 0.3, element: "FOGO", damageType: "MAGICO", elementalResistances: { FOGO: 0.4, METAL: 0.2 }, isBoss: true, difficulty: 5, minLevel: 68, emoji: "\u{1F506}" }
] };
for (const zone of [ZONES.PANTANO_VEYRA, ZONES.DESERTO_KAELOR]) for (const enemy of zone.enemies) enemy.sprite = "/assets/monsters/" + enemy.id + ".png";
for (const zone of Object.values(ZONES)) {
  zone.enemies.sort((a, b) => {
    if (a.isBoss !== b.isBoss) return a.isBoss ? 1 : -1;
    return (a.minLevel ?? 1) - (b.minLevel ?? 1) || a.difficulty - b.difficulty || a.name.localeCompare(b.name);
  });
}

// src/engine/save.ts
var LEGACY_SAVE_KEY = "mythreon_save_v1";
var SAVE_KEY = LEGACY_SAVE_KEY;
function createNewCharacter(name, appearance) {
  const base = getBaseStats(1);
  const zeroSkills = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  return {
    id: Math.random().toString(),
    name,
    level: 1,
    xp: 0,
    xpToNext: xpToNextLevel(1),
    gold: 0,
    hp: base.hp,
    hpMax: base.hp,
    mp: base.mp,
    mpMax: base.mp,
    baseStats: base,
    appearance: appearance ?? { body: "MASCULINO", skin: "MORENA", hair: "CURTO", hairColor: "NEGRO", outfit: "VIAJANTE", outfitColor: "OCRE" },
    cosmeticLoadout: {},
    unlockedCosmetics: [],
    mythreonShards: 0,
    mythreonCoins: 0,
    equipped: {},
    inventory: { backpack: { ...DEFAULT_BACKPACK }, items: [
      createItem({ ...PROFESSION_TOOL_TEMPLATES.PICARETA_T1, uid: generateId() }),
      createItem({ ...PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T1, uid: generateId() })
    ] },
    killsInZone: 0,
    currentZoneId: "BOSQUE_LYSS",
    premium: false,
    premiumPlanId: void 0,
    premiumUntil: void 0,
    lastTick: Date.now(),
    pvpRating: 1e3,
    pvpWins: 0,
    pvpLosses: 0,
    quests: { active: {}, completed: [] },
    blesses: 0,
    skills: { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 },
    statPoints: 0,
    skillXp: { ...zeroSkills },
    trainingSkill: null,
    autoSalvage: null,
    autoSell: null,
    autoSellTemplateIds: [],
    autoSalvageTemplateIds: [],
    ignoredLootTemplateIds: [],
    bestiaryKills: {},
    autoHpPotionId: "POCAO_VIDA_1",
    autoHpPotionPercent: 50,
    autoHpPotionEnabled: false,
    autoMpPotionId: "POCAO_MANA_1",
    autoMpPotionPercent: 30,
    autoMpPotionEnabled: false,
    introSeen: false,
    journeyVersion: 1,
    unlockedZoneIds: ["BOSQUE_LYSS"],
    tutorialCompleted: false,
    tutorialRelicGranted: false,
    staminaOnline: 120,
    staminaOffline: 480,
    staminaUpdatedAt: Date.now(),
    activeVials: {},
    calendarCoupons: 0,
    calendarClaimedDays: [],
    calendarStreak: 0,
    calendarWeeklyRewardKey: void 0,
    calendarMonthlySkinKey: void 0,
    calendarUnlockedSkins: [],
    onlineChestSeconds: 0,
    onlineChestsOpened: 0,
    onlineChestDay: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    onlineChestClaims: [],
    cards: [],
    cardLoadout: [],
    divineBeasts: [],
    divineBeastNeeds: {},
    divineBeastAttackTimerMs: 0,
    divineBeastIncubator: void 0,
    depot: [],
    depotMax: 300,
    farm: { plots: [{ id: "plot-1", fertility: 100 }], unlockedPlots: 1, skills: { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }, lastActionAt: Date.now() },
    professions: { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 },
    equippedMiningTool: void 0,
    equippedFishingRod: void 0
  };
}
function saveGame(char, races) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, character: char, races, settings: {}, stats: {} }));
}
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.character) {
      if (data.character.journeyVersion === void 0) {
        data.character.journeyVersion = 0;
        data.character.introSeen = true;
        data.character.unlockedZoneIds = ["BOSQUE_LYSS", ...[["PICO_DHOR", 11], ["MAR_AZHAR", 26], ["RUINAS_ASTERION", 46], ["CICATRIZ_PROFUNDA", 71]].filter(([, level]) => data.character.level >= Number(level)).map(([id]) => String(id))];
        if (data.character.currentZoneId && !data.character.unlockedZoneIds.includes(data.character.currentZoneId)) data.character.unlockedZoneIds.push(data.character.currentZoneId);
      }
      const legacyPasses = { PICO_DHOR: "PASS_DHOR", MAR_AZHAR: "PASS_AZHAR", RUINAS_ASTERION: "PASS_ASTERION", CICATRIZ_PROFUNDA: "PASS_CICATRIZ" };
      if (data.character.journeyVersion === 0) {
        data.character.quests ??= { active: {}, completed: [] };
        for (const id of data.character.unlockedZoneIds ?? []) {
          const q = legacyPasses[id];
          if (q && !data.character.quests.completed.includes(q)) {
            data.character.quests.completed.push(q);
            delete data.character.quests.active[q];
          }
        }
      }
      const targetXp = xpToNextLevel(data.character.level || 1);
      const previousTarget = data.character.xpToNext;
      if (Number.isFinite(previousTarget) && previousTarget > 0 && previousTarget !== targetXp) {
        data.character.xp = Math.floor(Math.max(0, data.character.xp || 0) / previousTarget * targetXp);
      }
      data.character.xpToNext = targetXp;
      if (!data.character.skills) data.character.skills = { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 };
      if (!Number.isFinite(data.character.statPoints)) data.character.statPoints = Math.max(0, (data.character.level || 1) - 1);
      if (typeof data.character.skillXp === "number") data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      else if (!data.character.skillXp) data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      if (data.character.trainingSkill === void 0) data.character.trainingSkill = null;
      if (!data.character.quests) data.character.quests = { active: {}, completed: [] };
      if (data.character.blesses === void 0) data.character.blesses = 0;
      if (!Number.isFinite(data.character.mythreonShards)) data.character.mythreonShards = 0;
      if (!Number.isFinite(data.character.mythreonCoins)) data.character.mythreonCoins = 0;
      if (!Number.isFinite(data.character.pvpRating)) data.character.pvpRating = 1e3;
      if (!Number.isFinite(data.character.pvpWins)) data.character.pvpWins = 0;
      if (!Number.isFinite(data.character.pvpLosses)) data.character.pvpLosses = 0;
      if (data.character.premiumPlanId !== void 0 && typeof data.character.premiumPlanId !== "string") data.character.premiumPlanId = void 0;
      if (data.character.premiumUntil !== void 0 && !Number.isFinite(data.character.premiumUntil)) data.character.premiumUntil = void 0;
      if (data.character.autoSalvage === void 0) data.character.autoSalvage = null;
      if (data.character.autoSell === void 0) data.character.autoSell = null;
      if (!Array.isArray(data.character.autoSellTemplateIds)) data.character.autoSellTemplateIds = [];
      if (!Array.isArray(data.character.autoSalvageTemplateIds)) data.character.autoSalvageTemplateIds = [];
      if (!Array.isArray(data.character.ignoredLootTemplateIds)) data.character.ignoredLootTemplateIds = [];
      if (!data.character.bestiaryKills || typeof data.character.bestiaryKills !== "object") data.character.bestiaryKills = {};
      if (!data.character.autoHpPotionId) data.character.autoHpPotionId = "POCAO_VIDA_1";
      if (data.character.autoHpPotionPercent === void 0) data.character.autoHpPotionPercent = 50;
      if (data.character.autoHpPotionEnabled === void 0) data.character.autoHpPotionEnabled = false;
      if (!data.character.autoMpPotionId) data.character.autoMpPotionId = "POCAO_MANA_1";
      if (data.character.autoMpPotionPercent === void 0) data.character.autoMpPotionPercent = 30;
      if (data.character.autoMpPotionEnabled === void 0) data.character.autoMpPotionEnabled = false;
      if (data.character.tutorialCompleted === void 0) {
        data.character.tutorialCompleted = (data.character.level ?? 1) > 1;
      }
      if (data.character.tutorialRelicGranted === void 0) data.character.tutorialRelicGranted = false;
      if (data.character.quests?.completed?.includes("TUT_BACKPACK") && !data.character.tutorialRelicGranted) {
        const alreadyOwnsRelic = [...data.character.inventory?.items ?? [], ...data.character.depot ?? [], ...Object.values(data.character.equipped ?? {})].some((item) => item?.templateId === "UNICO_SIGILO_INICIACAO");
        if (alreadyOwnsRelic) data.character.tutorialRelicGranted = true;
        else {
          const relic = makeEquipment("UNICO_SIGILO_INICIACAO");
          const placed = relic && addItem(data.character.inventory, relic);
          if (relic && !placed) (data.character.depot ??= []).push(relic);
          if (relic) data.character.tutorialRelicGranted = true;
        }
      }
      if (!data.character.activeVials) data.character.activeVials = {};
      if (!Number.isFinite(data.character.calendarCoupons)) data.character.calendarCoupons = 0;
      if (!Array.isArray(data.character.calendarClaimedDays)) data.character.calendarClaimedDays = [];
      if (!Number.isFinite(data.character.calendarStreak)) data.character.calendarStreak = 0;
      if (data.character.calendarWeeklyRewardKey !== void 0 && typeof data.character.calendarWeeklyRewardKey !== "string") data.character.calendarWeeklyRewardKey = void 0;
      if (data.character.calendarMonthlySkinKey !== void 0 && typeof data.character.calendarMonthlySkinKey !== "string") data.character.calendarMonthlySkinKey = void 0;
      if (!Array.isArray(data.character.calendarUnlockedSkins)) data.character.calendarUnlockedSkins = [];
      if (!Number.isFinite(data.character.onlineChestSeconds)) data.character.onlineChestSeconds = 0;
      if (!Number.isFinite(data.character.onlineChestsOpened)) data.character.onlineChestsOpened = 0;
      if (!Number.isFinite(data.character.staminaOnline)) data.character.staminaOnline = 120;
      if (!Number.isFinite(data.character.staminaOffline)) data.character.staminaOffline = 480;
      if (!Number.isFinite(data.character.staminaUpdatedAt)) data.character.staminaUpdatedAt = Date.now();
      if (!data.character.cards) data.character.cards = [];
      if (!data.character.cosmeticLoadout || typeof data.character.cosmeticLoadout !== "object") data.character.cosmeticLoadout = {};
      if (!Array.isArray(data.character.unlockedCosmetics)) data.character.unlockedCosmetics = [];
      data.character.unlockedCosmetics = [...new Set(data.character.unlockedCosmetics.filter((id) => typeof id === "string" && Boolean(ALL_ITEM_TEMPLATES[id])))];
      if (!Array.isArray(data.character.cardLoadout)) data.character.cardLoadout = [];
      data.character.cardLoadout = data.character.cardLoadout.filter((uid) => typeof uid === "string").slice(0, 5);
      if (!Array.isArray(data.character.divineBeasts)) data.character.divineBeasts = [];
      data.character.divineBeasts = data.character.divineBeasts.map((beast, index) => ({ ...beast, instanceId: beast.instanceId ?? `legacy-beast-${beast.id}-${beast.obtainedAt ?? index}` }));
      if (!data.character.divineBeastNeeds || typeof data.character.divineBeastNeeds !== "object") data.character.divineBeastNeeds = {};
      if (!Number.isFinite(data.character.divineBeastAttackTimerMs)) data.character.divineBeastAttackTimerMs = 0;
      if (data.character.divineBeastIncubator && (!data.character.divineBeastIncubator.eggUid || !Number.isFinite(data.character.divineBeastIncubator.completesAt))) data.character.divineBeastIncubator = void 0;
      if (!data.character.depot) data.character.depot = [];
      if (!data.character.inventory?.backpack) data.character.inventory = { backpack: { ...DEFAULT_BACKPACK }, items: data.character.inventory?.items ?? [] };
      const savedBackpack = data.character.inventory.backpack;
      if (savedBackpack.templateId === DEFAULT_BACKPACK.templateId) {
        data.character.inventory.backpack = { ...DEFAULT_BACKPACK, ...savedBackpack, slots: Math.max(DEFAULT_BACKPACK.slots, Number(savedBackpack.slots) || 0) };
        const equippedBackpack = data.character.equipped?.BACKPACK;
        if (equippedBackpack?.templateId === DEFAULT_BACKPACK.templateId) equippedBackpack.slots = data.character.inventory.backpack.slots;
      }
      if (!data.character.farm || !Array.isArray(data.character.farm.plots)) data.character.farm = { plots: [{ id: "plot-1", fertility: 100 }], unlockedPlots: 1, skills: { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }, lastActionAt: Date.now() };
      data.character.professions ??= { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
      data.character.professions.mining ??= 0;
      data.character.professions.fishing ??= 0;
      const hasPickaxe = Boolean(data.character.equippedMiningTool || data.character.inventory?.items?.some((item) => item.templateId === "PICARETA_T1"));
      const hasRod = Boolean(data.character.equippedFishingRod || data.character.inventory?.items?.some((item) => item.templateId === "VARA_PESCA_T1"));
      if (!hasPickaxe) {
        const item = createItem({ ...PROFESSION_TOOL_TEMPLATES.PICARETA_T1, uid: generateId() });
        if (!addItem(data.character.inventory, item)) (data.character.depot ??= []).push(item);
      }
      if (!hasRod) {
        const item = createItem({ ...PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T1, uid: generateId() });
        if (!addItem(data.character.inventory, item)) (data.character.depot ??= []).push(item);
      }
      if (data.character.equippedMiningTool && data.character.equippedMiningTool.category !== "FERRAMENTA") data.character.equippedMiningTool = void 0;
      if (data.character.equippedFishingRod && data.character.equippedFishingRod.category !== "FERRAMENTA") data.character.equippedFishingRod = void 0;
      data.character.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
      data.character.farm.skills.irrigation ??= 0;
      data.character.farm.skills.fertility ??= 0;
      for (const plot of data.character.farm.plots) plot.fertility ??= 100;
      if (Array.isArray(data.character.inventory?.items)) {
        const normalized = [];
        for (const item of data.character.inventory.items) {
          const quantity = item.stackable ? Math.max(1, Number(item.quantity) || 1) : Math.max(1, Number(item.quantity) || 1);
          if (item.stackable || quantity === 1) normalized.push({ ...item, quantity: item.stackable ? quantity : 1, maxStack: item.stackable ? item.maxStack : 1 });
          else for (let i = 0; i < quantity; i++) normalized.push({ ...item, uid: `${item.uid}-${i + 1}`, quantity: 1, maxStack: 1 });
        }
        data.character.inventory.items = normalized;
      }
      if (data.character.depotMax === void 0) data.character.depotMax = 300;
      for (const item of [...data.character.inventory?.items ?? [], ...data.character.depot ?? []]) {
        if (item.category === "COMPONENTE" && item.stackable) item.maxStack = 999;
        if (item.templateId === "UNICO_BRASA_ETERNA") {
          item.category = "PULSEIRA";
          item.slot = "PULSEIRA";
        }
      }
      for (const item of [...data.character.inventory?.items ?? [], ...data.character.depot ?? [], ...Object.values(data.character.equipped ?? {})]) {
        if (/^FLECHA_T[1-5]$/.test(item.templateId)) {
          item.category = "FLECHA";
          item.slot = "MUNICAO";
          item.stackable = false;
          item.maxStack = 1;
          item.quantity = 1;
        }
        const template = ALL_ITEM_TEMPLATES[item.templateId];
        if (!template) continue;
        item.stats ??= {};
        for (const [key, value] of Object.entries(template.stats ?? {})) {
          const current = Number(item.stats[key]);
          if (!Number.isFinite(current) || current === 0) item.stats[key] = Math.round(Number(value) * Math.pow(1.1, item.upgradeLevel ?? 0) * 100) / 100;
        }
      }
      const equipped = data.character.equipped ?? {};
      for (const key of ["ANEL_I", "ANEL_II"]) {
        if (equipped[key]?.templateId !== "UNICO_BRASA_ETERNA") continue;
        const brasa = equipped[key];
        brasa.category = "PULSEIRA";
        brasa.slot = "PULSEIRA";
        if (!equipped.PULSEIRA) {
          equipped.PULSEIRA = brasa;
          delete equipped[key];
        } else {
          (data.character.inventory.items ??= []).push({ ...brasa, uid: `${brasa.uid}-pulseira` });
          delete equipped[key];
        }
      }
    }
    if (data.character) recalcStats(data.character);
    return data;
  } catch (e) {
    console.error("Erro ao carregar save:", e);
    return null;
  }
}

// src/engine/shop.ts
var TIER_BASE = [5, 20, 70, 220, 700];
var RARITY_SELL = { COMUM: 1, INCOMUM: 2, RARO: 5, EPICO: 12, LENDARIO: 40 };
function sellValue(item) {
  const professionValues = { LINGOTE_FERRO: 60, CRISTAL_REFINADO: 180, ISCA_CICATRIZ: 20, CALDO_MARCA_DAGUA: 190 };
  if (professionValues[item.templateId]) return professionValues[item.templateId];
  const farmValues = { COLHEITA_CENOURA: 18, COLHEITA_MELANCIA: 55, COLHEITA_TRIGO: 32, COLHEITA_LUMINA: 120, SOPA_CENOURA_LYSS: 85, ELIXIR_MARE_DOCE: 220, PAO_RUNICO_LYSS: 90 };
  if (farmValues[item.templateId]) return farmValues[item.templateId];
  switch (item.category) {
    case "COMPONENTE":
      return 8;
    case "POCAO":
      return Math.floor(getPotionUsePrice(item.templateId) * 0.4);
    case "BACKPACK":
      return (item.slots ?? 50) * 5;
    case "MATERIAL":
      return 10 * item.tier;
    default: {
      const affixBonus = 1 + (item.affixes?.length ?? 0) * 0.25;
      return Math.max(1, Math.floor(TIER_BASE[item.tier - 1] * RARITY_SELL[item.rarity] * affixBonus));
    }
  }
}
function sellItem(char, uid, qty = 1) {
  const item = char.inventory.items.find((i) => i.uid === uid);
  if (!item) return { success: false, gold: 0, count: 0, error: "Item n\xE3o encontrado" };
  if (!Number.isFinite(qty) || qty < 1) return { success: false, gold: 0, count: 0, error: "Quantidade inv\xE1lida" };
  const n = Math.min(Math.floor(qty), item.quantity);
  const gold = sellValue(item) * n;
  removeItem(char.inventory, uid, n);
  char.gold += gold;
  return { success: true, gold, count: n };
}
function sellSelectedItems(char, uids) {
  const selected = new Set(uids);
  let count = 0, gold = 0;
  const keep = [];
  for (const item of char.inventory.items) {
    if (!selected.has(item.uid)) {
      keep.push(item);
      continue;
    }
    const amount = Math.max(1, item.quantity);
    gold += sellValue(item) * amount;
    count += amount;
  }
  char.inventory.items = keep;
  char.gold += gold;
  return { count, gold };
}

// src/engine/salvage.ts
function salvageItem(char, item) {
  if (item.category === "COMPONENTE" || item.category === "FRAGMENTO" || item.category === "POCAO") return 0;
  let fragmentId = "FRAGMENTO_COMUM";
  let amount = 1;
  if (item.rarity === "RARO") {
    fragmentId = "FRAGMENTO_RARO";
    amount = 2;
  } else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") {
    fragmentId = "FRAGMENTO_EPICO";
    amount = 3;
  }
  const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: amount };
  addItem(char.inventory, frag);
  removeItem(char.inventory, item.uid, 1);
  return amount;
}
function salvageAllEquipment(char, maxRarity) {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  const fragCounts = {};
  const keep = [];
  let salvagedCount = 0;
  for (const item of char.inventory.items) {
    const isEquip = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category);
    const canSalvage = isEquip && item.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(item.rarity) <= limit;
    if (!canSalvage) {
      keep.push(item);
      continue;
    }
    let fragmentId = "FRAGMENTO_COMUM";
    let amount = 1;
    if (item.rarity === "RARO") {
      fragmentId = "FRAGMENTO_RARO";
      amount = 2;
    } else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") {
      fragmentId = "FRAGMENTO_EPICO";
      amount = 3;
    }
    fragCounts[fragmentId] = (fragCounts[fragmentId] || 0) + amount * item.quantity;
    salvagedCount += item.quantity;
  }
  char.inventory.items = keep;
  let fragsGained = 0;
  for (const [fragmentId, total] of Object.entries(fragCounts)) {
    const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: total };
    addItem(char.inventory, frag);
    fragsGained += total;
  }
  return { items: salvagedCount, frags: fragsGained };
}
function salvageSelectedEquipment(char, uids) {
  const selected = new Set(uids);
  const chosen = char.inventory.items.filter((item) => selected.has(item.uid) && ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category));
  let items = 0;
  let frags = 0;
  for (const item of chosen) {
    const quantity = item.quantity;
    for (let count = 0; count < quantity; count++) {
      const current = char.inventory.items.find((candidate) => candidate.uid === item.uid);
      if (!current) break;
      const amount = salvageItem(char, current);
      if (amount > 0) {
        items += 1;
        frags += amount;
      }
    }
  }
  return { items, frags };
}

// src/config.ts
var KEY = "mythreon_debug";
var debug = false;
try {
  debug = location.hostname === "localhost" && localStorage.getItem(KEY) === "1";
} catch {
}
function isDebug() {
  return debug;
}
var TICK_MS = 3e3;
var OFFLINE_MAX_HOURS = 8;

// src/data/mythreonEconomy.ts
var MYTHREON_ECONOMY = {
  shardsPerCoin: 100,
  goldPerCoin: 25e3,
  shardBaseChance: 8e-3,
  shardDifficultyBonus: 3e-3,
  shardLevelBonus: 5e-5
};
var MYTHREON_OFFERS = [
  { id: "BLACK_SIGIL", name: "Sigilo do Primeiro Eco", description: "Rel\xEDquia do despertar de um novo aventureiro.", icon: "\u2728", templateId: "UNICO_SIGILO_INICIACAO", priceCoins: 8, kind: "ITEM", tags: ["rel\xEDquia"] },
  { id: "GUARD_RING", name: "Anel da Guarda Eterna", description: "Protege os itens contra a perda ao morrer.", icon: "\u{1F48D}", templateId: "UNICO_ANEL_GUARDIA", priceCoins: 75, kind: "ITEM", tags: ["prote\xE7\xE3o"] },
  { id: "EPIC_FRAGMENT", name: "N\xFAcleo de Fragmento \xC9pico", description: "Material raro para forjas de alto n\xEDvel.", icon: "\u{1F52E}", templateId: "FRAGMENTO_EPICO", priceCoins: 1, kind: "ITEM", tags: ["forja"] },
  { id: "TOME_SABEDORIA_1H", name: "Tomo da Sabedoria Eterna \xB7 1h", description: "+20% de dano de habilidades elementais por 1 hora. N\xE3o substitui uma boa build.", icon: "\u{1F4D6}", priceCoins: 20, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 1, skillDmgPct: 0.2, tags: ["buff", "progress\xE3o"] },
  { id: "TOME_SABEDORIA_4H", name: "Tomo da Sabedoria Eterna \xB7 4h", description: "+20% de dano de habilidades elementais por 4 horas.", icon: "\u{1F4D8}", priceCoins: 60, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 4, skillDmgPct: 0.2, tags: ["buff", "progress\xE3o"] },
  { id: "TOME_SABEDORIA_12H", name: "Tomo da Sabedoria Eterna \xB7 12h", description: "+20% de dano de habilidades elementais por 12 horas.", icon: "\u{1F4D9}", priceCoins: 150, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 12, skillDmgPct: 0.2, tags: ["buff", "progress\xE3o"] },
  { id: "TOME_SABEDORIA_24H", name: "Tomo da Sabedoria Eterna \xB7 24h", description: "+20% de dano de habilidades elementais por 24 horas.", icon: "\u{1F4D5}", priceCoins: 260, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 24, skillDmgPct: 0.2, tags: ["buff", "progress\xE3o"] },
  { id: "TOME_SABEDORIA_ETERNAL", name: "Tomo da Sabedoria Eterna \xB7 Eterno", description: "+20% de dano de habilidades elementais permanente. Custo alto, efeito limitado e sem substituir uma build bem treinada.", icon: "\u{1F4DC}", priceCoins: 1500, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 0, skillDmgPct: 0.2, tags: ["buff", "eterno"] },
  { id: "PET_EGG_T3", name: "Ovo de Besta Divina \xB7 Raro", description: "Ovo de tier 3 para a Incubadora de Pets.", icon: "\u{1F95A}", templateId: "OVO_BESTA_T3", priceCoins: 35, kind: "ITEM", tags: ["pet"] },
  { id: "PET_EGG_T4", name: "Ovo de Besta Divina \xB7 \xC9pico", description: "Ovo de tier 4 com chances melhores de Pets raros.", icon: "\u{1F31F}", templateId: "OVO_BESTA_T4", priceCoins: 95, kind: "ITEM", tags: ["pet"] },
  { id: "PET_EGG_T5", name: "Ovo de Besta Divina \xB7 Lend\xE1rio", description: "Ovo de tier 5: a maior chance de uma linhagem extraordin\xE1ria.", icon: "\u{1F4A0}", templateId: "OVO_BESTA_T5", priceCoins: 260, kind: "ITEM", tags: ["pet"] },
  { id: "SUPPLY_CHEST", name: "Ba\xFA de Suprimentos", description: "Fragmentos e materiais \xFAteis para a pr\xF3xima etapa da jornada.", icon: "\u{1F381}", templateId: "BAU_SUPRIMENTOS_MYTHREON", priceCoins: 12, kind: "ITEM", tags: ["suprimentos"] },
  { id: "ROULETTE_KEY", name: "Chave da Roleta Arcana", description: "Abre um pr\xEAmio aleat\xF3rio na Roleta de Mythreon.", icon: "\u{1F5DD}\uFE0F", templateId: "CHAVE_ROLETA_ARCANA", priceCoins: 8, kind: "ITEM", tags: ["roleta"] },
  { id: "SKIN_CAPE_NEBULA", name: "Skin \xB7 Manto da Nebulosa", description: "Cosm\xE9tico exclusivo: brilho sutil, sem b\xF4nus de combate.", icon: "\u{1F9E5}", templateId: "SKIN_MANTO_NEBULOSA", priceCoins: 180, kind: "ITEM", tags: ["skin", "cosm\xE9tico"] },
  { id: "MATRIX_LUMINESCENCE", name: "Luminesc\xEAncia da Matriz", description: "Efeito visual arcano para Matrizes equipadas. Sem aumento de atributos.", icon: "\u{1F30C}", templateId: "LUMINESCENCIA_MATRIZ", priceCoins: 120, kind: "ITEM", tags: ["cosm\xE9tico"] },
  { id: "PET_LUMINESCENCE", name: "Aura da Besta Divina", description: "Brilho visual do Pet ativo. N\xE3o aumenta dano, atributos ou tempo de nutri\xE7\xE3o.", icon: "\u{1F43E}", templateId: "LUMINESCENCIA_PET", priceCoins: 120, kind: "ITEM", tags: ["pet", "cosm\xE9tico"] },
  { id: "BOSS_LUMINOUS_ADDON", name: "Addon \xB7 Aura do Boss Di\xE1rio", description: "Efeito visual de presen\xE7a para o mapa do Boss Di\xE1rio. Sem dano, defesa ou vantagem de loot.", icon: "\u2728", templateId: "ADDON_BOSS_LUMINESCENTE", priceCoins: 240, kind: "ITEM", tags: ["addon", "cosm\xE9tico", "boss"] }
];
var getMythreonOffer = (id) => MYTHREON_OFFERS.find((offer) => offer.id === id);
function shardChance(enemy) {
  const base = MYTHREON_ECONOMY.shardBaseChance + enemy.difficulty * MYTHREON_ECONOMY.shardDifficultyBonus + (enemy.minLevel ?? 1) * MYTHREON_ECONOMY.shardLevelBonus;
  return Math.min(0.05, base * (enemy.isBoss ? 1.5 : 1));
}

// src/data/enchantments.ts
var UNIQUE_ENCHANTMENTS = {
  BOSQUE_LYSS: { id: "ASPECTO_LYSS", name: "Aspecto da Vida", zoneId: "BOSQUE_LYSS", element: "SAGRADO", statusEffect: "radiante", visualKey: "lyss", description: "A Ess\xEAncia viva de Lyss floresce no equipamento.", weaponLabel: "+10% de dano sagrado", armorLabel: "+8% de resist\xEAncia sagrada", luckBonus: 0.01 },
  PICO_DHOR: { id: "ASPECTO_FLAMEJANTE", name: "Aspecto Flamejante", zoneId: "PICO_DHOR", element: "FOGO", statusEffect: "incandescente", visualKey: "flamejante", description: "A fenda t\xE9rmica mant\xE9m a pe\xE7a em combust\xE3o controlada.", weaponLabel: "+10% de dano de fogo", armorLabel: "+8% de resist\xEAncia a fogo" },
  MAR_AZHAR: { id: "ASPECTO_CONGELADO", name: "Aspecto Congelado", zoneId: "MAR_AZHAR", element: "GELO", statusEffect: "congelante", visualKey: "congelado", description: "O frio profundo de Azhar cristaliza o golpe e a defesa.", weaponLabel: "+10% de dano de gelo", armorLabel: "+8% de resist\xEAncia a gelo" },
  RUINAS_ASTERION: { id: "ASPECTO_ELETRIZANTE", name: "Aspecto Eletrizante", zoneId: "RUINAS_ASTERION", element: "ELETRICIDADE", statusEffect: "eletrocutado", visualKey: "eletrizante", description: "Runas antigas liberam um arco el\xE9trico a cada impacto.", weaponLabel: "+10% de dano el\xE9trico", armorLabel: "+8% de resist\xEAncia el\xE9trica" },
  CICATRIZ_PROFUNDA: { id: "ASPECTO_SOMBRIO", name: "Aspecto Sombrio", zoneId: "CICATRIZ_PROFUNDA", element: "MORTE", statusEffect: "sangrante", visualKey: "sombrio", description: "A Cicatriz do Vazio deixa a pe\xE7a marcada por energia de morte.", weaponLabel: "+10% de dano de morte", armorLabel: "+8% de resist\xEAncia \xE0 morte" },
  PANTANO_VEYRA: { id: "ASPECTO_ENVENENADO", name: "Aspecto Envenenado", zoneId: "PANTANO_VEYRA", element: "VENENO", statusEffect: "envenenado", visualKey: "envenenado", description: "O miasma de Veyra escorre pelas runas do equipamento.", weaponLabel: "+10% de dano venenoso", armorLabel: "+8% de resist\xEAncia a veneno" },
  DESERTO_KAELOR: { id: "ASPECTO_DA_SORTE", name: "Aspecto da Sorte", zoneId: "DESERTO_KAELOR", statusEffect: "afortunado", visualKey: "sorte", description: "A miragem de Kaelor dobra o acaso a favor do portador.", weaponLabel: "+10% de dano base", armorLabel: "+8% de resist\xEAncia f\xEDsica", luckBonus: 0.04 }
};
var ENCHANTMENT_RUNE_TEMPLATE = (zoneId) => {
  const def = UNIQUE_ENCHANTMENTS[zoneId];
  const tier = Math.max(1, Math.min(5, { BOSQUE_LYSS: 1, PICO_DHOR: 2, MAR_AZHAR: 3, PANTANO_VEYRA: 3, RUINAS_ASTERION: 4, DESERTO_KAELOR: 4, CICATRIZ_PROFUNDA: 5 }[zoneId] ?? 1));
  const runeRegionName = { BOSQUE_LYSS: "Lyss", PICO_DHOR: "Dhor", MAR_AZHAR: "Azhar", RUINAS_ASTERION: "Asterion", CICATRIZ_PROFUNDA: "Cicatriz", PANTANO_VEYRA: "Veyra", DESERTO_KAELOR: "Kaelor" }[zoneId] ?? def?.name.replace(/^Aspecto /, "") ?? "Desconhecida";
  return createItem({
    templateId: `RUNA_ENCANTADA_${zoneId}`,
    name: `Runa Encantada de ${runeRegionName}`,
    category: "MATERIAL",
    tier,
    rarity: tier >= 5 ? "EPICO" : tier >= 3 ? "RARO" : "INCOMUM",
    icon: "\u{1F52E}",
    stackable: true,
    maxStack: 999
  });
};
function enchantmentForZone(zoneId) {
  return UNIQUE_ENCHANTMENTS[zoneId];
}
function buildItemEnchantment(zoneId, itemTier) {
  const def = enchantmentForZone(zoneId);
  if (!def) return void 0;
  const tier = Math.max(1, Math.min(5, itemTier));
  const scale = 1 + (tier - 1) * 0.08;
  return {
    id: def.id,
    name: def.name,
    zoneId,
    tier,
    element: def.element,
    weaponDamagePct: Number((0.1 * scale).toFixed(3)),
    armorResistancePct: Number((0.08 * scale).toFixed(3)),
    luckBonus: def.luckBonus ? Number((def.luckBonus * scale).toFixed(3)) : void 0,
    statusEffect: def.statusEffect,
    visualKey: def.visualKey
  };
}
function enchantmentRuneTemplateId(zoneId) {
  return `RUNA_ENCANTADA_${zoneId}`;
}

// src/engine/huntWaves.ts
var HUNT_WAVE_COUNT = 5;
var STAGE_STATS = [
  { hp: 0.62, atk: 0.62, arm: 0.72, xp: 0.55, gold: 0.55 },
  { hp: 0.82, atk: 0.82, arm: 0.88, xp: 0.75, gold: 0.72 },
  { hp: 0.98, atk: 0.98, arm: 1, xp: 0.88, gold: 0.86 },
  { hp: 1.04, atk: 1.04, arm: 1.04, xp: 0.94, gold: 0.92 },
  { hp: 1.75, atk: 1.48, arm: 1.28, xp: 1.45, gold: 1.35 }
];
var FAMILY_IDS = {
  LOBO: "animal",
  URSO: "animal",
  JAVALI: "animal",
  HIENA: "animal",
  ESCORPIAO: "animal",
  SERPENTE: "animal",
  CARANGUEJO: "animal",
  POLVO: "animal",
  CROCODILO_SILTE: "animal",
  VERME: "animal",
  ARANHA_GIGANTE: "animal",
  VESPA: "insect",
  LIBELULA_LAMINA: "insect",
  FALCAO: "insect",
  MORCEGO_MAGMA: "insect",
  ENGUIA_ELETRICA: "insect",
  ESPINHEIRO: "plant",
  CIPO_MEMORIA: "plant",
  SAPO_MIASMA: "animal",
  GOLEM: "construct",
  ELEMENTAL_GELO: "construct",
  CENTURIAO: "construct",
  SENTINELA: "construct",
  GOLEM_OBSIDIANA: "construct",
  BANDIDO: "humanoid",
  CULTISTA: "humanoid",
  SEREIA: "humanoid",
  TRITAO: "humanoid",
  MUMIA: "undead",
  SOMBRA: "undead",
  CEIFADOR_ALMAS: "undead",
  FADA_CORROMPIDA: "arcane",
  ESPECTRO_SOLAR: "arcane",
  CRIA_VAZIO: "arcane",
  ABERRACAO: "arcane",
  OLHO_VAZIO: "arcane",
  MEDUSA: "arcane",
  YETI: "animal"
};
var SPECIAL_NAMES = {
  LOBO: ["Lobo adolescente azul", "Lobo adolescente vermelho", "Lobo adolescente azul", "Lobo adolescente vermelho", "Lobo Alfa"],
  VESPA: ["Vespa batedora", "Vespa Soldado", "Vespa Soldado azul", "Vespa Soldado rubra", "Vespa Cinza"],
  ESPINHEIRO: ["Roseira Brava", "Girassol Metralhadora", "Roseira Brava", "Girassol Metralhadora", "Espinheiro Vivo"]
};
function generatedNames(base) {
  const family = FAMILY_IDS[base.id] ?? "arcane";
  const root = base.name;
  if (family === "insect") return [`${root} Batedor`, `${root} Soldado`, `${root} da Colmeia`, `${root} da Colmeia`, `${root} Rainha`];
  if (family === "plant") return [`Broto de ${root}`, `Guardi\xE3 de ${root}`, `Col\xF4nia de ${root}`, `Col\xF4nia de ${root}`, `Anci\xE3o de ${root}`];
  if (family === "construct") return [`Fragmento de ${root}`, `Guardi\xE3o de ${root}`, `Dupla de ${root}`, `Dupla de ${root}`, `N\xFAcleo de ${root}`];
  if (family === "humanoid") return [`Recruta ${root}`, `Arauto ${root}`, `Irm\xE3os ${root}`, `Irm\xE3os ${root}`, `Mestre ${root}`];
  if (family === "undead") return [`Eco ${root}`, `Arauto ${root}`, `C\xEDrculo ${root}`, `C\xEDrculo ${root}`, `Soberano ${root}`];
  if (family === "animal") return [`${root} Jovem`, `${root} Ca\xE7ador`, `${root} Matilha`, `${root} Matilha`, `${root} Alfa`];
  return [`Fragmento ${root}`, `Arauto ${root}`, `Ecos de ${root}`, `Ecos de ${root}`, `Avatar ${root}`];
}
function getWaveKey(zoneId, baseEnemyId) {
  return `${zoneId}:${baseEnemyId}`;
}
function getWaveStage(progress, zoneId, baseEnemyId) {
  const raw = progress?.[getWaveKey(zoneId, baseEnemyId)];
  return Math.max(0, Math.min(HUNT_WAVE_COUNT - 1, Number.isFinite(raw) ? Number(raw) : 0));
}
function getWaveEncounter(_zone, baseEnemy, stage) {
  if (baseEnemy.isBoss) return baseEnemy;
  const safeStage = Math.max(0, Math.min(HUNT_WAVE_COUNT - 1, Math.floor(stage)));
  const stats = STAGE_STATS[safeStage];
  const names = SPECIAL_NAMES[baseEnemy.id] ?? generatedNames(baseEnemy);
  const suffix = safeStage === 0 ? "W1" : safeStage === 1 ? "W2" : safeStage === 2 ? "W3A" : safeStage === 3 ? "W3B" : "BOSS";
  const isFinal = safeStage === HUNT_WAVE_COUNT - 1;
  return {
    ...baseEnemy,
    id: `${baseEnemy.id}_${suffix}`,
    name: names[safeStage],
    hp: Math.max(1, Math.round(baseEnemy.hp * stats.hp)),
    atk: Math.max(1, Math.round(baseEnemy.atk * stats.atk)),
    arm: Math.max(0, Math.round(baseEnemy.arm * stats.arm)),
    xp: Math.max(1, Math.round(baseEnemy.xp * stats.xp)),
    goldMin: Math.max(1, Math.round(baseEnemy.goldMin * stats.gold)),
    goldMax: Math.max(1, Math.round(baseEnemy.goldMax * stats.gold)),
    isBoss: isFinal,
    isElite: false,
    waveRole: isFinal ? "BOSS" : "CAPANGA",
    waveStage: safeStage,
    waveBaseId: baseEnemy.id,
    sprite: `/assets/monsters/${baseEnemy.id}_${suffix}.png`,
    difficulty: baseEnemy.difficulty
  };
}

// src/engine/combat.ts
function buildProfile(char) {
  const bp = char.inventory.backpack;
  const p = { xpPct: (bp.xpBonus ?? 0) + (char.premium ? 0.1 : 0), goldPct: 0, dropPct: bp.dropBonus ?? 0, rarePct: bp.rareDropBonus ?? 0, healPct: 0, skillDmgPct: 0, cdReduce: 0, lifesteal: 0 };
  const dailyBossXpUntil = char.dailyBossXpUntil;
  if (dailyBossXpUntil !== void 0 && (dailyBossXpUntil === 0 || dailyBossXpUntil > Date.now())) p.xpPct += 0.05;
  const tomeUntil = char.mythreonBoosts?.TOMO_SABEDORIA;
  if (tomeUntil !== void 0 && (tomeUntil === 0 || tomeUntil > Date.now())) p.skillDmgPct += 0.2;
  for (const [vialId, expiry] of Object.entries(char.activeVials ?? {})) {
    if (expiry > Date.now()) p.xpPct += VIALS[vialId]?.xpPct ?? 0;
  }
  for (const [slot, item] of Object.entries(char.equipped)) {
    if (!item || slot === "BACKPACK") continue;
    p.xpPct += item.xpBonus ?? 0;
    p.goldPct += item.goldBonus ?? 0;
    p.dropPct += item.dropBonus ?? 0;
    p.rarePct += item.rareDropBonus ?? 0;
    p.lifesteal += item.lifesteal ?? 0;
  }
  const race = char.activeRace;
  const passive = race ? PASSIVE_EFFECTS[race.passivaId] : void 0;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : void 0;
  if (passive) {
    p.xpPct += passive.xpPct ?? 0;
    p.goldPct += passive.goldPct ?? 0;
    p.dropPct += passive.dropPct ?? 0;
    p.rarePct += passive.rareDropPct ?? 0;
    p.healPct += passive.healPct ?? 0;
    p.skillDmgPct += passive.skillDmgPct ?? 0;
    p.cdReduce += passive.cdReduce ?? 0;
  }
  if (support) p.lifesteal += support.lifesteal ?? 0;
  return p;
}
var EQUIP_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO"];
var emptyDamageBreakdown = () => ({ physical: 0, elemental: {}, lifestealHealing: 0 });
function resolveDeath(char, xpLost, goldLost) {
  const blessed = (char.blesses ?? 0) > 0;
  if (blessed) char.blesses = Math.max(0, (char.blesses ?? 0) - 1);
  const protectedByRing = Object.values(char.equipped).some((item) => item?.preventsDeathDrop);
  const lostItems = [];
  let lostBackpack;
  if (!blessed && !protectedByRing) {
    lostBackpack = char.inventory.backpack.name;
    lostItems.push(...char.inventory.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`));
    char.inventory.items = [];
    delete char.equipped.BACKPACK;
    char.inventory.backpack = { ...DEFAULT_BACKPACK };
    if (Math.random() < 0.1) {
      const equippedSet = Object.entries(char.equipped).filter(([slot, item]) => slot !== "BACKPACK" && !!item && !item?.preventsDeathDrop);
      if (equippedSet.length) {
        const [slot, item] = equippedSet[Math.floor(Math.random() * equippedSet.length)];
        if (item) {
          lostItems.push(`Equipado: ${item.name}`);
          delete char.equipped[slot];
        }
      }
    }
    recalcStats(char);
  }
  char.xp -= xpLost;
  char.gold -= goldLost;
  char.hp = 0;
  return { xpLost, goldLost, blessed, protectedByRing, lostBackpack, lostItems };
}
function processTick(char, zone, isOffline) {
  const result = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, zoneId: zone.id, killed: {}, bossKills: {}, dropCounts: {}, potionsUsed: 0, goldSpentPotions: 0, soldGold: 0, salvagedItems: 0, attacked: false, usedMp: false, cardsDropped: [], divineBeastsDropped: [], damageDealt: 0, damageTaken: 0, damageBreakdown: emptyDamageBreakdown(), damageTakenBreakdown: emptyDamageBreakdown(), combatDurationMs: 0, encounters: [], mythreonShards: 0 };
  const debug2 = isDebug();
  const offlineLimitSeconds = OFFLINE_MAX_HOURS * 3600 + Math.max(0, char.skills?.soul ?? 0) * 15 * 60;
  const requestedTicks = isOffline ? Math.min(Math.floor((Date.now() - char.lastTick) / TICK_MS), offlineLimitSeconds / (TICK_MS / 1e3)) : 1;
  const staminaPool = isOffline ? char.staminaOffline ?? 480 : char.staminaOnline ?? 120;
  const rawTicksAllowedByStamina = Math.floor(staminaPool * 6e4 / TICK_MS);
  const ticksAllowedByStamina = !isOffline && staminaPool > 0 && rawTicksAllowedByStamina === 0 ? 1 : rawTicksAllowedByStamina;
  const ticks = Math.max(0, Math.min(requestedTicks, ticksAllowedByStamina));
  if (ticks < requestedTicks) {
    result.staminaDepleted = true;
    result.log.push(isOffline ? "\u{1F319} Stamina offline esgotada; a simula\xE7\xE3o da ca\xE7a foi limitada." : "\u26A1 Stamina online esgotada; a ca\xE7a foi pausada.");
  }
  if (!ticks) {
    char.lastTick = Date.now();
    return result;
  }
  const savedTarget = zone.enemies.find((e) => e.id === char.activeEnemyId);
  const baseEnemy = savedTarget && char.level >= (savedTarget.minLevel ?? 1) ? savedTarget : zone.enemies.find((e) => char.level >= (e.minLevel ?? 1)) || zone.enemies[0];
  if (!baseEnemy) return result;
  const waveEnabled = !baseEnemy.isBoss;
  char.huntWaveProgress ??= {};
  const waveKey = getWaveKey(zone.id, baseEnemy.id);
  const waveStage = waveEnabled ? getWaveStage(char.huntWaveProgress, zone.id, baseEnemy.id) : 4;
  const waveEnemy = waveEnabled ? getWaveEncounter(zone, baseEnemy, waveStage) : baseEnemy;
  const sameTarget = char.fightEnemyId === `${zone.id}:${baseEnemy.id}` || char.fightEnemyId === `${zone.id}:${baseEnemy.id}:ELITE` || char.fightWaveKey === waveKey;
  const isEliteEncounter = !waveEnabled && (char.fightEnemyId === `${zone.id}:${baseEnemy.id}:ELITE` || !sameTarget && Math.random() < 0.03);
  const fightId = `${zone.id}:${baseEnemy.id}${isEliteEncounter ? ":ELITE" : ""}${waveEnabled ? `:W${waveStage}` : ""}`;
  if (char.fightEnemyId !== fightId) {
    char.fightEnemyId = fightId;
    char.fightWaveKey = waveEnabled ? waveKey : void 0;
    char.fightWaveStage = waveEnabled ? waveStage : void 0;
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
    char.fightDamageBreakdown = emptyDamageBreakdown();
    char.fightDamageTakenBreakdown = emptyDamageBreakdown();
  }
  let encounterDamageDealt = char.fightDamageDealt ?? 0;
  let encounterDamageTaken = char.fightDamageTaken ?? 0;
  let encounterPotionGoldSpent = char.fightPotionGoldSpent ?? 0;
  let encounterDamageBreakdown = structuredClone(char.fightDamageBreakdown ?? emptyDamageBreakdown());
  let encounterDamageTakenBreakdown = structuredClone(char.fightDamageTakenBreakdown ?? emptyDamageBreakdown());
  let simulatedTicks = 0;
  const recordDeathEncounter = () => {
    if (encounterDamageDealt <= 0 && encounterDamageTaken <= 0) return;
    result.encounters.push({
      id: `${Date.now()}-${result.encounters.length}-${baseEnemy.id}`,
      timestamp: Date.now(),
      zoneId: zone.id,
      enemyId: char.fightWaveKey ? `${baseEnemy.id}_W${char.fightWaveStage ?? 0}` : isEliteEncounter ? `${baseEnemy.id}_ELITE` : baseEnemy.id,
      enemyName: char.fightWaveKey ? `${baseEnemy.name} \xB7 onda ${(char.fightWaveStage ?? 0) + 1}` : isEliteEncounter ? `${baseEnemy.name} Elite` : baseEnemy.name,
      damageDealt: encounterDamageDealt,
      damageTaken: encounterDamageTaken,
      xp: 0,
      gold: 0,
      soldGold: 0,
      goldSpentPotions: encounterPotionGoldSpent,
      lootValue: 0,
      loot: [],
      outcome: "death",
      damageBreakdown: structuredClone(encounterDamageBreakdown),
      damageTakenBreakdown: structuredClone(encounterDamageTakenBreakdown)
    });
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
    char.fightDamageBreakdown = emptyDamageBreakdown();
    char.fightDamageTakenBreakdown = emptyDamageBreakdown();
    encounterPotionGoldSpent = 0;
    encounterDamageBreakdown = emptyDamageBreakdown();
    encounterDamageTakenBreakdown = emptyDamageBreakdown();
  };
  const diff = baseEnemy.difficulty || 1;
  const rewardScale = 1 + (diff - 1) * 0.2;
  const eliteMultiplier = isEliteEncounter ? 1.35 : 1;
  const enemy = { ...waveEnemy, id: isEliteEncounter ? `${baseEnemy.id}_ELITE` : waveEnemy.id, name: isEliteEncounter ? `${baseEnemy.name} Elite` : waveEnemy.name, isElite: isEliteEncounter, hp: waveEnemy.hp * diff * eliteMultiplier, atk: waveEnemy.atk * diff * eliteMultiplier, arm: waveEnemy.arm * diff * eliteMultiplier, xp: Math.round(waveEnemy.xp * rewardScale * (isEliteEncounter ? 1.8 : 1)), goldMin: Math.round(waveEnemy.goldMin * rewardScale * (isEliteEncounter ? 1.8 : 1)), goldMax: Math.round(waveEnemy.goldMax * rewardScale * (isEliteEncounter ? 1.8 : 1)) };
  if (isEliteEncounter && char.enemyHpId !== enemy.id) result.log.push(`\u2728 Encontro especial: ${enemy.name}! Recompensas e drops aprimorados.`);
  if (char.enemyHpId !== enemy.id || char.enemyHp === void 0 || char.enemyHp <= 0) {
    char.enemyHp = enemy.hp;
    char.enemyHpId = enemy.id;
  }
  let enemyHp = Math.min(char.enemyHp, enemy.hp);
  let playerHp = char.hp;
  let playerMp = char.mp;
  let tickCount = char.tickCount ?? 0;
  const prof = buildProfile(char);
  const race = char.activeRace;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : void 0;
  const skill = race ? ATTACK_SKILLS[race.ataqueId] : void 0;
  const skillCd = Math.max(4, Math.ceil(ATTACK_SKILL_COOLDOWN - prof.cdReduce));
  const earlyDamageScale = char.level <= 15 ? 0.82 : char.level <= 25 ? 0.9 : 1;
  const hpPotId = char.autoHpPotionEnabled ? char.autoHpPotionId || null : null;
  const hpPotPct = char.autoHpPotionPercent || 50;
  const mpPotId = char.autoMpPotionEnabled ? char.autoMpPotionId || null : null;
  const mpPotPct = char.autoMpPotionPercent || 50;
  const warnInsufficientPotionGold = (cost) => {
    if (Date.now() < (char.potionGoldWarningUntil ?? 0)) return;
    char.potionGoldWarningUntil = Date.now() + 3e4;
    result.log.push(`\u{1FA99} Gold insuficiente para usar a po\xE7\xE3o (custo: ${cost.toLocaleString("pt-BR")}g).`);
  };
  let bagFullWarned = false;
  const hasDoubleAtkBuff = char.doubleAtkUntil && char.doubleAtkUntil > Date.now();
  const buffMultiplier = hasDoubleAtkBuff ? 2 : 1;
  const heal = (amount) => {
    const before = playerHp;
    playerHp = Math.min(char.hpMax, playerHp + Math.round(amount * (1 + prof.healPct)));
    return playerHp - before;
  };
  for (let i = 0; i < ticks; i++) {
    tickCount++;
    simulatedTicks++;
    const t = tickCount;
    const s = char.baseStats;
    const hpMax = char.hpMax;
    const mpMax = char.mpMax;
    result.attacked = false;
    result.lastDamage = 0;
    result.lastCrit = false;
    result.lastMiss = false;
    result.usedMp = false;
    if (playerHp > 0) playerHp = Math.min(hpMax, playerHp + Math.max(0, s.hpRegen ?? 0));
    playerMp = Math.min(mpMax, playerMp + Math.max(0, s.mpRegen ?? 0));
    if (playerHp <= 0) {
      recordDeathEncounter();
      result.death = true;
      const skillPenalty = applyTrainingDeathPenalty(char);
      if (skillPenalty) result.log.push(skillPenalty);
      const blessed = (char.blesses ?? 0) > 0;
      const xpLossPct = blessed ? 0.05 : 0.15;
      const xpLost = Math.floor(char.xp * xpLossPct);
      const goldLost = Math.floor(char.gold * 0.1);
      result.deathData = resolveDeath(char, xpLost, goldLost);
      result.log.push(`\u2620\uFE0F Voc\xEA morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
      break;
    }
    if (hpPotId && playerHp / hpMax * 100 <= hpPotPct) {
      const potion = POTION_TEMPLATES[hpPotId];
      const cost = getPotionUsePrice(hpPotId);
      if (potion && char.gold >= cost) {
        char.gold -= cost;
        result.goldSpentPotions += cost;
        encounterPotionGoldSpent += cost;
        char.fightPotionGoldSpent = encounterPotionGoldSpent;
        heal(potion.stats.hp ?? 0);
        result.potionsUsed++;
        result.log.push(`\u{1F9EA} ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`);
      } else if (potion) warnInsufficientPotionGold(cost);
    }
    if (mpPotId && playerMp / mpMax * 100 <= mpPotPct) {
      const potion = POTION_TEMPLATES[mpPotId];
      const cost = getPotionUsePrice(mpPotId);
      if (potion && char.gold >= cost) {
        char.gold -= cost;
        result.goldSpentPotions += cost;
        encounterPotionGoldSpent += cost;
        char.fightPotionGoldSpent = encounterPotionGoldSpent;
        playerMp = Math.min(mpMax, playerMp + (potion.stats.mp ?? 0));
        result.potionsUsed++;
        result.log.push(`\u{1F52E} ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`);
      } else if (potion) warnInsufficientPotionGold(cost);
    }
    const triggered = !!support && t % support.cd === 0;
    const buffOn = !!support?.dur && t % support.cd < support.dur;
    if (triggered && support?.healPct) {
      heal(hpMax * support.healPct);
      result.log.push(`\u{1F49A} Suporte curou voc\xEA.`);
    }
    const atkMult = 1 + (buffOn ? support?.atkPct ?? 0 : 0);
    const armMult = 1 + (buffOn ? support?.armPct ?? 0 : 0);
    const ignoreArmor = buffOn ? support?.ignoreArmor ?? 0 : 0;
    const comboReady = (char.comboReadyUntil ?? 0) > Date.now() && (char.comboCooldownUntil ?? 0) <= Date.now();
    const strike = (multiplier = 1, guaranteed = false) => {
      result.attacked = true;
      if (debug2) {
        result.lastDamage = 99999;
        return 99999;
      }
      if (!guaranteed && Math.random() > (s.hit ?? 1)) {
        result.lastMiss = true;
        return 0;
      }
      const magicWeapon = ["CAJADO", "VARINHA"].some((key) => char.equipped.ARMA_PRINCIPAL?.templateId.includes(key));
      const base = (magicWeapon ? s.matk ?? 0 : s.atk ?? 0) * atkMult * multiplier * earlyDamageScale;
      let dmg = mitigatedDamage(base, enemy.arm * (1 - ignoreArmor));
      if (Math.random() < (s.crit ?? 0)) {
        dmg *= 1 + clamp(s.critDmg ?? 0.5, 0, 1.5);
        result.lastCrit = true;
      }
      if (support?.executeBonus && enemyHp < enemy.hp * 0.4) dmg *= 1 + support.executeBonus;
      dmg = Math.max(1, Math.round(dmg));
      result.lastDamage = (result.lastDamage ?? 0) + dmg;
      return dmg;
    };
    let dealt = comboReady ? 0 : strike();
    if (comboReady) {
      const power = char.comboPower ?? 1.5;
      const primaryFactor = power === 1.5 ? 1 : power === 1 ? 0.75 : 0.35;
      const secondaryFactor = power === 1.5 ? 0.5 : power === 1 ? 0.25 : 0.15;
      const primaryDamage = strike(primaryFactor, true);
      const secondaryDamage = strike(secondaryFactor, true);
      dealt = primaryDamage + secondaryDamage;
      result.comboHitDamage = [Math.max(0, Math.round(primaryDamage)), Math.max(0, Math.round(secondaryDamage))];
      result.comboRank = power === 1.5 ? "ouro" : power === 1 ? "prata" : "bronze";
      char.comboReadyUntil = void 0;
      char.comboCooldownUntil = Date.now() + 15e3;
      char.comboPower = void 0;
      const quality = power === 1.5 ? "perfeito" : power === 1 ? "preciso" : "atrasado";
      result.log.push(`\u26A1 Combo Especial ${quality}! ${dealt} de dano.`);
    }
    let elementalThisTick = 0;
    if (hasDoubleAtkBuff) {
      dealt += strike();
      result.log.push(`\u26A1 Ataque Duplo!`);
    }
    if (triggered && support?.doubleStrike) dealt += strike();
    if (Math.random() < (s.spd ?? 0)) dealt += strike();
    if (skill && t % skillCd === 0 && !debug2) {
      const manaCost = skill.manaCost + Math.floor(char.level * 0.5);
      if (playerMp >= manaCost) {
        playerMp -= manaCost;
        result.usedMp = true;
        const raw = ((s.matk ?? 0) + (s.atk ?? 0) * 0.5) * skill.mult * (1 + prof.skillDmgPct) * earlyDamageScale;
        const armor = enemy.arm * (1 - skill.pierce) * (1 - ignoreArmor);
        const baseSkillDamage = Math.round(mitigatedDamage(raw, armor));
        const skillElement = attackElement(race?.ataqueId);
        const skillResistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[skillElement] ?? 0));
        const sd = Math.round(baseSkillDamage * elementMultiplier(skillElement, enemy.element) * (1 - skillResistance));
        dealt += sd;
        result.lastDamage = (result.lastDamage ?? 0) + sd;
        if (skillElement !== "BASE") {
          elementalThisTick += sd;
          result.damageBreakdown.elemental[skillElement] = (result.damageBreakdown.elemental[skillElement] ?? 0) + sd;
          encounterDamageBreakdown.elemental[skillElement] = (encounterDamageBreakdown.elemental[skillElement] ?? 0) + sd;
        }
        if (skill.lifesteal) {
          const recovered = heal(sd * skill.lifesteal);
          result.damageBreakdown.lifestealHealing += recovered;
          encounterDamageBreakdown.lifestealHealing += recovered;
        }
        result.log.push(`\u2728 ${skill.desc.split(":")[0]} causou ${sd} de dano ${skillElement === "BASE" ? "m\xE1gico" : skillElement.toLowerCase()}!`);
      } else {
        result.log.push(`\u26A0\uFE0F Mana insuficiente!`);
      }
    }
    const weapon = char.equipped.ARMA_PRINCIPAL;
    const arrow = char.equipped.MUNICAO;
    const usingBow = weapon?.templateId.includes("ARCO") ?? false;
    const weaponEnchant = weapon?.enchantment;
    const arrowEnchant = usingBow ? arrow?.enchantment : void 0;
    const weaponElement = weaponEnchant?.element ?? weapon?.element ?? arrowEnchant?.element;
    const weaponElementPct = (weapon?.elementalDamagePct ?? 0) + (weaponEnchant?.weaponDamagePct ?? 0) + (arrowEnchant?.weaponDamagePct ?? 0);
    if (weaponElement && weaponElementPct > 0 && dealt > 0) {
      const rawElementDamage = Math.round(dealt * weaponElementPct);
      const resistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[weaponElement] ?? 0));
      const elementalDamage = Math.max(0, Math.round(rawElementDamage * elementMultiplier(weaponElement, enemy.element) * (1 - resistance)));
      dealt += elementalDamage;
      elementalThisTick += elementalDamage;
      result.lastDamage = (result.lastDamage ?? 0) + elementalDamage;
      result.damageBreakdown.elemental[weaponElement] = (result.damageBreakdown.elemental[weaponElement] ?? 0) + elementalDamage;
      encounterDamageBreakdown.elemental[weaponElement] = (encounterDamageBreakdown.elemental[weaponElement] ?? 0) + elementalDamage;
      if (weaponEnchant || arrowEnchant) result.log.push(`\u{1F525} Aspecto ${weaponEnchant?.statusEffect ?? arrowEnchant?.statusEffect} adicionou ${elementalDamage} de dano elemental.`);
    }
    const bond = getBeastCombat(char);
    if (bond && t % bond.cooldown === 0 && playerMp >= bond.mana && !debug2) {
      playerMp -= bond.mana;
      result.usedMp = true;
      const raw = ((s.atk ?? 0) + (s.matk ?? 0)) * 0.5 * bond.multiplier * earlyDamageScale;
      const resistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[bond.element] ?? 0));
      const damage = Math.max(1, Math.round(mitigatedDamage(raw, enemy.arm * 0.5) * elementMultiplier(bond.element, enemy.element) * (1 - resistance)));
      dealt += damage;
      elementalThisTick += damage;
      result.lastDamage = (result.lastDamage ?? 0) + damage;
      result.beastDamage = damage;
      result.beastElement = bond.element;
      result.beastName = bond.beast.name;
      result.damageBreakdown.elemental[bond.element] = (result.damageBreakdown.elemental[bond.element] ?? 0) + damage;
      encounterDamageBreakdown.elemental[bond.element] = (encounterDamageBreakdown.elemental[bond.element] ?? 0) + damage;
      result.log.push(bond.beast.name + " usa " + bond.name + ": " + damage + " de dano " + bond.element.toLowerCase() + ".");
    }
    const physicalThisTick = Math.max(0, dealt - elementalThisTick);
    result.damageBreakdown.physical += physicalThisTick;
    encounterDamageBreakdown.physical += physicalThisTick;
    char.fightDamageBreakdown = structuredClone(encounterDamageBreakdown);
    if (debug2) result.log.push(`[TESTE] Voc\xEA obliterou o ${enemy.name} (${diff}\u2B50).`);
    else if (dealt > 0) result.log.push(`Voc\xEA causou ${dealt} de dano f\xEDsico no ${enemy.name}.${result.lastCrit ? " \u{1F4A5} CR\xCDTICO!" : ""}`);
    result.damageDealt += dealt;
    encounterDamageDealt += dealt;
    char.fightDamageDealt = encounterDamageDealt;
    enemyHp -= dealt;
    if (prof.lifesteal > 0 && !debug2) {
      const recovered = heal(dealt * prof.lifesteal);
      result.damageBreakdown.lifestealHealing += recovered;
      encounterDamageBreakdown.lifestealHealing += recovered;
      char.fightDamageBreakdown = structuredClone(encounterDamageBreakdown);
    }
    if (enemyHp <= 0) {
      result.kills++;
      char.killsInZone++;
      char.totalKills = (char.totalKills ?? 0) + 1;
      char.bestiaryKills ??= {};
      const bestiaryId = enemy.waveBaseId ?? baseEnemy.id;
      char.bestiaryKills[bestiaryId] = (char.bestiaryKills[bestiaryId] ?? 0) + 1;
      result.killed[bestiaryId] = (result.killed[bestiaryId] ?? 0) + 1;
      if (enemy.isBoss) result.bossKills[bestiaryId] = (result.bossKills[bestiaryId] ?? 0) + 1;
      const goldDifficulty = enemy.isBoss ? 1 : 0.78;
      const g = Math.floor((enemy.goldMin + Math.floor(Math.random() * (enemy.goldMax - enemy.goldMin + 1))) * goldDifficulty * (1 + prof.goldPct));
      const xpGained = Math.floor(enemy.xp * (1 + prof.xpPct)) * (debug2 ? 10 : 1);
      result.gold += g;
      char.gold += g;
      result.xp += xpGained;
      char.xp += xpGained;
      if (!debug2 && Math.random() < shardChance(enemy)) {
        const shards = enemy.isBoss || enemy.difficulty >= 4 ? 2 : 1;
        char.mythreonShards = (char.mythreonShards ?? 0) + shards;
        result.mythreonShards = (result.mythreonShards ?? 0) + shards;
        result.log.push(`\u{1F537} Voc\xEA encontrou ${shards} Mythreon Shard${shards > 1 ? "s" : ""}.`);
      }
      const loot = [];
      const soldGoldBefore = result.soldGold ?? 0;
      heal(hpMax * BALANCE.killRecovery);
      const cardDrop = enemy.waveRole === "CAPANGA" ? null : rollCardDrop(enemy.waveBaseId ?? enemy.id, zone.tier, enemy.isBoss);
      if (cardDrop) {
        if (!char.cards) char.cards = [];
        char.cards.push(cardDrop);
        result.cardsDropped.push(cardDrop);
        const template = CARD_TEMPLATES[cardDrop.templateId];
        result.log.push(`\u{1F0CF} CARTA DROPADA: ${template?.emoji} ${template?.name}!`);
        if (template) loot.push({ name: template.name, icon: template.emoji, quantity: 1, sellValue: 0, kind: "card" });
      }
      let bondedBeastName = null;
      const availableBeasts = enemy.isBoss ? Object.values(DIVINE_BEASTS).filter((candidate) => candidate.bossId === enemy.id && !(char.divineBeasts ?? []).some((owned) => owned.id === candidate.id)) : [];
      if (availableBeasts.length > 0 && Math.random() < availableBeasts[0].dropChance) {
        const beast = availableBeasts[Math.floor(Math.random() * availableBeasts.length)];
        if (!char.divineBeasts) char.divineBeasts = [];
        char.divineBeasts.push({ id: beast.id, instanceId: `drop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, obtainedAt: Date.now() });
        result.divineBeastsDropped.push(beast.id);
        bondedBeastName = beast.name;
      }
      const drops = enemy.waveRole === "CAPANGA" ? debug2 || Math.random() < 0.01 ? [makeComponent(baseEnemy.componentId)] : [] : rollDrops(enemy, zone, char, { dropBonus: prof.dropPct, rareBonus: prof.rarePct + (char.baseStats.luck ?? 0), force: debug2 });
      const runeChance = enemy.isBoss ? 0.28 : enemy.isElite ? 0.06 : 6e-3 + zone.tier * 1e-3;
      if (debug2 || Math.random() < runeChance) {
        const rune = ENCHANTMENT_RUNE_TEMPLATE(zone.id);
        rune.uid = `${Date.now()}-rune-${zone.id}-${Math.random().toString(36).slice(2, 7)}`;
        drops.push(rune);
        result.log.push(`\u{1F52E} Runa Encantada de ${zone.name} encontrada.`);
      }
      if ((debug2 || enemy.isBoss || enemy.isElite) && (debug2 || Math.random() < (enemy.isElite ? 0.12 : 0.08))) {
        const egg = DIVINE_BEAST_EGG_TEMPLATES[`OVO_BESTA_T${Math.max(1, Math.min(5, zone.tier))}`];
        if (egg) drops.push({ ...egg, uid: `${Date.now()}-egg-${enemy.id}`, quantity: 1 });
      }
      if ((debug2 || (enemy.isBoss || enemy.isElite) && enemy.difficulty >= 4) && (debug2 || Math.random() < (enemy.isElite ? 0.1 : 0.05))) {
        const ration = BEAST_TAMER_TEMPLATES.RACAO_DOMADOR;
        drops.push({ ...ration, uid: `${Date.now()}-ration-${enemy.id}`, quantity: 1 });
      }
      if (debug2 || char.killsInZone % 10 === 0 || enemy.isBoss) drops.push(rollAmbient(zone));
      const autoSell = char.premium ? char.autoSell ?? null : null;
      const autoSalvage = char.autoSalvage ?? null;
      const sellByTemplate = new Set(char.premium ? char.autoSellTemplateIds ?? [] : []);
      const salvageByTemplate = new Set(char.autoSalvageTemplateIds ?? []);
      const ignoredLoot = new Set(char.ignoredLootTemplateIds ?? []);
      for (const d of drops) {
        loot.push({ name: d.name, icon: d.icon, quantity: d.quantity, sellValue: sellValue(d), kind: "item" });
        if (ignoredLoot.has(d.templateId) && (char.bestiaryKills?.[enemy.waveBaseId ?? enemy.id] ?? 0) >= 1e3) {
          result.log.push(`\u{1F9FA} Autoloot ignorou ${d.name}.`);
          continue;
        }
        const isEquip = EQUIP_CATEGORIES.includes(d.category);
        if (isEquip && d.rarity !== "LENDARIO" && (autoSell && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSell) || sellByTemplate.has(d.templateId))) {
          const v = sellValue(d);
          char.gold += v;
          result.gold += v;
          result.soldGold += v;
          continue;
        }
        if (isEquip && d.rarity !== "LENDARIO" && (autoSalvage && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSalvage) || salvageByTemplate.has(d.templateId))) {
          salvageItem(char, d);
          result.salvagedItems++;
          continue;
        }
        if (addItem(char.inventory, d)) {
          result.drops.push(d);
          result.dropCounts[d.templateId] = (result.dropCounts[d.templateId] ?? 0) + d.quantity;
        } else if (!bagFullWarned) {
          bagFullWarned = true;
          result.log.push("\u{1F392} Bolsa cheia!");
        }
      }
      const encounter = {
        id: `${Date.now()}-${result.encounters.length}-${enemy.id}`,
        timestamp: Date.now(),
        zoneId: zone.id,
        enemyId: enemy.id,
        enemyName: enemy.name,
        damageDealt: encounterDamageDealt,
        damageTaken: encounterDamageTaken,
        xp: xpGained,
        gold: g,
        goldSpentPotions: encounterPotionGoldSpent,
        soldGold: (result.soldGold ?? 0) - soldGoldBefore,
        lootValue: loot.reduce((total, item) => total + item.sellValue * item.quantity, 0),
        loot,
        outcome: "victory",
        damageBreakdown: structuredClone(encounterDamageBreakdown),
        damageTakenBreakdown: structuredClone(encounterDamageTakenBreakdown)
      };
      result.encounters.push(encounter);
      encounterDamageDealt = 0;
      encounterDamageTaken = 0;
      char.fightPotionGoldSpent = 0;
      encounterPotionGoldSpent = 0;
      char.fightDamageDealt = 0;
      char.fightDamageTaken = 0;
      encounterDamageBreakdown = emptyDamageBreakdown();
      encounterDamageTakenBreakdown = emptyDamageBreakdown();
      char.fightDamageBreakdown = emptyDamageBreakdown();
      char.fightDamageTakenBreakdown = emptyDamageBreakdown();
      while (char.xp >= char.xpToNext) {
        char.xp -= char.xpToNext;
        char.level++;
        char.xpToNext = xpToNextLevel(char.level);
        result.levelsGained++;
        char.statPoints = (char.statPoints ?? 0) + 1;
        result.log.push("\u{1F31F} Voc\xEA recebeu 1 ponto de status!");
        char.hp = playerHp;
        recalcStats(char);
        playerHp = char.hpMax;
        char.mp = char.mpMax;
        result.log.push(`\u2728 Subiu para n\xEDvel ${char.level}!`);
      }
      result.log.push(`Voc\xEA derrotou o ${enemy.name} (${diff}\u2B50)! (+${g} ouro, +${xpGained} XP)`);
      if (bondedBeastName) result.log.push(`\u{1F43E} Resson\xE2ncia Divina! ${bondedBeastName} criou um v\xEDnculo com voc\xEA.`);
      if (waveEnabled) {
        const nextStage = waveStage >= 4 ? 0 : waveStage + 1;
        char.huntWaveProgress[waveKey] = nextStage;
        char.fightWaveKey = waveKey;
        char.fightWaveStage = nextStage;
        char.fightEnemyId = void 0;
        enemyHp = 0;
        result.log.push(nextStage === 0 ? `\u{1F3C6} Sequ\xEAncia conclu\xEDda! O pr\xF3ximo ciclo come\xE7a no capanga f\xE1cil.` : `\u{1F30A} Pr\xF3ximo encontro: onda ${nextStage >= 4 ? "4/4 \xB7 chefe" : nextStage >= 2 ? "3/4 \xB7 dupla" : `${nextStage + 1}/4`}.`);
        break;
      } else {
        enemyHp = enemy.hp;
        char.fightEnemyId = void 0;
      }
    } else {
      const e = support;
      const dodgedBySkill = !!e?.dodgeEvery && t % e.dodgeEvery === 0;
      if (dodgedBySkill || Math.random() < (s.dge ?? 0)) {
        result.log.push(`Voc\xEA esquivou do ataque de ${enemy.name}.`);
      } else {
        const armor = (s.arm ?? 0) * armMult;
        const reduction = armor + (s.def ?? 0) * 0.5;
        const raw = mitigatedDamage(enemy.atk, reduction);
        const res = enemy.damageType === "MAGICO" ? s.resMagico ?? 0 : s.resFisico ?? 0;
        let mult = (1 - clamp(res, 0, BALANCE.resistanceCap)) * (1 - (buffOn ? e?.dmgReduction ?? 0 : 0) - (e?.permDmgReduction ?? 0));
        if (Math.random() < (s.blk ?? 0)) mult *= 0.5;
        const physicalRaw = enemy.element ? Math.round(raw * 0.65) : raw;
        const elementalRaw = enemy.element ? raw - physicalRaw : 0;
        const ePhysical = debug2 ? 0 : Math.max(1, Math.round(physicalRaw * clamp(mult, 0.1, 1)));
        const elementalResistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.element ? char.elementalResistances?.[enemy.element] ?? 0 : 0));
        const eElemental = debug2 || !enemy.element ? 0 : Math.max(0, Math.round(elementalRaw * clamp(mult, 0.1, 1) * (1 - elementalResistance)));
        const eDmg = ePhysical + eElemental;
        playerHp -= eDmg;
        result.damageTaken += eDmg;
        encounterDamageTaken += eDmg;
        char.fightDamageTaken = encounterDamageTaken;
        result.damageTakenBreakdown.physical += ePhysical;
        encounterDamageTakenBreakdown.physical += ePhysical;
        if (enemy.element && eElemental > 0) {
          result.damageTakenBreakdown.elemental[enemy.element] = (result.damageTakenBreakdown.elemental[enemy.element] ?? 0) + eElemental;
          encounterDamageTakenBreakdown.elemental[enemy.element] = (encounterDamageTakenBreakdown.elemental[enemy.element] ?? 0) + eElemental;
        }
        char.fightDamageTakenBreakdown = structuredClone(encounterDamageTakenBreakdown);
        if (eDmg > 0) result.log.push(`${enemy.name} causou ${eDmg} de dano em voc\xEA.`);
      }
      if (playerHp <= 0) {
        recordDeathEncounter();
        result.death = true;
        const blessed = (char.blesses ?? 0) > 0;
        const xpLossPct = blessed ? 0.05 : 0.15;
        const xpLost = Math.floor(char.xp * xpLossPct);
        const goldLost = Math.floor(char.gold * 0.1);
        result.deathData = resolveDeath(char, xpLost, goldLost);
        result.log.push(`\u2620\uFE0F Voc\xEA morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
        break;
      }
    }
  }
  char.tickCount = tickCount;
  const staminaMinutesSpent = simulatedTicks * TICK_MS / 6e4;
  if (isOffline) {
    char.staminaOffline = Math.max(0, (char.staminaOffline ?? 480) - staminaMinutesSpent);
    char.staminaOnline = Math.min(120, (char.staminaOnline ?? 120) + staminaMinutesSpent * 0.2);
  } else {
    char.staminaOnline = Math.max(0, (char.staminaOnline ?? 120) - staminaMinutesSpent);
    char.staminaOffline = Math.min(480, (char.staminaOffline ?? 480) + staminaMinutesSpent * 0.2);
  }
  char.staminaUpdatedAt = Date.now();
  char.hp = Math.max(0, Math.min(char.hpMax, playerHp));
  char.mp = Math.max(0, Math.min(char.mpMax, playerMp));
  char.enemyHp = enemyHp;
  char.enemyHpId = enemy.id;
  char.lastTick = Date.now();
  result.log = result.log.slice(-10);
  result.combatDurationMs = simulatedTicks * TICK_MS;
  result.enemyHp = Math.max(0, Math.round(enemyHp));
  result.enemyMaxHp = enemy.hp;
  return result;
}

// src/data/races.ts
var NAMED_RACES = [
  { id: "R01", name: "Portador da Primeira Luz", tier: "NOMEADA", ataqueId: "A3", suporteId: "S3", passivaId: "P5", skills: { ataque: "Raio Nascente", suporte: "Renova\xE7\xE3o", passiva: "Alvorecer" }, bonus: { hp: 100, mp: 50, atk: 10 } },
  { id: "R02", name: "Caminhante do Sil\xEAncio", tier: "NOMEADA", ataqueId: "A8", suporteId: "S4", passivaId: "P6", skills: { ataque: "Golpe Crepuscular", suporte: "V\xE9u de Descanso", passiva: "Serenidade" }, bonus: { hp: 120, dge: 0.08 } },
  { id: "R03", name: "Metamorfo", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P7", skills: { ataque: "Erup\xE7\xE3o Muda", suporte: "Adapta\xE7\xE3o", passiva: "Evolu\xE7\xE3o Constante" }, bonus: { atk: 15, matk: 20, hp: 80 } },
  { id: "R04", name: "Arquivista Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P10", skills: { ataque: "Eco do Passado", suporte: "Leitura de Mem\xF3ria", passiva: "Codex Vivo" }, bonus: { mp: 150, atk: 10, matk: 15 } },
  { id: "R05", name: "Moldador de Baluartes", tier: "NOMEADA", ataqueId: "A4", suporteId: "S7", passivaId: "P2", skills: { ataque: "Impacto S\xEDsmico", suporte: "Muralha de Pedra", passiva: "Pele de Granito" }, bonus: { arm: 50, def: 20, hp: 250 } },
  { id: "R06", name: "Tecel\xE3o da Vida", tier: "NOMEADA", ataqueId: "A7", suporteId: "S1", passivaId: "P1", skills: { ataque: "Chicote de Seiva", suporte: "V\xEDnculo Emp\xE1tico", passiva: "Mem\xF3ria da Floresta" }, bonus: { hp: 350, def: 15 } },
  { id: "R07", name: "Andarilho do Vento", tier: "NOMEADA", ataqueId: "A10", suporteId: "S8", passivaId: "P4", skills: { ataque: "L\xE2mina de Vendaval", suporte: "Passo Et\xE9reo", passiva: "Vento nas Costas" }, bonus: { spd: 0.12, dge: 0.06 } },
  { id: "R08", name: "Arquiteto da Ordem", tier: "NOMEADA", ataqueId: "A9", suporteId: "S10", passivaId: "P3", skills: { ataque: "Pilar de Cristal", suporte: "Estrutura Coesa", passiva: "Padr\xE3o Perfeito" }, bonus: { def: 20, arm: 30, resMagico: 0.05 } },
  { id: "R09", name: "Herege da D\xFAvida", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P9", skills: { ataque: "Golpe Imprevis\xEDvel", suporte: "Disson\xE2ncia", passiva: "Ceticismo" }, bonus: { crit: 0.1, hit: 0.06 } },
  { id: "R10", name: "S\xE1bio da Compreens\xE3o", tier: "NOMEADA", ataqueId: "A15", suporteId: "S10", passivaId: "P11", skills: { ataque: "Cadeia L\xF3gica", suporte: "Insight T\xE1tico", passiva: "Erudi\xE7\xE3o" }, bonus: { matk: 30, crit: 0.06, hit: 0.06 } },
  { id: "R11", name: "Vinculador de Almas", tier: "NOMEADA", ataqueId: "A13", suporteId: "S2", passivaId: "P5", skills: { ataque: "La\xE7o Compartilhado", suporte: "Juramento", passiva: "Lealdade" }, bonus: { hp: 250, atk: 15, arm: 20 } },
  { id: "R12", name: "Explorador do Horizonte", tier: "NOMEADA", ataqueId: "A6", suporteId: "S8", passivaId: "P4", skills: { ataque: "Investida Distante", suporte: "Rota Alternativa", passiva: "Mapa Mental" }, bonus: { spd: 0.1, hit: 0.06, dge: 0.06 } },
  { id: "R13", name: "Alquimista da Uni\xE3o", tier: "NOMEADA", ataqueId: "A11", suporteId: "S12", passivaId: "P12", skills: { ataque: "Rea\xE7\xE3o em Cadeia", suporte: "S\xEDntese R\xE1pida", passiva: "F\xF3rmula Secreta" }, bonus: { matk: 25, atk: 15, crit: 0.06 } },
  { id: "R14", name: "Guardi\xE3o dos Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S5", passivaId: "P8", skills: { ataque: "D\xEDvida Temporal", suporte: "Adiantar", passiva: "Ritmo" }, bonus: { hp: 200, mp: 120, spd: 0.06 } },
  { id: "R15", name: "Ferreiro de Mundos", tier: "NOMEADA", ataqueId: "A9", suporteId: "S11", passivaId: "P12", skills: { ataque: "Martelo Primordial", suporte: "Forja R\xE1pida", passiva: "Mestre Artes\xE3o" }, bonus: { atk: 35, arm: 35, hp: 200 } },
  { id: "R16", name: "Construtor Inst\xE1vel", tier: "NOMEADA", ataqueId: "A1", suporteId: "S9", passivaId: "P7", skills: { ataque: "Detona\xE7\xE3o Programada", suporte: "Reconfigurar", passiva: "Caos Controlado" }, bonus: { atk: 25, matk: 20, crit: 0.06 } },
  { id: "R17", name: "Sombra da D\xFAvida", tier: "NOMEADA", ataqueId: "A13", suporteId: "S4", passivaId: "P6", skills: { ataque: "Facada nas Costas", suporte: "Desaparecer", passiva: "N\xE9voa Pessoal" }, bonus: { dge: 0.12, crit: 0.1, atk: 20 } },
  { id: "R18", name: "Desertor", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P8", skills: { ataque: "Golpe de Fuga", suporte: "Rota de Fuga", passiva: "Instinto" }, bonus: { spd: 0.18, dge: 0.06 } },
  { id: "R19", name: "Bibliotec\xE1rio Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P9", skills: { ataque: "Palavra de Poder", suporte: "Reescrever", passiva: "Arquivo Vivo" }, bonus: { mp: 180, matk: 25, crit: 0.06 } },
  { id: "R20", name: "Vidente dos Ciclos", tier: "NOMEADA", ataqueId: "A10", suporteId: "S5", passivaId: "P8", skills: { ataque: "Premoni\xE7\xE3o", suporte: "Prever", passiva: "Clarivid\xEAncia" }, bonus: { spd: 0.12, crit: 0.1, hit: 0.12 } },
  { id: "R21", name: "M\xE3e da Floresta", tier: "NOMEADA", ataqueId: "A7", suporteId: "S2", passivaId: "P1", skills: { ataque: "Ra\xEDzes Estranguladoras", suporte: "Regenera\xE7\xE3o Coletiva", passiva: "Ber\xE7o Vivo" }, bonus: { hp: 500, def: 20, matk: 15 } },
  { id: "R22", name: "Portador do V\xEDnculo", tier: "NOMEADA", ataqueId: "A3", suporteId: "S11", passivaId: "P5", skills: { ataque: "Chama Compartilhada", suporte: "Renascimento", passiva: "Chama da Amizade" }, bonus: { hp: 250, atk: 25, matk: 20 } },
  { id: "R23", name: "Vendaval", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P4", skills: { ataque: "Tempestade de L\xE2minas", suporte: "Corrente de Ar", passiva: "Imprevis\xEDvel" }, bonus: { spd: 0.18, dge: 0.1 } },
  { id: "R24", name: "Mutante Veloz", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P9", skills: { ataque: "Investida Mutante", suporte: "Adapta\xE7\xE3o R\xE1pida", passiva: "Evolu\xE7\xE3o em Combate" }, bonus: { atk: 25, spd: 0.12, crit: 0.06 } },
  { id: "R25", name: "Forjador de Rel\xEDquias", tier: "NOMEADA", ataqueId: "A4", suporteId: "S12", passivaId: "P12", skills: { ataque: "Arma Forjada", suporte: "Encantar", passiva: "M\xE3os de Ouro" }, bonus: { atk: 30, arm: 25, hp: 200 } },
  { id: "R26", name: "Jardineiro Arcano", tier: "NOMEADA", ataqueId: "A7", suporteId: "S12", passivaId: "P2", skills: { ataque: "P\xF3len Explosivo", suporte: "Cultivar", passiva: "Colheita" }, bonus: { hp: 300, def: 25, matk: 20 } },
  { id: "R27", name: "Guardi\xE3o da Mem\xF3ria", tier: "NOMEADA", ataqueId: "A12", suporteId: "S6", passivaId: "P11", skills: { ataque: "Eco Temporal", suporte: "Rebobinar", passiva: "Mem\xF3ria Perfeita" }, bonus: { mp: 120, matk: 25, crit: 0.06 } },
  { id: "R28", name: "Ceifador de Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S4", passivaId: "P3", skills: { ataque: "Golpe Final", suporte: "Encerrar", passiva: "Fim Inevit\xE1vel" }, bonus: { atk: 35, crit: 0.1, resMagico: 0.06 } },
  { id: "R29", name: "Crep\xFAsculo Eterno", tier: "NOMEADA", ataqueId: "A15", suporteId: "S3", passivaId: "P5", skills: { ataque: "Eclipse", suporte: "Equil\xEDbrio", passiva: "Ciclo Perfeito" }, bonus: { hp: 250, atk: 20, matk: 20, crit: 0.06 } },
  { id: "R30", name: "Evolucionista", tier: "NOMEADA", ataqueId: "A11", suporteId: "S1", passivaId: "P11", skills: { ataque: "Muta\xE7\xE3o Ofensiva", suporte: "Regenera\xE7\xE3o Adaptativa", passiva: "Sele\xE7\xE3o Natural" }, bonus: { hp: 300, atk: 20, matk: 20 } },
  { id: "R31", name: "Guardi\xE3o da Terra", tier: "NOMEADA", ataqueId: "A4", suporteId: "S3", passivaId: "P2", skills: { ataque: "Terremoto", suporte: "Cura da Rocha", passiva: "Ra\xEDzes Profundas" }, bonus: { hp: 350, arm: 35, def: 20 } },
  { id: "R32", name: "Investigador Herege", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P10", skills: { ataque: "Pergunta Certa", suporte: "Interrogar", passiva: "D\xFAvida Met\xF3dica" }, bonus: { crit: 0.12, hit: 0.1, atk: 20 } },
  { id: "R33", name: "Inventor Ca\xF3tico", tier: "NOMEADA", ataqueId: "A1", suporteId: "S13", passivaId: "P9", skills: { ataque: "Gambiarra", suporte: "Improvisar", passiva: "Sorte do Caos" }, bonus: { atk: 20, crit: 0.1, spd: 0.06 } }
];
var SUPPORT_TITLES = {
  S1: "do Vigor",
  S2: "do V\xEDnculo",
  S3: "da Aurora",
  S4: "do V\xE9u",
  S5: "do Ritmo",
  S6: "da Revela\xE7\xE3o",
  S7: "do Baluarte",
  S8: "do Passo",
  S9: "da Adapta\xE7\xE3o",
  S10: "do C\xE1lculo",
  S11: "do Equil\xEDbrio",
  S12: "da Fus\xE3o",
  S13: "da Preda\xE7\xE3o",
  S14: "do Miasma",
  S15: "da L\xE2mina",
  S16: "da Mem\xF3ria",
  S17: "do Silte",
  S18: "da Matriarca"
};
var PASSIVE_SUFFIXES = {
  P1: "Eterna",
  P2: "de Granito",
  P3: "Elemental",
  P4: "Veloz",
  P5: "Sagrada",
  P6: "Nebulosa",
  P7: "Furiosa",
  P8: "Acelerada",
  P9: "Cruel",
  P10: "Erudita",
  P11: "Rara",
  P12: "\xC1urea",
  P13: "do P\xE2ntano",
  P14: "da Resina"
};
var ATAQUE_NOMES_CURTOS = {
  A1: "Presa de Lobo",
  A2: "Ferr\xE3o de Vespa",
  A3: "Chama de Espectro",
  A4: "Garra de Urso",
  A5: "Pe\xE7onha de Serpente",
  A6: "L\xE2mina de Bandido",
  A7: "Espinho de Planta",
  A8: "Mand\xEDbula de Hiena",
  A9: "N\xFAcleo de Golem",
  A10: "Pena de Falc\xE3o",
  A11: "Cristal de Gelo",
  A12: "Tent\xE1culo Abissal",
  A13: "Fragmento de Tempestade",
  A14: "Presa de Verme",
  A15: "Fragmento de Asterion",
  A16: "Gl\xE2ndula de Miasma",
  A17: "Asa de Lib\xE9lula",
  A18: "N\xF3 de Mem\xF3ria",
  A19: "Dente de Silte",
  A20: "Coroa da Matriarca"
};
function generateRaceName(ataqueId, suporteId, passivaId) {
  const atk = ATAQUE_NOMES_CURTOS[ataqueId] || "Ra\xE7a";
  const title = SUPPORT_TITLES[suporteId] || "do Vazio";
  const suffix = PASSIVE_SUFFIXES[passivaId] || "Eterna";
  return `${atk} ${title} ${suffix}`;
}
function generateRaceId(ataqueId, suporteId, passivaId) {
  return `RC-${ataqueId}-${suporteId}-${passivaId}`;
}
function generateRaceBonus(ataqueId, suporteId, passivaId) {
  const bonus = {};
  const aNum = parseInt(ataqueId.replace("A", "")) || 1;
  const sNum = parseInt(suporteId.replace("S", "")) || 1;
  const pNum = parseInt(passivaId.replace("P", "")) || 1;
  bonus.atk = 10 + aNum * 2;
  bonus.matk = 10 + aNum * 1.5;
  bonus.hp = 50 + sNum * 10;
  bonus.mp = 20 + sNum * 5;
  bonus.crit = 0.02 + pNum * 5e-3;
  bonus.dge = 0.02 + pNum * 5e-3;
  return bonus;
}
function findNamedRace(ataqueId, suporteId, passivaId) {
  return NAMED_RACES.find((r) => r.ataqueId === ataqueId && r.suporteId === suporteId && r.passivaId === passivaId) ?? null;
}
var MATRIX_STATS = {
  totalAtaques: 20,
  totalSuportes: 18,
  totalPassivas: 14,
  totalCombinacoes: 20 * 18 * 14,
  totalNomeadas: 33,
  totalSobrenomes: 18 * 14
};

// src/engine/forge.ts
var FORGE_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"];
function getEnchantmentCost(item, zoneId) {
  const safeUpgradeLevel = Number.isFinite(Number(item.upgradeLevel)) ? Math.max(0, Number(item.upgradeLevel)) : 0;
  return {
    runes: 100,
    gold: Math.floor(1e3 * item.tier * Math.max(1, safeUpgradeLevel + 1)),
    runeTemplateId: zoneId ? enchantmentRuneTemplateId(zoneId) : ""
  };
}
function enchantItem(char, itemUid, zoneId) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  const definition = enchantmentForZone(zoneId);
  if (!item) return { success: false, error: "Item n\xE3o encontrado no invent\xE1rio." };
  if (!definition) return { success: false, error: "Este mapa ainda n\xE3o possui um encantamento descoberto." };
  if (!FORGE_CATEGORIES.includes(item.category)) return { success: false, error: "Escolha um equipamento v\xE1lido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Encantamentos exigem um item Incomum ou superior." };
  if (item.enchantment) return { success: false, error: "Este item j\xE1 possui um Encantamento \xDAnico." };
  const cost = getEnchantmentCost(item, zoneId);
  const ownedRunes = countByTemplate(char.inventory, cost.runeTemplateId);
  if (ownedRunes < cost.runes) return { success: false, error: `Faltam runas. Voc\xEA possui ${ownedRunes}; precisa de ${cost.runes}.` };
  if (char.gold < cost.gold) return { success: false, error: `Ouro insuficiente. Voc\xEA precisa de ${cost.gold.toLocaleString("pt-BR")} gold.` };
  const enchantment = buildItemEnchantment(zoneId, item.tier);
  if (!enchantment) return { success: false, error: "N\xE3o foi poss\xEDvel materializar este aspecto." };
  char.gold -= cost.gold;
  let remaining = cost.runes;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== cost.runeTemplateId || remaining <= 0) continue;
    const amount = Math.min(entry.quantity, remaining);
    removeItem(char.inventory, entry.uid, amount);
    remaining -= amount;
  }
  item.enchantment = enchantment;
  recalcStats(char);
  return { success: true, enchantment: enchantment.name };
}
function hydrateLegacyStats(item) {
  const template = ALL_ITEM_TEMPLATES[item.templateId];
  if (!template) return;
  for (const [key, value] of Object.entries(template.stats ?? {})) {
    const current = Number(item.stats?.[key]);
    if (!Number.isFinite(current) || current === 0) item.stats[key] = Math.round(Number(value) * Math.pow(1.1, item.upgradeLevel ?? 0) * 100) / 100;
  }
}
function getUpgradeCost(item) {
  const nextLevel = item.upgradeLevel + 1;
  let fragmentType = "FRAGMENTO_COMUM";
  let fragmentsNeeded = 5 * nextLevel;
  if (item.tier >= 3) {
    fragmentType = "FRAGMENTO_RARO";
    fragmentsNeeded = 3 * nextLevel;
  }
  if (item.tier >= 5) {
    fragmentType = "FRAGMENTO_EPICO";
    fragmentsNeeded = 2 * nextLevel;
  }
  const goldCost = Math.floor(100 * item.tier * Math.pow(nextLevel, 2));
  return { fragments: fragmentsNeeded, gold: goldCost, fragmentType };
}
function forgeFragments(char, fromTemplateId) {
  const recipes = {
    FRAGMENTO_COMUM: { to: "FRAGMENTO_EPICO", input: 100, output: 10 },
    FRAGMENTO_RARO: { to: "FRAGMENTO_EPICO", input: 25, output: 10 }
  };
  const recipe = recipes[fromTemplateId];
  if (!recipe) return { success: false, error: "Esse fragmento n\xE3o possui receita de fus\xE3o." };
  const available = countByTemplate(char.inventory, fromTemplateId);
  if (available < recipe.input) return { success: false, error: `Voc\xEA precisa de ${recipe.input} fragmentos; possui ${available}.` };
  const crafted = createItem({ ...FRAGMENT_TEMPLATES[recipe.to], quantity: recipe.output });
  if (!canAddItem(char.inventory, crafted)) return { success: false, error: "N\xE3o h\xE1 espa\xE7o para os fragmentos forjados." };
  let remaining = recipe.input;
  for (const item of [...char.inventory.items]) {
    if (item.templateId !== fromTemplateId || remaining <= 0) continue;
    const amount = Math.min(item.quantity, remaining);
    removeItem(char.inventory, item.uid, amount);
    remaining -= amount;
  }
  addItem(char.inventory, crafted);
  return { success: true, crafted: recipe.output };
}
function upgradeItemLevel(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado no invent\xE1rio." };
  if (!FORGE_CATEGORIES.includes(item.category)) return { success: false, error: "Escolha um equipamento v\xE1lido para o Ferreiro." };
  hydrateLegacyStats(item);
  if (item.upgradeLevel >= 10) return { success: false, error: "O item j\xE1 atingiu o n\xEDvel m\xE1ximo (+10)." };
  const cost = getUpgradeCost(item);
  const fragmentsOwned = countByTemplate(char.inventory, cost.fragmentType);
  if (fragmentsOwned < cost.fragments) {
    return { success: false, error: `Fragmentos insuficientes. Voc\xEA tem ${fragmentsOwned}, precisa de ${cost.fragments}.` };
  }
  if (char.gold < cost.gold) {
    return { success: false, error: `Ouro insuficiente. Voc\xEA tem ${char.gold}, precisa de ${cost.gold}.` };
  }
  char.gold -= cost.gold;
  let remainingToRemove = cost.fragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === cost.fragmentType && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }
  item.upgradeLevel += 1;
  for (const [k, v] of Object.entries(item.stats)) {
    item.stats[k] = Math.round(v * 1.1 * 100) / 100;
  }
  recalcStats(char);
  return { success: true };
}
function rerollItemAffixes(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category)) return { success: false, error: "Escolha um equipamento v\xE1lido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns n\xE3o possuem atributos para reencantar." };
  const costFragments = 20;
  const costGold = 500 * item.tier;
  const fragmentsOwned = countByTemplate(char.inventory, "FRAGMENTO_RARO");
  if (fragmentsOwned < costFragments) {
    return { success: false, error: `Faltam Fragmentos Raros. Voc\xEA tem ${fragmentsOwned}, precisa de ${costFragments}.` };
  }
  if (char.gold < costGold) {
    return { success: false, error: `Ouro insuficiente. Voc\xEA tem ${char.gold}, precisa de ${costGold}.` };
  }
  char.gold -= costGold;
  let remainingToRemove = costFragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === "FRAGMENTO_RARO" && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }
  const newAffixes = generateRandomAffixes(item.category, item.rarity, item.tier);
  item.affixes = newAffixes;
  recalcStats(char);
  return { success: true, newAffixes };
}
function elevateItemTier(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category)) return { success: false, error: "Escolha um equipamento v\xE1lido para o Ferreiro." };
  if (item.tier >= 5) return { success: false, error: "Este item j\xE1 est\xE1 no Tier m\xE1ximo." };
  const nextTier = item.tier + 1;
  const fragments = 15 * nextTier;
  const gold = 2500 * nextTier * nextTier;
  const owned = countByTemplate(char.inventory, "FRAGMENTO_EPICO");
  if (owned < fragments) return { success: false, error: `Faltam Fragmentos \xC9picos. Voc\xEA tem ${owned}, precisa de ${fragments}.` };
  if (char.gold < gold) return { success: false, error: `Ouro insuficiente. Voc\xEA tem ${char.gold}, precisa de ${gold}.` };
  char.gold -= gold;
  let left = fragments;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== "FRAGMENTO_EPICO" || left <= 0) continue;
    const amount = Math.min(entry.quantity, left);
    removeItem(char.inventory, entry.uid, amount);
    left -= amount;
  }
  item.tier = nextTier;
  for (const [key, value] of Object.entries(item.stats)) item.stats[key] = Math.round(Number(value) * 1.22 * 100) / 100;
  item.name = item.name.replace(/ · T[1-5]$/, "") + ` \xB7 T${nextTier}`;
  recalcStats(char);
  return { success: true };
}
function rerollSpecificAffix(char, itemUid, stat) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category)) return { success: false, error: "Escolha um equipamento v\xE1lido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns n\xE3o possuem atributos para reencantar." };
  const costFragments = 100;
  const costGold = 2500 * item.tier;
  if ((char.mythreonCoins ?? 0) < 1) return { success: false, error: "\xC9 necess\xE1ria 1 Mythreon Coin para sortear um atributo espec\xEDfico." };
  if (countByTemplate(char.inventory, "FRAGMENTO_RARO") < costFragments) return { success: false, error: `Faltam Fragmentos Raros. Voc\xEA precisa de ${costFragments}.` };
  if (char.gold < costGold) return { success: false, error: `Ouro insuficiente. Voc\xEA precisa de ${costGold}.` };
  const generated = generateRandomAffixes(item.category, item.rarity, item.tier);
  const replacement = generated.find((affix) => affix.stat === stat) ?? generated[0];
  if (!replacement) return { success: false, error: "Nenhum atributo compat\xEDvel foi encontrado." };
  char.gold -= costGold;
  char.mythreonCoins = (char.mythreonCoins ?? 0) - 1;
  let left = costFragments;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== "FRAGMENTO_RARO" || left <= 0) continue;
    const amount = Math.min(entry.quantity, left);
    removeItem(char.inventory, entry.uid, amount);
    left -= amount;
  }
  const index = item.affixes.findIndex((affix) => affix.stat === stat);
  if (index >= 0) item.affixes[index] = replacement;
  else item.affixes.push(replacement);
  recalcStats(char);
  return { success: true };
}

// src/engine/depot.ts
function getDepotUsedSlots(char) {
  return char.depot?.length || 0;
}
function depositItem(char, uid) {
  if (!char.depot) char.depot = [];
  if (!char.depotMax) char.depotMax = 300;
  const item = char.inventory.items.find((i) => i.uid === uid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado na Backpack." };
  if (getDepotUsedSlots(char) >= char.depotMax) return { success: false, error: "O Depot est\xE1 cheio!" };
  removeItem(char.inventory, uid, item.quantity);
  char.depot.push({ ...item });
  for (const [slot, eq] of Object.entries(char.equipped)) {
    if (eq && eq.uid === uid) {
      delete char.equipped[slot];
    }
  }
  recalcStats(char);
  return { success: true };
}
function withdrawItem(char, uid) {
  if (!char.depot) return { success: false, error: "Depot vazio." };
  const item = char.depot.find((i) => i.uid === uid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado no Depot." };
  if (getUsedSlots(char.inventory) >= char.inventory.backpack.slots) {
    return { success: false, error: "Sua Backpack est\xE1 cheia!" };
  }
  char.depot = char.depot.filter((i) => i.uid !== uid);
  addItem(char.inventory, item);
  recalcStats(char);
  return { success: true };
}
function depositMany(char, uids) {
  let moved = 0;
  let error = void 0;
  for (const uid of uids) {
    const res = depositItem(char, uid);
    if (res.success) moved++;
    else {
      error = res.error;
      break;
    }
  }
  return { moved, error };
}
function withdrawMany(char, uids) {
  let moved = 0;
  let error = void 0;
  for (const uid of uids) {
    const res = withdrawItem(char, uid);
    if (res.success) moved++;
    else {
      error = res.error;
      break;
    }
  }
  return { moved, error };
}

// src/data/farm.ts
var FARM_SEEDS = [
  { id: "SEMENTE_CENOURA", name: "Semente de Cenoura", icon: "\u{1F955}", growMs: 5 * 6e4, yieldId: "COLHEITA_CENOURA", yieldName: "Cenoura", yieldIcon: "\u{1F955}", yieldQty: 2, cost: 30 },
  { id: "SEMENTE_MELANCIA", name: "Semente de Melancia", icon: "\u{1F349}", growMs: 15 * 6e4, yieldId: "COLHEITA_MELANCIA", yieldName: "Melancia", yieldIcon: "\u{1F349}", yieldQty: 2, cost: 90 },
  { id: "SEMENTE_TRIGO", name: "Semente de Trigo", icon: "\u{1F33E}", growMs: 30 * 6e4, yieldId: "COLHEITA_TRIGO", yieldName: "Trigo de Lyss", yieldIcon: "\u{1F33E}", yieldQty: 3, cost: 160 },
  { id: "SEMENTE_LUMINA", name: "Semente Lumina", icon: "\u2728", growMs: 60 * 6e4, yieldId: "COLHEITA_LUMINA", yieldName: "Fruto Lumina", yieldIcon: "\u{1F506}", yieldQty: 2, cost: 400 }
];
var FARM_RECIPES = [
  { id: "RECEITA_SOPA_CENOURA", name: "Sopa de Cenoura de Lyss", icon: "\u{1F372}", ingredients: [{ templateId: "COLHEITA_CENOURA", name: "Cenoura", quantity: 2, icon: "\u{1F955}" }, { templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 1, icon: "\u{1F33E}" }], outputTemplateId: "SOPA_CENOURA_LYSS", outputName: "Sopa de Cenoura de Lyss", outputIcon: "\u{1F372}", outputQuantity: 1, sellValue: 85 },
  { id: "RECEITA_ELIXIR_MELANCIA", name: "Elixir de Mar\xE9 Doce", icon: "\u{1F9EA}", ingredients: [{ templateId: "COLHEITA_MELANCIA", name: "Melancia", quantity: 2, icon: "\u{1F349}" }, { templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 1, icon: "\u{1F506}" }], outputTemplateId: "ELIXIR_MARE_DOCE", outputName: "Elixir de Mar\xE9 Doce", outputIcon: "\u{1F9EA}", outputQuantity: 1, sellValue: 220 },
  { id: "RECEITA_PAO_LYSS", name: "P\xE3o R\xFAnico de Lyss", icon: "\u{1F35E}", ingredients: [{ templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 3, icon: "\u{1F33E}" }, { templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 1, icon: "\u{1F506}" }], outputTemplateId: "PAO_RUNICO_LYSS", outputName: "P\xE3o R\xFAnico de Lyss", outputIcon: "\u{1F35E}", outputQuantity: 2, sellValue: 180 },
  { id: "RECEITA_COMPOSTO_LYSS", name: "Composto F\xE9rtil de Lyss", icon: "\u{1FAB4}", ingredients: [{ templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 2, icon: "\u{1F33E}" }, { templateId: "COLHEITA_CENOURA", name: "Cenoura", quantity: 1, icon: "\u{1F955}" }], outputTemplateId: "COMPOSTO_LYSS", outputName: "Composto F\xE9rtil de Lyss", outputIcon: "\u{1FAB4}", outputQuantity: 1, sellValue: 0 },
  { id: "RECEITA_BANQUETE_BESTA", name: "Banquete da Besta", icon: "\u{1F356}", ingredients: [{ templateId: "COLHEITA_MELANCIA", name: "Melancia", quantity: 2, icon: "\u{1F349}" }, { templateId: "COLHEITA_CENOURA", name: "Cenoura", quantity: 2, icon: "\u{1F955}" }, { templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 1, icon: "\u{1F506}" }], outputTemplateId: "BANQUETE_BESTA", outputName: "Banquete da Besta", outputIcon: "\u{1F356}", outputQuantity: 1, sellValue: 420 },
  { id: "RECEITA_ELIXIR_ESSENCIA", name: "Elixir da Ess\xEAncia", icon: "\u{1F4A0}", ingredients: [{ templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 2, icon: "\u{1F506}" }, { templateId: "COLHEITA_MELANCIA", name: "Melancia", quantity: 2, icon: "\u{1F349}" }, { templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 2, icon: "\u{1F33E}" }], outputTemplateId: "ELIXIR_ESSENCIA", outputName: "Elixir da Ess\xEAncia", outputIcon: "\u{1F4A0}", outputQuantity: 1, sellValue: 720 }
];
var farmRecipe = (id) => FARM_RECIPES.find((recipe) => recipe.id === id);
var FARM_MAX_PLOTS = 12;
var FARM_FERTILITY_MAX = 100;
var FARM_FERTILITY_MIN = 25;
var FARM_FERTILITY_LOSS_PER_HARVEST = 12;
var FARM_FERTILITY_COMPOST_GAIN = 25;
function farmExpansionCost(unlockedPlots) {
  if (unlockedPlots >= FARM_MAX_PLOTS) return null;
  const nextPlot = unlockedPlots + 1;
  if (nextPlot === 2) return { kind: "gold", amount: 1e3, label: "1.000 gold" };
  if (nextPlot === 3) return { kind: "gold", amount: 25e3, label: "25.000 gold" };
  if (nextPlot === 4) return { kind: "gold", amount: 1e5, label: "100.000 gold" };
  return { kind: "coins", amount: 500, label: "500 Mythreon Coins" };
}
var farmSeed = (id) => FARM_SEEDS.find((seed) => seed.id === id);
function farmYield(seed, fertility = FARM_FERTILITY_MAX, harvestingSkill = 0) {
  const fertilityPenalty = fertility < 50 ? 1 : 0;
  const skillBonus = Math.floor(Math.max(0, harvestingSkill) / 10);
  return { uid: `farm-${seed.yieldId}-${Date.now()}-${Math.random()}`, templateId: seed.yieldId, name: seed.yieldName, category: "MATERIAL", tier: 1, rarity: "COMUM", stats: {}, affixes: [], upgradeLevel: 0, stackable: true, maxStack: 999, quantity: Math.max(1, seed.yieldQty - fertilityPenalty + skillBonus), icon: seed.yieldIcon };
}
function farmRecipeOutput(recipe) {
  return { uid: `farm-recipe-${recipe.outputTemplateId}-${Date.now()}-${Math.random()}`, templateId: recipe.outputTemplateId, name: recipe.outputName, category: "MATERIAL", tier: recipe.id.includes("ESSENCIA") || recipe.id.includes("BANQUETE") ? 3 : recipe.id.includes("COMPOSTO") ? 1 : 2, rarity: recipe.id.includes("ESSENCIA") ? "RARO" : recipe.id.includes("BANQUETE") ? "EPICO" : recipe.id.includes("COMPOSTO") ? "COMUM" : "INCOMUM", stats: {}, affixes: [], upgradeLevel: 0, stackable: true, maxStack: 999, quantity: recipe.outputQuantity, icon: recipe.outputIcon };
}

// src/data/professions.ts
var FISHING_BAIT = { templateId: "ISCA_CICATRIZ", name: "Isca da Cicatriz", quantity: 1, bonusFish: 1 };
var PROFESSION_TOOL_SHOP = [
  { templateId: "PICARETA_T2", profession: "MINERACAO", tier: 2, requiredSkill: 20, gold: 2e3 },
  { templateId: "PICARETA_T3", profession: "MINERACAO", tier: 3, requiredSkill: 40, gold: 12e3 },
  { templateId: "PICARETA_T4", profession: "MINERACAO", tier: 4, requiredSkill: 60, gold: 6e4 },
  { templateId: "PICARETA_T5", profession: "MINERACAO", tier: 5, requiredSkill: 80, gold: 25e4 },
  { templateId: "VARA_PESCA_T2", profession: "PESCA", tier: 2, requiredSkill: 20, gold: 2e3 },
  { templateId: "VARA_PESCA_T3", profession: "PESCA", tier: 3, requiredSkill: 40, gold: 12e3 },
  { templateId: "VARA_PESCA_T4", profession: "PESCA", tier: 4, requiredSkill: 60, gold: 6e4 },
  { templateId: "VARA_PESCA_T5", profession: "PESCA", tier: 5, requiredSkill: 80, gold: 25e4 }
];
var MINING_NODES = [
  { id: "veio_lyss", name: "Veio de Ferro de Lyss", zoneId: "BOSQUE_LYSS", requiredSkill: 0, tier: 1, dropTemplateId: "MINERIO_FERRO", dropName: "Min\xE9rio de Ferro", dropIcon: "\u26CF\uFE0F", action: "Revele o pulso da veia e acerte a faixa dourada" },
  { id: "cristal_dhor", name: "Veio de Cobre de Dhor", zoneId: "PICO_DHOR", requiredSkill: 20, tier: 2, dropTemplateId: "MINERIO_COBRE", dropName: "Min\xE9rio de Cobre", dropIcon: "\u{1F7E0}", action: "Abra caminho entre gelo e brasa" },
  { id: "cristal_azhar", name: "Gruta de Ess\xEAncia de Azhar", zoneId: "MAR_AZHAR", requiredSkill: 40, tier: 3, dropTemplateId: "CRISTAL_ESSENCIA", dropName: "Cristal de Ess\xEAncia", dropIcon: "\u{1F48E}", action: "Encontre o brilho entre os corais" },
  { id: "obsidiana_cicatriz", name: "Veio Obsidiano", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 60, tier: 4, dropTemplateId: "MINERIO_OBSIDIANO", dropName: "Min\xE9rio Obsidiano", dropIcon: "\u{1FAA8}", action: "Quebre a crosta da Cicatriz" },
  { id: "eclipse_profundo", name: "N\xFAcleo do Eclipse", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 80, tier: 5, dropTemplateId: "MINERIO_ECLIPSE", dropName: "Min\xE9rio do Eclipse", dropIcon: "\u{1F311}", action: "Sincronize-se com a pulsa\xE7\xE3o do abismo" }
];
var FISHING_SPOTS = [
  { id: "corrego_lyss", name: "C\xF3rrego de Lyss", zoneId: "BOSQUE_LYSS", requiredSkill: 0, rodTier: 1, dropTemplateId: "PEIXE_RIO", dropName: "Peixe do Ref\xFAgio", dropIcon: "\u{1F41F}", action: "Segure e solte quando o marcador alcan\xE7ar o dourado" },
  { id: "lago_dhor", name: "Lago Degelado de Dhor", zoneId: "PICO_DHOR", requiredSkill: 20, rodTier: 2, dropTemplateId: "TRUTA_GELO", dropName: "Truta de Gelo", dropIcon: "\u{1F41F}", action: "Sinta o pux\xE3o sob o gelo" },
  { id: "mar_azhar", name: "Corais de Azhar", zoneId: "MAR_AZHAR", requiredSkill: 40, rodTier: 3, dropTemplateId: "PEIXE_CORAL", dropName: "Peixe-Coral", dropIcon: "\u{1F420}", action: "Recolha a linha entre as ondas" },
  { id: "cicatriz_funda", name: "Cicatriz Profunda", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 60, rodTier: 4, dropTemplateId: "PEIXE_CICATRIZ", dropName: "Peixe-Cicatriz", dropIcon: "\u{1F420}", action: "Encontre vida nas \xE1guas escuras" },
  { id: "lago_astral", name: "Lago Astral da Cicatriz", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 80, rodTier: 5, dropTemplateId: "PEIXE_ASTRAL", dropName: "Peixe Astral", dropIcon: "\u2728", action: "Recolha antes que o brilho desapare\xE7a" }
];
function professionCooldown(skill) {
  return Math.max(1500, 5e3 - Math.floor(skill / 10) * 100);
}
var PROFESSION_RECIPES = [
  { id: "LINGOTE_FERRO", name: "Fundir Lingote de Ferro", icon: "\u{1F529}", profession: "MINERACAO", requiredSkill: 10, ingredients: [{ templateId: "MINERIO_FERRO", quantity: 5 }], outputTemplateId: "LINGOTE_FERRO", outputQuantity: 1 },
  { id: "CRISTAL_REFINADO", name: "Lapidar Cristal de Ess\xEAncia", icon: "\u{1F4A0}", profession: "MINERACAO", requiredSkill: 45, ingredients: [{ templateId: "CRISTAL_ESSENCIA", quantity: 3 }, { templateId: "MINERIO_FERRO", quantity: 5 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 1 },
  { id: "ISCA_CICATRIZ", name: "Preparar Isca da Cicatriz", icon: "\u{1FAB1}", profession: "PESCA", requiredSkill: 10, ingredients: [{ templateId: "PEIXE_RIO", quantity: 3 }], outputTemplateId: "ISCA_CICATRIZ", outputQuantity: 2 },
  { id: "CALDO_MARCA_DAGUA", name: "Cozinhar Caldo da Marca-d'\xC1gua", icon: "\u{1F372}", profession: "PESCA", requiredSkill: 45, ingredients: [{ templateId: "PEIXE_CICATRIZ", quantity: 2 }, { templateId: "COLHEITA_MELANCIA", quantity: 1 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 1 },
  { id: "LIGA_COBRE", name: "Forjar Liga de Cobre e Ferro", icon: "\u{1F529}", profession: "MINERACAO", requiredSkill: 20, ingredients: [{ templateId: "MINERIO_COBRE", quantity: 3 }, { templateId: "MINERIO_FERRO", quantity: 4 }], outputTemplateId: "LINGOTE_FERRO", outputQuantity: 2 },
  { id: "LAPIDAR_OBSIDIANA", name: "Lapidar Ess\xEAncia Obsidiana", icon: "\u{1F4A0}", profession: "MINERACAO", requiredSkill: 60, ingredients: [{ templateId: "MINERIO_OBSIDIANO", quantity: 3 }, { templateId: "CRISTAL_ESSENCIA", quantity: 1 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 1 },
  { id: "LAPIDAR_ECLIPSE", name: "Condensar Ess\xEAncia do Eclipse", icon: "\u{1F311}", profession: "MINERACAO", requiredSkill: 80, ingredients: [{ templateId: "MINERIO_ECLIPSE", quantity: 3 }, { templateId: "CRISTAL_ESSENCIA", quantity: 4 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 2 },
  { id: "ISCA_GELO", name: "Preparar Isca de \xC1gua Fria", icon: "\u{1FAB1}", profession: "PESCA", requiredSkill: 20, ingredients: [{ templateId: "TRUTA_GELO", quantity: 2 }], outputTemplateId: "ISCA_CICATRIZ", outputQuantity: 3 },
  { id: "CALDO_CORAL", name: "Cozinhar Caldo dos Corais", icon: "\u{1F372}", profession: "PESCA", requiredSkill: 40, ingredients: [{ templateId: "PEIXE_CORAL", quantity: 3 }, { templateId: "COLHEITA_MELANCIA", quantity: 1 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 1 },
  { id: "CALDO_ASTRAL", name: "Cozinhar Caldo Astral", icon: "\u{1F372}", profession: "PESCA", requiredSkill: 80, ingredients: [{ templateId: "PEIXE_ASTRAL", quantity: 3 }, { templateId: "COLHEITA_MELANCIA", quantity: 2 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 2 }
];

// src/engine/dailyCalendar.ts
function calendarItem(templateId, quantity) {
  const template = ALL_ITEM_TEMPLATES[templateId];
  if (!template) return null;
  return { ...createItem({ ...template, templateId: template.templateId, name: template.name, quantity }), uid: generateId(), quantity, stats: { ...template.stats }, upgradeLevel: 0 };
}
function deliverCalendarItem(character, item) {
  const inventory = structuredClone(character.inventory);
  if (addItem(inventory, structuredClone(item))) {
    character.inventory = inventory;
    return "mochila";
  }
  if ((character.depot ?? []).length >= (character.depotMax ?? 300)) return null;
  character.depot = [...character.depot ?? [], item];
  return "dep\xF3sito";
}
function claimCalendarReward(character, now = Date.now()) {
  const progress = calendarProgress(character, now);
  if (progress.claimedToday) return { success: false, error: "A recompensa de hoje j\xE1 foi resgatada." };
  if (character.calendarLastClaimDay && character.calendarLastClaimDay > progress.today) return { success: false, error: "O rel\xF3gio est\xE1 anterior ao \xFAltimo resgate. Aguarde o dia correto do servidor." };
  const next = structuredClone(character);
  const milestone = calendarWeeklyMilestoneKey(progress.today, progress.nextStreak);
  let lastMilestone = next.calendarWeeklyRewardKey;
  if (lastMilestone && /^\d{4}-W\d{2}$/.test(lastMilestone) && progress.streak >= CALENDAR_WEEK_DAYS && character.calendarLastClaimDay) {
    lastMilestone = calendarWeeklyMilestoneKey(character.calendarLastClaimDay, progress.streak);
  }
  const weekly = progress.nextStreak >= CALENDAR_WEEK_DAYS && lastMilestone !== milestone;
  let delivery;
  const daily = progress.todayReward;
  if (daily.templateId) {
    const item = calendarItem(daily.templateId, daily.quantity ?? 1);
    if (!item) return { success: false, error: "A recompensa di\xE1ria est\xE1 indispon\xEDvel. Tente novamente mais tarde." };
    const dailyDelivery = deliverCalendarItem(next, item);
    if (!dailyDelivery) return { success: false, error: "Libere um espa\xE7o na mochila ou no dep\xF3sito para receber a recompensa de hoje." };
    delivery = dailyDelivery;
  }
  if (weekly) {
    const location2 = deliverCalendarItem(next, createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_RARO, quantity: CALENDAR_WEEK_FRAGMENTS }));
    if (!location2) return { success: false, error: "Libere um espa\xE7o na mochila ou no dep\xF3sito para receber o b\xF4nus semanal. Seu cupom foi preservado." };
    delivery = location2;
    next.calendarWeeklyRewardKey = milestone;
  }
  next.calendarClaimedDays = [...progress.days, progress.today];
  next.calendarLastClaimDay = progress.today;
  next.calendarStreak = progress.nextStreak;
  next.calendarUnlockedSkins = calendarUnlockedSkins(character);
  next.gold += progress.nextGold + (daily.gold ?? 0);
  const monthly = !!progress.month.reward && next.calendarClaimedDays.length >= progress.month.requiredPresence && !progress.monthlyUnlocked;
  if (monthly && progress.month.reward) {
    next.calendarUnlockedSkins = [.../* @__PURE__ */ new Set([...next.calendarUnlockedSkins, progress.month.reward.templateId])];
    next.calendarMonthlySkinKey = progress.month.key;
  }
  let reward = `${daily.icon} ${daily.label} \xD7${daily.quantity ?? 1} + ${progress.nextGold.toLocaleString("pt-BR")} gold`;
  if (weekly) reward += ` + ${CALENDAR_WEEK_FRAGMENTS} Fragmentos Raros (${delivery})`;
  if (monthly) reward += " + " + progress.month.reward.name + " (liberada no guarda-roupa)";
  return { success: true, character: next, reward, weekly, monthly, delivery };
}
function recoverCalendarDay(character, day, now = Date.now()) {
  const today = calendarDayKey(now), progress = calendarProgress(character, now);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day >= today || day.slice(0, 7) !== progress.month.key) return { success: false, error: "Escolha um dia perdido deste m\xEAs." };
  if (progress.days.includes(day)) return { success: false, error: "Esse dia j\xE1 foi resgatado." };
  if (!Number.isSafeInteger(character.calendarCoupons) || Number(character.calendarCoupons) < 1) return { success: false, error: "Voc\xEA precisa de um Cupom de Resgate para recuperar um dia." };
  const reward = calendarRewardForDay(day), item = reward.templateId ? calendarItem(reward.templateId, reward.quantity ?? 1) : null;
  if (!item) return { success: false, error: "A recompensa deste dia est\xE1 indispon\xEDvel." };
  const next = structuredClone(character), delivery = deliverCalendarItem(next, item);
  if (!delivery) return { success: false, error: "Libere espa\xE7o na mochila ou no dep\xF3sito antes de recuperar o dia." };
  next.calendarCoupons = Number(next.calendarCoupons) - 1;
  next.calendarClaimedDays = [.../* @__PURE__ */ new Set([...progress.days, day])].sort();
  next.calendarLastClaimDay = day;
  next.calendarStreak = 1;
  next.gold += reward.gold ?? 0;
  return { success: true, character: next, reward: `${reward.icon} ${reward.label} \xD7${reward.quantity ?? 1} recuperado`, weekly: false, monthly: false, delivery };
}
function recoverCalendarWeek(character, now = Date.now()) {
  const today = calendarDayKey(now), progress = calendarProgress(character, now), start = calendarWeekStart(today);
  const missing = Array.from({ length: 7 }, (_, index) => calendarDayKey(Date.parse(start + "T00:00:00Z") + index * 864e5)).filter((day) => day < today && !progress.days.includes(day) && day.startsWith(progress.month.key));
  if (!missing.length) return { success: false, error: "N\xE3o h\xE1 dias perdidos nesta semana para recuperar." };
  if (Number(character.calendarCoupons ?? 0) < missing.length) return { success: false, error: `Voc\xEA precisa de ${missing.length} Cupons de Resgate para recuperar os dias restantes desta semana.` };
  let next = structuredClone(character), labels = [];
  for (const day of missing) {
    const result = recoverCalendarDay(next, day, now);
    if (!result.success) return result;
    next = result.character;
    labels.push(result.reward);
  }
  return { success: true, character: next, reward: `${missing.length} dias recuperados \xB7 ${labels.join(", ")}`, weekly: false, monthly: false };
}

// src/data/onlineChest.ts
var ONLINE_CHEST_MILESTONES = [
  { id: "CHEST_5M", label: "5 minutos", seconds: 5 * 60, gold: 300, shards: 1 },
  { id: "CHEST_30M", label: "30 minutos", seconds: 30 * 60, gold: 1e3, shards: 2 },
  { id: "CHEST_2H", label: "2 horas", seconds: 2 * 60 * 60, gold: 3500, shards: 5 },
  { id: "CHEST_6H", label: "6 horas", seconds: 6 * 60 * 60, gold: 1e4, shards: 10 },
  { id: "CHEST_12H", label: "12 horas", seconds: 12 * 60 * 60, gold: 25e3, shards: 25 }
];
function onlineChestDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
function normalizeOnlineChest(character, now = Date.now()) {
  const day = onlineChestDayKey(now);
  if (character.onlineChestDay !== day) {
    character.onlineChestDay = day;
    character.onlineChestClaims = [];
    character.onlineChestSeconds = 0;
  } else {
    character.onlineChestClaims = [...new Set((character.onlineChestClaims ?? []).filter((id) => ONLINE_CHEST_MILESTONES.some((milestone) => milestone.id === id)))];
    character.onlineChestSeconds = Math.max(0, Number(character.onlineChestSeconds ?? 0) || 0);
  }
  return character;
}
function nextOnlineChest(character) {
  const claimed = new Set(character.onlineChestClaims ?? []);
  return ONLINE_CHEST_MILESTONES.find((milestone) => !claimed.has(milestone.id)) ?? null;
}

// src/data/stamina.ts
var STAMINA_ONLINE_MAX = 120;
var STAMINA_PRETEST_UNLIMITED = true;
var STAMINA_GOLD_REFILL_MINUTES = 60;
var STAMINA_COIN_REFILL_MINUTES = 120;
function staminaGoldCost(level) {
  return Math.max(500, Math.floor(Math.max(1, level) * 250));
}
function staminaDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

// src/store/gameStore.ts
function recordHuntMetrics(character, zoneId, result) {
  const previous = character.huntStatsByZone?.[zoneId] ?? {
    activeMs: 0,
    kills: 0,
    damageDealt: 0,
    damageTaken: 0,
    xp: 0,
    gold: 0,
    goldSpentPotions: 0,
    soldGold: 0,
    lootValue: 0,
    history: []
  };
  const encounters = result.encounters ?? [];
  const updated = {
    activeMs: previous.activeMs + (result.combatDurationMs ?? 0),
    kills: previous.kills + result.kills,
    damageDealt: previous.damageDealt + (result.damageDealt ?? 0),
    damageTaken: previous.damageTaken + (result.damageTaken ?? 0),
    xp: previous.xp + result.xp,
    gold: previous.gold + result.gold,
    goldSpentPotions: (previous.goldSpentPotions ?? 0) + (result.goldSpentPotions ?? 0),
    soldGold: previous.soldGold + (result.soldGold ?? 0),
    lootValue: previous.lootValue + encounters.reduce((sum, encounter) => sum + encounter.lootValue, 0),
    history: [...previous.history, ...encounters].slice(-100)
  };
  character.huntStatsByZone = { ...character.huntStatsByZone ?? {}, [zoneId]: updated };
}
var EGG_RARITY_TABLES = {
  1: [95, 4, 1, 0, 0],
  2: [75, 18, 6, 1, 0],
  3: [50, 30, 15, 4, 1],
  4: [25, 35, 25, 12, 3],
  5: [8, 25, 35, 24, 8]
};
var RARITY_ORDER2 = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
function rollEggRarity(tier) {
  const roll = Math.random() * 100;
  let cursor = 0;
  for (const [index, chance] of (EGG_RARITY_TABLES[Math.max(1, Math.min(5, tier))] ?? EGG_RARITY_TABLES[1]).entries()) {
    cursor += chance;
    if (roll < cursor) return RARITY_ORDER2[index];
  }
  return "COMUM";
}
function eggIncubationMs(tier) {
  return [0, 60, 180, 480, 1200, 2400][Math.max(1, Math.min(5, Math.floor(tier)))] * 1e3;
}
function createGameStore(runtime = {}) {
  const runtimeNow = runtime.now ?? (() => Date.now());
  let tickInterval = null;
  const notify = runtime.notify ?? ((message) => {
    if (typeof alert !== "undefined") alert(message);
  });
  const warn = (message) => {
    if (runtime.server) throw Error(message);
    notify(message);
  };
  return (0, import_zustand.create)((set, get) => ({
    character: null,
    races: [],
    currentZoneId: "BOSQUE_LYSS",
    lastTickResult: null,
    isTickRunning: false,
    isTraining: false,
    offlineReport: null,
    deathReport: null,
    healingUntil: null,
    finishIntro: () => {
      const c = get().character;
      if (!c) return;
      set({ character: { ...c, introSeen: true } });
      get().save();
    },
    unlockZone: (id) => {
      const c = get().character;
      if (!c) return { success: false };
      const next = structuredClone(c);
      const result = unlockJourneyZone(next, id);
      if (result.success) {
        set({ character: next });
        get().save();
      }
      return result;
    },
    newGame: (name, appearance) => {
      const char = createNewCharacter(name, appearance);
      const races = [];
      trackRaceDiscovery(char, races);
      set({ character: char, races, currentZoneId: "BOSQUE_LYSS" });
      get().save();
    },
    updateAppearance: (appearance) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = JSON.parse(JSON.stringify(character));
      next.appearance = appearance;
      set({ character: next });
      get().save();
      return { success: true };
    },
    equipCosmetic: (templateId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const template = ALL_ITEM_TEMPLATES[templateId];
      const definition = COSMETIC_DEFINITIONS[templateId];
      if (!template || !definition) return { success: false, error: "Cosm\xE9tico inv\xE1lido." };
      const owned = (character.unlockedCosmetics ?? []).includes(templateId) || [...character.inventory.items ?? [], ...character.depot ?? [], ...Object.values(character.equipped ?? {})].some((item) => item.templateId === templateId);
      if (!owned && !calendarUnlockedSkins(character).includes(templateId)) return { success: false, error: "Voc\xEA ainda n\xE3o possui este cosm\xE9tico." };
      const next = structuredClone(character);
      next.cosmeticLoadout ??= {};
      next.cosmeticLoadout[definition.slot] = templateId;
      set({ character: next });
      get().save();
      return { success: true };
    },
    activateCosmetic: (templateId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const template = ALL_ITEM_TEMPLATES[templateId];
      const definition = COSMETIC_DEFINITIONS[templateId];
      if (!template || !definition) return { success: false, error: "Este item n\xE3o \xE9 um cosm\xE9tico ativ\xE1vel." };
      const next = structuredClone(character);
      next.unlockedCosmetics = [...new Set(next.unlockedCosmetics ?? [])];
      const alreadyUnlocked = next.unlockedCosmetics.includes(templateId) || calendarUnlockedSkins(next).includes(templateId);
      if (!alreadyUnlocked) {
        const inventoryItem = next.inventory.items.find((item) => item.templateId === templateId);
        const depotItem = (next.depot ?? []).find((item) => item.templateId === templateId);
        if (inventoryItem) {
          removeItem(next.inventory, inventoryItem.uid, 1);
        } else if (depotItem) {
          const index = next.depot.findIndex((item) => item.uid === depotItem.uid);
          if (index >= 0) {
            if ((depotItem.quantity ?? 1) > 1) depotItem.quantity -= 1;
            else next.depot.splice(index, 1);
          }
        } else {
          return { success: false, error: "Este cosm\xE9tico ainda n\xE3o est\xE1 na mochila ou no dep\xF3sito." };
        }
        next.unlockedCosmetics.push(templateId);
      }
      next.cosmeticLoadout ??= {};
      next.cosmeticLoadout[definition.slot] = templateId;
      set({ character: next });
      get().save();
      notify(`${template.name} foi ativado como skin permanente. Ele n\xE3o ocupa mais espa\xE7o na mochila.`);
      return { success: true };
    },
    unequipCosmetic: (slot) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      if (!COSMETIC_SLOTS.some((entry) => entry.key === slot)) return { success: false, error: "Espa\xE7o cosm\xE9tico inv\xE1lido." };
      const next = structuredClone(character);
      next.cosmeticLoadout = { ...next.cosmeticLoadout ?? {} };
      delete next.cosmeticLoadout[slot];
      set({ character: next });
      get().save();
      return { success: true };
    },
    loadFromSave: () => {
      const save = loadGame();
      if (!save) return false;
      const timeAway = (runtimeNow() - save.character.lastTick) / 1e3;
      let report = null;
      if (timeAway > 60 && !isGuided(save.character)) {
        report = { timeAwaySeconds: timeAway, xpGained: Math.floor(timeAway * 10), goldGained: Math.floor(timeAway * 2), itemsDropped: Math.floor(timeAway / 60), levelsGained: 0 };
      }
      const races = save.races || [];
      trackRaceDiscovery(save.character, races);
      set({ character: save.character, races, currentZoneId: save.character.currentZoneId ?? "BOSQUE_LYSS", offlineReport: report });
      get().save();
      return true;
    },
    refreshCompendium: () => {
      const { character, races } = get();
      if (!character) return;
      trackRaceDiscovery(character, races);
      set({ character: { ...character } });
      get().save();
    },
    clearOfflineReport: () => set({ offlineReport: null }),
    clearDeathReport: () => {
      const { character } = get();
      if (character) {
        character.hp = 1;
        set({ character: { ...character }, deathReport: null });
        get().save();
      }
    },
    healFull: () => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.hp = newChar.hpMax;
      newChar.mp = newChar.mpMax;
      set({ character: newChar, healingUntil: null });
      get().save();
    },
    startHealing: () => {
      const { character, healingUntil } = get();
      if (!character || healingUntil) return;
      set({ healingUntil: runtimeNow() + 15e3 });
    },
    cancelHealing: () => {
      set({ healingUntil: null });
    },
    save: () => {
      const { character, races } = get();
      if (!character) return;
      const valid = ownedCosmeticLoadout(character);
      const next = character.cosmeticLoadout && JSON.stringify(valid) !== JSON.stringify(character.cosmeticLoadout) ? { ...character, cosmeticLoadout: valid } : character;
      if (next !== character) set({ character: next });
      if (runtime.persist) runtime.persist(next, races);
      else saveGame(next, races);
    },
    spendStatPoint: (stat) => {
      const { character } = get();
      if (!character || (character.statPoints ?? 0) < 1) return false;
      const updated = {
        ...character,
        statPoints: character.statPoints - 1,
        skills: { ...character.skills, [stat]: character.skills[stat] + 1 }
      };
      recalcStats(updated);
      set({ character: updated });
      get().save();
      return true;
    },
    tick: () => {
      const { character, currentZoneId, isTickRunning, isTraining } = get();
      if (!character || !isTickRunning && !isTraining) return;
      normalizeOnlineChest(character, runtimeNow());
      if (isTraining) {
        const newCharacter = JSON.parse(JSON.stringify(character));
        const skill = newCharacter.trainingSkill;
        if (skill) {
          const beforeSeconds = Number(newCharacter.trainingSeconds?.[skill] ?? 0);
          const trainingLog = applyTraining(newCharacter, runtimeNow());
          newCharacter.onlineChestSeconds = (newCharacter.onlineChestSeconds ?? 0) + 3;
          trackQuestAction(newCharacter, "TRAIN", Number(newCharacter.trainingSeconds?.[skill] ?? 0) - beforeSeconds);
          recalcStats(newCharacter);
          const result2 = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: trainingLog, enemyHp: 0, enemyMaxHp: 0, skillLevelUp: trainingLog.length ? trainingLog.join(" \xB7 ") : void 0 };
          set({ character: newCharacter, lastTickResult: result2 });
          get().save();
          if (isGuided(newCharacter) && newCharacter.quests.active.TUT_TRAIN && checkQuestCompletion(newCharacter, "TUT_TRAIN")) get().stopTraining();
        }
        return;
      }
      const activeZoneId = character.currentZoneId || currentZoneId;
      const zone = ZONES[activeZoneId];
      if (!zone || character.level < zone.minLevel) {
        get().stopHunting();
        return;
      }
      if (isGuided(character)) character.lastTick = runtimeNow() - 3e3;
      const result = processTick(character, zone, !isGuided(character) && runtimeNow() - character.lastTick > 15e3);
      recordHuntMetrics(character, zone.id, result);
      if (result.death && result.deathData) {
        get().stopHunting();
        set({ deathReport: result.deathData, lastTickResult: result, character: { ...character } });
        get().save();
        return;
      }
      updateQuestProgress(character, result);
      character.onlineChestSeconds = (character.onlineChestSeconds ?? 0) + 3;
      recalcStats(character);
      set({ character: { ...character }, currentZoneId: activeZoneId, lastTickResult: result });
      get().save();
      if (result.staminaDepleted) get().stopHunting();
    },
    startHunting: (zoneId) => {
      const { character, healingUntil } = get();
      if (!character) return;
      const repairedJourney = repairLegacyJourney(character);
      if (healingUntil) return warn("Voc\xEA est\xE1 meditando! Termine antes de ca\xE7ar.");
      if (character.hp <= 0) return warn("Voc\xEA precisa se curar na Casa antes de ca\xE7ar!");
      if (!Number.isFinite(character.staminaOnline)) character.staminaOnline = 120;
      if ((character.staminaOnline ?? 120) <= 0) return warn("Sua stamina online acabou. Continue sua jornada offline para recuperar essa reserva.");
      const zone = ZONES[zoneId];
      if (!zone || !canEnterZone(character, zoneId)) return warn("Abra a travessia com a miss\xE3o e o NPC em Jornadas.");
      if (!canTutorialHunt(character)) return warn("Abra a miss\xE3o da inicia\xE7\xE3o e siga a pr\xF3xima etapa antes de ca\xE7ar.");
      if (character.level < zone.minLevel) return;
      if (tickInterval) clearInterval(tickInterval);
      character.currentZoneId = zoneId;
      character.trainingSkill = null;
      if (!character.activeEnemyId || !zone.enemies.find((e) => e.id === character.activeEnemyId)) {
        character.activeEnemyId = zone.enemies[0].id;
      }
      const selected = zone.enemies.find((e) => e.id === character.activeEnemyId) ?? zone.enemies[0];
      character.huntWaveProgress ??= {};
      const stage = selected.isBoss ? 4 : getWaveStage(character.huntWaveProgress, zone.id, selected.id);
      const encounter = selected.isBoss ? selected : getWaveEncounter(zone, selected, stage);
      character.fightWaveKey = selected.isBoss ? void 0 : getWaveKey(zone.id, selected.id);
      character.fightWaveStage = selected.isBoss ? void 0 : stage;
      character.fightEnemyId = void 0;
      character.enemyHp = encounter.hp * encounter.difficulty;
      character.enemyHpId = encounter.id;
      set({ isTickRunning: true, isTraining: false, currentZoneId: zoneId, character: { ...character } });
      if (repairedJourney) get().save();
      if (!runtime.server) {
        get().tick();
        if (get().isTickRunning || get().isTraining) tickInterval = setInterval(() => get().tick(), 3e3);
      }
    },
    startTraining: (skill) => {
      const { character, healingUntil } = get();
      if (!character) return;
      if (isGuided(character) && !character.quests.active.TUT_TRAIN) return warn("O treino ser\xE1 apresentado na etapa Disciplina antes da for\xE7a.");
      if (healingUntil) return warn("Termine sua medita\xE7\xE3o primeiro!");
      if (tickInterval) clearInterval(tickInterval);
      character.trainingSkill = skill;
      character.trainingLastTick = runtimeNow();
      character.lastTick = runtimeNow();
      set({ isTickRunning: false, isTraining: true, character: { ...character } });
      if (!runtime.server) {
        get().tick();
        tickInterval = setInterval(() => get().tick(), 3e3);
      }
    },
    armSpecialCombo: (power = 1.5) => {
      const { character, isTickRunning } = get();
      if (!character || !isTickRunning) return { success: false, error: "O combo s\xF3 pode ser armado durante a ca\xE7a." };
      const now = runtimeNow();
      if ((character.comboCooldownUntil ?? 0) > now) return { success: false, error: `Aguarde ${Math.ceil((character.comboCooldownUntil - now) / 1e3)}s para recarregar.` };
      const updated = JSON.parse(JSON.stringify(character));
      updated.comboReadyUntil = now + 12e3;
      updated.comboPower = power;
      set({ character: updated });
      get().save();
      if (!runtime.server) queueMicrotask(() => {
        if (get().isTickRunning) get().tick();
      });
      return { success: true };
    },
    stopHunting: () => {
      if (tickInterval) clearInterval(tickInterval);
      tickInterval = null;
      set({ isTickRunning: false });
    },
    stopTraining: () => {
      if (tickInterval) clearInterval(tickInterval);
      tickInterval = null;
      const { character } = get();
      if (character) {
        character.trainingSkill = null;
        character.trainingLastTick = void 0;
        character.lastTick = runtimeNow();
        set({ isTraining: false, character: { ...character } });
        get().save();
      }
    },
    setActiveEnemy: (enemyId) => {
      const { character, currentZoneId } = get();
      if (!character) return;
      const zone = ZONES[currentZoneId];
      const enemy = zone.enemies.find((e) => e.id === enemyId);
      if (!enemy || character.level < (enemy.minLevel ?? 1)) return;
      character.activeEnemyId = enemyId;
      character.huntWaveProgress ??= {};
      const stage = enemy.isBoss ? 4 : getWaveStage(character.huntWaveProgress, zone.id, enemy.id);
      const encounter = enemy.isBoss ? enemy : getWaveEncounter(zone, enemy, stage);
      character.fightWaveKey = enemy.isBoss ? void 0 : getWaveKey(zone.id, enemy.id);
      character.fightWaveStage = enemy.isBoss ? void 0 : stage;
      character.fightEnemyId = void 0;
      character.enemyHp = encounter.hp * encounter.difficulty;
      character.enemyHpId = encounter.id;
      set({ character: { ...character } });
      get().save();
    },
    setCurrentZone: (zoneId) => {
      if (!ZONES[zoneId] || get().character && !canEnterZone(get().character, zoneId)) return;
      set({ currentZoneId: zoneId });
      const { character } = get();
      if (character) {
        character.currentZoneId = zoneId;
        character.activeEnemyId = ZONES[zoneId].enemies[0]?.id;
        character.enemyHp = void 0;
        character.enemyHpId = void 0;
        character.fightEnemyId = void 0;
        character.fightWaveKey = void 0;
        character.fightWaveStage = void 0;
        set({ character: { ...character } });
        get().save();
      }
    },
    equip: (uid, force = false) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const result = equipItem(newCharacter, uid, force);
      if (result.success) {
        set({ character: newCharacter });
        get().save();
      }
      return result;
    },
    unequip: (slot) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const result = unequipItem(newCharacter, slot);
      if (result.success) {
        set({ character: newCharacter });
        get().save();
      }
      return result;
    },
    synthesize: (a, s, p) => {
      const { character, races } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const namedRace = findNamedRace(a, s, p);
      const raceId = namedRace ? namedRace.id : generateRaceId(a, s, p);
      const alreadyExists = races.find((r) => r.id === raceId);
      if (alreadyExists) {
        return { success: false, error: `Voc\xEA j\xE1 descobriu "${alreadyExists.name}"! Escolha uma combina\xE7\xE3o diferente.` };
      }
      const newCharacter = JSON.parse(JSON.stringify(character));
      const hasA = newCharacter.inventory.items.find((i) => i.componentType === "ATAQUE" && i.templateId === a);
      const hasS = newCharacter.inventory.items.find((i) => i.componentType === "SUPORTE" && i.templateId === s);
      const hasP = newCharacter.inventory.items.find((i) => i.componentType === "PASSIVA" && i.templateId === p);
      if (!hasA || !hasS || !hasP) return { success: false, error: "Faltam componentes no invent\xE1rio." };
      removeItem(newCharacter.inventory, hasA.uid, 1);
      removeItem(newCharacter.inventory, hasS.uid, 1);
      removeItem(newCharacter.inventory, hasP.uid, 1);
      let newRace;
      if (namedRace) {
        newRace = { ...namedRace };
      } else {
        newRace = {
          id: raceId,
          name: generateRaceName(a, s, p),
          tier: "COMUM",
          ataqueId: a,
          suporteId: s,
          passivaId: p,
          skills: { ataque: "Ataque Sintetizado", suporte: "Suporte Sintetizado", passiva: "Passiva Sintetizada" },
          bonus: generateRaceBonus(a, s, p)
        };
      }
      const newRaces = [...races, newRace];
      trackRaceDiscovery(newCharacter, newRaces);
      trackQuestAction(newCharacter, "SYNTHESIZE");
      set({ character: newCharacter, races: newRaces });
      get().save();
      return { success: true };
    },
    equipRace: (race) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.raceId = race.id;
      newCharacter.activeRace = race;
      trackQuestAction(newCharacter, "EQUIP_RACE");
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    unequipRace: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.raceId = void 0;
      newCharacter.activeRace = void 0;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    equipDivineBeast: (id) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      if (!DIVINE_BEASTS[id] || !(character.divineBeasts ?? []).some((beast) => beast.id === id)) {
        return { success: false, error: "Essa Besta Divina ainda n\xE3o foi vinculada." };
      }
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.activeDivineBeastId = id;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
      return { success: true };
    },
    hatchEgg: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const egg = character.inventory.items.find((item) => item.uid === uid);
      if (!egg || !DIVINE_BEAST_EGG_TEMPLATES[egg.templateId]) return { success: false, error: "Escolha um Ovo de Besta Divina." };
      const now = runtimeNow();
      const savedIncubator = character.divineBeastIncubator;
      const incubator = savedIncubator && character.inventory.items.some((item) => item.uid === savedIncubator.eggUid) ? savedIncubator : void 0;
      if (savedIncubator && !incubator) {
        const repaired = structuredClone(character);
        repaired.divineBeastIncubator = void 0;
        set({ character: repaired });
        get().save();
      }
      if (!incubator) {
        const next2 = structuredClone(character);
        next2.divineBeastIncubator = { eggUid: uid, tier: egg.tier, startedAt: now, completesAt: now + eggIncubationMs(egg.tier) };
        set({ character: next2 });
        get().save();
        notify(`Incuba\xE7\xE3o iniciada. O ovo estar\xE1 pronto em ${Math.ceil(eggIncubationMs(egg.tier) / 1e3)}s.`);
        return { success: true, started: true, readyAt: next2.divineBeastIncubator.completesAt };
      }
      if (incubator.eggUid !== uid) return { success: false, error: "J\xE1 existe um ovo na incubadora. Aguarde a eclos\xE3o antes de iniciar outro." };
      if (now < incubator.completesAt) return { success: false, error: `A incuba\xE7\xE3o termina em ${Math.ceil((incubator.completesAt - now) / 1e3)}s.`, remainingMs: incubator.completesAt - now };
      const rarity = rollEggRarity(egg.tier);
      const ids = Object.keys(DIVINE_BEASTS);
      const beastId = ids[Math.floor(Math.random() * ids.length)];
      const next = structuredClone(character);
      removeItem(next.inventory, uid, 1);
      next.divineBeastIncubator = void 0;
      next.divineBeasts = [...next.divineBeasts ?? [], { id: beastId, instanceId: generateId(), rarity, obtainedAt: runtimeNow() }];
      set({ character: next });
      get().save();
      notify(`O ovo eclodiu: ${DIVINE_BEASTS[beastId].name} \xB7 ${rarity}!`);
      return { success: true, beastId, rarity };
    },
    combineBeast: (id) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const copies = (character.divineBeasts ?? []).filter((beast) => beast.id === id);
      const ration = character.inventory.items.find((item) => item.templateId === "RACAO_DOMADOR");
      if (copies.length < 5) return { success: false, error: "S\xE3o necess\xE1rias 4 c\xF3pias excedentes no cativeiro; o melhor exemplar \xE9 preservado." };
      if (!ration) return { success: false, error: "\xC9 necess\xE1ria uma Ra\xE7\xE3o Especial do Domador." };
      const rank = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
      const next = structuredClone(character);
      const indexed = (next.divineBeasts ?? []).map((beast, index) => ({ beast, index })).filter((entry) => entry.beast.id === id);
      indexed.sort((a, b) => rank.indexOf(b.beast.rarity ?? "COMUM") - rank.indexOf(a.beast.rarity ?? "COMUM") || b.beast.obtainedAt - a.beast.obtainedAt);
      const captive = indexed.slice(1);
      const current = Math.max(...captive.slice(0, 4).map((entry) => rank.indexOf(entry.beast.rarity ?? "COMUM")));
      if (current >= rank.length - 1) return { success: false, error: "Esta linhagem j\xE1 est\xE1 no \xE1pice lend\xE1rio." };
      const consume = new Set(captive.slice(0, 4).map((entry) => entry.index));
      next.divineBeasts = (next.divineBeasts ?? []).filter((_, index) => !consume.has(index));
      removeItem(next.inventory, ration.uid, 1);
      const rarity = rank[current + 1];
      next.divineBeasts.push({ id, instanceId: generateId(), rarity, obtainedAt: runtimeNow() });
      set({ character: next });
      get().save();
      notify(`A linhagem foi aprimorada para ${rarity}!`);
      return { success: true, rarity };
    },
    sellDivineBeast: (id, instanceId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const copies = (character.divineBeasts ?? []).filter((beast) => beast.id === id);
      if (copies.length < 2) return { success: false, error: "O melhor exemplar precisa permanecer na cole\xE7\xE3o. Encontre outra c\xF3pia para vender." };
      const rank = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
      const next = structuredClone(character);
      const indexed = (next.divineBeasts ?? []).map((beast, index) => ({ beast, index })).filter((entry) => entry.beast.id === id);
      indexed.sort((a, b) => rank.indexOf(a.beast.rarity ?? "COMUM") - rank.indexOf(b.beast.rarity ?? "COMUM") || a.beast.obtainedAt - b.beast.obtainedAt);
      const candidate = instanceId ? indexed.find((entry) => entry.beast.instanceId === instanceId) : indexed[0];
      if (!candidate) return { success: false, error: "Pet n\xE3o encontrado no cativeiro." };
      const gold = divineBeastSellValue(candidate.beast.rarity);
      next.divineBeasts = (next.divineBeasts ?? []).filter((_, index) => index !== candidate.index);
      next.gold += gold;
      set({ character: next });
      get().save();
      notify(`Pet enviado ao Mercado do Domador por ${gold.toLocaleString("pt-BR")} gold.`);
      return { success: true, gold };
    },
    feedDivineBeast: (id, foodUid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Nenhum personagem ativo." };
      if (character.activeDivineBeastId !== id) return { success: false, error: "Ative esta Besta antes de aliment\xE1-la." };
      const item = character.inventory.items.find((entry) => entry.uid === foodUid);
      if (!item) return { success: false, error: "Alimento n\xE3o encontrado na mochila." };
      const food = {
        CENOURA_PET: { minutes: 5, mood: 2 },
        FRUTA_MEL: { minutes: 10, mood: 5 },
        MELANCIA_LUNAR: { minutes: 15, mood: 8 },
        RACAO_DOMADOR: { minutes: 30, mood: 12 },
        CALDO_MARCA_DAGUA: { minutes: 20, mood: 10 }
      }[item.templateId];
      if (!food) return { success: false, error: "Este item n\xE3o \xE9 alimento para Bestas Divinas." };
      const now = runtimeNow();
      const previous = character.divineBeastNeeds?.[id] ?? { nutrition: 0, mood: 70, updatedAt: now };
      const elapsedMinutes = Math.max(0, (now - previous.updatedAt) / 6e4);
      const needs = {
        nutrition: Math.max(0, Math.min(100, previous.nutrition - elapsedMinutes * 0.5 + food.minutes * 2)),
        mood: Math.max(0, Math.min(100, previous.mood - elapsedMinutes * 0.15 + food.mood)),
        updatedAt: now
      };
      if ((item.quantity ?? 1) > 1) item.quantity -= 1;
      else character.inventory.items = character.inventory.items.filter((entry) => entry.uid !== foodUid);
      character.divineBeastNeeds = { ...character.divineBeastNeeds ?? {}, [id]: needs };
      set({ character: { ...character } });
      get().save();
      return { success: true };
    },
    unequipDivineBeast: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.activeDivineBeastId = void 0;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    sellItem: (uid, qty = 1) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = sellItem(newCharacter, uid, qty);
      if (!res.success) return;
      trackQuestAction(newCharacter, "SELL", res.count);
      set({ character: newCharacter });
      get().save();
    },
    sellSelected: (uids) => {
      const { character } = get();
      if (!character || !uids.length) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = sellSelectedItems(newCharacter, uids);
      if (!res.count) return;
      trackQuestAction(newCharacter, "SELL", res.count);
      set({ character: newCharacter });
      get().save();
      notify(`Vendeu ${res.count} itens por ${res.gold.toLocaleString("pt-BR")} gold.`);
    },
    discardItem: (uid, qty = 1) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const item = newCharacter.inventory.items.find((entry) => entry.uid === uid);
      if (!item) return { success: false, error: "Item n\xE3o encontrado na mochila." };
      if (!Number.isInteger(qty) || qty < 1 || qty > 999) return { success: false, error: "Quantidade inv\xE1lida." };
      removeItem(newCharacter.inventory, uid, Math.min(qty, item.quantity));
      set({ character: newCharacter });
      get().save();
      return { success: true };
    },
    plantFarmSeed: (plotId, seedId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const seed = farmSeed(seedId);
      if (!seed) return { success: false, error: "Semente inv\xE1lida." };
      const next = JSON.parse(JSON.stringify(character));
      next.farm ??= { plots: [], unlockedPlots: 1, lastActionAt: runtimeNow(), skills: { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 } };
      next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
      const plot = next.farm.plots.find((entry) => entry.id === plotId);
      if (!plot || next.farm.plots.indexOf(plot) >= next.farm.unlockedPlots) return { success: false, error: "Canteiro bloqueado." };
      if (plot.seedId) return { success: false, error: "Este canteiro j\xE1 est\xE1 plantado." };
      if (next.gold < seed.cost) return { success: false, error: "Gold insuficiente para comprar esta semente." };
      const fertility = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX)));
      const skill = Number(next.farm.skills.planting ?? 0);
      const speedBonus = Math.min(0.25, skill * 0.01);
      const fertilityPenalty = (FARM_FERTILITY_MAX - fertility) / 200;
      const growMs = Math.max(3e4, Math.round(seed.growMs * (1 - speedBonus + fertilityPenalty)));
      next.gold -= seed.cost;
      plot.fertility = fertility;
      plot.seedId = seed.id;
      plot.plantedAt = runtimeNow();
      plot.readyAt = runtimeNow() + growMs;
      plot.wateredAt = runtimeNow();
      plot.waterCount = 0;
      next.farm.skills.planting += 1;
      next.farm.lastActionAt = runtimeNow();
      set({ character: next });
      get().save();
      return { success: true };
    },
    waterFarmPlot: (plotId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = JSON.parse(JSON.stringify(character));
      const plot = next.farm?.plots?.find((entry) => entry.id === plotId);
      if (!plot?.seedId || !plot.readyAt) return { success: false, error: "Este canteiro n\xE3o possui uma planta\xE7\xE3o ativa." };
      const now = runtimeNow();
      if (now >= plot.readyAt) return { success: false, error: "A planta\xE7\xE3o j\xE1 est\xE1 pronta para colher." };
      const waterCount = Number(plot.waterCount ?? 0);
      if (waterCount >= 3) return { success: false, error: "Esta planta\xE7\xE3o j\xE1 recebeu toda a irriga\xE7\xE3o poss\xEDvel." };
      if (plot.wateredAt && now - plot.wateredAt < 6e4) return { success: false, error: `A terra ainda est\xE1 \xFAmida. Aguarde ${Math.ceil((6e4 - (now - plot.wateredAt)) / 1e3)}s.` };
      const remaining = Math.max(3e4, plot.readyAt - now);
      const reduction = Math.max(5e3, Math.round(remaining * 0.08));
      plot.readyAt = Math.max(now + 3e4, plot.readyAt - reduction);
      plot.wateredAt = now;
      plot.waterCount = waterCount + 1;
      next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
      next.farm.skills.irrigation = Number(next.farm.skills.irrigation ?? 0) + 1;
      next.farm.lastActionAt = now;
      set({ character: next });
      get().save();
      return { success: true, secondsReduced: Math.round(reduction / 1e3) };
    },
    fertilizeFarmPlot: (plotId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = JSON.parse(JSON.stringify(character));
      const plot = next.farm?.plots?.find((entry) => entry.id === plotId);
      if (!plot) return { success: false, error: "Canteiro n\xE3o encontrado." };
      if (plot.seedId) return { success: false, error: "Adube o canteiro entre colheitas, antes de plantar novamente." };
      const current = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX)));
      if (current >= FARM_FERTILITY_MAX) return { success: false, error: "Este canteiro j\xE1 est\xE1 com fertilidade m\xE1xima." };
      const compost = next.inventory.items.find((item) => item.templateId === "COMPOSTO_LYSS");
      if (!compost) return { success: false, error: "\xC9 necess\xE1rio um Composto F\xE9rtil de Lyss." };
      removeItem(next.inventory, compost.uid, 1);
      plot.fertility = Math.min(FARM_FERTILITY_MAX, current + FARM_FERTILITY_COMPOST_GAIN);
      next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
      next.farm.skills.fertility = Number(next.farm.skills.fertility ?? 0) + 1;
      next.farm.lastActionAt = runtimeNow();
      set({ character: next });
      get().save();
      return { success: true, fertility: plot.fertility };
    },
    harvestFarmPlot: (plotId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = JSON.parse(JSON.stringify(character));
      const plot = next.farm?.plots?.find((entry) => entry.id === plotId);
      const seed = plot?.seedId ? farmSeed(plot.seedId) : void 0;
      if (!plot || !seed) return { success: false, error: "N\xE3o h\xE1 cultivo neste canteiro." };
      if (!plot.readyAt || runtimeNow() < plot.readyAt) return { success: false, error: "A planta\xE7\xE3o ainda est\xE1 crescendo." };
      next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
      const fertility = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX)));
      const quantity = farmYield(seed, fertility, Number(next.farm.skills.harvesting ?? 0));
      addItem(next.inventory, quantity);
      plot.fertility = Math.max(FARM_FERTILITY_MIN, fertility - FARM_FERTILITY_LOSS_PER_HARVEST);
      plot.seedId = void 0;
      plot.plantedAt = void 0;
      plot.readyAt = void 0;
      plot.wateredAt = void 0;
      plot.waterCount = void 0;
      next.farm.skills.harvesting += 1;
      next.farm.lastActionAt = runtimeNow();
      set({ character: next });
      get().save();
      return { success: true, quantity: quantity.quantity };
    },
    unlockFarmPlot: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = JSON.parse(JSON.stringify(character));
      next.farm ??= { plots: [], unlockedPlots: 1, lastActionAt: runtimeNow() };
      const cost = farmExpansionCost(next.farm.unlockedPlots);
      if (!cost) return { success: false, error: "Todos os terrenos j\xE1 foram liberados." };
      if (cost.kind === "gold") {
        if (next.gold < cost.amount) return { success: false, error: `Voc\xEA precisa de ${cost.label}.` };
        next.gold -= cost.amount;
      } else {
        if ((next.mythreonCoins ?? 0) < cost.amount) return { success: false, error: `Voc\xEA precisa de ${cost.label}.` };
        next.mythreonCoins = (next.mythreonCoins ?? 0) - cost.amount;
      }
      next.farm.unlockedPlots += 1;
      next.farm.plots.push({ id: `plot-${next.farm.unlockedPlots}`, fertility: FARM_FERTILITY_MAX });
      set({ character: next });
      get().save();
      return { success: true };
    },
    cookFarmRecipe: (recipeId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const recipe = farmRecipe(recipeId);
      if (!recipe) return { success: false, error: "Receita inv\xE1lida." };
      const next = JSON.parse(JSON.stringify(character));
      for (const ingredient of recipe.ingredients) {
        const total = next.inventory.items.filter((item) => item.templateId === ingredient.templateId).reduce((sum, item) => sum + item.quantity, 0);
        if (total < ingredient.quantity) return { success: false, error: `Faltam materiais para ${recipe.name}.` };
      }
      for (const ingredient of recipe.ingredients) {
        let remaining = ingredient.quantity;
        for (const item of [...next.inventory.items]) {
          if (item.templateId !== ingredient.templateId || remaining <= 0) continue;
          const take = Math.min(remaining, item.quantity);
          removeItem(next.inventory, item.uid, take);
          remaining -= take;
        }
      }
      addItem(next.inventory, farmRecipeOutput(recipe));
      set({ character: next });
      get().save();
      return { success: true, quantity: recipe.outputQuantity };
    },
    equipProfessionTool: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const next = structuredClone(character);
      const item = next.inventory.items.find((entry) => entry.uid === uid);
      if (!item || item.category !== "FERRAMENTA" || !item.profession) return { success: false, error: "Escolha uma ferramenta de profiss\xE3o v\xE1lida." };
      const skill = item.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
      if (skill < Number(item.requiredSkill ?? 0)) return { success: false, error: `Requer ${item.profession === "MINERACAO" ? "minera\xE7\xE3o" : "pesca"} ${item.requiredSkill ?? 0}.` };
      removeItem(next.inventory, uid, 1);
      const field = item.profession === "MINERACAO" ? "equippedMiningTool" : "equippedFishingRod";
      const previous = next[field];
      if (previous) addItem(next.inventory, previous);
      next[field] = item;
      set({ character: next });
      get().save();
      return { success: true };
    },
    buyProfessionTool: (templateId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const offer = PROFESSION_TOOL_SHOP.find((entry) => entry.templateId === templateId);
      const template = PROFESSION_TOOL_TEMPLATES[templateId];
      if (!offer || !template) return { success: false, error: "Ferramenta indispon\xEDvel." };
      const next = structuredClone(character);
      if ([...next.inventory.items, ...next.depot, next.equippedMiningTool, next.equippedFishingRod].some((item2) => item2?.templateId === templateId)) return { success: false, error: "Voc\xEA j\xE1 possui esta ferramenta na mochila, no dep\xF3sito ou equipada." };
      const skill = offer.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
      if (skill < offer.requiredSkill) return { success: false, error: `Requer ${offer.profession === "MINERACAO" ? "minera\xE7\xE3o" : "pesca"} ${offer.requiredSkill}.` };
      if (next.gold < offer.gold) return { success: false, error: `Voc\xEA precisa de ${offer.gold.toLocaleString("pt-BR")} gold.` };
      const item = createItem({ ...template, uid: generateId() });
      if (!addItem(next.inventory, item)) return { success: false, error: "Bolsa cheia. Libere espa\xE7o antes de comprar." };
      next.gold -= offer.gold;
      set({ character: next });
      get().save();
      notify(`${template.name} entregue. Equipe-a para liberar o pr\xF3ximo veio ou ponto.`);
      return { success: true, templateId };
    },
    refineProfessionRecipe: (recipeId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const recipe = PROFESSION_RECIPES.find((entry) => entry.id === recipeId);
      if (!recipe) return { success: false, error: "Receita de profiss\xE3o inv\xE1lida." };
      const next = structuredClone(character);
      const skill = recipe.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
      if (skill < recipe.requiredSkill) return { success: false, error: `Requer ${recipe.profession === "MINERACAO" ? "minera\xE7\xE3o" : "pesca"} ${recipe.requiredSkill}.` };
      for (const ingredient of recipe.ingredients) if (countByTemplate(next.inventory, ingredient.templateId) < ingredient.quantity) return { success: false, error: `Faltam materiais para ${recipe.name}.` };
      for (const ingredient of recipe.ingredients) {
        let remaining = ingredient.quantity;
        for (const item of [...next.inventory.items]) {
          if (item.templateId !== ingredient.templateId || remaining <= 0) continue;
          const take = Math.min(remaining, item.quantity);
          removeItem(next.inventory, item.uid, take);
          remaining -= take;
        }
      }
      const output = makeMaterial(recipe.outputTemplateId);
      if (!output) return { success: false, error: "Produto de refino indispon\xEDvel." };
      output.quantity = recipe.outputQuantity;
      if (!addItem(next.inventory, output)) return { success: false, error: "Bolsa cheia. Libere espa\xE7o antes de refinar." };
      set({ character: next });
      get().save();
      notify(`${recipe.name} conclu\xEDdo: ${recipe.outputQuantity} unidade(s).`);
      return { success: true, quantity: recipe.outputQuantity };
    },
    mineResource: (nodeId, precision = 1) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const node = MINING_NODES.find((entry) => entry.id === nodeId);
      if (!node) return { success: false, error: "Veio de minera\xE7\xE3o inv\xE1lido." };
      if (!canEnterZone(character, node.zoneId)) return { success: false, error: "Conclua a travessia deste bioma em Jornadas para minerar aqui." };
      const next = JSON.parse(JSON.stringify(character));
      next.professions ??= { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
      const skill = Number(next.professions.mining ?? 0);
      if (skill < node.requiredSkill) return { success: false, error: `Minera\xE7\xE3o ${node.requiredSkill} necess\xE1ria.` };
      const tool = next.equippedMiningTool;
      if (!tool || Number(tool.tier ?? 0) < node.tier) return { success: false, error: `Equipe uma picareta T${node.tier} ou superior.` };
      const now = runtimeNow();
      const cooldown = professionCooldown(skill);
      if (now - Number(next.professions.lastMiningAt ?? 0) < cooldown) return { success: false, error: `A picareta precisa descansar ${Math.ceil((cooldown - (now - Number(next.professions.lastMiningAt ?? 0))) / 1e3)}s.` };
      const quality = precision === 1.5 ? 1.25 : precision === 0.5 ? 0.85 : 1;
      const quantity = Math.max(1, Math.floor((1 + Math.floor(skill / 30)) * quality));
      const template = ALL_ITEM_TEMPLATES[node.dropTemplateId];
      const drop = createItem({ ...template ?? { templateId: node.dropTemplateId, name: node.dropName, category: "MATERIAL", tier: node.tier, rarity: node.tier >= 4 ? "EPICO" : node.tier >= 3 ? "RARO" : "COMUM", icon: node.dropIcon, stackable: true, maxStack: 999 }, uid: generateId(), quantity, stackable: true, maxStack: 999 });
      if (!addItem(next.inventory, drop)) return { success: false, error: "Bolsa cheia. Libere espa\xE7o para guardar o min\xE9rio." };
      next.professions.mining = skill + (precision === 1.5 ? 2 : 1);
      next.professions.lastMiningAt = now;
      set({ character: next });
      get().save();
      return { success: true, quantity };
    },
    fishSpot: (spotId, precision = 1, baitId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Personagem indispon\xEDvel." };
      const spot = FISHING_SPOTS.find((entry) => entry.id === spotId);
      if (!spot) return { success: false, error: "Ponto de pesca inv\xE1lido." };
      if (!canEnterZone(character, spot.zoneId)) return { success: false, error: "Conclua a travessia deste bioma em Jornadas para pescar aqui." };
      const next = JSON.parse(JSON.stringify(character));
      next.professions ??= { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
      const skill = Number(next.professions.fishing ?? 0);
      if (skill < spot.requiredSkill) return { success: false, error: `Pesca ${spot.requiredSkill} necess\xE1ria.` };
      const rod = next.equippedFishingRod;
      if (!rod || Number(rod.tier ?? 0) < spot.rodTier) return { success: false, error: `Equipe uma vara T${spot.rodTier} ou superior.` };
      if (baitId !== void 0 && baitId !== FISHING_BAIT.templateId) return { success: false, error: "Isca inv\xE1lida." };
      if (baitId && countByTemplate(next.inventory, baitId) < FISHING_BAIT.quantity) return { success: false, error: "A isca escolhida n\xE3o est\xE1 mais na mochila." };
      const now = runtimeNow();
      const cooldown = professionCooldown(skill);
      if (now - Number(next.professions.lastFishingAt ?? 0) < cooldown) return { success: false, error: `A linha ainda est\xE1 na \xE1gua. Aguarde ${Math.ceil((cooldown - (now - Number(next.professions.lastFishingAt ?? 0))) / 1e3)}s.` };
      const quality = precision === 1.5 ? 1.25 : precision === 0.5 ? 0.85 : 1;
      const quantity = Math.max(1, Math.floor((1 + Math.floor(skill / 35)) * quality));
      const template = ALL_ITEM_TEMPLATES[spot.dropTemplateId];
      const drop = createItem({ ...template ?? { templateId: spot.dropTemplateId, name: spot.dropName, category: "MATERIAL", tier: spot.rodTier, rarity: spot.rodTier >= 4 ? "EPICO" : spot.rodTier >= 3 ? "RARO" : "COMUM", icon: spot.dropIcon, stackable: true, maxStack: 999 }, uid: generateId(), quantity, stackable: true, maxStack: 999 });
      if (baitId) {
        const baitStack = next.inventory.items.find((item) => item.templateId === baitId && item.quantity > 0);
        removeItem(next.inventory, baitStack.uid, FISHING_BAIT.quantity);
        drop.quantity += FISHING_BAIT.bonusFish;
      }
      if (!addItem(next.inventory, drop)) return { success: false, error: "Bolsa cheia. Libere espa\xE7o para guardar o peixe." };
      next.professions.fishing = skill + (precision === 1.5 ? 2 : 1);
      next.professions.lastFishingAt = now;
      set({ character: next });
      get().save();
      return { success: true, quantity: drop.quantity, ...baitId ? { baitConsumed: baitId, bonusQuantity: FISHING_BAIT.bonusFish } : {} };
    },
    salvageAll: (maxRarity) => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = salvageAllEquipment(newChar, maxRarity);
      newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
      updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
      set({ character: newChar });
      get().save();
      notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
    },
    salvageSelected: (uids) => {
      const { character } = get();
      if (!character || uids.length === 0) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = salvageSelectedEquipment(newChar, uids);
      if (!res.items) return;
      newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
      updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
      set({ character: newChar });
      get().save();
      notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
    },
    updateSettings: (settings) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      if (settings.autoPotion !== void 0) newCharacter.autoPotion = settings.autoPotion;
      const premiumAutomation = Boolean(newCharacter.premium);
      if (settings.autoSell !== void 0 && premiumAutomation) newCharacter.autoSell = settings.autoSell;
      if (settings.autoSellTemplateIds !== void 0 && !premiumAutomation) notify("Auto-venda por raridade e por item \xE9 um benef\xEDcio do Premium Account.");
      if (settings.autoSalvage !== void 0) newCharacter.autoSalvage = settings.autoSalvage;
      if (settings.autoSellTemplateIds !== void 0 && premiumAutomation) {
        newCharacter.autoSellTemplateIds = settings.autoSellTemplateIds;
        newCharacter.autoSalvageTemplateIds = (newCharacter.autoSalvageTemplateIds ?? []).filter((id) => !settings.autoSellTemplateIds.includes(id));
      }
      if (settings.autoSalvageTemplateIds !== void 0) {
        newCharacter.autoSalvageTemplateIds = settings.autoSalvageTemplateIds;
        newCharacter.autoSellTemplateIds = (newCharacter.autoSellTemplateIds ?? []).filter((id) => !settings.autoSalvageTemplateIds.includes(id));
      }
      if (settings.ignoredLootTemplateIds !== void 0) newCharacter.ignoredLootTemplateIds = settings.ignoredLootTemplateIds;
      if (settings.autoHpPotionId !== void 0) newCharacter.autoHpPotionId = settings.autoHpPotionId;
      if (settings.autoHpPotionPercent !== void 0) newCharacter.autoHpPotionPercent = settings.autoHpPotionPercent;
      if (settings.autoHpPotionEnabled !== void 0) newCharacter.autoHpPotionEnabled = settings.autoHpPotionEnabled;
      if (settings.autoMpPotionId !== void 0) newCharacter.autoMpPotionId = settings.autoMpPotionId;
      if (settings.autoMpPotionPercent !== void 0) newCharacter.autoMpPotionPercent = settings.autoMpPotionPercent;
      if (settings.autoMpPotionEnabled !== void 0) newCharacter.autoMpPotionEnabled = settings.autoMpPotionEnabled;
      if (["autoHpPotionId", "autoHpPotionPercent", "autoHpPotionEnabled", "autoMpPotionId", "autoMpPotionPercent", "autoMpPotionEnabled"].some((key) => settings[key] !== void 0)) {
        trackQuestAction(newCharacter, "CONFIGURE_POTIONS");
      }
      set({ character: newCharacter });
      get().save();
    },
    activateBuff: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      const durationMs = newCharacter.premium ? 30 * 60 * 1e3 : 5 * 60 * 1e3;
      const currentBuff = newCharacter.doubleAtkUntil && newCharacter.doubleAtkUntil > runtimeNow() ? newCharacter.doubleAtkUntil : runtimeNow();
      newCharacter.doubleAtkUntil = currentBuff + durationMs;
      set({ character: newCharacter });
      get().save();
    },
    acceptQuest: (id) => {
      const { character, races } = get();
      if (!character) return;
      if (!getAvailableQuests(character).some((q) => q.id === id)) return;
      const newChar = JSON.parse(JSON.stringify(character));
      if (!newChar.quests) newChar.quests = { active: {}, completed: [] };
      if (!newChar.quests.active[id]) {
        newChar.quests.active[id] = { progress: [] };
        trackRaceDiscovery(newChar, races);
        set({ character: newChar });
        get().save();
      }
    },
    claimQuest: (id) => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = claimQuestReward(newChar, id);
      if (res.success) {
        if (id === "TUT_BACKPACK") {
          newChar.tutorialCompleted = true;
          newChar.tutorialRelicGranted = true;
        }
        trackRaceDiscovery(newChar, get().races);
        set({ character: newChar });
        get().save();
        notify(res.msg);
      }
    },
    recordQuestAction: (action) => {
      const { character } = get();
      if (!character) return;
      const hasPendingTutorialAction = Object.entries(character.quests?.active ?? {}).some(([id, state]) => {
        const quest = QUESTS.find((template) => template.id === id && template.category === "TUTORIAL");
        return quest?.objectives.some((objective, index) => objective.type === action && (state.progress[index] ?? 0) < objective.count);
      });
      if (!hasPendingTutorialAction) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      let forgeRecoveryGranted = false;
      if (action === "VISIT_FORGE" && newCharacter.quests?.active.TUT_FORGE) {
        const forgeable = newCharacter.inventory.items.some((item) => ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category));
        if (!forgeable) {
          const starter = makeEquipment("ESPADA_T1", "COMUM");
          if (starter) {
            starter.quantity = 1;
            addItem(newCharacter.inventory, starter);
            forgeRecoveryGranted = true;
          }
        }
      }
      trackQuestAction(newCharacter, action);
      set({ character: newCharacter });
      get().save();
      if (forgeRecoveryGranted) notify("O Ferreiro separou uma Espada de Pr\xE1tica para concluir sua miss\xE3o de aprimoramento.");
    },
    buyTrainingBoost: () => {
      const { character } = get();
      if (!character) return { success: false };
      const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (character.trainingBoostDay === day) return { success: false, error: "J\xE1 adquirido hoje. Reinicia \xE0s 00:00 UTC." };
      if (character.gold < 250) return { success: false, error: "Gold insuficiente (250)." };
      set({ character: { ...character, gold: character.gold - 250, trainingBoostDay: day, trainingBoostUntil: runtimeNow() + 18e5 } });
      get().save();
      return { success: true };
    },
    useVial: (vial) => {
      const { character } = get();
      if (!character) return;
      if (character.gold < vial.price) return;
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.gold -= vial.price;
      if (!newChar.activeVials) newChar.activeVials = {};
      const now = runtimeNow();
      const family = vial.id.replace(/_[0-9]+$/, "");
      for (const id of Object.keys(newChar.activeVials)) if (id.replace(/_[0-9]+$/, "") === family) delete newChar.activeVials[id];
      newChar.activeVials[vial.id] = now + vial.durationMinutes * 6e4;
      recalcStats(newChar);
      set({ character: newChar });
      get().save();
      notify(`Voc\xEA bebeu ${vial.name}!`);
    },
    buyBless: () => {
      const { character } = get();
      if (!character) return;
      const price = Math.max(100, character.level * 250);
      if (character.gold < price) return warn("Ouro insuficiente para comprar Bless.");
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.gold -= price;
      newChar.blesses = Math.min(5, (newChar.blesses || 0) + 1);
      set({ character: newChar });
      get().save();
      notify(`Voc\xEA comprou uma Bless! (${newChar.blesses}/5)`);
    },
    buyStaminaGold: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const now = runtimeNow();
      const day = staminaDayKey(now);
      const cost = staminaGoldCost(character.level);
      const current = Math.max(0, Number(character.staminaOnline ?? STAMINA_ONLINE_MAX));
      if (current >= STAMINA_ONLINE_MAX) return { success: false, error: "Sua stamina online j\xE1 est\xE1 cheia." };
      if (!STAMINA_PRETEST_UNLIMITED && character.staminaGoldPurchaseDay === day) return { success: false, error: "A compra com Gold j\xE1 foi usada hoje." };
      if (character.gold < cost) return { success: false, error: `Gold insuficiente. Voc\xEA precisa de ${cost.toLocaleString("pt-BR")} Gold.` };
      const next = JSON.parse(JSON.stringify(character));
      next.gold -= cost;
      next.staminaOnline = Math.min(STAMINA_ONLINE_MAX, current + STAMINA_GOLD_REFILL_MINUTES);
      if (!STAMINA_PRETEST_UNLIMITED) next.staminaGoldPurchaseDay = day;
      next.staminaUpdatedAt = now;
      set({ character: next });
      get().save();
      notify(`\u26A1 Stamina recuperada: +${STAMINA_GOLD_REFILL_MINUTES} min.`);
      return { success: true, minutesAdded: STAMINA_GOLD_REFILL_MINUTES };
    },
    buyStaminaCoins: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const now = runtimeNow();
      const day = staminaDayKey(now);
      const current = Math.max(0, Number(character.staminaOnline ?? STAMINA_ONLINE_MAX));
      if (current >= STAMINA_ONLINE_MAX) return { success: false, error: "Sua stamina online j\xE1 est\xE1 cheia." };
      if (!STAMINA_PRETEST_UNLIMITED && character.staminaCoinPurchaseDay === day) return { success: false, error: "A compra com Mythreon Coin j\xE1 foi usada hoje." };
      if ((character.mythreonCoins ?? 0) < 1) return { success: false, error: "Voc\xEA precisa de 1 Mythreon Coin." };
      const next = JSON.parse(JSON.stringify(character));
      next.mythreonCoins = Math.max(0, Number(next.mythreonCoins ?? 0) - 1);
      next.staminaOnline = Math.min(STAMINA_ONLINE_MAX, current + STAMINA_COIN_REFILL_MINUTES);
      if (!STAMINA_PRETEST_UNLIMITED) next.staminaCoinPurchaseDay = day;
      next.staminaUpdatedAt = now;
      set({ character: next });
      get().save();
      notify(`\u26A1 Stamina recuperada: +${STAMINA_COIN_REFILL_MINUTES} min.`);
      return { success: true, minutesAdded: STAMINA_COIN_REFILL_MINUTES };
    },
    upgradeItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = upgradeItemLevel(newCharacter, uid);
      if (res.success) {
        trackQuestAction(newCharacter, "FORGE");
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    rerollItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = rerollItemAffixes(newCharacter, uid);
      if (res.success) {
        trackQuestAction(newCharacter, "FORGE");
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    elevateItemTier: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const next = structuredClone(character);
      const result = elevateItemTier(next, uid);
      if (!result.success) return result;
      set({ character: next });
      get().save();
      return result;
    },
    rerollSpecificAffix: (uid, stat) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const next = structuredClone(character);
      const result = rerollSpecificAffix(next, uid, stat);
      if (!result.success) return result;
      set({ character: next });
      get().save();
      return result;
    },
    enchantItem: (uid, zoneId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const next = structuredClone(character);
      const result = enchantItem(next, uid, zoneId);
      if (!result.success) return result;
      trackQuestAction(next, "FORGE");
      set({ character: next });
      get().save();
      notify(`\u2728 ${result.enchantment} gravado no equipamento.`);
      return result;
    },
    forgeFragments: (fromTemplateId) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const updated = JSON.parse(JSON.stringify(character));
      const result = forgeFragments(updated, fromTemplateId);
      if (result.success) {
        set({ character: updated });
        get().save();
      }
      return result;
    },
    refineMythreonCoins: (amount = 1) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const coins = Math.max(1, Math.min(100, Math.floor(amount)));
      const shards = coins * MYTHREON_ECONOMY.shardsPerCoin;
      const gold = coins * MYTHREON_ECONOMY.goldPerCoin;
      if ((character.mythreonShards ?? 0) < shards) return { success: false, error: `Voc\xEA precisa de ${shards} Shards.` };
      if (character.gold < gold) return { success: false, error: `Refinar custa ${gold.toLocaleString("pt-BR")} gold.` };
      const next = { ...character, mythreonShards: (character.mythreonShards ?? 0) - shards, mythreonCoins: (character.mythreonCoins ?? 0) + coins, gold: character.gold - gold };
      set({ character: next });
      get().save();
      notify(`\u2728 ${coins} Mythreon Coin${coins > 1 ? "s" : ""} refinada(s).`);
      return { success: true, coins };
    },
    buyMythreonOffer: (offerId) => {
      const { character } = get();
      const offer = getMythreonOffer(offerId);
      if (!character || !offer || offer.kind === "BOOST") return { success: false, error: "Oferta de item inv\xE1lida." };
      if ((character.mythreonCoins ?? 0) < offer.priceCoins) return { success: false, error: `Voc\xEA precisa de ${offer.priceCoins} Mythreon Coins.` };
      const next = JSON.parse(JSON.stringify(character));
      const template = offer.templateId ? ALL_ITEM_TEMPLATES[offer.templateId] : void 0;
      const cosmetic = offer.templateId ? COSMETIC_DEFINITIONS[offer.templateId] : void 0;
      if (template && cosmetic) {
        next.unlockedCosmetics = [.../* @__PURE__ */ new Set([...next.unlockedCosmetics ?? [], template.templateId])];
        next.cosmeticLoadout ??= {};
        next.cosmeticLoadout[cosmetic.slot] = template.templateId;
        next.mythreonCoins = (next.mythreonCoins ?? 0) - offer.priceCoins;
        set({ character: next });
        get().save();
        notify(`${offer.name} ativada como skin permanente e equipada na aba Skins.`);
        return { success: true };
      }
      const item = template?.category === "MATERIAL" ? makeMaterial(template.templateId) : template ? makeEquipment(template.templateId, template.rarity) : null;
      if (!item || !addItem(next.inventory, item)) return { success: false, error: "Bolsa cheia. Libere um espa\xE7o antes de comprar." };
      next.mythreonCoins = (next.mythreonCoins ?? 0) - offer.priceCoins;
      set({ character: next });
      get().save();
      notify(`${offer.name} foi entregue na mochila.`);
      return { success: true };
    },
    buyMythreonBoost: (offerId) => {
      const { character } = get();
      const offer = getMythreonOffer(offerId);
      if (!character || !offer || offer.kind !== "BOOST" || !offer.boostKey) return { success: false, error: "Boost inv\xE1lido." };
      if ((character.mythreonCoins ?? 0) < offer.priceCoins) return { success: false, error: `Voc\xEA precisa de ${offer.priceCoins} Mythreon Coins.` };
      const next = structuredClone(character);
      next.mythreonCoins = (next.mythreonCoins ?? 0) - offer.priceCoins;
      next.mythreonBoosts ??= {};
      const now = runtimeNow();
      const current = next.mythreonBoosts[offer.boostKey];
      if (offer.durationHours === 0) next.mythreonBoosts[offer.boostKey] = 0;
      else {
        const base = current !== void 0 && (current === 0 || current > now) ? current : now;
        next.mythreonBoosts[offer.boostKey] = base + (offer.durationHours ?? 1) * 60 * 60 * 1e3;
      }
      set({ character: next });
      get().save();
      notify(`${offer.name} ativado. A Ess\xEAncia reconhece seu foco.`);
      return { success: true };
    },
    openMythreonRoulette: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const key = character.inventory.items.find((item) => item.templateId === "CHAVE_ROLETA_ARCANA");
      if (!key) return { success: false, error: "Voc\xEA precisa de uma Chave da Roleta Arcana." };
      const rewards = [
        { label: "1.500 gold", gold: 1500 },
        { label: "5 Fragmentos Raros", templateId: "FRAGMENTO_RARO", quantity: 5 },
        { label: "20 Fragmentos Comuns", templateId: "FRAGMENTO_COMUM", quantity: 20 },
        { label: "Ovo de Besta Divina Raro", templateId: "OVO_BESTA_T3", quantity: 1 },
        { label: "Ovo de Besta Divina \xC9pico", templateId: "OVO_BESTA_T4", quantity: 1 },
        { label: "Ba\xFA de Suprimentos Mythreon", templateId: "BAU_SUPRIMENTOS_MYTHREON", quantity: 1 }
      ];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      const next = structuredClone(character);
      removeItem(next.inventory, key.uid, 1);
      if (reward.gold) next.gold += reward.gold;
      if (reward.templateId) {
        const template = ALL_ITEM_TEMPLATES[reward.templateId];
        const item = template?.category === "MATERIAL" ? makeMaterial(reward.templateId) : template ? makeEquipment(reward.templateId, template.rarity) : null;
        if (!item) return { success: false, error: "Pr\xEAmio indispon\xEDvel." };
        item.quantity = reward.quantity ?? 1;
        if (!addItem(next.inventory, item)) return { success: false, error: "Libere espa\xE7o na mochila antes de abrir a roleta." };
      }
      set({ character: next });
      get().save();
      notify(`\u{1F3B0} Roleta Arcana: ${reward.label}!`);
      return { success: true, reward: reward.label };
    },
    buyCalendarCoupon: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      if (!Number.isSafeInteger(character.mythreonCoins) || Number(character.mythreonCoins) < CALENDAR_COUPON_PRICE) return { success: false, error: "Voc\xEA precisa de 1 Mythreon Coin por cupom." };
      const next = { ...character, mythreonCoins: (character.mythreonCoins ?? 0) - CALENDAR_COUPON_PRICE, calendarCoupons: (character.calendarCoupons ?? 0) + 1 };
      set({ character: next });
      get().save();
      return { success: true };
    },
    claimDailyCalendar: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const result = claimCalendarReward(character);
      if (!result.success) return result;
      set({ character: result.character });
      get().save();
      return { success: true, reward: result.reward };
    },
    recoverCalendarDay: (day) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const result = recoverCalendarDay(character, day);
      if (!result.success) return result;
      set({ character: result.character });
      get().save();
      return { success: true, reward: result.reward };
    },
    recoverCalendarWeek: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      const result = recoverCalendarWeek(character);
      if (!result.success) return result;
      set({ character: result.character });
      get().save();
      return { success: true, reward: result.reward };
    },
    claimOnlineChest: () => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      normalizeOnlineChest(character, runtimeNow());
      const milestone = nextOnlineChest(character);
      if (!milestone) return { success: false, error: "Voc\xEA j\xE1 abriu todos os ba\xFAs de hoje. A trilha reinicia amanh\xE3." };
      if ((character.onlineChestSeconds ?? 0) < milestone.seconds) return { success: false, error: `Fique online por mais ${Math.ceil((milestone.seconds - (character.onlineChestSeconds ?? 0)) / 60)} min para abrir o ba\xFA de ${milestone.label}.` };
      const next = structuredClone(character);
      normalizeOnlineChest(next, runtimeNow());
      next.onlineChestClaims = [.../* @__PURE__ */ new Set([...next.onlineChestClaims ?? [], milestone.id])];
      next.onlineChestsOpened = (next.onlineChestsOpened ?? 0) + 1;
      const gold = milestone.gold + next.level * Math.max(20, Math.floor(milestone.gold / 100));
      const shards = milestone.shards + Math.floor(next.level / 40);
      next.gold += gold;
      next.mythreonShards = (next.mythreonShards ?? 0) + shards;
      const reward = `${milestone.label}: ${gold.toLocaleString("pt-BR")} gold + ${shards} Mythreon Shard${shards === 1 ? "" : "s"}`;
      set({ character: next });
      get().save();
      notify(`Ba\xFA do Ref\xFAgio: ${reward}`);
      return { success: true, reward };
    },
    setCardLoadout: (uids) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      if (!Array.isArray(uids) || uids.length > 5 || uids.some((uid) => typeof uid !== "string")) return { success: false, error: "A forma\xE7\xE3o aceita at\xE9 cinco cartas." };
      const unique = [...new Set(uids)];
      const owned = new Set((character.cards ?? []).filter((card) => CARD_TEMPLATES[card.templateId]).map((card) => card.uid));
      if (unique.some((uid) => !owned.has(uid))) return { success: false, error: "Uma das cartas n\xE3o pertence \xE0 sua cole\xE7\xE3o." };
      const next = structuredClone(character);
      next.cardLoadout = unique;
      recalcStats(next);
      set({ character: next });
      get().save();
      return { success: true };
    },
    evolveCard: (uid, materialUids, expectedLevel) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      if (typeof uid !== "string" || !Array.isArray(materialUids) || materialUids.some((id) => typeof id !== "string") || !Number.isInteger(expectedLevel)) return { success: false, error: "Dados de evolu\xE7\xE3o inv\xE1lidos." };
      const next = structuredClone(character), result = evolveCard(next, uid, materialUids, expectedLevel);
      if (!result.success) return result;
      recalcStats(next);
      set({ character: next });
      get().save();
      return result;
    },
    recycleCards: (sourceTemplateId, materialUids) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem." };
      if (typeof sourceTemplateId !== "string" || !Array.isArray(materialUids) || materialUids.some((id) => typeof id !== "string")) {
        return { success: false, error: "Dados da roleta inv\xE1lidos." };
      }
      const next = structuredClone(character);
      const result = recycleCardCopies(next, sourceTemplateId, materialUids);
      if (!result.success) return result;
      recalcStats(next);
      set({ character: next });
      get().save();
      notify(`\u{1F3B0} Bolsa de Cards: ${CARD_TEMPLATES[result.reward?.templateId ?? ""]?.name ?? "nova mem\xF3ria"} recebida.`);
      return result;
    },
    depositItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = depositItem(newCharacter, uid);
      if (res.success) {
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    withdrawItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = withdrawItem(newCharacter, uid);
      if (res.success) {
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    depositMany: (uids) => {
      const { character } = get();
      if (!character) return { success: false, moved: 0, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = depositMany(newCharacter, uids);
      if (res.moved > 0) {
        set({ character: newCharacter });
        get().save();
      }
      return { success: res.moved > 0, moved: res.moved, error: res.error };
    },
    withdrawMany: (uids) => {
      const { character } = get();
      if (!character) return { success: false, moved: 0, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = withdrawMany(newCharacter, uids);
      if (res.moved > 0) {
        set({ character: newCharacter });
        get().save();
      }
      return { success: res.moved > 0, moved: res.moved, error: res.error };
    },
    claimArenaReward: (teamSize) => {
      const { character, currentZoneId } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const earnedToday = character.arenaRewardDay === today ? character.arenaRewardsToday ?? 0 : 0;
      if (earnedToday >= 3) return { success: false, error: "Voc\xEA j\xE1 recebeu as 3 recompensas di\xE1rias da Arena." };
      const tier = ZONES[currentZoneId]?.tier ?? 1;
      const gold = (teamSize === 1 ? 30 : teamSize === 3 ? 70 : 130) * tier;
      const newCharacter = {
        ...character,
        gold: character.gold + gold,
        arenaRewardDay: today,
        arenaRewardsToday: earnedToday + 1,
        inventory: { ...character.inventory, items: [...character.inventory.items] }
      };
      let fragment;
      if (teamSize === 3 || teamSize === 5 && character.arenaRareRewardDay !== today) {
        const fragmentId = teamSize === 3 ? "FRAGMENTO_COMUM" : "FRAGMENTO_RARO";
        const template = FRAGMENT_TEMPLATES[fragmentId];
        if (addItem(newCharacter.inventory, { ...template, uid: `arena-${runtimeNow()}-${Math.random()}`, quantity: 1 })) {
          fragment = fragmentId;
          if (teamSize === 5) newCharacter.arenaRareRewardDay = today;
        }
      }
      set({ character: newCharacter });
      get().save();
      return { success: true, gold, fragment, remaining: 2 - earnedToday };
    }
  }));
}
var useGameStore = createGameStore();

// src/engine/professionPrecision.ts
var PROFESSION_PULSE_MS = 3e3;
var PERFECT_PULSE_RADIUS = 0.045;
var GOOD_PULSE_RADIUS = 0.11;
function professionPrecisionAt(elapsed, target) {
  if (!Number.isFinite(elapsed) || !Number.isFinite(target) || elapsed < 0 || elapsed >= PROFESSION_PULSE_MS) return 0.5;
  const distance = Math.abs(elapsed / PROFESSION_PULSE_MS - target);
  return distance <= PERFECT_PULSE_RADIUS ? 1.5 : distance <= GOOD_PULSE_RADIUS ? 1 : 0.5;
}

// src/engine/professionChallenge.ts
var PROFESSION_LEAD_MS = 1200;
var PROFESSION_DELIVERY_GRACE_MS = 5e3;
function gatheringAccessError(c, kind, targetId, now, baitId) {
  const mining = kind === "MINERACAO";
  const point = mining ? MINING_NODES.find((node) => node.id === targetId) : FISHING_SPOTS.find((spot) => spot.id === targetId);
  if (!point) return "Ponto de coleta inv\xE1lido.";
  if (!canEnterZone(c, point.zoneId)) return "Conclua a travessia deste bioma em Jornadas antes de coletar.";
  const skill = Number(mining ? c.professions?.mining ?? 0 : c.professions?.fishing ?? 0);
  if (skill < point.requiredSkill) return `Requer ${mining ? "minera\xE7\xE3o" : "pesca"} ${point.requiredSkill}.`;
  const tier = mining ? point.tier : point.rodTier;
  const tool = mining ? c.equippedMiningTool : c.equippedFishingRod;
  if (!tool || tool.category !== "FERRAMENTA" || tool.profession !== kind || Number(tool.tier ?? 0) < tier) return `Equipe ${mining ? "picareta" : "vara"} T${tier} ou superior.`;
  const last = Number(mining ? c.professions?.lastMiningAt ?? 0 : c.professions?.lastFishingAt ?? 0);
  const remaining = professionCooldown(skill) - (now - last);
  if (remaining > 0) return `Aguarde ${Math.ceil(remaining / 1e3)}s antes de coletar novamente.`;
  if (baitId !== void 0 && (mining || baitId !== FISHING_BAIT.templateId)) return "Isca inv\xE1lida para esta coleta.";
  if (baitId && countByTemplate(c.inventory, baitId) < FISHING_BAIT.quantity) return "A isca escolhida n\xE3o est\xE1 mais na mochila.";
}
function prepareGathering(c, previous, kind, targetId, now, baitId) {
  if (previous && previous.expiresAt > now) return { success: false, error: "Conclua ou cancele o pulso de coleta atual." };
  const error = gatheringAccessError(c, kind, targetId, now, baitId);
  if (error) return { success: false, error };
  const startsAt = now + PROFESSION_LEAD_MS;
  return { success: true, serverNow: now, challenge: {
    id: generateId(),
    kind,
    targetId,
    target: 0.4 + Math.random() * 0.35,
    createdAt: now,
    startsAt,
    expiresAt: startsAt + PROFESSION_PULSE_MS + PROFESSION_DELIVERY_GRACE_MS,
    ...baitId ? { baitId } : {}
  } };
}
function resolveGathering(challenge, id, now) {
  if (!challenge || challenge.id !== id) return { success: false, error: "Este pulso de coleta n\xE3o est\xE1 mais dispon\xEDvel." };
  if (now < challenge.startsAt) return { success: false, error: "O pulso ainda n\xE3o come\xE7ou. Segure at\xE9 o marcador avan\xE7ar." };
  if (now >= challenge.expiresAt) return { success: false, error: "O pulso expirou. Inicie uma nova coleta." };
  return { success: true, precision: professionPrecisionAt(now - challenge.startsAt, challenge.target) };
}

// server/game.ts
function freshWorld(name, id, appearance) {
  const character = createNewCharacter(name, appearance);
  character.id = id;
  return { character, races: [], isTickRunning: false, isTraining: false, healingUntil: null, deathReport: null, lastTickResult: null, lastAdvanceAt: Date.now(), counters: { forges: 0, syntheses: 0, trades: 0, bosses: 0 } };
}
function normalizeArrowItems(character) {
  for (const item of [...character.inventory?.items ?? [], ...character.depot ?? [], ...Object.values(character.equipped ?? {})]) {
    if (/^FLECHA_T[1-5]$/.test(item.templateId)) {
      item.category = "FLECHA";
      item.slot = "MUNICAO";
      item.stackable = false;
      item.maxStack = 1;
      item.quantity = 1;
    }
  }
}
function normalizeLegacyItems(character) {
  for (const item of [...character.inventory?.items ?? [], ...character.depot ?? [], ...Object.values(character.equipped ?? {})]) {
    if (item.templateId === "UNICO_BRASA_ETERNA") {
      item.category = "PULSEIRA";
      item.slot = "PULSEIRA";
    }
    const template = ALL_ITEM_TEMPLATES[item.templateId];
    if (template) {
      item.stats ??= {};
      for (const [key, value] of Object.entries(template.stats ?? {})) {
        const current = Number(item.stats[key]);
        if (!Number.isFinite(current) || current === 0) item.stats[key] = Math.round(Number(value) * Math.pow(1.1, item.upgradeLevel ?? 0) * 100) / 100;
      }
    }
  }
  const equipped = character.equipped ?? {};
  for (const key of ["ANEL_I", "ANEL_II"]) {
    const item = equipped[key];
    if (item?.templateId !== "UNICO_BRASA_ETERNA") continue;
    item.category = "PULSEIRA";
    item.slot = "PULSEIRA";
    if (!equipped.PULSEIRA) {
      equipped.PULSEIRA = item;
      delete equipped[key];
    } else {
      (character.inventory.items ??= []).push({ ...item, uid: `${item.uid}-pulseira` });
      delete equipped[key];
    }
  }
}
function executeGame(world, action, args = []) {
  normalizeArrowItems(world.character);
  normalizeLegacyItems(world.character);
  const farm = world.character.farm ?? { plots: [{ id: "plot-1", fertility: 100 }], unlockedPlots: 1, skills: { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }, lastActionAt: Date.now() };
  world.character.farm = farm;
  world.character.professions = world.character.professions ?? { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
  world.character.professions.mining ??= 0;
  world.character.professions.fishing ??= 0;
  const items = world.character.inventory?.items ?? [];
  const starterTarget = () => items.length < Number(world.character.inventory?.backpack?.slots ?? 0) ? items : world.character.depot ??= [];
  if (!world.character.equippedMiningTool && !items.some((item) => item.templateId === "PICARETA_T1") && !world.character.depot?.some((item) => item.templateId === "PICARETA_T1")) starterTarget().push(createItem({ ...PROFESSION_TOOL_TEMPLATES.PICARETA_T1, uid: generateId() }));
  if (!world.character.equippedFishingRod && !items.some((item) => item.templateId === "VARA_PESCA_T1") && !world.character.depot?.some((item) => item.templateId === "VARA_PESCA_T1")) starterTarget().push(createItem({ ...PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T1, uid: generateId() }));
  farm.skills = farm.skills ?? { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
  farm.skills.irrigation ??= 0;
  farm.skills.fertility ??= 0;
  for (const plot of farm.plots) plot.fertility ??= 100;
  const expectedXp = xpToNextLevel(world.character.level);
  if (world.character.xpToNext !== expectedXp) {
    world.character.xp = Math.floor(world.character.xp / Math.max(1, world.character.xpToNext) * expectedXp);
    world.character.xpToNext = expectedXp;
  }
  world.counters ??= { forges: 0, syntheses: 0, trades: 0, bosses: 0 };
  world.counters.bosses ??= 0;
  const messages = [];
  const store = createGameStore({ server: true, persist: () => {
  }, notify: (m) => messages.push(m) });
  store.setState({ ...world, currentZoneId: world.character.currentZoneId });
  const now = Date.now();
  if (!Number.isFinite(world.lastAdvanceAt)) world.lastAdvanceAt = now;
  const elapsed = now - world.lastAdvanceAt;
  if (world.healingUntil && now >= world.healingUntil) {
    store.getState().healFull();
  }
  if (elapsed >= 3e3 && (world.isTickRunning || world.isTraining)) {
    const steps = elapsed > 15e3 ? 1 : Math.min(5, Math.floor(elapsed / 3e3));
    for (let i = 0; i < steps; i++) {
      store.getState().tick();
      const tick = store.getState().lastTickResult, actor = store.getState().character;
      if (tick?.attacked && (!actor.onlineBalloonUntil || actor.onlineBalloonUntil < now) && Math.random() < 0.15) actor.onlineBalloonUntil = now + 1e4;
      world.counters.bosses = (world.counters.bosses ?? 0) + Object.values(store.getState().lastTickResult?.bossKills ?? {}).reduce((a, b) => a + b, 0);
      if (!store.getState().isTickRunning && !store.getState().isTraining) break;
    }
    world.lastAdvanceAt = elapsed > 15e3 ? now : world.lastAdvanceAt + steps * 3e3;
  }
  let result;
  if (action) {
    const s = store.getState();
    if (s.isTickRunning && ["sellItem", "sellSelected", "salvageAll", "salvageSelected", "upgradeItem", "rerollItem", "elevateItemTier", "rerollSpecificAffix", "enchantItem"].includes(action)) throw Error("Saia da ca\xE7a para acessar o Ferreiro.");
    if (action === "activateBuff" && (!s.isTickRunning || !s.character?.onlineBalloonUntil || s.character.onlineBalloonUntil < now)) throw Error("Este eco de b\xF4nus expirou. Aguarde outro durante a ca\xE7a.");
    const zero = ["finishIntro", "clearOfflineReport", "clearDeathReport", "startHealing", "cancelHealing", "stopHunting", "stopTraining", "unequipRace", "unequipDivineBeast", "activateBuff", "buyTrainingBoost", "buyBless", "buyStaminaGold", "buyStaminaCoins", "refreshCompendium"];
    const strings = ["unlockZone", "setActiveEnemy", "setCurrentZone", "acceptQuest", "claimQuest", "upgradeItem", "rerollItem", "depositItem", "withdrawItem", "discardItem", "plantFarmSeed", "waterFarmPlot", "fertilizeFarmPlot", "harvestFarmPlot", "cookFarmRecipe", "buyProfessionTool"];
    const uid = (v) => {
      if (typeof v !== "string" || v.length < 1 || v.length > 128) throw Error("Identificador inv\xE1lido.");
      return v;
    };
    if (action === "beginProfessionChallenge") {
      if (args.length !== 2 && args.length !== 3 || !["MINERACAO", "PESCA"].includes(String(args[0]))) throw Error("Profiss\xE3o inv\xE1lida.");
      const prepared = prepareGathering(s.character, world.professionChallenge, args[0], uid(args[1]), now, args.length === 3 ? uid(args[2]) : void 0);
      if (prepared.success) world.professionChallenge = prepared.challenge;
      result = prepared;
    } else if (action === "finishProfessionChallenge") {
      if (args.length !== 1) throw Error("Par\xE2metros inesperados.");
      const id = uid(args[0]), challenge = world.professionChallenge, resolved = resolveGathering(challenge, id, now);
      if (challenge?.id === id) world.professionChallenge = void 0;
      if (!resolved.success) {
        result = resolved;
      } else {
        const error = gatheringAccessError(s.character, challenge.kind, challenge.targetId, now, challenge.baitId);
        if (error) {
          result = { success: false, error };
        } else {
          const collected = challenge.kind === "MINERACAO" ? s.mineResource(challenge.targetId, resolved.precision) : s.fishSpot(challenge.targetId, resolved.precision, challenge.baitId);
          result = { ...collected, precision: resolved.precision };
        }
      }
    } else if (action === "cancelProfessionChallenge") {
      if (args.length !== 1) throw Error("Par\xE2metros inesperados.");
      const id = uid(args[0]);
      if (world.professionChallenge?.id === id) world.professionChallenge = void 0;
      result = { success: true };
    } else if (action === "mineResource" || action === "fishSpot") throw Error("Inicie um pulso de coleta antes de extrair recursos online.");
    else if (zero.includes(action)) {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s[action]();
    } else if (strings.includes(action)) {
      const id = uid(args[0]);
      if (action === "plantFarmSeed") {
        result = s.plantFarmSeed(id, uid(args[1]));
      } else {
        if (["upgradeItem", "rerollItem"].includes(action)) {
          const item = s.character.inventory.items.find((i) => i.uid === id);
          if (!item || !["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category)) throw Error("Escolha um equipamento v\xE1lido para o Ferreiro.");
        }
        result = s[action](id);
      }
    } else if (action === "equipProfessionTool") {
      const id = uid(args[0]);
      result = s.equipProfessionTool(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel equipar a ferramenta.");
    } else if (action === "refineProfessionRecipe") {
      const id = uid(args[0]);
      result = s.refineProfessionRecipe(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel concluir o refino.");
    } else if (action === "startHunting") {
      const zone = uid(args[0]);
      if (!ZONES[zone]) throw Error("Mapa inv\xE1lido.");
      s.startHunting(zone);
      if (!store.getState().isTickRunning) throw Error("A ca\xE7a n\xE3o p\xF4de ser iniciada. Verifique sua vida, stamina, n\xEDvel e os requisitos da miss\xE3o.");
      store.getState().character.lastTick = now;
      world.lastAdvanceAt = now;
      result = { success: true, zoneId: zone };
    } else if (action === "startTraining" || action === "spendStatPoint") {
      const skill = uid(args[0]);
      if (!["melee", "magic", "distance", "defense", "soul"].includes(skill)) throw Error("Atributo inv\xE1lido.");
      result = s[action](skill);
      if (action === "startTraining") world.lastAdvanceAt = now;
    } else if (action === "equip") {
      const id = uid(args[0]);
      const force = args[1] === true;
      result = s.equip(id, force);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel equipar.");
    } else if (action === "armSpecialCombo") {
      const power = args[0] === 1 || args[0] === 0.5 || args[0] === 1.5 ? args[0] : 1.5;
      result = s.armSpecialCombo(power);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel armar o combo.");
      s.tick();
      world.lastAdvanceAt = now;
    } else if (action === "unequip") {
      const slots = ["CAPACETE", "ARMADURA", "LUVAS", "CALCAS", "BOTAS", "COLAR", "ANEL_I", "ANEL_II", "PULSEIRA", "ARMA_PRINCIPAL", "OFF_HAND", "MUNICAO", "BACKPACK"];
      if (!slots.includes(String(args[0]))) throw Error("Slot inv\xE1lido.");
      result = s.unequip(args[0]);
    } else if (action === "updateAppearance") {
      const value = args[0];
      if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Apar\xEAncia inv\xE1lida.");
      const allowed = { body: ["MASCULINO", "FEMININO"], skin: ["CLARA", "MORENA", "ESCURA", "AZUL_ESSENCIA"], hair: ["CURTO", "LONGO", "TRANCAS", "ARCANO"], hairColor: ["NEGRO", "CASTANHO", "RUIVO", "PRATEADO", "AZUL"], outfit: ["VIAJANTE", "GUARDIAO", "MISTICO"], outfitColor: ["OCRE", "AZUL", "VIOLETA", "VERDE"] };
      for (const [key, values] of Object.entries(allowed)) {
        if (!values.includes(String(value[key]))) throw Error("Op\xE7\xE3o de apar\xEAncia inv\xE1lida.");
      }
      result = s.updateAppearance(value);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel salvar a apar\xEAncia.");
    } else if (action === "equipCosmetic") {
      const id = uid(args[0]);
      if (!/^(SKIN_|LUMINESCENCIA_|ADDON_)/.test(id)) throw Error("Cosm\xE9tico inv\xE1lido.");
      result = s.equipCosmetic(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel equipar o cosm\xE9tico.");
    } else if (action === "activateCosmetic") {
      const id = uid(args[0]);
      if (!/^(SKIN_|LUMINESCENCIA_|ADDON_)/.test(id)) throw Error("Cosm\xE9tico inv\xE1lido.");
      result = s.activateCosmetic(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel ativar a skin.");
    } else if (action === "unequipCosmetic") {
      if (args.length !== 1 || !COSMETIC_SLOTS.some((slot) => slot.key === args[0])) throw Error("Espa\xE7o cosm\xE9tico inv\xE1lido.");
      result = s.unequipCosmetic(args[0]);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel remover o cosm\xE9tico.");
    } else if (action === "equipRace") {
      const id = typeof args[0] === "string" ? args[0] : args[0]?.id;
      const race = s.races.find((r) => r.id === id);
      if (!race) throw Error("Matriz n\xE3o descoberta.");
      s.equipRace(race);
    } else if (action === "equipDivineBeast") {
      result = s.equipDivineBeast(uid(args[0]));
    } else if (action === "hatchEgg") {
      result = s.hatchEgg(uid(args[0]));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel eclodir o ovo.");
    } else if (action === "combineBeast") {
      result = s.combineBeast(uid(args[0]));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel aprimorar a linhagem.");
    } else if (action === "sellDivineBeast") {
      result = s.sellDivineBeast(uid(args[0]), args[1] ? uid(args[1]) : void 0);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel vender o pet.");
    } else if (action === "feedDivineBeast") {
      result = s.feedDivineBeast(uid(args[0]), uid(args[1]));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel alimentar a Besta.");
    } else if (action === "elevateItemTier") {
      result = s.elevateItemTier(uid(args[0]));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel elevar o Tier.");
    } else if (action === "rerollSpecificAffix") {
      result = s.rerollSpecificAffix(uid(args[0]), uid(args[1]));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel sortear o atributo.");
    } else if (action === "enchantItem") {
      if (args.length !== 2) throw Error("Informe o equipamento e o mapa do encantamento.");
      const itemId = uid(args[0]), zoneId = uid(args[1]);
      if (!ZONES[zoneId]) throw Error("Mapa de origem inv\xE1lido.");
      const item = s.character.inventory.items.find((i) => i.uid === itemId);
      if (!item || !["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category)) throw Error("Escolha um equipamento v\xE1lido para o Ferreiro.");
      result = s.enchantItem(itemId, zoneId);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel aplicar o encantamento.");
    } else if (action === "buyCalendarCoupon") {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s.buyCalendarCoupon();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel comprar o cupom.");
    } else if (action === "claimDailyCalendar") {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s.claimDailyCalendar();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel resgatar a recompensa.");
    } else if (action === "recoverCalendarDay") {
      if (args.length !== 1 || typeof args[0] !== "string") throw Error("Dia inv\xE1lido.");
      result = s.recoverCalendarDay(args[0]);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel recuperar o dia.");
    } else if (action === "recoverCalendarWeek") {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s.recoverCalendarWeek();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel recuperar a semana.");
    } else if (action === "claimOnlineChest") {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s.claimOnlineChest();
      if (!result?.success) throw Error(result?.error ?? "O ba\xFA ainda n\xE3o est\xE1 pronto.");
    } else if (action === "setCardLoadout") {
      if (!Array.isArray(args[0]) || args[0].length > 5 || args[0].some((uid2) => typeof uid2 !== "string" || uid2.length > 128)) throw Error("Forma\xE7\xE3o de cartas inv\xE1lida.");
      result = s.setCardLoadout([...new Set(args[0])]);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel salvar a forma\xE7\xE3o.");
    } else if (action === "evolveCard") {
      if (args.length !== 3 || !Array.isArray(args[1]) || args[1].length > 16 || args[1].some((id) => typeof id !== "string" || id.length < 1 || id.length > 128) || !Number.isInteger(args[2]) || Number(args[2]) < 1 || Number(args[2]) > 4) throw Error("Dados de evolu\xE7\xE3o inv\xE1lidos.");
      result = s.evolveCard(uid(args[0]), args[1], Number(args[2]));
    } else if (action === "recycleCards") {
      if (args.length !== 2 || typeof args[0] !== "string" || String(args[0]).length > 128 || !Array.isArray(args[1]) || args[1].length !== 4 || args[1].some((id) => typeof id !== "string" || id.length < 1 || id.length > 128)) throw Error("A roleta exige quatro c\xF3pias v\xE1lidas.");
      result = s.recycleCards(uid(args[0]), args[1].map(uid));
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel rodar a Bolsa de Cards.");
    } else if (action === "synthesize") {
      result = s.synthesize(uid(args[0]), uid(args[1]), uid(args[2]));
      if (result?.success) world.counters.syntheses++;
    } else if (action === "useVial") {
      const id = typeof args[0] === "string" ? args[0] : args[0]?.id;
      const vial = typeof id === "string" && Object.hasOwn(VIALS, id) ? VIALS[id] : void 0;
      if (!vial) throw Error("Vial inv\xE1lido.");
      s.useVial(vial);
    } else if (action === "sellItem") {
      const quantity = args[1] ?? 1;
      if (!Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 999) throw Error("Quantidade inv\xE1lida.");
      s.sellItem(uid(args[0]), Number(quantity));
    } else if (action === "unlockFarmPlot") {
      result = s.unlockFarmPlot();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel expandir a fazenda.");
    } else if (action === "sellSelected") {
      if (!Array.isArray(args[0]) || args[0].length > 300) throw Error("Sele\xE7\xE3o inv\xE1lida.");
      s.sellSelected([...new Set(args[0].map(uid))]);
    } else if (["salvageSelected", "depositMany", "withdrawMany"].includes(action)) {
      if (!Array.isArray(args[0]) || args[0].length > 300) throw Error("Sele\xE7\xE3o inv\xE1lida.");
      const ids = [...new Set(args[0].map(uid))];
      result = s[action](ids);
    } else if (action === "salvageAll") {
      if (!["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"].includes(String(args[0]))) throw Error("Raridade inv\xE1lida.");
      s.salvageAll(args[0]);
    } else if (action === "recordQuestAction") {
      const visits = { VISIT_WIKI: "wiki", VISIT_MATRIX: "matriz", VISIT_FORGE: "loja", VISIT_BACKPACK: "backpack", VISIT_CHARACTER: "personagem", VISIT_BEASTS: "pets", VISIT_SHOP: "shop", VISIT_LAB: "laboratorio", VISIT_DEPOT: "depot" };
      const visit = String(args[0]);
      if (!visits[visit] || !canUseTab(s.character, visits[visit])) throw Error("Etapa de tutorial inv\xE1lida.");
      s.recordQuestAction(visit);
    } else if (action === "updateSettings") {
      const value = args[0];
      if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Configura\xE7\xE3o inv\xE1lida.");
      const clean = {};
      for (const [key, v] of Object.entries(value)) {
        if (["autoSell", "autoSalvage"].includes(key)) {
          if (v !== null && !["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"].includes(String(v))) throw Error("Raridade inv\xE1lida.");
          clean[key] = v;
        } else if (["autoSellTemplateIds", "autoSalvageTemplateIds", "ignoredLootTemplateIds"].includes(key)) {
          if (!Array.isArray(v) || v.length > 500 || v.some((id) => typeof id !== "string" || id.length > 128)) throw Error("Itens inv\xE1lidos.");
          clean[key] = v;
        } else if (["autoHpPotionEnabled", "autoMpPotionEnabled"].includes(key)) {
          if (typeof v !== "boolean") throw Error("Configura\xE7\xE3o inv\xE1lida.");
          clean[key] = v;
        } else if (["autoHpPotionPercent", "autoMpPotionPercent"].includes(key)) {
          if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100) throw Error("Limite inv\xE1lido.");
          clean[key] = v;
        } else if (["autoHpPotionId", "autoMpPotionId"].includes(key)) {
          if (v !== null && (typeof v !== "string" || !/^POCAO_(VIDA|MANA)_[1-5]$/.test(v))) throw Error("Po\xE7\xE3o inv\xE1lida.");
          clean[key] = v;
        } else throw Error("Esta configura\xE7\xE3o n\xE3o pode ser alterada.");
      }
      s.updateSettings(clean);
    } else if (action === "healFull") {
      if (!world.healingUntil || now < world.healingUntil) throw Error("Aguarde a medita\xE7\xE3o.");
      s.healFull();
    } else if (action === "claimArenaReward") throw Error("Recompensas da arena local n\xE3o podem ser importadas para a economia online.");
    else if (action === "forgeFragments") {
      const id = uid(args[0]);
      if (!["FRAGMENTO_COMUM", "FRAGMENTO_RARO"].includes(id)) throw Error("Receita inv\xE1lida.");
      result = s.forgeFragments(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel fundir os fragmentos.");
    } else if (action === "refineMythreonCoins") {
      const amount = args[0] === void 0 ? 1 : Number(args[0]);
      if (!Number.isInteger(amount) || amount < 1 || amount > 100) throw Error("Quantidade de Coins inv\xE1lida.");
      result = s.refineMythreonCoins(amount);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel refinar a energia.");
    } else if (action === "buyMythreonOffer") {
      const id = uid(args[0]);
      if (!getMythreonOffer(id)) throw Error("Oferta inv\xE1lida.");
      result = s.buyMythreonOffer(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel concluir a compra.");
    } else if (action === "buyMythreonBoost") {
      const id = uid(args[0]);
      const offer = getMythreonOffer(id);
      if (!offer || offer.kind !== "BOOST") throw Error("Tomo ou b\xF4nus inv\xE1lido.");
      result = s.buyMythreonBoost(id);
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel ativar o b\xF4nus.");
    } else if (action === "openMythreonRoulette") {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s.openMythreonRoulette();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel abrir a roleta.");
    } else throw Error("A\xE7\xE3o n\xE3o permitida.");
    if (action === "activateBuff") store.getState().character.onlineBalloonUntil = void 0;
    if (action === "upgradeItem" && result?.success) world.counters.forges++;
  }
  const state = store.getState();
  const character = state.character;
  normalizeCosmeticOwnership(character);
  recalcStats(character);
  if (!Number.isFinite(character.gold) || character.gold < 0 || character.gold > Number.MAX_SAFE_INTEGER) throw Error("Saldo inv\xE1lido.");
  return { world: { ...world, character, races: state.races, isTickRunning: state.isTickRunning, isTraining: state.isTraining, healingUntil: state.healingUntil, deathReport: state.deathReport, lastTickResult: state.lastTickResult }, result: result ?? null, messages };
}
function rankingMetrics(w) {
  const c = w.character, sum = (values) => values.reduce((s, v) => s + (Number(v) || 0), 0);
  const hunt = Object.values(c.huntStatsByZone ?? {}), stats = c.baseStats;
  return { maxTier: Math.max(1, ...(c.unlockedZoneIds ?? []).map((id) => ZONES[id]?.tier ?? 1)), atk: stats.atk ?? 0, matk: stats.matk ?? 0, armor: stats.arm ?? 0, hp: c.hpMax, mp: c.mpMax, crit: Math.round((stats.crit ?? 0) * 1e4) / 100, resPhysical: Math.round((stats.resFisico ?? 0) * 1e4) / 100, resMagic: Math.round((stats.resMagico ?? 0) * 1e4) / 100, mastery: sum(Object.values(c.trainingMastery ?? {})), earnedXp: sum(hunt.map((h) => h.xp)), earnedGold: sum(hunt.map((h) => h.gold)), damageDealt: sum(hunt.map((h) => h.damageDealt)), damageTaken: sum(hunt.map((h) => h.damageTaken)), huntTime: Math.floor(sum(hunt.map((h) => h.activeMs)) / 1e3), lootValue: sum(hunt.map((h) => h.lootValue)), level: c.level, map: (c.unlockedZoneIds ?? ["BOSQUE_LYSS"]).length, discoveries: w.races.length, named: w.races.filter((r) => r.tier === "NOMEADA").length, syntheses: w.counters.syntheses, kills: c.totalKills ?? 0, bosses: w.counters.bosses ?? 0, gold: Math.floor(c.gold), training: sum(Object.values(c.trainingSeconds ?? {})), melee: c.skills.melee, distance: c.skills.distance, magic: c.skills.magic, defense: c.skills.defense, soul: c.skills.soul, quests: c.quests.completed.length, beasts: c.divineBeasts?.length ?? 0, cards: c.cards.length, salvaged: c.totalSalvaged ?? 0, forges: w.counters.forges, trades: w.counters.trades };
}

// server/transfers.ts
var import_node_crypto = require("node:crypto");

// src/online/rules.ts
var ONLINE_RULES = { maxCharacters: 3, maxText: 500, messageCooldownMs: 1500, maxMailItems: 10, maxTradeItems: 10, minTransferLevel: 5, tradeExpiryMs: 30 * 60 * 1e3, pvpExpiryMs: 10 * 60 * 1e3, baseFee: 10, goldFeeRate: 0.02 };
function transferFee(gold) {
  return ONLINE_RULES.baseFee + Math.ceil(gold * ONLINE_RULES.goldFeeRate);
}
var RANKING_METRICS = [
  ["level", "N\xEDvel"],
  ["map", "Biomas liberados"],
  ["discoveries", "Descobertas"],
  ["named", "Matrizes lend\xE1rias"],
  ["syntheses", "S\xEDnteses"],
  ["kills", "Criaturas derrotadas"],
  ["bosses", "Chefes derrotados"],
  ["gold", "Gold dispon\xEDvel"],
  ["training", "Tempo de treino (s)"],
  ["melee", "Treino corpo a corpo"],
  ["distance", "Treino \xE0 dist\xE2ncia"],
  ["magic", "Treino m\xE1gico"],
  ["defense", "Treino de defesa"],
  ["soul", "Treino da alma"],
  ["quests", "Miss\xF5es conclu\xEDdas"],
  ["beasts", "Bestas Divinas"],
  ["cards", "Cartas"],
  ["salvaged", "Itens desmontados"],
  ["forges", "Aprimoramentos"],
  ["trades", "Trocas conclu\xEDdas"],
  ["maxTier", "Maior Tier liberado"],
  ["atk", "Ataque f\xEDsico"],
  ["matk", "Ataque m\xE1gico"],
  ["armor", "Armadura"],
  ["hp", "Vida m\xE1xima"],
  ["mp", "Mana m\xE1xima"],
  ["crit", "Cr\xEDtico (%)"],
  ["resPhysical", "Resist\xEAncia f\xEDsica (%)"],
  ["resMagic", "Resist\xEAncia m\xE1gica (%)"],
  ["mastery", "Maestria de treino"],
  ["earnedXp", "XP ganho em ca\xE7a"],
  ["earnedGold", "Gold ganho em ca\xE7a"],
  ["damageDealt", "Dano causado"],
  ["damageTaken", "Dano recebido"],
  ["huntTime", "Tempo de ca\xE7a (s)"],
  ["lootValue", "Valor dos drops"]
];

// server/transfers.ts
var emptyOffer = () => ({ gold: 0, mythreonCoins: 0, items: [], fee: 0 });
function integer(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min || value > max) throw Error("Quantidade ou valor inv\xE1lido.");
  return value;
}
function canTransfer(c) {
  if (c.level < ONLINE_RULES.minTransferLevel || !c.tutorialCompleted) throw Error("Conclua a inicia\xE7\xE3o e alcance o n\xEDvel " + ONLINE_RULES.minTransferLevel + " para transferir gold e itens.");
}
function restoreOffer(c, offer) {
  c.gold += offer.gold + offer.fee;
  c.mythreonCoins = (c.mythreonCoins ?? 0) + (offer.mythreonCoins ?? 0);
  c.depot.push(...offer.items.map((i) => ({ ...i })));
}
function reserveOffer(c, value) {
  if (!value || typeof value !== "object") throw Error("Oferta inv\xE1lida.");
  const raw = value;
  const gold = integer(raw.gold ?? 0);
  const mythreonCoins = integer(raw.mythreonCoins ?? 0);
  const selection = raw.items ?? [];
  if (!Array.isArray(selection) || selection.length > ONLINE_RULES.maxTradeItems) throw Error("Selecione at\xE9 dez itens.");
  const ids = /* @__PURE__ */ new Set();
  const items = [];
  for (const part of selection) {
    if (typeof part.uid !== "string" || ids.has(part.uid)) throw Error("Item repetido ou inv\xE1lido.");
    ids.add(part.uid);
    const qty = integer(part.quantity, 1, 999);
    const source = c.inventory.items.find((i) => i.uid === part.uid) ?? c.depot.find((i) => i.uid === part.uid);
    if (!source || qty > source.quantity || !source.stackable && qty !== 1) throw Error("Item indispon\xEDvel ou quantidade insuficiente.");
    if (source.templateId === "UNICO_SIGILO_INICIACAO") throw Error("A rel\xEDquia de inicia\xE7\xE3o \xE9 vinculada ao personagem.");
    items.push({ ...structuredClone(source), uid: (0, import_node_crypto.randomUUID)(), quantity: qty });
  }
  const fee = transferFee(gold);
  if (c.gold < gold + fee) throw Error("Gold insuficiente para a oferta e a taxa.");
  if ((c.mythreonCoins ?? 0) < mythreonCoins) throw Error("Mythreon Coins insuficientes para a oferta.");
  c.gold -= gold + fee;
  c.mythreonCoins = (c.mythreonCoins ?? 0) - mythreonCoins;
  for (const part of selection) {
    for (const location2 of [c.inventory.items, c.depot]) {
      const idx = location2.findIndex((i) => i.uid === part.uid);
      if (idx < 0) continue;
      if (location2[idx].quantity === part.quantity) location2.splice(idx, 1);
      else location2[idx].quantity -= part.quantity;
      break;
    }
  }
  return { gold, mythreonCoins, items, fee };
}
function receiveOffer(c, offer) {
  if (c.depot.length + offer.items.length > c.depotMax) throw Error("Libere espa\xE7o no dep\xF3sito antes de receber os anexos ou concluir a troca.");
  c.gold += offer.gold;
  c.mythreonCoins = (c.mythreonCoins ?? 0) + (offer.mythreonCoins ?? 0);
  c.depot.push(...offer.items.map((i) => ({ ...i, uid: (0, import_node_crypto.randomUUID)() })));
}

// src/engine/dailyBossBattle.ts
var BOSS_KNOCKOUT_RECOVERY_MS = 3e4;
function bossBattleFor(character, runId) {
  if (character.dailyBossBattle?.runId === runId) return { ...character.dailyBossBattle };
  const hpMax = Math.max(120, Math.floor(Number(character.hpMax) || 120));
  return { runId, hp: hpMax, hpMax, damageTaken: 0, knockouts: 0, recoveryUntil: 0, lastDamage: 0 };
}
function bossRetaliation(character, runId, enemy, participants, defeated, now) {
  const battle = bossBattleFor(character, runId);
  if (battle.hp <= 0) {
    if (now < battle.recoveryUntil) throw Error(`Voc\xEA est\xE1 se recuperando do nocaute. Aguarde ${Math.ceil((battle.recoveryUntil - now) / 1e3)}s.`);
    battle.hp = battle.hpMax;
    battle.recoveryUntil = 0;
  }
  battle.lastDamage = 0;
  if (!defeated) {
    const stats = character.baseStats;
    const scale = 1 + Math.min(10, Math.max(0, participants - 1)) * 0.04;
    const armor = Math.max(0, stats.arm ?? 0) + Math.max(0, stats.def ?? 0) * 0.5;
    const raw = mitigatedDamage(enemy.atk * scale, armor);
    const resistance = clamp(enemy.damageType === "MAGICO" ? stats.resMagico ?? 0 : stats.resFisico ?? 0, 0, BALANCE.resistanceCap);
    const elemental = clamp(enemy.element ? character.elementalResistances?.[enemy.element] ?? 0 : 0, 0, BALANCE.resistanceCap);
    const total = Math.max(1, Math.round(raw * (1 - resistance) * (enemy.element ? 0.65 + 0.35 * (1 - elemental) : 1)));
    battle.lastDamage = Math.min(battle.hp, total);
    battle.hp -= battle.lastDamage;
    battle.damageTaken += battle.lastDamage;
    if (battle.hp === 0) {
      battle.knockouts += 1;
      battle.recoveryUntil = now + BOSS_KNOCKOUT_RECOVERY_MS;
    }
  }
  return battle;
}

// src/data/dailyBoss.ts
var DAILY_BOSS_TEMPLATES = [
  { id: "DAILY_BRASA", enemyId: "ESPECTRO", name: "Espectro de Brasa", title: "A Fagulha que Recusa o Fim", element: "FOGO", level: 15, baseHpMultiplier: 120 },
  { id: "DAILY_COLOSSO", enemyId: "COLOSSO", name: "Colosso de Dhor", title: "A Montanha em Movimento", element: "TERRA", level: 24, baseHpMultiplier: 100 },
  { id: "DAILY_LEVIATA", enemyId: "LEVIATA", name: "Leviat\xE3 de Azhar", title: "O Eco sob as Mar\xE9s", element: "AGUA", level: 43, baseHpMultiplier: 85 },
  { id: "DAILY_MATRIARCA", enemyId: "MATRIARCA_LODO", name: "Matriarca do Lodo", title: "A Raiz que Lembra", element: "VENENO", level: 44, baseHpMultiplier: 85 },
  { id: "DAILY_SENTINELA", enemyId: "SENTINELA_ZENITE", name: "Sentinela do Z\xEAnite", title: "O Olho sobre as Dunas", element: "METAL", level: 68, baseHpMultiplier: 70 },
  { id: "DAILY_DEVORADOR", enemyId: "DEVORADOR", name: "Devorador da Cicatriz", title: "A Fome entre os Ecos", element: "MORTE", level: 95, baseHpMultiplier: 55 }
];
function dailyCycleKey(date = /* @__PURE__ */ new Date()) {
  const utc = new Date(date);
  const segment = utc.getUTCHours() < 8 ? "M" : utc.getUTCHours() < 16 ? "T" : "N";
  return `${utc.toISOString().slice(0, 10)}-${segment}`;
}
function dailyBossTemplate(cycle = dailyCycleKey()) {
  let hash = 0;
  for (const char of cycle) hash = hash * 31 + char.charCodeAt(0) >>> 0;
  return DAILY_BOSS_TEMPLATES[hash % DAILY_BOSS_TEMPLATES.length];
}
function findBossEnemy(template) {
  return Object.values(ZONES).flatMap((zone) => zone.enemies).find((enemy) => enemy.id === template.enemyId);
}

// server/world.ts
var BOSS_ARENA_WIDTH = 1e3;
var BOSS_ARENA_HEIGHT = 560;
var BOSS_ARENA_MARGIN = 60;
var DAILY_BOSS_GUILD_REQUIRED = false;
var uuid = (id) => {
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw Error("Identificador inv\xE1lido.");
  return id;
};
var text = (v, max) => {
  if (typeof v !== "string" || v.includes("\0") || !v.trim() || v.trim().length > max) throw Error("Texto inv\xE1lido ou muito longo.");
  return v.trim();
};
async function commitCharacter(db, c) {
  normalizeCosmeticOwnership(c.state.character);
  if (!Number.isSafeInteger(c.state.character.gold) || c.state.character.gold < 0 || !Number.isSafeInteger(c.state.character.mythreonCoins ?? 0) || (c.state.character.mythreonCoins ?? 0) < 0) throw Error("Saldo fora dos limites.");
  await db.query("update public.world_characters set state=$2,revision=revision+1,updated_at=now() where id=$1", [c.id, JSON.stringify(c.state)]);
  await db.query("insert into public.world_rankings(character_id,name,metrics,current_map) values($1,$2,$3,$4) on conflict(character_id) do update set metrics=excluded.metrics,name=excluded.name,current_map=excluded.current_map,updated_at=now()", [c.id, c.name, JSON.stringify(rankingMetrics(c.state)), c.state.character.currentZoneId]);
}
async function own(db, owner, id, lock = true) {
  const lockClause = lock ? " for update" : "";
  const r = await db.query(`select * from public.world_characters where id=$1 and owner_id=$2${lockClause}`, [uuid(id), owner]);
  if (!r.rows[0]) throw Error("Personagem n\xE3o pertence a esta conta.");
  return r.rows[0];
}
async function byName(db, name) {
  const r = await db.query("select id,name,owner_id,online_at from public.world_characters where lower(name)=lower($1)", [text(name, 24)]);
  if (!r.rows[0]) throw Error("Personagem n\xE3o encontrado.");
  return r.rows[0];
}
function dailyWindow(now = /* @__PURE__ */ new Date()) {
  const utc = new Date(now);
  const hour = utc.getUTCHours();
  const startHour = hour < 8 ? 0 : hour < 16 ? 8 : 16;
  const openedAt = new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), startHour));
  return { cycleKey: dailyCycleKey(utc), openedAt, closesAt: new Date(openedAt.getTime() + 8 * 60 * 60 * 1e3) };
}
async function ensureDailyBoss(db) {
  const window = dailyWindow();
  await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,closes_at) where status='open' and closes_at<=now()");
  const existing = (await db.query("select * from public.world_daily_boss_runs where cycle_key=$1 for update", [window.cycleKey])).rows[0];
  if (existing) {
    if (existing.status === "open" && new Date(existing.closes_at).getTime() <= Date.now()) {
      await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,now()) where id=$1", [existing.id]);
      existing.status = "expired";
      existing.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    return existing;
  }
  const template = dailyBossTemplate(window.cycleKey), enemy = findBossEnemy(template);
  if (!enemy) throw Error("O Boss Di\xE1rio desta janela ainda n\xE3o foi configurado.");
  const baseHp = Math.max(1e3, Math.floor(enemy.hp * template.baseHpMultiplier)), id = (0, import_node_crypto2.randomUUID)();
  await db.query("insert into public.world_daily_boss_runs(id,cycle_key,boss_template_id,boss_name,boss_title,level,base_hp,hp_total,hp_remaining,opened_at,closes_at) values($1,$2,$3,$4,$5,$6,$7,$7,$7,$8,$9) on conflict(cycle_key) do nothing", [id, window.cycleKey, template.id, template.name, template.title, template.level, baseHp, window.openedAt, window.closesAt]);
  return (await db.query("select * from public.world_daily_boss_runs where cycle_key=$1 for update", [window.cycleKey])).rows[0];
}
function applyDailyBossXp(character, xp) {
  character.xp = Math.max(0, Number(character.xp) || 0) + Math.max(0, Math.floor(xp));
  while (character.xp >= character.xpToNext) {
    character.xp -= character.xpToNext;
    character.level += 1;
    character.statPoints = (character.statPoints ?? 0) + 3;
    character.xpToNext = xpToNextLevel(character.level);
  }
  recalcStats(character);
}
function grantDailyBossLoot(character, run, enemy, ratio, defeated) {
  const granted = [];
  const put = (item) => {
    const inventory = structuredClone(character.inventory);
    if (addItem(inventory, item)) {
      character.inventory = inventory;
      granted.push(item);
      return;
    }
    if ((character.depot ?? []).length < (character.depotMax ?? 300)) {
      character.depot ??= [];
      character.depot.push(item);
      granted.push(item);
      return;
    }
    throw Error("Libere espa\xE7o na mochila ou no dep\xF3sito para receber o loot do Boss. Sua recompensa continua dispon\xEDvel.");
  };
  for (const id of [enemy?.componentId, enemy?.essenceId].filter(Boolean)) {
    const item = makeComponent(String(id));
    item.quantity = defeated ? 2 : 1;
    put(item);
  }
  const tier = run.level >= 80 ? 5 : run.level >= 60 ? 4 : run.level >= 40 ? 3 : 2;
  const eggTemplate = DIVINE_BEAST_EGG_TEMPLATES[`OVO_BESTA_T${tier}`];
  if (eggTemplate && ratio >= 0.02 && (defeated ? 30 : 8) + Math.floor(ratio * 40) >= (run.level * 13 + Number(character.level ?? 1) * 7) % 100) {
    put(createItem({ ...eggTemplate, quantity: 1 }));
  }
  const shards = Math.max(1, Math.floor(Number(run.level || 1) * 0.18 + ratio * Number(run.level || 1) * 4));
  character.mythreonShards = (character.mythreonShards ?? 0) + shards;
  return { items: granted.map((item) => ({ templateId: item.templateId, name: item.name, quantity: item.quantity })), shards };
}
function pvpPower(state) {
  const c = state.character, skills = Object.values(c.skills ?? {}).reduce((sum, value) => sum + Number(value || 0), 0), stats = c.baseStats ?? {};
  const cardPower = cardFormationScore(c);
  return Math.max(1, Number(stats.atk ?? 0) + Number(stats.matk ?? 0) + Number(stats.arm ?? 0) * 0.8 + Number(c.hpMax ?? 0) * 0.1 + skills * 5 + Number(c.level ?? 1) * 8 + Number(c.pvpRating ?? 1e3) * 0.02 + cardPower);
}
function eloDelta(winnerRating, loserRating) {
  const expected = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return Math.max(8, Math.round(24 * (1 - expected)));
}
function pvpSeason(now = /* @__PURE__ */ new Date()) {
  const key = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const endsAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { key, endsAt };
}
function pvpTier(rating) {
  if (rating >= 1800) return "MITICO";
  if (rating >= 1600) return "PLATINA";
  if (rating >= 1400) return "OURO";
  if (rating >= 1200) return "PRATA";
  return "BRONZE";
}
function pvpLeague(rating) {
  const rows = [{ id: "BRONZE", label: "Bronze", min: 0, next: 1200 }, { id: "PRATA", label: "Prata", min: 1200, next: 1400 }, { id: "OURO", label: "Ouro", min: 1400, next: 1600 }, { id: "PLATINA", label: "Platina", min: 1600, next: 1800 }, { id: "MITICO", label: "M\xEDtico", min: 1800, next: null }];
  const league = [...rows].reverse().find((row) => rating >= row.min) || rows[0];
  return { id: league.id, label: league.label, rating, minRating: league.min, nextRating: league.next, progressToNext: league.next ? Math.max(0, Math.min(100, Math.round((rating - league.min) / (league.next - league.min) * 100))) : 100 };
}
function pvpCombatHp(state) {
  const c = state.character;
  return Math.max(120, Math.min(5e3, Math.floor(Number(c.hpMax ?? c.baseStats?.hp ?? 120) * 0.6)));
}
function pvpTurnDamage(state) {
  return Math.max(8, Math.min(900, Math.floor(pvpPower(state) * 0.055)));
}
function pvpSeasonReward(rating, wins) {
  const tier = pvpTier(rating);
  const table = { BRONZE: { gold: 2e3, shards: 10, coins: 0 }, PRATA: { gold: 5e3, shards: 25, coins: 0 }, OURO: { gold: 1e4, shards: 50, coins: 1 }, PLATINA: { gold: 2e4, shards: 100, coins: 1 }, MITICO: { gold: 4e4, shards: 200, coins: 2 } };
  const base = table[tier];
  const winBonus = Math.min(1e4, Math.max(0, wins - 5) * 250);
  return { tier, gold: base.gold + winBonus, shards: base.shards + Math.min(100, wins * 2), coins: base.coins };
}
function cardSeason(now = /* @__PURE__ */ new Date()) {
  const key = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return { key, previousKey: `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, "0")}` };
}
function cardSeasonReward(unique, total) {
  const ratio = unique / Math.max(1, total);
  if (ratio >= 1) return { tier: "COMPLETO", gold: 15e3, shards: 80, coins: 2 };
  if (ratio >= 0.8) return { tier: "MESTRE", gold: 8e3, shards: 45, coins: 1 };
  if (ratio >= 0.5) return { tier: "COLECIONADOR", gold: 3e3, shards: 20, coins: 0 };
  return null;
}
function arenaPositionFor(id) {
  let hash = 0;
  for (const char of id) hash = hash * 31 + char.charCodeAt(0) >>> 0;
  return { x: BOSS_ARENA_MARGIN + hash % (BOSS_ARENA_WIDTH - BOSS_ARENA_MARGIN * 2), y: BOSS_ARENA_MARGIN + Math.floor(hash / 97) % (BOSS_ARENA_HEIGHT - BOSS_ARENA_MARGIN * 2) };
}
function ensureArenaBattle(character, runId) {
  const existing = character.dailyBossBattle?.runId === runId ? character.dailyBossBattle : bossBattleFor(character, runId);
  existing.position ??= arenaPositionFor(character.id);
  existing.targetId ??= null;
  existing.pvpEnabled ??= true;
  existing.cooldowns ??= {};
  existing.pvpLog ??= [];
  return existing;
}
function recordArenaPvpEvent(battle, event) {
  if (!battle) return;
  battle.lastPvpEvent = event;
  battle.pvpLog = [...battle.pvpLog ?? [], event].slice(-30);
}
function arenaDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function arenaAttackRange(kind, attackId) {
  if (kind === "basic") return 170;
  if (kind === "support") return 260;
  return ["A1", "A4", "A6", "A8", "A9", "A10", "A14", "A19"].includes(attackId ?? "") ? 185 : 430;
}
function arenaCooldown(kind, stats, passiveId) {
  const speed = clamp(Number(stats?.spd ?? 0), 0, 0.8);
  if (kind === "basic") return Math.max(650, Math.round(2200 / (1 + speed)));
  if (kind === "support") return Math.max(4500, Number(SUPPORT_EFFECTS[passiveId ?? ""]?.cd ?? 6) * 1500);
  const reduce = PASSIVE_EFFECTS[passiveId ?? ""]?.cdReduce ?? 0;
  return Math.max(3500, Math.round(8500 - reduce * 1500));
}
function arenaDamage(attacker, target, kind, attackId) {
  const stats = attacker.baseStats ?? {};
  const targetStats = target.baseStats ?? {};
  const element = kind === "attack" ? attackElement(attackId) : "BASE";
  const skill = kind === "attack" ? ATTACK_SKILLS[attackId ?? ""] : void 0;
  const physical = Number(stats.atk ?? 0), magical = Number(stats.matk ?? 0);
  const raw = Math.max(1, Math.floor((kind === "attack" ? (skill?.mult ?? 1.8) * (element === "BASE" ? physical : magical) : physical) * 0.34 + Number(attacker.level ?? 1) * 1.5));
  const armor = Math.max(0, Number(targetStats.arm ?? targetStats.def ?? 0) * (1 - (skill?.pierce ?? 0)));
  const resistance = Math.max(0, Math.min(BALANCE.resistanceCap, Number(target.elementalResistances?.[element] ?? 0)));
  return Math.max(1, Math.round(mitigatedDamage(raw, armor) * elementMultiplier(element, "BASE") * (1 - resistance)));
}
async function upsertPvpSeasonStats(db, c, seasonKey) {
  await db.query("insert into public.world_pvp_season_stats(id,season_key,character_id,owner_id,rating,wins,losses,matches,updated_at) values($1,$2,$3,$4,$5,$6,$7,1,now()) on conflict(season_key,character_id) do update set owner_id=excluded.owner_id,rating=excluded.rating,wins=excluded.wins,losses=excluded.losses,matches=public.world_pvp_season_stats.matches+1,updated_at=now()", [(0, import_node_crypto2.randomUUID)(), seasonKey, c.id, c.owner_id, Number(c.state.character.pvpRating ?? 1e3), Number(c.state.character.pvpWins ?? 0), Number(c.state.character.pvpLosses ?? 0)]);
}
async function premiumEntitlement(db, owner) {
  try {
    return { configured: true, row: (await db.query("select plan_id,status,starts_at,expires_at from public.world_premium_entitlements where account_id=$1", [owner])).rows[0] ?? null };
  } catch (error) {
    if (String(error?.code) === "42P01") return { configured: false, row: null };
    throw error;
  }
}
async function syncPremium(db, owner, character) {
  const result = await premiumEntitlement(db, owner);
  if (!result.configured) return null;
  const entitlement = result.row;
  if (!entitlement) {
    character.premium = false;
    character.premiumPlanId = void 0;
    character.premiumUntil = void 0;
    return { active: false, planId: null, expiresAt: null };
  }
  const now = Date.now(), starts = new Date(entitlement.starts_at).getTime(), expires = new Date(entitlement.expires_at).getTime();
  const active = entitlement.status === "active" && Number.isFinite(starts) && starts <= now && Number.isFinite(expires) && expires > now;
  character.premium = active;
  character.premiumPlanId = active ? String(entitlement.plan_id) : void 0;
  character.premiumUntil = active ? expires : void 0;
  return { active, planId: active ? String(entitlement.plan_id) : null, expiresAt: active ? new Date(expires).toISOString() : null };
}
async function handleWorld(db, owner, request) {
  uuid(owner);
  const op = request.operation, p = request.payload ?? {};
  if (typeof op !== "string") throw Error("Opera\xE7\xE3o inv\xE1lida.");
  const readonly = ["characters", "world.read", "social.read", "ranking", "dailyBoss.read", "pvp.read", "market.read", "premium.read", "cards.season.read"];
  await db.query("insert into public.world_accounts(id) values($1) on conflict do nothing", [owner]);
  if (!readonly.includes(op)) await db.query("select id from public.world_accounts where id=$1 for update", [owner]);
  let cached = null;
  if (!readonly.includes(op)) {
    const requestId = uuid(request.requestId);
    const reserved = await db.query("insert into public.world_operations(owner_id,request_id,response) values($1,$2,null) on conflict(owner_id,request_id) do nothing returning request_id", [owner, requestId]);
    if (!reserved.rows.length) {
      const prev = await db.query("select response from public.world_operations where owner_id=$1 and request_id=$2 for update", [owner, requestId]);
      if (prev.rows[0]?.response === null) throw Error("Esta a\xE7\xE3o j\xE1 est\xE1 sendo processada. Aguarde a confirma\xE7\xE3o.");
      cached = prev.rows[0]?.response;
    }
  }
  let receipt = cached ?? {}, actor;
  if (!cached) {
    if (op === "characters") {
    } else if (op === "character.create") {
      const count = await db.query("select count(*)::int as count from public.world_characters where owner_id=$1", [owner]);
      if (count.rows[0].count >= ONLINE_RULES.maxCharacters) throw Error("Limite de tr\xEAs personagens por conta.");
      const name = text(p.name, 24).normalize("NFKC");
      if (!/^[\p{L}\p{N}][\p{L}\p{N} _-]{2,23}$/u.test(name)) throw Error("Use 3\u201324 letras, n\xFAmeros, espa\xE7os ou h\xEDfen.");
      const id2 = (0, import_node_crypto2.randomUUID)(), state = freshWorld(name, id2);
      await syncPremium(db, owner, state.character);
      await db.query("insert into public.world_characters(id,owner_id,name,state) values($1,$2,$3,$4)", [id2, owner, name, JSON.stringify(state)]);
      actor = { id: id2, owner_id: owner, name, state, revision: 0 };
      await commitCharacter(db, actor);
      receipt = { createdId: id2 };
    } else if (op === "ranking") {
      const metric = String(p.metric ?? "level");
      if (!RANKING_METRICS.some((m) => m[0] === metric)) throw Error("Ranking inv\xE1lido.");
      const page = integer(p.page ?? 0, 0, 1e3);
      const ranks = await db.query("select character_id,name,current_map,metrics,row_number() over(order by (metrics->>$1)::numeric desc,character_id) as position from public.world_rankings order by (metrics->>$1)::numeric desc,character_id limit 50 offset $2", [metric, page * 50]);
      receipt = { ranking: ranks.rows, page, metric };
    } else if (op === "premium.read") {
      const result = await premiumEntitlement(db, owner), entitlement = result.row;
      const active = Boolean(entitlement && entitlement.status === "active" && new Date(entitlement.starts_at).getTime() <= Date.now() && new Date(entitlement.expires_at).getTime() > Date.now());
      receipt = { premium: { active, planId: active ? entitlement.plan_id : null, expiresAt: active ? new Date(entitlement.expires_at).toISOString() : null, configured: result.configured } };
    } else if (op === "cards.season.read") {
      const actor2 = await own(db, owner, request.characterId);
      const season = cardSeason();
      const total = seasonCardCatalogSize(season.key);
      const unique = seasonUniqueCards(actor2.state.character.cards, season.key);
      await db.query("insert into public.world_card_season_progress(id,season_key,character_id,owner_id,unique_cards,total_cards) values($1,$2,$3,$4,$5,$6) on conflict(season_key,character_id) do update set unique_cards=greatest(public.world_card_season_progress.unique_cards,excluded.unique_cards),total_cards=public.world_card_season_progress.total_cards,updated_at=now()", [(0, import_node_crypto2.randomUUID)(), season.key, actor2.id, owner, unique, total]);
      const previous = (await db.query("select season_key,unique_cards,total_cards from public.world_card_season_progress where season_key=$1 and character_id=$2", [season.previousKey, actor2.id])).rows[0] ?? null;
      const claimed = (await db.query("select tier,reward_gold,reward_shards,reward_coins,claimed_at from public.world_card_season_rewards where season_key=$1 and character_id=$2", [season.previousKey, actor2.id])).rows[0] ?? null;
      receipt = { cards: { seasonKey: season.key, uniqueCards: unique, totalCards: total, previousSeason: { key: season.previousKey, progress: previous, reward: claimed, preview: previous ? cardSeasonReward(Number(previous.unique_cards ?? 0), Number(previous.total_cards ?? total)) : null } } };
    } else if (op === "dailyBoss.read") {
      const run = await ensureDailyBoss(db);
      const participant = request.characterId ? (await db.query("select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2", [run.id, uuid(request.characterId)])).rows[0] ?? null : null;
      const totals = (await db.query("select count(*)::int as participants,coalesce(sum(damage),0)::bigint as damage_total from public.world_daily_boss_participants where run_id=$1", [run.id])).rows[0];
      const leaderboard = (await db.query("select p.character_id,c.name,p.damage from public.world_daily_boss_participants p join public.world_characters c on c.id=p.character_id where p.run_id=$1 order by p.damage desc limit 10", [run.id])).rows;
      const history = (await db.query("select r.id,r.run_id,r.damage,r.participation_ratio,r.defeated,r.gold,r.xp,r.shards,r.loot,r.created_at,b.cycle_key,b.boss_name,b.level from public.world_daily_boss_rewards r join public.world_daily_boss_runs b on b.id=r.run_id where r.owner_id=$1 order by r.created_at desc limit 10", [owner])).rows;
      const pendingRewards = request.characterId ? (await db.query("select b.id as run_id,b.boss_name,b.level,b.cycle_key,b.status,b.closes_at,p.damage from public.world_daily_boss_participants p join public.world_daily_boss_runs b on b.id=p.run_id where p.owner_id=$1 and p.character_id=$2 and p.claimed_at is null and p.damage>0 and (b.status in ('defeated','expired') or b.closes_at<=now()) order by b.closes_at asc limit 50", [owner, uuid(request.characterId)])).rows : [];
      const roster = (await db.query("select p.character_id,c.name,p.damage,p.last_action_at,c.state->'character'->'activeRace'->>'ataqueId' as attack_id,c.state->'character'->'appearance' as appearance,c.state->'character'->'cosmeticLoadout' as cosmetics,c.state->'character'->'dailyBossBattle'->'position' as position,c.state->'character'->'dailyBossBattle'->>'pvpEnabled' as pvp_enabled from public.world_daily_boss_participants p join public.world_characters c on c.id=p.character_id where p.run_id=$1 order by coalesce(p.last_action_at,p.joined_at) desc,p.character_id limit 24", [run.id])).rows;
      const combatOwner = participant ? (await db.query("select state from public.world_characters where id=$1 and owner_id=$2", [uuid(request.characterId), owner])).rows[0] : null;
      const combat = combatOwner ? ensureArenaBattle(combatOwner.state.character, run.id) : null;
      receipt = { dailyBoss: { run, participant, combat, participants: Number(totals.participants ?? 0), damageTotal: Number(totals.damage_total ?? 0), leaderboard, history, pendingRewards, roster } };
    } else if (op === "dailyBoss.move" || op === "dailyBoss.togglePvp" || op === "dailyBoss.attackPlayer") {
      const run = await ensureDailyBoss(db);
      if (run.status !== "open") throw Error("O Boss Di\xE1rio n\xE3o est\xE1 mais em combate.");
      if (p.runId && uuid(p.runId) !== run.id) throw Error("O ciclo do Boss mudou. Atualize a arena antes de agir.");
      if (op === "dailyBoss.attackPlayer") {
        const targetId = uuid(p.targetCharacterId);
        if (targetId === request.characterId) throw Error("Escolha outro aventureiro como alvo.");
        const rows = (await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[uuid(request.characterId), targetId]])).rows;
        const attacker = rows.find((row) => row.id === request.characterId && row.owner_id === owner);
        const target = rows.find((row) => row.id === targetId);
        if (!attacker || !target) throw Error("Participante inv\xE1lido.");
        const participants = (await db.query("select character_id from public.world_daily_boss_participants where run_id=$1 and character_id=any($2::uuid[])", [run.id, [attacker.id, target.id]])).rows;
        if (participants.length !== 2) throw Error("Os dois jogadores precisam estar inscritos no Boss Di\xE1rio.");
        const friendship = (await db.query("select id from public.world_friends where status='accepted' and ((inviter_id=$1 and invitee_id=$2) or (inviter_id=$2 and invitee_id=$1)) limit 1", [attacker.id, target.id])).rows[0];
        if (friendship) throw Error("Amigos n\xE3o podem causar dano entre si.");
        const attackerBattle = ensureArenaBattle(attacker.state.character, run.id), targetBattle = ensureArenaBattle(target.state.character, run.id);
        if (attackerBattle.pvpEnabled === false) throw Error("Ative o modo PvP para atacar outros jogadores.");
        if (targetBattle.pvpEnabled === false) throw Error("Este jogador est\xE1 protegido contra PvP.");
        if (targetBattle.hp <= 0 && Date.now() < targetBattle.recoveryUntil) throw Error("Este jogador est\xE1 se recuperando do nocaute.");
        const kind = String(p.kind ?? "basic");
        if (!["basic", "attack", "support"].includes(kind)) throw Error("A\xE7\xE3o de combate inv\xE1lida.");
        const attackId = attacker.state.character.activeRace?.ataqueId;
        const distance = arenaDistance(attackerBattle.position, targetBattle.position);
        const range = arenaAttackRange(kind, attackId);
        if (distance > range) throw Error(`Alvo fora de alcance (${Math.ceil(distance)} / ${range}px).`);
        const cooldown = arenaCooldown(kind, attacker.state.character.baseStats, kind === "support" ? attacker.state.character.activeRace?.suporteId : attacker.state.character.activeRace?.passivaId);
        const readyAt = Number(attackerBattle.cooldowns?.[kind] ?? 0);
        if (readyAt > Date.now()) throw Error(`Aguarde ${Math.ceil((readyAt - Date.now()) / 1e3)}s para usar esta a\xE7\xE3o.`);
        attackerBattle.targetId = target.id;
        attackerBattle.lastAttackKind = kind;
        attackerBattle.cooldowns[kind] = Date.now() + cooldown;
        let damage = 0;
        const eventAt = Date.now();
        if (kind === "support") {
          const heal = Math.max(1, Math.floor((attacker.state.character.hpMax ?? 100) * 0.12));
          attacker.state.character.hp = Math.min(attacker.state.character.hpMax, attacker.state.character.hp + heal);
          attacker.state.character.mp = Math.min(attacker.state.character.mpMax, attacker.state.character.mp + Math.max(1, Math.floor((attacker.state.character.mpMax ?? 50) * 0.06)));
          const event = { id: (0, import_node_crypto2.randomUUID)(), at: eventAt, kind, attackerId: attacker.id, attackerName: attacker.name, targetId: target.id, targetName: target.name, damage: 0, healed: heal, targetHp: targetBattle.hp, targetHpMax: targetBattle.hpMax };
          recordArenaPvpEvent(attackerBattle, event);
          recordArenaPvpEvent(targetBattle, event);
          receipt.pvp = { kind, distance, range, healed: heal, cooldownUntil: attackerBattle.cooldowns[kind], targetId: target.id, event };
        } else {
          damage = arenaDamage(attacker.state.character, target.state.character, kind, attackId);
          targetBattle.hp = Math.max(0, targetBattle.hp - damage);
          targetBattle.damageTaken += damage;
          targetBattle.lastDamage = damage;
          targetBattle.targetId = attacker.id;
          if (targetBattle.hp === 0) {
            targetBattle.knockouts += 1;
            targetBattle.recoveryUntil = Date.now() + 3e4;
          }
          const event = { id: (0, import_node_crypto2.randomUUID)(), at: eventAt, kind, attackerId: attacker.id, attackerName: attacker.name, targetId: target.id, targetName: target.name, damage, targetHp: targetBattle.hp, targetHpMax: targetBattle.hpMax, knockedOut: targetBattle.hp === 0 };
          recordArenaPvpEvent(attackerBattle, event);
          recordArenaPvpEvent(targetBattle, event);
          receipt.pvp = { kind, distance, range, damage, knockedOut: targetBattle.hp === 0, targetId: target.id, targetName: target.name, cooldownUntil: attackerBattle.cooldowns[kind], targetHp: targetBattle.hp, event };
        }
        attacker.state.character.dailyBossBattle = attackerBattle;
        target.state.character.dailyBossBattle = targetBattle;
        await commitCharacter(db, attacker);
        await commitCharacter(db, target);
      } else {
        const arenaActor = await own(db, owner, request.characterId);
        actor = arenaActor;
        const battle = ensureArenaBattle(arenaActor.state.character, run.id);
        if (op === "dailyBoss.move") {
          const direction = String(p.direction ?? "");
          const delta = direction === "up" || direction === "w" ? { x: 0, y: -34 } : direction === "down" || direction === "s" ? { x: 0, y: 34 } : direction === "left" || direction === "a" ? { x: -34, y: 0 } : direction === "right" || direction === "d" ? { x: 34, y: 0 } : { x: 0, y: 0 };
          if (!delta.x && !delta.y) throw Error("Dire\xE7\xE3o inv\xE1lida.");
          const now = Date.now();
          if (Number(battle.cooldowns?.move ?? 0) > now) throw Error("Movimento muito r\xE1pido.");
          battle.position = { x: clamp(battle.position.x + delta.x, BOSS_ARENA_MARGIN, BOSS_ARENA_WIDTH - BOSS_ARENA_MARGIN), y: clamp(battle.position.y + delta.y, BOSS_ARENA_MARGIN, BOSS_ARENA_HEIGHT - BOSS_ARENA_MARGIN) };
          battle.cooldowns.move = now + 90;
          arenaActor.state.character.dailyBossBattle = battle;
          await commitCharacter(db, arenaActor);
          receipt.arena = { position: battle.position };
        } else {
          const enabled = Boolean(p.enabled);
          battle.pvpEnabled = enabled;
          arenaActor.state.character.dailyBossBattle = battle;
          await commitCharacter(db, arenaActor);
          receipt.arena = { pvpEnabled: enabled };
        }
      }
      const latest = (await db.query("select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2", [run.id, uuid(request.characterId)])).rows[0] ?? null;
      receipt.dailyBoss = { run, participant: latest, combat: actor?.state.character.dailyBossBattle?.runId === run.id ? actor.state.character.dailyBossBattle : null };
    } else if (op === "dailyBoss.join" || op === "dailyBoss.attack" || op === "dailyBoss.claim") {
      actor = await own(db, owner, request.characterId);
      let run;
      if (op === "dailyBoss.claim" && p.runId) {
        run = (await db.query("select * from public.world_daily_boss_runs where id=$1 for update", [uuid(p.runId)])).rows[0];
        if (!run) throw Error("Ciclo do Boss Di\xE1rio n\xE3o encontrado.");
        if (run.status === "open" && new Date(run.closes_at).getTime() <= Date.now()) {
          await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,closes_at) where id=$1", [run.id]);
          run.status = "expired";
        }
      } else {
        run = await ensureDailyBoss(db);
      }
      if (op !== "dailyBoss.claim" && p.runId && uuid(p.runId) !== run.id) throw Error("O ciclo do Boss mudou. Atualize o painel antes de participar.");
      if (op === "dailyBoss.join") {
        if (run.status !== "open") throw Error("A janela deste Boss Di\xE1rio j\xE1 foi encerrada.");
        if (DAILY_BOSS_GUILD_REQUIRED && !actor.state.character.guildId) throw Error("Este Boss Di\xE1rio exige uma guild ativa.");
        const joined = await db.query("insert into public.world_daily_boss_participants(run_id,character_id,owner_id) values($1,$2,$3) on conflict(run_id,character_id) do nothing returning character_id", [run.id, actor.id, owner]);
        if (joined.rows.length) {
          const reinforcement = Math.max(1e3, Math.floor(Number(run.base_hp) * 0.1));
          await db.query("update public.world_daily_boss_runs set hp_total=least(base_hp*4,hp_total+$2),hp_remaining=least(base_hp*4,hp_remaining+$2) where id=$1", [run.id, reinforcement]);
        }
        actor.state.character.dailyBossBattle = ensureArenaBattle(actor.state.character, run.id);
        await commitCharacter(db, actor);
      } else if (op === "dailyBoss.attack") {
        if (run.status !== "open") throw Error("O Boss Di\xE1rio n\xE3o est\xE1 mais em combate.");
        const participant2 = (await db.query("select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2 for update", [run.id, actor.id])).rows[0];
        if (!participant2) throw Error("Entre na batalha antes de atacar.");
        if (participant2.last_action_at && Date.now() - new Date(participant2.last_action_at).getTime() < 2500) throw Error("Aguarde 2,5s entre os ataques do Boss Di\xE1rio.");
        const ch = actor.state.character, base = Number(ch.baseStats?.atk ?? 0) + Number(ch.baseStats?.matk ?? 0), skills = Object.values(ch.skills ?? {}).reduce((sum, value) => sum + Number(value || 0), 0);
        const damage = Math.min(Number(run.hp_remaining), 1e5, Math.max(1, Math.floor(base * 0.45 + skills * 1.5 + Number(ch.level || 1) * 4)));
        const bossTemplate = DAILY_BOSS_TEMPLATES.find((template) => template.id === run.boss_template_id), enemy = bossTemplate ? findBossEnemy(bossTemplate) : void 0;
        if (!enemy) throw Error("Boss n\xE3o configurado para esta batalha.");
        const group = (await db.query("select count(*)::int as count from public.world_daily_boss_participants where run_id=$1", [run.id])).rows[0];
        const finalHit = damage >= Number(run.hp_remaining);
        const previousBattle = ensureArenaBattle(ch, run.id);
        const battle = bossRetaliation(ch, run.id, enemy, Number(group.count), finalHit, Date.now());
        battle.position = previousBattle.position;
        battle.targetId = previousBattle.targetId;
        battle.pvpEnabled = previousBattle.pvpEnabled;
        battle.cooldowns = previousBattle.cooldowns;
        battle.lastAttackKind = "attack";
        ch.dailyBossBattle = battle;
        await db.query("update public.world_daily_boss_participants set damage=damage+$3,last_action_at=now() where run_id=$1 and character_id=$2", [run.id, actor.id, damage]);
        await db.query("update public.world_daily_boss_runs set hp_remaining=greatest(0,hp_remaining-$2),status=case when hp_remaining-$2<=0 then 'defeated' else status end,resolved_at=case when hp_remaining-$2<=0 then coalesce(resolved_at,now()) else resolved_at end where id=$1", [run.id, damage]);
        await commitCharacter(db, actor);
        receipt.damage = damage;
        receipt.damageTaken = battle.lastDamage;
        receipt.finalHit = finalHit;
      } else {
        const participant2 = (await db.query("select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2 for update", [run.id, actor.id])).rows[0];
        if (!participant2) throw Error("Participe do Boss Di\xE1rio antes de resgatar.");
        if (participant2.claimed_at) throw Error("A recompensa desta janela j\xE1 foi resgatada.");
        if (Number(participant2.damage ?? 0) <= 0) throw Error("Cause dano ao Boss para receber uma recompensa de participa\xE7\xE3o.");
        if (!["defeated", "expired"].includes(run.status)) throw Error("A recompensa s\xF3 fica dispon\xEDvel quando a janela terminar.");
        const ratio = Math.min(1, Number(participant2.damage || 0) / Math.max(1, Number(run.hp_total || 1))), defeated = run.status === "defeated";
        const finalHitRow = defeated ? (await db.query("select character_id from public.world_daily_boss_participants where run_id=$1 and damage>0 order by last_action_at desc nulls last,joined_at desc limit 1", [run.id])).rows[0] : null;
        const finalHit = Boolean(finalHitRow?.character_id === actor.id);
        const rewardGold = Math.max(50, Math.floor((Number(run.level) * 80 + ratio * Number(run.level) * 2e3) * (defeated ? 2 : 1) * (finalHit ? 1.5 : 1))), rewardXp = Math.max(100, Math.floor((Number(run.level) * 35 + ratio * Number(run.level) * 500) * (finalHit ? 1.25 : 1)));
        actor.state.character.gold += rewardGold;
        applyDailyBossXp(actor.state.character, rewardXp);
        if (defeated) actor.state.character.dailyBossXpUntil = Math.max(Number(actor.state.character.dailyBossXpUntil ?? 0), new Date(run.closes_at).getTime());
        const bossEnemy = findBossEnemy(dailyBossTemplate(run.cycle_key));
        const bossLoot = grantDailyBossLoot(actor.state.character, run, bossEnemy, ratio, defeated);
        await db.query("insert into public.world_daily_boss_rewards(id,run_id,character_id,owner_id,damage,participation_ratio,defeated,gold,xp,shards,loot) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [(0, import_node_crypto2.randomUUID)(), run.id, actor.id, owner, Number(participant2.damage || 0), ratio, defeated, rewardGold, rewardXp, bossLoot.shards, JSON.stringify(bossLoot.items)]);
        await db.query("update public.world_daily_boss_participants set claimed_at=now() where run_id=$1 and character_id=$2", [run.id, actor.id]);
        await commitCharacter(db, actor);
        receipt.reward = { gold: rewardGold, xp: rewardXp, loot: bossLoot.items, shards: bossLoot.shards, finalHit, bonusXpUntil: actor.state.character.dailyBossXpUntil ?? null };
      }
      run = (await db.query("select * from public.world_daily_boss_runs where id=$1", [run.id])).rows[0];
      const participant = (await db.query("select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2", [run.id, actor.id])).rows[0] ?? null;
      receipt.dailyBoss = { run, participant, combat: actor.state.character.dailyBossBattle?.runId === run.id ? actor.state.character.dailyBossBattle : null };
    } else if (op === "pvp.read") {
      const ownId = request.characterId ? uuid(request.characterId) : null;
      const online = await db.query("select id,name,online_at,state->'character'->>'level' as level,state->'character'->>'pvpRating' as rating,state->'character'->>'pvpWins' as wins,state->'character'->>'pvpLosses' as losses from public.world_characters where online_at>now()-interval '90 seconds' and ($1::uuid is null or id<>$1) order by coalesce((state->'character'->>'pvpRating')::int,1000) desc,name limit 100", [ownId]);
      const matches = ownId ? (await db.query("select m.*,a.name as challenger_name,b.name as opponent_name from public.world_pvp_matches m join public.world_characters a on a.id=m.challenger_id join public.world_characters b on b.id=m.opponent_id where m.challenger_id=$1 or m.opponent_id=$1 order by m.created_at desc limit 50", [ownId])).rows : [];
      const now = /* @__PURE__ */ new Date(), season = pvpSeason(now), previous = pvpSeason(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));
      const queue = ownId ? (await db.query("select character_id,season_key,rating,status,match_id,joined_at,matched_at from public.world_pvp_queue where character_id=$1", [ownId])).rows[0] ?? null : null;
      const ownProfile = ownId ? (await db.query("select state->'character'->>'pvpRating' as rating from public.world_characters where id=$1 and owner_id=$2", [ownId, owner])).rows[0] ?? null : null;
      const currentStats = ownId ? (await db.query("select season_key,rating,wins,losses,matches from public.world_pvp_season_stats where character_id=$1 and season_key=$2", [ownId, season.key])).rows[0] ?? null : null;
      const previousStats = ownId ? (await db.query("select season_key,rating,wins,losses,matches from public.world_pvp_season_stats where character_id=$1 and season_key=$2", [ownId, previous.key])).rows[0] ?? null : null;
      const previousReward = ownId ? (await db.query("select tier,rating,wins,losses,reward_gold,reward_shards,reward_coins,claimed_at from public.world_pvp_season_rewards where character_id=$1 and season_key=$2", [ownId, previous.key])).rows[0] ?? null : null;
      const ownRating = Number(currentStats?.rating ?? ownProfile?.rating ?? 1e3);
      receipt = { pvp: { season: { key: season.key, endsAt: season.endsAt.toISOString() }, league: pvpLeague(ownRating), online: online.rows, matches, queue, currentStats, previousSeason: { key: previous.key, stats: previousStats, reward: previousReward, preview: previousStats ? pvpSeasonReward(Number(previousStats.rating ?? 1e3), Number(previousStats.wins ?? 0)) : null } } };
    } else if (op === "cards.season.claim" || op === "pvp.queue.join" || op === "pvp.queue.cancel" || op === "pvp.challenge" || op === "pvp.accept" || op === "pvp.resolve" || op === "pvp.turn" || op === "pvp.season.claim") {
      actor = await own(db, owner, request.characterId);
      if (op === "cards.season.claim") {
        const seasonKey = text(p.seasonKey, 7), season = cardSeason();
        if (seasonKey === season.key || !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(seasonKey)) throw Error("Temporada de Cards inv\xE1lida ou ainda aberta.");
        const progress = (await db.query("select * from public.world_card_season_progress where season_key=$1 and character_id=$2 for update", [seasonKey, actor.id])).rows[0];
        if (!progress) throw Error("Nenhum progresso de cole\xE7\xE3o registrado nesta temporada.");
        const previous = (await db.query("select * from public.world_card_season_rewards where season_key=$1 and character_id=$2", [seasonKey, actor.id])).rows[0];
        if (previous) throw Error("A recompensa desta cole\xE7\xE3o j\xE1 foi resgatada.");
        const reward = cardSeasonReward(Number(progress.unique_cards ?? 0), Number(progress.total_cards ?? seasonCardCatalogSize(seasonKey)));
        if (!reward) throw Error("Colecione pelo menos 50% dos Cards para resgatar a recompensa.");
        actor.state.character.gold += reward.gold;
        actor.state.character.mythreonShards = (actor.state.character.mythreonShards ?? 0) + reward.shards;
        actor.state.character.mythreonCoins = (actor.state.character.mythreonCoins ?? 0) + reward.coins;
        await db.query("insert into public.world_card_season_rewards(id,season_key,character_id,owner_id,unique_cards,total_cards,tier,reward_gold,reward_shards,reward_coins) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [(0, import_node_crypto2.randomUUID)(), seasonKey, actor.id, owner, Number(progress.unique_cards ?? 0), Number(progress.total_cards ?? seasonCardCatalogSize(seasonKey)), reward.tier, reward.gold, reward.shards, reward.coins]);
        await commitCharacter(db, actor);
        await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,0,$7,$8)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "cards.season.reward", null, actor.id, reward.gold, reward.coins, JSON.stringify([{ kind: "MYTHREON_SHARDS", quantity: reward.shards }, { kind: "CARD_SEASON_TIER", tier: reward.tier, seasonKey }])]);
        receipt = { cards: { status: "season-reward-claimed", seasonKey, reward } };
      } else if (op === "pvp.season.claim") {
        const seasonKey = text(p.seasonKey, 7);
        const current2 = pvpSeason();
        if (seasonKey === current2.key) throw Error("A temporada atual ainda n\xE3o foi encerrada.");
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(seasonKey)) throw Error("Temporada inv\xE1lida.");
        const stats = (await db.query("select * from public.world_pvp_season_stats where season_key=$1 and character_id=$2 for update", [seasonKey, actor.id])).rows[0];
        if (!stats) throw Error("Voc\xEA n\xE3o tem partidas registradas nesta temporada.");
        const previousReward = (await db.query("select * from public.world_pvp_season_rewards where season_key=$1 and character_id=$2", [seasonKey, actor.id])).rows[0];
        if (previousReward) throw Error("A recompensa desta temporada j\xE1 foi resgatada.");
        const reward = pvpSeasonReward(Number(stats.rating ?? 1e3), Number(stats.wins ?? 0));
        actor.state.character.gold += reward.gold;
        actor.state.character.mythreonShards = (actor.state.character.mythreonShards ?? 0) + reward.shards;
        actor.state.character.mythreonCoins = (actor.state.character.mythreonCoins ?? 0) + reward.coins;
        await db.query("insert into public.world_pvp_season_rewards(id,season_key,character_id,owner_id,tier,rating,wins,losses,reward_gold,reward_shards,reward_coins) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [(0, import_node_crypto2.randomUUID)(), seasonKey, actor.id, owner, reward.tier, Number(stats.rating ?? 1e3), Number(stats.wins ?? 0), Number(stats.losses ?? 0), reward.gold, reward.shards, reward.coins]);
        await commitCharacter(db, actor);
        await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,0,$7,$8)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "pvp.season.reward", null, actor.id, reward.gold, reward.coins, JSON.stringify([{ kind: "MYTHREON_SHARDS", quantity: reward.shards }, { kind: "PVP_TIER", tier: reward.tier, seasonKey }])]);
        receipt = { pvp: { status: "season-reward-claimed", seasonKey, reward } };
      } else if (op === "pvp.queue.join" || op === "pvp.queue.cancel") {
        const season = pvpSeason();
        if (op === "pvp.queue.cancel") {
          await db.query("update public.world_pvp_queue set status='cancelled',updated_at=now() where character_id=$1 and status='queued'", [actor.id]);
          receipt = { pvp: { queue: { status: "cancelled", seasonKey: season.key } } };
        } else {
          const rating = Number(actor.state.character.pvpRating ?? 1e3);
          const existing = (await db.query("select * from public.world_pvp_queue where character_id=$1 for update", [actor.id])).rows[0];
          if (existing?.status === "matched" && existing.match_id) receipt = { pvp: { queue: existing } };
          else {
            const candidate = (await db.query("select q.*,c.name,c.owner_id as opponent_owner_id,c.state from public.world_pvp_queue q join public.world_characters c on c.id=q.character_id where q.season_key=$1 and q.status='queued' and q.character_id<>$2 and abs(q.rating-$3)<=150 and c.online_at>now()-interval '90 seconds' order by q.joined_at,q.character_id for update skip locked limit 1", [season.key, actor.id, rating])).rows[0];
            if (candidate) {
              const id2 = (0, import_node_crypto2.randomUUID)();
              await db.query("insert into public.world_pvp_matches(id,season_key,challenger_id,opponent_id,challenger_owner_id,opponent_owner_id,challenger_rating_before,opponent_rating_before,expires_at,status,turn_owner,challenger_hp,opponent_hp) values($1,$2,$3,$4,$5,$6,$7,$8,$9,'open',$3,$10,$11)", [id2, season.key, actor.id, candidate.character_id, owner, candidate.opponent_owner_id, rating, Number(candidate.rating ?? 1e3), new Date(Date.now() + ONLINE_RULES.pvpExpiryMs), pvpCombatHp(actor.state), pvpCombatHp(candidate.state)]);
              await db.query("update public.world_pvp_queue set status='matched',match_id=$2,matched_at=now(),updated_at=now() where character_id=$1", [candidate.character_id, id2]);
              await db.query("insert into public.world_pvp_queue(character_id,owner_id,season_key,rating,status,match_id,matched_at) values($1,$2,$3,$4,'matched',$5,now()) on conflict(character_id) do update set owner_id=excluded.owner_id,season_key=excluded.season_key,rating=excluded.rating,status='matched',match_id=excluded.match_id,matched_at=now(),updated_at=now()", [actor.id, owner, season.key, rating, id2]);
              receipt = { pvp: { queue: { status: "matched", matchId: id2, seasonKey: season.key }, matchId: id2, status: "open" } };
            } else {
              await db.query("insert into public.world_pvp_queue(character_id,owner_id,season_key,rating,status,match_id,joined_at,matched_at,updated_at) values($1,$2,$3,$4,'queued',null,now(),null,now()) on conflict(character_id) do update set owner_id=excluded.owner_id,season_key=excluded.season_key,rating=excluded.rating,status='queued',match_id=null,matched_at=null,joined_at=case when public.world_pvp_queue.status='queued' then public.world_pvp_queue.joined_at else now() end,updated_at=now()", [actor.id, owner, season.key, rating]);
              receipt = { pvp: { queue: { status: "queued", seasonKey: season.key, rating } } };
            }
          }
        }
      } else if (op === "pvp.challenge") {
        const target = p.opponentId ? await own(db, owner, p.opponentId).catch(() => null) : await byName(db, p.target);
        if (!target) throw Error("Oponente n\xE3o encontrado.");
        if (target.id === actor.id || target.owner_id === owner) throw Error("Escolha um jogador de outra conta.");
        if (Date.now() - new Date(target.online_at).getTime() > 9e4) throw Error("O jogador precisa estar online.");
        const busy = await db.query("select id from public.world_pvp_matches where (challenger_id=any($1::uuid[]) or opponent_id=any($1::uuid[])) and status in ('invited','open')", [[actor.id, target.id]]);
        if (busy.rows.length) throw Error("Um dos jogadores j\xE1 tem um duelo ranqueado em andamento.");
        const id2 = (0, import_node_crypto2.randomUUID)();
        const targetState = (await db.query("select state from public.world_characters where id=$1", [target.id])).rows[0]?.state;
        await db.query("insert into public.world_pvp_matches(id,season_key,challenger_id,opponent_id,challenger_owner_id,opponent_owner_id,challenger_rating_before,opponent_rating_before,expires_at,turn_owner,challenger_hp,opponent_hp) values($1,$2,$3,$4,$5,$6,$7,$8,$9,null,$10,$11)", [id2, pvpSeason().key, actor.id, target.id, owner, target.owner_id, Number(actor.state.character.pvpRating ?? 1e3), Number(targetState?.character?.pvpRating ?? 1e3), new Date(Date.now() + ONLINE_RULES.pvpExpiryMs), pvpCombatHp(actor.state), pvpCombatHp(targetState)]);
        receipt = { pvp: { matchId: id2, status: "invited" } };
      } else {
        const row = (await db.query("select * from public.world_pvp_matches where id=$1 for update", [uuid(p.matchId)])).rows[0];
        if (!row) throw Error("Duelo ranqueado n\xE3o encontrado.");
        if (![row.challenger_id, row.opponent_id].includes(actor.id)) throw Error("Voc\xEA n\xE3o participa deste duelo.");
        if (row.status === "invited" && op === "pvp.accept") {
          if (row.opponent_id !== actor.id) throw Error("Somente o desafiado pode aceitar.");
          if (new Date(row.expires_at).getTime() <= Date.now()) {
            await db.query("update public.world_pvp_matches set status='expired',resolved_at=now() where id=$1", [row.id]);
            throw Error("O convite de duelo expirou.");
          }
          await db.query("update public.world_pvp_matches set status='open',turn_owner=challenger_id where id=$1", [row.id]);
          receipt = { pvp: { matchId: row.id, status: "open", turnOwner: row.challenger_id } };
        } else if (op === "pvp.turn") {
          if (row.status !== "open") throw Error("O duelo n\xE3o est\xE1 em combate.");
          if (new Date(row.expires_at).getTime() <= Date.now()) {
            await db.query("update public.world_pvp_matches set status='expired',resolved_at=now(),turn_owner=null where id=$1", [row.id]);
            throw Error("O duelo expirou.");
          }
          if (row.turn_owner !== actor.id) throw Error("Aguarde o turno do advers\xE1rio.");
          if (row.last_action_at && Date.now() - new Date(row.last_action_at).getTime() < 800) throw Error("Aguarde o pr\xF3ximo turno.");
          const rows = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[row.challenger_id, row.opponent_id]]);
          const challenger = rows.rows.find((r) => r.id === row.challenger_id), opponent = rows.rows.find((r) => r.id === row.opponent_id);
          if (!challenger || !opponent) throw Error("Participante inv\xE1lido.");
          const attacker = actor.id === challenger.id ? challenger : opponent, target = attacker.id === challenger.id ? opponent : challenger;
          const damage = pvpTurnDamage(attacker.state), challengerHp = Math.max(0, Number(row.challenger_hp ?? pvpCombatHp(challenger.state)) - (attacker.id === opponent.id ? damage : 0)), opponentHp = Math.max(0, Number(row.opponent_hp ?? pvpCombatHp(opponent.state)) - (attacker.id === challenger.id ? damage : 0));
          const entry = { round: Number(row.round ?? 1), actorId: attacker.id, actorName: attacker.name, damage, targetHp: attacker.id === challenger.id ? opponentHp : challengerHp, at: (/* @__PURE__ */ new Date()).toISOString() }, combatLog = [...Array.isArray(row.combat_log) ? row.combat_log : [], entry];
          if ((attacker.id === challenger.id ? opponentHp : challengerHp) <= 0) {
            const winner = attacker, loser = target;
            const delta = eloDelta(Number(winner.state.character.pvpRating ?? 1e3), Number(loser.state.character.pvpRating ?? 1e3));
            winner.state.character.pvpRating = Number(winner.state.character.pvpRating ?? 1e3) + delta;
            loser.state.character.pvpRating = Math.max(0, Number(loser.state.character.pvpRating ?? 1e3) - delta);
            winner.state.character.pvpWins = (winner.state.character.pvpWins ?? 0) + 1;
            loser.state.character.pvpLosses = (loser.state.character.pvpLosses ?? 0) + 1;
            await upsertPvpSeasonStats(db, winner, String(row.season_key ?? pvpSeason().key));
            await upsertPvpSeasonStats(db, loser, String(row.season_key ?? pvpSeason().key));
            await commitCharacter(db, winner);
            await commitCharacter(db, loser);
            await db.query("update public.world_pvp_matches set status='completed',winner_id=$2,challenger_rating_after=$3,opponent_rating_after=$4,challenger_hp=$5,opponent_hp=$6,turn_owner=null,combat_log=$7,resolved_at=now(),last_action_at=now() where id=$1", [row.id, winner.id, Number(challenger.state.character.pvpRating ?? 1e3), Number(opponent.state.character.pvpRating ?? 1e3), challengerHp, opponentHp, JSON.stringify(combatLog)]);
            receipt = { pvp: { matchId: row.id, status: "completed", winnerId: winner.id, winnerName: winner.name, delta, damage, round: entry.round, combatLog } };
          } else {
            await db.query("update public.world_pvp_matches set challenger_hp=$2,opponent_hp=$3,turn_owner=$4,round=round+1,combat_log=$5,last_action_at=now() where id=$1", [row.id, challengerHp, opponentHp, target.id, JSON.stringify(combatLog)]);
            receipt = { pvp: { matchId: row.id, status: "open", damage, round: entry.round, turnOwner: target.id, challengerHp, opponentHp, combatLog } };
          }
        } else if (op === "pvp.resolve") {
          if (row.turn_owner) throw Error("Este duelo usa combate por turnos. Ataque na sua vez.");
          if (row.status !== "open") throw Error("O duelo precisa ser aceito antes da resolu\xE7\xE3o.");
          if (new Date(row.expires_at).getTime() <= Date.now()) {
            await db.query("update public.world_pvp_matches set status='expired',resolved_at=now() where id=$1", [row.id]);
            throw Error("O duelo expirou.");
          }
          const rows = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[row.challenger_id, row.opponent_id]]);
          const challenger = rows.rows.find((r) => r.id === row.challenger_id), opponent = rows.rows.find((r) => r.id === row.opponent_id);
          if (!challenger || !opponent) throw Error("Participante inv\xE1lido.");
          const powerA = pvpPower(challenger.state), powerB = pvpPower(opponent.state), winner = powerA === powerB ? challenger.id < opponent.id ? challenger : opponent : powerA > powerB ? challenger : opponent, loser = winner.id === challenger.id ? opponent : challenger;
          const delta = eloDelta(Number(winner.state.character.pvpRating ?? 1e3), Number(loser.state.character.pvpRating ?? 1e3));
          winner.state.character.pvpRating = Number(winner.state.character.pvpRating ?? 1e3) + delta;
          loser.state.character.pvpRating = Math.max(0, Number(loser.state.character.pvpRating ?? 1e3) - delta);
          winner.state.character.pvpWins = (winner.state.character.pvpWins ?? 0) + 1;
          loser.state.character.pvpLosses = (loser.state.character.pvpLosses ?? 0) + 1;
          await upsertPvpSeasonStats(db, winner, String(row.season_key ?? pvpSeason().key));
          await upsertPvpSeasonStats(db, loser, String(row.season_key ?? pvpSeason().key));
          await commitCharacter(db, winner);
          await commitCharacter(db, loser);
          await db.query("update public.world_pvp_matches set status='completed',winner_id=$2,challenger_rating_after=$3,opponent_rating_after=$4,resolved_at=now() where id=$1", [row.id, winner.id, Number(challenger.state.character.pvpRating ?? 1e3), Number(opponent.state.character.pvpRating ?? 1e3)]);
          receipt = { pvp: { matchId: row.id, status: "completed", winnerId: winner.id, winnerName: winner.name, delta, challengerRating: challenger.state.character.pvpRating, opponentRating: opponent.state.character.pvpRating } };
        } else if (["completed", "expired", "cancelled"].includes(row.status)) {
          receipt = { pvp: { matchId: row.id, status: row.status, winnerId: row.winner_id } };
        } else throw Error("A\xE7\xE3o de PvP inv\xE1lida.");
      }
    } else if (op === "market.read") {
      const now = /* @__PURE__ */ new Date();
      await db.query("update public.world_market_listings set status='expired' where status='open' and expires_at<=now()");
      const query = typeof p.query === "string" ? p.query.trim().slice(0, 48) : "";
      const currency = String(p.currency ?? "ALL").toUpperCase();
      if (!["ALL", "GOLD", "COINS"].includes(currency)) throw Error("Filtro de moeda inv\xE1lido.");
      const rarity = String(p.rarity ?? "ALL").toUpperCase();
      if (!["ALL", "COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"].includes(rarity)) throw Error("Filtro de raridade inv\xE1lido.");
      const sort = String(p.sort ?? "NEWEST").toUpperCase();
      const order = sort === "PRICE_ASC" ? "price asc,created_at desc" : sort === "PRICE_DESC" ? "price desc,created_at desc" : "created_at desc";
      const page = integer(p.page ?? 0, 0, 1e3), pageSize = 24, offset = page * pageSize;
      const args = [query, currency, rarity];
      const predicate = "status='open' and ($1='' or item->>'name' ilike '%'||$1||'%' or seller_name ilike '%'||$1||'%') and ($2='ALL' or currency=$2) and ($3='ALL' or item->>'rarity'=$3)";
      const listings = (await db.query(`select id,seller_character_id,seller_name,item,currency,price,fee,expires_at,created_at from public.world_market_listings where ${predicate} order by ${order} limit $5 offset $4`, [...args, offset, pageSize])).rows;
      const templateIds = [...new Set([...listings.map((listing) => String(listing.item?.templateId ?? "")), ...p.templateId ? [text(p.templateId, 128)] : []].filter(Boolean))];
      const salesHistory = await marketSalesHistory(db, templateIds);
      const priceStats = templateIds.length ? (await db.query("select template_id,sale_events,units_sold,average_gold_price,lowest_gold_price,highest_gold_price,last_sold_at,average_mythreon_coin_price,lowest_mythreon_coin_price,highest_mythreon_coin_price from public.world_trade_item_stats where template_id=any($1::text[])", [templateIds])).rows : [];
      const summary = (await db.query(`select count(*)::int as total,coalesce(avg(price),0)::numeric as average_price,coalesce(min(price),0)::numeric as min_price,coalesce(max(price),0)::numeric as max_price from public.world_market_listings where ${predicate}`, args)).rows[0] ?? { total: 0, average_price: 0, min_price: 0, max_price: 0 };
      const mine = request.characterId ? (await db.query("select id,seller_character_id,seller_name,item,currency,price,fee,status,expires_at,created_at,sold_at,buyer_character_id from public.world_market_listings where seller_character_id=$1 order by created_at desc limit 50", [uuid(request.characterId)])).rows : [];
      receipt = { market: { listings, mine, priceStats, salesHistory, summary: { total: Number(summary.total ?? 0), averagePrice: Number(summary.average_price ?? 0), minPrice: Number(summary.min_price ?? 0), maxPrice: Number(summary.max_price ?? 0) }, page, pageSize, filters: { query, currency, rarity, sort }, now: now.toISOString() } };
    } else if (op === "market.list" || op === "market.buy" || op === "market.cancel") {
      actor = await own(db, owner, request.characterId);
      if (op === "market.list") {
        canTransfer(actor.state.character);
        const currency = String(p.currency ?? "GOLD").toUpperCase();
        if (currency !== "GOLD" && currency !== "COINS") throw Error("Escolha Gold ou Mythreon Coins.");
        const price = integer(p.price, 1, 1e12);
        const selection = p.item;
        if (!selection || typeof selection.uid !== "string") throw Error("Escolha um item da mochila ou dep\xF3sito.");
        const offer = reserveOffer(actor.state.character, { gold: 0, mythreonCoins: 0, items: [{ uid: selection.uid, quantity: integer(selection.quantity ?? 1, 1, 999) }] });
        actor.state.character.gold += transferFee(0);
        const item = offer.items[0];
        const id2 = (0, import_node_crypto2.randomUUID)();
        const fee = Math.min(price, Math.max(currency === "GOLD" ? 10 : 1, Math.floor(price * 0.05)));
        await db.query("insert into public.world_market_listings(id,seller_character_id,seller_owner_id,seller_name,item,currency,price,fee,expires_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", [id2, actor.id, owner, actor.name, JSON.stringify(item), currency, price, fee, new Date(Date.now() + 48 * 60 * 60 * 1e3)]);
        await commitCharacter(db, actor);
        receipt = { market: { listingId: id2, status: "open", fee } };
      } else {
        const listing = (await db.query("select * from public.world_market_listings where id=$1 for update", [uuid(p.listingId)])).rows[0];
        if (!listing) throw Error("An\xFAncio n\xE3o encontrado.");
        if (listing.status === "open" && new Date(listing.expires_at).getTime() <= Date.now()) {
          await db.query("update public.world_market_listings set status='expired' where id=$1", [listing.id]);
          listing.status = "expired";
        }
        if (op === "market.cancel") {
          if (listing.seller_character_id !== actor.id || listing.seller_owner_id !== owner) throw Error("Somente o vendedor pode cancelar o an\xFAncio.");
          if (!["open", "expired"].includes(listing.status)) throw Error("Este an\xFAncio j\xE1 foi devolvido ou vendido.");
          restoreOffer(actor.state.character, { gold: 0, mythreonCoins: 0, items: [listing.item], fee: 0 });
          await db.query("update public.world_market_listings set status='cancelled' where id=$1", [listing.id]);
          await commitCharacter(db, actor);
          receipt = { market: { listingId: listing.id, status: "cancelled" } };
        } else {
          if (listing.status !== "open") throw Error("Este an\xFAncio j\xE1 foi encerrado.");
          if (listing.seller_owner_id === owner) throw Error("Voc\xEA n\xE3o pode comprar o pr\xF3prio an\xFAncio.");
          canTransfer(actor.state.character);
          const seller = (await db.query("select * from public.world_characters where id=$1 and owner_id=$2 for update", [listing.seller_character_id, listing.seller_owner_id])).rows[0];
          if (!seller) throw Error("Vendedor n\xE3o encontrado.");
          const price = Number(listing.price), fee = Math.min(price, Number(listing.fee));
          if (listing.currency === "GOLD") {
            if (actor.state.character.gold < price) throw Error("Gold insuficiente.");
            actor.state.character.gold -= price;
            seller.state.character.gold += price - fee;
          } else {
            if ((actor.state.character.mythreonCoins ?? 0) < price) throw Error("Mythreon Coins insuficientes.");
            actor.state.character.mythreonCoins = (actor.state.character.mythreonCoins ?? 0) - price;
            seller.state.character.mythreonCoins = (seller.state.character.mythreonCoins ?? 0) + price - fee;
          }
          receiveOffer(actor.state.character, { gold: 0, mythreonCoins: 0, items: [listing.item], fee: 0 });
          await db.query("update public.world_market_listings set status='sold',buyer_character_id=$2,buyer_owner_id=$3,sold_at=now() where id=$1", [listing.id, actor.id, owner]);
          await commitCharacter(db, seller);
          await commitCharacter(db, actor);
          await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "market", seller.id, actor.id, listing.currency === "GOLD" ? price : 0, fee, listing.currency === "COINS" ? price : 0, JSON.stringify([listing.item])]);
          receipt = { market: { listingId: listing.id, status: "sold", fee } };
        }
      }
    } else if (op.startsWith("trade.")) {
      if (op === "trade.invite") {
        const target = await byName(db, p.target);
        const pair = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[uuid(request.characterId), target.id]]);
        actor = pair.rows.find((r) => r.id === request.characterId && r.owner_id === owner);
        if (!actor) throw Error("Personagem inv\xE1lido.");
        canTransfer(actor.state.character);
        if (Date.now() - new Date(target.online_at).getTime() > 9e4) throw Error("O jogador precisa estar online para receber o convite de troca.");
        if (target.owner_id === owner) throw Error("Escolha um jogador de outra conta.");
        const busy = await db.query("select id from public.world_trades where (a_id=any($1::uuid[]) or b_id=any($1::uuid[])) and status in ('invited','open')", [[actor.id, target.id]]);
        if (busy.rows.length) throw Error("Um dos jogadores j\xE1 tem uma troca em andamento.");
        const id2 = (0, import_node_crypto2.randomUUID)();
        await db.query("insert into public.world_trades(id,a_id,b_id,a_owner,b_owner,expires_at) values($1,$2,$3,$4,$5,$6)", [id2, actor.id, target.id, owner, target.owner_id, new Date(Date.now() + ONLINE_RULES.tradeExpiryMs)]);
        receipt = { tradeId: id2 };
      } else {
        const preview = await db.query("select * from public.world_trades where id=$1", [uuid(p.tradeId)]);
        if (!preview.rows[0]) throw Error("Troca n\xE3o encontrada.");
        const t0 = preview.rows[0];
        if (t0.a_owner !== owner && t0.b_owner !== owner) throw Error("Voc\xEA n\xE3o participa desta troca.");
        const rows = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[t0.a_id, t0.b_id]]);
        const a = rows.rows.find((r) => r.id === t0.a_id), b = rows.rows.find((r) => r.id === t0.b_id);
        const t = (await db.query("select * from public.world_trades where id=$1 for update", [t0.id])).rows[0];
        const isA = t.a_owner === owner, me = isA ? a : b;
        actor = me;
        let offerA = t.offer_a, offerB = t.offer_b, readyA = t.ready_a, readyB = t.ready_b;
        if (request.characterId !== me.id) throw Error("Use o personagem que participa da troca.");
        if (["completed", "cancelled", "expired"].includes(t.status)) {
          receipt = { tradeId: t.id, status: t.status };
        } else if (new Date(t.expires_at).getTime() <= Date.now() || op === "trade.cancel") {
          restoreOffer(a.state.character, offerA);
          restoreOffer(b.state.character, offerB);
          const status = op === "trade.cancel" ? "cancelled" : "expired";
          await db.query("update public.world_trades set status=$2,offer_a=$3,offer_b=$3,ready_a=false,ready_b=false,revision=revision+1 where id=$1", [t.id, status, JSON.stringify(emptyOffer())]);
          await commitCharacter(db, a);
          await commitCharacter(db, b);
          receipt = { tradeId: t.id, status };
        } else if (op === "trade.accept") {
          if (isA || t.status !== "invited") throw Error("Convite n\xE3o dispon\xEDvel.");
          canTransfer(b.state.character);
          await db.query("update public.world_trades set status='open',revision=revision+1 where id=$1", [t.id]);
          receipt = { tradeId: t.id };
        } else if (op === "trade.offer" || op === "trade.confirm") {
          if (t.status !== "open") throw Error("Aguarde aceitar o convite.");
          canTransfer(me.state.character);
          if (integer(p.revision) !== Number(t.revision)) throw Error("A oferta mudou. Confira os dois lados novamente.");
          if (op === "trade.offer") {
            restoreOffer(me.state.character, isA ? offerA : offerB);
            const offer = reserveOffer(me.state.character, p.offer);
            if (isA) offerA = offer;
            else offerB = offer;
            readyA = false;
            readyB = false;
            await commitCharacter(db, me);
          } else {
            if (isA) {
              if (!offerA.fee) offerA = reserveOffer(a.state.character, { gold: 0, items: [] });
              readyA = true;
            } else {
              if (!offerB.fee) offerB = reserveOffer(b.state.character, { gold: 0, items: [] });
              readyB = true;
            }
            await commitCharacter(db, me);
          }
          if (readyA && readyB) {
            receiveOffer(a.state.character, offerB);
            receiveOffer(b.state.character, offerA);
            a.state.counters.trades++;
            b.state.counters.trades++;
            await commitCharacter(db, a);
            await commitCharacter(db, b);
            await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "trade", a.id, b.id, offerA.gold + offerB.gold, offerA.fee + offerB.fee, (offerA.mythreonCoins ?? 0) + (offerB.mythreonCoins ?? 0), JSON.stringify({ a: offerA.items, b: offerB.items })]);
            const quantity = (items) => items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
            await db.query("insert into public.world_trade_transactions(id,trade_id,seller_character_id,seller_owner_id,buyer_character_id,buyer_owner_id,gold_price,mythreon_coins_price,fee_gold,items,counterparty_items,item_count) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12),($13,$2,$5,$6,$3,$4,$14,$15,$16,$17,$18,$19) on conflict(trade_id,seller_character_id,buyer_character_id) do nothing", [(0, import_node_crypto2.randomUUID)(), t.id, a.id, t.a_owner, b.id, t.b_owner, offerB.gold, offerB.mythreonCoins ?? 0, offerA.fee, JSON.stringify(offerA.items), JSON.stringify(offerB.items), quantity(offerA.items), (0, import_node_crypto2.randomUUID)(), offerA.gold, offerA.mythreonCoins ?? 0, offerB.fee, JSON.stringify(offerB.items), JSON.stringify(offerA.items), quantity(offerB.items)]);
            await db.query(`insert into public.world_trade_item_stats(template_id,sale_events,units_sold,average_gold_price,lowest_gold_price,highest_gold_price,last_sold_at,average_mythreon_coin_price,lowest_mythreon_coin_price,highest_mythreon_coin_price) select item->>'templateId',count(*)::bigint,coalesce(sum((item->>'quantity')::numeric),0)::bigint,avg(gold_price)::numeric(20,2),min(gold_price),max(gold_price),max(completed_at),avg(mythreon_coins_price)::numeric(20,2),min(mythreon_coins_price),max(mythreon_coins_price) from public.world_trade_transactions tx cross join lateral jsonb_array_elements(tx.items) item where item ? 'templateId' group by item->>'templateId' on conflict(template_id) do update set sale_events=excluded.sale_events,units_sold=excluded.units_sold,average_gold_price=excluded.average_gold_price,lowest_gold_price=excluded.lowest_gold_price,highest_gold_price=excluded.highest_gold_price,last_sold_at=excluded.last_sold_at,average_mythreon_coin_price=excluded.average_mythreon_coin_price,lowest_mythreon_coin_price=excluded.lowest_mythreon_coin_price,highest_mythreon_coin_price=excluded.highest_mythreon_coin_price`);
            await db.query("update public.world_trades set status='completed',ready_a=true,ready_b=true,revision=revision+1 where id=$1", [t.id]);
            receipt = { tradeId: t.id, status: "completed" };
          } else {
            await db.query("update public.world_trades set offer_a=$2,offer_b=$3,ready_a=$4,ready_b=$5,revision=revision+1 where id=$1", [t.id, JSON.stringify(offerA), JSON.stringify(offerB), readyA, readyB]);
            receipt = { tradeId: t.id };
          }
        } else throw Error("A\xE7\xE3o de troca inv\xE1lida.");
      }
    } else {
      actor = await own(db, owner, request.characterId, op !== "social.read");
      if (op === "world.read" || op === "world.command") {
        if (op === "world.command" && (typeof p.action !== "string" || !Array.isArray(p.args) || p.args.length > 3)) throw Error("Comando inv\xE1lido.");
        const premium = await syncPremium(db, owner, actor.state.character);
        const executed = executeGame(actor.state, op === "world.command" ? p.action : void 0, p.args ?? []);
        actor.state = executed.world;
        receipt = { result: executed.result, messages: executed.messages, premium };
        await commitCharacter(db, actor);
        await db.query("update public.world_characters set online_at=now() where id=$1", [actor.id]);
      } else if (op === "message.send") {
        const account = (await db.query("select muted_until from public.world_accounts where id=$1", [owner])).rows[0];
        if (account.muted_until && new Date(account.muted_until) > /* @__PURE__ */ new Date()) throw Error("Chat temporariamente restrito.");
        const recent = await db.query("select created_at from public.world_messages where sender_owner=$1 order by created_at desc limit 1", [owner]);
        if (recent.rows[0] && Date.now() - new Date(recent.rows[0].created_at).getTime() < ONLINE_RULES.messageCooldownMs) throw Error("Aguarde um instante antes da pr\xF3xima mensagem.");
        const body = text(p.body, 500), target = p.target ? await byName(db, p.target) : null;
        const channel = target ? "global" : ["global", "trade", "help"].includes(String(p.channel)) ? String(p.channel) : "global";
        await db.query("insert into public.world_messages(id,sender_id,sender_owner,sender_name,recipient_id,recipient_owner,body,channel) values($1,$2,$3,$4,$5,$6,$7,$8)", [(0, import_node_crypto2.randomUUID)(), actor.id, owner, actor.name, target?.id ?? null, target?.owner_id ?? null, body, channel]);
      } else if (op === "friend.invite") {
        const target = await byName(db, p.target);
        if (target.id === actor.id) throw Error("Escolha outro personagem.");
        await db.query("insert into public.world_friends(id,inviter_id,invitee_id,inviter_owner,invitee_owner) values($1,$2,$3,$4,$5) on conflict do nothing", [(0, import_node_crypto2.randomUUID)(), actor.id, target.id, owner, target.owner_id]);
      } else if (op === "friend.accept" || op === "friend.remove") {
        const row = (await db.query("select * from public.world_friends where id=$1 for update", [uuid(p.id)])).rows[0];
        if (!row || ![row.inviter_id, row.invitee_id].includes(actor.id)) throw Error("Convite n\xE3o encontrado.");
        if (op === "friend.accept") {
          if (row.invitee_id !== actor.id) throw Error("Somente o destinat\xE1rio pode aceitar.");
          await db.query("update public.world_friends set status='accepted' where id=$1", [row.id]);
        } else await db.query("delete from public.world_friends where id=$1", [row.id]);
      } else if (op === "mail.send") {
        canTransfer(actor.state.character);
        if (typeof p.body === "string" && p.body.includes("\0")) throw Error("Mensagem inv\xE1lida.");
        const target = await byName(db, p.target);
        if (target.id === actor.id) throw Error("Escolha outro personagem.");
        const offer = reserveOffer(actor.state.character, p.offer);
        const id2 = (0, import_node_crypto2.randomUUID)();
        await db.query("insert into public.world_mail(id,sender_id,recipient_id,sender_owner,recipient_owner,sender_name,subject,body,gold,mythreon_coins,items,fee) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [id2, actor.id, target.id, owner, target.owner_id, actor.name, text(p.subject, 80), typeof p.body === "string" ? p.body.slice(0, 1e3) : "", offer.gold, offer.mythreonCoins, JSON.stringify(offer.items), offer.fee]);
        await commitCharacter(db, actor);
        receipt = { mailId: id2 };
        await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "mail.send", actor.id, target.id, offer.gold, offer.fee, offer.mythreonCoins, JSON.stringify(offer.items)]);
      } else if (op === "mail.claim") {
        const mail = (await db.query("select * from public.world_mail where id=$1 and recipient_id=$2 for update", [uuid(p.id), actor.id])).rows[0];
        if (!mail) throw Error("Correio n\xE3o encontrado.");
        if (mail.claimed_at) throw Error("Este correio j\xE1 foi recebido.");
        receiveOffer(actor.state.character, { gold: Number(mail.gold), mythreonCoins: Number(mail.mythreon_coins ?? 0), items: mail.items, fee: 0 });
        await db.query("update public.world_mail set claimed_at=now() where id=$1", [mail.id]);
        await commitCharacter(db, actor);
      } else if (op !== "social.read") throw Error("Opera\xE7\xE3o n\xE3o permitida.");
    }
    if (!readonly.includes(op)) await db.query("update public.world_operations set response=$3 where owner_id=$1 and request_id=$2", [owner, request.requestId, JSON.stringify(receipt)]);
  }
  const list = (await db.query("select id,name,revision,created_at from public.world_characters where owner_id=$1 order by created_at", [owner])).rows;
  const id = actor?.id ?? request.characterId;
  let current = null;
  if (id) {
    const row = (await db.query("select id,name,state,revision from public.world_characters where id=$1 and owner_id=$2", [uuid(id), owner])).rows[0];
    if (!row) throw Error("Personagem n\xE3o encontrado.");
    current = row;
  }
  let social = void 0;
  if (op === "social.read") {
    if (!current) throw Error("Selecione um personagem.");
    const friends = (await db.query("select f.*,a.name as inviter_name,b.name as invitee_name,a.online_at as inviter_online_at,b.online_at as invitee_online_at from public.world_friends f join public.world_characters a on a.id=f.inviter_id join public.world_characters b on b.id=f.invitee_id where f.inviter_id=$1 or f.invitee_id=$1 order by f.created_at desc", [id])).rows;
    const globalMessages = (await db.query("select id,sender_id,sender_name,recipient_id,body,channel,created_at from public.world_messages where recipient_id is null order by created_at desc limit 150")).rows;
    const privateMessages = (await db.query("select m.id,m.sender_id,m.sender_name,m.recipient_id,r.name as recipient_name,m.body,m.channel,m.created_at from public.world_messages m left join public.world_characters r on r.id=m.recipient_id where m.recipient_id is not null and (m.sender_id=$1 or m.recipient_id=$1) order by m.created_at desc limit 100", [id])).rows;
    const messages = [...globalMessages, ...privateMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const mail = (await db.query("select m.*,r.name as recipient_name from public.world_mail m join public.world_characters r on r.id=m.recipient_id where m.sender_id=$1 or m.recipient_id=$1 order by (m.recipient_id=$1 and m.claimed_at is null) desc,case when m.recipient_id=$1 and m.claimed_at is null then m.created_at end asc,m.created_at desc limit 100", [id])).rows;
    const trades = (await db.query("select t.*,a.name as a_name,b.name as b_name from public.world_trades t join public.world_characters a on a.id=t.a_id join public.world_characters b on b.id=t.b_id where t.a_id=$1 or t.b_id=$1 order by t.created_at desc limit 20", [id])).rows;
    const tradeHistory = (await db.query("select tx.*,s.name as seller_name,b.name as buyer_name from public.world_trade_transactions tx join public.world_characters s on s.id=tx.seller_character_id join public.world_characters b on b.id=tx.buyer_character_id where tx.seller_character_id=$1 or tx.buyer_character_id=$1 order by tx.completed_at desc limit 50", [id])).rows;
    const tradeStats = (await db.query("select * from public.world_trade_item_stats order by units_sold desc,template_id limit 200")).rows;
    const online = (await db.query("select id,name from public.world_characters where online_at>now()-interval '90 seconds' order by name limit 200")).rows;
    const onlineTotal = Number((await db.query("select count(*)::int as count from public.world_characters where online_at>now()-interval '90 seconds'")).rows[0].count);
    social = { friends, messages, mail, trades, tradeHistory, tradeStats, online, onlineTotal };
  }
  return { ok: true, ...receipt, characters: list, current, social };
}

// server/http.ts
var pool;
var config = { maxDuration: 60 };
async function handler(req, res) {
  const allowed = (process.env.WORLD_ALLOWED_ORIGINS ?? "https://mythreon-online.vercel.app,mythreon://game,http://localhost:5173,http://127.0.0.1:5173").split(",").map((x) => x.trim());
  const origin = req.headers.origin;
  if (origin && !allowed.includes(origin)) {
    res.statusCode = 403;
    return res.end(JSON.stringify({ error: "Origem n\xE3o autorizada." }));
  }
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "M\xE9todo n\xE3o permitido." }));
  }
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || !process.env.DATABASE_URL) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "O mundo online ainda n\xE3o foi configurado." }));
  }
  let client;
  try {
    const token = String(req.headers.authorization ?? "");
    if (!token.startsWith("Bearer ") || token.length > 1e4) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Entre na sua conta." }));
    }
    const auth = await fetch(url.replace(/\/$/, "") + "/auth/v1/user", { headers: { apikey: key, Authorization: token }, signal: AbortSignal.timeout(8e3) });
    if (!auth.ok) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Sess\xE3o expirada. Entre novamente." }));
    }
    const user = await auth.json();
    if (!user.id || !user.email_confirmed_at) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "Confirme seu e-mail antes de entrar no mundo online." }));
    }
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || JSON.stringify(body).length > 128e3) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Solicita\xE7\xE3o inv\xE1lida." }));
    }
    const sslCa = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n").trim();
    pool ??= new import_pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true, ...sslCa ? { ca: sslCa } : {} }, max: 3, idleTimeoutMillis: 1e4, connectionTimeoutMillis: 8e3 });
    client = await pool.connect();
    await client.query("begin");
    await client.query("set local statement_timeout='15s'");
    const result = await handleWorld(client, user.id, body);
    await client.query("commit");
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (error) {
    if (client) await client.query("rollback").catch(() => {
    });
    const code = String(error?.code ?? "");
    const message = code === "23505" ? "Este nome de personagem j\xE1 est\xE1 em uso." : code === "28P01" || code === "28000" ? "A senha do banco recusou a conex\xE3o. Atualize DATABASE_URL com a senha atual do Supabase." : code === "ENOTFOUND" || code === "EAI_AGAIN" ? "O host do banco n\xE3o foi encontrado. Use a URL Transaction pooler do Supabase." : code === "ECONNREFUSED" || code === "ETIMEDOUT" ? "O banco recusou a conex\xE3o. Confira a URL Transaction pooler e a porta 6543." : code === "SELF_SIGNED_CERT_IN_CHAIN" ? "O certificado CA do Supabase n\xE3o foi aceito. Recole o arquivo .crt inteiro em DATABASE_SSL_CA, incluindo BEGIN/END CERTIFICATE." : code === "42P01" ? "As tabelas online ainda n\xE3o foram aplicadas neste banco." : code === "23502" ? "O banco est\xE1 com uma migra\xE7\xE3o incompleta. Reaplique as migra\xE7\xF5es online." : code === "22P02" ? "A solicita\xE7\xE3o cont\xE9m um identificador inv\xE1lido. Atualize a p\xE1gina e tente novamente." : code ? "N\xE3o foi poss\xEDvel concluir. Confira a configura\xE7\xE3o do banco online." : error instanceof Error ? error.message : "N\xE3o foi poss\xEDvel concluir.";
    console.error("world request failed", { code, message: error?.message, hasCa: Boolean(process.env.DATABASE_SSL_CA), caLength: process.env.DATABASE_SSL_CA?.length ?? 0 });
    res.statusCode = code ? 500 : 400;
    res.end(JSON.stringify({ error: message }));
  } finally {
    client?.release();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
