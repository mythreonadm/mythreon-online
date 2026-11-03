import { FarmRecipe, Item } from "../types";

export interface FarmSeed { id: string; name: string; icon: string; growMs: number; yieldId: string; yieldName: string; yieldIcon: string; yieldQty: number; cost: number; }
export const FARM_SEEDS: FarmSeed[] = [
  { id: "SEMENTE_CENOURA", name: "Semente de Cenoura", icon: "🥕", growMs: 5 * 60_000, yieldId: "COLHEITA_CENOURA", yieldName: "Cenoura", yieldIcon: "🥕", yieldQty: 2, cost: 30 },
  { id: "SEMENTE_MELANCIA", name: "Semente de Melancia", icon: "🍉", growMs: 15 * 60_000, yieldId: "COLHEITA_MELANCIA", yieldName: "Melancia", yieldIcon: "🍉", yieldQty: 2, cost: 90 },
  { id: "SEMENTE_TRIGO", name: "Semente de Trigo", icon: "🌾", growMs: 30 * 60_000, yieldId: "COLHEITA_TRIGO", yieldName: "Trigo de Lyss", yieldIcon: "🌾", yieldQty: 3, cost: 160 },
  { id: "SEMENTE_LUMINA", name: "Semente Lumina", icon: "✨", growMs: 60 * 60_000, yieldId: "COLHEITA_LUMINA", yieldName: "Fruto Lumina", yieldIcon: "🔆", yieldQty: 2, cost: 400 },
];
export const FARM_RECIPES: FarmRecipe[] = [
  { id: "RECEITA_SOPA_CENOURA", name: "Sopa de Cenoura de Lyss", icon: "🍲", ingredients: [{ templateId: "COLHEITA_CENOURA", name: "Cenoura", quantity: 2, icon: "🥕" }, { templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 1, icon: "🌾" }], outputTemplateId: "SOPA_CENOURA_LYSS", outputName: "Sopa de Cenoura de Lyss", outputIcon: "🍲", outputQuantity: 1, sellValue: 85 },
  { id: "RECEITA_ELIXIR_MELANCIA", name: "Elixir de Maré Doce", icon: "🧪", ingredients: [{ templateId: "COLHEITA_MELANCIA", name: "Melancia", quantity: 2, icon: "🍉" }, { templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 1, icon: "🔆" }], outputTemplateId: "ELIXIR_MARE_DOCE", outputName: "Elixir de Maré Doce", outputIcon: "🧪", outputQuantity: 1, sellValue: 220 },
  { id: "RECEITA_PAO_LYSS", name: "Pão Rúnico de Lyss", icon: "🍞", ingredients: [{ templateId: "COLHEITA_TRIGO", name: "Trigo de Lyss", quantity: 3, icon: "🌾" }, { templateId: "COLHEITA_LUMINA", name: "Fruto Lumina", quantity: 1, icon: "🔆" }], outputTemplateId: "PAO_RUNICO_LYSS", outputName: "Pão Rúnico de Lyss", outputIcon: "🍞", outputQuantity: 2, sellValue: 180 },
];
export const farmRecipe = (id: string) => FARM_RECIPES.find(recipe => recipe.id === id);
export const FARM_MAX_PLOTS = 12;
export type FarmExpansionCost = { kind: "free" | "gold" | "coins"; amount: number; label: string };
/** Retorna o custo para liberar o próximo canteiro. unlockedPlots começa em 1. */
export function farmExpansionCost(unlockedPlots: number): FarmExpansionCost | null {
  if (unlockedPlots >= FARM_MAX_PLOTS) return null;
  const nextPlot = unlockedPlots + 1;
  if (nextPlot === 2) return { kind: "gold", amount: 1_000, label: "1.000 gold" };
  if (nextPlot === 3) return { kind: "gold", amount: 25_000, label: "25.000 gold" };
  if (nextPlot === 4) return { kind: "gold", amount: 100_000, label: "100.000 gold" };
  return { kind: "coins", amount: 500, label: "500 Mythreon Coins" };
}
export const farmSeed = (id: string) => FARM_SEEDS.find(seed => seed.id === id);
export function farmYield(seed: FarmSeed): Item { return { uid: `farm-${seed.yieldId}-${Date.now()}-${Math.random()}`, templateId: seed.yieldId, name: seed.yieldName, category: "MATERIAL", tier: 1, rarity: "COMUM", stats: {}, affixes: [], upgradeLevel: 0, stackable: true, maxStack: 999, quantity: seed.yieldQty, icon: seed.yieldIcon }; }
export function farmRecipeOutput(recipe: FarmRecipe): Item { return { uid: `farm-recipe-${recipe.outputTemplateId}-${Date.now()}-${Math.random()}`, templateId: recipe.outputTemplateId, name: recipe.outputName, category: "MATERIAL", tier: 2, rarity: "INCOMUM", stats: {}, affixes: [], upgradeLevel: 0, stackable: true, maxStack: 999, quantity: recipe.outputQuantity, icon: recipe.outputIcon }; }
