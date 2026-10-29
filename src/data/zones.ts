import { Zone } from "../types";

export const ZONES: Record<string, Zone> = {
  // ═══════════════════════════════════════════════════════════════
  // ZONA 1: BOSQUE DE LYSS (T1 - Nível 1-10)
  // Tema: Floresta encantada (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  BOSQUE_LYSS: {
    id: "BOSQUE_LYSS", name: "Bosque de Lyss", tier: 1, minLevel: 1, maxLevel: 10, ambientDrop: "P1", ambientPool: ["P1", "P8", "P9"], theme: "forest",
    enemies: [
      { id: "LOBO", name: "Lobo-Feral", hp: 30, atk: 4, arm: 1, xp: 15, goldMin: 5, goldMax: 12, componentId: "A1", componentChance: 0.6, essenceId: "S1", essenceChance: 0.10, isBoss: false, emoji: "🐺", difficulty: 1, minLevel: 1, sprite: "/assets/monsters/LOBO.png" },
      { id: "VESPA", name: "Vespa-Cinza", hp: 25, atk: 6, arm: 0, xp: 18, goldMin: 6, goldMax: 15, componentId: "A2", componentChance: 0.6, essenceId: "S1", essenceChance: 0.10, isBoss: false, emoji: "🐝", difficulty: 2, minLevel: 1, sprite: "/assets/monsters/VESPA.png" },
      { id: "ESPINHEIRO", name: "Espinheiro-Vivo", hp: 20, atk: 4, arm: 2, xp: 21, goldMin: 9, goldMax: 16, componentId: "A7", componentChance: 0.55, essenceId: "S2", essenceChance: 0.12, isBoss: false, emoji: "🪴", difficulty: 2, minLevel: 3, sprite: "/assets/monsters/ESPINHEIRO.png" },
      { id: "FALCAO", name: "Falcão-Ruivo", hp: 18, atk: 6, arm: 1, xp: 25, goldMin: 10, goldMax: 18, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "🦅", difficulty: 3, minLevel: 5, sprite: "/assets/monsters/FALCAO.png" },
      { id: "JAVALI", name: "Javali-Musgoso", hp: 32, atk: 5, arm: 2, xp: 29, goldMin: 12, goldMax: 22, componentId: "A1", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "🐗", difficulty: 3, minLevel: 7, sprite: "/assets/monsters/JAVALI.png" },
      // NOVOS MOBS T1
      { id: "FADA_CORROMPIDA", name: "Fada Corrompida", hp: 22, atk: 8, arm: 0, xp: 35, goldMin: 15, goldMax: 25, componentId: "A3", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "🧚", difficulty: 2, minLevel: 4, sprite: "/assets/monsters/FADA_CORROMPIDA.png" },
      { id: "ARANHA_GIGANTE", name: "Aranha Gigante", hp: 40, atk: 7, arm: 3, xp: 40, goldMin: 18, goldMax: 28, componentId: "A2", componentChance: 0.6, essenceId: "S2", essenceChance: 0.10, isBoss: false, emoji: "🕷️", difficulty: 2, minLevel: 6, sprite: "/assets/monsters/ARANHA_GIGANTE.png" },
      { id: "ESPECTRO", name: "Espectro de Brasa", hp: 80, atk: 9, arm: 2, xp: 110, goldMin: 60, goldMax: 100, componentId: "A3", componentChance: 1.0, essenceId: "S9", essenceChance: 0.30, isBoss: true, emoji: "👻", difficulty: 4, minLevel: 9, damageType: "MAGICO", backpackDrop: "OLD", backpackChance: 0.08, uniqueDropId: "UNICO_BRASA_ETERNA", uniqueDropChance: 0.06, sprite: "/assets/monsters/ESPECTRO.png" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ZONA 2: PICO DE DHOR (T2 - Nível 11-25)
  // Tema: Montanha vulcânica (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  PICO_DHOR: {
    id: "PICO_DHOR", name: "Pico de Dhor", tier: 2, minLevel: 11, maxLevel: 25, ambientDrop: "P2", ambientPool: ["P2", "P4", "P7"], theme: "mountain",
    enemies: [
      { id: "GOLEM", name: "Golem-Rocha", hp: 150, atk: 15, arm: 8, xp: 50, goldMin: 20, goldMax: 40, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "🗿", difficulty: 3, minLevel: 11, sprite: "/assets/monsters/GOLEM.png" },
      { id: "URSO", name: "Urso-Fenda", hp: 120, atk: 20, arm: 5, xp: 60, goldMin: 25, goldMax: 50, componentId: "A4", componentChance: 0.55, essenceId: "S5", essenceChance: 0.12, isBoss: false, emoji: "🐻", difficulty: 2, minLevel: 13, sprite: "/assets/monsters/URSO.png" },
      { id: "BANDIDO", name: "Bandido do Desfiladeiro", hp: 110, atk: 22, arm: 6, xp: 70, goldMin: 40, goldMax: 80, componentId: "A6", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🥷", difficulty: 3, minLevel: 16, sprite: "/assets/monsters/BANDIDO.png" },
      { id: "ELEMENTAL_GELO", name: "Elemental de Gelo", hp: 130, atk: 21, arm: 8, xp: 85, goldMin: 35, goldMax: 65, componentId: "A11", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "🧊", difficulty: 4, minLevel: 19, damageType: "MAGICO", sprite: "/assets/monsters/ELEMENTAL_GELO.png" },
      { id: "YETI", name: "Yeti-do-Cume", hp: 180, atk: 25, arm: 7, xp: 100, goldMin: 45, goldMax: 85, componentId: "A4", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "🦍", difficulty: 4, minLevel: 22, sprite: "/assets/monsters/YETI.png" },
      // NOVOS MOBS T2
      { id: "MORCEGO_MAGMA", name: "Morcego de Magma", hp: 90, atk: 28, arm: 4, xp: 75, goldMin: 30, goldMax: 55, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "🦇", difficulty: 3, minLevel: 15, sprite: "/assets/monsters/MORCEGO_MAGMA.png" },
      { id: "CENTURIAO", name: "Centurião de Bronze", hp: 200, atk: 18, arm: 15, xp: 90, goldMin: 50, goldMax: 90, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🤖", difficulty: 4, minLevel: 20, sprite: "/assets/monsters/CENTURIAO.png" },
      { id: "COLOSSO", name: "Colosso de Dhor", hp: 450, atk: 35, arm: 15, xp: 300, goldMin: 300, goldMax: 500, componentId: "A9", componentChance: 1.0, essenceId: "S7", essenceChance: 0.30, isBoss: true, emoji: "🏔️", difficulty: 5, minLevel: 24, backpackDrop: "COURO", backpackChance: 0.05, uniqueDropId: "UNICO_CORACAO_GRANITO", uniqueDropChance: 0.06, sprite: "/assets/monsters/COLOSSO.png" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ZONA 3: MAR DE AZHAR (T3 - Nível 26-45)
  // Tema: Oceano profundo (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  MAR_AZHAR: {
    id: "MAR_AZHAR", name: "Mar de Azhar", tier: 3, minLevel: 26, maxLevel: 45, ambientDrop: "P6", ambientPool: ["P6", "P5", "P10"], theme: "ocean",
    enemies: [
      { id: "CARANGUEJO", name: "Caranguejo-Colosso", hp: 400, atk: 40, arm: 20, xp: 150, goldMin: 60, goldMax: 100, componentId: "A9", componentChance: 0.5, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "🦀", difficulty: 3, minLevel: 26, sprite: "/assets/monsters/CARANGUEJO.png" },
      { id: "SERPENTE", name: "Serpente-Névoa", hp: 380, atk: 45, arm: 15, xp: 170, goldMin: 70, goldMax: 120, componentId: "A5", componentChance: 0.55, essenceId: "S3", essenceChance: 0.12, isBoss: false, emoji: "🐍", difficulty: 4, minLevel: 28, sprite: "/assets/monsters/SERPENTE.png" },
      { id: "MEDUSA", name: "Medusa-Trovão", hp: 350, atk: 50, arm: 12, xp: 190, goldMin: 80, goldMax: 130, componentId: "A13", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "🪼", difficulty: 3, minLevel: 32, damageType: "MAGICO", sprite: "/assets/monsters/MEDUSA.png" },
      { id: "SEREIA", name: "Sereia-Cantora", hp: 420, atk: 48, arm: 16, xp: 210, goldMin: 90, goldMax: 140, componentId: "A5", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "🧜", difficulty: 4, minLevel: 35, damageType: "MAGICO", sprite: "/assets/monsters/SEREIA.png" },
      { id: "POLVO", name: "Polvo-Abissal", hp: 550, atk: 52, arm: 18, xp: 240, goldMin: 100, goldMax: 160, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "🐙", difficulty: 4, minLevel: 38, sprite: "/assets/monsters/POLVO.png" },
      // NOVOS MOBS T3
      { id: "TRITAO", name: "Tritão Guerreiro", hp: 450, atk: 55, arm: 25, xp: 250, goldMin: 110, goldMax: 180, componentId: "A6", componentChance: 0.55, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🔱", difficulty: 4, minLevel: 40, sprite: "/assets/monsters/TRITAO.png" },
      { id: "ENGUIA_ELETRICA", name: "Enguia Elétrica", hp: 380, atk: 62, arm: 14, xp: 280, goldMin: 120, goldMax: 200, componentId: "A13", componentChance: 0.5, essenceId: "S9", essenceChance: 0.15, isBoss: false, emoji: "⚡", difficulty: 4, minLevel: 42, damageType: "MAGICO", sprite: "/assets/monsters/ENGUIA_ELETRICA.png" },
      { id: "LEVIATA", name: "Leviatã de Azhar", hp: 1500, atk: 85, arm: 30, xp: 1200, goldMin: 1500, goldMax: 2500, componentId: "A12", componentChance: 1.0, essenceId: "S5", essenceChance: 0.30, isBoss: true, emoji: "🐋", difficulty: 5, minLevel: 43, backpackDrop: "REFORCADA", backpackChance: 0.04, uniqueDropId: "UNICO_ESCAMA_LEVIATA", uniqueDropChance: 0.06, sprite: "/assets/monsters/LEVIATA.png" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ZONA 4: RUÍNAS DE ASTERION (T4 - Nível 46-70)
  // Tema: Cidade antiga (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  RUINAS_ASTERION: {
    id: "RUINAS_ASTERION", name: "Ruínas de Asterion", tier: 4, minLevel: 46, maxLevel: 70, ambientDrop: "P11", ambientPool: ["P11", "P10", "P3"], theme: "ruins",
    enemies: [
      { id: "HIENA", name: "Hiena-Abissal", hp: 900, atk: 80, arm: 30, xp: 350, goldMin: 150, goldMax: 250, componentId: "A8", componentChance: 0.55, essenceId: "S9", essenceChance: 0.12, isBoss: false, emoji: "🐕", difficulty: 4, minLevel: 46, sprite: "/assets/monsters/HIENA.png" },
      { id: "SENTINELA", name: "Sentinela de Pedra", hp: 1100, atk: 75, arm: 40, xp: 400, goldMin: 180, goldMax: 280, componentId: "A9", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "🗿", difficulty: 4, minLevel: 50, sprite: "/assets/monsters/SENTINELA.png" },
      { id: "ESCORPIAO", name: "Escorpião-Rúnico", hp: 850, atk: 95, arm: 25, xp: 450, goldMin: 200, goldMax: 320, componentId: "A2", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🦂", difficulty: 4, minLevel: 55, sprite: "/assets/monsters/ESCORPIAO.png" },
      { id: "CULTISTA", name: "Cultista do Eclipse", hp: 800, atk: 110, arm: 20, xp: 500, goldMin: 220, goldMax: 350, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "🧿", difficulty: 5, minLevel: 60, damageType: "MAGICO", sprite: "/assets/monsters/CULTISTA.png" },
      // NOVOS MOBS T4
      { id: "MUMIA", name: "Múmia Ancestral", hp: 1000, atk: 90, arm: 35, xp: 550, goldMin: 250, goldMax: 400, componentId: "A14", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "🧟", difficulty: 4, minLevel: 52, sprite: "/assets/monsters/MUMIA.png" },
      { id: "GARGULA", name: "Gárgula de Pedra", hp: 1200, atk: 100, arm: 45, xp: 600, goldMin: 280, goldMax: 450, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "🦇", difficulty: 5, minLevel: 58, sprite: "/assets/monsters/GARGULA.png" },
      { id: "GUARDIAO", name: "Guardião de Asterion", hp: 2500, atk: 150, arm: 50, xp: 3000, goldMin: 3000, goldMax: 5000, componentId: "A15", componentChance: 1.0, essenceId: "S12", essenceChance: 0.30, isBoss: true, emoji: "🛡️", difficulty: 5, minLevel: 66, backpackDrop: "EXPLORADOR", backpackChance: 0.03, uniqueDropId: "UNICO_OLHO_ASTERION", uniqueDropChance: 0.06, sprite: "/assets/monsters/GUARDIAO.png" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ZONA 5: CICATRIZ PROFUNDA (T5 - Nível 71-100)
  // Tema: Abismo cósmico (sua imagem de referência)
  // ═══════════════════════════════════════════════════════════════
  CICATRIZ_PROFUNDA: {
    id: "CICATRIZ_PROFUNDA", name: "Cicatriz Profunda", tier: 5, minLevel: 71, maxLevel: 100, ambientDrop: "P12", ambientPool: ["P12", "P9", "P3"], theme: "abyss",
    enemies: [
      { id: "CRIA_VAZIO", name: "Cria do Vazio", hp: 1800, atk: 150, arm: 40, xp: 800, goldMin: 400, goldMax: 600, componentId: "A14", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "👾", difficulty: 4, minLevel: 71, damageType: "MAGICO", sprite: "/assets/monsters/CRIA_VAZIO.png" },
      { id: "VERME", name: "Verme-Abissal", hp: 2200, atk: 160, arm: 45, xp: 900, goldMin: 450, goldMax: 650, componentId: "A14", componentChance: 0.55, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "🪱", difficulty: 5, minLevel: 75, sprite: "/assets/monsters/VERME.png" },
      { id: "ABERRACAO", name: "Aberração Tentacular", hp: 2500, atk: 180, arm: 50, xp: 1000, goldMin: 500, goldMax: 700, componentId: "A12", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "🦑", difficulty: 5, minLevel: 82, sprite: "/assets/monsters/ABERRACAO.png" },
      { id: "SOMBRA", name: "Sombra Faminta", hp: 2000, atk: 200, arm: 35, xp: 1100, goldMin: 550, goldMax: 750, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.12, isBoss: false, emoji: "🌑", difficulty: 5, minLevel: 88, damageType: "MAGICO", sprite: "/assets/monsters/SOMBRA.png" },
      // NOVOS MOBS T5
      { id: "CEIFADOR_ALMAS", name: "Ceifador de Almas", hp: 2800, atk: 220, arm: 55, xp: 1500, goldMin: 600, goldMax: 900, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.15, isBoss: false, emoji: "💀", difficulty: 5, minLevel: 80, sprite: "/assets/monsters/CEIFADOR_ALMAS.png" },
      { id: "OLHO_VAZIO", name: "Olho do Vazio", hp: 2200, atk: 250, arm: 40, xp: 1600, goldMin: 650, goldMax: 950, componentId: "A15", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "👁️", difficulty: 5, minLevel: 85, damageType: "MAGICO", sprite: "/assets/monsters/OLHO_VAZIO.png" },
      { id: "DEVORADOR", name: "Devorador da Cicatriz", hp: 5000, atk: 220, arm: 60, xp: 8000, goldMin: 6000, goldMax: 10000, componentId: "A14", componentChance: 1.0, essenceId: "S13", essenceChance: 0.30, isBoss: true, emoji: "👹", difficulty: 5, minLevel: 95, backpackDrop: "ARCANA", backpackChance: 0.02, uniqueDropId: "UNICO_PRESA_DEVORADOR", uniqueDropChance: 0.06, sprite: "/assets/monsters/DEVORADOR.png" },
    ],
  },
};