import { Zone } from "../types";

export const ZONES: Record<string, Zone> = {
  BOSQUE_LYSS: {
    id: "BOSQUE_LYSS", name: "Bosque de Lyss", tier: 1, minLevel: 1, maxLevel: 10, ambientDrop: "P1", ambientPool: ["P1", "P8", "P9"], theme: "forest",
    enemies: [
      { id: "LOBO", name: "Lobo-Feral", hp: 60, atk: 8, arm: 2, xp: 25, goldMin: 10, goldMax: 20, componentId: "A1", componentChance: 0.6, essenceId: "S1", essenceChance: 0.10, isBoss: false, emoji: "🐺", difficulty: 1, minLevel: 1, sprite: "/assets/monsters/LOBO.png" },
      { id: "VESPA", name: "Vespa-Cinza", hp: 50, atk: 10, arm: 1, xp: 35, goldMin: 12, goldMax: 25, componentId: "A2", componentChance: 0.6, essenceId: "S1", essenceChance: 0.10, isBoss: false, emoji: "🐝", difficulty: 2, minLevel: 1, sprite: "/assets/monsters/VESPA.png" },
      { id: "ESPINHEIRO", name: "Espinheiro-Vivo", hp: 80, atk: 12, arm: 3, xp: 50, goldMin: 15, goldMax: 30, componentId: "A7", componentChance: 0.55, essenceId: "S2", essenceChance: 0.12, isBoss: false, emoji: "🪴", difficulty: 2, minLevel: 3, sprite: "/assets/monsters/ESPINHEIRO.png" },
      { id: "FALCAO", name: "Falcão-Ruivo", hp: 70, atk: 15, arm: 2, xp: 70, goldMin: 20, goldMax: 40, componentId: "A10", componentChance: 0.5, essenceId: "S8", essenceChance: 0.12, isBoss: false, emoji: "🦅", difficulty: 3, minLevel: 5, sprite: "/assets/monsters/FALCAO.png" },
      { id: "JAVALI", name: "Javali-Musgoso", hp: 120, atk: 15, arm: 4, xp: 100, goldMin: 25, goldMax: 50, componentId: "A1", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "🐗", difficulty: 3, minLevel: 7, sprite: "/assets/monsters/JAVALI.png" },
      { id: "ESPECTRO", name: "Espectro de Brasa", hp: 400, atk: 25, arm: 5, xp: 400, goldMin: 100, goldMax: 200, componentId: "A3", componentChance: 1.0, essenceId: "S9", essenceChance: 0.30, isBoss: true, emoji: "👻", difficulty: 4, minLevel: 9, damageType: "MAGICO", backpackDrop: "OLD", backpackChance: 0.08, uniqueDropId: "UNICO_BRASA_ETERNA", uniqueDropChance: 0.06, sprite: "/assets/monsters/ESPECTRO.png" },
    ],
  },
  PICO_DHOR: {
    id: "PICO_DHOR", name: "Pico de Dhor", tier: 2, minLevel: 11, maxLevel: 25, ambientDrop: "P2", ambientPool: ["P2", "P4", "P7"], theme: "mountain",
    enemies: [
      { id: "GOLEM", name: "Golem-Rocha", hp: 500, atk: 35, arm: 15, xp: 250, goldMin: 50, goldMax: 100, componentId: "A9", componentChance: 0.55, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "🗿", difficulty: 3, minLevel: 11, sprite: "/assets/monsters/GOLEM.png" },
      { id: "URSO", name: "Urso-Fenda", hp: 400, atk: 45, arm: 10, xp: 300, goldMin: 60, goldMax: 120, componentId: "A4", componentChance: 0.55, essenceId: "S5", essenceChance: 0.12, isBoss: false, emoji: "🐻", difficulty: 2, minLevel: 13, sprite: "/assets/monsters/URSO.png" },
      { id: "BANDIDO", name: "Bandido do Desfiladeiro", hp: 350, atk: 50, arm: 12, xp: 350, goldMin: 100, goldMax: 200, componentId: "A6", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🥷", difficulty: 3, minLevel: 16, sprite: "/assets/monsters/BANDIDO.png" },
      { id: "ELEMENTAL_GELO", name: "Elemental de Gelo", hp: 450, atk: 60, arm: 15, xp: 450, goldMin: 80, goldMax: 160, componentId: "A11", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "🧊", difficulty: 4, minLevel: 19, damageType: "MAGICO", sprite: "/assets/monsters/ELEMENTAL_GELO.png" },
      { id: "YETI", name: "Yeti-do-Cume", hp: 800, atk: 70, arm: 18, xp: 600, goldMin: 120, goldMax: 240, componentId: "A4", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "🦍", difficulty: 4, minLevel: 22, sprite: "/assets/monsters/YETI.png" },
      { id: "COLOSSO", name: "Colosso de Dhor", hp: 2500, atk: 90, arm: 30, xp: 2500, goldMin: 500, goldMax: 1000, componentId: "A9", componentChance: 1.0, essenceId: "S7", essenceChance: 0.30, isBoss: true, emoji: "🏔️", difficulty: 5, minLevel: 24, backpackDrop: "COURO", backpackChance: 0.05, uniqueDropId: "UNICO_CORACAO_GRANITO", uniqueDropChance: 0.06, sprite: "/assets/monsters/COLOSSO.png" },
    ],
  },
  // ... (As outras zonas seguem o mesmo padrão de aumento drástico de XP/HP)
  MAR_AZHAR: {
    id: "MAR_AZHAR", name: "Mar de Azhar", tier: 3, minLevel: 26, maxLevel: 45, ambientDrop: "P6", ambientPool: ["P6", "P5", "P10"], theme: "ocean",
    enemies: [
      { id: "CARANGUEJO", name: "Caranguejo-Colosso", hp: 3000, atk: 150, arm: 40, xp: 2000, goldMin: 300, goldMax: 500, componentId: "A9", componentChance: 0.5, essenceId: "S7", essenceChance: 0.12, isBoss: false, emoji: "🦀", difficulty: 3, minLevel: 26, sprite: "/assets/monsters/CARANGUEJO.png" },
      { id: "SERPENTE", name: "Serpente-Névoa", hp: 2800, atk: 180, arm: 30, xp: 2200, goldMin: 350, goldMax: 600, componentId: "A5", componentChance: 0.55, essenceId: "S3", essenceChance: 0.12, isBoss: false, emoji: "🐍", difficulty: 4, minLevel: 28, sprite: "/assets/monsters/SERPENTE.png" },
      { id: "MEDUSA", name: "Medusa-Trovão", hp: 2500, atk: 200, arm: 25, xp: 2500, goldMin: 400, goldMax: 700, componentId: "A13", componentChance: 0.5, essenceId: "S4", essenceChance: 0.12, isBoss: false, emoji: "🪼", difficulty: 3, minLevel: 32, damageType: "MAGICO", sprite: "/assets/monsters/MEDUSA.png" },
      { id: "SEREIA", name: "Sereia-Cantora", hp: 3200, atk: 220, arm: 35, xp: 3000, goldMin: 450, goldMax: 800, componentId: "A5", componentChance: 0.5, essenceId: "S3", essenceChance: 0.15, isBoss: false, emoji: "🧜", difficulty: 4, minLevel: 35, damageType: "MAGICO", sprite: "/assets/monsters/SEREIA.png" },
      { id: "POLVO", name: "Polvo-Abissal", hp: 4500, atk: 250, arm: 40, xp: 4000, goldMin: 500, goldMax: 900, componentId: "A12", componentChance: 0.5, essenceId: "S6", essenceChance: 0.12, isBoss: false, emoji: "🐙", difficulty: 4, minLevel: 38, sprite: "/assets/monsters/POLVO.png" },
      { id: "LEVIATA", name: "Leviatã de Azhar", hp: 15000, atk: 400, arm: 80, xp: 20000, goldMin: 5000, goldMax: 8000, componentId: "A12", componentChance: 1.0, essenceId: "S5", essenceChance: 0.30, isBoss: true, emoji: "🐋", difficulty: 5, minLevel: 43, backpackDrop: "REFORCADA", backpackChance: 0.04, uniqueDropId: "UNICO_ESCAMA_LEVIATA", uniqueDropChance: 0.06, sprite: "/assets/monsters/LEVIATA.png" },
    ],
  },
  RUINAS_ASTERION: {
    id: "RUINAS_ASTERION", name: "Ruínas de Asterion", tier: 4, minLevel: 46, maxLevel: 70, ambientDrop: "P11", ambientPool: ["P11", "P10", "P3"], theme: "ruins",
    enemies: [
      { id: "HIENA", name: "Hiena-Abissal", hp: 15000, atk: 500, arm: 80, xp: 15000, goldMin: 1000, goldMax: 2000, componentId: "A8", componentChance: 0.55, essenceId: "S9", essenceChance: 0.12, isBoss: false, emoji: "🐕", difficulty: 4, minLevel: 46, sprite: "/assets/monsters/HIENA.png" },
      { id: "SENTINELA", name: "Sentinela de Pedra", hp: 18000, atk: 450, arm: 120, xp: 18000, goldMin: 1200, goldMax: 2400, componentId: "A9", componentChance: 0.5, essenceId: "S11", essenceChance: 0.12, isBoss: false, emoji: "🗿", difficulty: 4, minLevel: 50, sprite: "/assets/monsters/SENTINELA.png" },
      { id: "ESCORPIAO", name: "Escorpião-Rúnico", hp: 14000, atk: 600, arm: 70, xp: 20000, goldMin: 1400, goldMax: 2800, componentId: "A2", componentChance: 0.5, essenceId: "S10", essenceChance: 0.12, isBoss: false, emoji: "🦂", difficulty: 4, minLevel: 55, sprite: "/assets/monsters/ESCORPIAO.png" },
      { id: "CULTISTA", name: "Cultista do Eclipse", hp: 12000, atk: 700, arm: 50, xp: 25000, goldMin: 1500, goldMax: 3000, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.15, isBoss: false, emoji: "🧿", difficulty: 5, minLevel: 60, damageType: "MAGICO", sprite: "/assets/monsters/CULTISTA.png" },
      { id: "GUARDIAO", name: "Guardião de Asterion", hp: 80000, atk: 1000, arm: 200, xp: 150000, goldMin: 20000, goldMax: 35000, componentId: "A15", componentChance: 1.0, essenceId: "S12", essenceChance: 0.30, isBoss: true, emoji: "🛡️", difficulty: 5, minLevel: 66, backpackDrop: "EXPLORADOR", backpackChance: 0.03, uniqueDropId: "UNICO_OLHO_ASTERION", uniqueDropChance: 0.06, sprite: "/assets/monsters/GUARDIAO.png" },
    ],
  },
  CICATRIZ_PROFUNDA: {
    id: "CICATRIZ_PROFUNDA", name: "Cicatriz Profunda", tier: 5, minLevel: 71, maxLevel: 100, ambientDrop: "P12", ambientPool: ["P12", "P9", "P3"], theme: "abyss",
    enemies: [
      { id: "CRIA_VAZIO", name: "Cria do Vazio", hp: 50000, atk: 1200, arm: 150, xp: 50000, goldMin: 3000, goldMax: 6000, componentId: "A14", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "👾", difficulty: 4, minLevel: 71, damageType: "MAGICO", sprite: "/assets/monsters/CRIA_VAZIO.png" },
      { id: "VERME", name: "Verme-Abissal", hp: 65000, atk: 1500, arm: 180, xp: 65000, goldMin: 4000, goldMax: 8000, componentId: "A14", componentChance: 0.55, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "🪱", difficulty: 5, minLevel: 75, sprite: "/assets/monsters/VERME.png" },
      { id: "ABERRACAO", name: "Aberração Tentacular", hp: 80000, atk: 1800, arm: 200, xp: 85000, goldMin: 5000, goldMax: 10000, componentId: "A12", componentChance: 0.5, essenceId: "S13", essenceChance: 0.12, isBoss: false, emoji: "🦑", difficulty: 5, minLevel: 82, sprite: "/assets/monsters/ABERRACAO.png" },
      { id: "SOMBRA", name: "Sombra Faminta", hp: 60000, atk: 2200, arm: 120, xp: 110000, goldMin: 6000, goldMax: 12000, componentId: "A3", componentChance: 0.5, essenceId: "S12", essenceChance: 0.12, isBoss: false, emoji: "🌑", difficulty: 5, minLevel: 88, damageType: "MAGICO", sprite: "/assets/monsters/SOMBRA.png" },
      { id: "DEVORADOR", name: "Devorador da Cicatriz", hp: 300000, atk: 3500, arm: 400, xp: 1000000, goldMin: 100000, goldMax: 200000, componentId: "A14", componentChance: 1.0, essenceId: "S13", essenceChance: 0.30, isBoss: true, emoji: "👹", difficulty: 5, minLevel: 95, backpackDrop: "ARCANA", backpackChance: 0.02, uniqueDropId: "UNICO_PRESA_DEVORADOR", uniqueDropChance: 0.06, sprite: "/assets/monsters/DEVORADOR.png" },
    ],
  },
};