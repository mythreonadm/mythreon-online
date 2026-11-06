/** Regras centralizadas de stamina. O modo beta deixa as compras ilimitadas. */
export const STAMINA_ONLINE_MAX = 120;
export const STAMINA_OFFLINE_MAX = 480;
export const STAMINA_PRETEST_UNLIMITED = true;
export const STAMINA_GOLD_REFILL_MINUTES = 60;
export const STAMINA_COIN_REFILL_MINUTES = 120;

export function staminaGoldCost(level: number) {
  return Math.max(500, Math.floor(Math.max(1, level) * 250));
}

export function staminaDayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
