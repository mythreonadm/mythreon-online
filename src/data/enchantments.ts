import { Element, Item, ItemEnchantment } from "../types";
import { createItem } from "./items";

export interface UniqueEnchantmentDefinition {
  id: string;
  name: string;
  zoneId: string;
  element?: Element;
  statusEffect: string;
  visualKey: string;
  description: string;
  weaponLabel: string;
  armorLabel: string;
  luckBonus?: number;
}

/** Um aspecto principal por mapa. O catálogo também deixa espaço para futuros mapas. */
export const UNIQUE_ENCHANTMENTS: Record<string, UniqueEnchantmentDefinition> = {
  BOSQUE_LYSS: { id: "ASPECTO_LYSS", name: "Aspecto da Vida", zoneId: "BOSQUE_LYSS", element: "SAGRADO", statusEffect: "radiante", visualKey: "lyss", description: "A Essência viva de Lyss floresce no equipamento.", weaponLabel: "+10% de dano sagrado", armorLabel: "+8% de resistência sagrada", luckBonus: 0.01 },
  PICO_DHOR: { id: "ASPECTO_FLAMEJANTE", name: "Aspecto Flamejante", zoneId: "PICO_DHOR", element: "FOGO", statusEffect: "incandescente", visualKey: "flamejante", description: "A fenda térmica mantém a peça em combustão controlada.", weaponLabel: "+10% de dano de fogo", armorLabel: "+8% de resistência a fogo" },
  MAR_AZHAR: { id: "ASPECTO_CONGELADO", name: "Aspecto Congelado", zoneId: "MAR_AZHAR", element: "GELO", statusEffect: "congelante", visualKey: "congelado", description: "O frio profundo de Azhar cristaliza o golpe e a defesa.", weaponLabel: "+10% de dano de gelo", armorLabel: "+8% de resistência a gelo" },
  RUINAS_ASTERION: { id: "ASPECTO_ELETRIZANTE", name: "Aspecto Eletrizante", zoneId: "RUINAS_ASTERION", element: "ELETRICIDADE", statusEffect: "eletrocutado", visualKey: "eletrizante", description: "Runas antigas liberam um arco elétrico a cada impacto.", weaponLabel: "+10% de dano elétrico", armorLabel: "+8% de resistência elétrica" },
  CICATRIZ_PROFUNDA: { id: "ASPECTO_SOMBRIO", name: "Aspecto Sombrio", zoneId: "CICATRIZ_PROFUNDA", element: "MORTE", statusEffect: "sangrante", visualKey: "sombrio", description: "A Cicatriz do Vazio deixa a peça marcada por energia de morte.", weaponLabel: "+10% de dano de morte", armorLabel: "+8% de resistência à morte" },
  PANTANO_VEYRA: { id: "ASPECTO_ENVENENADO", name: "Aspecto Envenenado", zoneId: "PANTANO_VEYRA", element: "VENENO", statusEffect: "envenenado", visualKey: "envenenado", description: "O miasma de Veyra escorre pelas runas do equipamento.", weaponLabel: "+10% de dano venenoso", armorLabel: "+8% de resistência a veneno" },
  DESERTO_KAELOR: { id: "ASPECTO_DA_SORTE", name: "Aspecto da Sorte", zoneId: "DESERTO_KAELOR", statusEffect: "afortunado", visualKey: "sorte", description: "A miragem de Kaelor dobra o acaso a favor do portador.", weaponLabel: "+10% de dano base", armorLabel: "+8% de resistência física", luckBonus: 0.04 },
};

/** Catálogo dos demais elementos, reservado para novos biomas e variantes especiais. */
export const RESERVED_ENCHANTMENT_ELEMENTS: Record<string, { name: string; element: Element; statusEffect: string }> = {
  VENTO: { name: "Aspecto dos Ventos", element: "VENTO", statusEffect: "cortante" },
  TERRA: { name: "Aspecto Telúrico", element: "TERRA", statusEffect: "aterrado" },
  AGUA: { name: "Aspecto Abissal", element: "AGUA", statusEffect: "afogado" },
  PSIQUICO: { name: "Aspecto Psíquico", element: "PSIQUICO", statusEffect: "confuso" },
  METAL: { name: "Aspecto Metálico", element: "METAL", statusEffect: "fraturado" },
};

export const ENCHANTMENT_RUNE_TEMPLATE = (zoneId: string): Item => {
  const def = UNIQUE_ENCHANTMENTS[zoneId];
  const tier = Math.max(1, Math.min(5, ({ BOSQUE_LYSS: 1, PICO_DHOR: 2, MAR_AZHAR: 3, PANTANO_VEYRA: 3, RUINAS_ASTERION: 4, DESERTO_KAELOR: 4, CICATRIZ_PROFUNDA: 5 } as Record<string, number>)[zoneId] ?? 1)) as Item["tier"];
  const runeRegionName = ({ BOSQUE_LYSS: "Lyss", PICO_DHOR: "Dhor", MAR_AZHAR: "Azhar", RUINAS_ASTERION: "Asterion", CICATRIZ_PROFUNDA: "Cicatriz", PANTANO_VEYRA: "Veyra", DESERTO_KAELOR: "Kaelor" } as Record<string, string>)[zoneId] ?? def?.name.replace(/^Aspecto /, "") ?? "Desconhecida";
  return createItem({
    templateId: `RUNA_ENCANTADA_${zoneId}`,
    name: `Runa Encantada de ${runeRegionName}`,
    category: "MATERIAL",
    tier,
    rarity: tier >= 5 ? "EPICO" : tier >= 3 ? "RARO" : "INCOMUM",
    icon: "🔮",
    stackable: true,
    maxStack: 999,
  });
};

export function enchantmentForZone(zoneId: string): UniqueEnchantmentDefinition | undefined { return UNIQUE_ENCHANTMENTS[zoneId]; }

export function buildItemEnchantment(zoneId: string, itemTier: Item["tier"]): ItemEnchantment | undefined {
  const def = enchantmentForZone(zoneId);
  if (!def) return undefined;
  const tier = Math.max(1, Math.min(5, itemTier)) as ItemEnchantment["tier"];
  const scale = 1 + (tier - 1) * 0.08;
  return {
    id: def.id,
    name: def.name,
    zoneId,
    tier,
    element: def.element,
    weaponDamagePct: Number((0.10 * scale).toFixed(3)),
    armorResistancePct: Number((0.08 * scale).toFixed(3)),
    luckBonus: def.luckBonus ? Number((def.luckBonus * scale).toFixed(3)) : undefined,
    statusEffect: def.statusEffect,
    visualKey: def.visualKey,
  };
}

export function enchantmentRuneTemplateId(zoneId: string): string { return `RUNA_ENCANTADA_${zoneId}`; }

