// ... (mantenha o NOMEADAS_RACES, SUPPORT_TITLES, PASSIVE_SUFFIXES e RACE_LORE iguais)

const ATAQUE_NOMES_CURTOS: Record<string, string> = {
  // ... (mantenha igual)
};

export function generateRaceName(ataqueId: string, suporteId: string, passivaId: string): string {
  const atk = ATAQUE_NOMES_CURTOS[ataqueId] || "Raça";
  const title = SUPPORT_TITLES[suporteId] || "do Vazio";
  const suffix = PASSIVE_SUFFIXES[passivaId] || "Eterna";
  return `${atk} ${title} ${suffix}`;
}

export function generateRaceId(ataqueId: string, suporteId: string, passivaId: string): string {
  return `RC-${ataqueId}-${suporteId}-${passivaId}`;
}

// NOVO: Fórmula que gera bônus diferentes para cada raça híbrida
export function generateRaceBonus(ataqueId: string, suporteId: string, passivaId: string) {
  const bonus: any = {};
  
  // Ataque contribui com ATK/MATK
  bonus.atk = 10 + (parseInt(ataqueId.replace("A", "")) * 2);
  bonus.matk = 10 + (parseInt(ataqueId.replace("A", "")) * 1.5);

  // Suporte contribui com HP/MP
  bonus.hp = 50 + (parseInt(suporteId.replace("S", "")) * 10);
  bonus.mp = 20 + (parseInt(suporteId.replace("S", "")) * 5);

  // Passiva contribui com Crit/Esquiva
  bonus.crit = 0.02 + (parseInt(passivaId.replace("P", "")) * 0.005);
  bonus.dge = 0.02 + (parseInt(passivaId.replace("P", "")) * 0.005);

  return bonus;
}

// ... (findNamedRace e MATRIX_STATS mantidos)