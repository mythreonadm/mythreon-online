// The original drawings are arranged left to right, one pose per encounter.
// W3A and W3B belong to the same wave but are distinct encounters.
export const WAVE_SPRITE_SUFFIXES = ["W1", "W2", "W3A", "W3B", "BOSS"] as const;

const SHEETS: Record<string, string> = {
  VESPA: "vespa", ESPINHEIRO: "espinheiro", FALCAO: "fenix", JAVALI: "boar",
  FADA_CORROMPIDA: "fada", ARANHA_GIGANTE: "aranha",
  GOLEM: "golem", URSO: "urso", BANDIDO: "bandido", ELEMENTAL_GELO: "elemental de gelo",
  YETI: "yeti", MORCEGO_MAGMA: "morcego", CENTURIAO: "centuriao",
  CARANGUEJO: "caranguejo", SERPENTE: "serpente", MEDUSA: "medusa", SEREIA: "sereia",
  POLVO: "polvo", TRITAO: "tritao", ENGUIA_ELETRICA: "engia",
  HIENA: "hiena", SENTINELA: "sentinela de pedra", ESCORPIAO: "escorpiao",
  CULTISTA: "cultista", MUMIA: "mumia",
  CRIA_VAZIO: "cria", VERME: "verme", ABERRACAO: "aberracao", SOMBRA: "sombra",
  CEIFADOR_ALMAS: "ceifador", OLHO_VAZIO: "olho",
  SAPO_MIASMA: "sapo", LIBELULA_LAMINA: "libelula", CIPO_MEMORIA: "cipo", CROCODILO_SILTE: "crocodilo",
  ESCARAVELHO_VITREO: "escaravelho", ESPECTRO_SOLAR: "espectro solar", SERPENTE_MIRAGEM: "serpente absal",
};

const PORTRAITS: Record<string, string> = {
  ESPECTRO: "espectro", COLOSSO: "colosso", LEVIATA: "leviata", GUARDIAO: "guardiao",
  DEVORADOR: "devorador", MATRIARCA_LODO: "matriarca", SENTINELA_ZENITE: "sentinela",
};

const FLYING = new Set(["VESPA", "FALCAO", "MORCEGO_MAGMA", "FADA_CORROMPIDA", "LIBELULA_LAMINA"]);
const WRAITHS = new Set(["ESPECTRO", "ESPECTRO_SOLAR", "OLHO_VAZIO", "SOMBRA", "CRIA_VAZIO"]);
const HEAVY = new Set(["GOLEM", "GOLEM_OBSIDIANA", "COLOSSO", "SENTINELA", "SENTINELA_ZENITE", "CENTURIAO"]);

export function monsterMotion(baseId: string) {
  if (FLYING.has(baseId)) return "flying";
  if (WRAITHS.has(baseId)) return "spectral";
  if (HEAVY.has(baseId)) return "heavy";
  return "ground";
}

export interface MonsterAtlasCell {
  file: string;
  index: number;
  portrait: boolean;
  top: number;
  bottom: number;
}

const CROP: Record<string, { top?: number; bottom?: number }> = {
  vespa: { bottom: 0.73 },
  "sentinela de pedra": { top: 0.10, bottom: 0.744 },
  "serpente absal": { bottom: 0.736 },
  escorpiao: { top: 0.10 },
  cultista: { top: 0.10 },
  mumia: { top: 0.10 },
};

export function monsterAtlasCell(id: string): MonsterAtlasCell | undefined {
  const cleanId = id.replace(/_ELITE$/, "");
  if (Object.prototype.hasOwnProperty.call(PORTRAITS, cleanId)) {
    return { file: PORTRAITS[cleanId], index: 0, portrait: true, top: 0, bottom: 1 };
  }
  const match = /^(.*)_(W1|W2|W3A|W3B|BOSS)$/.exec(cleanId);
  if (!match || !Object.prototype.hasOwnProperty.call(SHEETS, match[1])) return;
  const file = SHEETS[match[1]];
  return {
    file, index: WAVE_SPRITE_SUFFIXES.findIndex(suffix => suffix === match[2]),
    portrait: false, top: CROP[file]?.top ?? 0, bottom: CROP[file]?.bottom ?? 0.706,
  };
}
