import React from 'react';
import { JOURNEY_CHAPTERS } from '../data/worldJourney';
import { ALL_COMPONENTS } from '../data/components';
import { useGameStore } from '../store/gameStore';
import { canEnterZone } from '../engine/journey';
import { countByTemplate } from '../engine/inventory';
export function PassageContract({zoneId,showLocked=false}:{zoneId:string;showLocked?:boolean}) {
 const {character:c,unlockZone,acceptQuest}=useGameStore();const [message,setMessage]=React.useState('');
 const ch=JOURNEY_CHAPTERS.find(x=>x.id===zoneId),pass=ch?.pass;
 if(!c||!pass||canEnterZone(c,zoneId))return null;
 const active=!!c.quests.active[pass.questId],eligible=c.level>=pass.level&&c.quests.completed.includes(pass.requires)&&!!c.tutorialCompleted;
 if(!eligible && !active && !showLocked)return <p className="mt-2 max-w-xs text-center text-xs text-gray-500">Avance na história para conhecer a expedição desta travessia.</p>;
 const resources=c.gold>=pass.gold&&pass.items.every(i=>countByTemplate(c.inventory,i.id)>=i.count);
 return <div className="my-3 rounded-lg border border-arcane-gold/30 bg-black/30 p-3 text-sm"><strong className="text-arcane-gold">{pass.npc} · contrato permanente</strong><p className="my-1 text-gray-400">Nível {pass.level} · concluir {pass.requires === 'LYSS_BOSS'?'O Espectro de Brasa':JOURNEY_CHAPTERS.find(x=>x.id+'_BOSS'===pass.requires)?.bossTitle??pass.requires}</p><p className={c.gold>=pass.gold?'text-green-400':'text-amber-400'}>Gold: {Math.floor(c.gold).toLocaleString('pt-BR')} / {pass.gold.toLocaleString('pt-BR')}</p>{pass.items.map(i=><p key={i.id} className={countByTemplate(c.inventory,i.id)>=i.count?'text-green-400':'text-gray-400'}>{ALL_COMPONENTS[i.id]?.name??i.id}: {countByTemplate(c.inventory,i.id)} / {i.count}</p>)}<p className="my-2 text-xs text-gray-500">Consome gold e os materiais da mochila uma única vez. Materiais no depósito precisam ser retirados.</p><button disabled={!eligible||active&&!resources} className="rounded bg-arcane-gold px-3 py-2 font-bold text-black disabled:opacity-40" onClick={()=>{if(!active){acceptQuest(pass.questId);setMessage('Contrato aceito. Confira os custos antes de entregar.');}else{const r=unlockZone(zoneId);setMessage(r.success?'Passagem liberada permanentemente!':r.error??'Não foi possível entregar.');}}}>{!active?'Aceitar contrato de travessia':resources?'Entregar recursos e abrir passagem':'Reúna os recursos'}</button>{message&&<p role="status" className="mt-2 text-arcane-cyan">{message}</p>}</div>;
}
export function WorldJourney() {
 const c=useGameStore(s=>s.character);
 return <section className="space-y-5"><header><p className="text-xs uppercase tracking-widest text-arcane-gold">Crônicas da Grande Ruptura</p><h2 className="text-2xl font-bold text-white">Sete biomas, uma memória partida</h2><p className="mt-2 text-sm text-gray-400">O Primeiro Canto permanece nos lugares e nas criaturas. Seu percurso conecta essas memórias por missões, preparação e travessias. Veyra e Kaelor são rotas laterais opcionais.</p></header>{JOURNEY_CHAPTERS.map((ch,i)=><article key={ch.id} className="rounded-xl border border-arcane-border bg-arcane-panel p-5"><p className="text-xs text-arcane-cyan">Capítulo {i+1} · {ch.subtitle} {c&&canEnterZone(c,ch.id)?'· Acesso liberado':''}</p><h3 className="my-2 text-xl font-bold text-arcane-gold">{ch.name}</h3><p className="text-gray-300">{ch.story}</p><p className="mt-3 text-sm text-gray-400">{ch.conflict}</p><details className="mt-3 text-sm text-gray-400"><summary className="cursor-pointer text-arcane-cyan">Conhecer a prova do guardião (história)</summary><p className="mt-2">{ch.resolution}</p></details><PassageContract zoneId={ch.id} showLocked/></article>)}</section>;
}
