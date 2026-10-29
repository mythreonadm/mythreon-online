import React from "react";
import { useGameStore } from "../store/gameStore";
import { SlotType } from "../types";

const SLOTS: { key: SlotType; label: string; icon: string }[] = [
  { key: "CAPACETE", label: "Capacete", icon: "🎩" }, { key: "ARMADURA", label: "Armadura", icon: "👕" },
  { key: "LUVAS", label: "Luvas", icon: "🧤" }, { key: "CALCAS", label: "Calças", icon: "👖" },
  { key: "BOTAS", label: "Botas", icon: "👢" }, { key: "COLAR", label: "Colar", icon: "📿" },
  { key: "ANEL_I", label: "Anel I", icon: "💍" }, { key: "ANEL_II", label: "Anel II", icon: "💍" },
  { key: "ARMA_PRINCIPAL", label: "Arma", icon: "⚔️" }, { key: "OFF_HAND", label: "Escudo", icon: "🛡️" },
];

export function Equipment() {
  const { character, unequip } = useGameStore();
  if (!character) return null;

  return (
    <div className="space-y-6">
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-arcane-gold mb-6 border-b border-arcane-border pb-4">Equipamento</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SLOTS.map((s) => {
            const item = character.equipped[s.key];
            return (
              <div key={s.key} onClick={() => item && unequip(s.key)} className={`bg-arcane-bg border rounded-lg p-3 flex flex-col items-center transition-all ${item ? "border-arcane-gold cursor-pointer hover:border-red-500 hover:shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "border-arcane-border border-dashed opacity-50"}`}>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-3xl mb-2">{item?.icon ?? s.icon}</div>
                <div className="text-xs text-center truncate w-full font-bold">{item?.name ?? "Vazio"}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-arcane-gold mb-6 border-b border-arcane-border pb-4">Atributos Base</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-sm">
          <Stat label="Ataque Físico" value={character.baseStats.atk ?? 0} icon="⚔️" />
          <Stat label="Ataque Mágico" value={character.baseStats.matk ?? 0} icon="✨" />
          <Stat label="Defesa (Esquiva)" value={character.baseStats.def ?? 0} icon="🛡️" />
          <Stat label="Armadura" value={character.baseStats.arm ?? 0} icon="🪨" />
          <Stat label="Crítico" value={`${Math.round((character.baseStats.crit ?? 0) * 100)}%`} icon="🎯" />
          <Stat label="Esquiva" value={`${Math.round((character.baseStats.dge ?? 0) * 100)}%`} icon="💨" />
          <Stat label="Bloqueio" value={`${Math.round((character.baseStats.blk ?? 0) * 100)}%`} icon="🛡️" />
          <Stat label="Velocidade" value={`+${Math.round((character.baseStats.spd ?? 0) * 100)}%`} icon="⚡" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: any) {
  return (
    <div className="bg-arcane-bg border border-arcane-border rounded-lg p-3 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div><div className="text-xs text-gray-400">{label}</div><div className="font-bold text-white text-lg">{value}</div></div>
    </div>
  );
}