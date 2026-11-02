import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";

export function CommerceBenefits() {
  const { character, buyTrainingBoost } = useGameStore();
  const [message, setMessage] = useState("");
  if (!character) return null;
  const used = character.trainingBoostDay === new Date().toISOString().slice(0,10);
  return <div className="grid gap-4 mb-5 md:grid-cols-2">
    <section className="rounded-xl border border-cyan-700/40 bg-arcane-panel p-5"><h2 className="text-xl font-bold text-cyan-200">Disciplina diária</h2><p className="my-3 text-sm text-gray-300">+50% de XP de treino por 30 minutos corridos. Disponível a todos, uma compra por dia; reinicia às 00:00 UTC. O tempo passa mesmo fora do treino.</p><button disabled={used} onClick={() => { const result = buyTrainingBoost(); setMessage(result.success ? "Treino aprimorado ativado por 30 minutos." : result.error ?? "Indisponível."); }} className="rounded bg-cyan-700 px-4 py-2 font-bold disabled:opacity-40">{used ? "Adquirido hoje" : "Ativar · 250 gold"}</button><p role="status" className="mt-2 text-sm text-cyan-200">{message}</p></section>
    <section className="rounded-xl border border-arcane-gold/40 bg-arcane-panel p-5"><h2 className="text-xl font-bold text-arcane-gold">Premium Account</h2><p className="my-3 text-sm text-gray-300">{character.premium ? "Premium ativo: +10% de XP de caça, inclusive na simulação offline." : "Benefício implementado: +10% de XP de caça para contas premium."}</p><p className="text-sm text-gray-400">Market Online, correio entre jogadores e efeitos visuais por quests premium estão no planejamento. A contratação ficará disponível após integrar contas online e pagamentos.</p><span className="mt-3 inline-block rounded border border-arcane-gold/30 px-3 py-2 text-xs text-arcane-gold">{character.premium ? "Conta premium" : "Em preparação · sem cobrança disponível"}</span></section>
  </div>;
}
