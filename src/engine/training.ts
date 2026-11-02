import { Character, CharacterSkills } from "../types";
import { createItem, FRAGMENT_TEMPLATES } from "../data/items";
import { addItem } from "./inventory";

export const TRAINING_MILESTONES = [
  { id: "PRIMEIRO_RITUAL", name: "Primeiro Ritual", seconds: 300, gold: 100, fragments: 2 },
  { id: "DISCIPULO", name: "Discípulo da Essência", seconds: 1800, gold: 250, fragments: 5 },
  { id: "DEDICADO", name: "Disciplina Inabalável", seconds: 7200, gold: 500, fragments: 10 },
  { id: "MESTRE", name: "Guardião da Disciplina", seconds: 36000, gold: 1500, fragments: 25 },
];
export function masteryBonus(char: Character, skill: keyof CharacterSkills): number {
  return Math.min(0.30, Math.max(0, char.trainingMastery?.[skill] ?? 0) * 0.01);
}
export function trainingXpNeeded(level: number): number {
  const n = Math.max(0, level - 10);
  return Math.floor(1500 + 150 * n + 15 * n * n);
}
export function applyTraining(char: Character, now: number): string[] {
  const skill = char.trainingSkill;
  if (!skill) return [];
  const previous = char.trainingLastTick ?? now;
  const ticks = Math.min(20, Math.max(0, Math.floor((now - previous) / 3000)));
  if (!ticks) return [];
  // Até 60 s de atraso de uma aba em segundo plano. Não simula treino offline.
  const start = now - ticks * 3000;
  const boostedSeconds = Math.max(0, Math.min(now, char.trainingBoostUntil ?? 0) - start) / 1000;
  char.trainingLastTick = now;
  char.lastTick = now;
  char.trainingSeconds ??= {};
  char.trainingMastery ??= {};
  char.trainingAchievements ??= [];
  char.trainingSeconds[skill] = (char.trainingSeconds[skill] ?? 0) + ticks * 3;
  char.skillXp[skill] += ticks * 15 + boostedSeconds * 2.5;
  const log: string[] = [];
  while (char.skillXp[skill] >= trainingXpNeeded(char.skills[skill])) {
    char.skillXp[skill] -= trainingXpNeeded(char.skills[skill]);
    char.skills[skill]++;
    char.trainingMastery[skill] = (char.trainingMastery[skill] ?? 0) + 1;
    log.push(`Maestria em ${skill}: nível ${char.skills[skill]}!`);
  }
  const seconds = Object.values(char.trainingSeconds).reduce((sum, n) => sum + (n ?? 0), 0);
  for (const reward of TRAINING_MILESTONES) {
    if (seconds < reward.seconds || char.trainingAchievements.includes(reward.id)) continue;
    char.trainingAchievements.push(reward.id);
    char.gold += reward.gold;
    const fragments = createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_COMUM, quantity: reward.fragments });
    const stackSpace = char.inventory.items.filter(item => item.templateId === fragments.templateId && item.stackable).reduce((sum, item) => sum + Math.max(0, item.maxStack - item.quantity), 0);
    if (char.inventory.items.length < char.inventory.backpack.slots || stackSpace >= fragments.quantity) addItem(char.inventory, fragments);
    else char.depot.push(fragments);
    log.push(`Conquista: ${reward.name}! +${reward.gold} gold e ${reward.fragments} Fragmentos Comuns.`);
  }
  return log;
}
