import { CARD_TEMPLATES, getCardStats } from "../data/cards";
import { CardInstance, CardStats } from "../types";

export type ArenaSize = 1 | 3 | 5;
export interface ArenaFighter {
  instance: CardInstance;
  name: string;
  emoji: string;
  ability: string;
  trait: string;
  traitName: string;
  stats: CardStats;
}
export interface ArenaLogEntry { turn: number; text: string; kind: "attack" | "trait" | "special" | "result"; }
export interface ArenaBattleResult { winner: "player" | "opponent" | "draw"; logs: ArenaLogEntry[]; playerRemaining: number; opponentRemaining: number; rounds: number; }

export function toFighter(instance: CardInstance): ArenaFighter | null {
  const template = CARD_TEMPLATES[instance.templateId];
  if (!template) return null;
  return { instance, name: template.name, emoji: template.emoji, ability: template.ability, trait: template.trait,
    traitName: template.trait.toLowerCase(), stats: getCardStats(template, Math.max(1, Math.min(5, instance.level))) };
}

export function makeOpponentDeck(region: string, size: ArenaSize, averageLevel: number): CardInstance[] {
  let options = Object.entries(CARD_TEMPLATES).filter(([, card]) => card.region === region);
  if (options.length < size) options = Object.entries(CARD_TEMPLATES);
  const shuffled = [...options].sort(() => Math.random() - 0.5).slice(0, size);
  return shuffled.map(([templateId]) => ({
    uid: `arena-opponent-${templateId}-${Math.random().toString(36).slice(2)}`,
    templateId,
    level: Math.max(1, Math.min(5, Math.round(averageLevel + (Math.random() < 0.5 ? -1 : 1)))),
    obtainedAt: Date.now(),
  }));
}

interface Combatant extends ArenaFighter {
  hp: number; maxHp: number; fury: number; shield: boolean; poison: number; bleed: number;
  fear: number; silence: number; firstStrike: boolean;
}
const makeCombatant = (fighter: ArenaFighter): Combatant => ({ ...fighter, hp: fighter.stats.hp, maxHp: fighter.stats.hp,
  fury: 0, shield: fighter.trait === "ESCUDO", poison: 0, bleed: 0, fear: 0, silence: 0, firstStrike: fighter.trait === "INVESTIDA" });

export function simulateArenaDuel(playerDeck: CardInstance[], opponentDeck: CardInstance[]): ArenaBattleResult {
  const player = playerDeck.map(toFighter).filter((f): f is ArenaFighter => !!f).map(makeCombatant);
  const opponent = opponentDeck.map(toFighter).filter((f): f is ArenaFighter => !!f).map(makeCombatant);
  const logs: ArenaLogEntry[] = [];
  let turn = 0;
  const log = (text: string, kind: ArenaLogEntry["kind"] = "trait") => logs.push({ turn, text, kind });

  while (player.some(c => c.hp > 0) && opponent.some(c => c.hp > 0) && turn < 30) {
    turn++;
    const p = player.find(c => c.hp > 0)!;
    const o = opponent.find(c => c.hp > 0)!;
    for (const c of [p, o]) {
      if (c.trait === "REGENERACAO" && c.hp > 0) {
        const heal = Math.max(1, Math.floor(c.maxHp * 0.05)); c.hp = Math.min(c.maxHp, c.hp + heal);
        log(`${c.emoji} ${c.name} recupera ${heal} HP.`, "trait");
      }
      if (c.poison > 0) { const dmg = Math.max(1, Math.floor(c.maxHp * 0.05)); c.hp -= dmg; c.poison--; log(`${c.name} sofre ${dmg} de veneno.`, "trait"); }
      if (c.bleed > 0) { const dmg = Math.max(1, Math.floor(c.maxHp * 0.04)); c.hp -= dmg; c.bleed--; log(`${c.name} perde ${dmg} HP por sangramento.`, "trait"); }
    }
    if (p.hp <= 0 || o.hp <= 0) continue;
    if (p.trait === "FURIA") p.fury++;
    if (o.trait === "FURIA") o.fury++;
    const order = p.firstStrike !== o.firstStrike ? (p.firstStrike ? [[p, o], [o, p]] : [[o, p], [p, o]]) : Math.random() < 0.5 ? [[p, o], [o, p]] : [[o, p], [p, o]];
    p.firstStrike = false; o.firstStrike = false;
    for (const [attacker, defender] of order) {
      if (attacker.hp <= 0 || defender.hp <= 0) continue;
      if (defender.shield) { defender.shield = false; log(`${defender.name} bloqueia o primeiro golpe com Escudo!`, "trait"); continue; }
      const feared = attacker.fear > 0;
      let damage = Math.max(1, Math.floor((attacker.stats.atk * (1 + attacker.fury * 0.1) * (feared ? 0.85 : 1)) - defender.stats.def * 0.55));
      const critical = attacker.trait === "PRECISAO" && Math.random() < 0.2;
      if (critical) damage *= 2;
      const special = turn % 3 === 0 && attacker.silence <= 0;
      if (special) damage = Math.floor(damage * 1.25);
      defender.hp -= damage;
      log(`${attacker.emoji} ${attacker.name}${critical ? " acerta crítico" : " ataca"} ${defender.name} por ${damage}${special ? ` com ${attacker.ability}` : ""}.`, special ? "special" : "attack");
      if (special && attacker.trait === "VENENO") defender.poison = Math.max(defender.poison, 3);
      if (special && attacker.trait === "SANGRAMENTO") defender.bleed = Math.max(defender.bleed, 3);
      if (special && attacker.trait === "MEDO") defender.fear = Math.max(defender.fear, 3);
      if (special && attacker.trait === "SILENCIO") defender.silence = Math.max(defender.silence, 2);
      if (defender.trait === "ESPINHOS") { const reflected = Math.max(1, Math.floor(damage * 0.2)); attacker.hp -= reflected; log(`${defender.name} reflete ${reflected} de dano.`, "trait"); }
      if (defender.hp <= 0) log(`${defender.name} foi derrotado!`, "result");
    }
    for (const c of [p, o]) { if (c.fear > 0) c.fear--; if (c.silence > 0) c.silence--; }
  }
  const playerRemaining = player.filter(c => c.hp > 0).length;
  const opponentRemaining = opponent.filter(c => c.hp > 0).length;
  const winner = playerRemaining === opponentRemaining ? "draw" : playerRemaining > opponentRemaining ? "player" : "opponent";
  log(winner === "player" ? "Vitória! Sua equipe domina a arena." : winner === "opponent" ? "Derrota. Reúna outra equipe e tente novamente." : "Empate! As duas equipes resistiram.", "result");
  return { winner, logs, playerRemaining, opponentRemaining, rounds: turn };
}
