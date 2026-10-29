import { Backpack } from "../types";

export const BACKPACKS: Record<string, Backpack> = {
  NORMAL: { templateId: "BACKPACK_NORMAL", name: "Normal Backpack", slots: 50, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  OLD: { templateId: "BACKPACK_OLD", name: "Old Backpack", slots: 60, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  COURO: { templateId: "BACKPACK_COURO", name: "Mochila de Couro", slots: 70, dropBonus: 0, rareDropBonus: 0, xpBonus: 0.02 },
  REFORCADA: { templateId: "BACKPACK_REFORCADA", name: "Mochila Reforçada", slots: 80, dropBonus: 0.03, rareDropBonus: 0, xpBonus: 0.03 },
  EXPLORADOR: { templateId: "BACKPACK_EXPLORADOR", name: "Mochila do Explorador", slots: 90, dropBonus: 0.06, rareDropBonus: 0.04, xpBonus: 0.04 },
  ARCANA: { templateId: "BACKPACK_ARCANA", name: "Mochila Arcana", slots: 100, dropBonus: 0.10, rareDropBonus: 0.08, xpBonus: 0.06 },
};
export const DEFAULT_BACKPACK = BACKPACKS.NORMAL;
export const BACKPACK_PRICES: Record<string, number> = { COURO: 400, REFORCADA: 3500, EXPLORADOR: 18000, ARCANA: 90000 };