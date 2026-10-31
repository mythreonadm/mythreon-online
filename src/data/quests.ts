import { QuestTemplate } from "../types";

const kill = (target: string, count: number, name: string) => ({ type: "KILL" as const, target, count, description: `Derrote ${count} ${name}` });
const boss = (target: string, name: string) => ({ type: "KILL_BOSS" as const, target, count: 1, description: `Derrote o chefe ${name}` });
const collect = (target: string, count: number, name: string) => ({ type: "COLLECT" as const, target, count, description: `Obtenha ${count}x ${name}` });
const discoverTotal = (count: number) => ({ type: "DISCOVER_TOTAL" as const, count, description: `Descubra ${count} raças na Matriz` });
const discoverNamed = (count: number) => ({ type: "DISCOVER_NAMED" as const, count, description: `Descubra ${count} raças lendárias` });

export const QUESTS: QuestTemplate[] = [
  // ═══════════════════════════════════════════════════════════════
  // COMPÊNDIO — MILESTONES DE DESCOBERTA (Auto-aceitas)
  // ═══════════════════════════════════════════════════════════════
  { id: "COMP_T10", name: "Colecionador Iniciante", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1,
    description: "A Matriz espera por você. Descubra 10 raças diferentes.",
    objectives: [discoverTotal(10)], rewards: { gold: 1300, xp: 1000 } },

  { id: "COMP_T25", name: "Explorador da Matriz", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T10"],
    description: "O caminho do Arquivista é longo. Descubra 25 raças.",
    objectives: [discoverTotal(25)], rewards: { gold: 5550, xp: 5000 } },

  { id: "COMP_T50", name: "Arquivista Dedicado", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T25"],
    description: "Metade do caminho para a maestria. Descubra 50 raças.",
    objectives: [discoverTotal(50)], rewards: { gold: 25000, xp: 25000, items: [{ templateId: "FRAGMENTO_RARO", quantity: 50 }] } },

  { id: "COMP_T100", name: "Mestre da Matriz", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T50"],
    description: "Você domina a arte da síntese. Descubra 100 raças.",
    objectives: [discoverTotal(100)], rewards: { gold: 100000, xp: 100000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 25 }] } },

  { id: "COMP_T200", name: "O Caminho Infinito", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T100"],
    description: "Nenhum limite te detém. Descubra 200 raças.",
    objectives: [discoverTotal(200)], rewards: { gold: 500000, xp: 500000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] } },

  // ─── NOMEADAS (LENDÁRIAS) ───
  { id: "COMP_N1", name: "Primeira Lenda", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1,
    description: "Descubra sua primeira raça nomeada. Cada uma guarda um fragmento da história de Mythreon.",
    objectives: [discoverNamed(1)], rewards: { gold: 3100, xp: 2000 } },

  { id: "COMP_N5", name: "Caçador de Lendas", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N1"],
    description: "Cinco nomes lendários em sua coleção. Continue.",
    objectives: [discoverNamed(5)], rewards: { gold: 15000, xp: 15000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 10 }] } },

  { id: "COMP_N10", name: "Guardião das Histórias", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N5"],
    description: "Dez raças nomeadas descobertas. Você está entre os grandes Arquivistas.",
    objectives: [discoverNamed(10)], rewards: { gold: 75000, xp: 75000, items: [{ templateId: "FRAGMENTO_RARO", quantity: 25 }] } },

  { id: "COMP_N20", name: "Voz das Consciências", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N10"],
    description: "Vinte lendas em sua coleção. Poucos chegam tão longe.",
    objectives: [discoverNamed(20)], rewards: { gold: 300000, xp: 300000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 50 }] } },

  { id: "COMP_N33", name: "O Último Arquivista", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N20"],
    description: "Todas as 33 raças nomeadas descobertas. Você é a lenda viva de Mythreon.",
    objectives: [discoverNamed(33)], rewards: { gold: 1500000, xp: 1000000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 100 }] } },

  // ═══════════════════════════════════════════════════════════════
  // TUTORIAL / ONBOARDING
  // ═══════════════════════════════════════════════════════════════
  { id: "TUT_WIKI", name: "O Arquivo de Mythreon", giver: "Arquivista Sinax", category: "TUTORIAL", minLevel: 1,
    description: "Antes de partir, consulte a Wiki para conhecer o mundo e os caminhos de evolução.",
    objectives: [{ type: "VISIT_WIKI", count: 1, description: "Visite o Arquivo / Wiki" }], rewards: { gold: 100, xp: 100 } },
  { id: "TUT_1", name: "O Primeiro Passo", giver: "Guardiã Mirelle", category: "TUTORIAL", zoneId: "BOSQUE_LYSS", minLevel: 1, requires: ["TUT_WIKI"],
    description: "Bem-vindo a Mythreon. Derrote 10 Lobos-Ferais para testar suas forças.",
    objectives: [kill("LOBO", 10, "Lobos")], rewards: { gold: 190, xp: 200 } },
  { id: "TUT_MATRIX", name: "Uma Matriz, Muitas Possibilidades", giver: "Arquivista Sinax", category: "TUTORIAL", minLevel: 1, requires: ["TUT_1"],
    description: "Conheça a Matriz e descubra como combinar componentes para criar uma raça única.",
    objectives: [{ type: "VISIT_MATRIX", count: 1, description: "Visite a aba Matriz" }], rewards: { gold: 150, xp: 150 } },
  { id: "TUT_POTIONS", name: "Preparar os Elixires", giver: "Herbalista Tomé", category: "TUTORIAL", minLevel: 1, requires: ["TUT_MATRIX"],
    description: "Na tela de caça, escolha uma poção e ajuste o limite automático. Ativar o consumo é opcional e cada uso custa gold.",
    objectives: [{ type: "CONFIGURE_POTIONS", count: 1, description: "Configure uma poção de HP ou MP" }], rewards: { gold: 150, xp: 200 } },
  { id: "TUT_2", name: "A Forja da Alma", giver: "Guardiã Mirelle", category: "TUTORIAL", minLevel: 1, requires: ["TUT_POTIONS"],
    description: "Combine um Ataque, um Suporte e uma Passiva na Matriz; depois equipe a raça criada para concluir sua iniciação.",
    objectives: [{ type: "SYNTHESIZE", count: 1, description: "Crie uma raça na Matriz" }, { type: "EQUIP_RACE", count: 1, description: "Equipe a raça criada" }], rewards: { gold: 300, xp: 500 } },
  { id: "TUT_3", name: "Ciclo de Renovação", giver: "Herbalista Tomé", category: "TUTORIAL", zoneId: "BOSQUE_LYSS", minLevel: 2, requires: ["TUT_2"],
    description: "Derrote criaturas para ganhar ouro e encontrar equipamentos. Guarde pelo menos um equipamento de drop para conhecer o Ferreiro.",
    objectives: [kill("ANY", 20, "criaturas"), { type: "EARN_GOLD", count: 300, description: "Ganhe 300 de Ouro" }], rewards: { gold: 500, xp: 800 } },
  { id: "TUT_FORGE_VISIT", name: "Conheça o Ferreiro", giver: "Ferreiro Bolk", category: "TUTORIAL", minLevel: 3, requires: ["TUT_3"],
    description: "O Ferreiro transforma drops em poder e Fragmentos. Visite a oficina para aprender os serviços disponíveis.",
    objectives: [{ type: "VISIT_FORGE", count: 1, description: "Visite o Ferreiro" }], rewards: { gold: 200, xp: 250 } },
  { id: "TUT_4", name: "Limpeza de Inventário", giver: "Ferreiro Bolk", category: "TUTORIAL", minLevel: 3, requires: ["TUT_FORGE_VISIT"],
    description: "Escolha cinco equipamentos indesejados no Ferreiro e transforme-os em Fragmentos. Reserve pelo menos um equipamento de drop para aprimorar na próxima etapa.",
    objectives: [{ type: "SALVAGE", count: 5, description: "Desmanche 5 equipamentos" }], rewards: { gold: 1500, xp: 1500, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 10 }] } },
  { id: "TUT_FORGE", name: "Mãos à Forja", giver: "Ferreiro Bolk", category: "TUTORIAL", minLevel: 3, requires: ["TUT_4"],
    description: "Aprimore um equipamento no Ferreiro. Cada nível exige ouro e Fragmentos; escolha um item que pretende manter.",
    objectives: [{ type: "FORGE", count: 1, description: "Aprimore um equipamento uma vez" }], rewards: { gold: 500, xp: 1000, items: [{ templateId: "FRAGMENTO_COMUM", quantity: 5 }] } },
  { id: "TUT_SELL", name: "Uma Troca Justa", giver: "Ferreiro Bolk", category: "TUTORIAL", minLevel: 3, requires: ["TUT_FORGE"],
    description: "Venda no Ferreiro um item que não pretende usar. O valor em gold aparece antes da confirmação.",
    objectives: [{ type: "SELL", count: 1, description: "Venda 1 item ao Ferreiro" }], rewards: { gold: 400, xp: 500 } },
  { id: "TUT_BACKPACK", name: "Preparar a Jornada", giver: "Guardiã Mirelle", category: "TUTORIAL", minLevel: 3, requires: ["TUT_SELL"],
    description: "Revise sua mochila e os equipamentos coletados. Mochilas melhores são encontradas como drops de chefes.",
    objectives: [{ type: "VISIT_BACKPACK", count: 1, description: "Visite sua Mochila" }], rewards: { gold: 300, xp: 500 } },

  // ═══════════════════════════════════════════════════════════════
  // HISTÓRIA POR ZONA
  // ═══════════════════════════════════════════════════════════════
  { id: "LYSS_1", name: "Praga de Vespas", giver: "Guardiã Mirelle", category: "HISTORIA", zoneId: "BOSQUE_LYSS", minLevel: 3, requires: ["TUT_2"],
    description: "Elimine 25 vespas e traga 3 ferrões. Equipamentos continuam sendo encontrados durante a caça.",
    objectives: [kill("VESPA", 25, "Vespas"), collect("A2", 3, "Ferrões")], rewards: { gold: 1500, xp: 2500 } },
  { id: "LYSS_BOSS", name: "O Espectro de Brasa", giver: "Guardiã Mirelle", category: "DESAFIO", zoneId: "BOSQUE_LYSS", minLevel: 9, requires: ["LYSS_1"],
    description: "Derrote o Espectro de Brasa. Ele pode deixar sua mochila ou equipamento como drop ao ser derrotado.",
    objectives: [boss("ESPECTRO", "Espectro de Brasa")], rewards: { gold: 5000, xp: 10000 } },

  // ═══════════════════════════════════════════════════════════════
  // REPETÍVEIS
  // ═══════════════════════════════════════════════════════════════
  { id: "REP_LYSS", name: "Patrulha do Bosque", giver: "Caçador Brann", category: "REPETIVEL", zoneId: "BOSQUE_LYSS", minLevel: 5, repeatable: true,
    description: "Cace 100 criaturas em qualquer lugar do Bosque.",
    objectives: [kill("ANY", 100, "monstros")], rewards: { gold: 2300, xp: 5000 } },
];

export const QUESTS_BY_ID: Record<string, QuestTemplate> = Object.fromEntries(QUESTS.map((q) => [q.id, q]));
