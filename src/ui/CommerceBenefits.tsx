import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { PREMIUM_BENEFITS } from "../data/mythreonEconomy";

export function CommerceBenefits() {
  const { character, buyTrainingBoost } = useGameStore();
  const [message, setMessage] = useState("");
  if (!character) return null;
  const used = character.trainingBoostDay === new Date().toISOString().slice(0,10);
  return <div className="grid gap-4 mb-5 md:grid-cols-2">
    <section className="rounded-xl border border-cyan-700/40 bg-arcane-panel p-5"><h2 className="text-xl font-bold text-cyan-200">Disciplina diária</h2><p className="my-3 text-sm text-gray-300">+50% de XP de treino por 30 minutos corridos. Disponível a todos, uma compra por dia; reinicia às 00:00 UTC. O tempo passa mesmo fora do treino.</p><button disabled={used} onClick={() => { const result = buyTrainingBoost(); setMessage(result.success ? "Treino aprimorado ativado por 30 minutos." : result.error ?? "Indisponível."); }} className="rounded bg-cyan-700 px-4 py-2 font-bold disabled:opacity-40">{used ? "Adquirido hoje" : "Ativar · 250 gold"}</button><p role="status" className="mt-2 text-sm text-cyan-200">{message}</p></section>
    <section className="rounded-xl border border-arcane-gold/40 bg-arcane-panel p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-arcane-gold">Premium Account</h2><span className="rounded border border-arcane-gold/30 px-2 py-1 text-[10px] font-bold text-arcane-gold">{character.premium ? "ATIVA" : "EM PREPARAÇÃO"}</span></div><p className="my-3 text-sm text-gray-300">Uma assinatura de conveniência para apoiar o servidor, sem transformar o Premium em uma vitória automática.</p>{character.premium&&<p className="mb-3 rounded border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-200">Plano {character.premiumPlanId??"Premium"} · válido até {character.premiumUntil?new Date(character.premiumUntil).toLocaleString("pt-BR"):"—"}</p>}<ul className="grid gap-1 text-xs text-gray-300 sm:grid-cols-2">{PREMIUM_BENEFITS.map(benefit => <li key={benefit}>✓ {benefit}</li>)}</ul><p className="mt-3 text-xs text-gray-500">A ativação é server-side: checkout envia um webhook assinado para `/api/premium`, que registra o entitlement. O navegador nunca consegue creditar Premium sozinho.</p></section>
  </div>;
}
