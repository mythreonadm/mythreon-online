import { Race } from "../types";
import { findNamedRace } from "../data/races";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";

export function synthesizeRace(
  ataqueId: string,
  suporteId: string,
  passivaId: string
): Race {
  // Tenta achar nomeada
  const named = findNamedRace(ataqueId, suporteId, passivaId);
  if (named) return named;

  // Gera comum
  const a = ATAQUES[ataqueId];
  const s = SUPORTES[suporteId];
  const p = PASSIVAS[passivaId];

  const prefix = a.name.split(" ")[0];
  const suffix = s.name.split(" ")[0];
  const title = p.name.replace("Passiva d", "").replace("Passiva do", "d");

  return {
    id: `RC-${ataqueId}-${suporteId}-${passivaId}`,
    name: `${prefix} / ${suffix} / ${title}`,
    tier: "COMUM",
    ataqueId,
    suporteId,
    passivaId,
    skills: {
      ataque: a.skillName,
      suporte: s.skillName,
      passiva: p.skillName,
    },
    bonus: { hp: 20, atk: 2, matk: 2 },
  };
}