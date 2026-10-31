import React from "react";
import type { Character, CharacterSkills } from "../types";
import { useGameStore } from "../store/gameStore";

type StatKey = keyof CharacterSkills;

const STAT_OPTIONS: { key: StatKey; icon: string; label: string; description: string; bonus: string }[] = [
  { key: "melee", icon: "⚔️", label: "Melee", description: "Aprimore golpes físicos e combate corpo a corpo.", bonus: "+3 ATK físico por ponto" },
  { key: "distance", icon: "🏹", label: "Distância", description: "Especialize-se em arco e ataques de precisão.", bonus: "+3 ATK com arco e +0,5% precisão" },
  { key: "magic", icon: "🔮", label: "Magia", description: "Fortaleça suas habilidades arcanas.", bonus: "+3 MATK por ponto" },
  { key: "defense", icon: "🛡️", label: "Defesa", description: "Aguente mais dano e permaneça na batalha.", bonus: "+2 ARM e +1 DEF por ponto" },
  { key: "soul", icon: "🧘", label: "Alma", description: "Estenda o tempo máximo da caça offline.", bonus: "+15 min offline por ponto" },
];

const MAGIC_MATRICES = new Set(["A3", "A11", "A12", "A13", "A15"]);
const DEFENSIVE_SUPPORTS = new Set(["S1", "S4", "S7", "S9"]);
const DEFENSIVE_PASSIVES = new Set(["P2", "P3", "P5", "P6"]);

function recommendStat(character: Character): StatKey {
  if (character.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO")) return "distance";
  const matrix = character.activeRace;
  if (!matrix) return "melee";
  if (MAGIC_MATRICES.has(matrix.ataqueId)) return "magic";
  if (DEFENSIVE_SUPPORTS.has(matrix.suporteId) || DEFENSIVE_PASSIVES.has(matrix.passivaId)) return "defense";
  return "melee";
}

export function StatAllocation() {
  const { character, spendStatPoint } = useGameStore();
  if (!character) return null;

  const available = character.statPoints ?? 0;
  const recommendation = recommendStat(character);
  const matrixName = character.activeRace?.name;

  return (
    <section className="rounded-xl border border-arcane-gold/30 bg-gradient-to-br from-arcane-panel via-arcane-bg to-black/40 p-4 shadow-lg md:p-5" aria-labelledby="stat-allocation-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-arcane-border pb-3">
        <div>
          <h2 id="stat-allocation-title" className="text-xl font-bold text-arcane-gold">✦ Pontos de Status</h2>
          <p className="mt-1 text-xs text-gray-400">Cada level concede 1 ponto. A Matriz sugere um caminho; a decisão é sua.</p>
        </div>
        <div className="rounded-lg border border-arcane-gold/40 bg-black/30 px-4 py-2 text-center">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Disponíveis</span>
          <strong className="text-2xl text-arcane-gold">{available}</strong>
        </div>
      </div>

      {matrixName && <p className="mb-3 text-xs text-arcane-cyan">Matriz ativa: <strong>{matrixName}</strong>. Você pode investir em qualquer atributo.</p>}
      {!matrixName && <p className="mb-3 text-xs text-gray-500">Equipe uma Matriz para receber uma recomendação de sinergia.</p>}

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {STAT_OPTIONS.map((stat) => {
          const suggested = stat.key === recommendation;
          return (
            <article key={stat.key} className={`rounded-lg border p-3 transition-colors ${suggested ? "border-arcane-cyan/70 bg-cyan-950/20" : "border-arcane-border bg-black/20"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2"><span className="text-xl">{stat.icon}</span><h3 className="font-bold text-white">{stat.label}</h3></div>
                {suggested && <span className="rounded bg-cyan-950/70 px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-cyan-300">Sugestão</span>}
              </div>
              <p className="mt-2 min-h-[34px] text-[10px] leading-relaxed text-gray-400">{stat.description}</p>
              <p className="mt-2 text-[10px] font-bold text-arcane-cyan">{stat.bonus}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-xs text-gray-400">Nível {character.skills[stat.key]}</span>
                <button type="button" disabled={available < 1} onClick={() => spendStatPoint(stat.key)} className="rounded-md border border-arcane-gold/50 px-3 py-1 text-xs font-black text-arcane-gold transition hover:bg-arcane-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-35" aria-label={`Investir 1 ponto em ${stat.label}`}>+1</button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-gray-500">Melee, Distância, Magia, Defesa e Alma também evoluem com treino. Pontos investidos são permanentes nesta versão.</p>
    </section>
  );
}
