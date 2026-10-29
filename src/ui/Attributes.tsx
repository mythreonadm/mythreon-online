import React from "react";
import { useGameStore } from "../store/gameStore";
import { VIALS } from "../data/vials";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";
import { ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";

export function Attributes() {
  const { character } = useGameStore();
  if (!character) return null;

  const s = character.baseStats;
  const skill = character.activeRace ? ATTACK_SKILLS[character.activeRace.ataqueId] : null;
  const support = character.activeRace ? SUPPORT_EFFECTS[character.activeRace.suporteId] : null;
  const passive = character.activeRace ? PASSIVE_EFFECTS[character.activeRace.passivaId] : null;

  const atkSkill = character.activeRace ? ATAQUES[character.activeRace.ataqueId] : null;
  const supSkill = character.activeRace ? SUPORTES[character.activeRace.suporteId] : null;
  const pasSkill = character.activeRace ? PASSIVAS[character.activeRace.passivaId] : null;

  // Cálculos do Dano
  const danoFisicoBase = s.atk ?? 0;
  const danoMagicoBase = skill ? Math.round(((s.matk ?? 0) + (s.atk ?? 0) * 0.5) * skill.mult) : 0;
  const custoMana = skill ? (skill.manaCost + character.level * 2) : 0;
  const manaPorSegundo = custoMana / 9; // Considerando cast a cada 3 ticks de 3s

  // Vials Ativos
  const activeVials = Object.entries(character.activeVials)
    .filter(([_, time]) => time > Date.now())
    .map(([id, time]) => ({
      vial: VIALS[id],
      segundosRestantes: Math.ceil((time - Date.now()) / 1000),
    }))
    .filter(v => v.vial);

  const formatStat = (val: number | undefined, isPct = false) => {
    if (val === undefined) return "0";
    if (isPct) return `${(val * 100).toFixed(1)}%`;
    return Math.round(val).toLocaleString();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER - RESUMO DO PERSONAGEM */}
      <div className="bg-gradient-to-r from-arcane-panel to-arcane-bg border border-arcane-border rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-arcane-gold">{character.name}</h1>
            <p className="text-sm text-arcane-cyan">Nível {character.level} {character.activeRace && `· ${character.activeRace.name}`}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-arcane-bg border border-red-900/50 px-4 py-2 rounded-lg">
              <div className="text-xs text-red-400 font-bold">❤️ HP</div>
              <div className="font-bold text-white">{character.hp.toLocaleString()} / {character.hpMax.toLocaleString()}</div>
            </div>
            <div className="bg-arcane-bg border border-blue-900/50 px-4 py-2 rounded-lg">
              <div className="text-xs text-blue-400 font-bold">🔮 MP</div>
              <div className="font-bold text-white">{character.mp.toLocaleString()} / {character.mpMax.toLocaleString()}</div>
            </div>
            <div className="bg-arcane-bg border border-yellow-900/50 px-4 py-2 rounded-lg">
              <div className="text-xs text-yellow-400 font-bold">💰 Ouro</div>
              <div className="font-bold text-white">{character.gold.toLocaleString()}</div>
            </div>
            <div className="bg-arcane-bg border border-arcane-gold/50 px-4 py-2 rounded-lg">
              <div className="text-xs text-arcane-gold font-bold">✨ XP</div>
              <div className="font-bold text-white">{character.xp.toLocaleString()} / {character.xpToNext.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* STATUS DE COMBATE */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">📊 Status de Combate</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatRow icon="⚔️" label="Ataque Físico" value={formatStat(s.atk)} color="text-red-400" />
            <StatRow icon="✨" label="Ataque Mágico" value={formatStat(s.matk)} color="text-purple-400" />
            <StatRow icon="🪨" label="Armadura" value={formatStat(s.arm)} color="text-gray-300" />
            <StatRow icon="🛡️" label="Defesa" value={formatStat(s.def)} color="text-gray-300" />
            <StatRow icon="🎯" label="Crítico" value={formatStat(s.crit, true)} color="text-yellow-400" />
            <StatRow icon="🎯" label="Precisão" value={formatStat(s.hit, true)} color="text-yellow-400" />
            <StatRow icon="💨" label="Esquiva" value={formatStat(s.dge, true)} color="text-cyan-400" />
            <StatRow icon="🛡️" label="Bloqueio" value={formatStat(s.blk, true)} color="text-cyan-400" />
            <StatRow icon="⚡" label="Vel. Ataque" value={formatStat(s.spd, true)} color="text-blue-400" />
            <StatRow icon="🔥" label="Res. Física" value={formatStat(s.resFisico, true)} color="text-orange-400" />
            <StatRow icon="❄️" label="Res. Mágica" value={formatStat(s.resMagico, true)} color="text-blue-300" />
            <StatRow icon="💧" label="Chance Ataque Extra" value={formatStat(s.spd, true)} color="text-blue-400" />
          </div>
        </div>

        {/* DETALHAMENTO DE DANO */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">⚔️ Detalhamento do Dano</h2>
          
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
              <div className="text-xs text-red-400 font-bold uppercase mb-1">Hit Físico (Arma)</div>
              <div className="text-2xl font-bold text-white">{danoFisicoBase.toLocaleString()} <span className="text-sm text-gray-400">dano base</span></div>
              <div className="text-xs text-gray-500 mt-1">Chance de crítico: {formatStat(s.crit, true)} (×1.5)</div>
            </div>

            {skill && atkSkill ? (
              <div className="bg-purple-900/20 border border-purple-900/50 p-3 rounded-lg">
                <div className="text-xs text-purple-400 font-bold uppercase mb-1">Hit Mágico (Habilidade da Raça)</div>
                <div className="text-2xl font-bold text-white">{danoMagicoBase.toLocaleString()} <span className="text-sm text-gray-400">dano mágico</span></div>
                <div className="text-xs text-gray-500 mt-1">
                  Custo: <span className="text-blue-400 font-bold">{custoMana} MP</span> · Recarrega a cada 9s
                </div>
                <div className="text-xs text-gray-500 mt-1">{skill.desc}</div>
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-800 p-3 rounded-lg text-center text-gray-500 text-sm">
                Equipe uma raça na Matriz para liberar o Hit Mágico
              </div>
            )}

            <div className="bg-arcane-bg p-3 rounded-lg border border-arcane-border">
              <div className="text-xs text-gray-400 font-bold uppercase mb-1">Consumo de Mana</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Mana por segundo (estimado):</span>
                <span className="text-blue-400 font-bold">-{manaPorSegundo.toFixed(1)} MP/s</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-300">Regeneração base:</span>
                <span className="text-green-400 font-bold">+{Math.round(character.mpMax * 0.005)} MP/tick</span>
              </div>
            </div>
          </div>
        </div>

        {/* RAÇA EQUIPADA */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">🎭 Raça Equipada</h2>
          
          {character.activeRace ? (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <div className="text-xl font-bold text-white">{character.activeRace.name}</div>
                <div className="text-xs uppercase text-arcane-cyan">{character.activeRace.tier}</div>
              </div>

              <div className="space-y-2">
                <div className="bg-purple-900/20 border border-purple-900/50 p-2 rounded">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">⚔️ Ataque</div>
                  <div className="text-sm font-bold text-white">{atkSkill?.name}</div>
                  <div className="text-[10px] text-gray-500">{skill?.desc}</div>
                </div>
                <div className="bg-green-900/20 border border-green-900/50 p-2 rounded">
                  <div className="text-[10px] text-green-400 font-bold uppercase">💚 Suporte</div>
                  <div className="text-sm font-bold text-white">{supSkill?.name}</div>
                  <div className="text-[10px] text-gray-500">{support?.desc}</div>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-900/50 p-2 rounded">
                  <div className="text-[10px] text-yellow-400 font-bold uppercase">✨ Passiva</div>
                  <div className="text-sm font-bold text-white">{pasSkill?.name}</div>
                  <div className="text-[10px] text-gray-500">{passive?.desc}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 italic py-8">
              Nenhuma raça equipada. Vá para a aba Matriz.
            </div>
          )}
        </div>

        {/* SKILLS DE TREINO */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">🏋️ Skills de Treino</h2>
          <div className="space-y-2">
            <SkillRow icon="⚔️" name="Melee" level={character.skills.melee} bonus={`+${character.skills.melee * 3} ATK`} />
            <SkillRow icon="🏹" name="Distance" level={character.skills.distance} bonus={`+${character.skills.distance * 3} ATK (arcos)`} />
            <SkillRow icon="🪄" name="Magic" level={character.skills.magic} bonus={`+${character.skills.magic * 3} MATK`} />
            <SkillRow icon="🛡️" name="Defesa" level={character.skills.defense} bonus={`+${character.skills.defense * 2} ARM, +${character.skills.defense} DEF`} />
            <SkillRow icon="🧘" name="Alma" level={character.skills.soul} bonus={`+${(character.skills.soul * 15)} min offline`} />
          </div>
        </div>

        {/* VIALS ATIVOS */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">🧪 Vials Ativos</h2>
          
          {activeVials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeVials.map(({ vial, segundosRestantes }) => (
                <div key={vial.id} className="bg-arcane-bg border border-arcane-cyan/30 p-3 rounded-lg flex items-center gap-3">
                  <div className="text-3xl">{vial.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{vial.name}</div>
                    <div className="text-xs text-arcane-cyan">{vial.description}</div>
                    <div className="text-xs text-yellow-400 font-mono mt-1">⏱️ {formatTime(segundosRestantes)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 italic py-4">Nenhum Vial ativo. Visite o Mercador na aba "Loja".</div>
          )}
        </div>

        {/* RESUMO DO EQUIPAMENTO */}
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold text-arcane-gold mb-4 border-b border-arcane-border pb-3">🎽 Equipamento Equipado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(character.equipped).map(([slot, item]: any) => {
              if (!item) return null;
              return (
                <div key={slot} className="bg-arcane-bg border border-arcane-border p-2 rounded-lg text-center">
                  <div className="text-[9px] text-gray-500 uppercase">{slot.replace(/_/g, " ")}</div>
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                  <div className={`text-[9px] uppercase ${
                    item.rarity === "LENDARIO" ? "text-arcane-gold" :
                    item.rarity === "EPICO" ? "text-purple-400" :
                    item.rarity === "RARO" ? "text-blue-400" :
                    item.rarity === "INCOMUM" ? "text-green-400" : "text-gray-500"
                  }`}>{item.rarity}</div>
                </div>
              );
            })}
            {Object.keys(character.equipped).length === 0 && (
              <div className="col-span-full text-center text-gray-500 italic py-4">Nenhum item equipado.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="bg-arcane-bg border border-arcane-border p-2 rounded flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 uppercase truncate">{label}</div>
        <div className={`font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function SkillRow({ icon, name, level, bonus }: { icon: string; name: string; level: number; bonus: string }) {
  return (
    <div className="bg-arcane-bg border border-arcane-border p-3 rounded-lg flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-bold text-white">{name}</span>
          <span className="text-arcane-cyan font-black">Nível {level}</span>
        </div>
        <div className="text-xs text-gray-400">{bonus}</div>
      </div>
    </div>
  );
}