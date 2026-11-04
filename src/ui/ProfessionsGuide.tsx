import React from "react";
import { MINING_NODES, FISHING_SPOTS, PROFESSION_RECIPES, FISHING_BAIT } from "../data/professions";
import { ALL_ITEM_TEMPLATES } from "../data/items";
import { ZONES } from "../data/zones";
import { FARM_SEEDS } from "../data/farm";
import { sellValue } from "../engine/shop";

export function professionItemName(templateId: string) {
  return ALL_ITEM_TEMPLATES[templateId]?.name ?? FARM_SEEDS.find(seed => seed.yieldId === templateId)?.yieldName ?? templateId;
}

export function ProfessionsGuide() {
  return <section className="space-y-4">
    <h2 className="text-2xl font-bold text-arcane-gold">Profissões: do Refúgio ao Eclipse</h2>
    <p className="text-sm text-cyan-200">Online: mantenha pressionado durante a preparação e a contagem inicial. O servidor cria cada pulso e confirma a precisão quando recebe sua soltura. Soltar antes do início, cancelar ou deixar expirar não concede coleta. Atrasos de rede podem mudar a precisão confirmada; o resultado mostrado é o confirmado.</p>
    <p className="text-sm text-slate-300">Mineração e Pesca usam skills e ferramentas próprias. A caça continua independente. Libere o bioma em Jornadas antes de coletar; a ferramenta precisa ter o tier do ponto ou superior.</p>
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-xs">
        <caption className="p-3 text-left text-slate-300">Ferramentas exigem skills 0, 20, 40, 60 e 80 nos tiers T1–T5.</caption>
        <thead className="bg-black/30 text-amber-200"><tr><th className="p-3">Tier / skill</th><th className="p-3">Mineração</th><th className="p-3">Pesca</th></tr></thead>
        <tbody>{MINING_NODES.map(node => {
          const spot = FISHING_SPOTS.find(entry => entry.rodTier === node.tier)!;
          return <tr key={node.id} className="border-t border-white/10"><th className="p-3">T{node.tier} / {node.requiredSkill}</th><td className="p-3">{node.dropIcon} {node.dropName}<br /><span className="text-slate-400">{ZONES[node.zoneId]?.name} · {sellValue(ALL_ITEM_TEMPLATES[node.dropTemplateId])} gold/un.</span></td><td className="p-3">{spot.dropIcon} {spot.dropName}<br /><span className="text-slate-400">{ZONES[spot.zoneId]?.name} · {sellValue(ALL_ITEM_TEMPLATES[spot.dropTemplateId])} gold/un.</span></td></tr>;
        })}</tbody>
      </table>
    </div>
    <p className="text-sm text-slate-300">Segure o botão (mouse/toque ou Espaço/Enter) e solte na faixa dourada. Toda coleta válida dá +1 de skill; o acerto perfeito dá +2. Rendimento: (1 + skill/30 arredondada para baixo) na mineração, ou skill/35 na pesca. O resultado é multiplicado por 0,85, 1 ou 1,25 conforme a precisão, arredondado para baixo, com mínimo de 1 unidade. Recarga: 5 segundos, reduzida em 0,1 segundo a cada 10 de skill, até o mínimo de 1,5 segundo.</p>
    <h3 className="text-lg font-bold text-violet-200">Refinar, negociar ou alimentar</h3>
    <p className="text-sm text-cyan-100">Isca opcional: marque “Usar {FISHING_BAIT.name}” na Pesca. Cada coleta concluída consome {FISHING_BAIT.quantity} isca e acrescenta {FISHING_BAIT.bonusFish} peixe ao rendimento, depois do bônus de precisão. Não muda a skill recebida. Cancelar, expirar ou falhar não gasta isca. Se ela sair da mochila após o início, a tentativa é rejeitada. Você pode continuar pescando sem isca ao desmarcar a opção.</p>
    <p className="text-sm text-slate-300">Os valores abaixo são de venda ao Ferreiro; o Mercado Negro tem preços definidos pelos jogadores. O Caldo da Marca-d’Água repõe até 40 pontos de nutrição e 10 de humor do Pet ativo, respeitando o limite da barra.</p>
    <div className="grid gap-3 md:grid-cols-2">{PROFESSION_RECIPES.map(recipe => <article key={recipe.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs">
      <h4 className="font-bold text-white">{recipe.icon} {recipe.name}</h4>
      <p className="mt-1 text-slate-300">{recipe.profession === "PESCA" ? "Pesca" : "Mineração"} {recipe.requiredSkill} · {recipe.ingredients.map(item => `${item.quantity}× ${professionItemName(item.templateId)}`).join(" + ")}</p>
      <p className="mt-1 text-amber-200">{recipe.outputQuantity}× {professionItemName(recipe.outputTemplateId)} · venda total {recipe.outputQuantity * sellValue(ALL_ITEM_TEMPLATES[recipe.outputTemplateId])} gold</p>
    </article>)}</div>
  </section>;
}
