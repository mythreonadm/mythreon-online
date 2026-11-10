import type { Character, Enemy, Zone } from "../types";

export const HUNT_WAVE_COUNT = 5;

const STAGE_STATS = [
  { hp: 0.62, atk: 0.62, arm: 0.72, xp: 0.55, gold: 0.55 },
  { hp: 0.82, atk: 0.82, arm: 0.88, xp: 0.75, gold: 0.72 },
  { hp: 0.98, atk: 0.98, arm: 1.0, xp: 0.88, gold: 0.86 },
  { hp: 1.04, atk: 1.04, arm: 1.04, xp: 0.94, gold: 0.92 },
  { hp: 1.75, atk: 1.48, arm: 1.28, xp: 1.45, gold: 1.35 },
] as const;

const FAMILY_IDS: Record<string, "animal" | "insect" | "plant" | "construct" | "humanoid" | "undead" | "arcane"> = {
  LOBO: "animal", URSO: "animal", JAVALI: "animal", HIENA: "animal", ESCORPIAO: "animal", SERPENTE: "animal", CARANGUEJO: "animal", POLVO: "animal", CROCODILO_SILTE: "animal", VERME: "animal", ARANHA_GIGANTE: "animal",
  VESPA: "insect", LIBELULA_LAMINA: "insect", FALCAO: "insect", MORCEGO_MAGMA: "insect", ENGUIA_ELETRICA: "insect",
  ESPINHEIRO: "plant", CIPO_MEMORIA: "plant", SAPO_MIASMA: "animal",
  GOLEM: "construct", ELEMENTAL_GELO: "construct", CENTURIAO: "construct", SENTINELA: "construct", GOLEM_OBSIDIANA: "construct",
  BANDIDO: "humanoid", CULTISTA: "humanoid", SEREIA: "humanoid", TRITAO: "humanoid",
  MUMIA: "undead", SOMBRA: "undead", CEIFADOR_ALMAS: "undead", FADA_CORROMPIDA: "arcane", ESPECTRO_SOLAR: "arcane",
  CRIA_VAZIO: "arcane", ABERRACAO: "arcane", OLHO_VAZIO: "arcane", MEDUSA: "arcane", YETI: "animal",
};

const SPECIAL_NAMES: Record<string, [string, string, string, string, string]> = {
  LOBO: ["Lobo adolescente azul", "Lobo adolescente vermelho", "Lobo adolescente azul", "Lobo adolescente vermelho", "Lobo Alfa"],
  VESPA: ["Vespa batedora", "Vespa Soldado", "Vespa Soldado azul", "Vespa Soldado rubra", "Vespa Cinza"],
  ESPINHEIRO: ["Roseira Brava", "Girassol Metralhadora", "Roseira Brava", "Girassol Metralhadora", "Espinheiro Vivo"],
};

function generatedNames(base: Enemy): [string, string, string, string, string] {
  const family = FAMILY_IDS[base.id] ?? "arcane";
  const root = base.name;
  if (family === "insect") return [`${root} Batedor`, `${root} Soldado`, `${root} da Colmeia`, `${root} da Colmeia`, `${root} Rainha`];
  if (family === "plant") return [`Broto de ${root}`, `Guardiã de ${root}`, `Colônia de ${root}`, `Colônia de ${root}`, `Ancião de ${root}`];
  if (family === "construct") return [`Fragmento de ${root}`, `Guardião de ${root}`, `Dupla de ${root}`, `Dupla de ${root}`, `Núcleo de ${root}`];
  if (family === "humanoid") return [`Recruta ${root}`, `Arauto ${root}`, `Irmãos ${root}`, `Irmãos ${root}`, `Mestre ${root}`];
  if (family === "undead") return [`Eco ${root}`, `Arauto ${root}`, `Círculo ${root}`, `Círculo ${root}`, `Soberano ${root}`];
  if (family === "animal") return [`${root} Jovem`, `${root} Caçador`, `${root} Matilha`, `${root} Matilha`, `${root} Alfa`];
  return [`Fragmento ${root}`, `Arauto ${root}`, `Ecos de ${root}`, `Ecos de ${root}`, `Avatar ${root}`];
}

export function getWaveKey(zoneId: string, baseEnemyId: string) { return `${zoneId}:${baseEnemyId}`; }
export function resolveHuntTarget(zone: Zone, character: Character) {
  const selected = zone.enemies.find(enemy => enemy.id === character.activeEnemyId);
  return selected && character.level >= (selected.minLevel ?? 1)
    ? selected
    : zone.enemies.find(enemy => character.level >= (enemy.minLevel ?? 1)) ?? zone.enemies[0];
}

export function prepareHuntTarget(character: Character, zone: Zone, enemy: Enemy) {
  character.activeEnemyId = enemy.id;
  character.huntWaveProgress ??= {};
  const stage = enemy.isBoss ? undefined : getWaveStage(character.huntWaveProgress, zone.id, enemy.id);
  const encounter = stage === undefined ? enemy : getWaveEncounter(zone, enemy, stage);
  character.fightWaveKey = stage === undefined ? undefined : getWaveKey(zone.id, enemy.id);
  character.fightWaveStage = stage;
  character.fightEnemyId = undefined;
  character.huntEncounterStartedAtTick = undefined;
  character.enemyHp = encounter.hp * encounter.difficulty;
  character.enemyHpId = encounter.id;
}
export function getWaveStage(progress: Record<string, number> | undefined, zoneId: string, baseEnemyId: string) {
  const raw = progress?.[getWaveKey(zoneId, baseEnemyId)];
  return Math.max(0, Math.min(HUNT_WAVE_COUNT - 1, Number.isFinite(raw) ? Number(raw) : 0));
}

/** Retorna a variante determinística da etapa sem consumir RNG. */
export function getWaveEncounter(_zone: Zone, baseEnemy: Enemy, stage: number): Enemy {
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
    difficulty: baseEnemy.difficulty,
  };
}

export function waveLabel(stage: number) {
  if (stage >= 4) return "Onda 4/4 · Chefe";
  if (stage >= 2) return `Onda 3/4 · Dupla ${stage - 1}/2`;
  return `Onda ${stage + 1}/4`;
}
export function waveAssetNames(base: Enemy) { return ["W1", "W2", "W3A", "W3B", "BOSS"].map(suffix => `${base.id}_${suffix}.png`); }
