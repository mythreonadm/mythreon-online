import type { CosmeticLoadout } from "../types";
import { COSMETIC_DEFINITIONS } from "../data/cosmetics";

/**
 * Catálogo visual dos cosméticos equipados. Estes identificadores só mudam a
 * apresentação; nunca entram no cálculo de stats, dano, drops ou velocidade.
 */
export interface CosmeticVisual {
  skinClassName: string;
  matrixClassName: string;
  petClassName: string;
  addonClassName: string;
  labels: string[];
  skinSprite?: string;
  addonSprite?: string;
}

export function getCosmeticVisual(loadout?: CosmeticLoadout): CosmeticVisual {
  const definition = (slot: keyof CosmeticLoadout) => {
    const id = loadout?.[slot], value = id ? COSMETIC_DEFINITIONS[id] : undefined;
    return value?.slot === slot ? value : undefined;
  };
  const skin = definition("skinTemplateId");
  const matrix = definition("matrixGlowTemplateId");
  const pet = definition("petAuraTemplateId");
  const addon = definition("bossAddonTemplateId");
  return {
    skinClassName: skin?.className ?? "",
    skinSprite: skin?.sprite,
    addonSprite: addon?.sprite,
    matrixClassName: matrix?.className ?? "",
    petClassName: pet?.className ?? "",
    addonClassName: addon?.className ?? "",
    labels: [skin?.label, matrix?.label, pet?.label, addon?.label].filter((label): label is string => Boolean(label)),
  };
}
