import { CardTrait, CardRarity, CardTemplate, CardStats, CardInstance } from "../types";
import { generateId } from "../utils/id";

// ═══════════════════════════════════════════════════════════════
// OS 10 TRAÇOS
// ═══════════════════════════════════════════════════════════════
export const TRAITS: Record<CardTrait, { name: string; icon: string; desc: string; color: string }> = {
  FURIA:      { name: "Fúria",        icon: "🔥", desc: "+10% ATK a cada turno (acumula)", color: "text-red-400" },
  VENENO:     { name: "Veneno",       icon: "☠️", desc: "Aplica dano contínuo de 5% HP/turno", color: "text-green-500" },
  ESPINHOS:   { name: "Espinhos",     icon: "🌿", desc: "Reflete 20% do dano físico recebido", color: "text-green-400" },
  PRECISAO:   { name: "Precisão",     icon: "🎯", desc: "20% de chance de acerto crítico (x2 dano)", color: "text-yellow-400" },
  INVESTIDA:  { name: "Investida",    icon: "⚡", desc: "Ataca primeiro no combate", color: "text-yellow-500" },
  REGENERACAO:{ name: "Regeneração",  icon: "💚", desc: "Cura 5% HP por turno", color: "text-emerald-400" },
  ESCUDO:     { name: "Escudo",       icon: "🛡️", desc: "Bloqueia o primeiro ataque recebido", color: "text-blue-400" },
  SANGRAMENTO:{ name: "Sangramento",  icon: "🩸", desc: "Dano contínuo que ignora cura", color: "text-red-600" },
  MEDO:       { name: "Medo",         icon: "😱", desc: "-15% ATK do inimigo por 3 turnos", color: "text-purple-400" },
  SILENCIO:   { name: "Silêncio",     icon: "🔇", desc: "Bloqueia habilidade do inimigo por 2 turnos", color: "text-gray-400" },
};

// ═══════════════════════════════════════════════════════════════
// OS 38 TEMPLATES (todos os monstros do jogo)
// ═══════════════════════════════════════════════════════════════
export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  // ─── BOSQUE DE LYSS (T1) ───
  CARD_LOBO: {
    monsterId: "LOBO", name: "Lobo-Feral", region: "BOSQUE_LYSS", rarity: "RARO", trait: "FURIA",
    baseStats: { hp: 100, atk: 25, def: 10, spd: 30 },
    ability: "Mordida Sangrenta", abilityDesc: "Causa 30% do ATK como dano extra no primeiro ataque.",
    emoji: "🐺",
  },
  CARD_VESPA: {
    monsterId: "VESPA", name: "Vespa-Cinza", region: "BOSQUE_LYSS", rarity: "COMUM", trait: "VENENO",
    baseStats: { hp: 50, atk: 15, def: 5, spd: 45 },
    ability: "Ferrão Letal", abilityDesc: "Aplica 1 stack extra de veneno no primeiro ataque.",
    emoji: "🐝",
  },
  CARD_ESPINHEIRO: {
    monsterId: "ESPINHEIRO", name: "Espinheiro-Vivo", region: "BOSQUE_LYSS", rarity: "RARO", trait: "ESPINHOS",
    baseStats: { hp: 180, atk: 10, def: 30, spd: 10 },
    ability: "Enraizar", abilityDesc: "Impede o inimigo de esquivar por 2 turnos.",
    emoji: "🪴",
  },
  CARD_FALCAO: {
    monsterId: "FALCAO", name: "Falcão-Ruivo", region: "BOSQUE_LYSS", rarity: "COMUM", trait: "PRECISAO",
    baseStats: { hp: 80, atk: 30, def: 8, spd: 40 },
    ability: "Voo Rasante", abilityDesc: "Ataques têm 30% de chance de ignorar defesa.",
    emoji: "🦅",
  },
  CARD_JAVALI: {
    monsterId: "JAVALI", name: "Javali-Musgoso", region: "BOSQUE_LYSS", rarity: "COMUM", trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 20, def: 20, spd: 15 },
    ability: "Couraça de Musgo", abilityDesc: "Reduz em 20% o dano mágico recebido.",
    emoji: "🐗",
  },
  CARD_FADA_CORROMPIDA: {
    monsterId: "FADA_CORROMPIDA", name: "Fada Corrompida", region: "BOSQUE_LYSS", rarity: "INCOMUM", trait: "REGENERACAO",
    baseStats: { hp: 60, atk: 20, def: 5, spd: 50 },
    ability: "Pólen Curativo", abilityDesc: "Cura 15% do HP de aliados no 3x3/5x5.",
    emoji: "🧚",
  },
  CARD_ARANHA_GIGANTE: {
    monsterId: "ARANHA_GIGANTE", name: "Aranha Gigante", region: "BOSQUE_LYSS", rarity: "INCOMUM", trait: "VENENO",
    baseStats: { hp: 120, atk: 25, def: 12, spd: 25 },
    ability: "Teia Pegajosa", abilityDesc: "Reduz SPD do inimigo em 20% por 3 turnos.",
    emoji: "🕷️",
  },
  CARD_ESPECTRO: {
    monsterId: "ESPECTRO", name: "Espectro de Brasa", region: "BOSQUE_LYSS", rarity: "LENDARIO", trait: "MEDO",
    baseStats: { hp: 200, atk: 45, def: 15, spd: 50 },
    ability: "Chama Espectral", abilityDesc: "Causa dano em área (afeta 2 inimigos no 3x3/5x5).",
    emoji: "👻",
  },

  // ─── PICO DE DHOR (T2) ───
  CARD_GOLEM: {
    monsterId: "GOLEM", name: "Golem-Rocha", region: "PICO_DHOR", rarity: "RARO", trait: "ESPINHOS",
    baseStats: { hp: 250, atk: 15, def: 40, spd: 10 },
    ability: "Pele de Pedra", abilityDesc: "Bloqueia 10% do dano recebido permanentemente.",
    emoji: "🗿",
  },
  CARD_URSO: {
    monsterId: "URSO", name: "Urso-Fenda", region: "PICO_DHOR", rarity: "RARO", trait: "FURIA",
    baseStats: { hp: 220, atk: 35, def: 20, spd: 20 },
    ability: "Fúria Selvagem", abilityDesc: "Quando abaixo de 50% HP, ganha +30% ATK.",
    emoji: "🐻",
  },
  CARD_BANDIDO: {
    monsterId: "BANDIDO", name: "Bandido do Desfiladeiro", region: "PICO_DHOR", rarity: "RARO", trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 40, def: 10, spd: 35 },
    ability: "Golpe Furtivo", abilityDesc: "Primeiro ataque sempre é crítico.",
    emoji: "🥷",
  },
  CARD_ELEMENTAL_GELO: {
    monsterId: "ELEMENTAL_GELO", name: "Elemental de Gelo", region: "PICO_DHOR", rarity: "EPICO", trait: "ESCUDO",
    baseStats: { hp: 180, atk: 30, def: 25, spd: 25 },
    ability: "Armadura de Gelo", abilityDesc: "Gera escudo de 20% HP a cada 3 turnos.",
    emoji: "🧊",
  },
  CARD_YETI: {
    monsterId: "YETI", name: "Yeti-do-Cume", region: "PICO_DHOR", rarity: "EPICO", trait: "ESCUDO",
    baseStats: { hp: 280, atk: 30, def: 20, spd: 15 },
    ability: "Pele de Neve", abilityDesc: "Imune a dano de gelo.",
    emoji: "🦍",
  },
  CARD_MORCEGO_MAGMA: {
    monsterId: "MORCEGO_MAGMA", name: "Morcego de Magma", region: "PICO_DHOR", rarity: "INCOMUM", trait: "SANGRAMENTO",
    baseStats: { hp: 130, atk: 45, def: 8, spd: 50 },
    ability: "Mordida Incandescente", abilityDesc: "Aplica sangramento que ignora cura.",
    emoji: "🦇",
  },
  CARD_CENTURIAO: {
    monsterId: "CENTURIAO", name: "Centurião de Bronze", region: "PICO_DHOR", rarity: "EPICO", trait: "ESPINHOS",
    baseStats: { hp: 300, atk: 25, def: 35, spd: 10 },
    ability: "Formação de Escudo", abilityDesc: "Reflete 30% do dano recebido.",
    emoji: "🤖",
  },
  CARD_COLOSSO: {
    monsterId: "COLOSSO", name: "Colosso de Dhor", region: "PICO_DHOR", rarity: "LENDARIO", trait: "INVESTIDA",
    baseStats: { hp: 500, atk: 60, def: 40, spd: 15 },
    ability: "Investida Sísmica", abilityDesc: "Primeiro ataque atordoa o inimigo por 1 turno.",
    emoji: "🏔️",
  },

  // ─── MAR DE AZHAR (T3) ───
  CARD_CARANGUEJO: {
    monsterId: "CARANGUEJO", name: "Caranguejo-Colosso", region: "MAR_AZHAR", rarity: "RARO", trait: "ESCUDO",
    baseStats: { hp: 400, atk: 35, def: 35, spd: 15 },
    ability: "Carapaça Dura", abilityDesc: "Reduz dano físico recebido em 25%.",
    emoji: "🦀",
  },
  CARD_SERPENTE: {
    monsterId: "SERPENTE", name: "Serpente-Névoa", region: "MAR_AZHAR", rarity: "RARO", trait: "VENENO",
    baseStats: { hp: 320, atk: 50, def: 15, spd: 40 },
    ability: "Peçonha Paralisante", abilityDesc: "Veneno reduz SPD do inimigo em 15%.",
    emoji: "🐍",
  },
  CARD_MEDUSA: {
    monsterId: "MEDUSA", name: "Medusa-Trovão", region: "MAR_AZHAR", rarity: "INCOMUM", trait: "SILENCIO",
    baseStats: { hp: 280, atk: 45, def: 20, spd: 35 },
    ability: "Descarga Elétrica", abilityDesc: "25% de chance de atordoar o inimigo por 1 turno.",
    emoji: "🪼",
  },
  CARD_SEREIA: {
    monsterId: "SEREIA", name: "Sereia-Cantora", region: "MAR_AZHAR", rarity: "INCOMUM", trait: "REGENERACAO",
    baseStats: { hp: 300, atk: 40, def: 20, spd: 30 },
    ability: "Canto Curativo", abilityDesc: "Cura 10% HP de si mesma por turno.",
    emoji: "🧜",
  },
  CARD_POLVO: {
    monsterId: "POLVO", name: "Polvo-Abissal", region: "MAR_AZHAR", rarity: "EPICO", trait: "SILENCIO",
    baseStats: { hp: 380, atk: 55, def: 25, spd: 25 },
    ability: "Tentáculos Sufocantes", abilityDesc: "Impede o inimigo de usar habilidade por 2 turnos.",
    emoji: "🐙",
  },
  CARD_TRITAO: {
    monsterId: "TRITAO", name: "Tritão Guerreiro", region: "MAR_AZHAR", rarity: "EPICO", trait: "ESCUDO",
    baseStats: { hp: 420, atk: 50, def: 30, spd: 20 },
    ability: "Tridente de Coral", abilityDesc: "Gera escudo equivalente a 15% do HP máximo.",
    emoji: "🔱",
  },
  CARD_ENGUIA_ELETRICA: {
    monsterId: "ENGUIA_ELETRICA", name: "Enguia Elétrica", region: "MAR_AZHAR", rarity: "RARO", trait: "SILENCIO",
    baseStats: { hp: 350, atk: 60, def: 15, spd: 45 },
    ability: "Choque Paralisante", abilityDesc: "Cada ataque tem 20% de chance de silenciar.",
    emoji: "⚡",
  },
  CARD_LEVIATA: {
    monsterId: "LEVIATA", name: "Leviatã de Azhar", region: "MAR_AZHAR", rarity: "LENDARIO", trait: "MEDO",
    baseStats: { hp: 800, atk: 90, def: 45, spd: 25 },
    ability: "Rugido Abissal", abilityDesc: "Reduz ATK de todos os inimigos em 20%.",
    emoji: "🐋",
  },

  // ─── RUÍNAS DE ASTERION (T4) ───
  CARD_HIENA: {
    monsterId: "HIENA", name: "Hiena-Abissal", region: "RUINAS_ASTERION", rarity: "RARO", trait: "SANGRAMENTO",
    baseStats: { hp: 600, atk: 70, def: 25, spd: 50 },
    ability: "Risada Sanguinária", abilityDesc: "Aplica sangramento de 8% HP por turno.",
    emoji: "🐕",
  },
  CARD_SENTINELA: {
    monsterId: "SENTINELA", name: "Sentinela de Pedra", region: "RUINAS_ASTERION", rarity: "EPICO", trait: "ESPINHOS",
    baseStats: { hp: 750, atk: 50, def: 50, spd: 15 },
    ability: "Guarda Eterna", abilityDesc: "Reflete 30% do dano físico recebido.",
    emoji: "🗿",
  },
  CARD_ESCORPIAO: {
    monsterId: "ESCORPIAO", name: "Escorpião-Rúnico", region: "RUINAS_ASTERION", rarity: "RARO", trait: "VENENO",
    baseStats: { hp: 650, atk: 75, def: 30, spd: 40 },
    ability: "Ferrão Rúnico", abilityDesc: "Veneno causa dano dobrado por 2 turnos.",
    emoji: "🦂",
  },
  CARD_CULTISTA: {
    monsterId: "CULTISTA", name: "Cultista do Eclipse", region: "RUINAS_ASTERION", rarity: "EPICO", trait: "MEDO",
    baseStats: { hp: 550, atk: 80, def: 20, spd: 35 },
    ability: "Maldição do Eclipse", abilityDesc: "Reduz ATK do inimigo em 30% por 3 turnos.",
    emoji: "🧿",
  },
  CARD_MUMIA: {
    monsterId: "MUMIA", name: "Múmia Ancestral", region: "RUINAS_ASTERION", rarity: "RARO", trait: "SANGRAMENTO",
    baseStats: { hp: 700, atk: 65, def: 40, spd: 15 },
    ability: "Maldição Milenar", abilityDesc: "Impede a cura do inimigo por 3 turnos.",
    emoji: "🧟",
  },
  CARD_GARGULA: {
    monsterId: "GARGULA", name: "Gárgula de Pedra", region: "RUINAS_ASTERION", rarity: "EPICO", trait: "ESCUDO",
    baseStats: { hp: 800, atk: 60, def: 45, spd: 25 },
    ability: "Estátua Viva", abilityDesc: "Fica imune a dano por 1 turno a cada 4 turnos.",
    emoji: "🦇",
  },
  CARD_GUARDIAO: {
    monsterId: "GUARDIAO", name: "Guardião de Asterion", region: "RUINAS_ASTERION", rarity: "LENDARIO", trait: "ESPINHOS",
    baseStats: { hp: 1500, atk: 120, def: 60, spd: 20 },
    ability: "Juramento de Asterion", abilityDesc: "Reflete 50% de todo dano recebido.",
    emoji: "🛡️",
  },

  // ─── CICATRIZ PROFUNDA (T5) ───
  CARD_CRIA_VAZIO: {
    monsterId: "CRIA_VAZIO", name: "Cria do Vazio", region: "CICATRIZ_PROFUNDA", rarity: "RARO", trait: "MEDO",
    baseStats: { hp: 1200, atk: 90, def: 30, spd: 45 },
    ability: "Sussurro do Vazio", abilityDesc: "Reduz ATK do inimigo em 25%.",
    emoji: "👾",
  },
  CARD_VERME: {
    monsterId: "VERME", name: "Verme-Abissal", region: "CICATRIZ_PROFUNDA", rarity: "EPICO", trait: "SANGRAMENTO",
    baseStats: { hp: 1400, atk: 100, def: 40, spd: 20 },
    ability: "Devorar", abilityDesc: "Aplica sangramento permanente.",
    emoji: "🪱",
  },
  CARD_ABERRACAO: {
    monsterId: "ABERRACAO", name: "Aberração Tentacular", region: "CICATRIZ_PROFUNDA", rarity: "EPICO", trait: "SILENCIO",
    baseStats: { hp: 1300, atk: 110, def: 35, spd: 30 },
    ability: "Silêncio Abissal", abilityDesc: "Bloqueia habilidade do inimigo por 3 turnos.",
    emoji: "🦑",
  },
  CARD_SOMBRA: {
    monsterId: "SOMBRA", name: "Sombra Faminta", region: "CICATRIZ_PROFUNDA", rarity: "EPICO", trait: "MEDO",
    baseStats: { hp: 1000, atk: 120, def: 25, spd: 50 },
    ability: "Consumir Medo", abilityDesc: "Cada ataque reduz ATK do inimigo em 5% (acumula).",
    emoji: "🌑",
  },
  CARD_CEIFADOR_ALMAS: {
    monsterId: "CEIFADOR_ALMAS", name: "Ceifador de Almas", region: "CICATRIZ_PROFUNDA", rarity: "RARO", trait: "SANGRAMENTO",
    baseStats: { hp: 1500, atk: 130, def: 40, spd: 35 },
    ability: "Ceifa Final", abilityDesc: "Dano dobrado contra inimigos com <30% HP.",
    emoji: "💀",
  },
  CARD_OLHO_VAZIO: {
    monsterId: "OLHO_VAZIO", name: "Olho do Vazio", region: "CICATRIZ_PROFUNDA", rarity: "EPICO", trait: "SILENCIO",
    baseStats: { hp: 1100, atk: 140, def: 25, spd: 40 },
    ability: "Olhar Petrificante", abilityDesc: "Impede o inimigo de usar habilidade.",
    emoji: "👁️",
  },
  CARD_DEVORADOR: {
    monsterId: "DEVORADOR", name: "Devorador da Cicatriz", region: "CICATRIZ_PROFUNDA", rarity: "LENDARIO", trait: "MEDO",
    baseStats: { hp: 3000, atk: 200, def: 70, spd: 30 },
    ability: "Fim de Todas as Coisas", abilityDesc: "Ignora 50% da defesa do inimigo.",
    emoji: "👹",
  },
};

// ═══════════════════════════════════════════════════════════════
// STATS POR NÍVEL (1 a 5) — +20% por nível
// ═══════════════════════════════════════════════════════════════
export function getCardStats(template: CardTemplate, level: number): CardStats {
  const mult = 1 + (level - 1) * 0.2;
  return {
    hp:  Math.floor(template.baseStats.hp * mult),
    atk: Math.floor(template.baseStats.atk * mult),
    def: Math.floor(template.baseStats.def * mult),
    spd: Math.floor(template.baseStats.spd * mult),
  };
}

// ═══════════════════════════════════════════════════════════════
// CRIAR INSTÂNCIA
// ═══════════════════════════════════════════════════════════════
export function createCardInstance(templateId: string): CardInstance {
  return {
    uid: generateId(),
    templateId,
    level: 1,
    obtainedAt: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════
// DROP DE CARTAS
// Bosses: 0.5% (raríssimo). T1: 3%. T5: 0.5%.
// ═══════════════════════════════════════════════════════════════
export function rollCardDrop(monsterId: string, tier: number, isBoss: boolean): CardInstance | null {
  const templateId = `CARD_${monsterId}`;
  if (!CARD_TEMPLATES[templateId]) return null;

  // Bosses: chance fixa de 0.5% (raríssimo)
  if (isBoss) {
    if (Math.random() < 0.005) {
      return createCardInstance(templateId);
    }
    return null;
  }

  // Mobs comuns: chance por tier
  const chance = tier === 1 ? 0.03 : tier === 2 ? 0.02 : tier === 3 ? 0.015 : tier === 4 ? 0.01 : 0.005;
  if (Math.random() < chance) {
    return createCardInstance(templateId);
  }
  return null;
}