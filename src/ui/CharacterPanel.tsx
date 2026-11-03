import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatVital, vitalPercent } from '../utils/vitals';
import { getBaseStats } from '../engine/stats';
import { getGearScore } from '../engine/gearScore';
export function CharacterPanel() {
 const {character:c,buyBless}=useGameStore(); if(!c)return null; const base=getBaseStats(c.level);
 return <div className="character-vitals flex flex-wrap gap-3 text-xs font-sans">
 {([{label:'HP',current:c.hp,max:c.hpMax,base:base.hp!,text:'text-red-400',fill:'from-red-600 to-red-400'},{label:'MP',current:c.mp,max:c.mpMax,base:base.mp!,text:'text-blue-400',fill:'from-blue-600 to-blue-400'}]).map(v=><div key={v.label} className="w-32" title={v.label+' base por nível: '+formatVital(v.base)+' · Bônus atuais: '+formatVital(v.max-v.base)+' · Total: '+formatVital(v.max)}><div className={'flex justify-between mb-1 '+v.text}><span>{v.label}</span><span>{formatVital(v.current)}/{formatVital(v.max)}</span></div><div className="h-2.5 bg-gray-900 rounded-full overflow-hidden"><div className={'h-full bg-gradient-to-r transition-all duration-300 '+v.fill} style={{width:vitalPercent(v.current,v.max)+'%'}}/></div></div>)}
 <div className="w-32"><div className="flex justify-between text-arcane-gold mb-1"><span>XP</span><span>{formatVital(c.xp)}/{formatVital(c.xpToNext)}</span></div><div className="h-2.5 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-600 to-arcane-gold transition-all duration-300" style={{width:vitalPercent(c.xp,c.xpToNext)+'%'}}/></div><button type="button" onClick={buyBless} className={`mt-1 w-full rounded border px-2 py-1 text-[10px] font-black transition ${c.blesses > 0 ? "border-arcane-gold/50 bg-arcane-gold/10 text-arcane-gold" : "animate-pulse border-red-500 bg-red-950/80 text-red-200 shadow-[0_0_12px_rgba(239,68,68,.75)]"}`} title={c.blesses > 0 ? `Blesses ativos: ${c.blesses}/5` : "Você está sem Bless. Clique para comprar proteção."}>✨ Bless {c.blesses || 0}/5{c.blesses === 0 && " · !"}</button></div>
 <div className="character-gold text-arcane-gold font-bold bg-arcane-border/50 px-3 py-1 rounded-full flex items-center"><span aria-hidden="true">✧</span>&nbsp;{c.gold.toLocaleString()}</div>
 <div className="rounded-full border border-arcane-gold/50 bg-arcane-gold/10 px-3 py-1 font-black text-arcane-gold" title="Soma ponderada de equipamento, atributos, skills, treino, matriz, resistências e Divine Beast">⚔ Gear Score: {getGearScore(c).toLocaleString('pt-BR')}</div>
 </div>;
}
