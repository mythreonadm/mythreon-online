import type { ProfessionRecipe } from "../types";

export type ProfessionAction = "mine" | "fish";
/** Optional bait is consumed only together with a successful catch. */
export const FISHING_BAIT = { templateId: "ISCA_CICATRIZ", name: "Isca da Cicatriz", quantity: 1, bonusFish: 1 } as const;
export interface MiningNode { id: string; name: string; requiredSkill: number; zoneId: string; tier: number; dropTemplateId: string; dropName: string; dropIcon: string; action: string; }
export interface FishingSpot { id: string; name: string; requiredSkill: number; zoneId: string; rodTier: number; dropTemplateId: string; dropName: string; dropIcon: string; action: string; }
export interface ProfessionToolOffer { templateId: string; profession: "MINERACAO" | "PESCA"; tier: number; requiredSkill: number; gold: number; }
export const PROFESSION_TOOL_SHOP: ProfessionToolOffer[] = [
  { templateId: "PICARETA_T2", profession: "MINERACAO", tier: 2, requiredSkill: 20, gold: 2_000 },
  { templateId: "PICARETA_T3", profession: "MINERACAO", tier: 3, requiredSkill: 40, gold: 12_000 },
  { templateId: "PICARETA_T4", profession: "MINERACAO", tier: 4, requiredSkill: 60, gold: 60_000 },
  { templateId: "PICARETA_T5", profession: "MINERACAO", tier: 5, requiredSkill: 80, gold: 250_000 },
  { templateId: "VARA_PESCA_T2", profession: "PESCA", tier: 2, requiredSkill: 20, gold: 2_000 },
  { templateId: "VARA_PESCA_T3", profession: "PESCA", tier: 3, requiredSkill: 40, gold: 12_000 },
  { templateId: "VARA_PESCA_T4", profession: "PESCA", tier: 4, requiredSkill: 60, gold: 60_000 },
  { templateId: "VARA_PESCA_T5", profession: "PESCA", tier: 5, requiredSkill: 80, gold: 250_000 },
];
export const MINING_NODES: MiningNode[] = [
  { id: "veio_lyss", name: "Veio de Ferro de Lyss", zoneId: "BOSQUE_LYSS", requiredSkill: 0, tier: 1, dropTemplateId: "MINERIO_FERRO", dropName: "Minério de Ferro", dropIcon: "⛏️", action: "Revele o pulso da veia e acerte a faixa dourada" },
  { id: "cristal_dhor", name: "Veio de Cobre de Dhor", zoneId: "PICO_DHOR", requiredSkill: 20, tier: 2, dropTemplateId: "MINERIO_COBRE", dropName: "Minério de Cobre", dropIcon: "🟠", action: "Abra caminho entre gelo e brasa" },
  { id: "cristal_azhar", name: "Gruta de Essência de Azhar", zoneId: "MAR_AZHAR", requiredSkill: 40, tier: 3, dropTemplateId: "CRISTAL_ESSENCIA", dropName: "Cristal de Essência", dropIcon: "💎", action: "Encontre o brilho entre os corais" },
  { id: "obsidiana_cicatriz", name: "Veio Obsidiano", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 60, tier: 4, dropTemplateId: "MINERIO_OBSIDIANO", dropName: "Minério Obsidiano", dropIcon: "🪨", action: "Quebre a crosta da Cicatriz" },
  { id: "eclipse_profundo", name: "Núcleo do Eclipse", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 80, tier: 5, dropTemplateId: "MINERIO_ECLIPSE", dropName: "Minério do Eclipse", dropIcon: "🌑", action: "Sincronize-se com a pulsação do abismo" },
];
export const FISHING_SPOTS: FishingSpot[] = [
  { id: "corrego_lyss", name: "Córrego de Lyss", zoneId: "BOSQUE_LYSS", requiredSkill: 0, rodTier: 1, dropTemplateId: "PEIXE_RIO", dropName: "Peixe do Refúgio", dropIcon: "🐟", action: "Segure e solte quando o marcador alcançar o dourado" },
  { id: "lago_dhor", name: "Lago Degelado de Dhor", zoneId: "PICO_DHOR", requiredSkill: 20, rodTier: 2, dropTemplateId: "TRUTA_GELO", dropName: "Truta de Gelo", dropIcon: "🐟", action: "Sinta o puxão sob o gelo" },
  { id: "mar_azhar", name: "Corais de Azhar", zoneId: "MAR_AZHAR", requiredSkill: 40, rodTier: 3, dropTemplateId: "PEIXE_CORAL", dropName: "Peixe-Coral", dropIcon: "🐠", action: "Recolha a linha entre as ondas" },
  { id: "cicatriz_funda", name: "Cicatriz Profunda", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 60, rodTier: 4, dropTemplateId: "PEIXE_CICATRIZ", dropName: "Peixe-Cicatriz", dropIcon: "🐠", action: "Encontre vida nas águas escuras" },
  { id: "lago_astral", name: "Lago Astral da Cicatriz", zoneId: "CICATRIZ_PROFUNDA", requiredSkill: 80, rodTier: 5, dropTemplateId: "PEIXE_ASTRAL", dropName: "Peixe Astral", dropIcon: "✨", action: "Recolha antes que o brilho desapareça" },
];
export function professionCooldown(skill: number) { return Math.max(1500, 5000 - Math.floor(skill / 10) * 100); }

export const PROFESSION_RECIPES: ProfessionRecipe[] = [
  { id: "LINGOTE_FERRO", name: "Fundir Lingote de Ferro", icon: "🔩", profession: "MINERACAO" as const, requiredSkill: 10, ingredients: [{ templateId: "MINERIO_FERRO", quantity: 5 }], outputTemplateId: "LINGOTE_FERRO", outputQuantity: 1 },
  { id: "CRISTAL_REFINADO", name: "Lapidar Cristal de Essência", icon: "💠", profession: "MINERACAO" as const, requiredSkill: 45, ingredients: [{ templateId: "CRISTAL_ESSENCIA", quantity: 3 }, { templateId: "MINERIO_FERRO", quantity: 5 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 1 },
  { id: "ISCA_CICATRIZ", name: "Preparar Isca da Cicatriz", icon: "🪱", profession: "PESCA" as const, requiredSkill: 10, ingredients: [{ templateId: "PEIXE_RIO", quantity: 3 }], outputTemplateId: "ISCA_CICATRIZ", outputQuantity: 2 },
  { id: "CALDO_MARCA_DAGUA", name: "Cozinhar Caldo da Marca-d'Água", icon: "🍲", profession: "PESCA" as const, requiredSkill: 45, ingredients: [{ templateId: "PEIXE_CICATRIZ", quantity: 2 }, { templateId: "COLHEITA_MELANCIA", quantity: 1 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 1 },
  { id: "LIGA_COBRE", name: "Forjar Liga de Cobre e Ferro", icon: "🔩", profession: "MINERACAO", requiredSkill: 20, ingredients: [{ templateId: "MINERIO_COBRE", quantity: 3 }, { templateId: "MINERIO_FERRO", quantity: 4 }], outputTemplateId: "LINGOTE_FERRO", outputQuantity: 2 },
  { id: "LAPIDAR_OBSIDIANA", name: "Lapidar Essência Obsidiana", icon: "💠", profession: "MINERACAO", requiredSkill: 60, ingredients: [{ templateId: "MINERIO_OBSIDIANO", quantity: 3 }, { templateId: "CRISTAL_ESSENCIA", quantity: 1 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 1 },
  { id: "LAPIDAR_ECLIPSE", name: "Condensar Essência do Eclipse", icon: "🌑", profession: "MINERACAO", requiredSkill: 80, ingredients: [{ templateId: "MINERIO_ECLIPSE", quantity: 3 }, { templateId: "CRISTAL_ESSENCIA", quantity: 4 }], outputTemplateId: "CRISTAL_REFINADO", outputQuantity: 2 },
  { id: "ISCA_GELO", name: "Preparar Isca de Água Fria", icon: "🪱", profession: "PESCA", requiredSkill: 20, ingredients: [{ templateId: "TRUTA_GELO", quantity: 2 }], outputTemplateId: "ISCA_CICATRIZ", outputQuantity: 3 },
  { id: "CALDO_CORAL", name: "Cozinhar Caldo dos Corais", icon: "🍲", profession: "PESCA", requiredSkill: 40, ingredients: [{ templateId: "PEIXE_CORAL", quantity: 3 }, { templateId: "COLHEITA_MELANCIA", quantity: 1 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 1 },
  { id: "CALDO_ASTRAL", name: "Cozinhar Caldo Astral", icon: "🍲", profession: "PESCA", requiredSkill: 80, ingredients: [{ templateId: "PEIXE_ASTRAL", quantity: 3 }, { templateId: "COLHEITA_MELANCIA", quantity: 2 }], outputTemplateId: "CALDO_MARCA_DAGUA", outputQuantity: 2 },
];
