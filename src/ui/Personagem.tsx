import React, { useState } from "react";
import { AssetImage } from "./AssetImage";
import { useGameStore } from "../store/gameStore";
import { VIALS } from "../data/vials";
import { getLineageByAttack } from "../data/lineages";
import { SlotType } from "../types";
import { ItemIcon } from "./ItemIcon";
import { StatAllocation } from "./StatAllocation";
import { DIVINE_BEASTS } from "../data/divineBeasts";
import { ItemModal } from "./ItemModal";
import { Item } from "../types";
import { ELEMENTS } from "../data/elementalChart";

const SLOTS: { key: SlotType; label: string; icon: string; column: number; row: number }[] = [
  { key: "CAPACETE", label: "Capacete", icon: "🎩", column: 2, row: 1 },
  { key: "ARMA_PRINCIPAL", label: "Arma", icon: "⚔️", column: 1, row: 2 },
  { key: "ARMADURA", label: "Armadura", icon: "👕", column: 2, row: 2 },
  { key: "OFF_HAND", label: "Escudo", icon: "🛡️", column: 3, row: 2 },
  { key: "LUVAS", label: "Luvas", icon: "🧤", column: 1, row: 3 },
  { key: "CALCAS", label: "Calças", icon: "👖", column: 2, row: 3 },
  { key: "BOTAS", label: "Botas", icon: "👢", column: 3, row: 3 },
  { key: "COLAR", label: "Colar", icon: "📿", column: 1, row: 4 },
  { key: "ANEL_I", label: "Anel I", icon: "💍", column: 2, row: 4 },
  { key: "ANEL_II", label: "Anel II", icon: "💍", column: 3, row: 4 },
  { key: "MUNICAO", label: "Flechas", icon: "🏹", column: 2, row: 5 },
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
  const [slotPicker, setSlotPicker] = useState<SlotType | null>(null);
  const [inspectItem, setInspectItem] = useState<Item | null>(null);
  if (!character) return null;

  const s = character.baseStats;
  const lineage = getLineageByAttack(character.activeRace?.ataqueId);
  const activeBeast = character.activeDivineBeastId ? DIVINE_BEASTS[character.activeDivineBeastId] : undefined;
  const equippedInPicker = slotPicker ? character.equipped[slotPicker] : undefined;
  const compatibleItems = slotPicker ? character.inventory.items.filter(item => slotPicker === "ANEL_I" || slotPicker === "ANEL_II"
    ? item.slot === "ANEL_I"
    : item.slot === slotPicker) : [];

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
      <div className="bg-gradient-to-r from-arcane-panel to-arcane-bg border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-arcane-bg rounded-full border-2 border-arcane-purple shadow-[0_0_20px_rgba(124,58,237,0.3)] overflow-hidden">
            {!imgError ? (
              <AssetImage
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

      <StatAllocation />

      {inspectItem && <ItemModal item={inspectItem} equipped={slotPicker ? character.equipped[slotPicker] : undefined} onEquip={() => {
        const res = useGameStore.getState().equip(inspectItem.uid);
        if (res.success) { setInspectItem(null); setSlotPicker(null); } else alert(res.error);
      }} onClose={() => setInspectItem(null)} readOnly={!character.inventory.items.some(item => item.uid === inspectItem.uid)} />}

      {slotPicker && <div className="fixed inset-0 z-[9000] grid place-items-center bg-black/75 p-4" onClick={() => setSlotPicker(null)}>
        <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-arcane-gold/50 bg-arcane-panel p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3"><div><h3 className="font-bold text-arcane-gold">{SLOTS.find(slot => slot.key === slotPicker)?.label}</h3><p className="text-xs text-gray-400">Seu item equipado e as opções compatíveis da mochila.</p></div><button onClick={() => setSlotPicker(null)} className="text-gray-400 hover:text-white">✕</button></div>
          {equippedInPicker ? <div className="mb-3 flex items-center gap-2 rounded-lg border border-arcane-gold/40 bg-black/20 p-2"><button onClick={() => setInspectItem(equippedInPicker)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><ItemIcon item={equippedInPicker} className="h-12 w-12 shrink-0" /><span className="min-w-0"><strong className="block truncate text-sm text-white">{equippedInPicker.name} · equipado</strong><small className="text-gray-400">Clique para ver todos os atributos</small></span></button><button onClick={() => { const res = unequip(slotPicker); if (res.success) setSlotPicker(null); else alert(res.error); }} className="shrink-0 rounded border border-white/10 px-2 py-1 text-xs text-gray-300 hover:border-red-400 hover:text-red-300">Desequipar</button></div> : <p className="mb-3 text-xs text-gray-500">Slot vazio.</p>}
          {compatibleItems.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{compatibleItems.map(item => <button key={item.uid} title={`${item.name} · ${item.rarity} · ${Object.entries(item.stats).map(([key, value]) => `${key}: ${value}`).join(" · ")}`} onClick={() => setInspectItem(item)} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-2 text-left hover:border-arcane-cyan"><ItemIcon item={item} className="h-10 w-10 shrink-0" /><span className="min-w-0"><strong className="block truncate text-xs text-white">{item.name}</strong><small className="text-[10px] text-gray-400">{item.rarity} · passar o mouse mostra stats</small></span></button>)}</div> : <p className="py-6 text-center text-sm text-gray-500">Nenhum item compatível na mochila.</p>}
        </section>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">🎽 Equipamento</h2>
          <div className="mx-auto grid w-full max-w-lg grid-cols-3 gap-2">
            {SLOTS.map(slot => {
              const item = character.equipped[slot.key];
              return (
                <div
                  key={slot.key}
                  style={{ gridColumn: slot.column, gridRow: slot.row }}
                  onClick={() => setSlotPicker(slot.key)}
                  className={`relative bg-arcane-bg rounded-lg p-2 flex flex-col items-center transition-all border-2 ${
                    item
                      ? `${RARITY_BORDER[item.rarity]} cursor-pointer hover:border-arcane-cyan`
                      : "border-dashed border-arcane-border opacity-50 cursor-pointer"
                  }`}
                  title={item ? `Clique para ver ${item.name} e opções da mochila` : `Clique para escolher ${slot.label}`}
                >
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{slot.label}</div>
                  <div className="text-2xl mb-1 flex justify-center">
                    {item ? <ItemIcon item={item} className="w-10 h-10" /> : slot.icon}
                  </div>
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
          <p className="text-[10px] text-gray-500 italic mt-3 text-center">Clique em um slot para ver o item equipado e as alternativas da mochila.</p>
        </div>

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
                {Object.entries(character.elementalResistances ?? {}).filter(([, value]) => (value ?? 0) > 0).map(([element, value]) => <StatLine key={element} icon={ELEMENTS.find(entry => entry.id === element)?.icon ?? "✦"} label={`Res. ${ELEMENTS.find(entry => entry.id === element)?.name ?? element}`} value={`${Math.round((value ?? 0) * 100)}%`} />)}
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

        <div className="space-y-4">
          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">✨ Bônus Ativos</h2>

            {character.activeRace ? (
              <div className="bg-arcane-bg p-2 rounded border border-arcane-gold/30">
                <div className="text-[10px] text-arcane-gold uppercase font-bold">🎭 Raça</div>
                <div className="text-sm font-bold text-white">{character.activeRace.name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(character.activeRace.bonus).map(([k, v]) => (
                    <span key={k} className="text-[9px] bg-green-900/30 border border-green-800/50 px-1.5 py-0.5 rounded text-green-400 font-bold">
                      +{typeof v === "number" && v % 1 === 0 ? v : (v as number).toFixed(2)} {k.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ) : activeBeast ? (
              <div className="bg-arcane-bg p-2 rounded border border-purple-900/30 text-xs text-center text-purple-200">
                <span className="text-xl mr-2">{activeBeast.emoji}</span>{activeBeast.name} · vínculo ativo
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
              <div className="text-[10px] text-purple-400 uppercase font-bold">🐾 Divine Beast</div>
              <div className="bg-arcane-bg p-2 rounded border border-purple-900/30 text-xs text-center text-gray-400">
                {activeBeast ? <span className="text-purple-200">{activeBeast.emoji} {activeBeast.name} acompanha sua jornada.</span> : "Nenhum vínculo ativo. Descubra uma Beast no menu Divine Beasts."}
              </div>
            </div>
          </div>

          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-arcane-gold mb-3 border-b border-arcane-border pb-2">🔮 Matriz</h2>
            {activeBeast ? (
              <div className="text-center text-purple-200 text-xs py-4">
                {activeBeast.emoji} Ressonância ativa: <strong>{activeBeast.name}</strong>
                <p className="text-[10px] text-gray-500 mt-1">A Matriz continua guardada na sua coleção.</p>
              </div>
            ) : character.activeRace ? (
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
