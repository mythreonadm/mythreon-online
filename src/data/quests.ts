import { QuestTemplate } from "../types";

const kill = (target: string, count: number, name: string) => ({ type: "KILL" as const, target, count, description: `Derrote ${count} ${name}` });
const boss = (target: string, name: string) => ({ type: "KILL_BOSS" as const, target, count: 1, description: `Derrote o chefe ${name}` });
const collect = (target: string, count: number, name: string) => ({ type: "COLLECT" as const, target, count, description: `Obtenha ${count}x ${name}` });
const pot = (tier: number, quantity: number) => ({ templateId: `POCAO_VIDA_${tier}`, quantity });
const discoverTotal = (count: number) => ({ type: "DISCOVER_TOTAL" as const, count, description: `Descubra ${count} raças na Matriz` });
const discoverNamed = (count: number) => ({ type: "DISCOVER_NAMED" as const, count, description: `Descubra ${count} raças lendárias` });

export const QUESTS: QuestTemplate[] = [
  // ═══════════════════════════════════════════════════════════════
  // COMPÊNDIO — MILESTONES DE DESCOBERTA (Auto-aceitas)
  // ═══════════════════════════════════════════════════════════════
  { id: "COMP_T10", name: "Colecionador Iniciante", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1,
    description: "A Matriz espera por você. Descubra 10 raças diferentes.",
    objectives: [discoverTotal(10)], rewards: { gold: 1000, xp: 1000, items: [pot(1, 10)] } },

  { id: "COMP_T25", name: "Explorador da Matriz", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T10"],
    description: "O caminho do Arquivista é longo. Descubra 25 raças.",
    objectives: [discoverTotal(25)], rewards: { gold: 5000, xp: 5000, items: [pot(2, 5)] } },

  { id: "COMP_T50", name: "Arquivista Dedicado", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T25"],
    description: "Metade do caminho para a maestria. Descubra 50 raças.",
    objectives: [discoverTotal(50)], rewards: { gold: 25000, xp: 25000, items: [{ templateId: "FRAGMENTO_RARO", quantity: 50 }] } },

  { id: "COMP_T100", name: "Mestre da Matriz", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T50"],
    description: "Você domina a arte da síntese. Descubra 100 raças.",
    objectives: [discoverTotal(100)], rewards: { gold: 100000, xp: 100000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 25 }] } },

  { id: "COMP_T200", name: "O Caminho Infinito", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_T100"],
    description: "Nenhum limite te detém. Descubra 200 raças.",
    objectives: [discoverTotal(200)], rewards: { gold: 500000, xp: 500000, items: [{ templateId: "UNICO_BRASA_ETERNA" }] } },

  // ─── NOMEADAS (LENDÁRIAS) ───
  { id: "COMP_N1", name: "Primeira Lenda", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1,
    description: "Descubra sua primeira raça nomeada. Cada uma guarda um fragmento da história de Mythreon.",
    objectives: [discoverNamed(1)], rewards: { gold: 2000, xp: 2000, items: [pot(2, 10)] } },

  { id: "COMP_N5", name: "Caçador de Lendas", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N1"],
    description: "Cinco nomes lendários em sua coleção. Continue.",
    objectives: [discoverNamed(5)], rewards: { gold: 15000, xp: 15000, items: [{ templateId: "FRAGMENTO_EPICO", quantity: 10 }] } },

  { id: "COMP_N10", name: "Guardião das Histórias", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N5"],
    description: "Dez raças nomeadas descobertas. Você está entre os grandes Arquivistas.",
    objectives: [discoverNamed(10)], rewards: { gold: 75000, xp: 75000, items: [{ templateId: "UNICO_CORACAO_GRANITO" }] } },

  { id: "COMP_N20", name: "Voz das Consciências", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N10"],
    description: "Vinte lendas em sua coleção. Poucos chegam tão longe.",
    objectives: [discoverNamed(20)], rewards: { gold: 300000, xp: 300000, items: [{ templateId: "UNICO_ESCAMA_LEVIATA" }] } },

  { id: "COMP_N33", name: "O Último Arquivista", giver: "Anciã Seraphine", category: "COMPENDIO", minLevel: 1, requires: ["COMP_N20"],
    description: "Todas as 33 raças nomeadas descobertas. Você é a lenda viva de Mythreon.",
    objectives: [discoverNamed(33)], rewards: { gold: 1500000, xp: 1000000, items: [{ templateId: "UNICO_OLHO_ASTERION" }, { templateId: "UNICO_PRESA_DEVORADOR" }, { templateId: "FRAGMENTO_EPICO", quantity: 100 }] } },

  // ═══════════════════════════════════════════════════════════════
  // TUTORIAL / ONBOARDING
  // ═══════════════════════════════════════════════════════════════
  { id: "TUT_1", name: "O Primeiro Passo", giver: "Guardiã Mirelle", category: "TUTORIAL", zoneId: "BOSQUE_LYSS", minLevel: 1,
    description: "Bem-vindo a Mythreon. Derrote 10 Lobos-Ferais para testar suas forças.",
    objectives: [kill("LOBO", 10, "Lobos")], rewards: { gold: 100, xp: 200, items: [pot(1, 3)] } },
  { id: "TUT_2", name: "A Forja da Alma", giver: "Guardiã Mirelle", category: "TUTORIAL", zoneId: "BOSQUE_LYSS", minLevel: 1, requires: ["TUT_1"],
    description: "Colete 1 Ataque, 1 Suporte e 1 Passiva e crie sua primeira Raça na aba Matriz.",
    objectives: [{ type: "SYNTHESIZE", count: 1, description: "Sintetize 1 Raça" }], rewards: { gold: 300, xp: 500, items: [{ templateId: "ARCO_T1", rarity: "INCOMUM" }] } },
  { id: "TUT_3", name: "Ciclo de Renovação", giver: "Herbalista Tomé", category: "TUTORIAL", zoneId: "BOSQUE_LYSS", minLevel: 2, requires: ["TUT_1"],
    description: "Derrote 20 criaturas e acumule 300 de ouro.",
    objectives: [kill("ANY", 20, "criaturas"), { type: "EARN_GOLD", count: 300, description: "Ganhe 300 de Ouro" }], rewards: { gold: 500, xp: 800, items: [{ templateId: "CAPACETE_T1", rarity: "RARO" }] } },
  { id: "TUT_4", name: "Limpeza de Inventário", giver: "Mercador Bolk", category: "TUTORIAL", minLevel: 3, requires: ["TUT_3"],
    description: "Use o botão de Desmanchar no Mercador para transformar 3 itens em Fragmentos.",
    objectives: [{ type: "SALVAGE", count: 3, description: "Desmanche 3 itens" }], rewards: { gold: 1000, xp: 1500, items: [{ templateId: "FRAGMENTO_RARO", quantity: 5 }] } },

  // ═══════════════════════════════════════════════════════════════
  // HISTÓRIA POR ZONA
  // ═══════════════════════════════════════════════════════════════
  { id: "LYSS_1", name: "Praga de Vespas", giver: "Guardiã Mirelle", category: "HISTORIA", zoneId: "BOSQUE_LYSS", minLevel: 3, requires: ["TUT_2"],
    description: "Elimine 25 vespas e traga 3 ferrões.",
    objectives: [kill("VESPA", 25, "Vespas"), collect("A2", 3, "Ferrões")], rewards: { gold: 1500, xp: 2500, items: [{ templateId: "PEITORAL_T1", rarity: "RARO" }] } },
  { id: "LYSS_BOSS", name: "O Espectro de Brasa", giver: "Guardiã Mirelle", category: "DESAFIO", zoneId: "BOSQUE_LYSS", minLevel: 9, requires: ["LYSS_1"],
    description: "Derrote o Espectro de Brasa.",
    objectives: [boss("ESPECTRO", "Espectro de Brasa")], rewards: { gold: 5000, xp: 10000, items: [{ templateId: "BACKPACK_OLD" }, { templateId: "ESPADA_T1", rarity: "EPICO" }] } },

  // ═══════════════════════════════════════════════════════════════
  // REPETÍVEIS
  // ═══════════════════════════════════════════════════════════════
  { id: "REP_LYSS", name: "Patrulha do Bosque", giver: "Caçador Brann", category: "REPETIVEL", zoneId: "BOSQUE_LYSS", minLevel: 5, repeatable: true,
    description: "Cace 100 criaturas em qualquer lugar do Bosque.",
    objectives: [kill("ANY", 100, "monstros")], rewards: { gold: 2000, xp: 5000, items: [pot(1, 10)] } },
];

export const QUESTS_BY_ID: Record<string, QuestTemplate> = Object.fromEntries(QUESTS.map((q) => [q.id, q]));