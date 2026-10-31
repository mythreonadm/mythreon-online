import { Element } from "../types";

export const ELEMENTS: { id: Element; name: string; icon: string }[] = [
  { id: "FOGO", name: "Fogo", icon: "🔥" }, { id: "ELETRICIDADE", name: "Eletricidade", icon: "⚡" },
  { id: "VENTO", name: "Vento", icon: "🌪️" }, { id: "TERRA", name: "Terra", icon: "🪨" },
  { id: "AGUA", name: "Água", icon: "🌊" }, { id: "GELO", name: "Gelo", icon: "❄️" },
  { id: "MORTE", name: "Morte", icon: "☠️" }, { id: "SAGRADO", name: "Sagrado", icon: "✨" },
  { id: "PSIQUICO", name: "Psíquico", icon: "🔮" }, { id: "VENENO", name: "Veneno", icon: "☣️" },
  { id: "METAL", name: "Metal", icon: "⚙️" }, { id: "BASE", name: "Base", icon: "⚔️" },
];

// Relações próprias de Mythreon, inspiradas em sistemas de afinidade elementar.
const ADVANTAGES: Partial<Record<Element, Element[]>> = {
  FOGO: ["GELO", "METAL"], ELETRICIDADE: ["AGUA", "VENTO"], VENTO: ["TERRA", "VENENO"],
  TERRA: ["ELETRICIDADE", "METAL", "FOGO"], AGUA: ["FOGO", "TERRA"], GELO: ["VENTO", "TERRA"],
  MORTE: ["SAGRADO", "PSIQUICO"], SAGRADO: ["MORTE", "VENENO"], PSIQUICO: ["VENENO", "MORTE"],
  VENENO: ["AGUA", "VENTO"], METAL: ["GELO", "PSIQUICO"], BASE: [],
};

export function elementMultiplier(attack?: Element, defense?: Element): number {
  if (!attack || !defense || attack === "BASE" || defense === "BASE") return 1;
  if (ADVANTAGES[attack]?.includes(defense)) return 1.25;
  if (ADVANTAGES[defense]?.includes(attack)) return 0.75;
  return 1;
}

export function elementName(element?: Element): string { return ELEMENTS.find(entry => entry.id === element)?.name ?? "Base"; }

export function attackElement(attackId?: string): Element {
  const byAttack: Record<string, Element> = {
    A1: "BASE", A2: "VENENO", A3: "FOGO", A4: "BASE", A5: "VENENO", A6: "METAL", A7: "VENTO", A8: "MORTE",
    A9: "TERRA", A10: "PSIQUICO", A11: "GELO", A12: "AGUA", A13: "ELETRICIDADE", A14: "MORTE", A15: "SAGRADO",
  };
  return byAttack[attackId ?? ""] ?? "BASE";
}
