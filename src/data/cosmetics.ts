import type { CosmeticLoadout } from "../types";

export type CosmeticSlot = keyof CosmeticLoadout;
export const COSMETIC_SLOTS: { key: CosmeticSlot; label: string }[] = [
  { key: "skinTemplateId", label: "Skin humana" },
  { key: "matrixGlowTemplateId", label: "Luminescência da Matriz" },
  { key: "petAuraTemplateId", label: "Aura do Pet" },
  { key: "bossAddonTemplateId", label: "Addon do Boss" },
];
export interface CosmeticDefinition {
  slot: CosmeticSlot;
  label: string;
  className: string;
  sprite?: string;
}
export const COSMETIC_DEFINITIONS: Record<string, CosmeticDefinition> = {
  SKIN_MANTO_NEBULOSA: { slot: "skinTemplateId", label: "Manto da Nebulosa", className: "cosmetic-skin-nebula", sprite: "/assets/players/skins/SKIN_MANTO_NEBULOSA.png" },
  SKIN_CAPA_PRIMEIRO_CANTO: { slot: "skinTemplateId", label: "Capa do Primeiro Canto", className: "cosmetic-skin-first-canto", sprite: "/assets/items/SKIN_PREMIUM_MES_01.png" },
  LUMINESCENCIA_MATRIZ: { slot: "matrixGlowTemplateId", label: "Luminescência da Matriz", className: "cosmetic-matrix-luminescence" },
  LUMINESCENCIA_PET: { slot: "petAuraTemplateId", label: "Aura da Besta Divina", className: "cosmetic-pet-luminescence" },
  ADDON_BOSS_LUMINESCENTE: { slot: "bossAddonTemplateId", label: "Addon do Boss Luminescente", className: "cosmetic-addon-boss", sprite: "/assets/items/ADDON_BOSS_LUMINESCENTE.png" },
};
