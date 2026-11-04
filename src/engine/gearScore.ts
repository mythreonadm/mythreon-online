import type { Character, ItemStats } from "../types";
import { getItemScore } from "./itemCompare";
import { cardFormationScore } from "./cardCollection";

/** Pontuação legível da força efetiva da build, sem substituir o cálculo de dano. */
export function getGearScore(character?: Character | null): number {
  if (!character) return 0;
  const equipment = Object.values(character.equipped ?? {}).reduce((sum, item) => sum + getItemScore(item), 0);
  const stats = character.baseStats ?? {};
  const statScore = scoreStats(stats);
  const skills = Object.values(character.skills ?? {}).reduce((sum, value) => sum + Number(value || 0), 0) * 1.25;
  const mastery = Object.values(character.trainingMastery ?? {}).reduce((sum, value) => sum + Number(value || 0), 0) * 0.5;
  const training = Object.values(character.trainingSeconds ?? {}).reduce((sum, value) => sum + Number(value || 0), 0) / 1800;
  const level = Math.max(0, character.level - 1) * 1.5;
  const matrix = scoreStats(character.activeRace?.bonus);
  const beast = character.activeDivineBeastId ? 8 : 0;
  const cards = scoreCards(character);
  return Math.max(0, Math.round(equipment + statScore + skills + mastery + training + level + matrix + beast + cards));
}

/** Cartas equipadas são uma camada de build, não apenas coleção. */
export function scoreCards(character?: Character | null): number {
  return cardFormationScore(character);
}

function scoreStats(stats?: ItemStats) {
  if (!stats) return 0;
  return (stats.atk ?? 0) * 0.35 + (stats.matk ?? 0) * 0.35 + (stats.def ?? 0) * 0.3 + (stats.arm ?? 0) * 0.45
    + (stats.hp ?? 0) * 0.018 + (stats.mp ?? 0) * 0.01 + (stats.spd ?? 0) * 8
    + (stats.crit ?? 0) * 18 + (stats.hit ?? 0) * 14 + (stats.dge ?? 0) * 14 + (stats.blk ?? 0) * 14
    + (stats.resFisico ?? 0) * 12 + (stats.resMagico ?? 0) * 12 + (stats.hpRegen ?? 0) * 1.5 + (stats.mpRegen ?? 0) * 1.5
    + (stats.luck ?? 0) * 8 + (stats.critDmg ?? 0) * 10;
}
