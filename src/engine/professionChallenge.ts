import type { Character, Precision } from "../types";
import { MINING_NODES, FISHING_SPOTS, FISHING_BAIT, professionCooldown } from "../data/professions";
import { countByTemplate } from "./inventory";
import { canEnterZone } from "./journey";
import { PROFESSION_PULSE_MS, professionPrecisionAt } from "./professionPrecision";
import { generateId } from "../utils/id";

export type GatheringKind = "MINERACAO" | "PESCA";
export interface ProfessionChallenge {
  id: string; kind: GatheringKind; targetId: string; target: number;
  createdAt: number; startsAt: number; expiresAt: number;
  baitId?: string;
}
export interface PreparedProfessionChallenge {
  success: boolean; error?: string; challenge?: ProfessionChallenge; serverNow?: number;
}
export const PROFESSION_LEAD_MS = 1200;
// A confirmação passa por Supabase e pode levar alguns segundos em celular.
// A janela continua curta o bastante para exigir atenção, mas não transforma
// latência normal em uma falha inevitável.
export const PROFESSION_DELIVERY_GRACE_MS = 5000;

/** Checks entry without producing a temporary drop or consuming any resource. */
export function gatheringAccessError(c: Character, kind: GatheringKind, targetId: string, now: number, baitId?: string): string | undefined {
  const mining = kind === "MINERACAO";
  const point = mining ? MINING_NODES.find(node => node.id === targetId) : FISHING_SPOTS.find(spot => spot.id === targetId);
  if (!point) return "Ponto de coleta inválido.";
  if (!canEnterZone(c, point.zoneId)) return "Conclua a travessia deste bioma em Jornadas antes de coletar.";
  const skill = Number(mining ? c.professions?.mining ?? 0 : c.professions?.fishing ?? 0);
  if (skill < point.requiredSkill) return `Requer ${mining ? "mineração" : "pesca"} ${point.requiredSkill}.`;
  const tier = mining ? (point as typeof MINING_NODES[number]).tier : (point as typeof FISHING_SPOTS[number]).rodTier;
  const tool = mining ? c.equippedMiningTool : c.equippedFishingRod;
  if (!tool || tool.category !== "FERRAMENTA" || tool.profession !== kind || Number(tool.tier ?? 0) < tier) return `Equipe ${mining ? "picareta" : "vara"} T${tier} ou superior.`;
  const last = Number(mining ? c.professions?.lastMiningAt ?? 0 : c.professions?.lastFishingAt ?? 0);
  const remaining = professionCooldown(skill) - (now - last);
  if (remaining > 0) return `Aguarde ${Math.ceil(remaining / 1000)}s antes de coletar novamente.`;
  if (baitId !== undefined && (mining || baitId !== FISHING_BAIT.templateId)) return "Isca inválida para esta coleta.";
  if (baitId && countByTemplate(c.inventory, baitId) < FISHING_BAIT.quantity) return "A isca escolhida não está mais na mochila.";
}
export function prepareGathering(c: Character, previous: ProfessionChallenge | undefined, kind: GatheringKind, targetId: string, now: number, baitId?: string): PreparedProfessionChallenge {
  if (previous && previous.expiresAt > now) return { success: false, error: "Conclua ou cancele o pulso de coleta atual." };
  const error = gatheringAccessError(c, kind, targetId, now, baitId);
  if (error) return { success: false, error };
  const startsAt = now + PROFESSION_LEAD_MS;
  return { success: true, serverNow: now, challenge: {
    id: generateId(), kind, targetId, target: 0.4 + Math.random() * 0.35,
    createdAt: now, startsAt, expiresAt: startsAt + PROFESSION_PULSE_MS + PROFESSION_DELIVERY_GRACE_MS, ...(baitId ? { baitId } : {}),
  } };
}
/** Grading uses the receipt time; neither a client score nor a client timestamp is accepted. */
export function resolveGathering(challenge: ProfessionChallenge | undefined, id: string, now: number): { success: boolean; error?: string; precision?: Precision } {
  if (!challenge || challenge.id !== id) return { success: false, error: "Este pulso de coleta não está mais disponível." };
  if (now < challenge.startsAt) return { success: false, error: "O pulso ainda não começou. Segure até o marcador avançar." };
  if (now >= challenge.expiresAt) return { success: false, error: "O pulso expirou. Inicie uma nova coleta." };
  return { success: true, precision: professionPrecisionAt(now - challenge.startsAt, challenge.target) };
}
