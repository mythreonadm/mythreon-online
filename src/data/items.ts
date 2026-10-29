import { Item, ItemCategory, ItemStats, SlotType } from "../types";
import { generateId } from "../utils/id";

export function createItem(template: Partial<Item> & { templateId: string; name: string }): Item {
  return { uid: generateId(), category: "ARMA", tier: 1, rarity: "COMUM", stats: {}, affixes: [], stackable: false, maxStack: 1, quantity: 1, icon: "📦", ...template } as Item;
}

type Tier = 1 | 2 | 3 | 4 | 5;
const TIERS: Tier[] = [1, 2, 3, 4, 5];

interface Family {
  key: string; category: ItemCategory; slot: SlotType; icon: string;
  names: [string, string, string, string, string];
  stats: Partial<Record<keyof ItemStats, [number, number, number, number, number]>>;
}

const FAMILIES: Family[] = [
  { key: "ESPADA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "⚔️", names: ["Espada de Aprendiz", "Lâmina de Aço-Estrela", "Sabre de Coral Negro", "Espada Real de Asterion", "Lâmina da Cicatriz"], stats: { atk: [10, 25, 60, 120, 250], def: [2, 5, 10, 20, 40] } },
  { key: "MACHADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "🪓", names: ["Machado de Lenhador", "Machado de Pedra-Fenda", "Machado de Maré Funda", "Machado Carrasco", "Cutelo Abissal"], stats: { atk: [12, 30, 75, 150, 300] } },
  { key: "CAJADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "🪄", names: ["Cajado de Aprendiz", "Cajado de Cristal", "Cajado de Pérola", "Cajado Astral", "Cajado do Vazio"], stats: { matk: [8, 20, 50, 100, 200], mp: [20, 50, 100, 200, 400] } },
  { key: "VARINHA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "✨", names: ["Varinha de Galho", "Varinha de Quartzo", "Varinha de Concha", "Varinha de Obsidiana", "Varinha do Abismo"], stats: { matk: [6, 15, 35, 70, 140], mp: [30, 70, 150, 300, 600], crit: [0.02, 0.04, 0.06, 0.08, 0.10] } },
  { key: "ARCO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "🏹", names: ["Arco de Caça", "Arco de Chifre", "Arco de Barbatana", "Arco Celeste", "Arco do Eclipse"], stats: { atk: [8, 22, 50, 100, 200], hit: [0.02, 0.04, 0.06, 0.08, 0.10] } },
  { key: "CAPACETE", category: "ARMADURA", slot: "CAPACETE", icon: "🎩", names: ["Capuz de Folha", "Elmo de Granito", "Elmo de Escamas", "Elmo de Bronze", "Coroa da Cicatriz"], stats: { arm: [3, 8, 18, 35, 70], hp: [20, 50, 120, 250, 500] } },
  { key: "PEITORAL", category: "ARMADURA", slot: "ARMADURA", icon: "👕", names: ["Túnica de Casca", "Couraça de Fenda", "Peitoral de Coral", "Couraça de Asterion", "Armadura do Abismo"], stats: { arm: [5, 12, 28, 55, 110], hp: [40, 100, 250, 500, 1000] } },
  { key: "LUVAS", category: "ARMADURA", slot: "LUVAS", icon: "🧤", names: ["Manoplas de Vinha", "Luvas de Couro", "Manoplas de Escama", "Manoplas de Bronze", "Garras da Cicatriz"], stats: { arm: [2, 5, 10, 20, 40], atk: [2, 4, 8, 16, 32] } },
  { key: "CALCAS", category: "ARMADURA", slot: "CALCAS", icon: "👖", names: ["Perneiras de Musgo", "Perneiras de Pedra", "Calças de Algas", "Grevas de Asterion", "Grevas do Abismo"], stats: { arm: [4, 9, 20, 40, 80], hp: [30, 70, 160, 320, 640] } },
  { key: "BOTAS", category: "ARMADURA", slot: "BOTAS", icon: "👢", names: ["Botas de Raiz", "Botas de Pele", "Botas de Maré", "Botas das Ruínas", "Botas do Vazio"], stats: { arm: [2, 6, 12, 25, 50], spd: [0.05, 0.08, 0.12, 0.16, 0.20] } },
  { key: "COLAR", category: "JOIA", slot: "COLAR", icon: "📿", names: ["Colar de Semente", "Colar de Presa", "Colar de Pérola", "Colar de Asterion", "Colar da Cicatriz"], stats: { hp: [20, 50, 120, 250, 500], mp: [10, 25, 60, 120, 240] } },
  { key: "ANEL", category: "JOIA", slot: "ANEL_I", icon: "💍", names: ["Anel de Seiva", "Anel de Quartzo", "Anel de Coral", "Anel Estelar", "Anel do Abismo"], stats: { hp: [10, 25, 60, 120, 240], atk: [2, 5, 10, 20, 40], matk: [2, 5, 10, 20, 40] } },
  { key: "ESCUDO", category: "ESCUDO", slot: "OFF_HAND", icon: "🛡️", names: ["Escudo de Cortiça", "Escudo de Granito", "Escudo de Carapaça", "Escudo de Asterion", "Escudo do Abismo"], stats: { def: [3, 8, 18, 35, 70], arm: [2, 5, 12, 25, 50], blk: [0.05, 0.08, 0.10, 0.12, 0.15] } },
];

function buildTemplates(): Record<string, Item> {
  const out: Record<string, Item> = {};
  for (const f of FAMILIES) {
    TIERS.forEach((tier, i) => {
      const stats: ItemStats = {};
      for (const [k, arr] of Object.entries(f.stats)) {
        const v = (arr as number[])[i];
        if (v) (stats as any)[k] = v;
      }
      const id = `${f.key}_T${tier}`;
      out[id] = createItem({ templateId: id, name: f.names[i], category: f.category, slot: f.slot, tier, stats, icon: f.icon });
    });
  }
  return out;
}

export const ALL_EQUIPMENT_TEMPLATES: Record<string, Item> = buildTemplates();

const POTION_DATA: { heal: number; name: string; icon: string }[] = [
  { heal: 100, name: "Poção de Vida Pequena", icon: "🧪" }, { heal: 300, name: "Poção de Vida Média", icon: "🍷" },
  { heal: 800, name: "Poção de Vida Grande", icon: "⚗️" }, { heal: 2000, name: "Poção de Vida Superior", icon: "🏺" },
  { heal: 5000, name: "Poção de Vida Suprema", icon: "🔮" },
];
export const POTION_TEMPLATES: Record<string, Item> = {};
POTION_DATA.forEach((p, i) => {
  const id = `POCAO_VIDA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: (i + 1) as Tier, stats: { hp: p.heal }, stackable: true, maxStack: 50, icon: p.icon });
});

const MANA_POTION_DATA = [
  { mana: 50, name: "Poção de Mana Pequena", icon: "🔵" },
  { mana: 150, name: "Poção de Mana Média", icon: "💙" },
  { mana: 400, name: "Poção de Mana Grande", icon: "🌊" }
];
MANA_POTION_DATA.forEach((p, i) => {
  const id = `POCAO_MANA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: (i + 1) as Tier, stats: { mp: p.mana }, stackable: true, maxStack: 50, icon: p.icon });
});

export const UNIQUE_TEMPLATES: Record<string, Item> = {
  UNICO_BRASA_ETERNA: createItem({ templateId: "UNICO_BRASA_ETERNA", name: "Brasa Eterna", category: "JOIA", slot: "ANEL_I", tier: 1, rarity: "LENDARIO", stats: { atk: 10, matk: 10, hp: 50 }, xpBonus: 0.10, icon: "🔥", uniqueEffect: "+10% de XP" }),
  UNICO_CORACAO_GRANITO: createItem({ templateId: "UNICO_CORACAO_GRANITO", name: "Coração de Granito", category: "JOIA", slot: "COLAR", tier: 2, rarity: "LENDARIO", stats: { hp: 300, arm: 15, resFisico: 0.08 }, icon: "🪨", uniqueEffect: "-8% de dano físico recebido" }),
  UNICO_ESCAMA_LEVIATA: createItem({ templateId: "UNICO_ESCAMA_LEVIATA", name: "Escama do Leviatã", category: "ESCUDO", slot: "OFF_HAND", tier: 3, rarity: "LENDARIO", stats: { def: 30, arm: 25, blk: 0.15, resMagico: 0.15 }, goldBonus: 0.15, icon: "🐚", uniqueEffect: "+15% de ouro" }),
  UNICO_OLHO_ASTERION: createItem({ templateId: "UNICO_OLHO_ASTERION", name: "Olho de Asterion", category: "ARMADURA", slot: "CAPACETE", tier: 4, rarity: "LENDARIO", stats: { arm: 60, hp: 800, crit: 0.10, hit: 0.10 }, rareDropBonus: 0.15, dropBonus: 0.05, icon: "👁️", uniqueEffect: "+15% de raridade alta" }),
  UNICO_PRESA_DEVORADOR: createItem({ templateId: "UNICO_PRESA_DEVORADOR", name: "Presa do Devorador", category: "ARMA", slot: "ARMA_PRINCIPAL", tier: 5, rarity: "LENDARIO", stats: { atk: 350, def: 50 }, lifesteal: 0.08, icon: "🦷", uniqueEffect: "Rouba 8% do dano como vida" }),
};

export const FRAGMENT_TEMPLATES: Record<string, Item> = {
  FRAGMENTO_COMUM: createItem({ templateId: "FRAGMENTO_COMUM", name: "Fragmento de Essência Comum", category: "FRAGMENTO", tier: 1, rarity: "COMUM", icon: "🪨", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_RARO: createItem({ templateId: "FRAGMENTO_RARO", name: "Fragmento de Essência Raro", category: "FRAGMENTO", tier: 1, rarity: "RARO", icon: "💎", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_EPICO: createItem({ templateId: "FRAGMENTO_EPICO", name: "Fragmento de Essência Épico", category: "FRAGMENTO", tier: 1, rarity: "EPICO", icon: "🔮", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
};

export const ALL_ITEM_TEMPLATES: Record<string, Item> = { ...ALL_EQUIPMENT_TEMPLATES, ...POTION_TEMPLATES, ...UNIQUE_TEMPLATES, ...FRAGMENT_TEMPLATES };