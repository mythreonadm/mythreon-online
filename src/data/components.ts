import { ComponentTemplate } from "../types";

export const ATAQUES: Record<string, ComponentTemplate> = {
  A1: { id: "A1", name: "Presa de Lobo-Feral", type: "ATAQUE", law: "RAAN", icon: "🦷", skillName: "Mordida Feral", skillDescription: "Dano físico" },
  A2: { id: "A2", name: "Ferrão de Vespa", type: "ATAQUE", law: "VORO", icon: "🐝", skillName: "Ferrão Venenoso", skillDescription: "Dano + veneno" },
  A3: { id: "A3", name: "Chama de Espectro", type: "ATAQUE", law: "KAELOR", icon: "🔥", skillName: "Chama Espectral", skillDescription: "Dano mágico" },
  A4: { id: "A4", name: "Garra de Urso", type: "ATAQUE", law: "DHOR", icon: "🐾", skillName: "Garra Perfurante", skillDescription: "Dano + quebra DEF" },
  A5: { id: "A5", name: "Peçonha de Serpente", type: "ATAQUE", law: "NOCTHAR", icon: "🐍", skillName: "Peçonha", skillDescription: "Dano + lentidão" },
  A6: { id: "A6", name: "Lâmina de Bandido", type: "ATAQUE", law: "VORO", icon: "🗡️", skillName: "Corte", skillDescription: "Dano perfurante" },
  A7: { id: "A7", name: "Espinho de Planta", type: "ATAQUE", law: "LYSS", icon: "🌿", skillName: "Espinho", skillDescription: "Dano + sangramento" },
  A8: { id: "A8", name: "Mandíbula de Hiena", type: "ATAQUE", law: "VORO", icon: "🦴", skillName: "Mordida", skillDescription: "Dano + medo" },
  A9: { id: "A9", name: "Núcleo de Golem", type: "ATAQUE", law: "DHOR", icon: "🪨", skillName: "Impacto", skillDescription: "Dano em cone" },
  A10: { id: "A10", name: "Pena de Falcão", type: "ATAQUE", law: "RAAN", icon: "🪶", skillName: "Corte", skillDescription: "Dano + silêncio" },
  A11: { id: "A11", name: "Cristal de Gelo", type: "ATAQUE", law: "CHRONOS", icon: "❄️", skillName: "Lança Gélida", skillDescription: "Dano mágico + lentidão" },
  A12: { id: "A12", name: "Tentáculo Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "🐙", skillName: "Chicote Abissal", skillDescription: "Dano sombrio que ignora armadura" },
  A13: { id: "A13", name: "Fragmento de Tempestade", type: "ATAQUE", law: "KAELOR", icon: "⚡", skillName: "Descarga", skillDescription: "Dano de trovão em cadeia" },
  A14: { id: "A14", name: "Presa de Verme-Abissal", type: "ATAQUE", law: "NOCTHAR", icon: "🪱", skillName: "Devorar", skillDescription: "Dano + drena vida" },
  A15: { id: "A15", name: "Fragmento de Asterion", type: "ATAQUE", law: "ASTER", icon: "☄️", skillName: "Julgamento Estelar", skillDescription: "Dano sagrado devastador" },
};

export const SUPORTES: Record<string, ComponentTemplate> = {
  S1: { id: "S1", name: "Núcleo de Lyss", type: "SUPORTE", law: "LYSS", icon: "💚", skillName: "Bênção de Lyss", skillDescription: "Cura" },
  S2: { id: "S2", name: "Núcleo de Emohna", type: "SUPORTE", law: "EMOHNA", icon: "🤝", skillName: "Vínculo", skillDescription: "Buff ATK/DEF" },
  S3: { id: "S3", name: "Núcleo de Aster", type: "SUPORTE", law: "ASTER", icon: "✨", skillName: "Aurora", skillDescription: "Cura + limpa debuff" },
  S4: { id: "S4", name: "Núcleo de Nocthar", type: "SUPORTE", law: "NOCTHAR", icon: "🌙", skillName: "Véu", skillDescription: "Escudo" },
  S5: { id: "S5", name: "Núcleo de Chronos", type: "SUPORTE", law: "CHRONOS", icon: "⏳", skillName: "Aceleração", skillDescription: "Cooldown" },
  S6: { id: "S6", name: "Núcleo de Veyra", type: "SUPORTE", law: "VEYRA", icon: "📖", skillName: "Revelação", skillDescription: "Revela fraqueza" },
  S7: { id: "S7", name: "Núcleo de Dhor", type: "SUPORTE", law: "DHOR", icon: "🛡️", skillName: "Baluarte", skillDescription: "Buff DEF" },
  S8: { id: "S8", name: "Núcleo de Raan", type: "SUPORTE", law: "RAAN", icon: "💨", skillName: "Passo", skillDescription: "Velocidade" },
  S9: { id: "S9", name: "Núcleo de Kaelor", type: "SUPORTE", law: "KAELOR", icon: "🌀", skillName: "Adaptação", skillDescription: "Resistência" },
  S10: { id: "S10", name: "Núcleo de Loghis", type: "SUPORTE", law: "LOGHIS", icon: "🧮", skillName: "Cálculo", skillDescription: "Aumenta precisão e crítico" },
  S11: { id: "S11", name: "Núcleo de Prime", type: "SUPORTE", law: "PRIME", icon: "☯️", skillName: "Equilíbrio", skillDescription: "Buff ATK/DEF permanente" },
  S12: { id: "S12", name: "Núcleo de Synthes", type: "SUPORTE", law: "SYNTHES", icon: "🔗", skillName: "Fusão", skillDescription: "Rouba vida dos golpes" },
  S13: { id: "S13", name: "Núcleo de Voro", type: "SUPORTE", law: "VORO", icon: "🩸", skillName: "Predação", skillDescription: "Mais dano em alvos feridos" },
};

export const PASSIVAS: Record<string, ComponentTemplate> = {
  P1: { id: "P1", name: "Passiva da Floresta", type: "PASSIVA", law: "LYSS", icon: "🌲", skillName: "Memória", skillDescription: "+Cura recebida" },
  P2: { id: "P2", name: "Passiva da Montanha", type: "PASSIVA", law: "DHOR", icon: "⛰️", skillName: "Granito", skillDescription: "+DEF" },
  P3: { id: "P3", name: "Passiva do Deserto", type: "PASSIVA", law: "PRIME", icon: "🏜️", skillName: "Resistência", skillDescription: "+Resist calor" },
  P4: { id: "P4", name: "Passiva do Cume", type: "PASSIVA", law: "RAAN", icon: "🌬️", skillName: "Vento", skillDescription: "+Velocidade" },
  P5: { id: "P5", name: "Passiva da Aurora", type: "PASSIVA", law: "ASTER", icon: "🌅", skillName: "Alvorecer", skillDescription: "+Cura aliados" },
  P6: { id: "P6", name: "Passiva da Névoa", type: "PASSIVA", law: "NOCTHAR", icon: "🌫️", skillName: "Névoa", skillDescription: "+Esquiva" },
  P7: { id: "P7", name: "Passiva do Vulcão", type: "PASSIVA", law: "KAELOR", icon: "🌋", skillName: "Fúria", skillDescription: "+Dano fogo" },
  P8: { id: "P8", name: "Passiva das Estações", type: "PASSIVA", law: "CHRONOS", icon: "🍂", skillName: "Ritmo", skillDescription: "+Recarga" },
  P9: { id: "P9", name: "Passiva da Encruzilhada", type: "PASSIVA", law: "VORO", icon: "🛤️", skillName: "Ceticismo", skillDescription: "+Crítico" },
  P10: { id: "P10", name: "Passiva da Biblioteca", type: "PASSIVA", law: "VEYRA", icon: "🏛️", skillName: "Erudição", skillDescription: "+XP" },
  P11: { id: "P11", name: "Passiva das Ruínas", type: "PASSIVA", law: "VEYRA", icon: "🏚️", skillName: "Eco", skillDescription: "+Drops raros" },
  P12: { id: "P12", name: "Passiva da Forja", type: "PASSIVA", law: "SYNTHES", icon: "⚒️", skillName: "Forja", skillDescription: "+Crafting" },
};

export const ALL_COMPONENTS: Record<string, ComponentTemplate> = { ...ATAQUES, ...SUPORTES, ...PASSIVAS };