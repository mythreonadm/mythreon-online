import type { Precision } from "../types";

export const PROFESSION_PULSE_MS = 3000;
export const PERFECT_PULSE_RADIUS = 0.045;
export const GOOD_PULSE_RADIUS = 0.11;
export function professionPrecisionAt(elapsed: number, target: number): Precision {
  if (!Number.isFinite(elapsed) || !Number.isFinite(target) || elapsed < 0 || elapsed >= PROFESSION_PULSE_MS) return 0.5;
  const distance = Math.abs(elapsed / PROFESSION_PULSE_MS - target);
  return distance <= PERFECT_PULSE_RADIUS ? 1.5 : distance <= GOOD_PULSE_RADIUS ? 1 : 0.5;
}
