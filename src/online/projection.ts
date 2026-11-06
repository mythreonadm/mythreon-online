import { createGameStore, type GameState } from "../store/gameStore";

export type GameSnapshot = Pick<GameState, "character" | "races" | "currentZoneId" | "isTickRunning" | "isTraining" | "healingUntil" | "deathReport" | "lastTickResult">;
/** These actions preserve item identities and have no random reward to guess. */
const PROJECTABLE = new Set([
  "equip", "unequip", "depositItem", "withdrawItem", "depositMany", "withdrawMany",
  "equipRace", "unequipRace", "equipDivineBeast", "unequipDivineBeast", "equipCosmetic", "unequipCosmetic",
  "equipProfessionTool", "setCardLoadout", "updateAppearance", "updateSettings", "spendStatPoint",
  "startHunting", "stopHunting", "setCurrentZone", "setActiveEnemy", "startTraining", "stopTraining",
  "startHealing", "cancelHealing", "clearDeathReport", "clearOfflineReport", "finishIntro", "acceptQuest",
  "plantFarmSeed", "waterFarmPlot", "fertilizeFarmPlot", "unlockFarmPlot", "unlockZone", "buyCalendarCoupon", "claimDailyCalendar", "recoverCalendarDay", "recoverCalendarWeek", "buyBless", "buyStaminaGold", "buyStaminaCoins",
]);
export const canProject = (action: string) => PROJECTABLE.has(action);
export function gameSnapshot(state: GameState): GameSnapshot {
  return { character: state.character, races: state.races, currentZoneId: state.currentZoneId, isTickRunning: state.isTickRunning, isTraining: state.isTraining, healingUntil: state.healingUntil, deathReport: state.deathReport, lastTickResult: state.lastTickResult };
}
export function previewGameAction(base: GameSnapshot, action: string, args: unknown[], at: number) {
  const shadow = createGameStore({ server: true, persist: () => {}, notify: () => {}, now: () => at });
  shadow.setState(structuredClone(base));
  try {
    const method = shadow.getState()[action as keyof GameState];
    if (typeof method !== "function") return { state: base, result: { success: false, error: "Ação inválida." } };
    const result = (method as (...args: unknown[]) => any)(...args);
    return { state: gameSnapshot(shadow.getState()), result };
  } catch (error) {
    return { state: base, result: { success: false, error: error instanceof Error ? error.message : "Não foi possível validar a ação." } };
  }
}
export function projectGameCommand(base: GameSnapshot, operation: string, payload: any, at: number): GameSnapshot {
  if (operation !== "world.command" || !canProject(payload.action)) return base;
  const preview = previewGameAction(base, payload.action, payload.args ?? [], at);
  return preview.result === false || preview.result?.success === false ? base : preview.state;
}
