import React, { useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";
import { NAMED_RACES, RACE_LORE, findNamedRace, generateRaceName, generateRaceId, MATRIX_STATS, generateRaceBonus } from "../data/races";
import { ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";
import { QUESTS } from "../data/quests";
import { Race } from "../types";
import { RaceModal } from "./RaceModal";

type Tab = "synthesis" | "mine" | "compendium" | "milestones";

export function MatrixView() {
  const { character, races, synthesize, equipRace, claimQuest } = useGameStore();
  const [tab, setTab] = useState<Tab>("synthesis");
  const [slotA, setSlotA] = useState<string>("");
  const [slotS, setSlotS] = useState<string>("");
  const [slotP, setSlotP] = useState<string>("");
  const [activeSelector, setActiveSelector] = useState<"A" | "S" | "P" | null>(null);
  const [error, setError] = useState("");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  if (!character) return null;

  const owned = character.inventory.items.filter((i) => i.category === "COMPONENTE");
  const ownedA = owned.filter((i) => i.componentType === "ATAQUE");
  const ownedS = owned.filter((i) => i.componentType === "SUPORTE");
  const ownedP = owned.filter((i) => i.componentType === "PASSIVA");

  const discoveredNamed = new Set(races.filter((r) => r.id.startsWith("R") && r.tier === "NOMEADA").map((r) => r.id));
  const progressPct = (discoveredNamed.size / MATRIX_STATS.totalNomeadas) * 100;

  const totalQuests = QUESTS.filter(q => q.category === "COMPENDIO");
  const readyToClaim = totalQuests.filter(q => {
    const prog = character.quests.active[q.id]?.progress || [];
    return q.objectives.every((obj, idx) => (prog[idx] || 0) >= obj.count);
  });

  const previewRace = useMemo(() => {
    if (!slotA || !slotS || !slotP) return null;
    const named = findNamedRace(slotA, slotS, slotP);
    if (named) return named;
    return {
      id: generateRaceId(slotA, slotS, slotP),
      name: generateRaceName(slotA, slotS, slotP),
      tier: "COMUM" as const,
      ataqueId: slotA, suporteId: slotS, passivaId: slotP,
      skills: {
        ataque: ATAQUES[slotA]?.skillName || "",
        suporte: SUPORTES[slotS]?.skillName || "",
        passiva: PASSIVAS[slotP]?.skillName || "",
      },
      bonus: generateRaceBonus(slotA, slotS, slotP),
    } as Race;
  }, [slotA, slotS, slotP]);

  const isPreviewDiscovered = previewRace && races.find((r) => r.id === previewRace.id);

  const handleSynthesize = () => {
    if (!slotA || !slotS || !slotP) { setError("Selecione os 3 componentes."); return; }
    const res = synthesize(slotA, slotS, slotP);
    if (!res.success) setError(res.error || "Erro");
    else { setError(""); setSlotA(""); setSlotS(""); setSlotP(""); setActiveSelector(null); }
  };

  return (
    <div className="space-y-6">
      {selectedRace && (
        <RaceModal 
          race={selectedRace} 
          isEquipped={character.raceId === selectedRace.id}
          onEquip={() => { equipRace(selectedRace); setSelectedRace(null); }}
          onClose={() => setSelectedRace(null)}
        />
      )}

      <div className="bg-gradient-to-r from-arcane-panel via-purple-900/20 to-arcane-panel border-2 border-arcane-purple/30 rounded-xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-arcane-gold tracking-wider">✦ A MATRIZ DAS 33 LEIS ✦</h1>
            <p className="text-arcane-cyan text-sm italic">"Toda raça é uma memória. Toda memória é uma lei."</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Raças Nomeadas</div>
            <div className="text-2xl font-black text-arcane-gold">{discoveredNamed.size} <span className="text-sm text-gray-500">/ {MATRIX_STATS.totalNomeadas}</span></div>
            <div className="w-48 h-2 bg-gray-900 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-arcane-gold to-yellow-300" style={{ width: `${progressPct}%` }} />
            </div>
            {readyToClaim.length > 0 && (
              <div className="mt-2 text-xs text-green-400 font-bold animate-pulse">
                🎁 {readyToClaim.length} recompensa(s) pronta(s) para resgatar!
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-arcane-purple/20">
          <div className="bg-arcane-bg/50 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Ataques</div>
            <div className="font-bold text-red-400 text-lg">{MATRIX_STATS.totalAtaques}</div>
          </div>
          <div className="bg-arcane-bg/50 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Suportes</div>
            <div className="font-bold text-green-400 text-lg">{MATRIX_STATS.totalSuportes}</div>
          </div>
          <div className="bg-arcane-bg/50 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Passivas</div>
            <div className="font-bold text-yellow-400 text-lg">{MATRIX_STATS.totalPassivas}</div>
          </div>
          <div className="bg-arcane-bg/50 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Combinações</div>
            <div className="font-bold text-arcane-cyan text-lg">{MATRIX_STATS.totalCombinacoes.toLocaleString()}</div>
          </div>
          <div className="bg-arcane-bg/50 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Descobertas</div>
            <div className="font-bold text-white text-lg">{races.length}</div>
          </div>
        </div>
      </div>

      <div className="flex bg-arcane-panel border border-arcane-border rounded-lg p-1 flex-wrap">
        <button onClick={() => setTab("synthesis")} className={`flex-1 min-w-[120px] py-3 rounded font-bold transition-all text-sm ${tab === "synthesis" ? "bg-arcane-purple text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>🔮 Síntese</button>
        <button onClick={() => setTab("mine")} className={`flex-1 min-w-[120px] py-3 rounded font-bold transition-all text-sm ${tab === "mine" ? "bg-arcane-purple text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>🎭 Minhas ({races.length})</button>
        <button onClick={() => setTab("compendium")} className={`flex-1 min-w-[120px] py-3 rounded font-bold transition-all text-sm ${tab === "compendium" ? "bg-arcane-purple text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>📖 Compêndio</button>
        <button onClick={() => setTab("milestones")} className={`flex-1 min-w-[120px] py-3 rounded font-bold transition-all text-sm relative ${tab === "milestones" ? "bg-arcane-purple text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>
          🏆 Recompensas
          {readyToClaim.length > 0 && <span className="absolute top-1 right-2 bg-green-500 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">{readyToClaim.length}</span>}
        </button>
      </div>

      {tab === "synthesis" && (
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-arcane-gold">O Cubo da Matriz</h2>
            <p className="text-xs text-gray-500 mt-1">
              Nome = <span className="text-red-400 font-bold">Ataque</span> + <span className="text-green-400 font-bold">Título</span> + <span className="text-yellow-400 font-bold">Sufixo</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <SlotCircle type="A" icon="⚔️" label="Ataque" color="from-red-900/50 to-red-700/30 border-red-500/50"
              selectedId={slotA} onClick={() => setActiveSelector(activeSelector === "A" ? null : "A")} onClear={() => setSlotA("")} />
            <div className="text-3xl font-black text-arcane-gold">+</div>
            <SlotCircle type="S" icon="💚" label="Suporte" color="from-green-900/50 to-green-700/30 border-green-500/50"
              selectedId={slotS} onClick={() => setActiveSelector(activeSelector === "S" ? null : "S")} onClear={() => setSlotS("")} />
            <div className="text-3xl font-black text-arcane-gold">+</div>
            <SlotCircle type="P" icon="✨" label="Passiva" color="from-yellow-900/50 to-yellow-700/30 border-yellow-500/50"
              selectedId={slotP} onClick={() => setActiveSelector(activeSelector === "P" ? null : "P")} onClear={() => setSlotP("")} />
          </div>

          {error && <div className="text-red-400 text-center text-sm mb-4 bg-red-900/20 p-2 rounded">{error}</div>}

          {activeSelector && (
            <ComponentSelector type={activeSelector}
              components={activeSelector === "A" ? ownedA : activeSelector === "S" ? ownedS : ownedP}
              onSelect={(id: string) => {
                if (activeSelector === "A") setSlotA(id);
                if (activeSelector === "S") setSlotS(id);
                if (activeSelector === "P") setSlotP(id);
                setActiveSelector(null);
              }}
              onCancel={() => setActiveSelector(null)}
            />
          )}

          {previewRace && !activeSelector && (
            <RacePreview race={previewRace} isNamed={previewRace.tier === "NOMEADA"} isDiscovered={!!isPreviewDiscovered}
              currentRace={character.activeRace} onSynthesize={handleSynthesize}
              onClearAll={() => { setSlotA(""); setSlotS(""); setSlotP(""); }} />
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-6">
          {races.length === 0 ? (
            <div className="bg-arcane-panel border border-arcane-border rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma raça descoberta</h3>
              <p className="text-gray-400 mb-4">Sintetize sua primeira raça na aba "Síntese".</p>
              <button onClick={() => setTab("synthesis")} className="bg-arcane-purple text-white px-6 py-2 rounded-lg font-bold">Ir para Síntese</button>
            </div>
          ) : (
            <>
              {discoveredNamed.size > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-arcane-gold mb-3 flex items-center gap-2">
                    🏆 Nomeadas Descobertas <span className="text-sm text-gray-500">({discoveredNamed.size})</span>
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {races.filter(r => r.tier === "NOMEADA").map((r) => (
                      <RaceCard key={r.id} race={r} isEquipped={character.raceId === r.id} onOpen={() => setSelectedRace(r)} showLore={true} />
                    ))}
                  </div>
                </div>
              )}
              {(races.length - discoveredNamed.size) > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-arcane-cyan mb-3 flex items-center gap-2">
                    🧬 Híbridas Descobertas <span className="text-sm text-gray-500">({races.length - discoveredNamed.size})</span>
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {races.filter(r => r.tier === "COMUM").map((r) => (
                      <RaceCard key={r.id} race={r} isEquipped={character.raceId === r.id} onOpen={() => setSelectedRace(r)} showLore={false} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "compendium" && (
        <div className="space-y-4">
          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6">
            <p className="text-sm text-gray-400 text-center">
              As <span className="text-arcane-gold font-bold">33 Raças Nomeadas</span> são as lendas da Matriz.
              Suas raças híbridas contam para o progresso total, mas apenas as nomeadas preenchem esta lista lendária.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NAMED_RACES.map((r) => {
              const isDiscovered = discoveredNamed.has(r.id);
              const ownedRace = races.find((x) => x.id === r.id);
              return (
                <div key={r.id} onClick={() => ownedRace && setSelectedRace(ownedRace)} className={`bg-arcane-panel border-2 rounded-lg p-4 transition-all ${isDiscovered ? "border-arcane-gold shadow-[0_0_15px_rgba(201,160,77,0.2)] cursor-pointer hover:-translate-y-1" : "border-gray-800 opacity-60"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-bold text-base ${isDiscovered ? "text-arcane-gold" : "text-gray-600"}`}>{isDiscovered ? r.name : "??? ??? ???"}</h3>
                      <p className="text-[10px] text-arcane-cyan uppercase tracking-wider">{isDiscovered ? "★ Nomeada" : `Raça #${r.id.slice(1)}`}</p>
                    </div>
                    <div className="text-2xl">{isDiscovered ? "🏆" : "🔒"}</div>
                  </div>
                  {isDiscovered ? (
                    <>
                      <p className="text-[11px] text-gray-400 italic mb-3 min-h-[32px]">{RACE_LORE[r.id]}</p>
                      <div className="grid grid-cols-3 gap-1 text-[10px] mb-2">
                        {Object.entries(r.bonus).map(([k, v]) => (
                          <div key={k} className="bg-arcane-bg px-1 py-0.5 rounded text-center">
                            <div className="text-gray-500 uppercase">{k}</div>
                            <div className="font-bold text-green-400">+{(v as number) % 1 === 0 ? v : `${(v as number).toFixed(2)}`}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[11px] text-gray-600 italic min-h-[32px]">Combinação desconhecida. Continue explorando.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "milestones" && (
        <div className="space-y-4">
          <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6">
            <p className="text-sm text-gray-400 text-center">
              Cada descoberta conta. <span className="text-arcane-gold font-bold">Complete os marcos</span> abaixo e resgate recompensas lendárias.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-arcane-bg rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 uppercase">Total</div>
                <div className="text-2xl font-black text-white">{races.length}</div>
              </div>
              <div className="bg-arcane-bg rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 uppercase">Nomeadas</div>
                <div className="text-2xl font-black text-arcane-gold">{discoveredNamed.size}<span className="text-sm text-gray-500">/33</span></div>
              </div>
              <div className="bg-arcane-bg rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 uppercase">Híbridas</div>
                <div className="text-2xl font-black text-arcane-cyan">{races.length - discoveredNamed.size}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {totalQuests.map((quest) => {
              const isActive = !!character.quests.active[quest.id];
              const isCompleted = character.quests.completed.includes(quest.id);
              const progress = character.quests.active[quest.id]?.progress || [];
              const objective = quest.objectives[0];
              const current = progress[0] || 0;
              const isReady = isActive && current >= objective.count;
              const pct = Math.min(100, (current / objective.count) * 100);

              return (
                <div key={quest.id} className={`bg-arcane-panel border-2 rounded-lg p-4 transition-all ${
                  isCompleted ? "border-gray-700 opacity-50" :
                  isReady ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" :
                  isActive ? "border-arcane-border" : "border-gray-800 opacity-40"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-bold text-base ${isCompleted ? "text-gray-500 line-through" : isReady ? "text-green-400" : "text-white"}`}>{quest.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">{quest.description}</p>
                    </div>
                    <div className="text-2xl">{isCompleted ? "✔️" : isReady ? "🎁" : "🏆"}</div>
                  </div>

                  <div className="bg-arcane-bg p-2 rounded mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{objective.description}</span>
                      <span className="font-mono text-arcane-cyan">{Math.min(current, objective.count)} / {objective.count}</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${isReady ? "bg-green-500" : "bg-arcane-purple"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs mb-2">
                    <div className="text-yellow-400 font-bold">💰 {(quest.rewards.gold || 0).toLocaleString()} · ✨ {(quest.rewards.xp || 0).toLocaleString()}</div>
                    {quest.rewards.items && <div className="text-arcane-cyan">+ {quest.rewards.items.length} item(s)</div>}
                  </div>

                  {isReady && (
                    <button onClick={() => claimQuest(quest.id)} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded animate-pulse">
                      🎁 Resgatar Recompensa
                    </button>
                  )}
                  {isCompleted && <div className="text-center text-gray-500 text-xs font-bold">✓ CONCLUÍDA</div>}
                  {isActive && !isReady && <div className="text-center text-gray-600 text-xs italic">Em progresso...</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SlotCircle({ type, icon, label, color, selectedId, onClick, onClear }: any) {
  const comp = selectedId ? (type === "A" ? ATAQUES[selectedId] : type === "S" ? SUPORTES[selectedId] : PASSIVAS[selectedId]) : null;
  return (
    <div className="flex flex-col items-center gap-2 relative group">
      <button onClick={onClick} className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all hover:scale-105 ${comp ? `bg-gradient-to-br ${color} shadow-[0_0_20px_rgba(124,58,237,0.5)]` : "bg-arcane-bg border-dashed border-gray-700 hover:border-arcane-purple"}`}>
        {comp ? (
          <div className="flex flex-col items-center">
            <span className="text-3xl">{comp.icon}</span>
            <span className="text-[9px] text-white mt-1 text-center px-1 leading-tight">{comp.name.split(" ").slice(0, 2).join(" ")}</span>
          </div>
        ) : <span className="text-4xl opacity-40">{icon}</span>}
      </button>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
      {comp && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>}
    </div>
  );
}

function ComponentSelector({ type, components, onSelect, onCancel }: any) {
  const label = type === "A" ? "Ataque" : type === "S" ? "Suporte" : "Passiva";
  const templates = type === "A" ? ATAQUES : type === "S" ? SUPORTES : PASSIVAS;
  const grouped = components.reduce((acc: any, item: any) => { acc[item.templateId] = (acc[item.templateId] || 0) + item.quantity; return acc; }, {});

  return (
    <div className="bg-arcane-bg border-2 border-arcane-purple rounded-lg p-4 mt-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-arcane-gold">Selecionar {label}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white text-sm">Cancelar</button>
      </div>
      {components.length === 0 ? (
        <div className="text-center text-gray-500 py-6 italic">Você não tem componentes de {label}. Cace mais monstros!</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 max-h-64 overflow-y-auto pr-2">
          {Object.entries(grouped).map(([templateId, qty]) => {
            const t = templates[templateId];
            if (!t) return null;
            return (
              <button key={templateId} onClick={() => onSelect(templateId)} className="bg-arcane-panel border border-arcane-border hover:border-arcane-gold p-2 rounded-lg flex flex-col items-center transition-all hover:scale-105 group" title={t.skillDescription}>
                <span className="text-2xl mb-1">{t.icon}</span>
                <span className="text-[9px] text-center text-white truncate w-full">{t.name.split(" ")[0]}</span>
                <span className="text-[9px] text-arcane-cyan font-bold">x{qty}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RacePreview({ race, isNamed, isDiscovered, currentRace, onSynthesize, onClearAll }: any) {
  const atkSkill = ATAQUES[race.ataqueId];
  const supSkill = SUPORTES[race.suporteId];
  const pasSkill = PASSIVAS[race.passivaId];
  const atkEffect = ATTACK_SKILLS[race.ataqueId];
  const supEffect = SUPPORT_EFFECTS[race.suporteId];
  const pasEffect = PASSIVE_EFFECTS[race.passivaId];

  return (
    <div className={`mt-6 rounded-xl p-6 border-2 animate-fade-in ${isNamed ? "border-arcane-gold bg-gradient-to-br from-yellow-900/20 to-arcane-panel shadow-[0_0_30px_rgba(201,160,77,0.3)]" : "border-arcane-border bg-arcane-bg"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">{isNamed ? "★ Raça Nomeada Descoberta" : "Raça Procedural"}</div>
          <h2 className={`text-2xl font-bold ${isNamed ? "text-arcane-gold" : "text-white"}`}>{race.name}</h2>
          {isNamed && <p className="text-xs italic text-gray-400 mt-1">"{RACE_LORE[race.id]}"</p>}
        </div>
        <button onClick={onClearAll} className="text-gray-500 hover:text-red-400 text-xs">Limpar</button>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bônus da Raça</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(race.bonus).map(([k, v]) => (
            <div key={k} className="bg-green-900/30 border border-green-800/50 px-3 py-1 rounded-full text-sm">
              <span className="text-gray-400 uppercase text-xs">{k}:</span>{" "}
              <span className="font-bold text-green-400">+{(v as number) % 1 === 0 ? v : `${(v as number).toFixed(2)}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="bg-red-900/20 border border-red-900/50 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-lg">{atkSkill?.icon}</span>
            <span className="text-xs font-bold text-red-400 uppercase">⚔️ Ataque</span>
            <span className="text-sm font-bold text-white ml-2">{atkEffect?.desc.split(":")[0]}</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{atkEffect?.desc.split(":")[1]?.trim()}</div>
        </div>
        <div className="bg-green-900/20 border border-green-900/50 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-lg">{supSkill?.icon}</span>
            <span className="text-xs font-bold text-green-400 uppercase">💚 Suporte</span>
            <span className="text-sm font-bold text-white ml-2">{supEffect?.desc.split(":")[0]}</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{supEffect?.desc.split(":")[1]?.trim()}</div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-900/50 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-lg">{pasSkill?.icon}</span>
            <span className="text-xs font-bold text-yellow-400 uppercase">✨ Passiva</span>
            <span className="text-sm font-bold text-white ml-2">{pasEffect?.desc.split(":")[0]}</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{pasEffect?.desc.split(":")[1]?.trim()}</div>
        </div>
      </div>

      {currentRace && currentRace.id !== race.id && (
        <div className="mb-4 text-xs text-gray-500 text-center">Comparando com sua raça atual: <span className="text-white font-bold">{currentRace.name}</span></div>
      )}

      <button onClick={onSynthesize} disabled={!!isDiscovered}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${isDiscovered ? "bg-gray-800 text-gray-500 cursor-not-allowed" : isNamed ? "bg-arcane-gold hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(201,160,77,0.5)] animate-pulse" : "bg-arcane-purple hover:bg-arcane-purple/80 text-white"}`}>
        {isDiscovered ? "✓ Raça já descoberta" : isNamed ? "✦ Sintetizar Raça Lendária" : "Sintetizar Raça"}
      </button>
    </div>
  );
}

function RaceCard({ race, isEquipped, onOpen, showLore }: any) {
  const isNamed = race.tier === "NOMEADA";
  return (
    <div onClick={onOpen} className={`bg-arcane-panel border-2 rounded-lg p-4 cursor-pointer transition-all hover:-translate-y-1 ${isEquipped ? "border-arcane-gold shadow-[0_0_20px_rgba(201,160,77,0.3)]" : isNamed ? "border-arcane-gold/30 hover:border-arcane-gold" : "border-arcane-border hover:border-gray-500"}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`font-bold text-base ${isNamed ? "text-arcane-gold" : "text-white"}`}>{race.name}</h3>
          <p className="text-[10px] uppercase tracking-wider text-arcane-cyan">{isNamed ? "★ Nomeada" : "Híbrida"}</p>
        </div>
        {isEquipped && <span className="text-[10px] bg-arcane-gold text-black px-2 py-0.5 rounded font-bold">EQUIPADA</span>}
      </div>
      {showLore && RACE_LORE[race.id] && <p className="text-[11px] text-gray-400 italic mb-2 truncate">"{RACE_LORE[race.id]}"</p>}
      <div className="grid grid-cols-3 gap-1 text-[10px] mb-3">
        {Object.entries(race.bonus).slice(0,3).map(([k, v]) => (
          <div key={k} className="bg-arcane-bg px-1 py-0.5 rounded text-center">
            <div className="text-gray-500 uppercase">{k}</div>
            <div className="font-bold text-green-400">+{(v as number) % 1 === 0 ? v : `${(v as number).toFixed(2)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}