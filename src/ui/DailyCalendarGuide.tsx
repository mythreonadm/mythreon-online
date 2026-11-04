import React from "react";
import { CALENDAR_COUPON_PRICE, CALENDAR_WEEK_DAYS, CALENDAR_WEEK_FRAGMENTS, CALENDAR_MAX_GOLD_STREAK, CALENDAR_MONTHLY_REWARDS } from "../data/dailyCalendar";

export function DailyCalendarGuide() {
  return <section className="space-y-4 text-sm text-slate-300">
    <h2 className="text-2xl font-bold text-arcane-gold">Calendário e presença</h2>
    <p>Uma presença por personagem por dia do servidor, entre 00:00 e 23:59 UTC. A virada ocorre às 21h no horário de Brasília (UTC−3). Você pode sair e retornar sem perder os resgates confirmados.</p>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <article className="rounded-xl border border-fuchsia-300/20 bg-black/20 p-4"><h3 className="font-bold text-fuchsia-100">Cupom diário</h3><p className="mt-2">Cada presença consome um cupom, comprado por {CALENDAR_COUPON_PRICE} Mythreon Coin. Cupons restantes são preservados entre os meses.</p></article>
      <article className="rounded-xl border border-cyan-300/20 bg-black/20 p-4"><h3 className="font-bold text-cyan-100">Sequência semanal</h3><p className="mt-2">A cada {CALENDAR_WEEK_DAYS} dias consecutivos: {CALENDAR_WEEK_FRAGMENTS} Fragmentos Raros. Os marcos são 7, 14, 21, 28… Faltar reinicia a sequência, sem apagar as presenças do mês.</p></article>
      <article className="rounded-xl border border-amber-300/20 bg-black/20 p-4"><h3 className="font-bold text-amber-100">Skin mensal</h3><p className="mt-2">Registre 30 presenças no mesmo mês. Fevereiro exige todos os seus 28 ou 29 dias. A skin é desbloqueada permanentemente no guarda-roupa do personagem e não ocupa espaço na mochila.</p></article>
    </div>
    <p>O gold diário segue 500 + 250 × dias da sequência, limitado a {CALENDAR_MAX_GOLD_STREAK} dias no cálculo. Assim, começa em 750 gold e chega a 8.000 gold por presença. Faltar reinicia esse crescimento.</p>
    <p>O bônus semanal tenta entrar na mochila e, se necessário, no depósito. Se ambos estiverem cheios, o resgate inteiro é recusado: cupom, gold, presença e itens são preservados para você liberar espaço e tentar novamente no mesmo dia.</p>
    <p>Skins não alteram atributos de combate. Após conquistar uma, acesse Personagem → Personalização para equipar seu efeito visual. Recompensas de meses futuros só ficam disponíveis após anúncio e cadastro no catálogo.</p>
    <h3 className="text-lg font-bold text-arcane-gold">Recompensas mensais anunciadas</h3>
    <ul className="space-y-2">{Object.entries(CALENDAR_MONTHLY_REWARDS).map(([month, reward]) => <li key={month} className="rounded-lg border border-white/10 bg-black/20 p-3"><strong className="text-white">{month}</strong> · {reward.name}</li>)}</ul>
  </section>;
}
