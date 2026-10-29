import React from "react";
import { Race } from "../types";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";
import { ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";
import { RACE_LORE } from "../data/races";

interface Props {
  race: Race;
  isEquipped: boolean;
  onEquip: () => void;
  onClose: () => void;
}

export function RaceModal({ race, isEquipped, onEquip, onClose }: Props) {
  const atkComp = ATAQUES[race.ataqueId];
  const supComp = SUPORTES[race.suporteId];
  const pasComp = PASSIVAS[race.passivaId];

  const atkEffect = ATTACK_SKILLS[race.ataqueId];
  const supEffect = SUPPORT_EFFECTS[race.suporteId];
  const pasEffect = PASSIVE_EFFECTS[race.passivaId];

  const formatBonus = (val: number) => val < 1 ? `${(val * 100).toFixed(1)}%` : val;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-arcane-panel border-2 border-arcane-purple rounded-2xl p-6 max-w-xl w-full shadow-[0_0_40px_rgba(124,58,237,0.3)] relative" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold text-xl">✕</button>

        <div className="text-center mb-6 border-b border-arcane-border pb-4">
          <h2 className={`text-2xl font-bold ${race.tier === "NOMEADA" ? "text-arcane-gold" : "text-white"}`}>{race.name}</h2>
          <p className="text-xs text-arcane-cyan uppercase tracking-widest">{race.tier}</p>
          {race.tier === "NOMEADA" && <p className="text-sm italic text-gray-400 mt-2">"{RACE_LORE[race.id]}"</p>}
        </div>

        {/* Habilidades */}
        <div className="space-y-3 mb-6">
          <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{atkComp?.icon}</span>
              <span className="font-bold text-red-400">Ataque: {atkComp?.skillName}</span>
            </div>
            <p className="text-xs text-gray-300 ml-8">{atkEffect?.desc}</p>
          </div>
          <div className="bg-green-900/20 border border-green-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{supComp?.icon}</span>
              <span className="font-bold text-green-400">Suporte: {supComp?.skillName}</span>
            </div>
            <p className="text-xs text-gray-300 ml-8">{supEffect?.desc}</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{pasComp?.icon}</span>
              <span className="font-bold text-yellow-400">Passiva: {pasComp?.skillName}</span>
            </div>
            <p className="text-xs text-gray-300 ml-8">{pasEffect?.desc}</p>
          </div>
        </div>

        {/* Bônus Únicos */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Bônus Exclusivos da Raça:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(race.bonus).map(([stat, value]) => {
              if (!value) return null;
              return (
                <span key={stat} className="bg-arcane-bg border border-arcane-border px-3 py-1 rounded-full text-sm">
                  <span className="text-gray-500 uppercase text-xs mr-1">{stat}:</span>
                  <span className="text-green-400 font-bold">+{formatBonus(value as number)}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">Fechar</button>
          {!isEquipped && (
            <button onClick={onEquip} className="flex-1 bg-arcane-purple hover:bg-arcane-purple/80 text-white font-bold py-3 rounded-lg shadow-lg">
              Equipar Raça
            </button>
          )}
        </div>
      </div>
    </div>
  );
}