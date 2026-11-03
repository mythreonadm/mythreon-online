/** Economia rara de Mythreon: valores centralizados para ajustes de balanceamento. */
export const MYTHREON_ECONOMY = {
  shardsPerCoin: 100,
  goldPerCoin: 25_000,
  shardBaseChance: 0.008,
  shardDifficultyBonus: 0.003,
  shardLevelBonus: 0.00005,
} as const;

export interface MythreonOffer { id: string; name: string; description: string; icon: string; templateId: string; priceCoins: number; }
export const MYTHREON_OFFERS: MythreonOffer[] = [
  { id: "BLACK_SIGIL", name: "Sigilo do Primeiro Eco", description: "Relíquia do despertar de um novo aventureiro.", icon: "✨", templateId: "UNICO_SIGILO_INICIACAO", priceCoins: 8 },
  { id: "GUARD_RING", name: "Anel da Guarda Eterna", description: "Protege os itens contra a perda ao morrer.", icon: "💍", templateId: "UNICO_ANEL_GUARDIA", priceCoins: 75 },
  { id: "EPIC_FRAGMENT", name: "Núcleo de Fragmento Épico", description: "Material raro para forjas de alto nível.", icon: "🔮", templateId: "FRAGMENTO_EPICO", priceCoins: 1 },
];
export const getMythreonOffer = (id: string) => MYTHREON_OFFERS.find(offer => offer.id === id);
export function shardChance(enemy: { difficulty: number; minLevel?: number; isBoss: boolean }) {
  const base = MYTHREON_ECONOMY.shardBaseChance + enemy.difficulty * MYTHREON_ECONOMY.shardDifficultyBonus + (enemy.minLevel ?? 1) * MYTHREON_ECONOMY.shardLevelBonus;
  return Math.min(0.05, base * (enemy.isBoss ? 1.5 : 1));
}
