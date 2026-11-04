/** Economia rara de Mythreon: valores centralizados para ajustes de balanceamento. */
export const MYTHREON_ECONOMY = {
  shardsPerCoin: 100,
  goldPerCoin: 25_000,
  shardBaseChance: 0.008,
  shardDifficultyBonus: 0.003,
  shardLevelBonus: 0.00005,
} as const;

export type MythreonOfferKind = "ITEM" | "BOOST";
export interface MythreonOffer {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceCoins: number;
  kind?: MythreonOfferKind;
  templateId?: string;
  boostKey?: string;
  durationHours?: number;
  skillDmgPct?: number;
  tags?: string[];
}
export const MYTHREON_OFFERS: MythreonOffer[] = [
  { id: "BLACK_SIGIL", name: "Sigilo do Primeiro Eco", description: "Relíquia do despertar de um novo aventureiro.", icon: "✨", templateId: "UNICO_SIGILO_INICIACAO", priceCoins: 8, kind: "ITEM", tags: ["relíquia"] },
  { id: "GUARD_RING", name: "Anel da Guarda Eterna", description: "Protege os itens contra a perda ao morrer.", icon: "💍", templateId: "UNICO_ANEL_GUARDIA", priceCoins: 75, kind: "ITEM", tags: ["proteção"] },
  { id: "EPIC_FRAGMENT", name: "Núcleo de Fragmento Épico", description: "Material raro para forjas de alto nível.", icon: "🔮", templateId: "FRAGMENTO_EPICO", priceCoins: 1, kind: "ITEM", tags: ["forja"] },
  { id: "TOME_SABEDORIA_1H", name: "Tomo da Sabedoria Eterna · 1h", description: "+20% de dano de habilidades elementais por 1 hora. Não substitui uma boa build.", icon: "📖", priceCoins: 20, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 1, skillDmgPct: 0.20, tags: ["buff", "progressão"] },
  { id: "TOME_SABEDORIA_4H", name: "Tomo da Sabedoria Eterna · 4h", description: "+20% de dano de habilidades elementais por 4 horas.", icon: "📘", priceCoins: 60, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 4, skillDmgPct: 0.20, tags: ["buff", "progressão"] },
  { id: "TOME_SABEDORIA_12H", name: "Tomo da Sabedoria Eterna · 12h", description: "+20% de dano de habilidades elementais por 12 horas.", icon: "📙", priceCoins: 150, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 12, skillDmgPct: 0.20, tags: ["buff", "progressão"] },
  { id: "TOME_SABEDORIA_24H", name: "Tomo da Sabedoria Eterna · 24h", description: "+20% de dano de habilidades elementais por 24 horas.", icon: "📕", priceCoins: 260, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 24, skillDmgPct: 0.20, tags: ["buff", "progressão"] },
  { id: "TOME_SABEDORIA_ETERNAL", name: "Tomo da Sabedoria Eterna · Eterno", description: "+20% de dano de habilidades elementais permanente. Custo alto, efeito limitado e sem substituir uma build bem treinada.", icon: "📜", priceCoins: 1_500, kind: "BOOST", boostKey: "TOMO_SABEDORIA", durationHours: 0, skillDmgPct: 0.20, tags: ["buff", "eterno"] },
  { id: "PET_EGG_T3", name: "Ovo de Besta Divina · Raro", description: "Ovo de tier 3 para a Incubadora de Pets.", icon: "🥚", templateId: "OVO_BESTA_T3", priceCoins: 35, kind: "ITEM", tags: ["pet"] },
  { id: "PET_EGG_T4", name: "Ovo de Besta Divina · Épico", description: "Ovo de tier 4 com chances melhores de Pets raros.", icon: "🌟", templateId: "OVO_BESTA_T4", priceCoins: 95, kind: "ITEM", tags: ["pet"] },
  { id: "PET_EGG_T5", name: "Ovo de Besta Divina · Lendário", description: "Ovo de tier 5: a maior chance de uma linhagem extraordinária.", icon: "💠", templateId: "OVO_BESTA_T5", priceCoins: 260, kind: "ITEM", tags: ["pet"] },
  { id: "SUPPLY_CHEST", name: "Baú de Suprimentos", description: "Fragmentos e materiais úteis para a próxima etapa da jornada.", icon: "🎁", templateId: "BAU_SUPRIMENTOS_MYTHREON", priceCoins: 12, kind: "ITEM", tags: ["suprimentos"] },
  { id: "ROULETTE_KEY", name: "Chave da Roleta Arcana", description: "Abre um prêmio aleatório na Roleta de Mythreon.", icon: "🗝️", templateId: "CHAVE_ROLETA_ARCANA", priceCoins: 8, kind: "ITEM", tags: ["roleta"] },
  { id: "SKIN_CAPE_NEBULA", name: "Skin · Manto da Nebulosa", description: "Cosmético exclusivo: brilho sutil, sem bônus de combate.", icon: "🧥", templateId: "SKIN_MANTO_NEBULOSA", priceCoins: 180, kind: "ITEM", tags: ["skin", "cosmético"] },
  { id: "MATRIX_LUMINESCENCE", name: "Luminescência da Matriz", description: "Efeito visual arcano para Matrizes equipadas. Sem aumento de atributos.", icon: "🌌", templateId: "LUMINESCENCIA_MATRIZ", priceCoins: 120, kind: "ITEM", tags: ["cosmético"] },
];
export const getMythreonOffer = (id: string) => MYTHREON_OFFERS.find(offer => offer.id === id);

/** Pacotes comerciais: o navegador nunca credita moedas. O checkout/webhook deve
 * confirmar o pagamento no servidor antes de entregar o saldo. */
export const MYTHREON_DONATION_PACKS = [
  { id: "COINS_1000", label: "Apoio inicial", priceBRL: 1, coins: 1_000 },
  { id: "COINS_5500", label: "Apoio aventureiro", priceBRL: 5, coins: 5_500 },
  { id: "COINS_12000", label: "Apoio guardião", priceBRL: 10, coins: 12_000 },
  { id: "COINS_65000", label: "Apoio fundador", priceBRL: 50, coins: 65_000 },
] as const;

export const PREMIUM_BENEFITS = [
  "+10% de XP em caça online e offline",
  "Auto-venda de loot configurável",
  "Treino offline estendido e bônus de disciplina",
  "Acesso antecipado a cosméticos e efeitos de quests",
  "Fila de correio e Market Online com prioridade",
  "Sem aumento direto de dano ou drop raro garantido",
] as const;

export const MYTHREON_PREMIUM_PLANS = [
  { id: "PREMIUM_30D", name: "Premium · 30 dias", priceBRL: 4.90, tag: "Entrada" },
  { id: "PREMIUM_90D", name: "Premium · 90 dias", priceBRL: 12.90, tag: "Aventureiro" },
  { id: "PREMIUM_365D", name: "Premium · 365 dias", priceBRL: 39.90, tag: "Fundador" },
] as const;
export function shardChance(enemy: { difficulty: number; minLevel?: number; isBoss: boolean }) {
  const base = MYTHREON_ECONOMY.shardBaseChance + enemy.difficulty * MYTHREON_ECONOMY.shardDifficultyBonus + (enemy.minLevel ?? 1) * MYTHREON_ECONOMY.shardLevelBonus;
  return Math.min(0.05, base * (enemy.isBoss ? 1.5 : 1));
}
