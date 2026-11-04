import { CharacterAppearance } from "../types";

/**
 * Até que os atlas individuais de cabelo/roupa estejam prontos, aplica uma
 * variação visual consistente ao sprite humano base. Linhagens transformadas
 * continuam usando suas próprias artes e não recebem este filtro.
 */
export function appearanceStyle(appearance?: CharacterAppearance) {
  if (!appearance) return undefined;
  const skin = {
    CLARA: "brightness(1.12) saturate(.82)",
    MORENA: "brightness(.94) saturate(1.02)",
    ESCURA: "brightness(.78) saturate(1.08)",
    AZUL_ESSENCIA: "hue-rotate(150deg) saturate(1.3) brightness(1.02)",
  }[appearance.skin] ?? "";
  const hair = {
    NEGRO: "contrast(1.04)",
    CASTANHO: "sepia(.18) saturate(1.08)",
    RUIVO: "sepia(.42) saturate(1.5) hue-rotate(320deg)",
    PRATEADO: "grayscale(.62) brightness(1.18)",
    AZUL: "hue-rotate(170deg) saturate(1.22)",
  }[appearance.hairColor] ?? "";
  const outfit = {
    OCRE: "",
    AZUL: "hue-rotate(185deg) saturate(1.08)",
    VIOLETA: "hue-rotate(260deg) saturate(1.18)",
    VERDE: "hue-rotate(78deg) saturate(1.12)",
  }[appearance.outfitColor] ?? "";
  return { filter: [skin, hair, outfit].filter(Boolean).join(" ") || undefined };
}

export function appearanceLabel(appearance?: CharacterAppearance) {
  if (!appearance) return "Humano do Refúgio";
  return `${appearance.body === "FEMININO" ? "Aventureira" : "Aventureiro"} · ${appearance.outfit}`;
}
