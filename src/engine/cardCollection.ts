import type { CardInstance, CardRarity, CardStats, Character } from "../types";
import { CARD_TEMPLATES, getCardStats } from "../data/cards";

export const CARD_LOADOUT_LIMIT = 5;
export const CARD_MAX_LEVEL = 5;
export const CARD_HERO_WEIGHTS: CardStats = { hp: .15, atk: .20, def: .15, spd: .002 };
export const CARD_EVOLUTION_GOLD: Record<CardRarity, number> = { COMUM: 150, INCOMUM: 300, RARO: 600, EPICO: 1200, LENDARIO: 2400 };
export function equippedCards(c?: Pick<Character, "cards" | "cardLoadout"> | null): CardInstance[] {
  if (!c) return [];
  const byId = new Map((c.cards ?? []).map(card => [card.uid, card]));
  return [...new Set(c.cardLoadout ?? [])].map(uid => byId.get(uid)).filter((card): card is CardInstance => !!card && !!CARD_TEMPLATES[card.templateId]).slice(0, CARD_LOADOUT_LIMIT);
}
export function cardHeroBonus(card: CardInstance): CardStats {
  const template = CARD_TEMPLATES[card.templateId];
  if (!template) return { hp: 0, atk: 0, def: 0, spd: 0 };
  const s = getCardStats(template, card.level);
  return { hp: s.hp * CARD_HERO_WEIGHTS.hp, atk: s.atk * CARD_HERO_WEIGHTS.atk, def: s.def * CARD_HERO_WEIGHTS.def, spd: s.spd * CARD_HERO_WEIGHTS.spd };
}
export function formationBonus(c?: Pick<Character, "cards" | "cardLoadout"> | null): CardStats {
  return equippedCards(c).reduce((sum, card) => {
    const b = cardHeroBonus(card);return { hp: sum.hp+b.hp, atk: sum.atk+b.atk, def: sum.def+b.def, spd: sum.spd+b.spd };
  }, { hp: 0, atk: 0, def: 0, spd: 0 });
}
export function cardFormationScore(c?: Pick<Character, "cards" | "cardLoadout"> | null): number {
  return equippedCards(c).reduce((sum, card) => {
    const s = getCardStats(CARD_TEMPLATES[card.templateId], card.level);
    return sum+s.atk*.35+s.hp*.02+s.def*.45+s.spd*.1;
  }, 0);
}
export function cardEvolutionQuote(c: Character, uid: string) {
  const card = c.cards.find(entry => entry.uid === uid), template = card && CARD_TEMPLATES[card.templateId];
  if (!card || !template) return null;
  const level = card.level, validLevel = Number.isInteger(level) && level >= 1 && level < CARD_MAX_LEVEL;
  const copiesNeeded = validLevel ? 2 ** level : 0;
  const gold = validLevel ? CARD_EVOLUTION_GOLD[template.rarity] * level ** 2 : 0;
  const equipped = new Set(c.cardLoadout ?? []);
  const eligible = c.cards.filter(entry => entry.uid !== uid && entry.templateId === card.templateId && entry.level === 1 && !equipped.has(entry.uid))
    .sort((a, b) => a.obtainedAt-b.obtainedAt || a.uid.localeCompare(b.uid));
  return { card, template, level, nextLevel: validLevel ? level+1 : CARD_MAX_LEVEL, maxed: !validLevel, copiesNeeded, gold, eligible, suggested: eligible.slice(0, copiesNeeded).map(entry => entry.uid) };
}
export function evolveCard(c: Character, uid: string, materialUids: string[], expectedLevel: number): { success: boolean; error?: string; level?: number; spentGold?: number; consumed?: string[] } {
  const quote = cardEvolutionQuote(c, uid);
  if (!quote) return { success: false, error: "Escolha uma carta conhecida da sua coleção." };
  if (quote.card.level !== expectedLevel) return { success: false, error: "O nível desta carta mudou. Revise a evolução novamente." };
  if (quote.maxed) return { success: false, error: "Esta carta já atingiu o limite de evolução (nível 5)." };
  const ids = new Set(materialUids);
  if (materialUids.length !== quote.copiesNeeded || ids.size !== materialUids.length) return { success: false, error: `Selecione exatamente ${quote.copiesNeeded} cópias diferentes.` };
  const eligible = new Set(quote.eligible.map(card => card.uid));
  if (materialUids.some(id => !eligible.has(id))) return { success: false, error: "Use somente cópias iguais de nível 1, livres da formação." };
  if (c.cards.filter(card => card.uid === uid).length !== 1 || materialUids.some(id => c.cards.filter(card => card.uid === id).length !== 1)) return { success: false, error: "Há identificadores repetidos na coleção. A evolução foi interrompida." };
  if (!Number.isSafeInteger(c.gold) || c.gold < quote.gold) return { success: false, error: "Gold insuficiente para evoluir esta carta." };
  // No write happens until every identity, cost, level and equipped-copy check succeeds.
  c.cards = c.cards.filter(card => !ids.has(card.uid)).map(card => card.uid === uid ? { ...card, level: card.level+1 } : card);
  c.gold -= quote.gold;
  return { success: true, level: quote.nextLevel, spentGold: quote.gold, consumed: [...materialUids] };
}
