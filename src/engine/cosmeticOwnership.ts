import type { Character, CosmeticLoadout } from "../types";
import { COSMETIC_DEFINITIONS, COSMETIC_SLOTS } from "../data/cosmetics";
import { calendarUnlockedSkins } from "../data/dailyCalendar";

export function ownedCosmeticLoadout(character: Character): CosmeticLoadout {
  if (!character.cosmeticLoadout || !Object.values(character.cosmeticLoadout).some(Boolean)) return {};
  const owned = new Set([
    ...(character.unlockedCosmetics ?? []),
    ...calendarUnlockedSkins(character),
    ...[...character.inventory.items, ...(character.depot ?? []), ...Object.values(character.equipped ?? {})]
      .filter(item => item && COSMETIC_DEFINITIONS[item.templateId]).map(item => item.templateId),
  ]);
  const valid: CosmeticLoadout = {};
  for (const { key } of COSMETIC_SLOTS) {
    const id = character.cosmeticLoadout[key];
    if (id && COSMETIC_DEFINITIONS[id]?.slot === key && owned.has(id)) valid[key] = id;
  }
  return valid;
}
export function normalizeCosmeticOwnership(character: Character) {
  if (character.cosmeticLoadout) character.cosmeticLoadout = ownedCosmeticLoadout(character);
}
