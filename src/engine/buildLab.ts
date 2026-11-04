import { Character, Enemy, ItemStats, Race, Zone } from "../types";
import { ZONES } from "../data/zones";
import { ALL_EQUIPMENT_TEMPLATES, POTION_TEMPLATES } from "../data/items";
import { DIVINE_BEASTS } from "../data/divineBeasts";
import { getBeastCombat } from "../data/beastCombat";
import { getPotionUsePrice } from "../data/potionEconomy";
import { recalcStats, xpToNextLevel } from "./stats";
import { processTick } from "./combat";
import { RARITY_MULT } from "./drops";
import { equipItem } from "./inventory";
import { getItemScore } from "./itemCompare";
import { trainingXpNeeded } from "./training";

export interface LabResult {
  enemyId: string; enemyName: string; requiredLevel: number; locked: boolean;
  wins: number; trials: number; timeouts: number; seconds: number; damageTaken: number;
  potionGold: number; gold: number; netGold: number; manaStarved: number; damageDealt: number;
}
export interface LabPlan {
  id: string; title: string; steps: string[]; hypothetical: boolean; trainingMinutes?: number;
  stats: ItemStats; result: LabResult;
}
export interface LabReport {
  zoneId: string; at: number; seed: number; level: number; name: string;
  stats: ItemStats; needsRest: boolean; currentGold: number; currentStamina: number; enemies: LabResult[];
  targetId?: string; plans: LabPlan[]; endurance?: LabResult;
}
const TRIALS = 20;
const MAX_TICKS = 120;
// Executar no Worker: relógio e aleatoriedade ficam isolados da hunt e são restaurados.
export function simulateEnemy(snapshot: Character, zone: Zone, enemy: Enemy, seed = 73129, kills = 1): LabResult {
  const result: LabResult = { enemyId: enemy.id, enemyName: enemy.name, requiredLevel: Math.max(zone.minLevel, enemy.minLevel ?? 1), locked: snapshot.level < Math.max(zone.minLevel, enemy.minLevel ?? 1), wins: 0, trials: TRIALS, timeouts: 0, seconds: 0, damageTaken: 0, potionGold: 0, gold: 0, netGold: 0, manaStarved: 0, damageDealt: 0 };
  if (result.locked) { result.trials = 0; return result; }
  const random = Math.random, clock = Date.now;
  const startTime = clock();
  try {
    for (let trial = 0; trial < TRIALS; trial++) {
      let rng = (seed + trial * 104729) >>> 0, now = startTime;
      Math.random = () => ((rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0) / 4294967296);
      Date.now = () => now;
      const char = structuredClone(snapshot);
      recalcStats(char); char.hp = char.hpMax; char.mp = char.mpMax;
      char.activeEnemyId = enemy.id; char.enemyHp = undefined; char.enemyHpId = undefined;
      char.fightEnemyId = undefined; char.tickCount = 0;
      char.staminaOnline = 120; char.staminaOffline = 480;
      char.huntStatsByZone = {}; char.trainingSkill = null;
      let victories = 0, starved = false;
      for (let tick = 0; tick < MAX_TICKS * kills; tick++) {
        now += 3000; char.lastTick = now;
        const bond = getBeastCombat(char);
        if (bond && ((char.tickCount ?? 0) + 1) % bond.cooldown === 0 && char.mp < bond.mana) starved = true;
        const step = processTick(char, zone, false);
        recalcStats(char);
        result.seconds += 3; result.damageTaken += step.damageTaken ?? 0; result.damageDealt += step.damageDealt ?? 0;
        result.potionGold += step.goldSpentPotions ?? 0; result.gold += step.gold;
        starved ||= step.log.some(line => line.includes("Mana insuficiente"));
        victories += step.kills;
        if (victories >= kills) { result.wins++; break; }
        if (step.death) break;
        if (tick === MAX_TICKS * kills - 1) result.timeouts++;
      }
      if (starved) result.manaStarved++;
    }
  } finally { Math.random = random; Date.now = clock; }
  result.seconds = Math.round(result.seconds / TRIALS);
  result.damageTaken = Math.round(result.damageTaken / TRIALS);
  result.damageDealt = Math.round(result.damageDealt / TRIALS);
  result.potionGold = Math.round(result.potionGold / TRIALS);
  result.gold = Math.round(result.gold / TRIALS); result.netGold = result.gold - result.potionGold;
  return result;
}
function potionPlan(char: Character, zone: Zone): string[] {
  char.autoHpPotionEnabled = true; char.autoMpPotionEnabled = true;
  char.autoHpPotionId = `POCAO_VIDA_${zone.tier}`; char.autoHpPotionPercent = 65;
  char.autoMpPotionId = `POCAO_MANA_${Math.min(zone.tier, 3)}`; char.autoMpPotionPercent = 40;
  return [`${POTION_TEMPLATES[char.autoHpPotionId]?.name}: ativar em 65%, ${getPotionUsePrice(char.autoHpPotionId)}g por uso.`, `${POTION_TEMPLATES[char.autoMpPotionId]?.name}: ativar em 40%, ${getPotionUsePrice(char.autoMpPotionId)}g por uso.`, `Orçamento limitado aos ${Math.floor(char.gold)} gold atuais; não foi acrescentado gold.`];
}
export function analyzeBuild(snapshot: Character, zoneId: string, progress?: (text: string) => void, races: Race[] = [], compareCollection = false): LabReport {
  const zone = ZONES[zoneId];
  if (!zone) throw new Error("Mapa inválido.");
  const char = structuredClone(snapshot); recalcStats(char);
  const seed = 73129;
  const report: LabReport = { zoneId, at: Date.now(), seed, level: char.level, name: char.name, stats: { ...char.baseStats }, needsRest: char.hp < char.hpMax || char.mp < char.mpMax, currentGold: char.gold, currentStamina: char.staminaOnline ?? 120, enemies: [], plans: [] };
  for (const enemy of zone.enemies) {
    progress?.(`Testando ${enemy.name}…`);
    report.enemies.push(simulateEnemy(char, zone, enemy, seed));
  }
  const eligible = report.enemies.filter(row => !row.locked);
  const bottleneck = [...eligible].sort((a, b) => a.wins - b.wins || b.seconds - a.seconds)[0];
  const boss = zone.enemies.find(enemy => enemy.isBoss && char.level >= Math.max(zone.minLevel, enemy.minLevel ?? 1));
  const target = bottleneck && bottleneck.wins < 18 ? zone.enemies.find(enemy => enemy.id === bottleneck.enemyId) : boss ?? (bottleneck ? zone.enemies.find(enemy => enemy.id === bottleneck.enemyId) : undefined);
  if (!target) return report;
  report.targetId = target.id;
  const evaluate = (id: string, title: string, candidate: Character, steps: string[], hypothetical = false, trainingMinutes?: number) => {
    progress?.(`Comparando: ${title}…`); recalcStats(candidate);
    report.plans.push({ id, title, steps, hypothetical, trainingMinutes, stats: { ...candidate.baseStats }, result: simulateEnemy(candidate, zone, target, seed) });
  };
  const potions = structuredClone(char);
  evaluate("potions", "Configurar poções", potions, potionPlan(potions, zone));
  const owned = structuredClone(char);
  const changes: string[] = [];
  const sorted = [...owned.inventory.items].filter(item => item.slot && item.slot !== "BACKPACK" && item.slot !== "MUNICAO").sort((a,b) => getItemScore(b)-getItemScore(a));
  for (const item of sorted) {
    const slot = item.slot!;
    const equippedScore = slot === "ANEL_I" ? Math.min(getItemScore(owned.equipped.ANEL_I), getItemScore(owned.equipped.ANEL_II)) : getItemScore(owned.equipped[slot]);
    if (getItemScore(item) <= equippedScore) continue;
    if (equipItem(owned, item.uid).success) changes.push(`Equipar ${item.name} (${item.rarity}).`);
  }
  if (changes.length) evaluate("owned", "Equipamentos da sua mochila", owned, [...changes, "Seleção por potência; não mede toda a sinergia dos afixos."]);
  const magicWeapon = ["CAJADO", "VARINHA"].some(key => char.equipped.ARMA_PRINCIPAL?.templateId.includes(key));
  const discipline = magicWeapon ? "magic" : char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO") ? "distance" : "melee";
  for (const levels of [5, 10, 20]) {
    const trained = structuredClone(char);
    let xp = -(trained.skillXp[discipline] ?? 0);
    for (let n = 0; n < levels; n++) xp += trainingXpNeeded(trained.skills[discipline] + n);
    trained.skills[discipline] += levels; trained.trainingMastery ??= {};
    trained.trainingMastery[discipline] = (trained.trainingMastery[discipline] ?? 0) + levels;
    evaluate(`training-${levels}`, `Treinar ${discipline}: +${levels} níveis`, trained, [`Conquistar ${levels} níveis de ${discipline} por treino, incluindo a maestria correspondente.`, "Estimativa sem buff diário; nenhum XP de personagem ou item adicional foi concedido."], true, Math.ceil(Math.max(0, xp) / 300));
    if (report.plans[report.plans.length - 1].result.wins >= 18) break;
  }
  const farm = structuredClone(char);
  const families = [magicWeapon ? "CAJADO" : discipline === "distance" ? "ARCO" : "ESPADA", "CAPACETE", "PEITORAL", "CALCAS", "LUVAS", "BOTAS", "ESCUDO", "COLAR", "ANEL", "PULSEIRA"];
  const farmSteps: string[] = [];
  for (const family of families) {
    const base = ALL_EQUIPMENT_TEMPLATES[`${family}_T${zone.tier}`];
    const item = structuredClone(base); item.rarity = "RARO"; item.affixes = [];
    for (const key of Object.keys(item.stats) as (keyof ItemStats)[]) item.stats[key] = Math.round((item.stats[key] ?? 0) * RARITY_MULT.RARO * 100) / 100;
    if (getItemScore(item) > getItemScore(farm.equipped[item.slot!])) { farm.equipped[item.slot!] = item; farmSteps.push(`Obter ${item.name}, raro T${zone.tier}, sem depender de afixos.`); }
  }
  evaluate("farm", "Referência de farm + poções", farm, [...farmSteps, ...potionPlan(farm, zone), "Conjunto hipotético: só substitui peças de menor potência. Não representa itens já obtidos."], true);
  const leveled = structuredClone(char); leveled.level += 5; leveled.xpToNext = xpToNextLevel(leveled.level);
  evaluate("level", "+5 níveis de personagem", leveled, [`Alcançar nível ${leveled.level}; equipamento e pontos distribuídos permanecem os mesmos.`], true);
  if (compareCollection) {
    for (const race of races.slice(0, 6)) {
      if (race.id === char.activeRace?.id) continue;
      const changed = structuredClone(char); changed.activeRace = structuredClone(race); changed.raceId = race.id;
      evaluate(`race-${race.id}`, `Matriz: ${race.name}`, changed, ["Equipar esta Matriz já descoberta; o pet ativo permanece ao lado do herói.", "Equipamentos, gold e configuração de poções permanecem iguais."]);
    }
    for (const beast of (char.divineBeasts ?? []).slice(0, 12)) {
      if (beast.id === char.activeDivineBeastId || !DIVINE_BEASTS[beast.id]) continue;
      const changed = structuredClone(char); changed.activeDivineBeastId = beast.id;
      evaluate(`beast-${beast.id}`, `Pet: ${DIVINE_BEASTS[beast.id].name}`, changed, ["Ativar este pet já vinculado; a Matriz ativa permanece equipada.", "Equipamentos, gold e configuração de poções permanecem iguais."]);
    }
  }
  progress?.("Verificando cinco vitórias consecutivas…");
  report.endurance = simulateEnemy(char, zone, target, seed, 5);
  return report;
}
