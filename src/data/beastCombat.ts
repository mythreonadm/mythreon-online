import { Character, DivineBeastId, Element, ItemStats } from "../types";
import { DIVINE_BEASTS } from "./divineBeasts";
import { TICK_MS } from "../config";

const BEAST_ATTACK_TICKS = 2;
export const BEAST_ATTACK_SECONDS = BEAST_ATTACK_TICKS * TICK_MS / 1000;

const ATTACKS: Record<DivineBeastId, [string, Element]> = {
 LYSS_STAG: ["Lanças de Raiz", "TERRA"], DHOR_GRIFFIN: ["Queda de Basalto", "TERRA"],
 AZHAR_SERPENT: ["Maré de Nacre", "AGUA"], ASTERION_OWL: ["Sentença Celeste", "PSIQUICO"],
 VOID_FOX: ["Rasgo do Limiar", "MORTE"], ASTER_PHOENIX: ["Aurora Incandescente", "FOGO"],
 NOCTHAR_MOTH: ["Pó do Silêncio", "MORTE"], KAELOR_SALAMANDER: ["Sopro da Mudança", "FOGO"],
 VEYRA_TORTOISE: ["Pulso da Memória", "SAGRADO"], DHOR_BEETLE: ["Estilhaço Cristalino", "METAL"],
 LYSS_MOTH: ["Pólen Vital", "VENENO"], NYR_SKY_RAY: ["Lâmina das Correntes", "VENTO"],
};
export function getBeastCombat(char: Character) {
 const id = char.activeDivineBeastId;
 // A Besta Divina complementa a Matriz: a transformação permanece equipada
 // e o pet atua como ataque auxiliar independente.
 if (!id || !(char.divineBeasts ?? []).some(b => b.id === id)) return null;
 const beast = DIVINE_BEASTS[id];
 const [name, element] = ATTACKS[id];
 return { beast, name, element, cooldown: BEAST_ATTACK_TICKS, cooldownSeconds: BEAST_ATTACK_SECONDS, mana: 8 + Math.floor(char.level * 0.5), multiplier: 2.4 };
}
export function beastGrowth(level: number): ItemStats {
 return { hp: 60 + level * 6, mp: 30 + level * 3, atk: 6 + level, matk: 6 + level, arm: 3 + Math.floor(level * 0.6), hpRegen: 1 + Math.floor(level / 15), mpRegen: 2 + Math.floor(level / 15) };
}
