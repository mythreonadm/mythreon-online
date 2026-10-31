import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { VIALS } from "../data/vials";
import { getLineageByAttack } from "../data/lineages";
import { SlotType } from "../types";

const SLOTS: { key: SlotType; label: string; icon: string }[] = [
  { key: "CAPACETE", label: "Capacete", icon: "🎩" },
  { key: "ARMADURA", label: "Armadura", icon: "👕" },
  { key: "LUVAS", label: "Luvas", icon: "🧤" },
  { key: "CALCAS", label: "Calças", icon: "👖" },
  { key: "BOTAS", label: "Botas", icon: "👢" },
  { key: "COLAR", label: "Colar", icon: "📿" },
  { key: "ANEL_I", label: "Anel I", icon: "💍" },
  { key: "ANEL_II", label: "Anel II", icon: "💍" },
  { key: "ARMA_PRINCIPAL", label: "Arma", icon: "⚔️" },
  { key: "OFF_HAND", label: "Escudo", icon: "🛡️" },
];

const RARITY_BORDER: Record<string, string> = {
  COMUM: "border-gray-600",
  INCOMUM: "border-green-500 shadow-[0_0_6px_rgba(34,197,94,0.35)]",
  RARO: "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]",
  EPICO: "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.55)]",
  LENDARIO: "border-arcane-gold shadow-[0_0_14px_rgba(201,160,77,0.7)]",
};

export function Personagem() {
  const { character, unequip, unequipRace } = useGameStore();
  const [imgError, setImgError] = useState(false);
  if (!character) return null;

  const s = character.baseStats;
  const lineage = getLineageByAttack(character.activeRace?.ataqueId);

  const activeVials = Object.entries(character.activeVials || {})
    .filter(([_, time]) => time > Date.now())
    .map(([id]) => VIALS[id])
    .filter(Boolean);

  const formatStat = (val: number | undefined, isPct = false) => {
    if (val === undefined) return "0";
    if (isPct) return `${(val * 100).toFixed(1)}%`;
    return Math.round(val).toLocaleString();
  };

  const handleUnequipMatriz = () => {
    if (!character.activeRace) return;
    if (confirm("Desequipar a Matriz? Você perderá todos os bônus de raça. Isso libera o slot para usar Pets.")) {
      unequipRace();
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER — sprite + info + barras */}
      <div className="bg-gradient-to-r from-arcane-panel to-arcane-bg border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-arcane-bg rounded-full border-2 border-arcane-purple shadow-[0_0_20px_rgba(124,58,237,0.3)] overflow-hidden">
            {!imgError ? (
              <img
                key={lineage.id}
                src={lineage.sprite}
                alt={lineage.name}
                className="w-full h-full object-contain p-2"
                style={{ imageRendering: "pixelated" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-6xl">{lineage.emoji}</span>
            )}
          </div>
          <div className="flex-1 min-w-[220px]">
            <h1 className="text-2xl md:text-3xl font-bold text-arcane-gold">{character.name}</h1>
            <p className="text-sm text-arcane-cyan">
              Nível {character.level} · {lineage.name}
              {character.activeRace && ` · ${character.activeRace.name}`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <MiniBar label="HP" current={character.hp} max={character.hpMax} color="bg-gradient-to-r from-red-600 to-red-400" />
              <MiniBar label="MP" current={character.mp} max={character.mpMax} color="bg-gradient-to-r from-blue-600 to-blue-400" />
              <MiniBar label="XP" current={character.xp} max={character.xpToNext} color="bg-gradient-to-r from-yellow-600 to-arcane-gold" />
              <div className="text-xs">
                <div className="text-yellow-400 font-bold uppercase text-[10px]">💰 Ouro</div>
                <div className="text-white font-bold text-lg">{character.gold.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* COLUNA 1 — SLOTS */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">🎽 Equipamento</h2>
          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map(slot => {
              const item = character.equipped[slot.key];
              return (
                <div
                  key={slot.key}
                  onClick={() => item && unequip(slot.key)}
                  className={`relative bg-arcane-bg rounded-lg p-2 flex flex-col items-center transition-all border-2 ${
                    item
                      ? `${RARITY_BORDER[item.rarity]} cursor-pointer hover:border-red-500`
                      : "border-dashed border-arcane-border opacity-50 cursor-default"
                  }`}
                  title={item ? `Clique para desequipar: ${item.name}` : `${slot.label} (vazio)`}
                >
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{slot.label}</div>
                  <div className="text-2xl mb-1">{item?.icon ?? slot.icon}</div>
                  <div className="text-[10px] text-center truncate w-full font-bold" title={item?.name}>
                    {item?.name ?? "Vazio"}
                  </div>
                  {item && item.upgradeLevel > 0 && (
                    <div className="text-[9px] text-orange-400 font-bold">+{item.upgradeLevel}</div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-500 italic mt-3 text-center">Clique em um item equipado para desequipar.</p>
        </div>

        {/* COLUNA 2 — ATRIBUTOS */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">📊 Atributos</h2>

          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-red-400 uppercase font-bold mb-1 tracking-wider">⚔️ Ofensivos</div>
              <div className="space-y-1">
                <StatLine icon="⚔️" label="ATK" value={formatStat(s.atk)} />
                <StatLine icon="✨" label="MATK" value={formatStat(s.matk)} />
                <StatLine icon="🎯" label="Crítico" value={formatStat(s.crit, true)} />
                <StatLine icon="💥" label="Dano Crítico" value={formatStat(s.critDmg, true)} comingSoon />
                <StatLine icon="🎯" label="Precisão" value={formatStat(s.hit, true)} />
                <StatLine icon="⚡" label="Vel. Ataque" value={formatStat(s.spd, true)} />
              </div>
            </div>

            <div>
              <div className="text-[10px] text-blue-400 uppercase font-bold mb-1 tracking-wider">🛡️ Defensivos</div>
              <div className="space-y-1">
                <StatLine icon="❤️" label="HP" value={`${character.hp.toLocaleString()} / ${character.hpMax.toLocaleString()}`} />
                <StatLine icon="🔮" label="MP" value={`${character.mp.toLocaleString()} / ${character.mpMax.toLocaleString()}`} />
                <StatLine icon="🪨" label="Armadura" value={formatStat(s.arm)} />
                <StatLine icon="🛡️" label="Defesa" value={formatStat(s.def)} />
                <StatLine icon="💨" label="Esquiva" value={formatStat(s.dge, true)} />
                <StatLine icon="🛡️" label="Bloqueio" value={formatStat(s.blk, true)} />
                <StatLine icon="🔥" label="Res. Física" value={formatStat(s.resFisico, true)} />
                <StatLine icon="❄️" label="Res. Mágica" value={formatStat(s.resMagico, true)} />
              </div>
            </div>

            <div>
              <div className="text-[10px] text-purple-400 uppercase font-bold mb-1 tracking-wider">🔮 Utilidade</div>
              <div className="space-y-1">
                <StatLine icon="💚" label="Regen. HP" value={formatStat(s.hpRegen)} comingSoon />
                <StatLine icon="💙" label="Regen. MP" value={formatStat(s.mpRegen)} comingSoon />
                <StatLine icon="🍀" label="Sorte" value={formatStat(s.luck, true)} comingSoon />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 3 — BÔNUS + MATRIZ */}
        <div className="space-y-4">
          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">✨ Bônus Ativos</h2>

            {character.activeRace ? (
              <div className="bg-arcane-bg p-2 rounded border border-arcane-gold/30">
                <div className="text-[10px] text-arcane-gold uppercase font-bold">🎭 Raça</div>
                <div className="text-sm font-bold text-white">{character.activeRace.name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(character.activeRace.bonus).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-[9px] bg-green-900/30 border border-green-800/50 px-1.5 py-0.5 rounded text-green-400 font-bold"
                    >
                      +{typeof v === "number" && v % 1 === 0 ? v : (v as number).toFixed(2)} {k.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 italic py-3 text-xs">Nenhuma raça equipada. Vá para a Matriz.</div>
            )}

            {activeVials.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-[10px] text-arcane-cyan uppercase font-bold">🧪 Vials</div>
                {activeVials.map(v => (
                  <div key={v.id} className="flex justify-between text-xs bg-arcane-bg p-1.5 rounded">
                    <span className="text-white">{v.icon} {v.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 space-y-1">
              <div className="text-[10px] text-purple-400 uppercase font-bold">🐾 Pet</div>
              <div className="bg-arcane-bg p-2 rounded border border-purple-900/30 text-xs text-center text-gray-500 italic">
                Sistema de Pets em breve
              </div>
            </div>
          </div>

          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">🔮 Matriz</h2>
            {character.activeRace ? (
              <>
                <div className="text-xs text-gray-400 mb-2">
                  Raça ativa: <span className="text-white font-bold">{character.activeRace.name}</span>
                </div>
                <button
                  onClick={handleUnequipMatriz}
                  className="w-full bg-red-900/60 hover:bg-red-800 text-red-200 font-bold py-2 rounded-lg text-sm border border-red-700/50 transition-colors"
                >
                  ❌ Desequipar Matriz
                </button>
                <p className="text-[10px] text-gray-500 italic mt-2 text-center">
                  Desequipar libera o slot para usar Pets.
                </p>
              </>
            ) : (
              <div className="text-center text-gray-500 italic text-xs py-4">
                Nenhuma Matriz equipada — slot livre para Pets.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
        <span>{label}</span>
        <span>{Math.round(current)}/{Math.round(max)}</span>
      </div>
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatLine({ icon, label, value, comingSoon }: { icon: string; label: string; value: string; comingSoon?: boolean }) {
  return (
    <div className={`flex justify-between items-center text-xs bg-arcane-bg rounded px-2 py-1 ${comingSoon ? "opacity-60" : ""}`}>
      <span className="text-gray-400 flex items-center gap-1">
        <span>{icon}</span> {label}
        {comingSoon && <span className="text-[8px] text-yellow-600 font-bold">(em breve)</span>}
      </span>
      <span className={`font-bold ${comingSoon ? "text-gray-500" : "text-white"}`}>{value}</span>
    </div>
  );
}