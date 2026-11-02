import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { ZONES } from "../data/zones";
import { LabReport, LabResult } from "../engine/buildLab";
import { ELEMENTS, elementMultiplier } from "../data/elementalChart";

const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const chance = (row: LabResult) => row.trials ? Math.round(row.wins / row.trials * 100) : 0;
export function BuildLab() {
  const character = useGameStore(state => state.character);
  const currentZoneId = useGameStore(state => state.currentZoneId);
  const races = useGameStore(state => state.races);
  const [compareCollection, setCompareCollection] = useState(false);
  const [zoneId, setZoneId] = useState(currentZoneId);
  const [report, setReport] = useState<LabReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);
  if (!character) return null;
  const run = () => {
    worker.current?.terminate(); setBusy(true); setMessage("Preparando sua build…"); setReport(null);
    try {
      const next = new Worker(new URL("../engine/buildLab.worker.ts", import.meta.url), { type: "module" });
      worker.current = next;
      next.onmessage = event => {
        if (event.data.type === "progress") setMessage(event.data.message);
        else if (event.data.type === "result") { setReport(event.data.report); setBusy(false); setMessage("Análise concluída."); next.terminate(); }
        else { setBusy(false); setMessage(event.data.message); next.terminate(); }
      };
      next.onerror = () => { setBusy(false); setMessage("Não foi possível concluir. Tente analisar novamente."); next.terminate(); };
      next.postMessage({ character: structuredClone(character), zoneId, races: structuredClone(races.slice(0, 6)), compareCollection });
    } catch { setBusy(false); setMessage("Seu ambiente não conseguiu iniciar o laboratório."); }
  };
  const exportReport = () => {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `mythreon-laboratorio-${report.zoneId}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const active = report?.enemies.filter(row => !row.locked) ?? [];
  const locked = report?.enemies.filter(row => row.locked) ?? [];
  const ready = !!report && active.length > 0 && !locked.length && active.every(row => chance(row) >= 90);
  const target = report?.enemies.find(row => row.enemyId === report.targetId);
  const targetEnemy = report ? ZONES[report.zoneId].enemies.find(enemy => enemy.id === report.targetId) : undefined;
  return <div className="space-y-5">
    <section className="rounded-2xl border border-cyan-700/40 bg-gradient-to-br from-cyan-950/40 to-arcane-panel p-5 md:p-7">
      <p className="text-xs uppercase tracking-widest text-cyan-300">Preparação · comparação · evolução</p><h1 className="mt-2 text-2xl font-black text-white">Laboratório de Builds</h1>
      <p className="mt-3 max-w-3xl text-sm text-gray-300">Descubra onde sua preparação falha e compare maneiras de avançar. O laboratório usa uma cópia da build: não gasta gold, não equipa itens e não interfere na caça.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3"><label className="text-sm text-gray-300">Mapa <select value={zoneId} disabled={busy} onChange={e => { setZoneId(e.target.value); setReport(null); }} className="ml-2 rounded border border-white/20 bg-arcane-bg p-2 text-white">{Object.values(ZONES).map(zone => <option key={zone.id} value={zone.id}>{zone.name} · Nv {zone.minLevel}–{zone.maxLevel}</option>)}</select></label><button disabled={busy} onClick={run} className="rounded-lg bg-cyan-600 px-5 py-2 font-bold text-white disabled:opacity-50">Analisar build</button>{busy && <button onClick={() => { worker.current?.terminate(); setBusy(false); setMessage("Análise cancelada."); }} className="rounded border border-white/20 px-3 py-2 text-sm text-gray-300">Cancelar</button>}</div>
      <p role="status" aria-live="polite" className="mt-3 text-sm text-cyan-200">{message}</p>
      <label className="mt-3 flex items-center gap-2 text-xs text-gray-300"><input type="checkbox" checked={compareCollection} disabled={busy} onChange={e=>setCompareCollection(e.target.checked)} />Comparar também as 6 primeiras Matrizes da coleção e até 12 Beasts vinculadas.</label>
      <p className="mt-2 text-xs text-gray-500">20 tentativas por alvo, começando com HP/MP cheios, stamina disponível e seu gold atual. Cada duelo tem limite de 6 minutos. Vencer aqui estima preparação; não garante vitória nem equivale a completar todas as missões do mapa.</p>
    </section>
    {report && <>
      <section className="rounded-xl border border-white/10 bg-arcane-panel p-4"><div className="flex flex-wrap justify-between gap-3"><div><h2 className={`font-bold ${ready ? "text-emerald-300" : "text-amber-300"}`}>{ready ? "Boa preparação na amostra do mapa" : locked.length ? "O mapa ainda tem alvos bloqueados por nível" : "Há pontos de preparação a resolver"}</h2><p className="mt-1 text-xs text-gray-400">{report.name} · nível {report.level} · fotografia da build em {new Date(report.at).toLocaleTimeString("pt-BR")}. Reanalise após trocar equipamento ou treinar.</p></div><button onClick={exportReport} className="rounded border border-cyan-800 px-3 py-2 text-xs text-cyan-200">Salvar relatório</button></div>
        {report.needsRest && <p className="mt-3 text-sm text-amber-200">Antes de caçar, medite: seu personagem estava sem HP/MP completos. A simulação pressupõe descanso.</p>}
        {locked.length > 0 && <p className="mt-3 text-sm text-amber-200">Para liberar todos os alvos deste mapa, é necessário alcançar nível {Math.max(...report.enemies.map(row=>row.requiredLevel))}. Isso libera acesso; não garante força para vencer.</p>}
        <p className="mt-2 text-xs text-gray-400">Stamina online atual: {report.currentStamina.toFixed(1)} min. Os testes pressupõem reserva disponível; recupere stamina antes de iniciar se estiver esgotada.</p>
        <p className="mt-2 text-xs text-gray-400">HP {number.format(report.stats.hp ?? 0)} · ATK {number.format(report.stats.atk ?? 0)} · MATK {number.format(report.stats.matk ?? 0)} · ARM {number.format(report.stats.arm ?? 0)} · Gold disponível {number.format(report.currentGold)}</p>
      </section>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-arcane-panel"><table className="w-full min-w-[680px] text-left text-sm"><caption className="p-4 text-left font-bold text-white">Sua build contra cada inimigo</caption><thead className="bg-black/20 text-xs text-gray-400"><tr>{["Alvo", "Resultado", "Tempo médio", "Dano recebido", "Poções", "Gold líquido"].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{report.enemies.map(row => <tr key={row.enemyId} className="border-t border-white/5"><td className="p-3 text-gray-200">{row.enemyName}<small className="block text-gray-500">Nível mínimo {row.requiredLevel}</small></td><td className={`p-3 font-bold ${row.locked ? "text-gray-500" : chance(row) >= 90 ? "text-emerald-300" : "text-amber-300"}`}>{row.locked ? "Bloqueado" : `${row.wins}/${row.trials} vitórias`}</td><td className="p-3 text-gray-300">{row.locked ? "—" : `${row.seconds}s`}</td><td className="p-3 text-gray-300">{row.locked ? "—" : number.format(row.damageTaken)}</td><td className="p-3 text-gray-300">{row.locked ? "—" : `${number.format(row.potionGold)}g`}</td><td className={`p-3 ${row.netGold < 0 ? "text-rose-300" : "text-emerald-300"}`}>{row.locked ? "—" : `${number.format(row.netGold)}g`}</td></tr>)}</tbody></table><p className="p-3 text-xs text-gray-500">Médias por tentativa, incluindo derrotas. Gold líquido desconta poções, inclui a venda automática configurada e não inclui perda de gold/itens por morte. Não é previsão de lucro seguro. Limites de tempo contam como falhas.</p></div>
      {target && <section className="space-y-3"><div><h2 className="text-lg font-bold text-arcane-gold">O que comparar para enfrentar {target.enemyName}</h2><p className="text-xs text-gray-400">{chance(target) >= 90 ? "Sua build já atingiu 90% de vitórias na amostra. Estas são alternativas, não exigências adicionais." : "As opções abaixo foram testadas separadamente. Um plano com 18/20 vitórias é uma referência de preparação, não um requisito universal."}</p></div>
        {targetEnemy && <div className="rounded border border-white/10 bg-black/20 p-3 text-xs text-gray-300"><p>Alvo: {number.format(targetEnemy.hp*targetEnemy.difficulty)} HP · {number.format(targetEnemy.atk*targetEnemy.difficulty)} ataque · {number.format(targetEnemy.arm*targetEnemy.difficulty)} armadura. Tipo: {targetEnemy.damageType === "MAGICO" ? "mágico" : "físico"}. Afinidade: {ELEMENTS.find(e=>e.id===targetEnemy.element)?.name ?? "neutra"}.</p><p className="mt-1">Vantagem elemental contra este alvo: {ELEMENTS.filter(e=>elementMultiplier(e.id,targetEnemy.element)>1).map(e=>e.name).join(", ") || "nenhuma vantagem relacional"}. Resistências próprias do monstro também entram no cálculo.</p></div>}
        {target.manaStarved > 0 && <p className="rounded border border-blue-900 bg-blue-950/20 p-3 text-sm text-blue-200">Mana insuficiente apareceu em {target.manaStarved}/{target.trials} tentativas. Compare as poções e regeneração antes de investir somente em dano.</p>}
        <div className="grid gap-3 md:grid-cols-2">{report.plans.map(plan => <article key={plan.id} className={`rounded-xl border bg-arcane-panel p-4 ${chance(plan.result) >= 90 ? "border-emerald-800" : "border-white/10"}`}><p className="text-[10px] uppercase tracking-wider text-gray-500">{plan.hypothetical ? "Projeção · requer evolução ou farm" : "Recursos/configuração atuais"}</p><h3 className="mt-1 font-bold text-white">{plan.title}</h3><p className="mt-2 font-bold text-cyan-200">{plan.result.wins}/{plan.result.trials} vitórias · {plan.result.seconds}s · {number.format(plan.result.netGold)}g líquidos</p>{plan.trainingMinutes !== undefined && <p className="mt-1 text-sm text-amber-200">Treino estimado: {number.format(plan.trainingMinutes)} minutos sem caçar.</p>}<p className="mt-2 text-xs text-gray-400">HP {number.format(plan.stats.hp ?? 0)} · ATK {number.format(plan.stats.atk ?? 0)} · MATK {number.format(plan.stats.matk ?? 0)} · ARM {number.format(plan.stats.arm ?? 0)}</p><ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-gray-300">{plan.steps.map((step,index) => <li key={index}>{step}</li>)}</ul></article>)}</div>
        {!report.plans.some(plan => chance(plan.result) >= 90) && <p className="rounded border border-amber-800 p-3 text-sm text-amber-200">Nenhuma alternativa testada atingiu 90%. O laboratório não encontrou um plano suficiente nesta busca limitada; experimente outra Matriz/Beast, resistências ou uma preparação combinada.</p>}
      </section>}
      {report.endurance && <section className="rounded-xl border border-purple-800/40 bg-arcane-panel p-4"><h2 className="font-bold text-purple-200">Resistência para manter a hunt</h2><p className="mt-2 text-sm text-gray-300">Sua build atual completou cinco vitórias consecutivas contra {report.endurance.enemyName} em {report.endurance.wins}/{report.endurance.trials} tentativas, sem recuperar recursos entre lutas além das regras normais do combate.</p><p className="mt-2 text-xs text-gray-500">Esse teste não garante horas de hunt: inventário, stamina, duração dos buffs e saldo continuam limitando a sessão.</p></section>}
    </>}
  </div>;
}
