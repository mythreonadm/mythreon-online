// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/http.ts
var http_exports = {};
__export(http_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(http_exports);
var import_pg = require("pg");

// server/world.ts
var import_node_crypto2 = require("node:crypto");

// src/data/worldJourney.ts
var JOURNEY_CHAPTERS = [
  { id: "BOSQUE_LYSS", name: "Bosque de Lyss", subtitle: "O primeiro eco", story: "Ap\xF3s a Grande Ruptura, o Primeiro Canto sobrevive em fragmentos. Em Lyss, Mirelle acolhe os rec\xE9m-despertos e Sinax ensina a ouvir as mem\xF3rias das Consci\xEAncias.", conflict: "O Espectro de Brasa contamina ra\xEDzes e criaturas. Aprender a ca\xE7ar \xE9 apenas o come\xE7o: voc\xEA precisa decidir como carregar os ecos do mundo.", resolution: "A brasa vencida revela uma cicatriz que aponta para Dhor. A jornada prossegue quando o bosque estiver protegido.", mission: "Praga de Vespas", bossId: "ESPECTRO", bossTitle: "O Espectro de Brasa", bossLevel: 15, hunts: [{ id: "VESPA", name: "Vespas", count: 25 }] },
  { id: "PICO_DHOR", name: "Pico de Dhor", subtitle: "A Fenda T\xE9rmica", story: "Em Dhor, duas lembran\xE7as da Ruptura disputam a mesma montanha: lava de um lado, inverno im\xF3vel do outro. A neve n\xE3o apaga a chama e a chama n\xE3o derrete toda a neve.", conflict: "Estude os Elementais de Gelo e os Morcegos de Magma. Bolk precisa das duas assinaturas para estabilizar uma rota entre as encostas.", resolution: "O Colosso guarda o ponto onde as for\xE7as se encontram. Venc\xEA-lo permite preparar a descida at\xE9 Azhar ou desviar para Veyra.", mission: "Entre a Geada e a Brasa", bossId: "COLOSSO", bossTitle: "O Colosso de Dhor", bossLevel: 24, hunts: [{ id: "ELEMENTAL_GELO", name: "Elementais de Gelo", count: 40 }, { id: "MORCEGO_MAGMA", name: "Morcegos de Magma", count: 40 }], pass: { questId: "PASS_DHOR", npc: "Ferreiro Bolk", level: 15, gold: 3500, requires: "LYSS_BOSS", items: [{ id: "A1", count: 30 }, { id: "A2", count: 20 }, { id: "S1", count: 10 }] } },
  { id: "MAR_AZHAR", name: "Mar de Azhar", subtitle: "As vozes submersas", story: "O degelo de Dhor encontra Azhar, onde os pilares afogados ainda vibram com o Primeiro Canto. O mar guarda mem\xF3rias que a terra esqueceu.", conflict: "Serpentes e Medusas cercam os pilares de navega\xE7\xE3o. Recolha sinais das criaturas para que a expedi\xE7\xE3o alcance o santu\xE1rio submerso.", resolution: "O Leviat\xE3 protege a mem\xF3ria das primeiras cidades. Sua derrota revela a rota para Asterion e as dunas de Kaelor.", mission: "Cartografia das Mar\xE9s", bossId: "LEVIATA", bossTitle: "Leviat\xE3 de Azhar", bossLevel: 43, hunts: [{ id: "SERPENTE", name: "Serpentes", count: 60 }, { id: "MEDUSA", name: "Medusas", count: 60 }], pass: { questId: "PASS_AZHAR", npc: "Cart\xF3grafa Nara", level: 26, gold: 18e3, requires: "PICO_DHOR_BOSS", items: [{ id: "A9", count: 40 }, { id: "A11", count: 30 }, { id: "S7", count: 15 }] } },
  { id: "PANTANO_VEYRA", name: "P\xE2ntano de Veyra", subtitle: "A mem\xF3ria que cria ra\xEDzes", story: "A oeste de Dhor, a \xE1gua da montanha alimenta um p\xE2ntano luminoso. Aqui as mem\xF3rias crescem como cip\xF3s, e o veneno protege aquilo que n\xE3o deve ser esquecido.", conflict: "A resina da Ruptura tornou os Sapos-Miasma e os Cip\xF3s da Mem\xF3ria agressivos. Separe a lembran\xE7a viva da contamina\xE7\xE3o.", resolution: "A Matriarca do Lodo mant\xE9m o \xFAltimo c\xEDrculo de ra\xEDzes. Ao venc\xEA-la, voc\xEA preserva uma mem\xF3ria de Lyss que o fogo n\xE3o conseguiu consumir.", mission: "Ra\xEDzes que Recordam", bossId: "MATRIARCA_LODO", bossTitle: "Matriarca do Lodo", bossLevel: 44, hunts: [{ id: "SAPO_MIASMA", name: "Sapos-Miasma", count: 60 }, { id: "CIPO_MEMORIA", name: "Cip\xF3s da Mem\xF3ria", count: 60 }], pass: { questId: "PASS_VEYRA", npc: "Herbalista Tom\xE9", level: 26, gold: 15e3, requires: "PICO_DHOR_BOSS", items: [{ id: "A4", count: 40 }, { id: "A11", count: 25 }, { id: "S5", count: 15 }] } },
  { id: "RUINAS_ASTERION", name: "Ru\xEDnas de Asterion", subtitle: "O arquivo partido", story: "Asterion tentou aprisionar o Primeiro Canto em pedra. Seus corredores guardam tanto conhecimento como os erros que antecederam a Ruptura.", conflict: "M\xFAmias e Cultistas disputam os registros. Recupere o caminho at\xE9 o arquivo sem repetir a obsess\xE3o de seus antigos mestres.", resolution: "O Guardi\xE3o distingue herdeiros de saqueadores. Ao superar sua prova, a Cicatriz Profunda deixa de ser apenas uma hist\xF3ria proibida.", mission: "P\xE1ginas sob a Areia", bossId: "GUARDIAO", bossTitle: "Guardi\xE3o de Asterion", bossLevel: 66, hunts: [{ id: "MUMIA", name: "M\xFAmias", count: 80 }, { id: "CULTISTA", name: "Cultistas", count: 80 }], pass: { questId: "PASS_ASTERION", npc: "Arquivista Sinax", level: 46, gold: 5e4, requires: "MAR_AZHAR_BOSS", items: [{ id: "A12", count: 60 }, { id: "A5", count: 40 }, { id: "S6", count: 20 }] } },
  { id: "DESERTO_KAELOR", name: "Deserto de Kaelor", subtitle: "O sol aprisionado", story: "Al\xE9m de Azhar, o calor da Ruptura vitrificou as dunas. Metal, fogo e miragens guardam os caminhos entre observat\xF3rios enterrados.", conflict: "Escaravelhos V\xEDtreos e Espectros Solares alimentam um farol quebrado. Silencie seus reflexos antes de cruzar as dunas.", resolution: "A Sentinela do Z\xEAnite confunde viajantes com invasores. Desfaz\xEA-la devolve \xE0 noite o c\xE9u de Kaelor.", mission: "Reflexos do Sol Partido", bossId: "SENTINELA_ZENITE", bossTitle: "Sentinela do Z\xEAnite", bossLevel: 68, hunts: [{ id: "ESCARAVELHO_VITREO", name: "Escaravelhos V\xEDtreos", count: 80 }, { id: "ESPECTRO_SOLAR", name: "Espectros Solares", count: 80 }], pass: { questId: "PASS_KAELOR", npc: "Cart\xF3grafa Nara", level: 46, gold: 65e3, requires: "MAR_AZHAR_BOSS", items: [{ id: "A13", count: 60 }, { id: "A6", count: 40 }, { id: "S10", count: 20 }] } },
  { id: "CICATRIZ_PROFUNDA", name: "Cicatriz Profunda", subtitle: "O sil\xEAncio entre os ecos", story: "Na Cicatriz, o mundo ainda n\xE3o decidiu que forma ter\xE1. O Vazio devora identidades e oferece poder \xE0queles que abandonam suas mem\xF3rias.", conflict: "Crias do Vazio e Olhos do Vazio vigiam o caminho. Leve consigo o que aprendeu, sem confundir transforma\xE7\xE3o com esquecimento.", resolution: "O Devorador \xE9 a fome deixada pela Ruptura. Enfrent\xE1-lo n\xE3o apaga o passado: abre espa\xE7o para escrever o pr\xF3ximo canto.", mission: "Conservar o Pr\xF3prio Nome", bossId: "DEVORADOR", bossTitle: "O Devorador", bossLevel: 95, hunts: [{ id: "CRIA_VAZIO", name: "Crias do Vazio", count: 100 }, { id: "OLHO_VAZIO", name: "Olhos do Vazio", count: 100 }], pass: { questId: "PASS_CICATRIZ", npc: "Anci\xE3 Seraphine", level: 71, gold: 2e5, requires: "RUINAS_ASTERION_BOSS", items: [{ id: "A14", count: 80 }, { id: "A15", count: 40 }, { id: "S7", count: 30 }] } }
];

// src/utils/id.ts
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// src/data/items.ts
function createItem(template) {
  return { uid: generateId(), category: "ARMA", tier: 1, rarity: "COMUM", stats: {}, affixes: [], stackable: false, maxStack: 1, quantity: 1, icon: "\u{1F4E6}", upgradeLevel: 0, ...template };
}
var TIERS = [1, 2, 3, 4, 5];
var FAMILIES = [
  // ARMAS (ATK/MATK focado)
  { key: "ESPADA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u2694\uFE0F", names: ["Espada de Aprendiz", "L\xE2mina de A\xE7o-Estrela", "Sabre de Coral Negro", "Espada Real de Asterion", "L\xE2mina da Cicatriz"], stats: { atk: [12, 28, 65, 130, 260], def: [2, 5, 10, 20, 40] } },
  { key: "MACHADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1FA93}", names: ["Machado de Lenhador", "Machado de Pedra-Fenda", "Machado de Mar\xE9 Funda", "Machado Carrasco", "Cutelo Abissal"], stats: { atk: [15, 35, 80, 160, 320] } },
  { key: "CAJADO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1FA84}", names: ["Cajado de Aprendiz", "Cajado de Cristal", "Cajado de P\xE9rola", "Cajado Astral", "Cajado do Vazio"], stats: { matk: [10, 25, 55, 110, 220], mp: [20, 50, 120, 250, 500] } },
  { key: "VARINHA", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u2728", names: ["Varinha de Galho", "Varinha de Quartzo", "Varinha de Concha", "Varinha de Obsidiana", "Varinha do Abismo"], stats: { matk: [8, 18, 40, 80, 160], mp: [30, 70, 160, 320, 640], crit: [0.02, 0.04, 0.06, 0.08, 0.1] } },
  { key: "ARCO", category: "ARMA", slot: "ARMA_PRINCIPAL", icon: "\u{1F3F9}", names: ["Arco de Ca\xE7a", "Arco de Chifre", "Arco de Barbatana", "Arco Celeste", "Arco do Eclipse"], stats: { atk: [10, 24, 55, 110, 220], hit: [0.02, 0.04, 0.06, 0.08, 0.1] } },
  // ARMADURAS (ARM/HP focado)
  { key: "CAPACETE", category: "ARMADURA", slot: "CAPACETE", icon: "\u{1F3A9}", names: ["Capuz de Folha", "Elmo de Granito", "Elmo de Escamas", "Elmo de Bronze", "Coroa da Cicatriz"], stats: { arm: [3, 8, 18, 35, 70], hp: [30, 80, 180, 380, 800] } },
  { key: "PEITORAL", category: "ARMADURA", slot: "ARMADURA", icon: "\u{1F455}", names: ["T\xFAnica de Casca", "Coura\xE7a de Fenda", "Peitoral de Coral", "Coura\xE7a de Asterion", "Armadura do Abismo"], stats: { arm: [5, 12, 28, 55, 110], hp: [50, 120, 280, 580, 1200] } },
  { key: "LUVAS", category: "ARMADURA", slot: "LUVAS", icon: "\u{1F9E4}", names: ["Manoplas de Vinha", "Luvas de Couro", "Manoplas de Escama", "Manoplas de Bronze", "Garras da Cicatriz"], stats: { arm: [2, 5, 10, 20, 40], atk: [2, 5, 12, 25, 50] } },
  { key: "CALCAS", category: "ARMADURA", slot: "CALCAS", icon: "\u{1F456}", names: ["Perneiras de Musgo", "Perneiras de Pedra", "Cal\xE7as de Algas", "Grevas de Asterion", "Grevas do Abismo"], stats: { arm: [4, 9, 20, 40, 80], hp: [40, 90, 200, 420, 850] } },
  { key: "BOTAS", category: "ARMADURA", slot: "BOTAS", icon: "\u{1F462}", names: ["Botas de Raiz", "Botas de Pele", "Botas de Mar\xE9", "Botas das Ru\xEDnas", "Botas do Vazio"], stats: { arm: [2, 6, 12, 25, 50], spd: [0.05, 0.08, 0.12, 0.16, 0.2] } },
  // JOIAS (Mistas)
  { key: "COLAR", category: "JOIA", slot: "COLAR", icon: "\u{1F4FF}", names: ["Colar de Semente", "Colar de Presa", "Colar de P\xE9rola", "Colar de Asterion", "Colar da Cicatriz"], stats: { hp: [30, 70, 160, 330, 680], mp: [15, 35, 80, 165, 340] } },
  { key: "ANEL", category: "JOIA", slot: "ANEL_I", icon: "\u{1F48D}", names: ["Anel de Seiva", "Anel de Quartzo", "Anel de Coral", "Anel Estelar", "Anel do Abismo"], stats: { hp: [15, 35, 80, 165, 340], atk: [3, 7, 15, 30, 60], matk: [3, 7, 15, 30, 60] } },
  { key: "PULSEIRA", category: "PULSEIRA", slot: "PULSEIRA", icon: "\u{1F4FF}", names: ["Bracelete de Broto", "Pulseira da Seiva", "Bracelete de Mar\xE9", "Manilha Estelar", "Bracelete do Eclipse Sereno"], stats: { hp: [20, 45, 100, 220, 450], mp: [15, 35, 80, 180, 360], hpRegen: [1, 2, 3, 5, 8], mpRegen: [1, 2, 3, 5, 8] } },
  // ESCUDOS
  { key: "ESCUDO", category: "ESCUDO", slot: "OFF_HAND", icon: "\u{1F6E1}\uFE0F", names: ["Escudo de Corti\xE7a", "Escudo de Granito", "Escudo de Carapa\xE7a", "Escudo de Asterion", "Escudo do Abismo"], stats: { def: [4, 10, 22, 45, 90], arm: [2, 5, 12, 25, 50], blk: [0.05, 0.08, 0.1, 0.12, 0.15] } }
];
function buildTemplates() {
  const out = {};
  for (const f of FAMILIES) {
    TIERS.forEach((tier, i) => {
      const stats = {};
      for (const [k, arr] of Object.entries(f.stats)) {
        const v = arr[i];
        if (v) stats[k] = v;
      }
      const id = `${f.key}_T${tier}`;
      out[id] = createItem({ templateId: id, name: f.names[i], category: f.category, slot: f.slot, tier, stats, icon: f.icon });
    });
  }
  return out;
}
var ALL_EQUIPMENT_TEMPLATES = buildTemplates();
var ARROW_TEMPLATES = Object.fromEntries(TIERS.map((tier) => {
  const names = ["Flecha de Madeira", "Flecha de Pedra", "Flecha de A\xE7o", "Flecha Estelar", "Flecha do Eclipse"];
  const item = createItem({ templateId: `FLECHA_T${tier}`, name: names[tier - 1], category: "FLECHA", slot: "MUNICAO", tier, rarity: "COMUM", stats: {}, stackable: true, maxStack: 999, icon: "\u{1F3F9}" });
  return [item.templateId, item];
}));
var POTION_DATA = [
  { heal: 100, name: "Po\xE7\xE3o de Vida Pequena", icon: "\u{1F9EA}" },
  { heal: 300, name: "Po\xE7\xE3o de Vida M\xE9dia", icon: "\u{1F377}" },
  { heal: 800, name: "Po\xE7\xE3o de Vida Grande", icon: "\u2697\uFE0F" },
  { heal: 2e3, name: "Po\xE7\xE3o de Vida Superior", icon: "\u{1F3FA}" },
  { heal: 5e3, name: "Po\xE7\xE3o de Vida Suprema", icon: "\u{1F52E}" }
];
var POTION_TEMPLATES = {};
POTION_DATA.forEach((p, i) => {
  const id = `POCAO_VIDA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: i + 1, stats: { hp: p.heal }, stackable: true, maxStack: 50, icon: p.icon });
});
var MANA_POTION_DATA = [
  { mana: 50, name: "Po\xE7\xE3o de Mana Pequena", icon: "\u{1F535}" },
  { mana: 150, name: "Po\xE7\xE3o de Mana M\xE9dia", icon: "\u{1F499}" },
  { mana: 400, name: "Po\xE7\xE3o de Mana Grande", icon: "\u{1F30A}" }
];
MANA_POTION_DATA.forEach((p, i) => {
  const id = `POCAO_MANA_${i + 1}`;
  POTION_TEMPLATES[id] = createItem({ templateId: id, name: p.name, category: "POCAO", tier: i + 1, stats: { mp: p.mana }, stackable: true, maxStack: 50, icon: p.icon });
});
var UNIQUE_TEMPLATES = {
  UNICO_BRASA_ETERNA: createItem({ templateId: "UNICO_BRASA_ETERNA", name: "Brasa Eterna", category: "JOIA", slot: "ANEL_I", tier: 1, rarity: "LENDARIO", stats: { atk: 10, matk: 10, hp: 100 }, xpBonus: 0.1, icon: "\u{1F525}", uniqueEffect: "+10% de XP" }),
  UNICO_CORACAO_GRANITO: createItem({ templateId: "UNICO_CORACAO_GRANITO", name: "Cora\xE7\xE3o de Granito", category: "JOIA", slot: "COLAR", tier: 2, rarity: "LENDARIO", stats: { hp: 500, arm: 25, resFisico: 0.08 }, icon: "\u{1FAA8}", uniqueEffect: "-8% de dano f\xEDsico recebido" }),
  UNICO_ESCAMA_LEVIATA: createItem({ templateId: "UNICO_ESCAMA_LEVIATA", name: "Escama do Leviat\xE3", category: "ESCUDO", slot: "OFF_HAND", tier: 3, rarity: "LENDARIO", stats: { def: 50, arm: 40, blk: 0.15, resMagico: 0.15 }, goldBonus: 0.15, icon: "\u{1F41A}", uniqueEffect: "+15% de ouro" }),
  UNICO_OLHO_ASTERION: createItem({ templateId: "UNICO_OLHO_ASTERION", name: "Olho de Asterion", category: "ARMADURA", slot: "CAPACETE", tier: 4, rarity: "LENDARIO", stats: { arm: 100, hp: 1500, crit: 0.1, hit: 0.1 }, rareDropBonus: 0.15, dropBonus: 0.05, icon: "\u{1F441}\uFE0F", uniqueEffect: "+15% de raridade alta" }),
  UNICO_PRESA_DEVORADOR: createItem({ templateId: "UNICO_PRESA_DEVORADOR", name: "Presa do Devorador", category: "ARMA", slot: "ARMA_PRINCIPAL", tier: 5, rarity: "LENDARIO", stats: { atk: 500, def: 80 }, lifesteal: 0.08, icon: "\u{1F9B7}", uniqueEffect: "Rouba 8% do dano como vida" }),
  UNICO_ANEL_GUARDIA: createItem({ templateId: "UNICO_ANEL_GUARDIA", name: "Anel da Guarda Eterna", category: "JOIA", slot: "ANEL_I", tier: 5, rarity: "LENDARIO", stats: { hp: 250, arm: 20 }, preventsDeathDrop: true, icon: "\u{1F48D}", uniqueEffect: "Impede 100% das perdas de itens ao morrer" }),
  UNICO_SIGILO_INICIACAO: createItem({ templateId: "UNICO_SIGILO_INICIACAO", name: "Pulseira do Primeiro Eco", category: "PULSEIRA", slot: "PULSEIRA", tier: 1, rarity: "LENDARIO", stats: { hp: 60, mp: 40, hpRegen: 2, mpRegen: 2 }, icon: "\u2728", uniqueEffect: "Rel\xEDquia exclusiva por concluir o tutorial de Mythreon" })
};
var FRAGMENT_TEMPLATES = {
  FRAGMENTO_COMUM: createItem({ templateId: "FRAGMENTO_COMUM", name: "Fragmento Comum", category: "FRAGMENTO", tier: 1, rarity: "COMUM", icon: "\u{1FAA8}", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_RARO: createItem({ templateId: "FRAGMENTO_RARO", name: "Fragmento Raro", category: "FRAGMENTO", tier: 1, rarity: "RARO", icon: "\u{1F48E}", stackable: true, maxStack: 999, quantity: 1, stats: {} }),
  FRAGMENTO_EPICO: createItem({ templateId: "FRAGMENTO_EPICO", name: "Fragmento \xC9pico", category: "FRAGMENTO", tier: 1, rarity: "EPICO", icon: "\u{1F52E}", stackable: true, maxStack: 999, quantity: 1, stats: {} })
};
var ALL_ITEM_TEMPLATES = { ...ALL_EQUIPMENT_TEMPLATES, ...ARROW_TEMPLATES, ...POTION_TEMPLATES, ...UNIQUE_TEMPLATES, ...FRAGMENT_TEMPLATES };

// src/engine/training.ts
var TRAINING_MILESTONES = [
  { id: "PRIMEIRO_RITUAL", name: "Primeiro Ritual", seconds: 300, gold: 100, fragments: 2 },
  { id: "DISCIPULO", name: "Disc\xEDpulo da Ess\xEAncia", seconds: 1800, gold: 250, fragments: 5 },
  { id: "DEDICADO", name: "Disciplina Inabal\xE1vel", seconds: 7200, gold: 500, fragments: 10 },
  { id: "MESTRE", name: "Guardi\xE3o da Disciplina", seconds: 36e3, gold: 1500, fragments: 25 }
];
function masteryBonus(char, skill) {
  return Math.min(0.3, Math.max(0, char.trainingMastery?.[skill] ?? 0) * 0.01);
}
function trainingXpNeeded(level) {
  const n = Math.max(0, level - 10);
  return Math.floor(900 + 120 * n + 18 * n * n + Math.max(0, n - 10) ** 3 * 12);
}
function applyTrainingDeathPenalty(char) {
  const entries = Object.keys(char.skills).filter((skill2) => (char.skills[skill2] ?? 0) > 10).sort((a, b) => (char.skills[b] ?? 0) - (char.skills[a] ?? 0));
  const skill = entries[0];
  if (!skill) return null;
  const previous = char.skills[skill];
  char.skills[skill] = Math.max(10, previous - 1);
  const needed = trainingXpNeeded(char.skills[skill]);
  char.skillXp[skill] = Math.floor(Math.min(char.skillXp[skill] ?? 0, needed - 1) * 0.9);
  return `\u2620\uFE0F A morte interrompeu sua disciplina: ${skill} caiu de ${previous} para ${char.skills[skill]}.`;
}
function applyTraining(char, now) {
  const skill = char.trainingSkill;
  if (!skill) return [];
  const previous = char.trainingLastTick ?? now;
  const ticks = Math.min(20, Math.max(0, Math.floor((now - previous) / 3e3)));
  if (!ticks) return [];
  const start = now - ticks * 3e3;
  const boostedSeconds = Math.max(0, Math.min(now, char.trainingBoostUntil ?? 0) - start) / 1e3;
  char.trainingLastTick = now;
  char.lastTick = now;
  char.trainingSeconds ??= {};
  char.trainingMastery ??= {};
  char.trainingAchievements ??= [];
  char.trainingSeconds[skill] = (char.trainingSeconds[skill] ?? 0) + ticks * 3;
  char.skillXp[skill] += ticks * 15 + boostedSeconds * 2.5;
  const log = [];
  while (char.skillXp[skill] >= trainingXpNeeded(char.skills[skill])) {
    char.skillXp[skill] -= trainingXpNeeded(char.skills[skill]);
    char.skills[skill]++;
    char.trainingMastery[skill] = (char.trainingMastery[skill] ?? 0) + 1;
    log.push(`Maestria em ${skill}: n\xEDvel ${char.skills[skill]}!`);
  }
  const seconds = Object.values(char.trainingSeconds).reduce((sum, n) => sum + (n ?? 0), 0);
  for (const reward of TRAINING_MILESTONES) {
    if (seconds < reward.seconds || char.trainingAchievements.includes(reward.id)) continue;
    char.trainingAchievements.push(reward.id);
    char.gold += reward.gold;
    const fragments = createItem({ ...FRAGMENT_TEMPLATES.FRAGMENTO_COMUM, quantity: reward.fragments });
    const stackSpace = char.inventory.items.filter((item) => item.templateId === fragments.templateId && item.stackable).reduce((sum, item) => sum + Math.max(0, item.maxStack - item.quantity), 0);
    if (char.inventory.items.length < char.inventory.backpack.slots || stackSpace >= fragments.quantity) addItem(char.inventory, fragments);
    else char.depot.push(fragments);
    log.push(`Conquista: ${reward.name}! +${reward.gold} gold e ${reward.fragments} Fragmentos Comuns.`);
  }
  return log;
}

// src/data/balance.ts
var BALANCE = {
  resistanceCap: 0.6,
  armorCap: 0.7,
  killRecovery: 0.02,
  equipmentDrop: 0.18,
  bossEquipmentDrop: 0.65
};
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function mitigatedDamage(raw, armor) {
  if (raw <= 0) return 0;
  const reduction = clamp(Math.max(0, armor) / (Math.max(0, armor) + raw + 40), 0, BALANCE.armorCap);
  return Math.max(1, raw * (1 - reduction));
}

// src/data/elementalChart.ts
var ELEMENTS = [
  { id: "FOGO", name: "Fogo", icon: "\u{1F525}" },
  { id: "ELETRICIDADE", name: "Eletricidade", icon: "\u26A1" },
  { id: "VENTO", name: "Vento", icon: "\u{1F32A}\uFE0F" },
  { id: "TERRA", name: "Terra", icon: "\u{1FAA8}" },
  { id: "AGUA", name: "\xC1gua", icon: "\u{1F30A}" },
  { id: "GELO", name: "Gelo", icon: "\u2744\uFE0F" },
  { id: "MORTE", name: "Morte", icon: "\u2620\uFE0F" },
  { id: "SAGRADO", name: "Sagrado", icon: "\u2728" },
  { id: "PSIQUICO", name: "Ps\xEDquico", icon: "\u{1F52E}" },
  { id: "VENENO", name: "Veneno", icon: "\u2623\uFE0F" },
  { id: "METAL", name: "Metal", icon: "\u2699\uFE0F" },
  { id: "BASE", name: "Base", icon: "\u2694\uFE0F" }
];
var ADVANTAGES = {
  FOGO: ["GELO", "METAL"],
  ELETRICIDADE: ["AGUA", "VENTO"],
  VENTO: ["TERRA", "VENENO"],
  TERRA: ["ELETRICIDADE", "METAL", "FOGO"],
  AGUA: ["FOGO", "TERRA"],
  GELO: ["VENTO", "TERRA"],
  MORTE: ["SAGRADO", "PSIQUICO"],
  SAGRADO: ["MORTE", "VENENO"],
  PSIQUICO: ["VENENO", "MORTE"],
  VENENO: ["AGUA", "VENTO"],
  METAL: ["GELO", "PSIQUICO"],
  BASE: []
};
function elementMultiplier(attack, defense) {
  if (!attack || !defense || attack === "BASE" || defense === "BASE") return 1;
  if (ADVANTAGES[attack]?.includes(defense) && ADVANTAGES[defense]?.includes(attack)) return 1;
  if (ADVANTAGES[attack]?.includes(defense)) return 1.25;
  if (ADVANTAGES[defense]?.includes(attack)) return 0.75;
  return 1;
}
function attackElement(attackId) {
  const byAttack = {
    A1: "BASE",
    A2: "VENENO",
    A3: "FOGO",
    A4: "BASE",
    A5: "VENENO",
    A6: "METAL",
    A7: "VENTO",
    A8: "MORTE",
    A9: "TERRA",
    A10: "PSIQUICO",
    A11: "GELO",
    A12: "AGUA",
    A13: "ELETRICIDADE",
    A14: "MORTE",
    A15: "SAGRADO"
  };
  return byAttack[attackId ?? ""] ?? "BASE";
}

// src/data/skills.ts
var ATTACK_SKILLS = {
  A1: { mult: 2, pierce: 0.1, manaCost: 10, desc: "Mordida Feral: Dano f\xEDsico pesado." },
  A2: { mult: 1.8, pierce: 0.3, manaCost: 12, desc: "Ferr\xE3o Venenoso: Dano com veneno." },
  A3: { mult: 2.2, pierce: 0.5, manaCost: 15, desc: "Chama Espectral: Dano m\xE1gico em \xE1rea." },
  A4: { mult: 2.1, pierce: 0.4, manaCost: 15, desc: "Garra Perfurante: Ignora defesa." },
  A5: { mult: 1.9, pierce: 0.2, manaCost: 12, desc: "Pe\xE7onha: Dano e lentid\xE3o." },
  A6: { mult: 2, pierce: 0.35, manaCost: 14, desc: "Corte: Dano perfurante r\xE1pido." },
  A7: { mult: 1.8, pierce: 0.2, manaCost: 12, desc: "Espinho: Causa sangramento." },
  A8: { mult: 2.2, pierce: 0.2, manaCost: 16, desc: "Mordida Medonha: Causa medo." },
  A9: { mult: 2.5, pierce: 0, manaCost: 18, desc: "Impacto: Dano em cone brutal." },
  A10: { mult: 2, pierce: 0.3, manaCost: 14, desc: "Corte Silencioso: Dano e sil\xEAncio." },
  A11: { mult: 2.3, pierce: 0.4, manaCost: 16, desc: "Lan\xE7a G\xE9lida: Congela o alvo." },
  A12: { mult: 2.4, pierce: 0.8, manaCost: 20, desc: "Chicote Abissal: Ignora quase toda armadura." },
  A13: { mult: 2.6, pierce: 0.5, manaCost: 22, desc: "Descarga: Dano de trov\xE3o em cadeia." },
  A14: { mult: 2.2, pierce: 0.3, manaCost: 18, lifesteal: 0.4, desc: "Devorar: Drena vida do alvo." },
  A15: { mult: 3, pierce: 0.6, manaCost: 25, desc: "Julgamento Estelar: Dano sagrado devastador." }
};
var ATTACK_SKILL_COOLDOWN = 3;
var SUPPORT_EFFECTS = {
  S1: { cd: 5, healPct: 0.15, desc: "B\xEAn\xE7\xE3o de Lyss: Cura 15% do HP a cada 15s." },
  S2: { cd: 6, dur: 3, atkPct: 0.15, armPct: 0.15, desc: "V\xEDnculo: +15% ATK/ARM por 9s a cada 18s." },
  S3: { cd: 6, healPct: 0.12, desc: "Aurora: Cura 12% do HP a cada 18s." },
  S4: { cd: 6, dur: 2, dmgReduction: 0.35, desc: "V\xE9u: Escudo de -35% de dano por 6s." },
  S5: { cd: 4, doubleStrike: true, desc: "Acelera\xE7\xE3o: Ataque duplo a cada 12s." },
  S6: { cd: 5, dur: 3, ignoreArmor: 0.3, desc: "Revela\xE7\xE3o: Ignora 30% da armadura inimiga." },
  S7: { cd: 5, dur: 3, armPct: 0.25, desc: "Baluarte: +25% armadura por 9s." },
  S8: { cd: 4, dodgeEvery: 4, desc: "Passo: Esquiva 1 ataque a cada 12s." },
  S9: { cd: 1, permDmgReduction: 0.1, desc: "Adapta\xE7\xE3o: -10% de dano recebido." },
  S10: { cd: 1, critBonus: 0.08, hitBonus: 0.05, desc: "C\xE1lculo: +8% cr\xEDtico, +5% precis\xE3o." },
  S11: { cd: 1, permAtkPct: 0.1, permArmPct: 0.1, desc: "Equil\xEDbrio: +10% ATK e ARM." },
  S12: { cd: 1, lifesteal: 0.1, desc: "Fus\xE3o: Rouba 10% do dano causado." },
  S13: { cd: 1, executeBonus: 0.5, desc: "Preda\xE7\xE3o: +50% dano em alvos com <40% HP." }
};
var PASSIVE_EFFECTS = {
  P1: { healPct: 0.25, desc: "+25% de cura recebida." },
  P2: { armPct: 0.15, stats: { def: 5 }, desc: "+15% armadura, +5 DEF." },
  P3: { stats: { resMagico: 0.1, resFisico: 0.05 }, desc: "+10% resist. m\xE1gica, +5% f\xEDsica." },
  P4: { stats: { spd: 0.15 }, desc: "+15% de chance de ataque extra." },
  P5: { healPct: 0.2, hpPct: 0.1, desc: "+20% cura recebida, +10% HP." },
  P6: { stats: { dge: 0.08 }, desc: "+8% esquiva." },
  P7: { skillDmgPct: 0.3, desc: "+30% de dano nas habilidades." },
  P8: { cdReduce: 1, desc: "Habilidade recarrega 1 tick mais r\xE1pido." },
  P9: { stats: { crit: 0.1 }, desc: "+10% de cr\xEDtico." },
  P10: { xpPct: 0.15, desc: "+15% de XP." },
  P11: { rareDropPct: 0.2, desc: "+20% de chance de raridade alta." },
  P12: { goldPct: 0.2, desc: "+20% de ouro." }
};

// src/data/vials.ts
var VIALS = {
  VIAL_TITAN_1: { id: "VIAL_TITAN_1", name: "Vial do Tit\xE3 I", description: "+15 For\xE7a (ATK) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { atk: 15 }, price: 500 },
  VIAL_SAGE_1: { id: "VIAL_SAGE_1", name: "Vial do S\xE1bio I", description: "+15 Intelig\xEAncia (MATK) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { matk: 15 }, price: 500 },
  VIAL_SHADOW_1: { id: "VIAL_SHADOW_1", name: "Vial da Sombra I", description: "+5% Cr\xEDtico e +5% Precis\xE3o por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { crit: 0.05, hit: 0.05 }, price: 500 },
  VIAL_GALE_1: { id: "VIAL_GALE_1", name: "Vial da Ventania I", description: "+10% Vel. Ataque (SPD) por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { spd: 0.1 }, price: 500 },
  VIAL_AEGIS_1: { id: "VIAL_AEGIS_1", name: "Vial da \xC9gide I", description: "+20 Armadura e +100 Vida por 15 min", durationMinutes: 15, icon: "\u{1F9EA}", stats: { arm: 20, hp: 100 }, price: 500 },
  VIAL_TITAN_2: { id: "VIAL_TITAN_2", name: "Vial do Tit\xE3 II", description: "+40 For\xE7a (ATK) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { atk: 40 }, price: 2500 },
  VIAL_SAGE_2: { id: "VIAL_SAGE_2", name: "Vial do S\xE1bio II", description: "+40 Intelig\xEAncia (MATK) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { matk: 40 }, price: 2500 },
  VIAL_SHADOW_2: { id: "VIAL_SHADOW_2", name: "Vial da Sombra II", description: "+10% Cr\xEDtico e +10% Precis\xE3o por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { crit: 0.1, hit: 0.1 }, price: 2500 },
  VIAL_GALE_2: { id: "VIAL_GALE_2", name: "Vial da Ventania II", description: "+20% Vel. Ataque (SPD) por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { spd: 0.2 }, price: 2500 },
  VIAL_AEGIS_2: { id: "VIAL_AEGIS_2", name: "Vial da \xC9gide II", description: "+50 Armadura e +300 Vida por 30 min", durationMinutes: 30, icon: "\u2697\uFE0F", stats: { arm: 50, hp: 300 }, price: 2500 },
  VIAL_TITAN_3: { id: "VIAL_TITAN_3", name: "Vial do Tit\xE3 III", description: "+100 For\xE7a (ATK) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { atk: 100 }, price: 1e4 },
  VIAL_SAGE_3: { id: "VIAL_SAGE_3", name: "Vial do S\xE1bio III", description: "+100 Intelig\xEAncia (MATK) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { matk: 100 }, price: 1e4 },
  VIAL_SHADOW_3: { id: "VIAL_SHADOW_3", name: "Vial da Sombra III", description: "+15% Cr\xEDtico e +15% Precis\xE3o por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { crit: 0.15, hit: 0.15 }, price: 1e4 },
  VIAL_GALE_3: { id: "VIAL_GALE_3", name: "Vial da Ventania III", description: "+30% Vel. Ataque (SPD) por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { spd: 0.3 }, price: 1e4 },
  VIAL_AEGIS_3: { id: "VIAL_AEGIS_3", name: "Vial da \xC9gide III", description: "+100 Armadura e +800 Vida por 60 min", durationMinutes: 60, icon: "\u{1F52E}", stats: { arm: 100, hp: 800 }, price: 1e4 }
};

// src/data/divineBeasts.ts
var DIVINE_BEASTS = {
  LYSS_STAG: {
    id: "LYSS_STAG",
    name: "Elarion",
    title: "Cervo das Ra\xEDzes Luminosas",
    region: "Bosque de Lyss",
    bossId: "ESPECTRO",
    rarity: "RARO",
    emoji: "\u{1F98C}",
    sprite: "/assets/pets/divine-beast-lyss.png",
    lore: "Quando a primeira floresta sentiu a ruptura da Ess\xEAncia, um cervo permaneceu entre as ra\xEDzes. Lyss guardou sua lembran\xE7a e a fez renascer como um eco vivo do Primeiro Canto.",
    bond: "Elarion acompanha quem protege a vida mesmo quando a floresta est\xE1 ferida.",
    bonus: { hp: 35, dge: 0.01 },
    dropChance: 0.12
  },
  DHOR_GRIFFIN: {
    id: "DHOR_GRIFFIN",
    name: "Kharad",
    title: "Grifo da Coroa de Basalto",
    region: "Pico de Dhor",
    bossId: "COLOSSO",
    rarity: "RARO",
    emoji: "\u{1F985}",
    sprite: "/assets/pets/divine-beast-dhor.png",
    lore: "Nascido no instante em que uma montanha resistiu \xE0 Grande Ruptura, Kharad carrega a mem\xF3ria da pedra que n\xE3o cedeu. Suas asas guardam poeira de basalto e luz primordial.",
    bond: "Kharad responde \xE0 firmeza: ele protege quem permanece de p\xE9 diante da adversidade.",
    bonus: { arm: 4, def: 2 },
    dropChance: 0.12
  },
  AZHAR_SERPENT: {
    id: "AZHAR_SERPENT",
    name: "Nerith",
    title: "Serpe das Mar\xE9s de Nacre",
    region: "Mar de Azhar",
    bossId: "LEVIATA",
    rarity: "EPICO",
    emoji: "\u{1F409}",
    sprite: "/assets/pets/divine-beast-azhar.png",
    lore: "Nerith surgiu onde a mar\xE9 tocou uma veia primordial. Seu corpo guarda o ritmo de Azhar: recuar, lembrar e voltar com a for\xE7a de um oceano inteiro.",
    bond: "Nerith segue quem aprende a mudar de caminho sem abandonar o pr\xF3prio prop\xF3sito.",
    bonus: { mp: 35, resMagico: 0.02 },
    dropChance: 0.12
  },
  ASTERION_OWL: {
    id: "ASTERION_OWL",
    name: "Orivane",
    title: "Coruja dos Arquivos Celestes",
    region: "Ru\xEDnas de Asterion",
    bossId: "GUARDIAO",
    rarity: "EPICO",
    emoji: "\u{1F989}",
    sprite: "/assets/pets/divine-beast-asterion.png",
    lore: "As ru\xEDnas registraram cada voz que se perdeu na queda. Orivane nasceu dessa mem\xF3ria: uma testemunha alada que nunca esquece um nome, uma promessa ou uma batalha.",
    bond: "Orivane escolhe quem observa antes de agir e honra aquilo que aprendeu.",
    bonus: { hit: 0.02, crit: 0.01 },
    dropChance: 0.12
  },
  VOID_FOX: {
    id: "VOID_FOX",
    name: "Vesper",
    title: "Raposa do Limiar Silencioso",
    region: "Cicatriz Profunda",
    bossId: "DEVORADOR",
    rarity: "LENDARIO",
    emoji: "\u{1F98A}",
    sprite: "/assets/pets/divine-beast-void.png",
    lore: "Na Cicatriz, at\xE9 a mem\xF3ria parece se desfazer. Vesper nasceu do \xFAltimo fio de Ess\xEAncia que se recusou a desaparecer e aprendeu a caminhar entre o que o mundo lembra e o que teme esquecer.",
    bond: "Vesper se aproxima de quem atravessa a escurid\xE3o sem permitir que ela decida quem essa pessoa ser\xE1.",
    bonus: { atk: 6, dge: 0.02 },
    dropChance: 0.12
  },
  ASTER_PHOENIX: {
    id: "ASTER_PHOENIX",
    name: "Solenne",
    title: "F\xEAnix da Primeira Luz",
    region: "Ecos de Aster",
    bossId: "ESPECTRO",
    rarity: "EPICO",
    emoji: "\u{1F426}\u200D\u{1F525}",
    sprite: "/assets/pets/divine-beast-aster.png",
    lore: "Solenne n\xE3o \xE9 Aster, mas um eco de tudo que come\xE7a. Sua chama nasceu na primeira alvorada ap\xF3s a Ruptura e reacende a esperan\xE7a nos lugares esquecidos.",
    bond: "Solenne acompanha quem encontra um come\xE7o mesmo depois de uma grande perda.",
    bonus: { hp: 20, crit: 0.01 },
    dropChance: 0.12
  },
  NOCTHAR_MOTH: {
    id: "NOCTHAR_MOTH",
    name: "Nhal",
    title: "Mariposa do Sil\xEAncio Sereno",
    region: "Ecos de Nocthar",
    bossId: "COLOSSO",
    rarity: "EPICO",
    emoji: "\u{1F98B}",
    sprite: "/assets/pets/divine-beast-nocthar.png",
    lore: "As asas de Nhal guardam o instante quieto entre o fim de um ciclo e o in\xEDcio do pr\xF3ximo. Sua escurid\xE3o oferece repouso, nunca amea\xE7a.",
    bond: "Nhal escolhe viajantes que entendem que descansar tamb\xE9m \xE9 continuar.",
    bonus: { mp: 25, resMagico: 0.01 },
    dropChance: 0.12
  },
  KAELOR_SALAMANDER: {
    id: "KAELOR_SALAMANDER",
    name: "Cindervane",
    title: "Salamandra da Mudan\xE7a",
    region: "Ecos de Kaelor",
    bossId: "LEVIATA",
    rarity: "EPICO",
    emoji: "\u{1F98E}",
    sprite: "/assets/pets/divine-beast-kaelor.png",
    lore: "Cindervane muda de cor conforme a Ess\xEAncia ao redor se transforma. Ela sobrevive \xE0 mudan\xE7a porque nunca tenta voltar a ser aquilo que j\xE1 foi.",
    bond: "Cindervane se aproxima de quem aprende, se adapta e segue em frente.",
    bonus: { atk: 3, spd: 0.01 },
    dropChance: 0.12
  },
  VEYRA_TORTOISE: {
    id: "VEYRA_TORTOISE",
    name: "Memnora",
    title: "Tartaruga do Arquivo Vivo",
    region: "Ecos de Veyra",
    bossId: "GUARDIAO",
    rarity: "EPICO",
    emoji: "\u{1F422}",
    sprite: "/assets/pets/divine-beast-veyra.png",
    lore: "Cada marca no casco de Memnora \xE9 uma lembran\xE7a preservada. Ela carrega hist\xF3rias sem aprision\xE1-las e nunca confunde mem\xF3ria com destino.",
    bond: "Memnora caminha com quem guarda o passado sem deixar de escolher o futuro.",
    bonus: { hp: 25, arm: 2 },
    dropChance: 0.12
  },
  DHOR_BEETLE: {
    id: "DHOR_BEETLE",
    name: "Orruk",
    title: "Besouro-Cristal da Mat\xE9ria",
    region: "Ecos de Dhor",
    bossId: "COLOSSO",
    rarity: "RARO",
    emoji: "\u{1FAB2}",
    sprite: "/assets/pets/divine-beast-dhor-beetle.png",
    lore: "Orruk molda cristais com as patas e deixa caminhos firmes por onde passa. Seu corpo lembra que toda ideia precisa de mat\xE9ria para permanecer no mundo.",
    bond: "Orruk segue quem constr\xF3i com paci\xEAncia e cuida daquilo que criou.",
    bonus: { def: 3, blk: 0.01 },
    dropChance: 0.12
  },
  LYSS_MOTH: {
    id: "LYSS_MOTH",
    name: "Floravelle",
    title: "Mariposa dos Brotos de Lyss",
    region: "Ecos de Lyss",
    bossId: "ESPECTRO",
    rarity: "RARO",
    emoji: "\u{1F98B}",
    sprite: "/assets/pets/divine-beast-floravelle.png",
    lore: "Floravelle surge onde a vida insiste em crescer. O p\xF3 luminoso de suas asas n\xE3o cura feridas; ele desperta sementes adormecidas na Ess\xEAncia.",
    bond: "Floravelle escolhe quem protege o crescimento dos outros sem exigir recompensa.",
    bonus: { hp: 20, hit: 0.01 },
    dropChance: 0.12
  },
  NYR_SKY_RAY: {
    id: "NYR_SKY_RAY",
    name: "Aeralis",
    title: "Raia-Celeste das Correntes de Nyr",
    region: "Ecos de Nyr",
    bossId: "LEVIATA",
    rarity: "LENDARIO",
    emoji: "\u{1FABD}",
    sprite: "/assets/pets/divine-beast-nyr.png",
    lore: "Aeralis nada pelo ar seguindo correntes que olhos mortais n\xE3o veem. Para ela, dist\xE2ncia \xE9 apenas outro nome para o pr\xF3ximo caminho.",
    bond: "Aeralis acompanha quem continua explorando mesmo sem conhecer o destino.",
    bonus: { spd: 0.02, dge: 0.01 },
    dropChance: 0.12
  }
};

// src/data/beastCombat.ts
var ATTACKS = {
  LYSS_STAG: ["Lan\xE7as de Raiz", "TERRA"],
  DHOR_GRIFFIN: ["Queda de Basalto", "TERRA"],
  AZHAR_SERPENT: ["Mar\xE9 de Nacre", "AGUA"],
  ASTERION_OWL: ["Senten\xE7a Celeste", "PSIQUICO"],
  VOID_FOX: ["Rasgo do Limiar", "MORTE"],
  ASTER_PHOENIX: ["Aurora Incandescente", "FOGO"],
  NOCTHAR_MOTH: ["P\xF3 do Sil\xEAncio", "MORTE"],
  KAELOR_SALAMANDER: ["Sopro da Mudan\xE7a", "FOGO"],
  VEYRA_TORTOISE: ["Pulso da Mem\xF3ria", "SAGRADO"],
  DHOR_BEETLE: ["Estilha\xE7o Cristalino", "METAL"],
  LYSS_MOTH: ["P\xF3len Vital", "VENENO"],
  NYR_SKY_RAY: ["L\xE2mina das Correntes", "VENTO"]
};
function getBeastCombat(char) {
  const id = char.activeDivineBeastId;
  if (!id || char.activeRace || !(char.divineBeasts ?? []).some((b) => b.id === id)) return null;
  const beast = DIVINE_BEASTS[id];
  const [name, element] = ATTACKS[id];
  return { beast, name, element, cooldown: 3, mana: 8 + Math.floor(char.level * 0.5), multiplier: 2.4 };
}
function beastGrowth(level) {
  return { hp: 60 + level * 6, mp: 30 + level * 3, atk: 6 + level, matk: 6 + level, arm: 3 + Math.floor(level * 0.6), hpRegen: 1 + Math.floor(level / 15), mpRegen: 2 + Math.floor(level / 15) };
}

// src/engine/stats.ts
function getBaseStats(level) {
  level = Number.isFinite(Number(level)) ? Math.max(1, Math.floor(Number(level))) : 1;
  return {
    hp: 150 + (level - 1) * 25,
    mp: 50 + (level - 1) * 15,
    atk: 12 + Math.floor((level - 1) * 2.5),
    matk: 12 + Math.floor((level - 1) * 2.5),
    def: 3 + Math.floor((level - 1) * 0.8),
    arm: 3 + Math.floor((level - 1) * 0.8),
    spd: 0,
    crit: 0.05,
    hit: 0.9,
    dge: 0.05,
    blk: 0,
    // NOVOS ATRIBUTOS BASE
    hpRegen: 1,
    mpRegen: 1,
    luck: 0,
    critDmg: 0.5
  };
}
function recalcStats(char) {
  const base = getBaseStats(char.level);
  const numeric = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  const fromGear = {};
  const fromRace = {};
  const fromVials = {};
  const fromBeast = {};
  const elementalResistances = {};
  for (const slot of Object.keys(char.equipped)) {
    const item = char.equipped[slot];
    if (!item?.stats) continue;
    for (const [k, v] of Object.entries(item.stats)) fromGear[k] = (fromGear[k] || 0) + numeric(v);
    for (const affix of item.affixes ?? []) fromGear[affix.stat] = (fromGear[affix.stat] || 0) + numeric(affix.value);
    for (const [element, value] of Object.entries(item.elementalResistances ?? {})) elementalResistances[element] = (elementalResistances[element] ?? 0) + numeric(value);
  }
  if (char.activeRace && char.activeRace.bonus) {
    for (const [k, v] of Object.entries(char.activeRace.bonus)) fromRace[k] = numeric(v);
  }
  const now = Date.now();
  if (char.activeVials) {
    for (const [vialId, expiry] of Object.entries(char.activeVials)) {
      const family = vialId.replace(/_[0-9]+$/, "");
      const superseded = Object.entries(char.activeVials).some(([other, until]) => until > now && other.replace(/_[0-9]+$/, "") === family && Number(other.split("_").at(-1)) > Number(vialId.split("_").at(-1)));
      if (expiry > now && !superseded) {
        const vial = VIALS[vialId];
        if (vial) {
          for (const [k, v] of Object.entries(vial.stats)) fromVials[k] = (fromVials[k] || 0) + numeric(v);
        }
      }
    }
  }
  const passive = char.activeRace ? PASSIVE_EFFECTS[char.activeRace.passivaId] : void 0;
  const support = char.activeRace ? SUPPORT_EFFECTS[char.activeRace.suporteId] : void 0;
  const fromPassive = passive?.stats ?? {};
  const activeBeast = char.activeDivineBeastId ? DIVINE_BEASTS[char.activeDivineBeastId] : void 0;
  if (activeBeast && (char.divineBeasts ?? []).some((beast) => beast.id === activeBeast.id)) {
    for (const [k, v] of Object.entries(beastGrowth(char.level))) fromBeast[k] = v;
    for (const [k, v] of Object.entries(activeBeast.bonus)) fromBeast[k] = (fromBeast[k] ?? 0) + numeric(v);
  }
  const skills = char.skills || { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  const isUsingBow = char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO");
  const skillAtkBonus = isUsingBow ? 0 : skills.melee * 1.5;
  const skillDistBonus = isUsingBow ? skills.distance * 1.5 : 0;
  const skillMatkBonus = skills.magic * 1.5;
  const skillArmBonus = skills.defense;
  const skillDefBonus = skills.defense * 0.5;
  const skillHitBonus = isUsingBow ? skills.distance * 5e-3 : 0;
  const atkMult = (1 + (support?.permAtkPct ?? 0)) * (1 + masteryBonus(char, isUsingBow ? "distance" : "melee"));
  const armMult = 1 + (passive?.armPct ?? 0) + (support?.permArmPct ?? 0);
  const hpMult = 1 + numeric(passive?.hpPct);
  const sum = (k) => numeric(fromGear[k]) + numeric(fromRace[k]) + numeric(fromPassive[k]) + numeric(fromVials[k]) + numeric(fromBeast[k]);
  char.baseStats = {
    hp: Math.max(1, Math.floor((base.hp + sum("hp")) * hpMult)),
    mp: Math.max(0, Math.floor(base.mp + sum("mp"))),
    atk: Math.floor((base.atk + sum("atk") + skillAtkBonus + skillDistBonus) * atkMult),
    matk: Math.floor((base.matk + sum("matk") + skillMatkBonus) * (1 + masteryBonus(char, "magic"))),
    def: base.def + sum("def") + skillDefBonus,
    arm: Math.floor((base.arm + sum("arm") + skillArmBonus) * armMult * (1 + masteryBonus(char, "defense"))),
    spd: Math.min(base.spd + sum("spd"), 0.8),
    crit: Math.min(base.crit + sum("crit") + (support?.critBonus ?? 0), 0.85),
    hit: Math.min(base.hit + sum("hit") + (support?.hitBonus ?? 0) + skillHitBonus, 1),
    dge: Math.min(base.dge + sum("dge"), 0.5),
    blk: Math.min(base.blk + sum("blk"), 0.5),
    resFisico: Math.max(0, Math.min(sum("resFisico"), BALANCE.resistanceCap)),
    resMagico: Math.max(0, Math.min(sum("resMagico"), BALANCE.resistanceCap)),
    // NOVOS ATRIBUTOS
    hpRegen: (base.hpRegen ?? 0) + sum("hpRegen"),
    mpRegen: (base.mpRegen ?? 0) + sum("mpRegen") + Math.min(5, Math.floor((char.trainingMastery?.soul ?? 0) / 5)),
    luck: Math.min((base.luck ?? 0) + sum("luck"), 0.5),
    critDmg: (base.critDmg ?? 0.5) + sum("critDmg")
  };
  for (const element of ELEMENTS) elementalResistances[element.id] = Math.max(0, Math.min(BALANCE.resistanceCap, elementalResistances[element.id] ?? 0));
  char.elementalResistances = elementalResistances;
  char.hpMax = char.baseStats.hp;
  char.mpMax = char.baseStats.mp;
  char.hp = Math.min(Number.isFinite(char.hp) ? Math.max(0, char.hp) : char.hpMax, char.hpMax);
  char.mp = Math.min(Number.isFinite(char.mp) ? Math.max(0, char.mp) : char.mpMax, char.mpMax);
}
function xpToNextLevel(level) {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel <= 25) return Math.floor(Math.max(200 * Math.pow(safeLevel, 1.35), 100 * Math.pow(1.25, safeLevel - 1)));
  return Math.floor(100 * Math.pow(1.25, 24) * Math.pow(safeLevel / 25, 3.5));
}

// src/engine/itemCompare.ts
var STAT_WEIGHTS = {
  atk: 1,
  matk: 1,
  def: 1,
  arm: 1,
  hp: 0.3,
  mp: 0.1,
  crit: 4,
  critDmg: 4,
  hit: 4,
  dge: 4,
  blk: 4,
  spd: 2,
  resFisico: 3,
  resMagico: 3,
  hpRegen: 2,
  mpRegen: 2,
  luck: 5
};
function getItemScore(item) {
  if (!item) return 0;
  let score = 0;
  for (const [k, v] of Object.entries(item.stats)) {
    if (typeof v === "number") score += v * (STAT_WEIGHTS[k] ?? 1);
  }
  for (const affix of item.affixes ?? []) {
    score += affix.value * (STAT_WEIGHTS[affix.stat] ?? 1);
  }
  score *= 1 + (item.upgradeLevel ?? 0) * 0.1;
  return score;
}

// src/data/backpacks.ts
var BACKPACKS = {
  NORMAL: { templateId: "BACKPACK_NORMAL", name: "Normal Backpack", slots: 50, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  OLD: { templateId: "BACKPACK_OLD", name: "Old Backpack", slots: 60, dropBonus: 0, rareDropBonus: 0, xpBonus: 0 },
  COURO: { templateId: "BACKPACK_COURO", name: "Mochila de Couro", slots: 70, dropBonus: 0, rareDropBonus: 0, xpBonus: 0.02 },
  REFORCADA: { templateId: "BACKPACK_REFORCADA", name: "Mochila Refor\xE7ada", slots: 80, dropBonus: 0.03, rareDropBonus: 0, xpBonus: 0.03 },
  EXPLORADOR: { templateId: "BACKPACK_EXPLORADOR", name: "Mochila do Explorador", slots: 90, dropBonus: 0.06, rareDropBonus: 0.04, xpBonus: 0.04 },
  ARCANA: { templateId: "BACKPACK_ARCANA", name: "Mochila Arcana", slots: 100, dropBonus: 0.1, rareDropBonus: 0.08, xpBonus: 0.06 }
};
var DEFAULT_BACKPACK = BACKPACKS.NORMAL;

// src/engine/inventory.ts
function getUsedSlots(inv) {
  return inv.items.length;
}
function canAddItem(inv, item) {
  if (item.stackable) {
    const existing = inv.items.find((i) => i.templateId === item.templateId && i.quantity < i.maxStack);
    if (existing) return true;
  }
  return getUsedSlots(inv) < inv.backpack.slots;
}
function addItem(inv, item) {
  if (item.stackable) {
    let remaining = item.quantity;
    for (const existing of inv.items) {
      if (existing.templateId !== item.templateId || existing.quantity >= existing.maxStack) continue;
      const add = Math.min(existing.maxStack - existing.quantity, remaining);
      existing.quantity += add;
      remaining -= add;
      if (remaining === 0) return true;
    }
    if (remaining < item.quantity) item = { ...item, quantity: remaining };
  }
  if (getUsedSlots(inv) >= inv.backpack.slots) return false;
  inv.items.push({ ...item, uid: item.uid || Math.random().toString() });
  return true;
}
function removeItem(inv, uid, qty = 1) {
  const idx = inv.items.findIndex((i) => i.uid === uid);
  if (idx === -1) return false;
  if (inv.items[idx].stackable && inv.items[idx].quantity > qty) inv.items[idx].quantity -= qty;
  else inv.items.splice(idx, 1);
  return true;
}
function countByTemplate(inv, templateId) {
  return inv.items.filter((i) => i.templateId === templateId).reduce((n, i) => n + i.quantity, 0);
}
function equipBackpack(char, item) {
  const current = char.inventory.backpack;
  if ((item.slots ?? 0) <= current.slots) return { success: false, error: "Voc\xEA j\xE1 usa uma mochila igual ou melhor." };
  const prev = char.equipped.BACKPACK;
  removeItem(char.inventory, item.uid);
  if (prev) addItem(char.inventory, prev);
  char.inventory.backpack = { templateId: item.templateId, name: item.name, slots: item.slots ?? current.slots, dropBonus: item.dropBonus ?? 0, rareDropBonus: item.rareDropBonus ?? 0, xpBonus: item.xpBonus ?? 0 };
  char.equipped.BACKPACK = item;
  return { success: true };
}
function equipItem(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item || !item.slot) return { success: false, error: "Item inv\xE1lido" };
  if (item.slot === "BACKPACK") return equipBackpack(char, item);
  let slot = item.slot;
  if (slot === "ANEL_I") {
    if (!char.equipped.ANEL_I) slot = "ANEL_I";
    else if (!char.equipped.ANEL_II) slot = "ANEL_II";
    else slot = getItemScore(char.equipped.ANEL_I) <= getItemScore(char.equipped.ANEL_II) ? "ANEL_I" : "ANEL_II";
  }
  const current = char.equipped[slot];
  if (current) {
    if (!canAddItem(char.inventory, current)) return { success: false, error: "Bolsa cheia! Jogue algo fora antes de trocar." };
    addItem(char.inventory, current);
  }
  removeItem(char.inventory, itemUid);
  char.equipped[slot] = item;
  recalcStats(char);
  return { success: true };
}
function unequipItem(char, slot) {
  const item = char.equipped[slot];
  if (!item) return { success: false, error: "Nenhum item equipado" };
  if (slot === "BACKPACK") {
    if (getUsedSlots(char.inventory) + 1 > DEFAULT_BACKPACK.slots) return { success: false, error: "Esvazie a bolsa para voltar \xE0 mochila padr\xE3o." };
    addItem(char.inventory, item);
    char.inventory.backpack = { ...DEFAULT_BACKPACK };
    delete char.equipped[slot];
    return { success: true };
  }
  if (!canAddItem(char.inventory, item)) return { success: false, error: "Bolsa cheia! Libere espa\xE7o." };
  addItem(char.inventory, item);
  delete char.equipped[slot];
  recalcStats(char);
  return { success: true };
}

// src/engine/journey.ts
function isGuided(c) {
  return c.journeyVersion === 1 && !c.tutorialCompleted;
}
function canUseTab(c, tab) {
  if (tab === "online" || tab === "ranking") return true;
  if (!isGuided(c)) return true;
  if (!c.introSeen) return tab === "missoes";
  const done = c.quests.completed;
  const stages = { zona: "TUT_WIKI", matriz: "TUT_1", personagem: "TUT_2", backpack: "TUT_2", depot: "TUT_1", loja: "TUT_3", pets: "TUT_SELL", shop: "TUT_SELL", laboratorio: "TUT_TRAIN" };
  if (tab === "missoes" || tab === "wiki") return true;
  return !!stages[tab] && done.includes(stages[tab]);
}
function canEnterZone(c, id) {
  return id === "BOSQUE_LYSS" || !!c.unlockedZoneIds?.includes(id);
}
function canTutorialHunt(c) {
  if (!isGuided(c)) return true;
  if (!c.introSeen) return false;
  return ["TUT_1", "TUT_POTIONS", "TUT_3"].some((id) => !!c.quests.active[id]);
}
function unlockJourneyZone(c, id) {
  const chapter = JOURNEY_CHAPTERS.find((x) => x.id === id), pass = chapter?.pass;
  if (!pass) return { success: false, error: "Passagem inv\xE1lida." };
  if (canEnterZone(c, id)) return { success: false, error: "Passagem j\xE1 liberada." };
  if (isGuided(c) || c.level < pass.level || !c.quests.completed.includes(pass.requires) || !c.quests.active[pass.questId]) return { success: false, error: "Aceite a miss\xE3o de travessia e conclua os pr\xE9-requisitos." };
  if (c.gold < pass.gold || pass.items.some((i) => countByTemplate(c.inventory, i.id) < i.count)) return { success: false, error: "Gold ou materiais insuficientes na mochila." };
  c.gold -= pass.gold;
  for (const requirement of pass.items) {
    let remaining = requirement.count;
    for (const item of [...c.inventory.items].filter((i) => i.templateId === requirement.id)) {
      const take = Math.min(item.quantity, remaining);
      if (take > 0) removeItem(c.inventory, item.uid, take);
      remaining -= take;
    }
  }
  c.unlockedZoneIds = [.../* @__PURE__ */ new Set([...c.unlockedZoneIds ?? ["BOSQUE_LYSS"], id])];
  delete c.quests.active[pass.questId];
  c.quests.completed.push(pass.questId);
  return { success: true };
}

// src/data/quests.ts
var kill = (target, count, name) => ({ type: "KILL", target, count, description: `Derrote ${count} ${name}` });
var boss = (target, name) => ({ type: "KILL_BOSS", target, count: 1, description: `Derrote o chefe ${name}` });
var collect = (target, count, name) => ({ type: "COLLECT", target, count, description: `Obtenha ${count}x ${name}` });
var discoverTotal = (count) => ({ type: "DISCOVER_TOTAL", count, description: `Descubra ${count} ra\xE7as na Matriz` });
var discoverNamed = (count) => ({ type: "DISCOVER_NAMED", count, description: `Descubra ${count} ra\xE7as lend\xE1rias` });
var QUESTS = [
  // ═══════════════════════════════════════════════════════════════
  // COMPÊNDIO — MILESTONES DE DESCOBERTA (Auto-aceitas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "COMP_T10",
    name: "Colecionador Iniciante",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    description: "A Matriz espera por voc\xEA. Descubra 10 ra\xE7as diferentes.",
    objectives: [discoverTotal(10)],
    rewards: { gold: 1300, xp: 25 }
  },
  {
    id: "COMP_T25",
    name: "Explorador da Matriz",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T10"],
    description: "O caminho do Arquivista \xE9 longo. Descubra 25 ra\xE7as.",
    objectives: [discoverTotal(25)],
    rewards: { gold: 5550, xp: 25 }
  },
  {
    id: "COMP_T50",
    name: "Arquivista Dedicado",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T25"],
    description: "Metade do caminho para a maestria. Descubra 50 ra\xE7as.",
    objectives: [discoverTotal(50)],
    rewards: { gold: 25e3, xp: 25, items: [{ templateId: "FRAGMENTO_RARO", quantity: 50 }] }
  },
  {
    id: "COMP_T100",
    name: "Mestre da Matriz",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T50"],
    description: "Voc\xEA domina a arte da s\xEDntese. Descubra 100 ra\xE7as.",
    objectives: [discoverTotal(100)],
    rewards: { gold: 1e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 25 }] }
  },
  {
    id: "COMP_T200",
    name: "O Caminho Infinito",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_T100"],
    description: "Nenhum limite te det\xE9m. Descubra 200 ra\xE7as.",
    objectives: [discoverTotal(200)],
    rewards: { gold: 5e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] }
  },
  // ─── NOMEADAS (LENDÁRIAS) ───
  {
    id: "COMP_N1",
    name: "Primeira Lenda",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    description: "Descubra sua primeira ra\xE7a nomeada. Cada uma guarda um fragmento da hist\xF3ria de Mythreon.",
    objectives: [discoverNamed(1)],
    rewards: { gold: 3100, xp: 25 }
  },
  {
    id: "COMP_N5",
    name: "Ca\xE7ador de Lendas",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N1"],
    description: "Cinco nomes lend\xE1rios em sua cole\xE7\xE3o. Continue.",
    objectives: [discoverNamed(5)],
    rewards: { gold: 15e3, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 10 }] }
  },
  {
    id: "COMP_N10",
    name: "Guardi\xE3o das Hist\xF3rias",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N5"],
    description: "Dez ra\xE7as nomeadas descobertas. Voc\xEA est\xE1 entre os grandes Arquivistas.",
    objectives: [discoverNamed(10)],
    rewards: { gold: 75e3, xp: 25, items: [{ templateId: "FRAGMENTO_RARO", quantity: 25 }] }
  },
  {
    id: "COMP_N20",
    name: "Voz das Consci\xEAncias",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N10"],
    description: "Vinte lendas em sua cole\xE7\xE3o. Poucos chegam t\xE3o longe.",
    objectives: [discoverNamed(20)],
    rewards: { gold: 3e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] }
  },
  {
    id: "COMP_N33",
    name: "O \xDAltimo Arquivista",
    giver: "Anci\xE3 Seraphine",
    category: "COMPENDIO",
    minLevel: 1,
    requires: ["COMP_N20"],
    description: "Todas as 33 ra\xE7as nomeadas descobertas. Voc\xEA \xE9 a lenda viva de Mythreon.",
    objectives: [discoverNamed(33)],
    rewards: { gold: 15e5, xp: 25, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 100 }] }
  },
  // ═══════════════════════════════════════════════════════════════
  // TUTORIAL / ONBOARDING
  // ═══════════════════════════════════════════════════════════════
  {
    id: "TUT_WIKI",
    name: "O Arquivo de Mythreon",
    giver: "Arquivista Sinax",
    category: "TUTORIAL",
    minLevel: 1,
    description: "Antes de partir, consulte a Wiki para conhecer o mundo e os caminhos de evolu\xE7\xE3o.",
    objectives: [{ type: "VISIT_WIKI", count: 1, description: "Visite o Arquivo / Wiki" }],
    rewards: { gold: 100, xp: 25 }
  },
  {
    id: "TUT_1",
    name: "O Primeiro Passo",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_POTIONS"],
    description: "Bem-vindo a Mythreon. Derrote 10 Lobos-Ferais para testar suas for\xE7as.",
    objectives: [kill("LOBO", 10, "Lobos")],
    rewards: { gold: 190, xp: 25 }
  },
  {
    id: "TUT_MATRIX",
    name: "Uma Matriz, Muitas Possibilidades",
    giver: "Arquivista Sinax",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_1"],
    description: "Conhe\xE7a a Matriz e descubra como combinar componentes para criar uma ra\xE7a \xFAnica.",
    objectives: [{ type: "VISIT_MATRIX", count: 1, description: "Visite a aba Matriz" }],
    rewards: { gold: 100, xp: 20, items: [{ templateId: "A1" }, { templateId: "S1" }, { templateId: "P1" }] }
  },
  {
    id: "TUT_POTIONS",
    name: "Preparar os Elixires",
    giver: "Herbalista Tom\xE9",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_WIKI"],
    description: "Na tela de ca\xE7a, escolha uma po\xE7\xE3o e ajuste o limite autom\xE1tico. Ativar o consumo \xE9 opcional e cada uso custa gold.",
    objectives: [{ type: "CONFIGURE_POTIONS", count: 1, description: "Configure uma po\xE7\xE3o de HP ou MP" }],
    rewards: { gold: 150, xp: 25 }
  },
  {
    id: "TUT_2",
    name: "A Forja da Alma",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_MATRIX"],
    description: "Combine um Ataque, um Suporte e uma Passiva na Matriz; depois equipe a ra\xE7a criada para concluir sua inicia\xE7\xE3o.",
    objectives: [{ type: "SYNTHESIZE", count: 1, description: "Crie uma ra\xE7a na Matriz" }, { type: "EQUIP_RACE", count: 1, description: "Equipe a ra\xE7a criada" }],
    rewards: { gold: 300, xp: 25 }
  },
  {
    id: "TUT_3",
    name: "Ciclo de Renova\xE7\xE3o",
    giver: "Herbalista Tom\xE9",
    category: "TUTORIAL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_2"],
    description: "Derrote criaturas para ganhar ouro e encontrar equipamentos. Bolk entrega tr\xEAs espadas de pr\xE1tica nesta etapa: uma para desmanchar, uma para aprimorar e uma para vender. Depois, seus equipamentos vir\xE3o dos drops.",
    objectives: [kill("ANY", 20, "criaturas"), { type: "EARN_GOLD", count: 300, description: "Ganhe 300 de Ouro" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "ESPADA_T1" }, { templateId: "ESPADA_T1" }, { templateId: "ESPADA_T1" }] }
  },
  {
    id: "TUT_FORGE_VISIT",
    name: "Conhe\xE7a o Ferreiro",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_3"],
    description: "O Ferreiro transforma drops em poder e Fragmentos. Visite a oficina para aprender os servi\xE7os dispon\xEDveis.",
    objectives: [{ type: "VISIT_FORGE", count: 1, description: "Visite o Ferreiro" }],
    rewards: { gold: 200, xp: 25 }
  },
  {
    id: "TUT_4",
    name: "Limpeza de Invent\xE1rio",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_FORGE_VISIT"],
    description: "Escolha um equipamento indesejado no Ferreiro e transforme-os em Fragmentos. Reserve pelo menos um equipamento de drop para aprimorar na pr\xF3xima etapa.",
    objectives: [{ type: "SALVAGE", count: 1, description: "Desmanche 1 equipamento" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 10 }] }
  },
  {
    id: "TUT_FORGE",
    name: "M\xE3os \xE0 Forja",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_4"],
    description: "Aprimore um equipamento no Ferreiro. Cada n\xEDvel exige ouro e Fragmentos; escolha um item que pretende manter.",
    objectives: [{ type: "FORGE", count: 1, description: "Aprimore um equipamento uma vez" }],
    rewards: { gold: 150, xp: 25, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 5 }] }
  },
  {
    id: "TUT_SELL",
    name: "Uma Troca Justa",
    giver: "Ferreiro Bolk",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_FORGE"],
    description: "Venda no Ferreiro um item que n\xE3o pretende usar. O valor em gold aparece antes da confirma\xE7\xE3o.",
    objectives: [{ type: "SELL", count: 1, description: "Venda 1 item ao Ferreiro" }],
    rewards: { gold: 100, xp: 25 }
  },
  { id: "TUT_PATHS", name: "Escolher quem se tornar", giver: "Anci\xE3 Seraphine", category: "TUTORIAL", minLevel: 1, requires: ["TUT_SELL"], description: "A Matriz transforma sua linhagem. As Divine Beasts substituem essa transforma\xE7\xE3o por um v\xEDnculo. Examine seus atributos em Personagem, conhe\xE7a as Beasts e veja os recursos por gold no Shop. Voc\xEA n\xE3o precisa comprar nem possuir uma Beast para concluir.", objectives: [{ type: "VISIT_CHARACTER", count: 1, description: "Veja seus atributos em Personagem" }, { type: "VISIT_BEASTS", count: 1, description: "Conhe\xE7a as Divine Beasts" }, { type: "VISIT_SHOP", count: 1, description: "Conhe\xE7a o Shop, sem obriga\xE7\xE3o de comprar" }], rewards: { gold: 50, xp: 20 } },
  { id: "TUT_TRAIN", name: "Disciplina antes da for\xE7a", giver: "Guardi\xE3 Mirelle", category: "TUTORIAL", minLevel: 1, requires: ["TUT_PATHS"], description: "Na Casa em Explorar, clique em Treinar, escolha uma habilidade e pratique por 30 segundos. Treinar troca tempo de ca\xE7a por for\xE7a permanente; n\xE3o fornece XP de personagem. A inicia\xE7\xE3o pausa o treino ao cumprir o objetivo.", objectives: [{ type: "TRAIN", count: 30, description: "Treine uma habilidade por 30 segundos" }], rewards: { gold: 50, xp: 20 } },
  { id: "TUT_LAB", name: "Preparar antes de arriscar", giver: "Arquivista Sinax", category: "TUTORIAL", minLevel: 1, requires: ["TUT_TRAIN"], description: "Conhe\xE7a o Laborat\xF3rio de Builds. Ele estima resultados de combate com seu personagem e ajuda a planejar equipamentos, treino e sustento. As proje\xE7\xF5es n\xE3o liberam mapas nem garantem vit\xF3rias.", objectives: [{ type: "VISIT_LAB", count: 1, description: "Visite o Laborat\xF3rio de Builds" }], rewards: { gold: 50, xp: 20 } },
  {
    id: "TUT_BACKPACK",
    name: "Preparar a Jornada",
    giver: "Guardi\xE3 Mirelle",
    category: "TUTORIAL",
    minLevel: 1,
    requires: ["TUT_LAB"],
    description: "Revise sua mochila e conhe\xE7a o dep\xF3sito. O Sigilo do Primeiro Eco reconhece sua inicia\xE7\xE3o: agora a jornada \xE9 livre. Procure Mirelle e siga as miss\xF5es do Bosque antes de enfrentar o Espectro de Brasa no n\xEDvel 15.",
    objectives: [{ type: "VISIT_BACKPACK", count: 1, description: "Visite sua Mochila" }, { type: "VISIT_DEPOT", count: 1, description: "Conhe\xE7a o Dep\xF3sito para guardar recursos" }],
    rewards: { gold: 300, xp: 25, items: [{ templateId: "UNICO_SIGILO_INICIACAO" }] }
  },
  // ═══════════════════════════════════════════════════════════════
  // HISTÓRIA POR ZONA
  // ═══════════════════════════════════════════════════════════════
  {
    id: "LYSS_1",
    name: "Praga de Vespas",
    giver: "Guardi\xE3 Mirelle",
    category: "HISTORIA",
    zoneId: "BOSQUE_LYSS",
    minLevel: 1,
    requires: ["TUT_BACKPACK"],
    description: "Elimine 25 vespas e traga 3 ferr\xF5es. Equipamentos continuam sendo encontrados durante a ca\xE7a.",
    objectives: [kill("VESPA", 25, "Vespas"), collect("A2", 3, "Ferr\xF5es")],
    rewards: { gold: 500, xp: 150 }
  },
  {
    id: "LYSS_BOSS",
    name: "O Espectro de Brasa",
    giver: "Guardi\xE3 Mirelle",
    category: "DESAFIO",
    zoneId: "BOSQUE_LYSS",
    minLevel: 15,
    requires: ["LYSS_1"],
    description: "Derrote o Espectro de Brasa. Ele pode deixar sua mochila ou equipamento como drop ao ser derrotado.",
    objectives: [boss("ESPECTRO", "Espectro de Brasa")],
    rewards: { gold: 1e3, xp: 300 }
  },
  // ═══════════════════════════════════════════════════════════════
  // REPETÍVEIS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "REP_LYSS",
    name: "Patrulha do Bosque",
    giver: "Ca\xE7ador Brann",
    category: "REPETIVEL",
    zoneId: "BOSQUE_LYSS",
    minLevel: 5,
    repeatable: true,
    requires: ["TUT_BACKPACK"],
    description: "Cace 100 criaturas em qualquer lugar do Bosque.",
    objectives: [kill("ANY", 100, "monstros")],
    rewards: { gold: 350, xp: 150 }
  }
];
for (const chapter of JOURNEY_CHAPTERS.filter((c) => c.pass)) {
  const pass = chapter.pass;
  QUESTS.push({ id: pass.questId, name: "Travessia: " + chapter.name, giver: pass.npc, category: "HISTORIA", minLevel: pass.level, requires: [pass.requires], description: chapter.story + " Entregue os recursos \xE0 expedi\xE7\xE3o para abrir permanentemente a passagem.", objectives: [{ type: "UNLOCK_ZONE", target: chapter.id, count: 1, description: "Financie a travessia de " + chapter.name }], rewards: {} });
  QUESTS.push({ id: chapter.id + "_STORY", name: chapter.mission, giver: pass.npc, category: "HISTORIA", zoneId: chapter.id, minLevel: pass.level, requires: [pass.questId], description: chapter.conflict, objectives: chapter.hunts.map((h) => kill(h.id, h.count, h.name)), rewards: { gold: Math.floor(pass.gold * 0.08), xp: 150 } });
  QUESTS.push({ id: chapter.id + "_BOSS", name: chapter.bossTitle, giver: pass.npc, category: "DESAFIO", zoneId: chapter.id, minLevel: chapter.bossLevel, requires: [chapter.id + "_STORY"], description: chapter.resolution, objectives: [boss(chapter.bossId, chapter.bossTitle)], rewards: { gold: Math.floor(pass.gold * 0.12), xp: 300 } });
}
var QUESTS_BY_ID = Object.fromEntries(QUESTS.map((q) => [q.id, q]));

// src/data/components.ts
var ATAQUES = {
  A1: { id: "A1", name: "Presa de Lobo-Feral", type: "ATAQUE", law: "RAAN", icon: "\u{1F9B7}", skillName: "Mordida Feral", skillDescription: "Dano f\xEDsico" },
  A2: { id: "A2", name: "Ferr\xE3o de Vespa", type: "ATAQUE", law: "VORO", icon: "\u{1F41D}", skillName: "Ferr\xE3o Venenoso", skillDescription: "Dano + veneno" },
  A3: { id: "A3", name: "Chama de Espectro", type: "ATAQUE", law: "KAELOR", icon: "\u{1F525}", skillName: "Chama Espectral", skillDescription: "Dano m\xE1gico" },
  A4: { id: "A4", name: "Garra de Urso", type: "ATAQUE", law: "DHOR", icon: "\u{1F43E}", skillName: "Garra Perfurante", skillDescription: "Dano + quebra DEF" },
  A5: { id: "A5", name: "Pe\xE7onha de Serpente", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1F40D}", skillName: "Pe\xE7onha", skillDescription: "Dano + lentid\xE3o" },
  A6: { id: "A6", name: "L\xE2mina de Bandido", type: "ATAQUE", law: "VORO", icon: "\u{1F5E1}\uFE0F", skillName: "Corte", skillDescription: "Dano perfurante" },
  A7: { id: "A7", name: "Espinho de Planta", type: "ATAQUE", law: "LYSS", icon: "\u{1F33F}", skillName: "Espinho", skillDescription: "Dano + sangramento" },
  A8: { id: "A8", name: "Mand\xEDbula de Hiena", type: "ATAQUE", law: "VORO", icon: "\u{1F9B4}", skillName: "Mordida", skillDescription: "Dano + medo" },
  A9: { id: "A9", name: "N\xFAcleo de Golem", type: "ATAQUE", law: "DHOR", icon: "\u{1FAA8}", skillName: "Impacto", skillDescription: "Dano em cone" },
  A10: { id: "A10", name: "Pena de Falc\xE3o", type: "ATAQUE", law: "RAAN", icon: "\u{1FAB6}", skillName: "Corte", skillDescription: "Dano + sil\xEAncio" },
  A11: { id: "A11", name: "Cristal de Gelo", type: "ATAQUE", law: "CHRONOS", icon: "\u2744\uFE0F", skillName: "Lan\xE7a G\xE9lida", skillDescription: "Dano m\xE1gico + lentid\xE3o" },
  A12: { id: "A12", name: "Tent\xE1culo Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1F419}", skillName: "Chicote Abissal", skillDescription: "Dano sombrio que ignora armadura" },
  A13: { id: "A13", name: "Fragmento de Tempestade", type: "ATAQUE", law: "KAELOR", icon: "\u26A1", skillName: "Descarga", skillDescription: "Dano de trov\xE3o em cadeia" },
  A14: { id: "A14", name: "Presa de Verme-Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "\u{1FAB1}", skillName: "Devorar", skillDescription: "Dano + drena vida" },
  A15: { id: "A15", name: "Fragmento de Asterion", type: "ATAQUE", law: "ASTER", icon: "\u2604\uFE0F", skillName: "Julgamento Estelar", skillDescription: "Dano sagrado devastador" }
};
var SUPORTES = {
  S1: { id: "S1", name: "N\xFAcleo de Lyss", type: "SUPORTE", law: "LYSS", icon: "\u{1F49A}", skillName: "B\xEAn\xE7\xE3o de Lyss", skillDescription: "Cura" },
  S2: { id: "S2", name: "N\xFAcleo de Emohna", type: "SUPORTE", law: "EMOHNA", icon: "\u{1F91D}", skillName: "V\xEDnculo", skillDescription: "Buff ATK/DEF" },
  S3: { id: "S3", name: "N\xFAcleo de Aster", type: "SUPORTE", law: "ASTER", icon: "\u2728", skillName: "Aurora", skillDescription: "Cura + limpa debuff" },
  S4: { id: "S4", name: "N\xFAcleo de Nocthar", type: "SUPORTE", law: "NOCTHAR", icon: "\u{1F319}", skillName: "V\xE9u", skillDescription: "Escudo" },
  S5: { id: "S5", name: "N\xFAcleo de Chronos", type: "SUPORTE", law: "CHRONOS", icon: "\u23F3", skillName: "Acelera\xE7\xE3o", skillDescription: "Cooldown" },
  S6: { id: "S6", name: "N\xFAcleo de Veyra", type: "SUPORTE", law: "VEYRA", icon: "\u{1F4D6}", skillName: "Revela\xE7\xE3o", skillDescription: "Revela fraqueza" },
  S7: { id: "S7", name: "N\xFAcleo de Dhor", type: "SUPORTE", law: "DHOR", icon: "\u{1F6E1}\uFE0F", skillName: "Baluarte", skillDescription: "Buff DEF" },
  S8: { id: "S8", name: "N\xFAcleo de Raan", type: "SUPORTE", law: "RAAN", icon: "\u{1F4A8}", skillName: "Passo", skillDescription: "Velocidade" },
  S9: { id: "S9", name: "N\xFAcleo de Kaelor", type: "SUPORTE", law: "KAELOR", icon: "\u{1F300}", skillName: "Adapta\xE7\xE3o", skillDescription: "Resist\xEAncia" },
  S10: { id: "S10", name: "N\xFAcleo de Loghis", type: "SUPORTE", law: "LOGHIS", icon: "\u{1F9EE}", skillName: "C\xE1lculo", skillDescription: "Aumenta precis\xE3o e cr\xEDtico" },
  S11: { id: "S11", name: "N\xFAcleo de Prime", type: "SUPORTE", law: "PRIME", icon: "\u262F\uFE0F", skillName: "Equil\xEDbrio", skillDescription: "Buff ATK/DEF permanente" },
  S12: { id: "S12", name: "N\xFAcleo de Synthes", type: "SUPORTE", law: "SYNTHES", icon: "\u{1F517}", skillName: "Fus\xE3o", skillDescription: "Rouba vida dos golpes" },
  S13: { id: "S13", name: "N\xFAcleo de Voro", type: "SUPORTE", law: "VORO", icon: "\u{1FA78}", skillName: "Preda\xE7\xE3o", skillDescription: "Mais dano em alvos feridos" }
};
var PASSIVAS = {
  P1: { id: "P1", name: "Passiva da Floresta", type: "PASSIVA", law: "LYSS", icon: "\u{1F332}", skillName: "Mem\xF3ria", skillDescription: "+Cura recebida" },
  P2: { id: "P2", name: "Passiva da Montanha", type: "PASSIVA", law: "DHOR", icon: "\u26F0\uFE0F", skillName: "Granito", skillDescription: "+DEF" },
  P3: { id: "P3", name: "Passiva do Deserto", type: "PASSIVA", law: "PRIME", icon: "\u{1F3DC}\uFE0F", skillName: "Resist\xEAncia", skillDescription: "+Resist calor" },
  P4: { id: "P4", name: "Passiva do Cume", type: "PASSIVA", law: "RAAN", icon: "\u{1F32C}\uFE0F", skillName: "Vento", skillDescription: "+Velocidade" },
  P5: { id: "P5", name: "Passiva da Aurora", type: "PASSIVA", law: "ASTER", icon: "\u{1F305}", skillName: "Alvorecer", skillDescription: "+Cura aliados" },
  P6: { id: "P6", name: "Passiva da N\xE9voa", type: "PASSIVA", law: "NOCTHAR", icon: "\u{1F32B}\uFE0F", skillName: "N\xE9voa", skillDescription: "+Esquiva" },
  P7: { id: "P7", name: "Passiva do Vulc\xE3o", type: "PASSIVA", law: "KAELOR", icon: "\u{1F30B}", skillName: "F\xFAria", skillDescription: "+Dano fogo" },
  P8: { id: "P8", name: "Passiva das Esta\xE7\xF5es", type: "PASSIVA", law: "CHRONOS", icon: "\u{1F342}", skillName: "Ritmo", skillDescription: "+Recarga" },
  P9: { id: "P9", name: "Passiva da Encruzilhada", type: "PASSIVA", law: "VORO", icon: "\u{1F6E4}\uFE0F", skillName: "Ceticismo", skillDescription: "+Cr\xEDtico" },
  P10: { id: "P10", name: "Passiva da Biblioteca", type: "PASSIVA", law: "VEYRA", icon: "\u{1F3DB}\uFE0F", skillName: "Erudi\xE7\xE3o", skillDescription: "+XP" },
  P11: { id: "P11", name: "Passiva das Ru\xEDnas", type: "PASSIVA", law: "VEYRA", icon: "\u{1F3DA}\uFE0F", skillName: "Eco", skillDescription: "+Drops raros" },
  P12: { id: "P12", name: "Passiva da Forja", type: "PASSIVA", law: "SYNTHES", icon: "\u2692\uFE0F", skillName: "Forja", skillDescription: "+Crafting" }
};
var ALL_COMPONENTS = { ...ATAQUES, ...SUPORTES, ...PASSIVAS };

// src/data/affixes.ts
var WEAPON_AFFIXES = [
  { stat: "atk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "matk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "crit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 15 },
  { stat: "critDmg", minBase: 0.05, maxBase: 0.1, isPercent: true, weight: 15 },
  { stat: "hit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 10 },
  { stat: "spd", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "luck", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 }
  // Lucky = chance de drop raro
];
var ARMOR_AFFIXES = [
  { stat: "hp", minBase: 10, maxBase: 30, isPercent: false, weight: 20 },
  { stat: "arm", minBase: 1, maxBase: 3, isPercent: false, weight: 20 },
  { stat: "def", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "hpRegen", minBase: 1, maxBase: 5, isPercent: false, weight: 15 },
  { stat: "resFisico", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "dge", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 10 }
];
var SHIELD_AFFIXES = [
  { stat: "arm", minBase: 2, maxBase: 6, isPercent: false, weight: 30 },
  { stat: "blk", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 30 },
  { stat: "hp", minBase: 10, maxBase: 20, isPercent: false, weight: 20 },
  { stat: "resFisico", minBase: 0.02, maxBase: 0.04, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0.02, maxBase: 0.04, isPercent: true, weight: 10 }
];
var JEWELRY_AFFIXES = [
  { stat: "hp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mpRegen", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "crit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 15 },
  { stat: "atk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "matk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "luck", minBase: 0.01, maxBase: 0.05, isPercent: true, weight: 20 }
];
function getPoolForCategory(category) {
  switch (category) {
    case "ARMA":
      return WEAPON_AFFIXES;
    case "ARMADURA":
      return ARMOR_AFFIXES;
    case "ESCUDO":
      return SHIELD_AFFIXES;
    case "JOIA":
      return JEWELRY_AFFIXES;
    case "PULSEIRA":
      return JEWELRY_AFFIXES;
    default:
      return [];
  }
}

// src/engine/drops.ts
var RARITY_ORDER = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
var RARITY_MULT = { COMUM: 1, INCOMUM: 1.3, RARO: 1.7, EPICO: 2.2, LENDARIO: 3 };
var AFFIX_COUNT = { COMUM: 0, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 3 };
function rollRarity(bonus = 0) {
  const r = Math.random() / (1 + clamp(bonus, 0, 1));
  if (r < 2e-3) return "LENDARIO";
  if (r < 0.02) return "EPICO";
  if (r < 0.1) return "RARO";
  if (r < 0.35) return "INCOMUM";
  return "COMUM";
}
function generateRandomAffixes(category, rarity, tier) {
  const pool2 = getPoolForCategory(category);
  if (!pool2 || pool2.length === 0) return [];
  const count = AFFIX_COUNT[rarity];
  if (count === 0) return [];
  const chosen = [];
  const usedStats = /* @__PURE__ */ new Set();
  for (let i = 0; i < count; i++) {
    const available = pool2.filter((p) => !usedStats.has(p.stat));
    if (available.length === 0) break;
    const totalWeight = available.reduce((acc, p) => acc + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let selected = available[0];
    for (const p of available) {
      rand -= p.weight;
      if (rand <= 0) {
        selected = p;
        break;
      }
    }
    usedStats.add(selected.stat);
    const tierMult = 1 + (tier - 1) * 0.5;
    const rawValue = (selected.minBase + Math.random() * (selected.maxBase - selected.minBase)) * tierMult;
    const value = selected.isPercent ? Math.round(rawValue * 100) / 100 : Math.round(rawValue);
    chosen.push({
      law: "PRIME",
      stat: selected.stat,
      value
    });
  }
  return chosen;
}
function makeEquipment(templateId, rarity = "COMUM") {
  const base = ALL_ITEM_TEMPLATES[templateId];
  if (!base) return null;
  if (UNIQUE_TEMPLATES[templateId] || base.category === "POCAO") {
    return { ...base, uid: generateId(), stats: { ...base.stats }, upgradeLevel: 0 };
  }
  const mult = RARITY_MULT[rarity];
  const stats = {};
  for (const [k, v] of Object.entries(base.stats)) stats[k] = Math.round(v * mult * 100) / 100;
  const affixes = generateRandomAffixes(base.category, rarity, base.tier);
  const elementalChance = { COMUM: 0, INCOMUM: 0.35, RARO: 0.6, EPICO: 0.8, LENDARIO: 1 };
  const getsElement = base.category === "ARMA" && Math.random() < (elementalChance[rarity] ?? 0);
  const element = getsElement ? ELEMENTS.filter((item) => item.id !== "BASE")[Math.floor(Math.random() * 11)].id : void 0;
  const elementalDamagePct = getsElement ? { INCOMUM: 0.08, RARO: 0.12, EPICO: 0.16, LENDARIO: 0.2 }[rarity] : void 0;
  return { ...base, uid: generateId(), rarity, stats, affixes, upgradeLevel: 0, element, elementalDamagePct };
}
function makeComponent(templateId) {
  const t = ALL_COMPONENTS[templateId];
  return createItem({ templateId: t.id, name: t.name, category: "COMPONENTE", tier: 1, componentType: t.type, law: t.law, icon: t.icon, stackable: true, maxStack: 999, quantity: 1, upgradeLevel: 0 });
}
function makeBackpack(key, tier = 1) {
  const bp = BACKPACKS[key];
  if (!bp) return null;
  return createItem({ templateId: bp.templateId, name: bp.name, category: "BACKPACK", slot: "BACKPACK", tier, icon: "\u{1F392}", slots: bp.slots, dropBonus: bp.dropBonus, rareDropBonus: bp.rareDropBonus, xpBonus: bp.xpBonus, upgradeLevel: 0 });
}
function rollAmbient(zone) {
  const pool2 = zone.ambientPool && zone.ambientPool.length ? zone.ambientPool : [zone.ambientDrop];
  return makeComponent(pool2[Math.floor(Math.random() * pool2.length)]);
}
function rollDrops(enemy, zone, _char, mods = { dropBonus: 0, rareBonus: 0 }) {
  const drops = [];
  const chance = (p) => mods.force || Math.random() < Math.min(1, p * (1 + clamp(mods.dropBonus, 0, 1)));
  if (chance(enemy.componentChance)) drops.push(makeComponent(enemy.componentId));
  if (enemy.essenceId && chance(enemy.essenceChance ?? 0)) drops.push(makeComponent(enemy.essenceId));
  if (chance(enemy.isBoss ? 0.25 : 0.08)) {
    const arrow = ARROW_TEMPLATES[`FLECHA_T${zone.tier}`];
    if (arrow) drops.push({ ...arrow, uid: generateId(), quantity: enemy.isBoss ? 25 : 5 + Math.floor(Math.random() * 6) });
  }
  if (chance(enemy.isBoss ? BALANCE.bossEquipmentDrop : BALANCE.equipmentDrop)) {
    const pool2 = Object.values(ALL_EQUIPMENT_TEMPLATES).filter((t) => t.tier === zone.tier);
    if (pool2.length > 0) {
      const base = pool2[Math.floor(Math.random() * pool2.length)];
      const eq = makeEquipment(base.templateId, rollRarity(mods.rareBonus + (enemy.isBoss ? 0.5 : 0)));
      if (eq) drops.push(eq);
    }
  }
  if (enemy.backpackDrop && chance(enemy.backpackChance ?? 0)) {
    const bp = makeBackpack(enemy.backpackDrop, zone.tier);
    if (bp) drops.push(bp);
  }
  if (enemy.uniqueDropId && chance(enemy.uniqueDropChance ?? 0)) {
    const u = makeEquipment(enemy.uniqueDropId);
    if (u) drops.push(u);
  }
  if (enemy.protectionRingChance && chance(enemy.protectionRingChance)) {
    const ring = makeEquipment("UNICO_ANEL_GUARDIA");
    if (ring) drops.push(ring);
  }
  return drops;
}

// src/data/potionEconomy.ts
var POTION_GOLD_BY_TIER = [30, 110, 320, 900, 2600];
function getPotionUsePrice(templateId) {
  if (!templateId) return 0;
  const match = templateId.match(/_(\d+)$/);
  if (!match) return 0;
  const tier = Number(match[1]);
  return POTION_GOLD_BY_TIER[tier - 1] ?? 0;
}

// src/engine/questEngine.ts
function updateQuestProgress(char, result) {
  if (!char.quests || !char.quests.active) return;
  const activeQuests = Object.keys(char.quests.active);
  for (const questId of activeQuests) {
    const template = QUESTS.find((q) => q.id === questId);
    if (!template) continue;
    if (template.category === "COMPENDIO" || template.zoneId && result.zoneId && template.zoneId !== result.zoneId) continue;
    const progress = char.quests.active[questId].progress;
    template.objectives.forEach((obj, index) => {
      if (obj.type === "KILL" && result.killed) {
        if (obj.target === "ANY") {
          const totalKills = Object.values(result.killed).reduce((a, b) => a + b, 0);
          progress[index] = (progress[index] || 0) + totalKills;
        } else if (obj.target && result.killed[obj.target]) {
          progress[index] = (progress[index] || 0) + result.killed[obj.target];
        }
      }
      if (obj.type === "KILL_BOSS" && result.bossKills) {
        if (obj.target === "ANY") {
          const total = Object.values(result.bossKills).reduce((a, b) => a + b, 0);
          progress[index] = (progress[index] || 0) + total;
        } else if (obj.target && result.bossKills[obj.target]) {
          progress[index] = (progress[index] || 0) + result.bossKills[obj.target];
        }
      }
      if (obj.type === "COLLECT" && result.dropCounts && obj.target) {
        if (result.dropCounts[obj.target]) {
          progress[index] = (progress[index] || 0) + result.dropCounts[obj.target];
        }
      }
      if (obj.type === "EARN_GOLD") progress[index] = (progress[index] || 0) + result.gold;
      if (obj.type === "SALVAGE" && result.salvagedItems) progress[index] = (progress[index] || 0) + result.salvagedItems;
    });
  }
}
function trackQuestAction(char, action, amount = 1) {
  if (!char.quests?.active) return;
  for (const [questId, state] of Object.entries(char.quests.active)) {
    const template = QUESTS.find((quest) => quest.id === questId);
    if (!template || template.category !== "TUTORIAL") continue;
    template.objectives.forEach((objective, index) => {
      if (objective.type === action) state.progress[index] = Math.min(objective.count, (state.progress[index] ?? 0) + amount);
    });
  }
}
function trackRaceDiscovery(char, races) {
  if (!char.quests) char.quests = { active: {}, completed: [] };
  if (!char.quests.active) char.quests.active = {};
  if (!char.quests.completed) char.quests.completed = [];
  const totalRaces = races.length;
  const namedRaces = races.filter((r) => r.tier === "NOMEADA").length;
  QUESTS.filter((q) => q.category === "COMPENDIO").forEach((q) => {
    const achieved = q.objectives.every((o) => (o.type === "DISCOVER_NAMED" ? namedRaces : totalRaces) >= o.count);
    const eligible = achieved && (!q.requires || q.requires.every((id) => char.quests.completed.includes(id)));
    if (!eligible && char.quests.active[q.id]) delete char.quests.active[q.id];
    if (eligible && !char.quests.active[q.id] && !char.quests.completed.includes(q.id)) {
      char.quests.active[q.id] = { progress: [0] };
    }
  });
  Object.keys(char.quests.active).forEach((questId) => {
    const template = QUESTS.find((q) => q.id === questId);
    if (!template || template.category !== "COMPENDIO") return;
    template.objectives.forEach((obj, idx) => {
      if (obj.type === "DISCOVER_TOTAL") {
        char.quests.active[questId].progress[idx] = totalRaces;
      }
      if (obj.type === "DISCOVER_NAMED") {
        char.quests.active[questId].progress[idx] = namedRaces;
      }
    });
  });
}
function checkQuestCompletion(char, questId) {
  const template = QUESTS.find((q) => q.id === questId);
  const progress = char.quests.active[questId]?.progress;
  if (!template || !progress) return false;
  return template.objectives.every((obj, idx) => (progress[idx] || 0) >= obj.count);
}
function claimQuestReward(char, questId) {
  const template = QUESTS.find((q) => q.id === questId);
  if (!template || template.objectives.some((o) => o.type === "UNLOCK_ZONE") || !checkQuestCompletion(char, questId)) return { success: false, msg: "Miss\xE3o incompleta" };
  if (template.rewards.gold) char.gold += template.rewards.gold;
  if (template.rewards.xp) char.xp += template.rewards.xp;
  if (template.rewards.items) {
    for (const itemReward of template.rewards.items) {
      const quantity = itemReward.quantity || 1;
      if (itemReward.templateId.startsWith("POCAO_")) {
        char.gold += getPotionUsePrice(itemReward.templateId) * quantity;
        continue;
      }
      const backpackKey = itemReward.templateId.startsWith("BACKPACK_") ? itemReward.templateId.slice("BACKPACK_".length) : null;
      const reward = backpackKey ? makeBackpack(backpackKey) : ALL_COMPONENTS[itemReward.templateId] ? makeComponent(itemReward.templateId) : makeEquipment(itemReward.templateId, itemReward.rarity || "COMUM");
      if (reward) {
        reward.quantity = quantity;
        const inventory = structuredClone(char.inventory);
        if (addItem(inventory, reward)) char.inventory = inventory;
        else char.depot.push(reward);
      }
    }
  }
  delete char.quests.active[questId];
  if (!template.repeatable) {
    char.quests.completed.push(questId);
  }
  return { success: true, msg: `Recompensas resgatadas com sucesso!` };
}

// src/utils/questSignals.ts
function getAvailableQuests(character) {
  const active = character.quests?.active || {};
  const completed = new Set(character.quests?.completed || []);
  return QUESTS.filter(
    (quest) => (quest.category !== "TUTORIAL" || !character.tutorialCompleted) && (character.tutorialCompleted || quest.category === "TUTORIAL") && (quest.category !== "COMPENDIO" || !!active[quest.id]) && !active[quest.id] && !completed.has(quest.id) && character.level >= quest.minLevel && (!quest.requires || quest.requires.every((requiredId) => completed.has(requiredId) || requiredId === "TUT_BACKPACK" && !!character.tutorialCompleted))
  );
}

// src/store/gameStore.ts
var import_zustand = require("zustand");

// src/data/zones.ts
var ZONES = {
  // ═══════════════════════════════════════════════════════════════
  // ZONA 1: BOSQUE DE LYSS (T1 - Nível 1-10)
  // Tema: Floresta encantada (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  BOSQUE_LYSS: {
    id: "BOSQUE_LYSS",
    name: "Bosque de Lyss",
    tier: 1,
    minLevel: 1,
    maxLevel: 10,
    ambientDrop: "P1",
    ambientPool: ["P1", "P8", "P9"],
    theme: "forest",
    enemies: [
      { id: "LOBO", name: "Lobo-Feral", hp: 30, atk: 4, arm: 1, xp: 15, goldMin: 5, goldMax: 12, componentId: "A1", componentChance: 0.6, essenceId: "S1", essenceChance: 0.1, isBoss: false, emoji: "\u{1F43A}", difficulty: 1, minLevel: 1, sprite: "/assets/monsters/LOBO.png" },
      { id: "VESPA", name: "Vespa-Cinza", hp: 25, atk: 6, arm: 0, xp: 18, goldMin: 6, goldMax: 15, componentId: "A2", componentChance: 0.6, essenceId: "S1", essenceChance: 0.1, isBoss: false, emoji: "\u{1F41D}", difficulty: 2, minLevel: 1, sprite: "/assets/monsters/VESPA.png" },
      { id: "ESPINHEIRO", name: "Espinheiro-Vivo", hp: 20, atk: 4, arm: 2, xp: 21, goldMin: 9, goldMax: 16, componentId: "A7", componentChance: 0.55, essenceId: "S2", essenceChance: 0.12, isBoss: false, emoji: "\u{1FAB4}", difficulty: 2, minLevel: 3, sprite: "/assets/monsters/ESPINHEIRO.png" },
      { id: "FALCAO", name: "Falc\xE3o-Ruivo", hp: 18, atk: 6, arm: 1, xp: 25, goldMin: 10, goldMax: 18, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "\u{1F985}", difficulty: 3, minLevel: 5, sprite: "/assets/monsters/FALCAO.png" },
      { id: "JAVALI", name: "Javali-Musgoso", hp: 32, atk: 5, arm: 2, xp: 29, goldMin: 12, goldMax: 22, componentId: "A1", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "\u{1F417}", difficulty: 3, minLevel: 7, sprite: "/assets/monsters/JAVALI.png" },
      // NOVOS MOBS T1
      { id: "FADA_CORROMPIDA", name: "Fada Corrompida", hp: 22, atk: 8, arm: 0, xp: 35, goldMin: 15, goldMax: 25, componentId: "A3", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DA}", difficulty: 2, minLevel: 4, sprite: "/assets/monsters/FADA_CORROMPIDA.png" },
      { id: "ARANHA_GIGANTE", name: "Aranha Gigante", hp: 40, atk: 7, arm: 3, xp: 40, goldMin: 18, goldMax: 28, componentId: "A2", componentChance: 0.6, essenceId: "S2", essenceChance: 0.1, isBoss: false, emoji: "\u{1F577}\uFE0F", difficulty: 2, minLevel: 6, sprite: "/assets/monsters/ARANHA_GIGANTE.png" },
      { id: "ESPECTRO", name: "Espectro de Brasa", hp: 160, atk: 16, arm: 8, xp: 80, goldMin: 60, goldMax: 100, componentId: "A3", componentChance: 1, essenceId: "S9", essenceChance: 0.3, isBoss: true, emoji: "\u{1F47B}", difficulty: 4, minLevel: 15, damageType: "MAGICO", element: "FOGO", backpackDrop: "OLD", backpackChance: 0.08, uniqueDropId: "UNICO_BRASA_ETERNA", uniqueDropChance: 0.06, sprite: "/assets/monsters/ESPECTRO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 2: PICO DE DHOR (T2 - Nível 11-25)
  // Tema: Montanha vulcânica (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  PICO_DHOR: {
    id: "PICO_DHOR",
    name: "Pico de Dhor",
    tier: 2,
    minLevel: 11,
    maxLevel: 25,
    ambientDrop: "P2",
    ambientPool: ["P2", "P4", "P7"],
    theme: "mountain",
    enemies: [
      { id: "GOLEM", name: "Golem-Rocha", hp: 150, atk: 15, arm: 8, xp: 50, goldMin: 20, goldMax: 40, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "\u{1F5FF}", difficulty: 3, minLevel: 11, sprite: "/assets/monsters/GOLEM.png" },
      { id: "URSO", name: "Urso-Fenda", hp: 120, atk: 20, arm: 5, xp: 60, goldMin: 25, goldMax: 50, componentId: "A4", componentChance: 0.55, essenceId: "S5", essenceChance: 0.12, isBoss: false, emoji: "\u{1F43B}", difficulty: 2, minLevel: 13, sprite: "/assets/monsters/URSO.png" },
      { id: "BANDIDO", name: "Bandido do Desfiladeiro", hp: 110, atk: 22, arm: 6, xp: 70, goldMin: 40, goldMax: 80, componentId: "A6", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F977}", difficulty: 3, minLevel: 16, sprite: "/assets/monsters/BANDIDO.png" },
      { id: "ELEMENTAL_GELO", name: "Elemental de Gelo", hp: 130, atk: 21, arm: 8, xp: 85, goldMin: 35, goldMax: 65, componentId: "A11", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "\u{1F9CA}", difficulty: 4, minLevel: 19, damageType: "MAGICO", element: "GELO", elementalResistances: { GELO: 0.35, AGUA: 0.15 }, sprite: "/assets/monsters/ELEMENTAL_GELO.png" },
      { id: "YETI", name: "Yeti-do-Cume", hp: 180, atk: 25, arm: 7, xp: 100, goldMin: 45, goldMax: 85, componentId: "A4", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "\u{1F98D}", difficulty: 4, minLevel: 22, sprite: "/assets/monsters/YETI.png" },
      // NOVOS MOBS T2
      { id: "MORCEGO_MAGMA", name: "Morcego de Magma", hp: 90, atk: 28, arm: 4, xp: 75, goldMin: 30, goldMax: 55, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "\u{1F987}", difficulty: 3, minLevel: 15, element: "FOGO", sprite: "/assets/monsters/MORCEGO_MAGMA.png" },
      { id: "CENTURIAO", name: "Centuri\xE3o de Bronze", hp: 200, atk: 18, arm: 15, xp: 90, goldMin: 50, goldMax: 90, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F916}", difficulty: 4, minLevel: 20, sprite: "/assets/monsters/CENTURIAO.png" },
      { id: "COLOSSO", name: "Colosso de Dhor", hp: 450, atk: 35, arm: 15, xp: 300, goldMin: 300, goldMax: 500, componentId: "A9", componentChance: 1, essenceId: "S7", essenceChance: 0.3, isBoss: true, emoji: "\u{1F3D4}\uFE0F", difficulty: 5, minLevel: 24, element: "TERRA", elementalResistances: { TERRA: 0.25, METAL: 0.2 }, backpackDrop: "COURO", backpackChance: 0.05, uniqueDropId: "UNICO_CORACAO_GRANITO", uniqueDropChance: 0.06, sprite: "/assets/monsters/COLOSSO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 3: MAR DE AZHAR (T3 - Nível 26-45)
  // Tema: Oceano profundo (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  MAR_AZHAR: {
    id: "MAR_AZHAR",
    name: "Mar de Azhar",
    tier: 3,
    minLevel: 26,
    maxLevel: 45,
    ambientDrop: "P6",
    ambientPool: ["P6", "P5", "P10"],
    theme: "ocean",
    enemies: [
      { id: "CARANGUEJO", name: "Caranguejo-Colosso", hp: 400, atk: 40, arm: 20, xp: 150, goldMin: 60, goldMax: 100, componentId: "A9", componentChance: 0.5, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "\u{1F980}", difficulty: 3, minLevel: 26, sprite: "/assets/monsters/CARANGUEJO.png" },
      { id: "SERPENTE", name: "Serpente-N\xE9voa", hp: 380, atk: 45, arm: 15, xp: 170, goldMin: 70, goldMax: 120, componentId: "A5", componentChance: 0.55, essenceId: "S3", essenceChance: 0.12, isBoss: false, emoji: "\u{1F40D}", difficulty: 4, minLevel: 28, sprite: "/assets/monsters/SERPENTE.png" },
      { id: "MEDUSA", name: "Medusa-Trov\xE3o", hp: 350, atk: 50, arm: 12, xp: 190, goldMin: 80, goldMax: 130, componentId: "A13", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "\u{1FABC}", difficulty: 3, minLevel: 32, damageType: "MAGICO", sprite: "/assets/monsters/MEDUSA.png" },
      { id: "SEREIA", name: "Sereia-Cantora", hp: 420, atk: 48, arm: 16, xp: 210, goldMin: 90, goldMax: 140, componentId: "A5", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DC}", difficulty: 4, minLevel: 35, damageType: "MAGICO", sprite: "/assets/monsters/SEREIA.png" },
      { id: "POLVO", name: "Polvo-Abissal", hp: 550, atk: 52, arm: 18, xp: 240, goldMin: 100, goldMax: 160, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "\u{1F419}", difficulty: 4, minLevel: 38, sprite: "/assets/monsters/POLVO.png" },
      // NOVOS MOBS T3
      { id: "TRITAO", name: "Trit\xE3o Guerreiro", hp: 450, atk: 55, arm: 25, xp: 250, goldMin: 110, goldMax: 180, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F531}", difficulty: 4, minLevel: 40, sprite: "/assets/monsters/TRITAO.png" },
      { id: "ENGUIA_ELETRICA", name: "Enguia El\xE9trica", hp: 380, atk: 62, arm: 14, xp: 280, goldMin: 120, goldMax: 200, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "\u26A1", difficulty: 4, minLevel: 42, damageType: "MAGICO", sprite: "/assets/monsters/ENGUIA_ELETRICA.png" },
      { id: "LEVIATA", name: "Leviat\xE3 de Azhar", hp: 1500, atk: 85, arm: 30, xp: 1200, goldMin: 1500, goldMax: 2500, componentId: "A12", componentChance: 1, essenceId: "S5", essenceChance: 0.3, isBoss: true, emoji: "\u{1F40B}", difficulty: 5, minLevel: 43, element: "AGUA", elementalResistances: { AGUA: 0.35, GELO: 0.1 }, backpackDrop: "REFORCADA", backpackChance: 0.04, uniqueDropId: "UNICO_ESCAMA_LEVIATA", uniqueDropChance: 0.06, sprite: "/assets/monsters/LEVIATA.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 4: RUÍNAS DE ASTERION (T4 - Nível 46-70)
  // Tema: Cidade antiga (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  RUINAS_ASTERION: {
    id: "RUINAS_ASTERION",
    name: "Ru\xEDnas de Asterion",
    tier: 4,
    minLevel: 46,
    maxLevel: 70,
    ambientDrop: "P11",
    ambientPool: ["P11", "P10", "P3"],
    theme: "ruins",
    enemies: [
      { id: "HIENA", name: "Hiena-Abissal", hp: 900, atk: 80, arm: 30, xp: 350, goldMin: 150, goldMax: 250, componentId: "A8", componentChance: 0.55, essenceId: "S9", essenceChance: 0.12, isBoss: false, emoji: "\u{1F415}", difficulty: 4, minLevel: 46, sprite: "/assets/monsters/HIENA.png" },
      { id: "SENTINELA", name: "Sentinela de Pedra", hp: 1100, atk: 75, arm: 40, xp: 400, goldMin: 180, goldMax: 280, componentId: "A9", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "\u{1F5FF}", difficulty: 4, minLevel: 50, sprite: "/assets/monsters/SENTINELA.png" },
      { id: "ESCORPIAO", name: "Escorpi\xE3o-R\xFAnico", hp: 850, atk: 95, arm: 25, xp: 450, goldMin: 200, goldMax: 320, componentId: "A2", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "\u{1F982}", difficulty: 4, minLevel: 55, sprite: "/assets/monsters/ESCORPIAO.png" },
      { id: "CULTISTA", name: "Cultista do Eclipse", hp: 800, atk: 110, arm: 20, xp: 500, goldMin: 220, goldMax: 350, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9FF}", difficulty: 5, minLevel: 60, damageType: "MAGICO", sprite: "/assets/monsters/CULTISTA.png" },
      // NOVOS MOBS T4
      { id: "MUMIA", name: "M\xFAmia Ancestral", hp: 1e3, atk: 90, arm: 35, xp: 550, goldMin: 250, goldMax: 400, componentId: "A14", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "\u{1F9DF}", difficulty: 4, minLevel: 52, sprite: "/assets/monsters/MUMIA.png" },
      { id: "GARGULA", name: "G\xE1rgula de Pedra", hp: 1200, atk: 100, arm: 45, xp: 600, goldMin: 280, goldMax: 450, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "\u{1F987}", difficulty: 5, minLevel: 58, sprite: "/assets/monsters/GARGULA.png" },
      { id: "GUARDIAO", name: "Guardi\xE3o de Asterion", hp: 2500, atk: 150, arm: 50, xp: 3e3, goldMin: 3e3, goldMax: 5e3, componentId: "A15", componentChance: 1, essenceId: "S12", essenceChance: 0.3, isBoss: true, emoji: "\u{1F6E1}\uFE0F", difficulty: 5, minLevel: 66, backpackDrop: "EXPLORADOR", backpackChance: 0.03, uniqueDropId: "UNICO_OLHO_ASTERION", uniqueDropChance: 0.06, sprite: "/assets/monsters/GUARDIAO.png" }
    ]
  },
  // ═══════════════════════════════════════════════════════════════
  // ZONA 5: CICATRIZ PROFUNDA (T5 - Nível 71-100)
  // Tema: Abismo cósmico (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  CICATRIZ_PROFUNDA: {
    id: "CICATRIZ_PROFUNDA",
    name: "Cicatriz Profunda",
    tier: 5,
    minLevel: 71,
    maxLevel: 100,
    ambientDrop: "P12",
    ambientPool: ["P12", "P9", "P3"],
    theme: "abyss",
    enemies: [
      { id: "CRIA_VAZIO", name: "Cria do Vazio", hp: 1800, atk: 150, arm: 40, xp: 800, goldMin: 400, goldMax: 600, componentId: "A14", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1F47E}", difficulty: 4, minLevel: 71, damageType: "MAGICO", sprite: "/assets/monsters/CRIA_VAZIO.png" },
      { id: "VERME", name: "Verme-Abissal", hp: 2200, atk: 160, arm: 45, xp: 900, goldMin: 450, goldMax: 650, componentId: "A14", componentChance: 0.55, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1FAB1}", difficulty: 5, minLevel: 75, sprite: "/assets/monsters/VERME.png" },
      { id: "ABERRACAO", name: "Aberra\xE7\xE3o Tentacular", hp: 2500, atk: 180, arm: 50, xp: 1e3, goldMin: 500, goldMax: 700, componentId: "A12", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "\u{1F991}", difficulty: 5, minLevel: 82, element: "AGUA", sprite: "/assets/monsters/ABERRACAO.png" },
      { id: "SOMBRA", name: "Sombra Faminta", hp: 2e3, atk: 200, arm: 35, xp: 1100, goldMin: 550, goldMax: 750, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.12, isBoss: false, emoji: "\u{1F311}", difficulty: 5, minLevel: 88, damageType: "MAGICO", element: "MORTE", sprite: "/assets/monsters/SOMBRA.png" },
      // NOVOS MOBS T5
      { id: "CEIFADOR_ALMAS", name: "Ceifador de Almas", hp: 2800, atk: 220, arm: 55, xp: 1500, goldMin: 600, goldMax: 900, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "\u{1F480}", difficulty: 5, minLevel: 80, sprite: "/assets/monsters/CEIFADOR_ALMAS.png" },
      { id: "OLHO_VAZIO", name: "Olho do Vazio", hp: 2200, atk: 250, arm: 40, xp: 1600, goldMin: 650, goldMax: 950, componentId: "A15", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "\u{1F441}\uFE0F", difficulty: 5, minLevel: 85, damageType: "MAGICO", sprite: "/assets/monsters/OLHO_VAZIO.png" },
      { id: "DEVORADOR", name: "Devorador da Cicatriz", hp: 5e3, atk: 220, arm: 60, xp: 8e3, goldMin: 6e3, goldMax: 1e4, componentId: "A14", componentChance: 1, essenceId: "S13", essenceChance: 0.3, isBoss: true, emoji: "\u{1F479}", difficulty: 5, minLevel: 95, element: "MORTE", backpackDrop: "ARCANA", backpackChance: 0.02, uniqueDropId: "UNICO_PRESA_DEVORADOR", uniqueDropChance: 0.06, protectionRingChance: 0.015, sprite: "/assets/monsters/DEVORADOR.png" }
    ]
  }
};
ZONES.PANTANO_VEYRA = { id: "PANTANO_VEYRA", name: "P\xE2ntano de Veyra", tier: 3, minLevel: 26, maxLevel: 45, theme: "swamp", ambientDrop: "P3", ambientPool: ["P3", "P5"], enemies: [
  { id: "SAPO_MIASMA", name: "Sapo-Miasma", hp: 360, atk: 45, arm: 15, xp: 190, goldMin: 65, goldMax: 110, componentId: "A2", componentChance: 0.55, essenceId: "S2", essenceChance: 0.15, element: "VENENO", elementalResistances: { VENENO: 0.35, AGUA: 0.15 }, isBoss: false, difficulty: 2, minLevel: 26, emoji: "\u{1F438}" },
  { id: "LIBELULA_LAMINA", name: "Lib\xE9lula-L\xE2mina", hp: 310, atk: 55, arm: 12, xp: 220, goldMin: 75, goldMax: 120, componentId: "A10", componentChance: 0.55, essenceId: "S8", essenceChance: 0.15, element: "VENTO", isBoss: false, difficulty: 3, minLevel: 29, emoji: "\u{1F98B}" },
  { id: "CIPO_MEMORIA", name: "Cip\xF3 da Mem\xF3ria", hp: 420, atk: 48, arm: 23, xp: 260, goldMin: 90, goldMax: 140, componentId: "A7", componentChance: 0.55, essenceId: "S3", essenceChance: 0.15, element: "PSIQUICO", damageType: "MAGICO", isBoss: false, difficulty: 3, minLevel: 33, emoji: "\u{1F33F}" },
  { id: "CROCODILO_SILTE", name: "Crocodilo de Silte", hp: 600, atk: 60, arm: 28, xp: 320, goldMin: 110, goldMax: 170, componentId: "A5", componentChance: 0.55, essenceId: "S4", essenceChance: 0.15, element: "AGUA", elementalResistances: { AGUA: 0.3 }, isBoss: false, difficulty: 4, minLevel: 38, emoji: "\u{1F40A}" },
  { id: "MATRIARCA_LODO", name: "Matriarca do Lodo", hp: 1500, atk: 82, arm: 32, xp: 1150, goldMin: 500, goldMax: 750, componentId: "A7", componentChance: 1, essenceId: "S3", essenceChance: 0.3, element: "VENENO", damageType: "MAGICO", elementalResistances: { VENENO: 0.4, AGUA: 0.2 }, isBoss: true, difficulty: 5, minLevel: 44, emoji: "\u{1F333}" }
] };
ZONES.DESERTO_KAELOR = { id: "DESERTO_KAELOR", name: "Deserto de Kaelor", tier: 4, minLevel: 46, maxLevel: 70, theme: "desert", ambientDrop: "P4", ambientPool: ["P4", "P7"], enemies: [
  { id: "ESCARAVELHO_VITREO", name: "Escaravelho V\xEDtreo", hp: 850, atk: 95, arm: 36, xp: 450, goldMin: 160, goldMax: 250, componentId: "A2", componentChance: 0.55, essenceId: "S10", essenceChance: 0.15, element: "METAL", elementalResistances: { METAL: 0.35 }, isBoss: false, difficulty: 3, minLevel: 46, emoji: "\u{1FAB2}" },
  { id: "ESPECTRO_SOLAR", name: "Espectro Solar", hp: 760, atk: 115, arm: 28, xp: 560, goldMin: 190, goldMax: 290, componentId: "A3", componentChance: 0.55, essenceId: "S9", essenceChance: 0.15, element: "FOGO", damageType: "MAGICO", elementalResistances: { FOGO: 0.35 }, isBoss: false, difficulty: 3, minLevel: 51, emoji: "\u2600\uFE0F" },
  { id: "SERPENTE_MIRAGEM", name: "Serpente de Miragem", hp: 1e3, atk: 120, arm: 35, xp: 650, goldMin: 220, goldMax: 320, componentId: "A5", componentChance: 0.55, essenceId: "S6", essenceChance: 0.15, element: "PSIQUICO", isBoss: false, difficulty: 4, minLevel: 56, emoji: "\u{1F40D}" },
  { id: "GOLEM_OBSIDIANA", name: "Golem de Obsidiana", hp: 1250, atk: 125, arm: 48, xp: 800, goldMin: 260, goldMax: 380, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.15, element: "TERRA", elementalResistances: { TERRA: 0.35, FOGO: 0.15 }, isBoss: false, difficulty: 4, minLevel: 61, emoji: "\u{1F5FF}" },
  { id: "SENTINELA_ZENITE", name: "Sentinela do Z\xEAnite", hp: 2600, atk: 155, arm: 52, xp: 3100, goldMin: 1e3, goldMax: 1600, componentId: "A15", componentChance: 1, essenceId: "S10", essenceChance: 0.3, element: "FOGO", damageType: "MAGICO", elementalResistances: { FOGO: 0.4, METAL: 0.2 }, isBoss: true, difficulty: 5, minLevel: 68, emoji: "\u{1F506}" }
] };
for (const zone of [ZONES.PANTANO_VEYRA, ZONES.DESERTO_KAELOR]) for (const enemy of zone.enemies) enemy.sprite = "/assets/monsters/" + enemy.id + ".png";

// src/engine/save.ts
var LEGACY_SAVE_KEY = "mythreon_save_v1";
var SAVE_KEY = LEGACY_SAVE_KEY;
function createNewCharacter(name) {
  const base = getBaseStats(1);
  const zeroSkills = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  return {
    id: Math.random().toString(),
    name,
    level: 1,
    xp: 0,
    xpToNext: xpToNextLevel(1),
    gold: 0,
    hp: base.hp,
    hpMax: base.hp,
    mp: base.mp,
    mpMax: base.mp,
    baseStats: base,
    equipped: {},
    inventory: { backpack: { ...DEFAULT_BACKPACK }, items: [] },
    killsInZone: 0,
    currentZoneId: "BOSQUE_LYSS",
    premium: false,
    lastTick: Date.now(),
    quests: { active: {}, completed: [] },
    blesses: 0,
    skills: { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 },
    statPoints: 0,
    skillXp: { ...zeroSkills },
    trainingSkill: null,
    autoSalvage: null,
    autoSell: null,
    autoSellTemplateIds: [],
    autoSalvageTemplateIds: [],
    ignoredLootTemplateIds: [],
    bestiaryKills: {},
    autoHpPotionId: "POCAO_VIDA_1",
    autoHpPotionPercent: 50,
    autoHpPotionEnabled: false,
    autoMpPotionId: "POCAO_MANA_1",
    autoMpPotionPercent: 30,
    autoMpPotionEnabled: false,
    introSeen: false,
    journeyVersion: 1,
    unlockedZoneIds: ["BOSQUE_LYSS"],
    tutorialCompleted: false,
    tutorialRelicGranted: false,
    staminaOnline: 120,
    staminaOffline: 480,
    staminaUpdatedAt: Date.now(),
    activeVials: {},
    cards: [],
    divineBeasts: [],
    depot: [],
    depotMax: 300
  };
}
function saveGame(char, races) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, character: char, races, settings: {}, stats: {} }));
}
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.character) {
      if (data.character.journeyVersion === void 0) {
        data.character.journeyVersion = 0;
        data.character.introSeen = true;
        data.character.unlockedZoneIds = ["BOSQUE_LYSS", ...[["PICO_DHOR", 11], ["MAR_AZHAR", 26], ["RUINAS_ASTERION", 46], ["CICATRIZ_PROFUNDA", 71]].filter(([, level]) => data.character.level >= Number(level)).map(([id]) => String(id))];
        if (data.character.currentZoneId && !data.character.unlockedZoneIds.includes(data.character.currentZoneId)) data.character.unlockedZoneIds.push(data.character.currentZoneId);
      }
      const legacyPasses = { PICO_DHOR: "PASS_DHOR", MAR_AZHAR: "PASS_AZHAR", RUINAS_ASTERION: "PASS_ASTERION", CICATRIZ_PROFUNDA: "PASS_CICATRIZ" };
      if (data.character.journeyVersion === 0) {
        data.character.quests ??= { active: {}, completed: [] };
        for (const id of data.character.unlockedZoneIds ?? []) {
          const q = legacyPasses[id];
          if (q && !data.character.quests.completed.includes(q)) {
            data.character.quests.completed.push(q);
            delete data.character.quests.active[q];
          }
        }
      }
      const targetXp = xpToNextLevel(data.character.level || 1);
      const previousTarget = data.character.xpToNext;
      if (Number.isFinite(previousTarget) && previousTarget > 0 && previousTarget !== targetXp) {
        data.character.xp = Math.floor(Math.max(0, data.character.xp || 0) / previousTarget * targetXp);
      }
      data.character.xpToNext = targetXp;
      if (!data.character.skills) data.character.skills = { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 };
      if (!Number.isFinite(data.character.statPoints)) data.character.statPoints = Math.max(0, (data.character.level || 1) - 1);
      if (typeof data.character.skillXp === "number") data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      else if (!data.character.skillXp) data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      if (data.character.trainingSkill === void 0) data.character.trainingSkill = null;
      if (!data.character.quests) data.character.quests = { active: {}, completed: [] };
      if (data.character.blesses === void 0) data.character.blesses = 0;
      if (data.character.autoSalvage === void 0) data.character.autoSalvage = null;
      if (data.character.autoSell === void 0) data.character.autoSell = null;
      if (!Array.isArray(data.character.autoSellTemplateIds)) data.character.autoSellTemplateIds = [];
      if (!Array.isArray(data.character.autoSalvageTemplateIds)) data.character.autoSalvageTemplateIds = [];
      if (!Array.isArray(data.character.ignoredLootTemplateIds)) data.character.ignoredLootTemplateIds = [];
      if (!data.character.bestiaryKills || typeof data.character.bestiaryKills !== "object") data.character.bestiaryKills = {};
      if (!data.character.autoHpPotionId) data.character.autoHpPotionId = "POCAO_VIDA_1";
      if (data.character.autoHpPotionPercent === void 0) data.character.autoHpPotionPercent = 50;
      if (data.character.autoHpPotionEnabled === void 0) data.character.autoHpPotionEnabled = false;
      if (!data.character.autoMpPotionId) data.character.autoMpPotionId = "POCAO_MANA_1";
      if (data.character.autoMpPotionPercent === void 0) data.character.autoMpPotionPercent = 30;
      if (data.character.autoMpPotionEnabled === void 0) data.character.autoMpPotionEnabled = false;
      if (data.character.tutorialCompleted === void 0) {
        data.character.tutorialCompleted = (data.character.level ?? 1) > 1;
      }
      if (data.character.tutorialRelicGranted === void 0) data.character.tutorialRelicGranted = false;
      if (data.character.quests?.completed?.includes("TUT_BACKPACK") && !data.character.tutorialRelicGranted) {
        const alreadyOwnsRelic = [...data.character.inventory?.items ?? [], ...data.character.depot ?? [], ...Object.values(data.character.equipped ?? {})].some((item) => item?.templateId === "UNICO_SIGILO_INICIACAO");
        if (alreadyOwnsRelic) data.character.tutorialRelicGranted = true;
        else {
          const relic = makeEquipment("UNICO_SIGILO_INICIACAO");
          const placed = relic && addItem(data.character.inventory, relic);
          if (relic && !placed) (data.character.depot ??= []).push(relic);
          if (relic) data.character.tutorialRelicGranted = true;
        }
      }
      if (!data.character.activeVials) data.character.activeVials = {};
      if (!Number.isFinite(data.character.staminaOnline)) data.character.staminaOnline = 120;
      if (!Number.isFinite(data.character.staminaOffline)) data.character.staminaOffline = 480;
      if (!Number.isFinite(data.character.staminaUpdatedAt)) data.character.staminaUpdatedAt = Date.now();
      if (!data.character.cards) data.character.cards = [];
      if (!Array.isArray(data.character.divineBeasts)) data.character.divineBeasts = [];
      if (!data.character.depot) data.character.depot = [];
      if (data.character.depotMax === void 0) data.character.depotMax = 300;
      for (const item of [...data.character.inventory?.items ?? [], ...data.character.depot ?? []]) {
        if (item.category === "COMPONENTE" && item.stackable) item.maxStack = 999;
      }
    }
    if (data.character) recalcStats(data.character);
    return data;
  } catch (e) {
    console.error("Erro ao carregar save:", e);
    return null;
  }
}

// src/engine/shop.ts
var TIER_BASE = [5, 20, 70, 220, 700];
var RARITY_SELL = { COMUM: 1, INCOMUM: 2, RARO: 5, EPICO: 12, LENDARIO: 40 };
function sellValue(item) {
  switch (item.category) {
    case "COMPONENTE":
      return 8;
    case "POCAO":
      return Math.floor(getPotionUsePrice(item.templateId) * 0.4);
    case "BACKPACK":
      return (item.slots ?? 50) * 5;
    case "MATERIAL":
      return 10 * item.tier;
    default: {
      const affixBonus = 1 + (item.affixes?.length ?? 0) * 0.25;
      return Math.max(1, Math.floor(TIER_BASE[item.tier - 1] * RARITY_SELL[item.rarity] * affixBonus));
    }
  }
}
function sellItem(char, uid, qty = 1) {
  const item = char.inventory.items.find((i) => i.uid === uid);
  if (!item) return { success: false, gold: 0, count: 0, error: "Item n\xE3o encontrado" };
  if (!Number.isFinite(qty) || qty < 1) return { success: false, gold: 0, count: 0, error: "Quantidade inv\xE1lida" };
  const n = Math.min(Math.floor(qty), item.quantity);
  const gold = sellValue(item) * n;
  removeItem(char.inventory, uid, n);
  char.gold += gold;
  return { success: true, gold, count: n };
}

// src/engine/salvage.ts
function salvageItem(char, item) {
  if (item.category === "COMPONENTE" || item.category === "FRAGMENTO" || item.category === "POCAO") return 0;
  let fragmentId = "FRAGMENTO_COMUM";
  let amount = 1;
  if (item.rarity === "RARO") {
    fragmentId = "FRAGMENTO_RARO";
    amount = 2;
  } else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") {
    fragmentId = "FRAGMENTO_EPICO";
    amount = 3;
  }
  const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: amount };
  addItem(char.inventory, frag);
  removeItem(char.inventory, item.uid, 1);
  return amount;
}
function salvageAllEquipment(char, maxRarity) {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  const fragCounts = {};
  const keep = [];
  let salvagedCount = 0;
  for (const item of char.inventory.items) {
    const isEquip = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO"].includes(item.category);
    const canSalvage = isEquip && item.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(item.rarity) <= limit;
    if (!canSalvage) {
      keep.push(item);
      continue;
    }
    let fragmentId = "FRAGMENTO_COMUM";
    let amount = 1;
    if (item.rarity === "RARO") {
      fragmentId = "FRAGMENTO_RARO";
      amount = 2;
    } else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") {
      fragmentId = "FRAGMENTO_EPICO";
      amount = 3;
    }
    fragCounts[fragmentId] = (fragCounts[fragmentId] || 0) + amount * item.quantity;
    salvagedCount += item.quantity;
  }
  char.inventory.items = keep;
  let fragsGained = 0;
  for (const [fragmentId, total] of Object.entries(fragCounts)) {
    const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: total };
    addItem(char.inventory, frag);
    fragsGained += total;
  }
  return { items: salvagedCount, frags: fragsGained };
}
function salvageSelectedEquipment(char, uids) {
  const selected = new Set(uids);
  const chosen = char.inventory.items.filter((item) => selected.has(item.uid) && ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO"].includes(item.category));
  let items = 0;
  let frags = 0;
  for (const item of chosen) {
    const quantity = item.quantity;
    for (let count = 0; count < quantity; count++) {
      const current = char.inventory.items.find((candidate) => candidate.uid === item.uid);
      if (!current) break;
      const amount = salvageItem(char, current);
      if (amount > 0) {
        items += 1;
        frags += amount;
      }
    }
  }
  return { items, frags };
}

// src/config.ts
var KEY = "mythreon_debug";
var debug = false;
try {
  debug = location.hostname === "localhost" && localStorage.getItem(KEY) === "1";
} catch {
}
function isDebug() {
  return debug;
}
var TICK_MS = 3e3;
var OFFLINE_MAX_HOURS = 8;

// src/data/cards.ts
var CARD_TEMPLATES = {
  // ─── BOSQUE DE LYSS (T1) ───
  CARD_LOBO: {
    monsterId: "LOBO",
    name: "Lobo-Feral",
    region: "BOSQUE_LYSS",
    rarity: "RARO",
    trait: "FURIA",
    baseStats: { hp: 100, atk: 25, def: 10, spd: 30 },
    ability: "Mordida Sangrenta",
    abilityDesc: "Causa 30% do ATK como dano extra no primeiro ataque.",
    emoji: "\u{1F43A}"
  },
  CARD_VESPA: {
    monsterId: "VESPA",
    name: "Vespa-Cinza",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "VENENO",
    baseStats: { hp: 50, atk: 15, def: 5, spd: 45 },
    ability: "Ferr\xE3o Letal",
    abilityDesc: "Aplica 1 stack extra de veneno no primeiro ataque.",
    emoji: "\u{1F41D}"
  },
  CARD_ESPINHEIRO: {
    monsterId: "ESPINHEIRO",
    name: "Espinheiro-Vivo",
    region: "BOSQUE_LYSS",
    rarity: "RARO",
    trait: "ESPINHOS",
    baseStats: { hp: 180, atk: 10, def: 30, spd: 10 },
    ability: "Enraizar",
    abilityDesc: "Impede o inimigo de esquivar por 2 turnos.",
    emoji: "\u{1FAB4}"
  },
  CARD_FALCAO: {
    monsterId: "FALCAO",
    name: "Falc\xE3o-Ruivo",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "PRECISAO",
    baseStats: { hp: 80, atk: 30, def: 8, spd: 40 },
    ability: "Voo Rasante",
    abilityDesc: "Ataques t\xEAm 30% de chance de ignorar defesa.",
    emoji: "\u{1F985}"
  },
  CARD_JAVALI: {
    monsterId: "JAVALI",
    name: "Javali-Musgoso",
    region: "BOSQUE_LYSS",
    rarity: "COMUM",
    trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 20, def: 20, spd: 15 },
    ability: "Coura\xE7a de Musgo",
    abilityDesc: "Reduz em 20% o dano m\xE1gico recebido.",
    emoji: "\u{1F417}"
  },
  CARD_FADA_CORROMPIDA: {
    monsterId: "FADA_CORROMPIDA",
    name: "Fada Corrompida",
    region: "BOSQUE_LYSS",
    rarity: "INCOMUM",
    trait: "REGENERACAO",
    baseStats: { hp: 60, atk: 20, def: 5, spd: 50 },
    ability: "P\xF3len Curativo",
    abilityDesc: "Cura 15% do HP de aliados no 3x3/5x5.",
    emoji: "\u{1F9DA}"
  },
  CARD_ARANHA_GIGANTE: {
    monsterId: "ARANHA_GIGANTE",
    name: "Aranha Gigante",
    region: "BOSQUE_LYSS",
    rarity: "INCOMUM",
    trait: "VENENO",
    baseStats: { hp: 120, atk: 25, def: 12, spd: 25 },
    ability: "Teia Pegajosa",
    abilityDesc: "Reduz SPD do inimigo em 20% por 3 turnos.",
    emoji: "\u{1F577}\uFE0F"
  },
  CARD_ESPECTRO: {
    monsterId: "ESPECTRO",
    name: "Espectro de Brasa",
    region: "BOSQUE_LYSS",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 200, atk: 45, def: 15, spd: 50 },
    ability: "Chama Espectral",
    abilityDesc: "Causa dano em \xE1rea (afeta 2 inimigos no 3x3/5x5).",
    emoji: "\u{1F47B}"
  },
  // ─── PICO DE DHOR (T2) ───
  CARD_GOLEM: {
    monsterId: "GOLEM",
    name: "Golem-Rocha",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "ESPINHOS",
    baseStats: { hp: 250, atk: 15, def: 40, spd: 10 },
    ability: "Pele de Pedra",
    abilityDesc: "Bloqueia 10% do dano recebido permanentemente.",
    emoji: "\u{1F5FF}"
  },
  CARD_URSO: {
    monsterId: "URSO",
    name: "Urso-Fenda",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "FURIA",
    baseStats: { hp: 220, atk: 35, def: 20, spd: 20 },
    ability: "F\xFAria Selvagem",
    abilityDesc: "Quando abaixo de 50% HP, ganha +30% ATK.",
    emoji: "\u{1F43B}"
  },
  CARD_BANDIDO: {
    monsterId: "BANDIDO",
    name: "Bandido do Desfiladeiro",
    region: "PICO_DHOR",
    rarity: "RARO",
    trait: "INVESTIDA",
    baseStats: { hp: 150, atk: 40, def: 10, spd: 35 },
    ability: "Golpe Furtivo",
    abilityDesc: "Primeiro ataque sempre \xE9 cr\xEDtico.",
    emoji: "\u{1F977}"
  },
  CARD_ELEMENTAL_GELO: {
    monsterId: "ELEMENTAL_GELO",
    name: "Elemental de Gelo",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 180, atk: 30, def: 25, spd: 25 },
    ability: "Armadura de Gelo",
    abilityDesc: "Gera escudo de 20% HP a cada 3 turnos.",
    emoji: "\u{1F9CA}"
  },
  CARD_YETI: {
    monsterId: "YETI",
    name: "Yeti-do-Cume",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 280, atk: 30, def: 20, spd: 15 },
    ability: "Pele de Neve",
    abilityDesc: "Imune a dano de gelo.",
    emoji: "\u{1F98D}"
  },
  CARD_MORCEGO_MAGMA: {
    monsterId: "MORCEGO_MAGMA",
    name: "Morcego de Magma",
    region: "PICO_DHOR",
    rarity: "INCOMUM",
    trait: "SANGRAMENTO",
    baseStats: { hp: 130, atk: 45, def: 8, spd: 50 },
    ability: "Mordida Incandescente",
    abilityDesc: "Aplica sangramento que ignora cura.",
    emoji: "\u{1F987}"
  },
  CARD_CENTURIAO: {
    monsterId: "CENTURIAO",
    name: "Centuri\xE3o de Bronze",
    region: "PICO_DHOR",
    rarity: "EPICO",
    trait: "ESPINHOS",
    baseStats: { hp: 300, atk: 25, def: 35, spd: 10 },
    ability: "Forma\xE7\xE3o de Escudo",
    abilityDesc: "Reflete 30% do dano recebido.",
    emoji: "\u{1F916}"
  },
  CARD_COLOSSO: {
    monsterId: "COLOSSO",
    name: "Colosso de Dhor",
    region: "PICO_DHOR",
    rarity: "LENDARIO",
    trait: "INVESTIDA",
    baseStats: { hp: 500, atk: 60, def: 40, spd: 15 },
    ability: "Investida S\xEDsmica",
    abilityDesc: "Primeiro ataque atordoa o inimigo por 1 turno.",
    emoji: "\u{1F3D4}\uFE0F"
  },
  // ─── MAR DE AZHAR (T3) ───
  CARD_CARANGUEJO: {
    monsterId: "CARANGUEJO",
    name: "Caranguejo-Colosso",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "ESCUDO",
    baseStats: { hp: 400, atk: 35, def: 35, spd: 15 },
    ability: "Carapa\xE7a Dura",
    abilityDesc: "Reduz dano f\xEDsico recebido em 25%.",
    emoji: "\u{1F980}"
  },
  CARD_SERPENTE: {
    monsterId: "SERPENTE",
    name: "Serpente-N\xE9voa",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "VENENO",
    baseStats: { hp: 320, atk: 50, def: 15, spd: 40 },
    ability: "Pe\xE7onha Paralisante",
    abilityDesc: "Veneno reduz SPD do inimigo em 15%.",
    emoji: "\u{1F40D}"
  },
  CARD_MEDUSA: {
    monsterId: "MEDUSA",
    name: "Medusa-Trov\xE3o",
    region: "MAR_AZHAR",
    rarity: "INCOMUM",
    trait: "SILENCIO",
    baseStats: { hp: 280, atk: 45, def: 20, spd: 35 },
    ability: "Descarga El\xE9trica",
    abilityDesc: "25% de chance de atordoar o inimigo por 1 turno.",
    emoji: "\u{1FABC}"
  },
  CARD_SEREIA: {
    monsterId: "SEREIA",
    name: "Sereia-Cantora",
    region: "MAR_AZHAR",
    rarity: "INCOMUM",
    trait: "REGENERACAO",
    baseStats: { hp: 300, atk: 40, def: 20, spd: 30 },
    ability: "Canto Curativo",
    abilityDesc: "Cura 10% HP de si mesma por turno.",
    emoji: "\u{1F9DC}"
  },
  CARD_POLVO: {
    monsterId: "POLVO",
    name: "Polvo-Abissal",
    region: "MAR_AZHAR",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 380, atk: 55, def: 25, spd: 25 },
    ability: "Tent\xE1culos Sufocantes",
    abilityDesc: "Impede o inimigo de usar habilidade por 2 turnos.",
    emoji: "\u{1F419}"
  },
  CARD_TRITAO: {
    monsterId: "TRITAO",
    name: "Trit\xE3o Guerreiro",
    region: "MAR_AZHAR",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 420, atk: 50, def: 30, spd: 20 },
    ability: "Tridente de Coral",
    abilityDesc: "Gera escudo equivalente a 15% do HP m\xE1ximo.",
    emoji: "\u{1F531}"
  },
  CARD_ENGUIA_ELETRICA: {
    monsterId: "ENGUIA_ELETRICA",
    name: "Enguia El\xE9trica",
    region: "MAR_AZHAR",
    rarity: "RARO",
    trait: "SILENCIO",
    baseStats: { hp: 350, atk: 60, def: 15, spd: 45 },
    ability: "Choque Paralisante",
    abilityDesc: "Cada ataque tem 20% de chance de silenciar.",
    emoji: "\u26A1"
  },
  CARD_LEVIATA: {
    monsterId: "LEVIATA",
    name: "Leviat\xE3 de Azhar",
    region: "MAR_AZHAR",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 800, atk: 90, def: 45, spd: 25 },
    ability: "Rugido Abissal",
    abilityDesc: "Reduz ATK de todos os inimigos em 20%.",
    emoji: "\u{1F40B}"
  },
  // ─── RUÍNAS DE ASTERION (T4) ───
  CARD_HIENA: {
    monsterId: "HIENA",
    name: "Hiena-Abissal",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 600, atk: 70, def: 25, spd: 50 },
    ability: "Risada Sanguin\xE1ria",
    abilityDesc: "Aplica sangramento de 8% HP por turno.",
    emoji: "\u{1F415}"
  },
  CARD_SENTINELA: {
    monsterId: "SENTINELA",
    name: "Sentinela de Pedra",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "ESPINHOS",
    baseStats: { hp: 750, atk: 50, def: 50, spd: 15 },
    ability: "Guarda Eterna",
    abilityDesc: "Reflete 30% do dano f\xEDsico recebido.",
    emoji: "\u{1F5FF}"
  },
  CARD_ESCORPIAO: {
    monsterId: "ESCORPIAO",
    name: "Escorpi\xE3o-R\xFAnico",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "VENENO",
    baseStats: { hp: 650, atk: 75, def: 30, spd: 40 },
    ability: "Ferr\xE3o R\xFAnico",
    abilityDesc: "Veneno causa dano dobrado por 2 turnos.",
    emoji: "\u{1F982}"
  },
  CARD_CULTISTA: {
    monsterId: "CULTISTA",
    name: "Cultista do Eclipse",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "MEDO",
    baseStats: { hp: 550, atk: 80, def: 20, spd: 35 },
    ability: "Maldi\xE7\xE3o do Eclipse",
    abilityDesc: "Reduz ATK do inimigo em 30% por 3 turnos.",
    emoji: "\u{1F9FF}"
  },
  CARD_MUMIA: {
    monsterId: "MUMIA",
    name: "M\xFAmia Ancestral",
    region: "RUINAS_ASTERION",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 700, atk: 65, def: 40, spd: 15 },
    ability: "Maldi\xE7\xE3o Milenar",
    abilityDesc: "Impede a cura do inimigo por 3 turnos.",
    emoji: "\u{1F9DF}"
  },
  CARD_GARGULA: {
    monsterId: "GARGULA",
    name: "G\xE1rgula de Pedra",
    region: "RUINAS_ASTERION",
    rarity: "EPICO",
    trait: "ESCUDO",
    baseStats: { hp: 800, atk: 60, def: 45, spd: 25 },
    ability: "Est\xE1tua Viva",
    abilityDesc: "Fica imune a dano por 1 turno a cada 4 turnos.",
    emoji: "\u{1F987}"
  },
  CARD_GUARDIAO: {
    monsterId: "GUARDIAO",
    name: "Guardi\xE3o de Asterion",
    region: "RUINAS_ASTERION",
    rarity: "LENDARIO",
    trait: "ESPINHOS",
    baseStats: { hp: 1500, atk: 120, def: 60, spd: 20 },
    ability: "Juramento de Asterion",
    abilityDesc: "Reflete 50% de todo dano recebido.",
    emoji: "\u{1F6E1}\uFE0F"
  },
  // ─── CICATRIZ PROFUNDA (T5) ───
  CARD_CRIA_VAZIO: {
    monsterId: "CRIA_VAZIO",
    name: "Cria do Vazio",
    region: "CICATRIZ_PROFUNDA",
    rarity: "RARO",
    trait: "MEDO",
    baseStats: { hp: 1200, atk: 90, def: 30, spd: 45 },
    ability: "Sussurro do Vazio",
    abilityDesc: "Reduz ATK do inimigo em 25%.",
    emoji: "\u{1F47E}"
  },
  CARD_VERME: {
    monsterId: "VERME",
    name: "Verme-Abissal",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 1400, atk: 100, def: 40, spd: 20 },
    ability: "Devorar",
    abilityDesc: "Aplica sangramento permanente.",
    emoji: "\u{1FAB1}"
  },
  CARD_ABERRACAO: {
    monsterId: "ABERRACAO",
    name: "Aberra\xE7\xE3o Tentacular",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 1300, atk: 110, def: 35, spd: 30 },
    ability: "Sil\xEAncio Abissal",
    abilityDesc: "Bloqueia habilidade do inimigo por 3 turnos.",
    emoji: "\u{1F991}"
  },
  CARD_SOMBRA: {
    monsterId: "SOMBRA",
    name: "Sombra Faminta",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "MEDO",
    baseStats: { hp: 1e3, atk: 120, def: 25, spd: 50 },
    ability: "Consumir Medo",
    abilityDesc: "Cada ataque reduz ATK do inimigo em 5% (acumula).",
    emoji: "\u{1F311}"
  },
  CARD_CEIFADOR_ALMAS: {
    monsterId: "CEIFADOR_ALMAS",
    name: "Ceifador de Almas",
    region: "CICATRIZ_PROFUNDA",
    rarity: "RARO",
    trait: "SANGRAMENTO",
    baseStats: { hp: 1500, atk: 130, def: 40, spd: 35 },
    ability: "Ceifa Final",
    abilityDesc: "Dano dobrado contra inimigos com <30% HP.",
    emoji: "\u{1F480}"
  },
  CARD_OLHO_VAZIO: {
    monsterId: "OLHO_VAZIO",
    name: "Olho do Vazio",
    region: "CICATRIZ_PROFUNDA",
    rarity: "EPICO",
    trait: "SILENCIO",
    baseStats: { hp: 1100, atk: 140, def: 25, spd: 40 },
    ability: "Olhar Petrificante",
    abilityDesc: "Impede o inimigo de usar habilidade.",
    emoji: "\u{1F441}\uFE0F"
  },
  CARD_DEVORADOR: {
    monsterId: "DEVORADOR",
    name: "Devorador da Cicatriz",
    region: "CICATRIZ_PROFUNDA",
    rarity: "LENDARIO",
    trait: "MEDO",
    baseStats: { hp: 3e3, atk: 200, def: 70, spd: 30 },
    ability: "Fim de Todas as Coisas",
    abilityDesc: "Ignora 50% da defesa do inimigo.",
    emoji: "\u{1F479}"
  }
};
function createCardInstance(templateId) {
  return {
    uid: generateId(),
    templateId,
    level: 1,
    obtainedAt: Date.now()
  };
}
function rollCardDrop(monsterId, tier, isBoss) {
  const templateId = `CARD_${monsterId}`;
  if (!CARD_TEMPLATES[templateId]) return null;
  if (isBoss) {
    if (Math.random() < 5e-3) {
      return createCardInstance(templateId);
    }
    return null;
  }
  const chance = tier === 1 ? 0.03 : tier === 2 ? 0.02 : tier === 3 ? 0.015 : tier === 4 ? 0.01 : 5e-3;
  if (Math.random() < chance) {
    return createCardInstance(templateId);
  }
  return null;
}

// src/engine/combat.ts
function buildProfile(char) {
  const bp = char.inventory.backpack;
  const p = { xpPct: (bp.xpBonus ?? 0) + (char.premium ? 0.1 : 0), goldPct: 0, dropPct: bp.dropBonus ?? 0, rarePct: bp.rareDropBonus ?? 0, healPct: 0, skillDmgPct: 0, cdReduce: 0, lifesteal: 0 };
  for (const [slot, item] of Object.entries(char.equipped)) {
    if (!item || slot === "BACKPACK") continue;
    p.xpPct += item.xpBonus ?? 0;
    p.goldPct += item.goldBonus ?? 0;
    p.dropPct += item.dropBonus ?? 0;
    p.rarePct += item.rareDropBonus ?? 0;
    p.lifesteal += item.lifesteal ?? 0;
  }
  const race = char.activeRace;
  const passive = race ? PASSIVE_EFFECTS[race.passivaId] : void 0;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : void 0;
  if (passive) {
    p.xpPct += passive.xpPct ?? 0;
    p.goldPct += passive.goldPct ?? 0;
    p.dropPct += passive.dropPct ?? 0;
    p.rarePct += passive.rareDropPct ?? 0;
    p.healPct += passive.healPct ?? 0;
    p.skillDmgPct += passive.skillDmgPct ?? 0;
    p.cdReduce += passive.cdReduce ?? 0;
  }
  if (support) p.lifesteal += support.lifesteal ?? 0;
  return p;
}
var EQUIP_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO"];
var emptyDamageBreakdown = () => ({ physical: 0, elemental: {}, lifestealHealing: 0 });
function resolveDeath(char, xpLost, goldLost) {
  const blessed = (char.blesses ?? 0) > 0;
  if (blessed) char.blesses = Math.max(0, (char.blesses ?? 0) - 1);
  const protectedByRing = Object.values(char.equipped).some((item) => item?.preventsDeathDrop);
  const lostItems = [];
  let lostBackpack;
  if (!blessed && !protectedByRing) {
    lostBackpack = char.inventory.backpack.name;
    lostItems.push(...char.inventory.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`));
    char.inventory.items = [];
    delete char.equipped.BACKPACK;
    char.inventory.backpack = { ...DEFAULT_BACKPACK };
    if (Math.random() < 0.1) {
      const equippedSet = Object.entries(char.equipped).filter(([slot, item]) => slot !== "BACKPACK" && !!item && !item?.preventsDeathDrop);
      if (equippedSet.length) {
        const [slot, item] = equippedSet[Math.floor(Math.random() * equippedSet.length)];
        if (item) {
          lostItems.push(`Equipado: ${item.name}`);
          delete char.equipped[slot];
        }
      }
    }
    recalcStats(char);
  }
  char.xp -= xpLost;
  char.gold -= goldLost;
  char.hp = 0;
  return { xpLost, goldLost, blessed, protectedByRing, lostBackpack, lostItems };
}
function processTick(char, zone, isOffline) {
  const result = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, zoneId: zone.id, killed: {}, bossKills: {}, dropCounts: {}, potionsUsed: 0, goldSpentPotions: 0, soldGold: 0, salvagedItems: 0, attacked: false, usedMp: false, cardsDropped: [], divineBeastsDropped: [], damageDealt: 0, damageTaken: 0, damageBreakdown: emptyDamageBreakdown(), damageTakenBreakdown: emptyDamageBreakdown(), combatDurationMs: 0, encounters: [] };
  const debug2 = isDebug();
  const offlineLimitSeconds = OFFLINE_MAX_HOURS * 3600 + Math.max(0, char.skills?.soul ?? 0) * 15 * 60;
  const requestedTicks = isOffline ? Math.min(Math.floor((Date.now() - char.lastTick) / TICK_MS), offlineLimitSeconds / (TICK_MS / 1e3)) : 1;
  const staminaPool = isOffline ? char.staminaOffline ?? 480 : char.staminaOnline ?? 120;
  const ticksAllowedByStamina = Math.floor(staminaPool * 6e4 / TICK_MS);
  const ticks = Math.max(0, Math.min(requestedTicks, ticksAllowedByStamina));
  if (ticks < requestedTicks) {
    result.staminaDepleted = true;
    result.log.push(isOffline ? "\u{1F319} Stamina offline esgotada; a simula\xE7\xE3o da ca\xE7a foi limitada." : "\u26A1 Stamina online esgotada; a ca\xE7a foi pausada.");
  }
  if (!ticks) {
    char.lastTick = Date.now();
    return result;
  }
  const savedTarget = zone.enemies.find((e) => e.id === char.activeEnemyId);
  const baseEnemy = savedTarget && char.level >= (savedTarget.minLevel ?? 1) ? savedTarget : zone.enemies.find((e) => char.level >= (e.minLevel ?? 1)) || zone.enemies[0];
  if (!baseEnemy) return result;
  const fightId = `${zone.id}:${baseEnemy.id}`;
  if (char.fightEnemyId !== fightId) {
    char.fightEnemyId = fightId;
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
    char.fightDamageBreakdown = emptyDamageBreakdown();
    char.fightDamageTakenBreakdown = emptyDamageBreakdown();
  }
  let encounterDamageDealt = char.fightDamageDealt ?? 0;
  let encounterDamageTaken = char.fightDamageTaken ?? 0;
  let encounterPotionGoldSpent = char.fightPotionGoldSpent ?? 0;
  let encounterDamageBreakdown = structuredClone(char.fightDamageBreakdown ?? emptyDamageBreakdown());
  let encounterDamageTakenBreakdown = structuredClone(char.fightDamageTakenBreakdown ?? emptyDamageBreakdown());
  let simulatedTicks = 0;
  const recordDeathEncounter = () => {
    if (encounterDamageDealt <= 0 && encounterDamageTaken <= 0) return;
    result.encounters.push({
      id: `${Date.now()}-${result.encounters.length}-${baseEnemy.id}`,
      timestamp: Date.now(),
      zoneId: zone.id,
      enemyId: baseEnemy.id,
      enemyName: baseEnemy.name,
      damageDealt: encounterDamageDealt,
      damageTaken: encounterDamageTaken,
      xp: 0,
      gold: 0,
      soldGold: 0,
      goldSpentPotions: encounterPotionGoldSpent,
      lootValue: 0,
      loot: [],
      outcome: "death",
      damageBreakdown: structuredClone(encounterDamageBreakdown),
      damageTakenBreakdown: structuredClone(encounterDamageTakenBreakdown)
    });
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
    char.fightDamageBreakdown = emptyDamageBreakdown();
    char.fightDamageTakenBreakdown = emptyDamageBreakdown();
    encounterPotionGoldSpent = 0;
    encounterDamageBreakdown = emptyDamageBreakdown();
    encounterDamageTakenBreakdown = emptyDamageBreakdown();
  };
  const diff = baseEnemy.difficulty || 1;
  const rewardScale = 1 + (diff - 1) * 0.2;
  const enemy = { ...baseEnemy, hp: baseEnemy.hp * diff, atk: baseEnemy.atk * diff, arm: baseEnemy.arm * diff, xp: Math.round(baseEnemy.xp * rewardScale), goldMin: Math.round(baseEnemy.goldMin * rewardScale), goldMax: Math.round(baseEnemy.goldMax * rewardScale) };
  if (char.enemyHpId !== baseEnemy.id || char.enemyHp === void 0 || char.enemyHp <= 0) {
    char.enemyHp = enemy.hp;
    char.enemyHpId = baseEnemy.id;
  }
  let enemyHp = Math.min(char.enemyHp, enemy.hp);
  let playerHp = char.hp;
  let playerMp = char.mp;
  let tickCount = char.tickCount ?? 0;
  const prof = buildProfile(char);
  const race = char.activeRace;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : void 0;
  const skill = race ? ATTACK_SKILLS[race.ataqueId] : void 0;
  const skillCd = Math.max(1, ATTACK_SKILL_COOLDOWN - prof.cdReduce);
  const hpPotId = char.autoHpPotionEnabled ? char.autoHpPotionId || null : null;
  const hpPotPct = char.autoHpPotionPercent || 50;
  const mpPotId = char.autoMpPotionEnabled ? char.autoMpPotionId || null : null;
  const mpPotPct = char.autoMpPotionPercent || 50;
  const warnInsufficientPotionGold = (cost) => {
    if (Date.now() < (char.potionGoldWarningUntil ?? 0)) return;
    char.potionGoldWarningUntil = Date.now() + 3e4;
    result.log.push(`\u{1FA99} Gold insuficiente para usar a po\xE7\xE3o (custo: ${cost.toLocaleString("pt-BR")}g).`);
  };
  let bagFullWarned = false;
  const hasDoubleAtkBuff = char.doubleAtkUntil && char.doubleAtkUntil > Date.now();
  const buffMultiplier = hasDoubleAtkBuff ? 2 : 1;
  const heal = (amount) => {
    const before = playerHp;
    playerHp = Math.min(char.hpMax, playerHp + Math.round(amount * (1 + prof.healPct)));
    return playerHp - before;
  };
  for (let i = 0; i < ticks; i++) {
    tickCount++;
    simulatedTicks++;
    const t = tickCount;
    const s = char.baseStats;
    const hpMax = char.hpMax;
    const mpMax = char.mpMax;
    result.attacked = false;
    result.lastDamage = 0;
    result.lastCrit = false;
    result.lastMiss = false;
    result.usedMp = false;
    if (playerHp > 0) playerHp = Math.min(hpMax, playerHp + Math.max(0, s.hpRegen ?? 0));
    playerMp = Math.min(mpMax, playerMp + Math.max(0, s.mpRegen ?? 0));
    if (playerHp <= 0) {
      recordDeathEncounter();
      result.death = true;
      const skillPenalty = applyTrainingDeathPenalty(char);
      if (skillPenalty) result.log.push(skillPenalty);
      const blessed = (char.blesses ?? 0) > 0;
      const xpLossPct = blessed ? 0.05 : 0.15;
      const xpLost = Math.floor(char.xp * xpLossPct);
      const goldLost = Math.floor(char.gold * 0.1);
      result.deathData = resolveDeath(char, xpLost, goldLost);
      result.log.push(`\u2620\uFE0F Voc\xEA morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
      break;
    }
    if (hpPotId && playerHp / hpMax * 100 <= hpPotPct) {
      const potion = POTION_TEMPLATES[hpPotId];
      const cost = getPotionUsePrice(hpPotId);
      if (potion && char.gold >= cost) {
        char.gold -= cost;
        result.goldSpentPotions += cost;
        encounterPotionGoldSpent += cost;
        char.fightPotionGoldSpent = encounterPotionGoldSpent;
        heal(potion.stats.hp ?? 0);
        result.potionsUsed++;
        result.log.push(`\u{1F9EA} ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`);
      } else if (potion) warnInsufficientPotionGold(cost);
    }
    if (mpPotId && playerMp / mpMax * 100 <= mpPotPct) {
      const potion = POTION_TEMPLATES[mpPotId];
      const cost = getPotionUsePrice(mpPotId);
      if (potion && char.gold >= cost) {
        char.gold -= cost;
        result.goldSpentPotions += cost;
        encounterPotionGoldSpent += cost;
        char.fightPotionGoldSpent = encounterPotionGoldSpent;
        playerMp = Math.min(mpMax, playerMp + (potion.stats.mp ?? 0));
        result.potionsUsed++;
        result.log.push(`\u{1F52E} ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`);
      } else if (potion) warnInsufficientPotionGold(cost);
    }
    const triggered = !!support && t % support.cd === 0;
    const buffOn = !!support?.dur && t % support.cd < support.dur;
    if (triggered && support?.healPct) {
      heal(hpMax * support.healPct);
      result.log.push(`\u{1F49A} Suporte curou voc\xEA.`);
    }
    const atkMult = 1 + (buffOn ? support?.atkPct ?? 0 : 0);
    const armMult = 1 + (buffOn ? support?.armPct ?? 0 : 0);
    const ignoreArmor = buffOn ? support?.ignoreArmor ?? 0 : 0;
    const comboReady = (char.comboReadyUntil ?? 0) > Date.now() && (char.comboCooldownUntil ?? 0) <= Date.now();
    const strike = (multiplier = 1) => {
      result.attacked = true;
      if (debug2) {
        result.lastDamage = 99999;
        return 99999;
      }
      if (Math.random() > (s.hit ?? 1)) {
        result.lastMiss = true;
        return 0;
      }
      const magicWeapon = ["CAJADO", "VARINHA"].some((key) => char.equipped.ARMA_PRINCIPAL?.templateId.includes(key));
      const base = (magicWeapon ? s.matk ?? 0 : s.atk ?? 0) * atkMult * multiplier;
      let dmg = mitigatedDamage(base, enemy.arm * (1 - ignoreArmor));
      if (Math.random() < (s.crit ?? 0)) {
        dmg *= 1 + clamp(s.critDmg ?? 0.5, 0, 1.5);
        result.lastCrit = true;
      }
      if (support?.executeBonus && enemyHp < enemy.hp * 0.4) dmg *= 1 + support.executeBonus;
      dmg = Math.max(1, Math.round(dmg));
      result.lastDamage = (result.lastDamage ?? 0) + dmg;
      return dmg;
    };
    let dealt = strike();
    if (comboReady) {
      const bonus = strike(0.5);
      dealt += bonus;
      char.comboReadyUntil = void 0;
      char.comboCooldownUntil = Date.now() + 15e3;
      result.log.push(`\u26A1 Combo Especial! Segundo impacto +${bonus} dano.`);
    }
    let elementalThisTick = 0;
    if (hasDoubleAtkBuff) {
      dealt += strike();
      result.log.push(`\u26A1 Ataque Duplo!`);
    }
    if (triggered && support?.doubleStrike) dealt += strike();
    if (Math.random() < (s.spd ?? 0)) dealt += strike();
    if (skill && t % skillCd === 0 && !debug2) {
      const manaCost = skill.manaCost + Math.floor(char.level * 0.5);
      if (playerMp >= manaCost) {
        playerMp -= manaCost;
        result.usedMp = true;
        const raw = ((s.matk ?? 0) + (s.atk ?? 0) * 0.5) * skill.mult * (1 + prof.skillDmgPct);
        const armor = enemy.arm * (1 - skill.pierce) * (1 - ignoreArmor);
        const baseSkillDamage = Math.round(mitigatedDamage(raw, armor));
        const skillElement = attackElement(race?.ataqueId);
        const skillResistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[skillElement] ?? 0));
        const sd = Math.round(baseSkillDamage * elementMultiplier(skillElement, enemy.element) * (1 - skillResistance));
        dealt += sd;
        result.lastDamage = (result.lastDamage ?? 0) + sd;
        if (skillElement !== "BASE") {
          elementalThisTick += sd;
          result.damageBreakdown.elemental[skillElement] = (result.damageBreakdown.elemental[skillElement] ?? 0) + sd;
          encounterDamageBreakdown.elemental[skillElement] = (encounterDamageBreakdown.elemental[skillElement] ?? 0) + sd;
        }
        if (skill.lifesteal) {
          const recovered = heal(sd * skill.lifesteal);
          result.damageBreakdown.lifestealHealing += recovered;
          encounterDamageBreakdown.lifestealHealing += recovered;
        }
        result.log.push(`\u2728 ${skill.desc.split(":")[0]} causou ${sd} de dano ${skillElement === "BASE" ? "m\xE1gico" : skillElement.toLowerCase()}!`);
      } else {
        result.log.push(`\u26A0\uFE0F Mana insuficiente!`);
      }
    }
    const weapon = char.equipped.ARMA_PRINCIPAL;
    if (weapon?.element && (weapon.elementalDamagePct ?? 0) > 0 && dealt > 0) {
      const rawElementDamage = Math.round(dealt * (weapon.elementalDamagePct ?? 0));
      const resistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[weapon.element] ?? 0));
      const elementalDamage = Math.max(0, Math.round(rawElementDamage * elementMultiplier(weapon.element, enemy.element) * (1 - resistance)));
      dealt += elementalDamage;
      elementalThisTick += elementalDamage;
      result.lastDamage = (result.lastDamage ?? 0) + elementalDamage;
      result.damageBreakdown.elemental[weapon.element] = (result.damageBreakdown.elemental[weapon.element] ?? 0) + elementalDamage;
      encounterDamageBreakdown.elemental[weapon.element] = (encounterDamageBreakdown.elemental[weapon.element] ?? 0) + elementalDamage;
    }
    const bond = getBeastCombat(char);
    if (bond && t % bond.cooldown === 0 && playerMp >= bond.mana && !debug2) {
      playerMp -= bond.mana;
      result.usedMp = true;
      const raw = ((s.atk ?? 0) + (s.matk ?? 0)) * 0.5 * bond.multiplier;
      const resistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.elementalResistances?.[bond.element] ?? 0));
      const damage = Math.max(1, Math.round(mitigatedDamage(raw, enemy.arm * 0.5) * elementMultiplier(bond.element, enemy.element) * (1 - resistance)));
      dealt += damage;
      elementalThisTick += damage;
      result.lastDamage = (result.lastDamage ?? 0) + damage;
      result.damageBreakdown.elemental[bond.element] = (result.damageBreakdown.elemental[bond.element] ?? 0) + damage;
      encounterDamageBreakdown.elemental[bond.element] = (encounterDamageBreakdown.elemental[bond.element] ?? 0) + damage;
      result.log.push(bond.beast.name + " usa " + bond.name + ": " + damage + " de dano " + bond.element.toLowerCase() + ".");
    }
    const physicalThisTick = Math.max(0, dealt - elementalThisTick);
    result.damageBreakdown.physical += physicalThisTick;
    encounterDamageBreakdown.physical += physicalThisTick;
    char.fightDamageBreakdown = structuredClone(encounterDamageBreakdown);
    if (debug2) result.log.push(`[TESTE] Voc\xEA obliterou o ${enemy.name} (${diff}\u2B50).`);
    else if (dealt > 0) result.log.push(`Voc\xEA causou ${dealt} de dano f\xEDsico no ${enemy.name}.${result.lastCrit ? " \u{1F4A5} CR\xCDTICO!" : ""}`);
    result.damageDealt += dealt;
    encounterDamageDealt += dealt;
    char.fightDamageDealt = encounterDamageDealt;
    enemyHp -= dealt;
    if (prof.lifesteal > 0 && !debug2) {
      const recovered = heal(dealt * prof.lifesteal);
      result.damageBreakdown.lifestealHealing += recovered;
      encounterDamageBreakdown.lifestealHealing += recovered;
      char.fightDamageBreakdown = structuredClone(encounterDamageBreakdown);
    }
    if (enemyHp <= 0) {
      result.kills++;
      char.killsInZone++;
      char.totalKills = (char.totalKills ?? 0) + 1;
      char.bestiaryKills ??= {};
      char.bestiaryKills[enemy.id] = (char.bestiaryKills[enemy.id] ?? 0) + 1;
      result.killed[enemy.id] = (result.killed[enemy.id] ?? 0) + 1;
      if (enemy.isBoss) result.bossKills[enemy.id] = (result.bossKills[enemy.id] ?? 0) + 1;
      const g = Math.floor((enemy.goldMin + Math.floor(Math.random() * (enemy.goldMax - enemy.goldMin + 1))) * (1 + prof.goldPct));
      const xpGained = Math.floor(enemy.xp * (1 + prof.xpPct)) * (debug2 ? 10 : 1);
      result.gold += g;
      char.gold += g;
      result.xp += xpGained;
      char.xp += xpGained;
      const loot = [];
      const soldGoldBefore = result.soldGold ?? 0;
      heal(hpMax * BALANCE.killRecovery);
      const cardDrop = rollCardDrop(enemy.id, zone.tier, enemy.isBoss);
      if (cardDrop) {
        if (!char.cards) char.cards = [];
        char.cards.push(cardDrop);
        result.cardsDropped.push(cardDrop);
        const template = CARD_TEMPLATES[cardDrop.templateId];
        result.log.push(`\u{1F0CF} CARTA DROPADA: ${template?.emoji} ${template?.name}!`);
        if (template) loot.push({ name: template.name, icon: template.emoji, quantity: 1, sellValue: 0, kind: "card" });
      }
      let bondedBeastName = null;
      const availableBeasts = enemy.isBoss ? Object.values(DIVINE_BEASTS).filter((candidate) => candidate.bossId === enemy.id && !(char.divineBeasts ?? []).some((owned) => owned.id === candidate.id)) : [];
      if (availableBeasts.length > 0 && Math.random() < availableBeasts[0].dropChance) {
        const beast = availableBeasts[Math.floor(Math.random() * availableBeasts.length)];
        if (!char.divineBeasts) char.divineBeasts = [];
        char.divineBeasts.push({ id: beast.id, obtainedAt: Date.now() });
        result.divineBeastsDropped.push(beast.id);
        bondedBeastName = beast.name;
      }
      const drops = rollDrops(enemy, zone, char, { dropBonus: prof.dropPct, rareBonus: prof.rarePct + (char.baseStats.luck ?? 0), force: debug2 });
      if (debug2 || char.killsInZone % 10 === 0 || enemy.isBoss) drops.push(rollAmbient(zone));
      const autoSell = char.autoSell ?? null;
      const autoSalvage = char.autoSalvage ?? null;
      const sellByTemplate = new Set(char.autoSellTemplateIds ?? []);
      const salvageByTemplate = new Set(char.autoSalvageTemplateIds ?? []);
      const ignoredLoot = new Set(char.ignoredLootTemplateIds ?? []);
      for (const d of drops) {
        loot.push({ name: d.name, icon: d.icon, quantity: d.quantity, sellValue: sellValue(d), kind: "item" });
        if (ignoredLoot.has(d.templateId) && (char.bestiaryKills?.[enemy.id] ?? 0) >= 100) {
          result.log.push(`\u{1F9FA} Autoloot ignorou ${d.name}.`);
          continue;
        }
        const isEquip = EQUIP_CATEGORIES.includes(d.category);
        if (isEquip && d.rarity !== "LENDARIO" && (autoSell && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSell) || sellByTemplate.has(d.templateId))) {
          const v = sellValue(d);
          char.gold += v;
          result.gold += v;
          result.soldGold += v;
          continue;
        }
        if (isEquip && d.rarity !== "LENDARIO" && (autoSalvage && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSalvage) || salvageByTemplate.has(d.templateId))) {
          salvageItem(char, d);
          result.salvagedItems++;
          continue;
        }
        if (addItem(char.inventory, d)) {
          result.drops.push(d);
          result.dropCounts[d.templateId] = (result.dropCounts[d.templateId] ?? 0) + d.quantity;
        } else if (!bagFullWarned) {
          bagFullWarned = true;
          result.log.push("\u{1F392} Bolsa cheia!");
        }
      }
      const encounter = {
        id: `${Date.now()}-${result.encounters.length}-${enemy.id}`,
        timestamp: Date.now(),
        zoneId: zone.id,
        enemyId: enemy.id,
        enemyName: enemy.name,
        damageDealt: encounterDamageDealt,
        damageTaken: encounterDamageTaken,
        xp: xpGained,
        gold: g,
        goldSpentPotions: encounterPotionGoldSpent,
        soldGold: (result.soldGold ?? 0) - soldGoldBefore,
        lootValue: loot.reduce((total, item) => total + item.sellValue * item.quantity, 0),
        loot,
        outcome: "victory",
        damageBreakdown: structuredClone(encounterDamageBreakdown),
        damageTakenBreakdown: structuredClone(encounterDamageTakenBreakdown)
      };
      result.encounters.push(encounter);
      encounterDamageDealt = 0;
      encounterDamageTaken = 0;
      char.fightPotionGoldSpent = 0;
      encounterPotionGoldSpent = 0;
      char.fightDamageDealt = 0;
      char.fightDamageTaken = 0;
      encounterDamageBreakdown = emptyDamageBreakdown();
      encounterDamageTakenBreakdown = emptyDamageBreakdown();
      char.fightDamageBreakdown = emptyDamageBreakdown();
      char.fightDamageTakenBreakdown = emptyDamageBreakdown();
      while (char.xp >= char.xpToNext) {
        char.xp -= char.xpToNext;
        char.level++;
        char.xpToNext = xpToNextLevel(char.level);
        result.levelsGained++;
        char.statPoints = (char.statPoints ?? 0) + 1;
        result.log.push("\u{1F31F} Voc\xEA recebeu 1 ponto de status!");
        char.hp = playerHp;
        recalcStats(char);
        playerHp = char.hpMax;
        char.mp = char.mpMax;
        result.log.push(`\u2728 Subiu para n\xEDvel ${char.level}!`);
      }
      result.log.push(`Voc\xEA derrotou o ${enemy.name} (${diff}\u2B50)! (+${g} ouro, +${xpGained} XP)`);
      if (bondedBeastName) result.log.push(`\u{1F43E} Resson\xE2ncia Divina! ${bondedBeastName} criou um v\xEDnculo com voc\xEA.`);
      enemyHp = enemy.hp;
    } else {
      const e = support;
      const dodgedBySkill = !!e?.dodgeEvery && t % e.dodgeEvery === 0;
      if (dodgedBySkill || Math.random() < (s.dge ?? 0)) {
        result.log.push(`Voc\xEA esquivou do ataque de ${enemy.name}.`);
      } else {
        const armor = (s.arm ?? 0) * armMult;
        const reduction = armor + (s.def ?? 0) * 0.5;
        const raw = mitigatedDamage(enemy.atk, reduction);
        const res = enemy.damageType === "MAGICO" ? s.resMagico ?? 0 : s.resFisico ?? 0;
        let mult = (1 - clamp(res, 0, BALANCE.resistanceCap)) * (1 - (buffOn ? e?.dmgReduction ?? 0 : 0) - (e?.permDmgReduction ?? 0));
        if (Math.random() < (s.blk ?? 0)) mult *= 0.5;
        const physicalRaw = enemy.element ? Math.round(raw * 0.65) : raw;
        const elementalRaw = enemy.element ? raw - physicalRaw : 0;
        const ePhysical = debug2 ? 0 : Math.max(1, Math.round(physicalRaw * clamp(mult, 0.1, 1)));
        const elementalResistance = Math.max(0, Math.min(BALANCE.resistanceCap, enemy.element ? char.elementalResistances?.[enemy.element] ?? 0 : 0));
        const eElemental = debug2 || !enemy.element ? 0 : Math.max(0, Math.round(elementalRaw * clamp(mult, 0.1, 1) * (1 - elementalResistance)));
        const eDmg = ePhysical + eElemental;
        playerHp -= eDmg;
        result.damageTaken += eDmg;
        encounterDamageTaken += eDmg;
        char.fightDamageTaken = encounterDamageTaken;
        result.damageTakenBreakdown.physical += ePhysical;
        encounterDamageTakenBreakdown.physical += ePhysical;
        if (enemy.element && eElemental > 0) {
          result.damageTakenBreakdown.elemental[enemy.element] = (result.damageTakenBreakdown.elemental[enemy.element] ?? 0) + eElemental;
          encounterDamageTakenBreakdown.elemental[enemy.element] = (encounterDamageTakenBreakdown.elemental[enemy.element] ?? 0) + eElemental;
        }
        char.fightDamageTakenBreakdown = structuredClone(encounterDamageTakenBreakdown);
        if (eDmg > 0) result.log.push(`${enemy.name} causou ${eDmg} de dano em voc\xEA.`);
      }
      if (playerHp <= 0) {
        recordDeathEncounter();
        result.death = true;
        const blessed = (char.blesses ?? 0) > 0;
        const xpLossPct = blessed ? 0.05 : 0.15;
        const xpLost = Math.floor(char.xp * xpLossPct);
        const goldLost = Math.floor(char.gold * 0.1);
        result.deathData = resolveDeath(char, xpLost, goldLost);
        result.log.push(`\u2620\uFE0F Voc\xEA morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
        break;
      }
    }
  }
  char.tickCount = tickCount;
  const staminaMinutesSpent = simulatedTicks * TICK_MS / 6e4;
  if (isOffline) {
    char.staminaOffline = Math.max(0, (char.staminaOffline ?? 480) - staminaMinutesSpent);
    char.staminaOnline = Math.min(120, (char.staminaOnline ?? 120) + staminaMinutesSpent * 0.2);
  } else {
    char.staminaOnline = Math.max(0, (char.staminaOnline ?? 120) - staminaMinutesSpent);
    char.staminaOffline = Math.min(480, (char.staminaOffline ?? 480) + staminaMinutesSpent * 0.2);
  }
  char.staminaUpdatedAt = Date.now();
  char.hp = Math.max(0, Math.min(char.hpMax, playerHp));
  char.mp = Math.max(0, Math.min(char.mpMax, playerMp));
  char.enemyHp = enemyHp;
  char.enemyHpId = baseEnemy.id;
  char.lastTick = Date.now();
  result.log = result.log.slice(-10);
  result.combatDurationMs = simulatedTicks * TICK_MS;
  result.enemyHp = Math.max(0, Math.round(enemyHp));
  result.enemyMaxHp = enemy.hp;
  return result;
}

// src/data/races.ts
var NAMED_RACES = [
  { id: "R01", name: "Portador da Primeira Luz", tier: "NOMEADA", ataqueId: "A3", suporteId: "S3", passivaId: "P5", skills: { ataque: "Raio Nascente", suporte: "Renova\xE7\xE3o", passiva: "Alvorecer" }, bonus: { hp: 100, mp: 50, atk: 10 } },
  { id: "R02", name: "Caminhante do Sil\xEAncio", tier: "NOMEADA", ataqueId: "A8", suporteId: "S4", passivaId: "P6", skills: { ataque: "Golpe Crepuscular", suporte: "V\xE9u de Descanso", passiva: "Serenidade" }, bonus: { hp: 120, dge: 0.08 } },
  { id: "R03", name: "Metamorfo", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P7", skills: { ataque: "Erup\xE7\xE3o Muda", suporte: "Adapta\xE7\xE3o", passiva: "Evolu\xE7\xE3o Constante" }, bonus: { atk: 15, matk: 20, hp: 80 } },
  { id: "R04", name: "Arquivista Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P10", skills: { ataque: "Eco do Passado", suporte: "Leitura de Mem\xF3ria", passiva: "Codex Vivo" }, bonus: { mp: 150, atk: 10, matk: 15 } },
  { id: "R05", name: "Moldador de Baluartes", tier: "NOMEADA", ataqueId: "A4", suporteId: "S7", passivaId: "P2", skills: { ataque: "Impacto S\xEDsmico", suporte: "Muralha de Pedra", passiva: "Pele de Granito" }, bonus: { arm: 50, def: 20, hp: 250 } },
  { id: "R06", name: "Tecel\xE3o da Vida", tier: "NOMEADA", ataqueId: "A7", suporteId: "S1", passivaId: "P1", skills: { ataque: "Chicote de Seiva", suporte: "V\xEDnculo Emp\xE1tico", passiva: "Mem\xF3ria da Floresta" }, bonus: { hp: 350, def: 15 } },
  { id: "R07", name: "Andarilho do Vento", tier: "NOMEADA", ataqueId: "A10", suporteId: "S8", passivaId: "P4", skills: { ataque: "L\xE2mina de Vendaval", suporte: "Passo Et\xE9reo", passiva: "Vento nas Costas" }, bonus: { spd: 0.12, dge: 0.06 } },
  { id: "R08", name: "Arquiteto da Ordem", tier: "NOMEADA", ataqueId: "A9", suporteId: "S10", passivaId: "P3", skills: { ataque: "Pilar de Cristal", suporte: "Estrutura Coesa", passiva: "Padr\xE3o Perfeito" }, bonus: { def: 20, arm: 30, resMagico: 0.05 } },
  { id: "R09", name: "Herege da D\xFAvida", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P9", skills: { ataque: "Golpe Imprevis\xEDvel", suporte: "Disson\xE2ncia", passiva: "Ceticismo" }, bonus: { crit: 0.1, hit: 0.06 } },
  { id: "R10", name: "S\xE1bio da Compreens\xE3o", tier: "NOMEADA", ataqueId: "A15", suporteId: "S10", passivaId: "P11", skills: { ataque: "Cadeia L\xF3gica", suporte: "Insight T\xE1tico", passiva: "Erudi\xE7\xE3o" }, bonus: { matk: 30, crit: 0.06, hit: 0.06 } },
  { id: "R11", name: "Vinculador de Almas", tier: "NOMEADA", ataqueId: "A13", suporteId: "S2", passivaId: "P5", skills: { ataque: "La\xE7o Compartilhado", suporte: "Juramento", passiva: "Lealdade" }, bonus: { hp: 250, atk: 15, arm: 20 } },
  { id: "R12", name: "Explorador do Horizonte", tier: "NOMEADA", ataqueId: "A6", suporteId: "S8", passivaId: "P4", skills: { ataque: "Investida Distante", suporte: "Rota Alternativa", passiva: "Mapa Mental" }, bonus: { spd: 0.1, hit: 0.06, dge: 0.06 } },
  { id: "R13", name: "Alquimista da Uni\xE3o", tier: "NOMEADA", ataqueId: "A11", suporteId: "S12", passivaId: "P12", skills: { ataque: "Rea\xE7\xE3o em Cadeia", suporte: "S\xEDntese R\xE1pida", passiva: "F\xF3rmula Secreta" }, bonus: { matk: 25, atk: 15, crit: 0.06 } },
  { id: "R14", name: "Guardi\xE3o dos Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S5", passivaId: "P8", skills: { ataque: "D\xEDvida Temporal", suporte: "Adiantar", passiva: "Ritmo" }, bonus: { hp: 200, mp: 120, spd: 0.06 } },
  { id: "R15", name: "Ferreiro de Mundos", tier: "NOMEADA", ataqueId: "A9", suporteId: "S11", passivaId: "P12", skills: { ataque: "Martelo Primordial", suporte: "Forja R\xE1pida", passiva: "Mestre Artes\xE3o" }, bonus: { atk: 35, arm: 35, hp: 200 } },
  { id: "R16", name: "Construtor Inst\xE1vel", tier: "NOMEADA", ataqueId: "A1", suporteId: "S9", passivaId: "P7", skills: { ataque: "Detona\xE7\xE3o Programada", suporte: "Reconfigurar", passiva: "Caos Controlado" }, bonus: { atk: 25, matk: 20, crit: 0.06 } },
  { id: "R17", name: "Sombra da D\xFAvida", tier: "NOMEADA", ataqueId: "A13", suporteId: "S4", passivaId: "P6", skills: { ataque: "Facada nas Costas", suporte: "Desaparecer", passiva: "N\xE9voa Pessoal" }, bonus: { dge: 0.12, crit: 0.1, atk: 20 } },
  { id: "R18", name: "Desertor", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P8", skills: { ataque: "Golpe de Fuga", suporte: "Rota de Fuga", passiva: "Instinto" }, bonus: { spd: 0.18, dge: 0.06 } },
  { id: "R19", name: "Bibliotec\xE1rio Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P9", skills: { ataque: "Palavra de Poder", suporte: "Reescrever", passiva: "Arquivo Vivo" }, bonus: { mp: 180, matk: 25, crit: 0.06 } },
  { id: "R20", name: "Vidente dos Ciclos", tier: "NOMEADA", ataqueId: "A10", suporteId: "S5", passivaId: "P8", skills: { ataque: "Premoni\xE7\xE3o", suporte: "Prever", passiva: "Clarivid\xEAncia" }, bonus: { spd: 0.12, crit: 0.1, hit: 0.12 } },
  { id: "R21", name: "M\xE3e da Floresta", tier: "NOMEADA", ataqueId: "A7", suporteId: "S2", passivaId: "P1", skills: { ataque: "Ra\xEDzes Estranguladoras", suporte: "Regenera\xE7\xE3o Coletiva", passiva: "Ber\xE7o Vivo" }, bonus: { hp: 500, def: 20, matk: 15 } },
  { id: "R22", name: "Portador do V\xEDnculo", tier: "NOMEADA", ataqueId: "A3", suporteId: "S11", passivaId: "P5", skills: { ataque: "Chama Compartilhada", suporte: "Renascimento", passiva: "Chama da Amizade" }, bonus: { hp: 250, atk: 25, matk: 20 } },
  { id: "R23", name: "Vendaval", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P4", skills: { ataque: "Tempestade de L\xE2minas", suporte: "Corrente de Ar", passiva: "Imprevis\xEDvel" }, bonus: { spd: 0.18, dge: 0.1 } },
  { id: "R24", name: "Mutante Veloz", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P9", skills: { ataque: "Investida Mutante", suporte: "Adapta\xE7\xE3o R\xE1pida", passiva: "Evolu\xE7\xE3o em Combate" }, bonus: { atk: 25, spd: 0.12, crit: 0.06 } },
  { id: "R25", name: "Forjador de Rel\xEDquias", tier: "NOMEADA", ataqueId: "A4", suporteId: "S12", passivaId: "P12", skills: { ataque: "Arma Forjada", suporte: "Encantar", passiva: "M\xE3os de Ouro" }, bonus: { atk: 30, arm: 25, hp: 200 } },
  { id: "R26", name: "Jardineiro Arcano", tier: "NOMEADA", ataqueId: "A7", suporteId: "S12", passivaId: "P2", skills: { ataque: "P\xF3len Explosivo", suporte: "Cultivar", passiva: "Colheita" }, bonus: { hp: 300, def: 25, matk: 20 } },
  { id: "R27", name: "Guardi\xE3o da Mem\xF3ria", tier: "NOMEADA", ataqueId: "A12", suporteId: "S6", passivaId: "P11", skills: { ataque: "Eco Temporal", suporte: "Rebobinar", passiva: "Mem\xF3ria Perfeita" }, bonus: { mp: 120, matk: 25, crit: 0.06 } },
  { id: "R28", name: "Ceifador de Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S4", passivaId: "P3", skills: { ataque: "Golpe Final", suporte: "Encerrar", passiva: "Fim Inevit\xE1vel" }, bonus: { atk: 35, crit: 0.1, resMagico: 0.06 } },
  { id: "R29", name: "Crep\xFAsculo Eterno", tier: "NOMEADA", ataqueId: "A15", suporteId: "S3", passivaId: "P5", skills: { ataque: "Eclipse", suporte: "Equil\xEDbrio", passiva: "Ciclo Perfeito" }, bonus: { hp: 250, atk: 20, matk: 20, crit: 0.06 } },
  { id: "R30", name: "Evolucionista", tier: "NOMEADA", ataqueId: "A11", suporteId: "S1", passivaId: "P11", skills: { ataque: "Muta\xE7\xE3o Ofensiva", suporte: "Regenera\xE7\xE3o Adaptativa", passiva: "Sele\xE7\xE3o Natural" }, bonus: { hp: 300, atk: 20, matk: 20 } },
  { id: "R31", name: "Guardi\xE3o da Terra", tier: "NOMEADA", ataqueId: "A4", suporteId: "S3", passivaId: "P2", skills: { ataque: "Terremoto", suporte: "Cura da Rocha", passiva: "Ra\xEDzes Profundas" }, bonus: { hp: 350, arm: 35, def: 20 } },
  { id: "R32", name: "Investigador Herege", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P10", skills: { ataque: "Pergunta Certa", suporte: "Interrogar", passiva: "D\xFAvida Met\xF3dica" }, bonus: { crit: 0.12, hit: 0.1, atk: 20 } },
  { id: "R33", name: "Inventor Ca\xF3tico", tier: "NOMEADA", ataqueId: "A1", suporteId: "S13", passivaId: "P9", skills: { ataque: "Gambiarra", suporte: "Improvisar", passiva: "Sorte do Caos" }, bonus: { atk: 20, crit: 0.1, spd: 0.06 } }
];
var SUPPORT_TITLES = {
  S1: "do Vigor",
  S2: "do V\xEDnculo",
  S3: "da Aurora",
  S4: "do V\xE9u",
  S5: "do Ritmo",
  S6: "da Revela\xE7\xE3o",
  S7: "do Baluarte",
  S8: "do Passo",
  S9: "da Adapta\xE7\xE3o",
  S10: "do C\xE1lculo",
  S11: "do Equil\xEDbrio",
  S12: "da Fus\xE3o",
  S13: "da Preda\xE7\xE3o"
};
var PASSIVE_SUFFIXES = {
  P1: "Eterna",
  P2: "de Granito",
  P3: "Elemental",
  P4: "Veloz",
  P5: "Sagrada",
  P6: "Nebulosa",
  P7: "Furiosa",
  P8: "Acelerada",
  P9: "Cruel",
  P10: "Erudita",
  P11: "Rara",
  P12: "\xC1urea"
};
var ATAQUE_NOMES_CURTOS = {
  A1: "Presa de Lobo",
  A2: "Ferr\xE3o de Vespa",
  A3: "Chama de Espectro",
  A4: "Garra de Urso",
  A5: "Pe\xE7onha de Serpente",
  A6: "L\xE2mina de Bandido",
  A7: "Espinho de Planta",
  A8: "Mand\xEDbula de Hiena",
  A9: "N\xFAcleo de Golem",
  A10: "Pena de Falc\xE3o",
  A11: "Cristal de Gelo",
  A12: "Tent\xE1culo Abissal",
  A13: "Fragmento de Tempestade",
  A14: "Presa de Verme",
  A15: "Fragmento de Asterion"
};
function generateRaceName(ataqueId, suporteId, passivaId) {
  const atk = ATAQUE_NOMES_CURTOS[ataqueId] || "Ra\xE7a";
  const title = SUPPORT_TITLES[suporteId] || "do Vazio";
  const suffix = PASSIVE_SUFFIXES[passivaId] || "Eterna";
  return `${atk} ${title} ${suffix}`;
}
function generateRaceId(ataqueId, suporteId, passivaId) {
  return `RC-${ataqueId}-${suporteId}-${passivaId}`;
}
function generateRaceBonus(ataqueId, suporteId, passivaId) {
  const bonus = {};
  const aNum = parseInt(ataqueId.replace("A", "")) || 1;
  const sNum = parseInt(suporteId.replace("S", "")) || 1;
  const pNum = parseInt(passivaId.replace("P", "")) || 1;
  bonus.atk = 10 + aNum * 2;
  bonus.matk = 10 + aNum * 1.5;
  bonus.hp = 50 + sNum * 10;
  bonus.mp = 20 + sNum * 5;
  bonus.crit = 0.02 + pNum * 5e-3;
  bonus.dge = 0.02 + pNum * 5e-3;
  return bonus;
}
function findNamedRace(ataqueId, suporteId, passivaId) {
  return NAMED_RACES.find((r) => r.ataqueId === ataqueId && r.suporteId === suporteId && r.passivaId === passivaId) ?? null;
}
var MATRIX_STATS = {
  totalAtaques: 15,
  totalSuportes: 13,
  totalPassivas: 12,
  totalCombinacoes: 15 * 13 * 12,
  totalNomeadas: 33,
  totalSobrenomes: 13 * 12
};

// src/engine/forge.ts
function getUpgradeCost(item) {
  const nextLevel = item.upgradeLevel + 1;
  let fragmentType = "FRAGMENTO_COMUM";
  let fragmentsNeeded = 5 * nextLevel;
  if (item.tier >= 3) {
    fragmentType = "FRAGMENTO_RARO";
    fragmentsNeeded = 3 * nextLevel;
  }
  if (item.tier >= 5) {
    fragmentType = "FRAGMENTO_EPICO";
    fragmentsNeeded = 2 * nextLevel;
  }
  const goldCost = Math.floor(100 * item.tier * Math.pow(nextLevel, 2));
  return { fragments: fragmentsNeeded, gold: goldCost, fragmentType };
}
function upgradeItemLevel(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado no invent\xE1rio." };
  if (item.upgradeLevel >= 10) return { success: false, error: "O item j\xE1 atingiu o n\xEDvel m\xE1ximo (+10)." };
  const cost = getUpgradeCost(item);
  const fragmentsOwned = countByTemplate(char.inventory, cost.fragmentType);
  if (fragmentsOwned < cost.fragments) {
    return { success: false, error: `Fragmentos insuficientes. Voc\xEA tem ${fragmentsOwned}, precisa de ${cost.fragments}.` };
  }
  if (char.gold < cost.gold) {
    return { success: false, error: `Ouro insuficiente. Voc\xEA tem ${char.gold}, precisa de ${cost.gold}.` };
  }
  char.gold -= cost.gold;
  let remainingToRemove = cost.fragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === cost.fragmentType && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }
  item.upgradeLevel += 1;
  for (const [k, v] of Object.entries(item.stats)) {
    item.stats[k] = Math.round(v * 1.1 * 100) / 100;
  }
  recalcStats(char);
  return { success: true };
}
function rerollItemAffixes(char, itemUid) {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado." };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns n\xE3o possuem atributos para reencantar." };
  const costFragments = 20;
  const costGold = 500 * item.tier;
  const fragmentsOwned = countByTemplate(char.inventory, "FRAGMENTO_RARO");
  if (fragmentsOwned < costFragments) {
    return { success: false, error: `Faltam Fragmentos Raros. Voc\xEA tem ${fragmentsOwned}, precisa de ${costFragments}.` };
  }
  if (char.gold < costGold) {
    return { success: false, error: `Ouro insuficiente. Voc\xEA tem ${char.gold}, precisa de ${costGold}.` };
  }
  char.gold -= costGold;
  let remainingToRemove = costFragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === "FRAGMENTO_RARO" && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }
  const newAffixes = generateRandomAffixes(item.category, item.rarity, item.tier);
  item.affixes = newAffixes;
  recalcStats(char);
  return { success: true, newAffixes };
}

// src/engine/depot.ts
function getDepotUsedSlots(char) {
  return char.depot?.length || 0;
}
function depositItem(char, uid) {
  if (!char.depot) char.depot = [];
  if (!char.depotMax) char.depotMax = 300;
  const item = char.inventory.items.find((i) => i.uid === uid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado na Backpack." };
  if (getDepotUsedSlots(char) >= char.depotMax) return { success: false, error: "O Depot est\xE1 cheio!" };
  removeItem(char.inventory, uid, item.quantity);
  char.depot.push({ ...item });
  for (const [slot, eq] of Object.entries(char.equipped)) {
    if (eq && eq.uid === uid) {
      delete char.equipped[slot];
    }
  }
  recalcStats(char);
  return { success: true };
}
function withdrawItem(char, uid) {
  if (!char.depot) return { success: false, error: "Depot vazio." };
  const item = char.depot.find((i) => i.uid === uid);
  if (!item) return { success: false, error: "Item n\xE3o encontrado no Depot." };
  if (getUsedSlots(char.inventory) >= char.inventory.backpack.slots) {
    return { success: false, error: "Sua Backpack est\xE1 cheia!" };
  }
  char.depot = char.depot.filter((i) => i.uid !== uid);
  addItem(char.inventory, item);
  recalcStats(char);
  return { success: true };
}
function depositMany(char, uids) {
  let moved = 0;
  let error = void 0;
  for (const uid of uids) {
    const res = depositItem(char, uid);
    if (res.success) moved++;
    else {
      error = res.error;
      break;
    }
  }
  return { moved, error };
}
function withdrawMany(char, uids) {
  let moved = 0;
  let error = void 0;
  for (const uid of uids) {
    const res = withdrawItem(char, uid);
    if (res.success) moved++;
    else {
      error = res.error;
      break;
    }
  }
  return { moved, error };
}

// src/store/gameStore.ts
function recordHuntMetrics(character, zoneId, result) {
  const previous = character.huntStatsByZone?.[zoneId] ?? {
    activeMs: 0,
    kills: 0,
    damageDealt: 0,
    damageTaken: 0,
    xp: 0,
    gold: 0,
    goldSpentPotions: 0,
    soldGold: 0,
    lootValue: 0,
    history: []
  };
  const encounters = result.encounters ?? [];
  const updated = {
    activeMs: previous.activeMs + (result.combatDurationMs ?? 0),
    kills: previous.kills + result.kills,
    damageDealt: previous.damageDealt + (result.damageDealt ?? 0),
    damageTaken: previous.damageTaken + (result.damageTaken ?? 0),
    xp: previous.xp + result.xp,
    gold: previous.gold + result.gold,
    goldSpentPotions: (previous.goldSpentPotions ?? 0) + (result.goldSpentPotions ?? 0),
    soldGold: previous.soldGold + (result.soldGold ?? 0),
    lootValue: previous.lootValue + encounters.reduce((sum, encounter) => sum + encounter.lootValue, 0),
    history: [...previous.history, ...encounters].slice(-100)
  };
  character.huntStatsByZone = { ...character.huntStatsByZone ?? {}, [zoneId]: updated };
}
function createGameStore(runtime = {}) {
  let tickInterval = null;
  const notify = runtime.notify ?? ((message) => {
    if (typeof alert !== "undefined") alert(message);
  });
  const warn = (message) => {
    if (runtime.server) throw Error(message);
    notify(message);
  };
  return (0, import_zustand.create)((set, get) => ({
    character: null,
    races: [],
    currentZoneId: "BOSQUE_LYSS",
    lastTickResult: null,
    isTickRunning: false,
    isTraining: false,
    offlineReport: null,
    deathReport: null,
    healingUntil: null,
    finishIntro: () => {
      const c = get().character;
      if (!c) return;
      set({ character: { ...c, introSeen: true } });
      get().save();
    },
    unlockZone: (id) => {
      const c = get().character;
      if (!c) return { success: false };
      const next = structuredClone(c);
      const result = unlockJourneyZone(next, id);
      if (result.success) {
        set({ character: next });
        get().save();
      }
      return result;
    },
    newGame: (name) => {
      const char = createNewCharacter(name);
      const races = [];
      trackRaceDiscovery(char, races);
      set({ character: char, races, currentZoneId: "BOSQUE_LYSS" });
      get().save();
    },
    loadFromSave: () => {
      const save = loadGame();
      if (!save) return false;
      const timeAway = (Date.now() - save.character.lastTick) / 1e3;
      let report = null;
      if (timeAway > 60 && !isGuided(save.character)) {
        report = { timeAwaySeconds: timeAway, xpGained: Math.floor(timeAway * 10), goldGained: Math.floor(timeAway * 2), itemsDropped: Math.floor(timeAway / 60), levelsGained: 0 };
      }
      const races = save.races || [];
      trackRaceDiscovery(save.character, races);
      set({ character: save.character, races, currentZoneId: save.character.currentZoneId ?? "BOSQUE_LYSS", offlineReport: report });
      get().save();
      return true;
    },
    refreshCompendium: () => {
      const { character, races } = get();
      if (!character) return;
      trackRaceDiscovery(character, races);
      set({ character: { ...character } });
      get().save();
    },
    clearOfflineReport: () => set({ offlineReport: null }),
    clearDeathReport: () => {
      const { character } = get();
      if (character) {
        character.hp = 1;
        set({ character: { ...character }, deathReport: null });
        get().save();
      }
    },
    healFull: () => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.hp = newChar.hpMax;
      newChar.mp = newChar.mpMax;
      set({ character: newChar, healingUntil: null });
      get().save();
    },
    startHealing: () => {
      const { character, healingUntil } = get();
      if (!character || healingUntil) return;
      set({ healingUntil: Date.now() + 15e3 });
    },
    cancelHealing: () => {
      set({ healingUntil: null });
    },
    save: () => {
      const { character, races } = get();
      if (character) {
        if (runtime.persist) runtime.persist(character, races);
        else saveGame(character, races);
      }
    },
    spendStatPoint: (stat) => {
      const { character } = get();
      if (!character || (character.statPoints ?? 0) < 1) return false;
      const updated = {
        ...character,
        statPoints: character.statPoints - 1,
        skills: { ...character.skills, [stat]: character.skills[stat] + 1 }
      };
      recalcStats(updated);
      set({ character: updated });
      get().save();
      return true;
    },
    tick: () => {
      const { character, currentZoneId, isTickRunning, isTraining } = get();
      if (!character || !isTickRunning && !isTraining) return;
      if (isTraining) {
        const newCharacter = JSON.parse(JSON.stringify(character));
        const skill = newCharacter.trainingSkill;
        if (skill) {
          const beforeSeconds = Number(newCharacter.trainingSeconds?.[skill] ?? 0);
          const trainingLog = applyTraining(newCharacter, Date.now());
          trackQuestAction(newCharacter, "TRAIN", Number(newCharacter.trainingSeconds?.[skill] ?? 0) - beforeSeconds);
          recalcStats(newCharacter);
          const result2 = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: trainingLog, enemyHp: 0, enemyMaxHp: 0, skillLevelUp: trainingLog.length ? trainingLog.join(" \xB7 ") : void 0 };
          set({ character: newCharacter, lastTickResult: result2 });
          get().save();
          if (isGuided(newCharacter) && newCharacter.quests.active.TUT_TRAIN && checkQuestCompletion(newCharacter, "TUT_TRAIN")) get().stopTraining();
        }
        return;
      }
      const zone = ZONES[currentZoneId];
      if (!zone || character.level < zone.minLevel) {
        get().stopHunting();
        return;
      }
      if (isGuided(character)) character.lastTick = Date.now() - 3e3;
      const result = processTick(character, zone, !isGuided(character) && Date.now() - character.lastTick > 15e3);
      recordHuntMetrics(character, zone.id, result);
      if (result.death && result.deathData) {
        get().stopHunting();
        set({ deathReport: result.deathData, lastTickResult: result, character: { ...character } });
        get().save();
        return;
      }
      updateQuestProgress(character, result);
      recalcStats(character);
      set({ character: { ...character }, lastTickResult: result });
      get().save();
      if (result.staminaDepleted || isGuided(character) && QUESTS.some((q) => q.category === "TUTORIAL" && character.quests.active[q.id] && checkQuestCompletion(character, q.id))) get().stopHunting();
    },
    startHunting: (zoneId) => {
      const { character, healingUntil } = get();
      if (!character) return;
      if (healingUntil) return warn("Voc\xEA est\xE1 meditando! Termine antes de ca\xE7ar.");
      if (character.hp <= 0) return warn("Voc\xEA precisa se curar na Casa antes de ca\xE7ar!");
      if ((character.staminaOnline ?? 120) <= 0) return warn("Sua stamina online acabou. Continue sua jornada offline para recuperar essa reserva.");
      const zone = ZONES[zoneId];
      if (!zone || !canEnterZone(character, zoneId)) return warn("Abra a travessia com a miss\xE3o e o NPC em Jornadas.");
      if (!canTutorialHunt(character)) return warn("Abra a miss\xE3o da inicia\xE7\xE3o e siga a pr\xF3xima etapa antes de ca\xE7ar.");
      if (character.level < zone.minLevel) return;
      if (tickInterval) clearInterval(tickInterval);
      character.currentZoneId = zoneId;
      character.trainingSkill = null;
      if (!character.activeEnemyId || !zone.enemies.find((e) => e.id === character.activeEnemyId)) {
        character.activeEnemyId = zone.enemies[0].id;
        character.enemyHp = zone.enemies[0].hp * zone.enemies[0].difficulty;
      }
      set({ isTickRunning: true, isTraining: false, currentZoneId: zoneId, character: { ...character } });
      if (!runtime.server) {
        get().tick();
        if (get().isTickRunning || get().isTraining) tickInterval = setInterval(() => get().tick(), 3e3);
      }
    },
    startTraining: (skill) => {
      const { character, healingUntil } = get();
      if (!character) return;
      if (isGuided(character) && !character.quests.active.TUT_TRAIN) return warn("O treino ser\xE1 apresentado na etapa Disciplina antes da for\xE7a.");
      if (healingUntil) return warn("Termine sua medita\xE7\xE3o primeiro!");
      if (tickInterval) clearInterval(tickInterval);
      character.trainingSkill = skill;
      character.trainingLastTick = Date.now();
      character.lastTick = Date.now();
      set({ isTickRunning: false, isTraining: true, character: { ...character } });
      if (!runtime.server) {
        get().tick();
        tickInterval = setInterval(() => get().tick(), 3e3);
      }
    },
    armSpecialCombo: () => {
      const { character, isTickRunning } = get();
      if (!character || !isTickRunning) return { success: false, error: "O combo s\xF3 pode ser armado durante a ca\xE7a." };
      const now = Date.now();
      if ((character.comboCooldownUntil ?? 0) > now) return { success: false, error: `Aguarde ${Math.ceil((character.comboCooldownUntil - now) / 1e3)}s para recarregar.` };
      const updated = JSON.parse(JSON.stringify(character));
      updated.comboReadyUntil = now + 12e3;
      set({ character: updated });
      get().save();
      return { success: true };
    },
    stopHunting: () => {
      if (tickInterval) clearInterval(tickInterval);
      tickInterval = null;
      set({ isTickRunning: false });
    },
    stopTraining: () => {
      if (tickInterval) clearInterval(tickInterval);
      tickInterval = null;
      const { character } = get();
      if (character) {
        character.trainingSkill = null;
        character.trainingLastTick = void 0;
        character.lastTick = Date.now();
        set({ isTraining: false, character: { ...character } });
        get().save();
      }
    },
    setActiveEnemy: (enemyId) => {
      const { character, currentZoneId } = get();
      if (!character) return;
      const zone = ZONES[currentZoneId];
      const enemy = zone.enemies.find((e) => e.id === enemyId);
      if (!enemy || character.level < (enemy.minLevel ?? 1)) return;
      character.activeEnemyId = enemyId;
      character.enemyHp = (enemy?.hp || 0) * (enemy?.difficulty || 1);
      character.enemyHpId = enemyId;
      set({ character: { ...character } });
      get().save();
    },
    setCurrentZone: (zoneId) => {
      if (!ZONES[zoneId] || get().character && !canEnterZone(get().character, zoneId)) return;
      set({ currentZoneId: zoneId });
      const { character } = get();
      if (character) {
        character.currentZoneId = zoneId;
        character.activeEnemyId = ZONES[zoneId].enemies[0]?.id;
        character.enemyHp = void 0;
        character.enemyHpId = void 0;
        set({ character: { ...character } });
        get().save();
      }
    },
    equip: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const result = equipItem(newCharacter, uid);
      if (result.success) {
        set({ character: newCharacter });
        get().save();
      }
      return result;
    },
    unequip: (slot) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const result = unequipItem(newCharacter, slot);
      if (result.success) {
        set({ character: newCharacter });
        get().save();
      }
      return result;
    },
    synthesize: (a, s, p) => {
      const { character, races } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const namedRace = findNamedRace(a, s, p);
      const raceId = namedRace ? namedRace.id : generateRaceId(a, s, p);
      const alreadyExists = races.find((r) => r.id === raceId);
      if (alreadyExists) {
        return { success: false, error: `Voc\xEA j\xE1 descobriu "${alreadyExists.name}"! Escolha uma combina\xE7\xE3o diferente.` };
      }
      const newCharacter = JSON.parse(JSON.stringify(character));
      const hasA = newCharacter.inventory.items.find((i) => i.componentType === "ATAQUE" && i.templateId === a);
      const hasS = newCharacter.inventory.items.find((i) => i.componentType === "SUPORTE" && i.templateId === s);
      const hasP = newCharacter.inventory.items.find((i) => i.componentType === "PASSIVA" && i.templateId === p);
      if (!hasA || !hasS || !hasP) return { success: false, error: "Faltam componentes no invent\xE1rio." };
      removeItem(newCharacter.inventory, hasA.uid, 1);
      removeItem(newCharacter.inventory, hasS.uid, 1);
      removeItem(newCharacter.inventory, hasP.uid, 1);
      let newRace;
      if (namedRace) {
        newRace = { ...namedRace };
      } else {
        newRace = {
          id: raceId,
          name: generateRaceName(a, s, p),
          tier: "COMUM",
          ataqueId: a,
          suporteId: s,
          passivaId: p,
          skills: { ataque: "Ataque Sintetizado", suporte: "Suporte Sintetizado", passiva: "Passiva Sintetizada" },
          bonus: generateRaceBonus(a, s, p)
        };
      }
      const newRaces = [...races, newRace];
      trackRaceDiscovery(newCharacter, newRaces);
      trackQuestAction(newCharacter, "SYNTHESIZE");
      set({ character: newCharacter, races: newRaces });
      get().save();
      return { success: true };
    },
    equipRace: (race) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.raceId = race.id;
      newCharacter.activeRace = race;
      newCharacter.activeDivineBeastId = void 0;
      trackQuestAction(newCharacter, "EQUIP_RACE");
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    unequipRace: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.raceId = void 0;
      newCharacter.activeRace = void 0;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    equipDivineBeast: (id) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      if (!DIVINE_BEASTS[id] || !(character.divineBeasts ?? []).some((beast) => beast.id === id)) {
        return { success: false, error: "Essa Divine Beast ainda n\xE3o foi vinculada." };
      }
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.activeDivineBeastId = id;
      newCharacter.raceId = void 0;
      newCharacter.activeRace = void 0;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
      return { success: true };
    },
    unequipDivineBeast: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      newCharacter.activeDivineBeastId = void 0;
      recalcStats(newCharacter);
      set({ character: newCharacter });
      get().save();
    },
    sellItem: (uid, qty = 1) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = sellItem(newCharacter, uid, qty);
      if (!res.success) return;
      trackQuestAction(newCharacter, "SELL", res.count);
      set({ character: newCharacter });
      get().save();
    },
    salvageAll: (maxRarity) => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = salvageAllEquipment(newChar, maxRarity);
      newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
      updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
      set({ character: newChar });
      get().save();
      notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
    },
    salvageSelected: (uids) => {
      const { character } = get();
      if (!character || uids.length === 0) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = salvageSelectedEquipment(newChar, uids);
      if (!res.items) return;
      newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
      updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
      set({ character: newChar });
      get().save();
      notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
    },
    updateSettings: (settings) => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      if (settings.autoPotion !== void 0) newCharacter.autoPotion = settings.autoPotion;
      if (settings.autoSell !== void 0) newCharacter.autoSell = settings.autoSell;
      if (settings.autoSalvage !== void 0) newCharacter.autoSalvage = settings.autoSalvage;
      if (settings.autoSellTemplateIds !== void 0) {
        newCharacter.autoSellTemplateIds = settings.autoSellTemplateIds;
        newCharacter.autoSalvageTemplateIds = (newCharacter.autoSalvageTemplateIds ?? []).filter((id) => !settings.autoSellTemplateIds.includes(id));
      }
      if (settings.autoSalvageTemplateIds !== void 0) {
        newCharacter.autoSalvageTemplateIds = settings.autoSalvageTemplateIds;
        newCharacter.autoSellTemplateIds = (newCharacter.autoSellTemplateIds ?? []).filter((id) => !settings.autoSalvageTemplateIds.includes(id));
      }
      if (settings.ignoredLootTemplateIds !== void 0) newCharacter.ignoredLootTemplateIds = settings.ignoredLootTemplateIds;
      if (settings.autoHpPotionId !== void 0) newCharacter.autoHpPotionId = settings.autoHpPotionId;
      if (settings.autoHpPotionPercent !== void 0) newCharacter.autoHpPotionPercent = settings.autoHpPotionPercent;
      if (settings.autoHpPotionEnabled !== void 0) newCharacter.autoHpPotionEnabled = settings.autoHpPotionEnabled;
      if (settings.autoMpPotionId !== void 0) newCharacter.autoMpPotionId = settings.autoMpPotionId;
      if (settings.autoMpPotionPercent !== void 0) newCharacter.autoMpPotionPercent = settings.autoMpPotionPercent;
      if (settings.autoMpPotionEnabled !== void 0) newCharacter.autoMpPotionEnabled = settings.autoMpPotionEnabled;
      if (["autoHpPotionId", "autoHpPotionPercent", "autoHpPotionEnabled", "autoMpPotionId", "autoMpPotionPercent", "autoMpPotionEnabled"].some((key) => settings[key] !== void 0)) {
        trackQuestAction(newCharacter, "CONFIGURE_POTIONS");
      }
      set({ character: newCharacter });
      get().save();
    },
    activateBuff: () => {
      const { character } = get();
      if (!character) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      const durationMs = newCharacter.premium ? 30 * 60 * 1e3 : 5 * 60 * 1e3;
      const currentBuff = newCharacter.doubleAtkUntil && newCharacter.doubleAtkUntil > Date.now() ? newCharacter.doubleAtkUntil : Date.now();
      newCharacter.doubleAtkUntil = currentBuff + durationMs;
      set({ character: newCharacter });
      get().save();
    },
    acceptQuest: (id) => {
      const { character, races } = get();
      if (!character) return;
      if (!getAvailableQuests(character).some((q) => q.id === id)) return;
      const newChar = JSON.parse(JSON.stringify(character));
      if (!newChar.quests) newChar.quests = { active: {}, completed: [] };
      if (!newChar.quests.active[id]) {
        newChar.quests.active[id] = { progress: [] };
        trackRaceDiscovery(newChar, races);
        set({ character: newChar });
        get().save();
      }
    },
    claimQuest: (id) => {
      const { character } = get();
      if (!character) return;
      const newChar = JSON.parse(JSON.stringify(character));
      const res = claimQuestReward(newChar, id);
      if (res.success) {
        if (id === "TUT_BACKPACK") {
          newChar.tutorialCompleted = true;
          newChar.tutorialRelicGranted = true;
        }
        trackRaceDiscovery(newChar, get().races);
        set({ character: newChar });
        get().save();
        notify(res.msg);
      }
    },
    recordQuestAction: (action) => {
      const { character } = get();
      if (!character) return;
      const hasPendingTutorialAction = Object.entries(character.quests?.active ?? {}).some(([id, state]) => {
        const quest = QUESTS.find((template) => template.id === id && template.category === "TUTORIAL");
        return quest?.objectives.some((objective, index) => objective.type === action && (state.progress[index] ?? 0) < objective.count);
      });
      if (!hasPendingTutorialAction) return;
      const newCharacter = JSON.parse(JSON.stringify(character));
      trackQuestAction(newCharacter, action);
      set({ character: newCharacter });
      get().save();
    },
    buyTrainingBoost: () => {
      const { character } = get();
      if (!character) return { success: false };
      const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (character.trainingBoostDay === day) return { success: false, error: "J\xE1 adquirido hoje. Reinicia \xE0s 00:00 UTC." };
      if (character.gold < 250) return { success: false, error: "Gold insuficiente (250)." };
      set({ character: { ...character, gold: character.gold - 250, trainingBoostDay: day, trainingBoostUntil: Date.now() + 18e5 } });
      get().save();
      return { success: true };
    },
    useVial: (vial) => {
      const { character } = get();
      if (!character) return;
      if (character.gold < vial.price) return;
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.gold -= vial.price;
      if (!newChar.activeVials) newChar.activeVials = {};
      const now = Date.now();
      const family = vial.id.replace(/_[0-9]+$/, "");
      for (const id of Object.keys(newChar.activeVials)) if (id.replace(/_[0-9]+$/, "") === family) delete newChar.activeVials[id];
      newChar.activeVials[vial.id] = now + vial.durationMinutes * 6e4;
      recalcStats(newChar);
      set({ character: newChar });
      get().save();
      notify(`Voc\xEA bebeu ${vial.name}!`);
    },
    buyBless: () => {
      const { character } = get();
      if (!character) return;
      const price = character.level * 5e3;
      if (character.gold < price) return warn("Ouro insuficiente para comprar Bless.");
      const newChar = JSON.parse(JSON.stringify(character));
      newChar.gold -= price;
      newChar.blesses = Math.min(5, (newChar.blesses || 0) + 1);
      set({ character: newChar });
      get().save();
      notify(`Voc\xEA comprou uma Bless! (${newChar.blesses}/5)`);
    },
    upgradeItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = upgradeItemLevel(newCharacter, uid);
      if (res.success) {
        trackQuestAction(newCharacter, "FORGE");
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    rerollItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = rerollItemAffixes(newCharacter, uid);
      if (res.success) {
        trackQuestAction(newCharacter, "FORGE");
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    depositItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = depositItem(newCharacter, uid);
      if (res.success) {
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    withdrawItem: (uid) => {
      const { character } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = withdrawItem(newCharacter, uid);
      if (res.success) {
        set({ character: newCharacter });
        get().save();
      }
      return res;
    },
    depositMany: (uids) => {
      const { character } = get();
      if (!character) return { success: false, moved: 0, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = depositMany(newCharacter, uids);
      if (res.moved > 0) {
        set({ character: newCharacter });
        get().save();
      }
      return { success: res.moved > 0, moved: res.moved, error: res.error };
    },
    withdrawMany: (uids) => {
      const { character } = get();
      if (!character) return { success: false, moved: 0, error: "Sem personagem" };
      const newCharacter = JSON.parse(JSON.stringify(character));
      const res = withdrawMany(newCharacter, uids);
      if (res.moved > 0) {
        set({ character: newCharacter });
        get().save();
      }
      return { success: res.moved > 0, moved: res.moved, error: res.error };
    },
    claimArenaReward: (teamSize) => {
      const { character, currentZoneId } = get();
      if (!character) return { success: false, error: "Sem personagem" };
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const earnedToday = character.arenaRewardDay === today ? character.arenaRewardsToday ?? 0 : 0;
      if (earnedToday >= 3) return { success: false, error: "Voc\xEA j\xE1 recebeu as 3 recompensas di\xE1rias da Arena." };
      const tier = ZONES[currentZoneId]?.tier ?? 1;
      const gold = (teamSize === 1 ? 30 : teamSize === 3 ? 70 : 130) * tier;
      const newCharacter = {
        ...character,
        gold: character.gold + gold,
        arenaRewardDay: today,
        arenaRewardsToday: earnedToday + 1,
        inventory: { ...character.inventory, items: [...character.inventory.items] }
      };
      let fragment;
      if (teamSize === 3 || teamSize === 5 && character.arenaRareRewardDay !== today) {
        const fragmentId = teamSize === 3 ? "FRAGMENTO_COMUM" : "FRAGMENTO_RARO";
        const template = FRAGMENT_TEMPLATES[fragmentId];
        if (addItem(newCharacter.inventory, { ...template, uid: `arena-${Date.now()}-${Math.random()}`, quantity: 1 })) {
          fragment = fragmentId;
          if (teamSize === 5) newCharacter.arenaRareRewardDay = today;
        }
      }
      set({ character: newCharacter });
      get().save();
      return { success: true, gold, fragment, remaining: 2 - earnedToday };
    }
  }));
}
var useGameStore = createGameStore();

// server/game.ts
function freshWorld(name, id) {
  const character = createNewCharacter(name);
  character.id = id;
  return { character, races: [], isTickRunning: false, isTraining: false, healingUntil: null, deathReport: null, lastTickResult: null, lastAdvanceAt: Date.now(), counters: { forges: 0, syntheses: 0, trades: 0, bosses: 0 } };
}
function executeGame(world, action, args = []) {
  const expectedXp = xpToNextLevel(world.character.level);
  if (world.character.xpToNext !== expectedXp) {
    world.character.xp = Math.floor(world.character.xp / Math.max(1, world.character.xpToNext) * expectedXp);
    world.character.xpToNext = expectedXp;
  }
  world.counters ??= { forges: 0, syntheses: 0, trades: 0, bosses: 0 };
  world.counters.bosses ??= 0;
  const messages = [];
  const store = createGameStore({ server: true, persist: () => {
  }, notify: (m) => messages.push(m) });
  store.setState({ ...world, currentZoneId: world.character.currentZoneId });
  const now = Date.now(), elapsed = now - world.lastAdvanceAt;
  if (world.healingUntil && now >= world.healingUntil) {
    store.getState().healFull();
  }
  if (elapsed >= 3e3 && (world.isTickRunning || world.isTraining)) {
    const steps = elapsed > 15e3 ? 1 : Math.min(5, Math.floor(elapsed / 3e3));
    for (let i = 0; i < steps; i++) {
      store.getState().tick();
      const tick = store.getState().lastTickResult, actor = store.getState().character;
      if (tick?.attacked && (!actor.onlineBalloonUntil || actor.onlineBalloonUntil < now) && Math.random() < 0.15) actor.onlineBalloonUntil = now + 1e4;
      world.counters.bosses = (world.counters.bosses ?? 0) + Object.values(store.getState().lastTickResult?.bossKills ?? {}).reduce((a, b) => a + b, 0);
      if (!store.getState().isTickRunning && !store.getState().isTraining) break;
    }
    world.lastAdvanceAt = elapsed > 15e3 ? now : world.lastAdvanceAt + steps * 3e3;
  }
  let result;
  if (action) {
    const s = store.getState();
    if (s.isTickRunning && ["sellItem", "salvageAll", "salvageSelected", "upgradeItem", "rerollItem"].includes(action)) throw Error("Saia da ca\xE7a para acessar o Ferreiro.");
    if (action === "activateBuff" && (!s.isTickRunning || !s.character?.onlineBalloonUntil || s.character.onlineBalloonUntil < now)) throw Error("Este eco de b\xF4nus expirou. Aguarde outro durante a ca\xE7a.");
    const zero = ["finishIntro", "clearOfflineReport", "clearDeathReport", "startHealing", "cancelHealing", "stopHunting", "stopTraining", "unequipRace", "unequipDivineBeast", "activateBuff", "buyTrainingBoost", "buyBless", "refreshCompendium"];
    const strings = ["unlockZone", "equip", "setActiveEnemy", "setCurrentZone", "acceptQuest", "claimQuest", "upgradeItem", "rerollItem", "depositItem", "withdrawItem"];
    const uid = (v) => {
      if (typeof v !== "string" || v.length < 1 || v.length > 128) throw Error("Identificador inv\xE1lido.");
      return v;
    };
    if (zero.includes(action)) {
      if (args.length) throw Error("Par\xE2metros inesperados.");
      result = s[action]();
    } else if (strings.includes(action)) {
      const id = uid(args[0]);
      if (["upgradeItem", "rerollItem"].includes(action)) {
        const item = s.character.inventory.items.find((i) => i.uid === id);
        if (!item || !["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO"].includes(item.category)) throw Error("Escolha um equipamento v\xE1lido para o Ferreiro.");
      }
      result = s[action](id);
    } else if (action === "startHunting") {
      const zone = uid(args[0]);
      if (!ZONES[zone]) throw Error("Mapa inv\xE1lido.");
      s.startHunting(zone);
      if (store.getState().isTickRunning) {
        store.getState().character.lastTick = now;
        world.lastAdvanceAt = now;
      }
    } else if (action === "startTraining" || action === "spendStatPoint") {
      const skill = uid(args[0]);
      if (!["melee", "magic", "distance", "defense", "soul"].includes(skill)) throw Error("Atributo inv\xE1lido.");
      result = s[action](skill);
      if (action === "startTraining") world.lastAdvanceAt = now;
    } else if (action === "armSpecialCombo") {
      result = s.armSpecialCombo();
      if (!result?.success) throw Error(result?.error ?? "N\xE3o foi poss\xEDvel armar o combo.");
    } else if (action === "unequip") {
      const slots = ["CAPACETE", "ARMADURA", "LUVAS", "CALCAS", "BOTAS", "COLAR", "ANEL_I", "ANEL_II", "PULSEIRA", "ARMA_PRINCIPAL", "OFF_HAND", "MUNICAO", "BACKPACK"];
      if (!slots.includes(String(args[0]))) throw Error("Slot inv\xE1lido.");
      result = s.unequip(args[0]);
    } else if (action === "equipRace") {
      const id = typeof args[0] === "string" ? args[0] : args[0]?.id;
      const race = s.races.find((r) => r.id === id);
      if (!race) throw Error("Matriz n\xE3o descoberta.");
      s.equipRace(race);
    } else if (action === "equipDivineBeast") {
      result = s.equipDivineBeast(uid(args[0]));
    } else if (action === "synthesize") {
      result = s.synthesize(uid(args[0]), uid(args[1]), uid(args[2]));
      if (result?.success) world.counters.syntheses++;
    } else if (action === "useVial") {
      const id = typeof args[0] === "string" ? args[0] : args[0]?.id;
      const vial = typeof id === "string" && Object.hasOwn(VIALS, id) ? VIALS[id] : void 0;
      if (!vial) throw Error("Vial inv\xE1lido.");
      s.useVial(vial);
    } else if (action === "sellItem") {
      const quantity = args[1] ?? 1;
      if (!Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 999) throw Error("Quantidade inv\xE1lida.");
      s.sellItem(uid(args[0]), Number(quantity));
    } else if (["salvageSelected", "depositMany", "withdrawMany"].includes(action)) {
      if (!Array.isArray(args[0]) || args[0].length > 300) throw Error("Sele\xE7\xE3o inv\xE1lida.");
      const ids = [...new Set(args[0].map(uid))];
      result = s[action](ids);
    } else if (action === "salvageAll") {
      if (!["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"].includes(String(args[0]))) throw Error("Raridade inv\xE1lida.");
      s.salvageAll(args[0]);
    } else if (action === "recordQuestAction") {
      const visits = { VISIT_WIKI: "wiki", VISIT_MATRIX: "matriz", VISIT_FORGE: "loja", VISIT_BACKPACK: "backpack", VISIT_CHARACTER: "personagem", VISIT_BEASTS: "pets", VISIT_SHOP: "shop", VISIT_LAB: "laboratorio", VISIT_DEPOT: "depot" };
      const visit = String(args[0]);
      if (!visits[visit] || !canUseTab(s.character, visits[visit])) throw Error("Etapa de tutorial inv\xE1lida.");
      s.recordQuestAction(visit);
    } else if (action === "updateSettings") {
      const value = args[0];
      if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Configura\xE7\xE3o inv\xE1lida.");
      const clean = {};
      for (const [key, v] of Object.entries(value)) {
        if (["autoSell", "autoSalvage"].includes(key)) {
          if (v !== null && !["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"].includes(String(v))) throw Error("Raridade inv\xE1lida.");
          clean[key] = v;
        } else if (["autoSellTemplateIds", "autoSalvageTemplateIds", "ignoredLootTemplateIds"].includes(key)) {
          if (!Array.isArray(v) || v.length > 500 || v.some((id) => typeof id !== "string" || id.length > 128)) throw Error("Itens inv\xE1lidos.");
          clean[key] = v;
        } else if (["autoHpPotionEnabled", "autoMpPotionEnabled"].includes(key)) {
          if (typeof v !== "boolean") throw Error("Configura\xE7\xE3o inv\xE1lida.");
          clean[key] = v;
        } else if (["autoHpPotionPercent", "autoMpPotionPercent"].includes(key)) {
          if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100) throw Error("Limite inv\xE1lido.");
          clean[key] = v;
        } else if (["autoHpPotionId", "autoMpPotionId"].includes(key)) {
          if (v !== null && (typeof v !== "string" || !/^POCAO_(VIDA|MANA)_[1-5]$/.test(v))) throw Error("Po\xE7\xE3o inv\xE1lida.");
          clean[key] = v;
        } else throw Error("Esta configura\xE7\xE3o n\xE3o pode ser alterada.");
      }
      s.updateSettings(clean);
    } else if (action === "healFull") {
      if (!world.healingUntil || now < world.healingUntil) throw Error("Aguarde a medita\xE7\xE3o.");
      s.healFull();
    } else if (action === "claimArenaReward") throw Error("Recompensas da arena local n\xE3o podem ser importadas para a economia online.");
    else throw Error("A\xE7\xE3o n\xE3o permitida.");
    if (action === "activateBuff") store.getState().character.onlineBalloonUntil = void 0;
    if (action === "upgradeItem" && result?.success) world.counters.forges++;
  }
  const state = store.getState();
  const character = state.character;
  recalcStats(character);
  if (!Number.isFinite(character.gold) || character.gold < 0 || character.gold > Number.MAX_SAFE_INTEGER) throw Error("Saldo inv\xE1lido.");
  return { world: { ...world, character, races: state.races, isTickRunning: state.isTickRunning, isTraining: state.isTraining, healingUntil: state.healingUntil, deathReport: state.deathReport, lastTickResult: state.lastTickResult }, result: result ?? null, messages };
}
function rankingMetrics(w) {
  const c = w.character, sum = (values) => values.reduce((s, v) => s + (Number(v) || 0), 0);
  const hunt = Object.values(c.huntStatsByZone ?? {}), stats = c.baseStats;
  return { maxTier: Math.max(1, ...(c.unlockedZoneIds ?? []).map((id) => ZONES[id]?.tier ?? 1)), atk: stats.atk ?? 0, matk: stats.matk ?? 0, armor: stats.arm ?? 0, hp: c.hpMax, mp: c.mpMax, crit: Math.round((stats.crit ?? 0) * 1e4) / 100, resPhysical: Math.round((stats.resFisico ?? 0) * 1e4) / 100, resMagic: Math.round((stats.resMagico ?? 0) * 1e4) / 100, mastery: sum(Object.values(c.trainingMastery ?? {})), earnedXp: sum(hunt.map((h) => h.xp)), earnedGold: sum(hunt.map((h) => h.gold)), damageDealt: sum(hunt.map((h) => h.damageDealt)), damageTaken: sum(hunt.map((h) => h.damageTaken)), huntTime: Math.floor(sum(hunt.map((h) => h.activeMs)) / 1e3), lootValue: sum(hunt.map((h) => h.lootValue)), level: c.level, map: (c.unlockedZoneIds ?? ["BOSQUE_LYSS"]).length, discoveries: w.races.length, named: w.races.filter((r) => r.tier === "NOMEADA").length, syntheses: w.counters.syntheses, kills: c.totalKills ?? 0, bosses: w.counters.bosses ?? 0, gold: Math.floor(c.gold), training: sum(Object.values(c.trainingSeconds ?? {})), melee: c.skills.melee, distance: c.skills.distance, magic: c.skills.magic, defense: c.skills.defense, soul: c.skills.soul, quests: c.quests.completed.length, beasts: c.divineBeasts?.length ?? 0, cards: c.cards.length, salvaged: c.totalSalvaged ?? 0, forges: w.counters.forges, trades: w.counters.trades };
}

// server/transfers.ts
var import_node_crypto = require("node:crypto");

// src/online/rules.ts
var ONLINE_RULES = { maxCharacters: 3, maxText: 500, messageCooldownMs: 1500, maxMailItems: 10, maxTradeItems: 10, minTransferLevel: 5, tradeExpiryMs: 30 * 60 * 1e3, baseFee: 10, goldFeeRate: 0.02 };
function transferFee(gold) {
  return ONLINE_RULES.baseFee + Math.ceil(gold * ONLINE_RULES.goldFeeRate);
}
var RANKING_METRICS = [
  ["level", "N\xEDvel"],
  ["map", "Biomas liberados"],
  ["discoveries", "Descobertas"],
  ["named", "Matrizes lend\xE1rias"],
  ["syntheses", "S\xEDnteses"],
  ["kills", "Criaturas derrotadas"],
  ["bosses", "Chefes derrotados"],
  ["gold", "Gold dispon\xEDvel"],
  ["training", "Tempo de treino (s)"],
  ["melee", "Treino corpo a corpo"],
  ["distance", "Treino \xE0 dist\xE2ncia"],
  ["magic", "Treino m\xE1gico"],
  ["defense", "Treino de defesa"],
  ["soul", "Treino da alma"],
  ["quests", "Miss\xF5es conclu\xEDdas"],
  ["beasts", "Divine Beasts"],
  ["cards", "Cartas"],
  ["salvaged", "Itens desmontados"],
  ["forges", "Aprimoramentos"],
  ["trades", "Trocas conclu\xEDdas"],
  ["maxTier", "Maior Tier liberado"],
  ["atk", "Ataque f\xEDsico"],
  ["matk", "Ataque m\xE1gico"],
  ["armor", "Armadura"],
  ["hp", "Vida m\xE1xima"],
  ["mp", "Mana m\xE1xima"],
  ["crit", "Cr\xEDtico (%)"],
  ["resPhysical", "Resist\xEAncia f\xEDsica (%)"],
  ["resMagic", "Resist\xEAncia m\xE1gica (%)"],
  ["mastery", "Maestria de treino"],
  ["earnedXp", "XP ganho em ca\xE7a"],
  ["earnedGold", "Gold ganho em ca\xE7a"],
  ["damageDealt", "Dano causado"],
  ["damageTaken", "Dano recebido"],
  ["huntTime", "Tempo de ca\xE7a (s)"],
  ["lootValue", "Valor dos drops"]
];

// server/transfers.ts
var emptyOffer = () => ({ gold: 0, items: [], fee: 0 });
function integer(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min || value > max) throw Error("Quantidade ou valor inv\xE1lido.");
  return value;
}
function canTransfer(c) {
  if (c.level < ONLINE_RULES.minTransferLevel || !c.tutorialCompleted) throw Error("Conclua a inicia\xE7\xE3o e alcance o n\xEDvel " + ONLINE_RULES.minTransferLevel + " para transferir gold e itens.");
}
function restoreOffer(c, offer) {
  c.gold += offer.gold + offer.fee;
  c.depot.push(...offer.items.map((i) => ({ ...i })));
}
function reserveOffer(c, value) {
  if (!value || typeof value !== "object") throw Error("Oferta inv\xE1lida.");
  const raw = value;
  const gold = integer(raw.gold ?? 0);
  const selection = raw.items ?? [];
  if (!Array.isArray(selection) || selection.length > ONLINE_RULES.maxTradeItems) throw Error("Selecione at\xE9 dez itens.");
  const ids = /* @__PURE__ */ new Set();
  const items = [];
  for (const part of selection) {
    if (typeof part.uid !== "string" || ids.has(part.uid)) throw Error("Item repetido ou inv\xE1lido.");
    ids.add(part.uid);
    const qty = integer(part.quantity, 1, 999);
    const source = c.inventory.items.find((i) => i.uid === part.uid) ?? c.depot.find((i) => i.uid === part.uid);
    if (!source || qty > source.quantity || !source.stackable && qty !== 1) throw Error("Item indispon\xEDvel ou quantidade insuficiente.");
    if (source.templateId === "UNICO_SIGILO_INICIACAO") throw Error("A rel\xEDquia de inicia\xE7\xE3o \xE9 vinculada ao personagem.");
    items.push({ ...structuredClone(source), uid: (0, import_node_crypto.randomUUID)(), quantity: qty });
  }
  const fee = transferFee(gold);
  if (c.gold < gold + fee) throw Error("Gold insuficiente para a oferta e a taxa.");
  c.gold -= gold + fee;
  for (const part of selection) {
    for (const location2 of [c.inventory.items, c.depot]) {
      const idx = location2.findIndex((i) => i.uid === part.uid);
      if (idx < 0) continue;
      if (location2[idx].quantity === part.quantity) location2.splice(idx, 1);
      else location2[idx].quantity -= part.quantity;
      break;
    }
  }
  return { gold, items, fee };
}
function receiveOffer(c, offer) {
  if (c.depot.length + offer.items.length > c.depotMax) throw Error("Libere espa\xE7o no dep\xF3sito antes de receber os anexos ou concluir a troca.");
  c.gold += offer.gold;
  c.depot.push(...offer.items.map((i) => ({ ...i, uid: (0, import_node_crypto.randomUUID)() })));
}

// server/world.ts
var uuid = (id) => {
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw Error("Identificador inv\xE1lido.");
  return id;
};
var text = (v, max) => {
  if (typeof v !== "string" || v.includes("\0") || !v.trim() || v.trim().length > max) throw Error("Texto inv\xE1lido ou muito longo.");
  return v.trim();
};
async function commitCharacter(db, c) {
  if (!Number.isSafeInteger(c.state.character.gold) || c.state.character.gold < 0) throw Error("Saldo fora dos limites.");
  await db.query("update public.world_characters set state=$2,revision=revision+1,updated_at=now() where id=$1", [c.id, JSON.stringify(c.state)]);
  await db.query("insert into public.world_rankings(character_id,name,metrics,current_map) values($1,$2,$3,$4) on conflict(character_id) do update set metrics=excluded.metrics,name=excluded.name,current_map=excluded.current_map,updated_at=now()", [c.id, c.name, JSON.stringify(rankingMetrics(c.state)), c.state.character.currentZoneId]);
}
async function own(db, owner, id) {
  const r = await db.query("select * from public.world_characters where id=$1 and owner_id=$2 for update", [uuid(id), owner]);
  if (!r.rows[0]) throw Error("Personagem n\xE3o pertence a esta conta.");
  return r.rows[0];
}
async function byName(db, name) {
  const r = await db.query("select id,name,owner_id,online_at from public.world_characters where lower(name)=lower($1)", [text(name, 24)]);
  if (!r.rows[0]) throw Error("Personagem n\xE3o encontrado.");
  return r.rows[0];
}
async function handleWorld(db, owner, request) {
  uuid(owner);
  const op = request.operation, p = request.payload ?? {};
  if (typeof op !== "string") throw Error("Opera\xE7\xE3o inv\xE1lida.");
  await db.query("insert into public.world_accounts(id) values($1) on conflict do nothing", [owner]);
  await db.query("select id from public.world_accounts where id=$1 for update", [owner]);
  const readonly = ["characters", "world.read", "social.read", "ranking"];
  let cached = null;
  if (!readonly.includes(op)) {
    const requestId = uuid(request.requestId);
    const prev = await db.query("select response from public.world_operations where owner_id=$1 and request_id=$2", [owner, requestId]);
    cached = prev.rows[0]?.response;
  }
  let receipt = cached ?? {}, actor;
  if (!cached) {
    if (op === "characters") {
    } else if (op === "character.create") {
      const count = await db.query("select count(*)::int as count from public.world_characters where owner_id=$1", [owner]);
      if (count.rows[0].count >= ONLINE_RULES.maxCharacters) throw Error("Limite de tr\xEAs personagens por conta.");
      const name = text(p.name, 24).normalize("NFKC");
      if (!/^[\p{L}\p{N}][\p{L}\p{N} _-]{2,23}$/u.test(name)) throw Error("Use 3\u201324 letras, n\xFAmeros, espa\xE7os ou h\xEDfen.");
      const id2 = (0, import_node_crypto2.randomUUID)(), state = freshWorld(name, id2);
      await db.query("insert into public.world_characters(id,owner_id,name,state) values($1,$2,$3,$4)", [id2, owner, name, JSON.stringify(state)]);
      actor = { id: id2, owner_id: owner, name, state, revision: 0 };
      await commitCharacter(db, actor);
      receipt = { createdId: id2 };
    } else if (op === "ranking") {
      const metric = String(p.metric ?? "level");
      if (!RANKING_METRICS.some((m) => m[0] === metric)) throw Error("Ranking inv\xE1lido.");
      const page = integer(p.page ?? 0, 0, 1e3);
      const ranks = await db.query("select character_id,name,current_map,metrics,row_number() over(order by (metrics->>$1)::numeric desc,character_id) as position from public.world_rankings order by (metrics->>$1)::numeric desc,character_id limit 50 offset $2", [metric, page * 50]);
      receipt = { ranking: ranks.rows, page, metric };
    } else if (op.startsWith("trade.")) {
      if (op === "trade.invite") {
        const target = await byName(db, p.target);
        const pair = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[uuid(request.characterId), target.id]]);
        actor = pair.rows.find((r) => r.id === request.characterId && r.owner_id === owner);
        if (!actor) throw Error("Personagem inv\xE1lido.");
        canTransfer(actor.state.character);
        if (Date.now() - new Date(target.online_at).getTime() > 9e4) throw Error("O jogador precisa estar online para receber o convite de troca.");
        if (target.owner_id === owner) throw Error("Escolha um jogador de outra conta.");
        const busy = await db.query("select id from public.world_trades where (a_id=any($1::uuid[]) or b_id=any($1::uuid[])) and status in ('invited','open')", [[actor.id, target.id]]);
        if (busy.rows.length) throw Error("Um dos jogadores j\xE1 tem uma troca em andamento.");
        const id2 = (0, import_node_crypto2.randomUUID)();
        await db.query("insert into public.world_trades(id,a_id,b_id,a_owner,b_owner,expires_at) values($1,$2,$3,$4,$5,$6)", [id2, actor.id, target.id, owner, target.owner_id, new Date(Date.now() + ONLINE_RULES.tradeExpiryMs)]);
        receipt = { tradeId: id2 };
      } else {
        const preview = await db.query("select * from public.world_trades where id=$1", [uuid(p.tradeId)]);
        if (!preview.rows[0]) throw Error("Troca n\xE3o encontrada.");
        const t0 = preview.rows[0];
        if (t0.a_owner !== owner && t0.b_owner !== owner) throw Error("Voc\xEA n\xE3o participa desta troca.");
        const rows = await db.query("select * from public.world_characters where id=any($1::uuid[]) order by id for update", [[t0.a_id, t0.b_id]]);
        const a = rows.rows.find((r) => r.id === t0.a_id), b = rows.rows.find((r) => r.id === t0.b_id);
        const t = (await db.query("select * from public.world_trades where id=$1 for update", [t0.id])).rows[0];
        const isA = t.a_owner === owner, me = isA ? a : b;
        actor = me;
        let offerA = t.offer_a, offerB = t.offer_b, readyA = t.ready_a, readyB = t.ready_b;
        if (request.characterId !== me.id) throw Error("Use o personagem que participa da troca.");
        if (["completed", "cancelled", "expired"].includes(t.status)) {
          receipt = { tradeId: t.id, status: t.status };
        } else if (new Date(t.expires_at).getTime() <= Date.now() || op === "trade.cancel") {
          restoreOffer(a.state.character, offerA);
          restoreOffer(b.state.character, offerB);
          const status = op === "trade.cancel" ? "cancelled" : "expired";
          await db.query("update public.world_trades set status=$2,offer_a=$3,offer_b=$3,ready_a=false,ready_b=false,revision=revision+1 where id=$1", [t.id, status, JSON.stringify(emptyOffer())]);
          await commitCharacter(db, a);
          await commitCharacter(db, b);
          receipt = { tradeId: t.id, status };
        } else if (op === "trade.accept") {
          if (isA || t.status !== "invited") throw Error("Convite n\xE3o dispon\xEDvel.");
          canTransfer(b.state.character);
          await db.query("update public.world_trades set status='open',revision=revision+1 where id=$1", [t.id]);
          receipt = { tradeId: t.id };
        } else if (op === "trade.offer" || op === "trade.confirm") {
          if (t.status !== "open") throw Error("Aguarde aceitar o convite.");
          canTransfer(me.state.character);
          if (integer(p.revision) !== Number(t.revision)) throw Error("A oferta mudou. Confira os dois lados novamente.");
          if (op === "trade.offer") {
            restoreOffer(me.state.character, isA ? offerA : offerB);
            const offer = reserveOffer(me.state.character, p.offer);
            if (isA) offerA = offer;
            else offerB = offer;
            readyA = false;
            readyB = false;
            await commitCharacter(db, me);
          } else {
            if (isA) {
              if (!offerA.fee) offerA = reserveOffer(a.state.character, { gold: 0, items: [] });
              readyA = true;
            } else {
              if (!offerB.fee) offerB = reserveOffer(b.state.character, { gold: 0, items: [] });
              readyB = true;
            }
            await commitCharacter(db, me);
          }
          if (readyA && readyB) {
            receiveOffer(a.state.character, offerB);
            receiveOffer(b.state.character, offerA);
            a.state.counters.trades++;
            b.state.counters.trades++;
            await commitCharacter(db, a);
            await commitCharacter(db, b);
            await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,items) values($1,$2,$3,$4,$5,$6,$7,$8)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "trade", a.id, b.id, offerA.gold + offerB.gold, offerA.fee + offerB.fee, JSON.stringify({ a: offerA.items, b: offerB.items })]);
            await db.query("update public.world_trades set status='completed',ready_a=true,ready_b=true,revision=revision+1 where id=$1", [t.id]);
            receipt = { tradeId: t.id, status: "completed" };
          } else {
            await db.query("update public.world_trades set offer_a=$2,offer_b=$3,ready_a=$4,ready_b=$5,revision=revision+1 where id=$1", [t.id, JSON.stringify(offerA), JSON.stringify(offerB), readyA, readyB]);
            receipt = { tradeId: t.id };
          }
        } else throw Error("A\xE7\xE3o de troca inv\xE1lida.");
      }
    } else {
      actor = await own(db, owner, request.characterId);
      if (op === "world.read" || op === "world.command") {
        if (op === "world.command" && (typeof p.action !== "string" || !Array.isArray(p.args) || p.args.length > 3)) throw Error("Comando inv\xE1lido.");
        const executed = executeGame(actor.state, op === "world.command" ? p.action : void 0, p.args ?? []);
        actor.state = executed.world;
        receipt = { result: executed.result, messages: executed.messages };
        await commitCharacter(db, actor);
        await db.query("update public.world_characters set online_at=now() where id=$1", [actor.id]);
      } else if (op === "message.send") {
        const account = (await db.query("select muted_until from public.world_accounts where id=$1", [owner])).rows[0];
        if (account.muted_until && new Date(account.muted_until) > /* @__PURE__ */ new Date()) throw Error("Chat temporariamente restrito.");
        const recent = await db.query("select created_at from public.world_messages where sender_owner=$1 order by created_at desc limit 1", [owner]);
        if (recent.rows[0] && Date.now() - new Date(recent.rows[0].created_at).getTime() < ONLINE_RULES.messageCooldownMs) throw Error("Aguarde um instante antes da pr\xF3xima mensagem.");
        const body = text(p.body, 500), target = p.target ? await byName(db, p.target) : null;
        await db.query("insert into public.world_messages(id,sender_id,sender_owner,sender_name,recipient_id,recipient_owner,body) values($1,$2,$3,$4,$5,$6,$7)", [(0, import_node_crypto2.randomUUID)(), actor.id, owner, actor.name, target?.id ?? null, target?.owner_id ?? null, body]);
      } else if (op === "friend.invite") {
        const target = await byName(db, p.target);
        if (target.id === actor.id) throw Error("Escolha outro personagem.");
        await db.query("insert into public.world_friends(id,inviter_id,invitee_id,inviter_owner,invitee_owner) values($1,$2,$3,$4,$5) on conflict do nothing", [(0, import_node_crypto2.randomUUID)(), actor.id, target.id, owner, target.owner_id]);
      } else if (op === "friend.accept" || op === "friend.remove") {
        const row = (await db.query("select * from public.world_friends where id=$1 for update", [uuid(p.id)])).rows[0];
        if (!row || ![row.inviter_id, row.invitee_id].includes(actor.id)) throw Error("Convite n\xE3o encontrado.");
        if (op === "friend.accept") {
          if (row.invitee_id !== actor.id) throw Error("Somente o destinat\xE1rio pode aceitar.");
          await db.query("update public.world_friends set status='accepted' where id=$1", [row.id]);
        } else await db.query("delete from public.world_friends where id=$1", [row.id]);
      } else if (op === "mail.send") {
        canTransfer(actor.state.character);
        if (typeof p.body === "string" && p.body.includes("\0")) throw Error("Mensagem inv\xE1lida.");
        const target = await byName(db, p.target);
        if (target.id === actor.id) throw Error("Escolha outro personagem.");
        const offer = reserveOffer(actor.state.character, p.offer);
        const id2 = (0, import_node_crypto2.randomUUID)();
        await db.query("insert into public.world_mail(id,sender_id,recipient_id,sender_owner,recipient_owner,sender_name,subject,body,gold,items,fee) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [id2, actor.id, target.id, owner, target.owner_id, actor.name, text(p.subject, 80), typeof p.body === "string" ? p.body.slice(0, 1e3) : "", offer.gold, JSON.stringify(offer.items), offer.fee]);
        await commitCharacter(db, actor);
        receipt = { mailId: id2 };
        await db.query("insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,items) values($1,$2,$3,$4,$5,$6,$7,$8)", [(0, import_node_crypto2.randomUUID)(), request.requestId, "mail.send", actor.id, target.id, offer.gold, offer.fee, JSON.stringify(offer.items)]);
      } else if (op === "mail.claim") {
        const mail = (await db.query("select * from public.world_mail where id=$1 and recipient_id=$2 for update", [uuid(p.id), actor.id])).rows[0];
        if (!mail) throw Error("Correio n\xE3o encontrado.");
        if (mail.claimed_at) throw Error("Este correio j\xE1 foi recebido.");
        receiveOffer(actor.state.character, { gold: Number(mail.gold), items: mail.items, fee: 0 });
        await db.query("update public.world_mail set claimed_at=now() where id=$1", [mail.id]);
        await commitCharacter(db, actor);
      } else if (op !== "social.read") throw Error("Opera\xE7\xE3o n\xE3o permitida.");
    }
    if (!readonly.includes(op)) await db.query("insert into public.world_operations(owner_id,request_id,response) values($1,$2,$3)", [owner, request.requestId, JSON.stringify(receipt)]);
  }
  const list = (await db.query("select id,name,revision,created_at from public.world_characters where owner_id=$1 order by created_at", [owner])).rows;
  const id = actor?.id ?? request.characterId;
  let current = null;
  if (id) {
    const row = (await db.query("select id,name,state,revision from public.world_characters where id=$1 and owner_id=$2", [uuid(id), owner])).rows[0];
    if (!row) throw Error("Personagem n\xE3o encontrado.");
    current = row;
  }
  let social = void 0;
  if (op === "social.read") {
    if (!current) throw Error("Selecione um personagem.");
    const friends = (await db.query("select f.*,a.name as inviter_name,b.name as invitee_name,a.online_at as inviter_online_at,b.online_at as invitee_online_at from public.world_friends f join public.world_characters a on a.id=f.inviter_id join public.world_characters b on b.id=f.invitee_id where f.inviter_id=$1 or f.invitee_id=$1 order by f.created_at desc", [id])).rows;
    const globalMessages = (await db.query("select id,sender_id,sender_name,recipient_id,body,created_at from public.world_messages where recipient_id is null order by created_at desc limit 50")).rows;
    const privateMessages = (await db.query("select m.id,m.sender_id,m.sender_name,m.recipient_id,r.name as recipient_name,m.body,m.created_at from public.world_messages m left join public.world_characters r on r.id=m.recipient_id where m.recipient_id is not null and (m.sender_id=$1 or m.recipient_id=$1) order by m.created_at desc limit 100", [id])).rows;
    const messages = [...globalMessages, ...privateMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const mail = (await db.query("select m.*,r.name as recipient_name from public.world_mail m join public.world_characters r on r.id=m.recipient_id where m.sender_id=$1 or m.recipient_id=$1 order by (m.recipient_id=$1 and m.claimed_at is null) desc,case when m.recipient_id=$1 and m.claimed_at is null then m.created_at end asc,m.created_at desc limit 100", [id])).rows;
    const trades = (await db.query("select t.*,a.name as a_name,b.name as b_name from public.world_trades t join public.world_characters a on a.id=t.a_id join public.world_characters b on b.id=t.b_id where t.a_id=$1 or t.b_id=$1 order by t.created_at desc limit 20", [id])).rows;
    const online = (await db.query("select id,name from public.world_characters where online_at>now()-interval '90 seconds' order by name limit 200")).rows;
    const onlineTotal = Number((await db.query("select count(*)::int as count from public.world_characters where online_at>now()-interval '90 seconds'")).rows[0].count);
    social = { friends, messages, mail, trades, online, onlineTotal };
  }
  return { ok: true, ...receipt, characters: list, current, social };
}

// server/http.ts
var pool;
var config = { maxDuration: 60 };
async function handler(req, res) {
  const allowed = (process.env.WORLD_ALLOWED_ORIGINS ?? "https://mythreon-online.vercel.app,mythreon://game,http://localhost:5173,http://127.0.0.1:5173").split(",").map((x) => x.trim());
  const origin = req.headers.origin;
  if (origin && !allowed.includes(origin)) {
    res.statusCode = 403;
    return res.end(JSON.stringify({ error: "Origem n\xE3o autorizada." }));
  }
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "M\xE9todo n\xE3o permitido." }));
  }
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || !process.env.DATABASE_URL) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "O mundo online ainda n\xE3o foi configurado." }));
  }
  let client;
  try {
    const token = String(req.headers.authorization ?? "");
    if (!token.startsWith("Bearer ") || token.length > 1e4) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Entre na sua conta." }));
    }
    const auth = await fetch(url.replace(/\/$/, "") + "/auth/v1/user", { headers: { apikey: key, Authorization: token }, signal: AbortSignal.timeout(8e3) });
    if (!auth.ok) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Sess\xE3o expirada. Entre novamente." }));
    }
    const user = await auth.json();
    if (!user.id || !user.email_confirmed_at) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "Confirme seu e-mail antes de entrar no mundo online." }));
    }
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || JSON.stringify(body).length > 128e3) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Solicita\xE7\xE3o inv\xE1lida." }));
    }
    const sslCa = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n").trim();
    pool ??= new import_pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true, ...sslCa ? { ca: sslCa } : {} }, max: 3, idleTimeoutMillis: 1e4, connectionTimeoutMillis: 8e3 });
    client = await pool.connect();
    await client.query("begin");
    await client.query("set local statement_timeout='15s'");
    const result = await handleWorld(client, user.id, body);
    await client.query("commit");
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (error) {
    if (client) await client.query("rollback").catch(() => {
    });
    const code = String(error?.code ?? "");
    const message = code === "23505" ? "Este nome de personagem j\xE1 est\xE1 em uso." : code === "28P01" || code === "28000" ? "A senha do banco recusou a conex\xE3o. Atualize DATABASE_URL com a senha atual do Supabase." : code === "ENOTFOUND" || code === "EAI_AGAIN" ? "O host do banco n\xE3o foi encontrado. Use a URL Transaction pooler do Supabase." : code === "ECONNREFUSED" || code === "ETIMEDOUT" ? "O banco recusou a conex\xE3o. Confira a URL Transaction pooler e a porta 6543." : code === "SELF_SIGNED_CERT_IN_CHAIN" ? "O certificado CA do Supabase n\xE3o foi aceito. Recole o arquivo .crt inteiro em DATABASE_SSL_CA, incluindo BEGIN/END CERTIFICATE." : code === "42P01" ? "As tabelas online ainda n\xE3o foram aplicadas neste banco." : code === "23502" ? "O banco est\xE1 com uma migra\xE7\xE3o incompleta. Reaplique as migra\xE7\xF5es online." : code === "22P02" ? "A solicita\xE7\xE3o cont\xE9m um identificador inv\xE1lido. Atualize a p\xE1gina e tente novamente." : code ? "N\xE3o foi poss\xEDvel concluir. Confira a configura\xE7\xE3o do banco online." : error instanceof Error ? error.message : "N\xE3o foi poss\xEDvel concluir.";
    console.error("world request failed", { code, message: error?.message, hasCa: Boolean(process.env.DATABASE_SSL_CA), caLength: process.env.DATABASE_SSL_CA?.length ?? 0 });
    res.statusCode = code ? 500 : 400;
    res.end(JSON.stringify({ error: message }));
  } finally {
    client?.release();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
