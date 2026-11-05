import type { Item } from "../types";

/**
 * Centraliza os nomes possíveis das artes de itens.
 *
 * O jogo aceita as três extensões que usamos no pipeline de arte (.png, .gif
 * e .giff). Alguns assets antigos foram salvos com um alias ou com a extensão
 * repetida (por exemplo `OVO_BESTA_T1.png.png`); manter isso aqui evita que
 * cada tela tenha uma regra diferente.
 */
const ITEM_ALIASES: Record<string, string[]> = {
  SKIN_CAPA_PRIMEIRO_CANTO: ["SKIN_PREMIUM_MES_01"],
  ISCA_CICATRIZ: ["ISCA_RARA"],
  PEIXE_RIO: ["PEIXE_RIO_LYSS"],
  OVO_BESTA_T1: ["OVO_BESTA_T1.png"],
  OVO_BESTA_T2: ["OVO_BESTA_T2.png"],
  OVO_BESTA_T3: ["OVO_BESTA_T3.png"],
  OVO_BESTA_T4: ["OVO_BESTA_T4.png"],
  OVO_BESTA_T5: ["OVO_BESTA_T5.png"],
  OVO_BESTA_MYTHREON: ["OVO_BESTA_MYTHREON.PNG"],
  A1: ["PRESA_LOBO_FERAL"],
  A2: ["FERRAO_VESPA"],
  A3: ["CHAMA_ESPECTRO"],
  A4: ["GARRA_URSO"],
  A5: ["PECONHA_SERPENTE"],
  A6: ["LAMINA_BANDIDO"],
  A7: ["ESPINHO_PLANTA"],
  A8: ["MANDIBULA_HIENA"],
  A9: ["NUCLEO_GOLEM"],
  A10: ["PENA_FALCAO"],
  A11: ["CRISTAL_GELO"],
  A12: ["TENTACULO_ABISSAL"],
  A13: ["FRAGMENTO_TEMPESTADE"],
  A14: ["PRESA_VERME_ABISSAL"],
  A15: ["FRAGMENTO_ASTERION"],
  A16: ["GLANDULA_MIASMA"],
  A17: ["ASA_LIBELULA_LAMINA"],
  A18: ["NO_MEMORIA"],
  A19: ["DENTE_SILTE"],
  A20: ["COROA_LODO"],
  S1: ["NUCLEO_LYSS"],
  S2: ["NUCLEO_EMOHNA"],
  S3: ["NUCLEO_ASTER"],
  S4: ["NUCLEO_NOCTHAR"],
  S5: ["NUCLEO_CHRONOS"],
  S6: ["NUCLEO_VEYRA"],
  S7: ["NUCLEO_DHOR"],
  S8: ["NUCLEO_RAAN"],
  S9: ["NUCLEO_KAELOR"],
  S10: ["NUCLEO_LOGHIS"],
  S11: ["NUCLEO_PRIME"],
  S12: ["NUCLEO_SYNTHES"],
  S13: ["NUCLEO_VORO"],
  S14: ["NUCLEO_MIASMA"],
  S15: ["NUCLEO_LAMINA"],
  S16: ["NUCLEO_MEMORIA"],
  S17: ["NUCLEO_SILTE"],
  S18: ["NUCLEO_MATRIARCA"],
  P1: ["PASSIVA_FLORESTA"],
  P2: ["PASSIVA_MONTANHA"],
  P3: ["PASSIVA_DESERTO"],
  P4: ["PASSIVA_CUME"],
  P5: ["PASSIVA_AURORA"],
  P6: ["PASSIVA_NEBLINA"],
  P7: ["PASSIVA_VULCAO"],
  P8: ["PASSIVA_ESTACOES"],
  P9: ["PASSIVA_ENCRUZILHADA"],
  P10: ["PASSIVA_BIBLIOTECA"],
  P11: ["PASSIVA_RUINAS"],
  P12: ["PASSIVA_FORJA"],
  P13: ["PASSIVA_PANTANO"],
  P14: ["PASSIVA_RESINA"],
};

function toAssetPath(name: string, extension: string) {
  return /\.(?:png|gif|giff)$/i.test(name)
    ? `/assets/items/${name}`
    : `/assets/items/${name}.${extension}`;
}

/** Retorna candidatos ordenados: animação primeiro, depois PNG e aliases. */
export function itemAssetCandidates(itemOrTemplateId: Pick<Item, "templateId"> | string): string[] {
  const templateId = typeof itemOrTemplateId === "string" ? itemOrTemplateId : itemOrTemplateId.templateId;
  const names = [templateId, ...(ITEM_ALIASES[templateId] ?? [])];
  const candidates = names.flatMap(name => [
    toAssetPath(name, "gif"),
    toAssetPath(name, "giff"),
    toAssetPath(name, "png"),
  ]);
  return [...new Set(candidates)];
}

