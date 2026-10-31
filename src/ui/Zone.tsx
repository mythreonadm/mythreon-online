import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { ZONES } from "../data/zones";
import { getSpellEffect, getWeaponAnimation } from "../utils/combatVisuals";
import { CharacterSkills, HuntEncounterRecord, DamageBreakdown, Element } from "../types";
import { skillXpToNextLevel } from "../engine/stats";
import { VIALS } from "../data/vials";
import { ATTACK_SKILLS } from "../data/skills";
import { getLineageByAttack } from "../data/lineages"; // NOVO IMPORT
import { AccessIcon } from "./AccessIcon";
import { getHuntQuestSignal } from "../utils/questSignals";
import { POTION_TEMPLATES } from "../data/items";
import { getPotionUsePrice } from "../data/potionEconomy";
import { AssetImage } from "./AssetImage";
import { ItemIcon } from "./ItemIcon";
import { QUESTS } from "../data/quests";

interface ZoneViewProps { onOpenQuest: (questId: string) => void; trackedQuestId?: string | null; }

const metricNumber = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
function describeDamageBreakdown(records: HuntEncounterRecord[], received = false) {
  const summary: DamageBreakdown = { physical: 0, elemental: {}, lifestealHealing: 0 };
  for (const record of records) {
    const breakdown = received ? record.damageTakenBreakdown : record.damageBreakdown;
    if (!breakdown) continue;
    summary.physical += breakdown.physical;
    summary.lifestealHealing += breakdown.lifestealHealing;
    for (const [element, value] of Object.entries(breakdown.elemental)) summary.elemental[element as Element] = (summary.elemental[element as Element] ?? 0) + (value ?? 0);
  }
  const total = summary.physical + Object.values(summary.elemental).reduce((sum, value) => sum + (value ?? 0), 0);
  const lines = [`Físico: ${metricNumber.format(summary.physical)} (${total ? Math.round(summary.physical / total * 100) : 0}%)`];
  for (const [element, value] of Object.entries(summary.elemental)) lines.push(`${element}: ${metricNumber.format(value ?? 0)} (${total ? Math.round((value ?? 0) / total * 100) : 0}%)`);
  if (!received && summary.lifestealHealing) lines.push(`Vida recuperada por roubo de vida: ${metricNumber.format(summary.lifestealHealing)} HP`);
  if (!total) lines.push("Sem detalhamento para esses registros antigos.");
  return lines.join("\n");
}
function formatHuntDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`;
}

export function ZoneView({ onOpenQuest, trackedQuestId }: ZoneViewProps) {
  const { character, currentZoneId, startHunting, stopHunting, startTraining, stopTraining, isTickRunning, isTraining, lastTickResult, setActiveEnemy, activateBuff, updateSettings, buyBless, healFull, startHealing, cancelHealing, healingUntil } = useGameStore();
  
  const [isHurt, setIsHurt] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<number | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showProjectile, setShowProjectile] = useState(false);
  const [balloon, setBalloon] = useState<{ x: number; y: number } | null>(null);
  const [buffTimeLeft, setBuffTimeLeft] = useState(0);
  const [houseTab, setHouseTab] = useState<"maps" | "train">("maps");
  const [healTimer, setHealTimer] = useState(0);
  const [magicCooldown, setMagicCooldown] = useState(0);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const balloonTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!character) return null;
  const currentZone = ZONES[currentZoneId];
  const currentMob = currentZone.enemies.find(e => e.id === character.activeEnemyId) || currentZone.enemies[0];
  const questSignal = getHuntQuestSignal(character, currentZoneId || currentZone.id);
  const selectedHpPotion = POTION_TEMPLATES[character.autoHpPotionId || ""];
  const selectedMpPotion = POTION_TEMPLATES[character.autoMpPotionId || ""];

  // Encontra a linhagem baseada na raça equipada (ou humano se não tiver)
  const playerLineage = getLineageByAttack(character.activeRace?.ataqueId);

  useEffect(() => {
    setImageError(false);
  }, [currentMob?.id, playerLineage.id]); // Reseta erro se o mob ou a raça mudar

  useEffect(() => {
    const interval = setInterval(() => {
      if (character.doubleAtkUntil && character.doubleAtkUntil > Date.now()) {
        setBuffTimeLeft(Math.ceil((character.doubleAtkUntil - Date.now()) / 1000));
      } else {
        setBuffTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [character.doubleAtkUntil]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tick = character.tickCount || 0;
      const lastCast = Math.floor(tick / 3) * 3;
      const progress = tick - lastCast;
      setMagicCooldown(progress);
    }, 1000);
    return () => clearInterval(interval);
  }, [character.tickCount]);

  useEffect(() => {
    if (healingUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((healingUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          healFull();
          setHealTimer(0);
        } else {
          setHealTimer(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [healingUntil, healFull]);

  useEffect(() => {
    if (!isTickRunning) {
      setBalloon(null);
      if (balloonTimeout.current) clearTimeout(balloonTimeout.current);
      return;
    }
    if (lastTickResult && lastTickResult.attacked && !balloon && Math.random() < 0.15) {
      setBalloon({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 60 });
      balloonTimeout.current = setTimeout(() => setBalloon(null), 10000);
    }
  }, [lastTickResult, isTickRunning, balloon]);

  const handleBalloonClick = () => {
    setBalloon(null);
    if (balloonTimeout.current) clearTimeout(balloonTimeout.current);
    activateBuff();
  };

  useEffect(() => {
    if (isTickRunning && lastTickResult && lastTickResult.attacked) {
      setIsAttacking(true); setShowProjectile(true);
      if (lastTickResult.lastDamage) {
        setTimeout(() => { setIsHurt(true); setFloatingDamage(lastTickResult.lastDamage!); }, 250); 
      }
      const timer1 = setTimeout(() => { setIsAttacking(false); setShowProjectile(false); }, 600);
      const timer2 = setTimeout(() => { setIsHurt(false); setFloatingDamage(null); }, 1000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [lastTickResult, isTickRunning]);

  if (!isTickRunning && !isTraining) {
    const skillsList: { key: keyof CharacterSkills, name: string, icon: string, desc: string }[] = [
      { key: "melee", name: "Melee", icon: "⚔️", desc: "Aumenta Ataque Físico" },
      { key: "distance", name: "Distance", icon: "🏹", desc: "Aumenta Ataque com Arcos" },
      { key: "magic", name: "Magic", icon: "🪄", desc: "Aumenta Ataque Mágico" },
      { key: "defense", name: "Defesa", icon: "🛡️", desc: "Aumenta Armadura e Defesa" },
      { key: "soul", name: "Alma", icon: "🧘", desc: "Aumenta tempo de caça offline" },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 md:p-8 shadow-lg flex flex-col items-center min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-10 p-10 pointer-events-none">
            <span className="text-9xl">🏠</span><span className="text-9xl">🪵</span>
          </div>
          
          <div className="z-10 w-full max-w-4xl">
            <div className="flex flex-col md:flex-row justify-center gap-3 mb-6">
              <button onClick={buyBless} className="bg-arcane-gold text-black px-4 md:px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(201,160,77,0.5)] text-sm md:text-base">
                ✨ Bless <span className="bg-black/20 px-2 py-0.5 rounded text-xs">{character.blesses || 0}/5</span>
              </button>
              
              {(character.hp < character.hpMax || character.mp < character.mpMax) && (
                healingUntil ? (
                  <button disabled className="bg-gray-800 text-arcane-cyan px-4 md:px-6 py-2 rounded-lg font-bold animate-pulse border border-arcane-cyan/50 text-sm md:text-base">
                    🧘 Meditando... {healTimer}s
                  </button>
                ) : (
                  <button onClick={startHealing} className="bg-green-700 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)] text-sm md:text-base">
                    🧘 Meditar (15s)
                  </button>
                )
              )}
            </div>

            <div className="flex justify-center gap-2 md:gap-4 mb-8">
              <button onClick={() => setHouseTab("maps")} className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${houseTab === "maps" ? "bg-arcane-gold text-black" : "bg-gray-800 text-gray-400"}`}>🗺️ Mapas</button>
              <button onClick={() => setHouseTab("train")} className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${houseTab === "train" ? "bg-arcane-gold text-black" : "bg-gray-800 text-gray-400"}`}>🏋️ Treinar</button>
            </div>

            {houseTab === "maps" && (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-[80px] md:text-[100px] leading-none mb-4 drop-shadow-[0_0_15px_rgba(201,160,77,0.5)] animate-idle">🛏️</div>
                <h2 className="text-2xl md:text-3xl font-bold text-arcane-gold mb-2 text-center">Sua Cabana Aconchegante</h2>
                <p className="text-gray-400 mb-8 text-center max-w-md text-sm md:text-base px-4">Descanse para recuperar HP, ou escolha uma zona para explorar.</p>
                <div className="grid grid-cols-1 md:flex md:flex-wrap gap-3 justify-center w-full max-w-2xl">
                  {Object.values(ZONES).map(z => {
                      const isLocked = character.level < z.minLevel;
                      const trackedQuest = QUESTS.find(q => q.id === trackedQuestId);
                      const highlightsZone = !!trackedQuest?.zoneId && trackedQuest.zoneId === z.id && trackedQuest.objectives.some(obj => ["KILL", "KILL_BOSS", "COLLECT"].includes(obj.type));
                      return (
                        <button key={z.id} disabled={isLocked} onClick={() => startHunting(z.id)} className={`px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold flex flex-col items-center transition-all ${highlightsZone && !isLocked ? "border-2 border-arcane-gold ring-2 ring-arcane-gold/50 shadow-[0_0_24px_rgba(201,160,77,.45)]" : ""} ${isLocked ? "bg-gray-900 text-gray-600 cursor-not-allowed" : "bg-arcane-purple hover:bg-arcane-purple/80 text-white shadow-lg hover:scale-105"}`}>
                          <span className="text-2xl mb-1">⚔️</span>
                          <span className="text-sm md:text-base">Caçar em {z.name}</span>
                          {highlightsZone && <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-arcane-gold">◆ Objetivo da missão</span>}
                          {isLocked && <span className="text-[10px] font-normal mt-1">Requer Nível {z.minLevel}</span>}
                        </button>
                      )
                  })}
                </div>
              </div>
            )}

            {houseTab === "train" && (
              <div className="animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-arcane-gold">Sala de Treinamento</h2>
                  <p className="text-gray-400 text-sm">Pratique suas habilidades na segurança da sua casa.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {skillsList.map(s => (
                    <button key={s.key} onClick={() => startTraining(s.key)} className="bg-arcane-bg border border-arcane-border hover:border-arcane-gold p-3 md:p-4 rounded-xl flex flex-col items-center transition-all group hover:-translate-y-1">
                      <span className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="font-bold text-white text-xs md:text-base mb-1">{s.name}</span>
                      <span className="text-xl md:text-2xl font-black text-arcane-cyan">{character.skills[s.key]}</span>
                      <span className="text-[9px] md:text-[10px] text-gray-500 text-center mt-2">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isTraining) {
    const skillKey = character.trainingSkill as keyof CharacterSkills;
    const skillName = skillKey ? skillKey.toUpperCase() : "";
    const currentLevel = character.skills[skillKey] || 0;
    const xpNeeded = skillXpToNextLevel(currentLevel);
    const currentXp = character.skillXp[skillKey] || 0;
    const xpPct = Math.min(100, (currentXp / xpNeeded) * 100);

    return (
      <div className="space-y-6">
        <div className="flex justify-end relative z-50">
          <button onClick={stopTraining} className="bg-red-900/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-red-500/50 shadow-md">🛑 Parar Treino</button>
        </div>
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 md:p-10 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-5xl md:text-6xl mb-6 animate-bounce">🏋️</div>
          <h2 className="text-2xl md:text-3xl font-bold text-arcane-gold mb-2">Treinando {skillName}</h2>
          <p className="text-gray-400 mb-8 text-center text-sm md:text-base">Seu personagem está treinando...</p>
          <div className="w-full max-w-md px-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-arcane-cyan font-bold">Nível {currentLevel}</span>
              <span className="text-gray-400">{currentXp} / {xpNeeded} XP</span>
            </div>
            <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-arcane-border relative">
              <div className="h-full bg-gradient-to-r from-arcane-purple to-arcane-cyan transition-all duration-300" style={{ width: `${xpPct}%` }} />
            </div>
            {lastTickResult?.skillLevelUp && <div className="mt-6 text-center text-green-400 font-bold animate-pulse">{lastTickResult.skillLevelUp}</div>}
          </div>
        </div>
      </div>
    );
  }

  const enemyHp = character.enemyHp || 0;
  const enemyMaxHp = currentMob.hp * currentMob.difficulty;
  const enemyHpPct = Math.max(0, (enemyHp / enemyMaxHp) * 100);

  const getBackgroundImage = (theme: string) => {
    switch (theme) {
      case "forest": return "/assets/backgrounds/forest.png";
      case "mountain": return "/assets/backgrounds/mountain.png";
      case "ocean": return "/assets/backgrounds/ocean.png";
      case "ruins": return "/assets/backgrounds/ruins.png";
      case "abyss": return "/assets/backgrounds/abyss.png";
      default: return "";
    }
  };

  // AQUI ESTÁ A GRANDE MUDANÇA VISUAL
  // O sprite agora vem da linhagem da raça, não da arma
  const getPlayerVisual = () => {
    return playerLineage.sprite;
  };

  const getPlayerFallbackEmoji = () => {
    return playerLineage.emoji;
  };

  // A arma ainda dita a ANIMAÇÃO (espada = swing, arco = shoot)
  const weaponAnimClass = isAttacking ? getWeaponAnimation(character.equipped.ARMA_PRINCIPAL?.templateId) : "animate-run";
  const spellEmoji = getSpellEffect(character.activeRace?.ataqueId || "A1");
  
  const raceSkill = character.activeRace ? ATTACK_SKILLS[character.activeRace.ataqueId] : null;
  const magicReady = magicCooldown === 0;
  const magicPct = (magicCooldown / 3) * 100;
  const magicManaCost = raceSkill ? (raceSkill.manaCost + character.level * 2) : 0;
  const hasEnoughMana = character.mp >= magicManaCost;

  const activeVialCount = Object.keys(character.activeVials).filter(id => character.activeVials[id] > Date.now()).length;
  const huntStats = character.huntStatsByZone?.[currentZoneId];
  const huntHours = (huntStats?.activeMs ?? 0) / 3600000;
  const actualGoldPerHour = huntHours > 0 ? Math.max(0, (huntStats?.gold ?? 0) - (huntStats?.goldSpentPotions ?? 0)) / huntHours : 0;
  const sellLootGoldPerHour = huntHours > 0
    ? Math.max(0, (huntStats?.gold ?? 0) - (huntStats?.soldGold ?? 0) - (huntStats?.goldSpentPotions ?? 0) + (huntStats?.lootValue ?? 0)) / huntHours
    : 0;
  const recentEncounters = (huntStats?.history ?? []).slice(-8).reverse();

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2 relative z-50">
        <div className="flex gap-2 items-center flex-wrap">
          {questSignal && (
            <button
              type="button"
              onClick={() => onOpenQuest(questSignal.quest.id)}
              className={`quest-hunt-alert ${questSignal.type === "claim" ? "quest-hunt-alert-claim" : "quest-hunt-alert-accept"}`}
              aria-label={`${questSignal.type === "claim" ? "Resgatar" : "Aceitar"} missão: ${questSignal.quest.name}`}
              title={`${questSignal.type === "claim" ? "Missão concluída" : "Nova missão disponível"}: ${questSignal.quest.name}`}
            >
              <span className="quest-hunt-mark" aria-hidden="true">{questSignal.type === "claim" ? "!" : "?"}</span>
              <AccessIcon name="quest" className="quest-hunt-icon" />
              <span className="quest-hunt-label">Quest</span>
            </button>
          )}
          {buffTimeLeft > 0 && (
            <div className="bg-yellow-900/90 border border-yellow-600 px-3 py-1.5 rounded-lg text-yellow-300 font-bold text-xs md:text-sm animate-pulse flex items-center gap-1.5">
              <span>⚡</span> Duplo: {Math.floor(buffTimeLeft / 60)}:{(buffTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <button onClick={() => setMobilePanelOpen(!mobilePanelOpen)} className="bg-arcane-panel border border-arcane-border hover:border-arcane-gold px-3 py-1.5 rounded-lg font-bold text-xs md:text-sm shadow-md flex items-center gap-1.5 md:hidden">
            ⚙️ Painel
          </button>
        </div>
        <button onClick={stopHunting} className="bg-red-900/80 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs md:text-sm transition-colors border border-red-500/50 shadow-md">
          🏃 Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3 md:gap-4">
        <div className={`combat-scene relative rounded-xl border-2 border-arcane-border shadow-2xl overflow-hidden bg-${currentZone.theme} min-h-[300px] md:min-h-[500px]`}>
          
          <div className="absolute inset-0 z-0">
            <AssetImage
              src={getBackgroundImage(currentZone.theme)} 
              alt={currentZone.name} 
              className="scene-backdrop w-full h-full object-cover" 
            />
            <div className="scene-vignette absolute inset-0 pointer-events-none"></div>
          </div>

          {balloon && (
            <div onClick={handleBalloonClick} className="absolute z-50 cursor-pointer animate-idle hover:scale-125 transition-transform" style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}>
              <div className="text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] relative">
                🎈
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-xl font-black text-yellow-300">⚡</div>
              </div>
            </div>
          )}

          <div className="scene-ground absolute bottom-0 w-full h-12 md:h-16 z-10 pointer-events-none"></div>

          <div className="relative z-20 flex justify-between items-end px-4 md:px-20 pb-8 md:pb-12 h-[300px] md:h-[500px]">
            <div className="flex flex-col items-center relative translate-y-2 md:translate-y-4">
              
              {/* SPRITE DO JOGADOR (Agora baseado na Linhagem) */}
              <div className={`combat-sprite combat-sprite-player relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center transition-transform ${weaponAnimClass}`}>
                {!imageError ? (
                  <AssetImage
                    key={playerLineage.id} // Força recarregar se a classe mudar
                    src={getPlayerVisual()} 
                    alt={playerLineage.name} 
                    className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" 
                    style={{ imageRendering: "pixelated" }} 
                    onAllSourcesFail={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-[60px] md:text-[100px] leading-none select-none drop-shadow-lg">{getPlayerFallbackEmoji()}</span>
                )}
              </div>

              <div className="mt-1 md:mt-2 text-center w-32 md:w-48 bg-black/80 p-1.5 md:p-2 rounded-lg border-2 border-arcane-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <h3 className="text-[10px] md:text-sm font-bold text-arcane-cyan truncate">{character.name}</h3>
                <div className="h-1.5 md:h-2 bg-gray-900 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(character.hp / character.hpMax) * 100}%` }} />
                </div>
                <div className="text-[8px] md:text-[10px] text-gray-400 mt-0.5">{character.hp} / {character.hpMax}</div>
              </div>
            </div>

            {showProjectile && (
              <div className="absolute left-[30%] top-1/2 -translate-y-1/2 text-4xl md:text-6xl projectile z-30">{spellEmoji}</div>
            )}

            {currentMob && (
              <div className="flex flex-col items-center relative translate-y-2 md:translate-y-4">
                {floatingDamage !== null && <div className="damage-number text-red-500 text-3xl md:text-5xl z-50 font-black drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">-{floatingDamage}</div>}
                
              <div className={`combat-sprite combat-sprite-enemy w-24 h-24 md:w-40 md:h-40 flex items-center justify-center relative transition-transform ${isHurt ? 'animate-shake filter drop-shadow-[0_0_20px_rgba(220,38,38,1)]' : 'animate-idle'}`}>
                  {currentMob?.sprite && !imageError ? (
                    <AssetImage
                      key={currentMob.id}
                      src={currentMob.sprite} 
                      alt={currentMob.name} 
                      className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" 
                      style={{ imageRendering: "pixelated" }} 
                      onAllSourcesFail={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-[80px] md:text-[120px] leading-none select-none drop-shadow-lg">{currentMob?.emoji || "👾"}</span>
                  )}
                </div>
                
                <div className="mt-1 md:mt-2 text-center w-40 md:w-64 bg-black/80 p-1.5 md:p-2 rounded-lg border-2 border-red-900 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <h3 className="text-xs md:text-lg font-bold text-white truncate">{currentMob.name}</h3>
                    <span className="text-yellow-400 text-[10px] md:text-sm">{'⭐'.repeat(currentMob.difficulty)}</span>
                  </div>
                  <div className="h-2 md:h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-300" style={{ width: `${enemyHpPct}%` }} />
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white drop-shadow-md">
                      {Math.max(0, Math.round(enemyHp))} / {enemyMaxHp}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute top-0 w-full p-2 md:p-4 flex justify-between items-start z-30 pointer-events-none">
            <div className="bg-black/60 px-2 md:px-4 py-1 md:py-2 rounded-lg border border-white/10 backdrop-blur-sm">
              <h2 className="text-sm md:text-xl font-bold text-arcane-gold drop-shadow-md">{currentZone.name}</h2>
            </div>
            <div className="bg-green-900/80 px-2 md:px-4 py-1 md:py-2 rounded-full font-bold text-[10px] md:text-sm text-green-400 animate-pulse border border-green-500/30 backdrop-blur-sm">⚔️ Caçando</div>
          </div>
        </div>

        <div className={`${mobilePanelOpen ? "block" : "hidden"} md:block`}>
          <div className="bg-gradient-to-b from-arcane-panel to-black/60 border-2 border-arcane-purple/40 rounded-xl p-3 md:p-4 shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-arcane-gold rounded-tl-lg opacity-50"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-arcane-gold rounded-tr-lg opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-arcane-gold rounded-bl-lg opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-arcane-gold rounded-br-lg opacity-50"></div>

            <h3 className="text-center font-bold text-arcane-gold text-xs md:text-sm uppercase tracking-widest mb-3 md:mb-4">
              ✦ Controle Arcano ✦
            </h3>

            {raceSkill && character.activeRace && (
              <div className="mb-3 md:mb-4">
                <div className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center justify-between">
                  <span>🔮 Magia da Classe</span>
                  <span className={`${hasEnoughMana ? "text-blue-400" : "text-red-400"} text-[9px]`}>{magicManaCost} MP</span>
                </div>
                <div className={`relative p-2 md:p-3 rounded-lg border-2 transition-all overflow-hidden ${magicReady && hasEnoughMana ? "border-purple-500 bg-purple-900/30 shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "border-gray-700 bg-arcane-bg"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-lg md:text-2xl ${magicReady && hasEnoughMana ? "animate-pulse" : "opacity-50"}`}>{spellEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] md:text-xs font-bold text-white truncate">{raceSkill.desc.split(":")[0]}</div>
                      <div className={`text-[8px] md:text-[9px] font-bold ${magicReady && hasEnoughMana ? "text-green-400" : "text-red-400"}`}>
                        {hasEnoughMana ? (magicReady ? "✓ PRONTA" : "Recarregando...") : "Sem Mana"}
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 md:h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${magicReady ? "bg-green-500" : "bg-gradient-to-r from-purple-600 to-purple-400"}`} style={{ width: `${magicPct}%` }} />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-3 md:mb-4">
              <div className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold mb-1">❤️ Poção de Vida</div>
              <div className="space-y-1.5 bg-black/30 p-2 rounded-lg border border-arcane-border/50">
                <label className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300">
                  <input type="checkbox" checked={!!character.autoHpPotionEnabled} onChange={e => updateSettings({ autoHpPotionEnabled: e.target.checked })} className="accent-red-500" />
                  Ativar automaticamente
                </label>
                <select 
                  value={character.autoHpPotionId || "POCAO_VIDA_1"} 
                  onChange={(e) => updateSettings({ autoHpPotionId: e.target.value })}
                  className="w-full bg-arcane-bg border border-arcane-border rounded px-2 py-1 text-white text-[10px] md:text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="POCAO_VIDA_1">Poção Pequena</option>
                  <option value="POCAO_VIDA_2">Poção Média</option>
                  <option value="POCAO_VIDA_3">Poção Grande</option>
                  <option value="POCAO_VIDA_4">Poção Superior</option>
                  <option value="POCAO_VIDA_5">Poção Suprema</option>
                </select>
                {selectedHpPotion && <div className="flex items-center gap-2 rounded-md border border-red-900/40 bg-red-950/20 px-2 py-1.5"><ItemIcon item={selectedHpPotion} className="h-9 w-9 shrink-0" /><span className="text-[10px] leading-tight text-gray-300"><strong className="block text-red-200">{selectedHpPotion.name}</strong>Recupera {selectedHpPotion.stats.hp?.toLocaleString("pt-BR")} HP por ativação</span></div>}
                <div className="flex justify-between text-[9px] md:text-[10px]"><span className="text-gray-500">Cura {selectedHpPotion?.stats.hp?.toLocaleString("pt-BR") ?? 0} HP por uso</span><strong className="text-arcane-gold">💰 {getPotionUsePrice(character.autoHpPotionId).toLocaleString("pt-BR")} gold/uso</strong></div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" min="10" max="90" step="5"
                    value={character.autoHpPotionPercent || 50} 
                    onChange={(e) => updateSettings({ autoHpPotionPercent: Number(e.target.value) })}
                    className="flex-1 accent-red-500" 
                  />
                  <span className="text-[10px] md:text-xs font-bold text-red-400 w-10 text-right">{character.autoHpPotionPercent || 50}%</span>
                </div>
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <div className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold mb-1">🔵 Poção de Mana</div>
              <div className="space-y-1.5 bg-black/30 p-2 rounded-lg border border-arcane-border/50">
                <label className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300">
                  <input type="checkbox" checked={!!character.autoMpPotionEnabled} onChange={e => updateSettings({ autoMpPotionEnabled: e.target.checked })} className="accent-blue-500" />
                  Ativar automaticamente
                </label>
                <select 
                  value={character.autoMpPotionId || "POCAO_MANA_1"} 
                  onChange={(e) => updateSettings({ autoMpPotionId: e.target.value })}
                  className="w-full bg-arcane-bg border border-arcane-border rounded px-2 py-1 text-white text-[10px] md:text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="POCAO_MANA_1">Mana Pequena</option>
                  <option value="POCAO_MANA_2">Mana Média</option>
                  <option value="POCAO_MANA_3">Mana Grande</option>
                </select>
                {selectedMpPotion && <div className="flex items-center gap-2 rounded-md border border-blue-900/40 bg-blue-950/20 px-2 py-1.5"><ItemIcon item={selectedMpPotion} className="h-9 w-9 shrink-0" /><span className="text-[10px] leading-tight text-gray-300"><strong className="block text-blue-200">{selectedMpPotion.name}</strong>Recupera {selectedMpPotion.stats.mp?.toLocaleString("pt-BR")} MP por ativação</span></div>}
                <div className="flex justify-between text-[9px] md:text-[10px]"><span className="text-gray-500">Restaura {selectedMpPotion?.stats.mp?.toLocaleString("pt-BR") ?? 0} MP por uso</span><strong className="text-arcane-gold">💰 {getPotionUsePrice(character.autoMpPotionId).toLocaleString("pt-BR")} gold/uso</strong></div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" min="10" max="90" step="5"
                    value={character.autoMpPotionPercent || 50} 
                    onChange={(e) => updateSettings({ autoMpPotionPercent: Number(e.target.value) })}
                    className="flex-1 accent-blue-500" 
                  />
                  <span className="text-[10px] md:text-xs font-bold text-blue-400 w-10 text-right">{character.autoMpPotionPercent || 50}%</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 p-2 rounded-lg border border-arcane-border/50 mb-2">
              <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">Status Rápido</div>
              <div className="grid grid-cols-2 gap-1 text-[9px] md:text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="text-red-400">❤️</span>
                  <span className="text-white font-bold">{Math.round((character.hp / character.hpMax) * 100)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-400">🔵</span>
                  <span className="text-white font-bold">{Math.round((character.mp / character.mpMax) * 100)}%</span>
                </div>
                {activeVialCount > 0 && (
                  <div className="col-span-2 flex items-center gap-1 text-purple-400">
                    <span>🧪</span>
                    <span className="font-bold">{activeVialCount} Vial{activeVialCount > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/35 to-black/40 p-2.5 rounded-lg border border-cyan-900/50 mb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-cyan-300 uppercase font-black tracking-wider">📊 Rendimento da Hunt</div>
                <div className="font-mono text-[9px] text-gray-500">{formatHuntDuration(huntStats?.activeMs ?? 0)}</div>
              </div>
              <div className="mb-2 space-y-1.5">
                {[{ label: "Stamina online", value: character.staminaOnline ?? 120, max: 120, color: "bg-emerald-400", hint: "Caça durante a sessão" }, { label: "Stamina offline", value: character.staminaOffline ?? 480, max: 480, color: "bg-violet-400", hint: "Progresso ao retornar" }].map(pool => <div key={pool.label} title={pool.hint}>
                  <div className="mb-0.5 flex justify-between text-[8px] text-gray-400"><span>{pool.label}</span><b className="font-mono text-gray-200">{Math.floor(pool.value)} / {pool.max} min</b></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/50"><div className={`h-full ${pool.color} transition-all`} style={{ width: `${Math.max(0, Math.min(100, pool.value / pool.max * 100))}%` }} /></div>
                </div>)}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] md:text-[10px]">
                <div><div className="text-gray-500">EXP/h</div><div className="font-bold text-cyan-300">{metricNumber.format(huntHours ? (huntStats?.xp ?? 0) / huntHours : 0)}</div></div>
                <div><div className="text-gray-500">GOLD/h líquido</div><div className="font-bold text-arcane-gold">{metricNumber.format(actualGoldPerHour)}</div></div>
                <div><div className="text-gray-500">GOLD/h com venda</div><div className="font-bold text-emerald-300">{metricNumber.format(sellLootGoldPerHour)}</div></div>
                <div><div className="text-gray-500">Abates</div><div className="font-bold text-white">{metricNumber.format(huntStats?.kills ?? 0)}</div></div>
                <div title={describeDamageBreakdown(huntStats?.history ?? [])} className="cursor-help"><div className="text-gray-500">Dano causado ⓘ</div><div className="font-bold text-orange-300">{metricNumber.format(huntStats?.damageDealt ?? 0)}</div></div>
                <div title={describeDamageBreakdown(huntStats?.history ?? [], true)} className="cursor-help"><div className="text-gray-500">Dano recebido ⓘ</div><div className="font-bold text-rose-300">{metricNumber.format(huntStats?.damageTaken ?? 0)}</div></div>
              </div>
              <div className="mt-2 border-t border-white/5 pt-1.5 text-[8px] leading-relaxed text-gray-500">
                GOLD/h líquido desconta o gold gasto em poções. GOLD/h com venda projeta o valor dos drops equipáveis.
              </div>
              <details className="group mt-2 border-t border-white/5 pt-1.5">
                <summary className="cursor-pointer list-none text-[9px] font-bold text-gray-400 hover:text-white">📜 Registro de combate ({huntStats?.history.length ?? 0}) <span className="float-right group-open:rotate-180">⌄</span></summary>
                {recentEncounters.length === 0 ? <div className="py-2 text-[9px] text-gray-600">Os combates concluídos aparecerão aqui.</div> :
                  <div className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                    {recentEncounters.map(record => <div key={record.id} className="rounded-md border border-white/5 bg-black/30 p-2 text-[9px]">
                      <div className="flex items-start justify-between gap-2"><span className="font-bold text-white">{record.outcome === "death" ? "☠️ " : "⚔️ "}{record.enemyName}</span><time className="shrink-0 text-gray-600">{new Date(record.timestamp).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</time></div>
                      <div className="mt-1 grid grid-cols-2 gap-x-2 text-gray-400"><span title={describeDamageBreakdown([record])}>⚔️ Causado: <b className="text-orange-300">{metricNumber.format(record.damageDealt)}</b></span><span title={describeDamageBreakdown([record], true)}>🩸 Recebido: <b className="text-rose-300">{metricNumber.format(record.damageTaken)}</b></span><span>✨ {metricNumber.format(record.xp)} EXP</span><span>🪙 {metricNumber.format(record.gold + record.soldGold)} gold</span>{!!record.goldSpentPotions && <span>🧪 Poções: <b className="text-arcane-gold">−{metricNumber.format(record.goldSpentPotions)} gold</b></span>}</div>
                      {record.loot.length > 0 && <div className="mt-1 border-t border-white/5 pt-1 text-gray-400">Loot: {record.loot.map((item, index) => <span key={`${record.id}-${index}`} className="mr-1">{item.icon} {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>)}<div className="mt-0.5 text-emerald-400/80">Valor potencial de venda: {metricNumber.format(record.lootValue)} gold</div></div>}
                    </div>)}
                  </div>}
              </details>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center z-10 border-t border-arcane-border pt-3">
        <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-2">Alvos Disponíveis</span>
        <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
          {currentZone.enemies.map((e) => {
             const locked = character.level < (e.minLevel || 1);
             const quest = QUESTS.find(q => q.id === trackedQuestId && q.zoneId === currentZone.id);
             const isQuestTarget = !!quest?.objectives.some(obj => obj.target === e.id || obj.target === e.componentId || obj.target === e.essenceId);
             return (
               <button key={e.id} disabled={locked} onClick={() => setActiveEnemy(e.id)} title={isQuestTarget ? "Alvo da missão rastreada" : e.name} className={`p-1.5 md:p-2 rounded-lg border flex flex-col items-center transition-all ${isQuestTarget && !locked ? "border-2 border-arcane-gold ring-2 ring-arcane-gold/40 shadow-[0_0_20px_rgba(201,160,77,.45)] opacity-100" : locked ? "opacity-30 border-gray-800 bg-gray-900 cursor-not-allowed" : currentMob?.id === e.id ? "border-arcane-gold bg-arcane-gold/10 scale-105 shadow-lg" : "border-arcane-border opacity-50 hover:opacity-100"}`}>
                  <span className="text-xl md:text-2xl">{e.emoji}</span>
                  {isQuestTarget && <span className="text-[8px] font-black text-arcane-gold">QUEST</span>}
                  <span className="text-[8px] md:text-[10px] text-yellow-400">{'⭐'.repeat(e.difficulty)}</span>
                  {locked && <span className="text-[8px] text-red-500 font-bold">Nv {e.minLevel}</span>}
               </button>
             )
          })}
        </div>
      </div>
    </div>
  );
}
