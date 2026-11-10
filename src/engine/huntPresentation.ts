import { TICK_MS } from "../config";
import type { Element, Enemy } from "../types";

export type HuntImpactKind = "basic" | "combo" | "spell" | "pet" | "elemental" | "counter" | "miss" | "dodge" | "heal";

export interface HuntImpact {
  kind: HuntImpactKind;
  target: "hero" | "enemy";
  amount: number;
  hpRemoved: number;
  element?: Element;
  sourceId?: string;
  critical?: boolean;
  comboHit?: 1 | 2;
}

export interface HuntBeat {
  tick: number;
  at: number;
  characterId: string;
  zoneId: string;
  baseEnemyId: string;
  encounterId: string;
  enemy: Pick<Enemy, "id" | "name" | "sprite" | "emoji" | "difficulty" | "isBoss" | "isElite" | "waveStage">;
  enemyHpBefore: number;
  enemyHpAfter: number;
  enemyMaxHp: number;
  outcome?: "victory" | "death";
  impacts: HuntImpact[];
}

export function skillManaCost(base: number, level: number) {
  return base + Math.floor(level * 0.5);
}

export function ticksUntilCast(tick: number, interval: number) {
  return interval - tick % interval;
}

export function huntCooldown(tick: number, interval: number, elapsed: number) {
  const duration = interval * TICK_MS;
  const remaining = Math.max(0, ticksUntilCast(tick, interval) * TICK_MS - Math.max(0, elapsed));
  return { remaining, progress: Math.round(100 * (1 - remaining / duration)) };
}

export function recordHuntImpact(beat: HuntBeat | undefined, impact: Omit<HuntImpact, "hpRemoved" | "target">, heroHp = 0) {
  if (!beat) return;
  const target = impact.kind === "counter" || impact.kind === "dodge" || impact.kind === "heal" ? "hero" : "enemy";
  const hpRemoved = target === "enemy" ? Math.min(beat.enemyHpAfter, impact.amount)
    : impact.kind === "counter" ? Math.min(Math.max(0, heroHp), impact.amount) : 0;
  if (target === "enemy") beat.enemyHpAfter -= hpRemoved;
  beat.impacts.push({ ...impact, target, hpRemoved });
}
