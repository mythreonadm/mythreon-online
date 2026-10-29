import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { ZONES } from "../data/zones";
import { getSpellEffect, getWeaponAnimation } from "../utils/combatVisuals";
import { CharacterSkills } from "../types";
import { skillXpToNextLevel } from "../engine/stats";
import { VIALS } from "../data/vials";

export function ZoneView() {
  const { character, currentZoneId, startHunting, stopHunting, startTraining, stopTraining, isTickRunning, isTraining, lastTickResult, setActiveEnemy, activateBuff, updateSettings, buyBless, healFull, startHealing, cancelHealing, healingUntil } = useGameStore();
  
  const [isHurt, setIsHurt] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<number | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showProjectile, setShowProjectile] = useState(false);
  const [balloon, setBalloon] = useState<{ x: number; y: number } | null>(null);
  const [buffTimeLeft, setBuffTimeLeft] = useState(0);
  const [houseTab, setHouseTab] = useState<"maps" | "train">("maps");
  const [showConfig, setShowConfig] = useState(false);
  const [healTimer, setHealTimer] = useState(0);

  const balloonTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!character) return null;
  const currentZone = ZONES[currentZoneId];
  const currentMob = currentZone.enemies.find(e => e.id === character.activeEnemyId) || currentZone.enemies[0];

  // Lógica do Timer de Cura
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
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-8 shadow-lg flex flex-col items-center min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-10 p-10 pointer-events-none">
            <span className="text-9xl">🏠</span><span className="text-9xl">🪵</span>
          </div>
          
          <div className="z-10 w-full max-w-4xl">
            
            {/* BOTÃO DE BLESS E MEDITAÇÃO */}
            <div className="flex justify-center gap-4 mb-6">
              <button onClick={buyBless} className="bg-arcane-gold text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(201,160,77,0.5)]">
                ✨ Comprar Bless
                <span className="bg-black/20 px-2 py-0.5 rounded text-sm">{character.blesses || 0}/5</span>
              </button>
              
              {(character.hp < character.hpMax || character.mp < character.mpMax) && (
                healingUntil ? (
                  <button disabled className="bg-gray-800 text-arcane-cyan px-6 py-2 rounded-lg font-bold animate-pulse border border-arcane-cyan/50">
                    🧘 Meditando... {healTimer}s
                  </button>
                ) : (
                  <button onClick={startHealing} className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    🧘 Meditar (Cura em 15s)
                  </button>
                )
              )}
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <button onClick={() => setHouseTab("maps")} className={`px-6 py-2 rounded-lg font-bold transition-all ${houseTab === "maps" ? "bg-arcane-gold text-black" : "bg-gray-800 text-gray-400"}`}>🗺️ Mapas</button>
              <button onClick={() => setHouseTab("train")} className={`px-6 py-2 rounded-lg font-bold transition-all ${houseTab === "train" ? "bg-arcane-gold text-black" : "bg-gray-800 text-gray-400"}`}>🏋️ Treinar Skills</button>
            </div>

            {houseTab === "maps" && (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-[100px] leading-none mb-4 drop-shadow-[0_0_15px_rgba(201,160,77,0.5)] animate-idle">🛏️</div>
                <h2 className="text-3xl font-bold text-arcane-gold mb-2">Sua Cabana Aconchegante</h2>
                <p className="text-gray-400 mb-8 text-center max-w-md">Descanse para recuperar HP, ou escolha uma zona para explorar.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                  {Object.values(ZONES).map(z => {
                      const isLocked = character.level < z.minLevel;
                      return (
                        <button key={z.id} disabled={isLocked} onClick={() => startHunting(z.id)} className={`px-6 py-4 rounded-xl font-bold flex flex-col items-center transition-all ${isLocked ? "bg-gray-900 text-gray-600 cursor-not-allowed" : "bg-arcane-purple hover:bg-arcane-purple/80 text-white shadow-lg hover:scale-105"}`}>
                          <span className="text-2xl mb-2">⚔️</span>
                          Caçar em {z.name}
                          {isLocked && <span className="text-xs font-normal mt-1">Requer Nível {z.minLevel}</span>}
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {skillsList.map(s => (
                    <button key={s.key} onClick={() => startTraining(s.key)} className="bg-arcane-bg border border-arcane-border hover:border-arcane-gold p-4 rounded-xl flex flex-col items-center transition-all group hover:-translate-y-1">
                      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="font-bold text-white mb-1">{s.name}</span>
                      <span className="text-2xl font-black text-arcane-cyan">{character.skills[s.key]}</span>
                      <span className="text-[10px] text-gray-500 text-center mt-2">{s.desc}</span>
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

  // ... (O resto da tela de treino e caçada continua igual)
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
          <button onClick={stopTraining} className="bg-red-900/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-red-500/50 shadow-md">
            🛑 Parar Treino
          </button>
        </div>
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-10 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-6xl mb-6 animate-bounce">🏋️</div>
          <h2 className="text-3xl font-bold text-arcane-gold mb-2">Treinando {skillName}</h2>
          <p className="text-gray-400 mb-8">Seu personagem está treinando...</p>
          
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-arcane-cyan font-bold">Nível {currentLevel}</span>
              <span className="text-gray-400">{currentXp} / {xpNeeded} XP</span>
            </div>
            <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-arcane-border relative">
              <div className="h-full bg-gradient-to-r from-arcane-purple to-arcane-cyan transition-all duration-300" style={{ width: `${xpPct}%` }} />
            </div>
            
            {lastTickResult?.skillLevelUp && (
              <div className="mt-6 text-center text-green-400 font-bold animate-pulse">
                {lastTickResult.skillLevelUp}
              </div>
            )}
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
      case "forest": return "/assets/backgrounds/floresta.png";
      case "mountain": return "/assets/backgrounds/montanha.png";
      case "ocean": return "/assets/backgrounds/oceano.png";
      case "ruins": return "/assets/backgrounds/ruinas.png";
      case "abyss": return "/assets/backgrounds/abismo.png";
      default: return "";
    }
  };

  const getPlayerVisual = () => {
    const weaponId = character.equipped.ARMA_PRINCIPAL?.templateId || "";
    if (weaponId.includes("ARCO")) return "/assets/players/arqueiro.gif";
    if (weaponId.includes("CAJADO") || weaponId.includes("VARINHA")) return "/assets/players/mago.gif";
    return "/assets/players/guerreiro.gif"; 
  };

  const getPlayerFallbackEmoji = () => {
    const weaponId = character.equipped.ARMA_PRINCIPAL?.templateId || "";
    if (weaponId.includes("ARCO")) return "🧝‍♂️";
    if (weaponId.includes("CAJADO") || weaponId.includes("VARINHA")) return "🧙‍♂️";
    return "🤺";
  };

  const weaponAnimClass = isAttacking ? getWeaponAnimation(character.equipped.ARMA_PRINCIPAL?.templateId) : "animate-run";
  const spellEmoji = getSpellEffect(character.activeRace?.ataqueId || "A1");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center relative z-50">
        <div className="flex gap-4 items-center">
          {buffTimeLeft > 0 && (
             <div className="bg-yellow-900/90 px-4 py-2 rounded-lg text-yellow-300 font-bold animate-pulse flex items-center gap-2">
               <span className="text-xl">⚡</span> Ataque Duplo: {Math.floor(buffTimeLeft / 60)}:{(buffTimeLeft % 60).toString().padStart(2, '0')}
             </div>
          )}
          <button onClick={() => setShowConfig(!showConfig)} className="bg-arcane-panel border border-arcane-border hover:border-arcane-gold px-4 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2">⚙️ Configurar Poções</button>
        </div>
        <button onClick={stopHunting} className="bg-red-900/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-red-500/50 shadow-md ml-auto">🏃‍♂️ Sair da Caçada</button>
      </div>

      {showConfig && (
        <div className="bg-arcane-panel border-2 border-arcane-gold p-4 rounded-xl shadow-lg relative z-40">
          <h3 className="text-lg font-bold text-arcane-gold mb-3">Automação de Poções</h3>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-arcane-bg p-3 rounded border border-arcane-border">
              <label className="text-sm font-bold text-red-400 block mb-2">❤️ Poção de Vida</label>
              <div className="flex gap-2">
                <select 
                  value={character.autoHpPotionId || ""} 
                  onChange={(e) => updateSettings({ autoHpPotionId: e.target.value })}
                  className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm flex-1"
                >
                  <option value="">Desativado</option>
                  <option value="POCAO_VIDA_1">Poção Pequena</option>
                  <option value="POCAO_VIDA_2">Poção Média</option>
                  <option value="POCAO_VIDA_3">Poção Grande</option>
                  <option value="POCAO_VIDA_4">Poção Superior</option>
                  <option value="POCAO_VIDA_5">Poção Suprema</option>
                </select>
                <input 
                  type="number" min="10" max="90" 
                  value={character.autoHpPotionPercent || 50} 
                  onChange={(e) => updateSettings({ autoHpPotionPercent: Number(e.target.value) })}
                  className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm w-16 text-center" 
                />
                <span className="text-gray-400 self-center">% HP</span>
              </div>
            </div>

            <div className="bg-arcane-bg p-3 rounded border border-arcane-border">
              <label className="text-sm font-bold text-blue-400 block mb-2">🔮 Poção de Mana</label>
              <div className="flex gap-2">
                <select 
                  value={character.autoMpPotionId || ""} 
                  onChange={(e) => updateSettings({ autoMpPotionId: e.target.value })}
                  className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm flex-1"
                >
                  <option value="">Desativado</option>
                  <option value="POCAO_MANA_1">Mana Pequena</option>
                  <option value="POCAO_MANA_2">Mana Média</option>
                  <option value="POCAO_MANA_3">Mana Grande</option>
                </select>
                <input 
                  type="number" min="10" max="90" 
                  value={character.autoMpPotionPercent || 50} 
                  onChange={(e) => updateSettings({ autoMpPotionPercent: Number(e.target.value) })}
                  className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm w-16 text-center" 
                />
                <span className="text-gray-400 self-center">% MP</span>
              </div>
            </div>

          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-gray-400 border-t border-arcane-border pt-3">
            <span>Vials Ativos:</span>
            {Object.entries(character.activeVials).map(([id, time]) => {
              if (time < Date.now()) return null;
              const v = VIALS[id];
              if (!v) return null;
              const mins = Math.ceil((time - Date.now()) / 60000);
              return <span key={id} className="text-arcane-cyan bg-arcane-cyan/10 px-2 py-1 rounded">{v.icon} {v.name} ({mins}m)</span>
            })}
            {Object.keys(character.activeVials).filter(id => character.activeVials[id] > Date.now()).length === 0 && <span>Nenhum</span>}
          </div>
        </div>
      )}
      
      <div className={`relative rounded-xl border-2 border-arcane-border shadow-2xl overflow-hidden min-h-[400px] bg-${currentZone.theme}`}>
        
        <div className="absolute inset-0 z-0">
          <img src={getBackgroundImage(currentZone.theme)} alt={currentZone.name} className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        </div>

        {balloon && (
          <div onClick={handleBalloonClick} className="absolute z-50 cursor-pointer animate-idle hover:scale-125 transition-transform" style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }} title="Clique rápido para ganhar Ataque Duplo!">
            <div className="text-5xl drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] relative">
              🎈
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-black text-yellow-300">⚡</div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full h-16 bg-black/70 border-t-2 border-white/10 z-10 pointer-events-none"></div>

        <div className="relative z-20 flex justify-between items-end px-20 pb-12 h-[400px]">
          
          <div className="flex flex-col items-center relative translate-y-4">
             <div className={`w-32 h-32 flex items-center justify-center transition-transform ${weaponAnimClass}`}>
                <img src={getPlayerVisual()} alt="Jogador" className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" style={{ imageRendering: "pixelated" }} onError={(e) => { e.currentTarget.style.display = 'none'; if(e.currentTarget.nextElementSibling) { (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block'; } }} />
                <span className="text-[100px] leading-none select-none hidden drop-shadow-lg">{getPlayerFallbackEmoji()}</span>
             </div>
             <div className="mt-2 text-center w-48 bg-black/80 p-2 rounded-lg border-2 border-arcane-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <h3 className="text-sm font-bold text-arcane-cyan">{character.name}</h3>
                <div className="h-2 bg-gray-900 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(character.hp / character.hpMax) * 100}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{character.hp} / {character.hpMax} HP</div>
             </div>
          </div>

          {showProjectile && (
             <div className="absolute left-[30%] top-1/2 -translate-y-1/2 text-6xl projectile z-30">{spellEmoji}</div>
          )}

          {currentMob && (
            <div className="flex flex-col items-center relative translate-y-4">
              {floatingDamage !== null && <div className="damage-number text-red-500 text-5xl z-50 font-black drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">-{floatingDamage}</div>}
              
              <div className={`w-40 h-40 flex items-center justify-center relative transition-transform ${isHurt ? 'animate-shake filter drop-shadow-[0_0_20px_rgba(220,38,38,1)]' : 'animate-idle'}`}>
                {currentMob?.sprite ? (
                  <>
                    <img src={currentMob.sprite} alt={currentMob.name} className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" style={{ imageRendering: "pixelated" }} onError={(e) => { e.currentTarget.style.display = 'none'; if(e.currentTarget.nextElementSibling) { (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block'; } }} />
                    <span className="text-[120px] leading-none select-none hidden absolute drop-shadow-lg">{currentMob?.emoji || "👾"}</span>
                  </>
                ) : (
                  <span className="text-[120px] leading-none select-none drop-shadow-lg">{currentMob?.emoji || "👾"}</span>
                )}
              </div>
              
              <div className="mt-2 text-center w-64 bg-black/80 p-2 rounded-lg border-2 border-red-900 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                 <div className="flex justify-between items-center mb-1 px-1">
                   <h3 className="text-lg font-bold text-white truncate">{currentMob.name}</h3>
                   <span className="text-yellow-400 text-sm">{'⭐'.repeat(currentMob.difficulty)}</span>
                 </div>
                 <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-300" style={{ width: `${enemyHpPct}%` }} />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                       {Math.max(0, Math.round(enemyHp))} / {enemyMaxHp}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute top-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
           <div className="bg-black/60 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
             <h2 className="text-xl font-bold text-arcane-gold drop-shadow-md">{currentZone.name}</h2>
           </div>
           <div className="bg-green-900/80 px-4 py-2 rounded-full font-bold text-sm text-green-400 animate-pulse border border-green-500/30 backdrop-blur-sm">⚔️ Caçando...</div>
        </div>
      </div>

      <div className="flex flex-col items-center z-10 border-t border-arcane-border pt-4">
        <span className="text-xs text-gray-400 font-bold uppercase mb-3">Alvos Disponíveis</span>
        <div className="flex gap-4 flex-wrap justify-center">
          {currentZone.enemies.map((e) => {
             const locked = character.level < (e.minLevel || 1);
             return (
               <button key={e.id} disabled={locked} onClick={() => setActiveEnemy(e.id)} className={`p-2 rounded-lg border flex flex-col items-center transition-all ${locked ? "opacity-30 border-gray-800 bg-gray-900 cursor-not-allowed" : currentMob?.id === e.id ? "border-arcane-gold bg-arcane-gold/10 scale-105 shadow-lg" : "border-arcane-border opacity-50 hover:opacity-100"}`}>
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="text-[10px] text-yellow-400">{'⭐'.repeat(e.difficulty)}</span>
                  {locked && <span className="text-[9px] text-red-500 font-bold">Nv {e.minLevel}</span>}
               </button>
             )
          })}
        </div>
      </div>
    </div>
  );
}