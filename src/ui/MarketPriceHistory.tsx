import React from "react";
import type { MarketSaleStats } from "../types/market";

const price = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export function MarketPriceHistory({ stat }: { stat?: MarketSaleStats }) {
  if (!stat) return <p className="mt-2 text-[11px] text-slate-400">Sem vendas comparáveis registradas nesta moeda.</p>;
  const days = stat.daily ?? [];
  const min = Math.min(...days.map(day => day.average)), max = Math.max(...days.map(day => day.average));
  const start = days.length ? Date.parse(days[0].day + "T00:00:00Z") : 0;
  const end = days.length ? Date.parse(days[days.length - 1].day + "T00:00:00Z") : start;
  const x = (day: string) => 8 + (Date.parse(day + "T00:00:00Z") - start) / Math.max(1, end - start) * 264;
  const points = days.map(day => `${x(day.day)},${56 - (day.average - min) / Math.max(1, max - min) * 44}`).join(" ");
  return <details className="mt-2 rounded-lg border border-rose-300/15 bg-black/20 p-2 text-[11px] text-slate-300">
    <summary className="cursor-pointer leading-relaxed">
      {stat.sale_events.toLocaleString("pt-BR")} vendas · {stat.units_sold.toLocaleString("pt-BR")} unidades · média <strong className="text-rose-100">{price(stat.average_unit_price)} {stat.currency === "GOLD" ? "gold" : "Coins"}/un.</strong>
    </summary>
    <p className="mt-2">Faixa por unidade: {price(stat.lowest_unit_price)}–{price(stat.highest_unit_price)} · última venda {new Date(stat.last_sold_at).toLocaleDateString("pt-BR")}</p>
    <p className="mt-1 text-[10px] text-slate-400">Mesmo item, raridade, tier e upgrade. Atributos sorteados podem alterar o valor.</p>
    {days.length >= 2 && <svg role="img" aria-label="Preço médio diário por unidade nos últimos 30 dias; somente dias com vendas" viewBox="0 0 280 64" className="mt-2 h-20 w-full"><polyline points={points} fill="none" stroke="#fda4af" strokeWidth="2" />{days.map(day=><circle key={day.day} cx={x(day.day)} cy={56-(day.average-min)/Math.max(1,max-min)*44} r="3" fill="#fde68a"><title>{day.day}: {price(day.average)} · {day.units} unidades</title></circle>)}</svg>}
    <p className="mt-2 text-[10px] text-slate-400">Histórico diário · últimos 30 dias (UTC)</p>
    {days.length ? <div className="mt-1 max-h-32 overflow-auto"><table className="w-full text-left"><thead><tr><th>Dia</th><th>Média/un.</th><th>Unidades</th></tr></thead><tbody>{days.map(day=><tr key={day.day}><td>{day.day}</td><td>{price(day.average)}</td><td>{day.units}</td></tr>)}</tbody></table></div> : <p className="mt-1">Sem vendas nos últimos 30 dias.</p>}
  </details>;
}
