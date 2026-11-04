import type { Character, DailyBossBattle, Enemy } from "../types";
import { BALANCE, clamp, mitigatedDamage } from "../data/balance";

export const BOSS_KNOCKOUT_RECOVERY_MS = 30_000;

/** Reading or rejoining never heals a battle already created for this cycle. */
export function bossBattleFor(character: Character, runId: string): DailyBossBattle {
  if (character.dailyBossBattle?.runId === runId) return { ...character.dailyBossBattle };
  const hpMax = Math.max(120, Math.floor(Number(character.hpMax) || 120));
  return { runId, hp: hpMax, hpMax, damageTaken: 0, knockouts: 0, recoveryUntil: 0, lastDamage: 0 };
}

/** The caller persists this state in the same transaction as contribution/HP. */
export function bossRetaliation(character: Character, runId: string, enemy: Enemy, participants: number, defeated: boolean, now: number) {
  const battle = bossBattleFor(character, runId);
  if (battle.hp <= 0) {
    if (now < battle.recoveryUntil) throw Error(`Você está se recuperando do nocaute. Aguarde ${Math.ceil((battle.recoveryUntil - now) / 1000)}s.`);
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
