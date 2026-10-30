// src/data/lineages.ts

export interface Lineage {
  id: string;
  name: string;
  attackId: string;
  sprite: string;
  emoji: string;
  description: string;
  color: string;
}

export const LINEAGES: Record<string, Lineage> = {
  A1: { 
    id: "LUPINO", name: "Lupino Feral", attackId: "A1", 
    sprite: "/assets/players/lupino.png", emoji: "🐺", 
    description: "Guerreiro lupino com armadura de couro e pelos.", color: "text-gray-400" 
  },
  A2: { 
    id: "VESPIDEO", name: "Vespídeo", attackId: "A2", 
    sprite: "/assets/players/vespideo.png", emoji: "🐝", 
    description: "Humanoide com carapaça e asas de vespa.", color: "text-yellow-400" 
  },
  A3: { 
    id: "ESPECTRAL", name: "Espectral", attackId: "A3", 
    sprite: "/assets/players/espectral.png", emoji: "👻", 
    description: "Humanoide envolvido em chamas espectrais.", color: "text-blue-400" 
  },
  A4: { 
    id: "URSIDEO", name: "Ursídeo", attackId: "A4", 
    sprite: "/assets/players/ursideo.png", emoji: "🐻", 
    description: "Guerreiro robusto com armadura de urso.", color: "text-orange-600" 
  },
  A5: { 
    id: "OFIDIANO", name: "Ofidiano", attackId: "A5", 
    sprite: "/assets/players/ofidiano.png", emoji: "🐍", 
    description: "Humanoide serpentino com escamas e capuz.", color: "text-green-500" 
  },
  A6: { 
    id: "RENEGADO", name: "Renegado", attackId: "A6", 
    sprite: "/assets/players/renegado.png", emoji: "🥷", 
    description: "Combatente mercenário com capuz e couro.", color: "text-gray-300" 
  },
  A7: { 
    id: "SILVANO", name: "Silvano", attackId: "A7", 
    sprite: "/assets/players/silvano.png", emoji: "🌿", 
    description: "Humanoide com armadura vegetal e espinhos.", color: "text-emerald-400" 
  },
  A8: { 
    id: "HIENIDEO", name: "Hienídeo", attackId: "A8", 
    sprite: "/assets/players/hienideo.png", emoji: "🐕", 
    description: "Humanoide selvagem com armadura de ossos.", color: "text-purple-400" 
  },
  A9: { 
    id: "GOLEMIANO", name: "Golemiano", attackId: "A9", 
    sprite: "/assets/players/golemiano.png", emoji: "🗿", 
    description: "Humanoide com placas de pedra e núcleo energético.", color: "text-gray-500" 
  },
  A10: { 
    id: "AVIARO", name: "Aviário", attackId: "A10", 
    sprite: "/assets/players/aviario.png", emoji: "🦅", 
    description: "Humanoide com penas, asas e características de falcão.", color: "text-cyan-400" 
  },
  A11: { 
    id: "GLACIANO", name: "Glaciano", attackId: "A11", 
    sprite: "/assets/players/glaciano.png", emoji: "🧊", 
    description: "Humanoide revestido de cristais congelados.", color: "text-blue-300" 
  },
  A12: { 
    id: "ABISSAL", name: "Abissal", attackId: "A12", 
    sprite: "/assets/players/abissal.png", emoji: "🐙", 
    description: "Humanoide sombrio com tentáculos e olhos luminosos.", color: "text-purple-600" 
  },
  A13: { 
    id: "TEMPESTARIO", name: "Tempestário", attackId: "A13", 
    sprite: "/assets/players/tempestario.png", emoji: "⚡", 
    description: "Humanoide energético com eletricidade incorporada.", color: "text-yellow-300" 
  },
  A14: { 
    id: "VERMÍDEO", name: "Vermídeo Abissal", attackId: "A14", 
    sprite: "/assets/players/vermideo.png", emoji: "🪱", 
    description: "Humanoide com armadura orgânica e textura de carapaça.", color: "text-red-700" 
  },
  A15: { 
    id: "ASTERIANO", name: "Asteriano", attackId: "A15", 
    sprite: "/assets/players/asteriano.png", emoji: "☄️", 
    description: "Humanoide celestial com armadura dourada.", color: "text-arcane-gold" 
  }
};

// Fallback para quando não há raça equipada
export const HUMAN_LINEAGE: Lineage = {
  id: "HUMANO", name: "Humano Comum", attackId: "NONE",
  sprite: "/assets/players/humano.png", emoji: "🧑",
  description: "Um iniciante sem linhagem especial.", color: "text-gray-300"
};

export function getLineageByAttack(attackId?: string): Lineage {
  if (!attackId) return HUMAN_LINEAGE;
  return LINEAGES[attackId] || HUMAN_LINEAGE;
}