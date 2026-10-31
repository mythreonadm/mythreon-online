import React, { useState, useMemo, useEffect } from "react";
import { AssetImage } from "./AssetImage";
import { ZONES } from "../data/zones";
import { ALL_EQUIPMENT_TEMPLATES, ARROW_TEMPLATES, POTION_TEMPLATES, FRAGMENT_TEMPLATES, UNIQUE_TEMPLATES } from "../data/items";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";
import { NAMED_RACES, RACE_LORE } from "../data/races";
import { VIALS } from "../data/vials";
import { BACKPACKS } from "../data/backpacks";
import { ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";
import { DIVINE_BEASTS, DIVINE_BEAST_ORDER } from "../data/divineBeasts";
import { HUMAN_LINEAGE, LINEAGES } from "../data/lineages";
import { Item } from "../types";
import { getPotionUsePrice } from "../data/potionEconomy";
import { ELEMENTS, elementMultiplier } from "../data/elementalChart";

const PERCENT_STATS = new Set(["crit", "hit", "dge", "spd", "blk", "resFisico", "resMagico", "critDmg", "lifesteal"]);
function formatWikiStat(stat: string, value: number) {
  return PERCENT_STATS.has(stat) && Math.abs(value) <= 1 ? `${(value * 100).toFixed(0)}%` : value.toLocaleString("pt-BR");
}

type Section = "history" | "beasts" | "monsters" | "zones" | "equipment" | "elements" | "consumables" | "components" | "races" | "bosses" | "backpacks" | "fragments";

const SECTION_META: { id: Section; label: string; icon: string; color: string }[] = [
  { id: "history", label: "História", icon: "📜", color: "text-arcane-gold" },
  { id: "beasts", label: "Divine Beasts", icon: "🐾", color: "text-arcane-gold" },
  { id: "monsters", label: "Monstros", icon: "👹", color: "text-red-400" },
  { id: "zones", label: "Zonas", icon: "🗺️", color: "text-green-400" },
  { id: "equipment", label: "Equipamentos", icon: "⚔️", color: "text-arcane-cyan" },
  { id: "elements", label: "Elementos", icon: "🌈", color: "text-arcane-gold" },
  { id: "consumables", label: "Poções & Vials", icon: "🧪", color: "text-blue-400" },
  { id: "components", label: "Componentes", icon: "🔮", color: "text-purple-400" },
  { id: "races", label: "Raças", icon: "🎭", color: "text-arcane-gold" },
  { id: "bosses", label: "Chefes & Únicos", icon: "👑", color: "text-yellow-400" },
  { id: "backpacks", label: "Mochilas", icon: "🎒", color: "text-green-400" },
  { id: "fragments", label: "Fragmentos", icon: "💎", color: "text-cyan-400" },
];

function getComponentSources(componentId: string) {
  const sources: { zone: string; monster: string; chance: number }[] = [];
  Object.values(ZONES).forEach(zone => {
    zone.enemies.forEach(enemy => {
      if (enemy.componentId === componentId) sources.push({ zone: zone.name, monster: enemy.name, chance: enemy.componentChance });
      if (enemy.essenceId === componentId) sources.push({ zone: zone.name, monster: enemy.name, chance: enemy.essenceChance || 0 });
    });
    if (zone.ambientPool?.includes(componentId) || zone.ambientDrop === componentId) {
      sources.push({ zone: zone.name, monster: "Ambiente (a cada 10 kills)", chance: 0.1 });
    }
  });
  return sources;
}

export function Wiki() {
  const [section, setSection] = useState<Section>("history");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-arcane-panel via-blue-900/20 to-arcane-panel border-2 border-arcane-cyan/30 rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-arcane-cyan tracking-wider">📚 MYTHREON WIKI</h1>
            <p className="text-gray-400 text-sm italic">"Conhecer Mythreon é aprender por que ela jamais poderia ter sido diferente."</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Arquivo da Cúpula Sinax</div>
            <div className="text-arcane-cyan font-bold">Tomo I · v1.2</div>
          </div>
        </div>
        {section !== "history" && (
          <div className="mt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar em qualquer seção..."
              className="w-full bg-arcane-bg border border-arcane-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-arcane-cyan"
            />
          </div>
        )}
      </div>

      {/* SECTION NAV */}
      <div className="flex flex-wrap gap-2 bg-arcane-panel border border-arcane-border rounded-lg p-2">
        {SECTION_META.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-3 py-2 rounded font-bold text-xs transition-all flex items-center gap-1 ${
              section === s.id ? "bg-arcane-cyan text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-arcane-border/30"
            }`}
          >
            <span>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="min-h-[400px]">
        {section === "history" && <HistorySection />}
        {section === "beasts" && <DivineBeastsWikiSection search={search} />}
        {section === "monsters" && <MonstersSection search={search} />}
        {section === "zones" && <ZonesSection search={search} />}
        {section === "equipment" && <EquipmentSection search={search} />}
        {section === "elements" && <ElementalChartSection />}
        {section === "consumables" && <ConsumablesSection search={search} />}
        {section === "components" && <ComponentsSection search={search} />}
        {section === "races" && <RacesSection search={search} />}
        {section === "bosses" && <BossesSection search={search} />}
        {section === "backpacks" && <BackpacksSection search={search} />}
        {section === "fragments" && <FragmentsSection search={search} />}
      </div>
    </div>
  );
}

function WikiItemIcon({ item, size = "h-10 w-10" }: { item: Pick<Item, "templateId" | "name" | "icon">; size?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.templateId]);
  return failed
    ? <span className={`${size} grid shrink-0 place-items-center text-2xl`}>{item.icon}</span>
    : <AssetImage src={`/assets/items/${item.templateId}.png`} alt={item.name} className={`${size} shrink-0 object-contain [image-rendering:pixelated]`} onError={() => setFailed(true)} />;
}

function WikiAssetIcon({ templateId, name, emoji = "🎒", size = "h-12 w-12" }: { templateId: string; name: string; emoji?: string; size?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [templateId]);
  return failed
    ? <span className={`${size} grid shrink-0 place-items-center text-3xl`}>{emoji}</span>
    : <AssetImage src={`/assets/items/${templateId}.png`} alt={name} className={`${size} shrink-0 object-contain [image-rendering:pixelated]`} onError={() => setFailed(true)} />;
}

function DivineBeastsWikiSection({ search }: { search: string }) {
  const filtered = DIVINE_BEAST_ORDER.map(id => DIVINE_BEASTS[id]).filter(beast => `${beast.name} ${beast.title} ${beast.region} ${beast.lore} ${beast.bond}`.toLowerCase().includes(search.toLowerCase()));
  const statNames: Record<string, string> = { hp: "Vida", mp: "Mana", atk: "Ataque", matk: "Magia", arm: "Armadura", def: "Defesa", crit: "Crítico", hit: "Precisão", dge: "Esquiva", spd: "Velocidade", blk: "Bloqueio", resMagico: "Res. mágica" };
  const percentStats = new Set(["crit", "hit", "dge", "spd", "resMagico"]);
  const bossNames = Object.values(ZONES).flatMap(zone => zone.enemies).reduce<Record<string, string>>((map, enemy) => { map[enemy.id] = enemy.name; return map; }, {});
  return <div className="space-y-5">
    <div className="rounded-xl border border-arcane-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(201,160,77,.12),transparent_55%),#10151a] p-5">
      <h2 className="text-xl font-black text-arcane-gold">Ecos vivos do Primeiro Canto</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">As Divine Beasts são memórias vivas da Essência, despertadas nos guardiões de Mythreon. Elas representam o Caminho da Ressonância: vínculo, adaptação e cooperação com forças que já habitavam o mundo. O vínculo é uma escolha de evolução e identidade; na mecânica atual, a criatura ativa ocupa o espaço de Ressonância compartilhado com a Matriz, enquanto as demais permanecem na coleção.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3"><strong className="text-gray-200">Formação</strong><p className="mt-1 text-gray-400">Moldadores canalizam Dhor, Prime e Chronos para resistir, estruturar e fortalecer.</p></div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3"><strong className="text-red-300">Ruptura</strong><p className="mt-1 text-gray-400">Condutores aceleram a Essência com Kaelor, Raan e Voro para atacar e romper limites.</p></div>
        <div className="rounded-lg border border-arcane-gold/30 bg-arcane-gold/5 p-3"><strong className="text-arcane-gold">Ressonância</strong><p className="mt-1 text-gray-400">Tecelões conectam Lyss, Emohna e Veyra; Divine Beasts manifestam esse caminho pelo vínculo com ecos vivos.</p></div>
      </div>
      <p className="mt-3 text-[11px] text-gray-500">Cada chefe regional pode revelar um eco ainda não descoberto: 12% de chance por vitória. Cada vínculo é único; a criatura pode ser ativada ou guardada sem perder a coleção.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {filtered.map(beast => {
        const stats = Object.entries(beast.bonus);
        return <article key={beast.id} className="overflow-hidden rounded-xl border border-arcane-border bg-arcane-panel">
          <div className="flex items-center gap-3 border-b border-white/5 bg-black/20 p-3">
            <BeastWikiImage sprite={beast.sprite} name={beast.name} emoji={beast.emoji} />
            <div className="min-w-0"><div className="text-[9px] font-bold uppercase tracking-widest text-arcane-gold">{beast.region} · {beast.rarity}</div><h3 className="mt-1 text-lg font-black text-white">{beast.name}</h3><p className="text-xs text-gray-400">{beast.title}</p><p className="mt-2 text-[10px] text-gray-500">Guardião: {bossNames[beast.bossId] ?? beast.bossId}</p></div>
          </div>
          <div className="space-y-3 p-3"><p className="text-xs leading-relaxed text-gray-300">{beast.lore}</p><p className="text-[11px] italic leading-relaxed text-gray-500">{beast.bond}</p><div className="flex flex-wrap gap-1.5">{stats.map(([key, value]) => <span key={key} className="rounded border border-emerald-900/40 bg-emerald-950/20 px-2 py-1 text-[10px] font-bold text-emerald-300">+{percentStats.has(key) ? `${(Number(value) * 100).toFixed(0)}%` : value} {statNames[key] ?? key}</span>)}</div><div className="border-t border-white/5 pt-2 text-[10px] text-gray-500">Vínculo possível ao derrotar o chefe regional · 12% por vitória</div></div>
        </article>;
      })}
    </div>
  </div>;
}

function BeastWikiImage({ sprite, name, emoji }: { sprite: string; name: string; emoji: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg border border-white/10 bg-black/30">
    {failed ? <span className="text-4xl">{emoji}</span> : <AssetImage src={sprite} alt={name} className="h-full w-full object-contain [image-rendering:pixelated]" onError={() => setFailed(true)} />}
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// HISTÓRIA — O LIVRO DA CRIAÇÃO
// ═══════════════════════════════════════════════════════════════
export function HistorySection() {
  const [chapter, setChapter] = useState<number>(1);

  const chapters = [
    { num: 1, title: "O Silêncio Antes da Existência", icon: "🌑", era: "Antes do Tempo" },
    { num: 2, title: "A Primeira Diferença", icon: "✨", era: "O Despertar" },
    { num: 3, title: "O Primeiro Canto", icon: "🎵", era: "O Despertar" },
    { num: 4, title: "As Sete Consciências Primordiais", icon: "👁️", era: "A Primeira Harmonia" },
    { num: 5, title: "O Nascimento de Mythreon", icon: "🌍", era: "A Primeira Harmonia" },
    { num: 6, title: "As Trinta e Três Leis", icon: "📖", era: "A Primeira Harmonia" },
    { num: 7, title: "A Era dos Três Caminhos", icon: "⚔️", era: "Era dos Reinos" },
    { num: 8, title: "O Despertar da Magia", icon: "🔮", era: "Era dos Reinos" },
    { num: 9, title: "A Grande Ruptura", icon: "💥", era: "Era das Guerras" },
    { num: 10, title: "A Era do Sangue e do Ouro", icon: "🏰", era: "Era das Guildas" },
    { num: 11, title: "As Relíquias e as Cicatrizes", icon: "⚜️", era: "Era das Guildas" },
    { num: 12, title: "O Último Vínculo", icon: "🐕", era: "O Presente" },
    { num: 13, title: "Os Ecos Divinos", icon: "🐾", era: "O Presente" },
  ];

  const currentChapter = chapters.find(c => c.num === chapter)!;

  return (
    <div className="space-y-6">
      {/* INTRO */}
      <div className="bg-gradient-to-br from-arcane-panel to-black/40 border-2 border-arcane-gold/30 rounded-xl p-8 shadow-[0_0_40px_rgba(201,160,77,0.15)] text-center">
        <div className="text-6xl mb-4">📜</div>
        <h1 className="text-4xl font-bold text-arcane-gold mb-2 tracking-wider">O LIVRO DA CRIAÇÃO</h1>
        <p className="text-arcane-cyan text-sm italic mb-4">"Tomo I — O Arquivista de Asterion"</p>
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-arcane-gold to-transparent mb-4" />
          <p className="text-gray-300 italic">
            "Quando o homem olha para uma montanha, acredita estar vendo uma pedra gigantesca.<br/>
            Quando olha para um oceano, acredita estar vendo apenas água.<br/>
            Quando olha para uma estrela, acredita estar vendo apenas luz.<br/>
            Mas toda montanha guarda uma memória.<br/>
            Todo oceano guarda um segredo.<br/>
            E toda estrela guarda uma promessa."
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-arcane-gold to-transparent mt-4" />
        </div>
      </div>

      {/* CHAPTER SELECTOR */}
      <div className="flex flex-wrap gap-2 bg-arcane-panel border border-arcane-border rounded-lg p-2">
        {chapters.map(c => (
          <button
            key={c.num}
            onClick={() => setChapter(c.num)}
            className={`px-3 py-2 rounded font-bold text-xs transition-all flex items-center gap-1 ${
              chapter === c.num ? "bg-arcane-gold text-black shadow-lg" : "bg-arcane-bg text-gray-400 hover:text-white hover:border-arcane-gold border border-transparent"
            }`}
            title={`Capítulo ${c.num} — ${c.title}`}
          >
            <span>{c.icon}</span> {c.num}
          </button>
        ))}
      </div>

      {/* CHAPTER HEADER */}
      <div className="text-center">
        <div className="text-xs text-gray-500 uppercase tracking-widest">{currentChapter.era}</div>
        <div className="text-5xl my-2">{currentChapter.icon}</div>
        <h2 className="text-2xl font-bold text-arcane-gold">Capítulo {currentChapter.num}</h2>
        <h3 className="text-xl font-bold text-white mt-1">{currentChapter.title}</h3>
        <div className="h-px bg-gradient-to-r from-transparent via-arcane-gold/50 to-transparent mt-3" />
      </div>

      {/* CHAPTER CONTENT */}
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-8 shadow-lg">
        <ChapterContent chapter={chapter} />
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setChapter(Math.max(1, chapter - 1))}
          disabled={chapter === 1}
          className={`px-6 py-2 rounded-lg font-bold ${chapter === 1 ? "bg-gray-800 text-gray-600 cursor-not-allowed" : "bg-arcane-purple hover:bg-arcane-purple/80 text-white"}`}
        >
          ← Anterior
        </button>
        <div className="text-xs text-gray-500">
          {chapter} / {chapters.length}
        </div>
        <button
          onClick={() => setChapter(Math.min(chapters.length, chapter + 1))}
          disabled={chapter === chapters.length}
          className={`px-6 py-2 rounded-lg font-bold ${chapter === chapters.length ? "bg-gray-800 text-gray-600 cursor-not-allowed" : "bg-arcane-purple hover:bg-arcane-purple/80 text-white"}`}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}

function ChapterContent({ chapter }: { chapter: number }) {
  const P = ({ children }: { children: React.ReactNode }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>;
  const H = ({ children }: { children: React.ReactNode }) => <h4 className="text-arcane-gold font-bold text-lg mt-6 mb-3 uppercase tracking-wider">{children}</h4>;
  const Q = ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-arcane-gold pl-4 italic text-gray-400 my-6">
      "{children}"
    </blockquote>
  );
  const Dots = () => <div className="text-center text-arcane-gold/50 my-4 text-2xl">· · ·</div>;

  switch (chapter) {
    case 1:
      return (
        <div>
          <Q>Antes do Primeiro Amanhecer existia apenas o Potencial Absoluto. Não era vazio, nem energia, nem silêncio. Era tudo o que poderia existir, esperando para escolher existir.</Q>
          <P>Muito antes de existir qualquer céu. Muito antes do primeiro oceano tocar uma praia. Muito antes da primeira árvore lançar sua sombra sobre a terra. Muito antes de qualquer criatura respirar.</P>
          <P>Não existia luz. Não existia escuridão. Não existia tempo. Não existia espaço. Não existia matéria. Não existia magia. Não existia vida. Não existia sequer a palavra "existir".</P>
          <P>Pois não havia consciência para nomear qualquer coisa.</P>
          <P>Havia apenas um estado impossível de ser compreendido pela mente mortal. Os Arquivistas o chamariam milhares de anos depois de... <strong className="text-arcane-gold">O Estado Primordial</strong>.</P>
          <P>Mas este nome foi dado apenas para facilitar o entendimento. Na realidade, ele nunca teve nome. Porque não existia linguagem. Não existia pensamento. Não existia alguém para observá-lo.</P>
          <H>Era o Potencial Absoluto</H>
          <P>Não era um vazio. O vazio pressupõe espaço. E espaço ainda não existia. Não era energia. Energia pressupõe movimento. E movimento ainda não existia. Não era silêncio. Silêncio pressupõe som. E som ainda não existia.</P>
          <P>Era algo muito mais profundo. Era a possibilidade infinita. Tudo aquilo que um dia poderia existir já estava presente. Não como matéria. Nem como destino. Mas como possibilidade.</P>
          <P>Cada montanha. Cada estrela. Cada gota de chuva. Cada criatura. Cada guerreiro. Cada rei. Cada criança. Cada folha. Cada palavra.</P>
          <P>Tudo já existia. Mas ainda não havia escolhido existir.</P>
        </div>
      );

    case 2:
      return (
        <div>
          <Q>Nada foi criado. Nada explodiu. Nada surgiu do nada. O que aconteceu foi muito mais simples. Pela primeira vez... existiu uma diferença. E a diferença mudou tudo.</Q>
          <P>Os grandes sábios discordam sobre o que aconteceu em seguida. Os monges da Ordem da Harmonia dizem que o universo despertou porque a própria Essência desejava experimentar a vida. Os Dominantes afirmam que o Potencial tornou-se instável e precisou expandir-se para sobreviver. Os Metamorfos ensinam que nenhuma criação ocorreu; apenas a primeira transformação.</P>
          <P>Os Arquivistas, porém, registram outra versão. A única aceita como cânone.</P>
          <P>Nada foi criado. Nada explodiu. Nada surgiu do nada.</P>
          <P>O que aconteceu foi muito mais simples. Pela primeira vez... existiu uma <strong className="text-arcane-gold">diferença</strong>.</P>
          <H>Os Três Fundamentos</H>
          <P>Enquanto tudo era absolutamente igual... nada podia acontecer. Mas quando surgiu a menor distinção possível... o impossível tornou-se inevitável. A partir desse instante, nasceram três fundamentos inseparáveis:</P>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 pl-4">
            <li><strong className="text-arcane-gold">A Mudança</strong> — sem ela nada cresce, nada envelhece, nada aprende, nada morre.</li>
            <li><strong className="text-arcane-gold">A Sequência</strong> — o que vem depois do que veio antes. A ordem do mundo.</li>
            <li><strong className="text-arcane-gold">A Distância</strong> — o que separa uma coisa da outra. O espaço entre as coisas.</li>
          </ul>
          <P>Os mortais chamariam esses conceitos de Tempo e Espaço. Mas Tempo e Espaço são apenas consequências. O verdadeiro nascimento do universo foi o nascimento da Mudança.</P>
          <H>A Essência</H>
          <P>Com a Mudança surgiu algo que os povos futuros jamais compreenderiam completamente: a <strong className="text-arcane-gold">Essência</strong>.</P>
          <P>Ela não é magia — a magia apenas utiliza a Essência. Ela não é energia — a energia é uma manifestação da Essência. Ela não é alma — as almas são formadas por Essência. Ela não é matéria — a matéria é Essência estabilizada. Ela não pertence às criaturas — as criaturas pertencem a ela.</P>
          <P>A Essência permeia absolutamente tudo. Cada pedra possui Essência. Cada árvore. Cada rio. Cada estrela. Cada criatura. Cada pensamento. Cada lembrança.</P>
          <P>Quando dois amigos juram proteger um ao outro até a morte... a Essência muda. Quando um reino inteiro esquece uma antiga tradição... a Essência muda.</P>
          <P>Em Mythreon, a realidade não é um palco imóvel. Ela respira. Ela registra. Ela responde.</P>
        </div>
      );

    case 3:
      return (
        <div>
          <Q>Conjurar magia não é criar algo novo. É tocar, por um breve instante, a mesma música que deu origem ao universo.</Q>
          <P>Os Arquivistas antigos relatam que, antes da matéria existir, houve um fenômeno que jamais voltou a acontecer. Eles o chamam de <strong className="text-arcane-gold">O Primeiro Canto</strong>.</P>
          <P>Não era uma música. Não havia ar para transmitir som. Não era uma voz. Não existia boca para pronunciá-la.</P>
          <P>Era uma vibração perfeita na Essência. Uma frequência tão pura que fez o Potencial começar a organizar-se em padrões.</P>
          <H>Os Filamentos Primordiais</H>
          <P>Esses padrões tornaram-se os <strong className="text-arcane-gold">Filamentos Primordiais</strong>. Cada filamento carregava uma "tendência" da existência: união, transformação, movimento, memória, crescimento, equilíbrio e infinitas outras possibilidades.</P>
          <P>Toda a matéria futura seria tecida sobre esses filamentos invisíveis. Por isso, os maiores magos de Mythreon dizem que conjurar magia não é criar algo novo, mas tocar, por um breve instante, a mesma música que deu origem ao universo.</P>
          <H>O Primeiro Mistério</H>
          <P>E então aconteceu algo que nem mesmo os Arquivistas conseguem explicar. Entre bilhões de Filamentos Primordiais, um deles apresentou uma característica impossível.</P>
          <P>Ele começou a <strong className="text-arcane-gold">registrar</strong>. Não apenas existir. Registrar. Ele guardava as mudanças que aconteciam ao seu redor.</P>
          <P>Foi a primeira manifestação daquilo que, milhões de anos depois, receberia o nome de <strong className="text-arcane-gold">Memória Universal</strong>.</P>
          <Q>Talvez o universo não esteja apenas sendo observado pelos seres vivos. Talvez ele próprio esteja aprendendo com tudo o que acontece dentro dele.</Q>
          <P>Se essa teoria estiver correta... cada guerra. Cada descoberta. Cada amizade. Cada árvore plantada. Cada criatura extinta. Cada cidade construída pelos jogadores. Tudo ficará gravado na própria Essência de Mythreon.</P>
          <P>E isso significaria que <strong className="text-arcane-gold">o mundo nunca esquece</strong>.</P>
        </div>
      );

    case 4:
      return (
        <div>
          <Q>Não existiam deuses. Existiam apenas forças. Os homens chamaram essas forças de divindades porque jamais conseguiram compreendê-las.</Q>
          <P>Durante incontáveis eras, a Essência percorreu o vazio. Os Filamentos Primordiais entrelaçavam-se lentamente. Não existiam estrelas. Não existiam planetas. Existiam apenas imensas correntes invisíveis de Essência.</P>
          <P>Quando duas correntes se encontravam, elas vibravam. Quando milhares se encontravam, nasciam tempestades de Essência. Quando milhões convergiam, a realidade começava a adquirir forma.</P>
          <P>Foi então que surgiu o primeiro fenômeno consciente. Não uma criatura. Não um deus. Mas um <strong className="text-arcane-gold">pensamento</strong>.</P>
          <H>As Sete Consciências</H>
          <P>Após bilhões de ciclos, sete regiões diferentes do universo acumularam Essência suficiente para despertar. Cada uma tornou-se uma Consciência Primordial. Não eram pessoas. Não eram gigantes. Não possuíam forma. Eram conceitos vivos.</P>
          <div className="grid md:grid-cols-2 gap-3 my-4">
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-arcane-gold">🌅 Aster</div>
              <div className="text-xs text-gray-400">A Primeira Luz. Nascimento. Esperança. Descoberta. Tudo que começa.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-purple-400">🌙 Nocthar</div>
              <div className="text-xs text-gray-400">A Escuridão Serena. Descanso. Silêncio. Fim dos ciclos. Não é o mal — é o encerramento.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-red-400">🔥 Kaelor</div>
              <div className="text-xs text-gray-400">Transformação. Tudo que evolui. Tudo que muda. Toda adaptação.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-blue-400">📖 Veyra</div>
              <div className="text-xs text-gray-400">Memória. Toda história. Todo conhecimento. Todo legado.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-yellow-600">⛰️ Dhor</div>
              <div className="text-xs text-gray-400">Matéria. Montanhas. Metais. Cristais. Planetas.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border">
              <div className="font-bold text-green-400">🌿 Lyss</div>
              <div className="text-xs text-gray-400">Vida. Crescimento. Florestas. Oceanos. Respiração.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border border-arcane-border md:col-span-2">
              <div className="font-bold text-cyan-400">💨 Nyr</div>
              <div className="text-xs text-gray-400">Movimento. Vento. Marés. Tempo. Viagens. Mudanças.</div>
            </div>
          </div>
          <P>Nenhuma delas é boa. Nenhuma é má. São simplesmente necessárias.</P>
          <H>O Primeiro Mistério de Mythreon</H>
          <P>Quando as sete consciências observaram o novo planeta, perceberam algo impossível. Existia uma <strong className="text-arcane-gold">oitava presença</strong>. Muito pequena. Quase imperceptível. Ela não correspondia a nenhuma das sete.</P>
          <P>Ela desapareceu antes mesmo do primeiro oceano surgir. Jamais foi encontrada novamente. Os Arquivistas deram-lhe um nome provisório: <strong className="text-arcane-gold">A Oitava Essência</strong>.</P>
          <Q>Quando a Oitava Essência retornar, o próprio destino do mundo poderá ser reescrito.</Q>
        </div>
      );

    case 5:
      return (
        <div>
          <Q>Nenhum mundo nasce pronto. Primeiro nasce sua alma. Depois seu coração. Somente então sua pele recebe montanhas, mares e florestas.</Q>
          <P>Foi em um braço distante da Galáxia de Elyndor que nasceu um planeta diferente de todos os anteriores. Não era o maior. Nem o mais brilhante. Nem o mais rico. Era o mais <strong className="text-arcane-gold">equilibrado</strong>.</P>
          <P>Cada uma das Sete Consciências encontrou naquele pequeno mundo uma ressonância perfeita. Pela primeira vez. Nenhuma delas dominava.</P>
          <H>O Coração de Mythreon</H>
          <P>Durante milhões de anos, meteoros colidiram contra sua superfície. Oceanos evaporaram. Novos mares nasceram. Nada disso era aleatório. No centro do planeta formava-se lentamente um gigantesco núcleo de Essência cristalizada.</P>
          <P>Os Arquivistas o chamariam de <strong className="text-arcane-gold">O Coração de Mythreon</strong>. Ele não bombeava sangue. Bombeava Essência. Era ele quem mantinha todas as linhas invisíveis de energia do planeta conectadas.</P>
          <H>As Veias da Essência (Nexos)</H>
          <P>Quando o Coração despertou, milhões de rios invisíveis espalharam-se pelo planeta. Esses rios nunca carregaram água. Carregavam Essência.</P>
          <P>Séculos depois, magos perceberiam que certos locais eram extraordinariamente fáceis para conjurar feitiços. Alquimistas descobririam plantas impossíveis de cultivar em qualquer outro lugar. Ferreiros encontrariam metais que jamais se desgastavam.</P>
          <P>Todos acreditavam tratar-se de coincidência. Mas não era. Aqueles locais estavam sobre <strong className="text-arcane-gold">Veias Primordiais</strong> — onde a Essência corria mais intensamente. Esses lugares seriam chamados de <strong className="text-arcane-gold">Nexos</strong>.</P>
          <H>Os Quatro Mares Primordiais</H>
          <P>Quando a temperatura do planeta finalmente estabilizou, as nuvens choveram durante milhares de anos. Cada gota carregava minúsculos fragmentos de Essência.</P>
          <ul className="list-disc list-inside text-gray-300 space-y-2 my-4 pl-4">
            <li><strong className="text-blue-400">O Mar de Azhar</strong> — Cristalino, calmo, profundo. Guardaria os maiores segredos do planeta.</li>
            <li><strong className="text-red-500">O Mar Rubro de Khar</strong> — Rico em minerais. Berço das primeiras criaturas colossais.</li>
            <li><strong className="text-purple-400">O Oceano Nebular</strong> — Coberto permanentemente por névoas. Até hoje navios desaparecem em seu interior.</li>
            <li><strong className="text-green-400">O Mar de Elyra</strong> — Quente, rico em vida. Berço das primeiras formas complexas de existência.</li>
          </ul>
          <P>O primeiro continente recebeu o nome de <strong className="text-arcane-gold">Aethor</strong>. Ali existiam desertos, florestas, montanhas, pântanos, geleiras. Tudo em perfeita harmonia. Sem reinos. Sem cidades. Sem estradas. Apenas natureza.</P>
          <H>O Primeiro Sopro da Vida</H>
          <P>Cristais microscópicos de Essência começaram a organizar-se espontaneamente. Cada cristal aprendia. Adaptava-se. Registrava informações. Esses pequenos cristais ficaram conhecidos como <strong className="text-arcane-gold">Células de Essência</strong>.</P>
          <P>Toda forma de vida futura seria construída a partir delas. Elas eram capazes de algo impossível: guardar experiências. Transmiti-las. Aprender. Foi nesse instante que a <strong className="text-arcane-gold">evolução</strong> nasceu.</P>
        </div>
      );

    case 6:
      return (
        <div>
          <Q>Antes do primeiro oceano. Antes da primeira montanha. Antes da primeira estrela. Existiam apenas Trinta e Três Princípios. Eles jamais governaram. Jamais ordenaram. Jamais falaram. Mesmo assim... tudo nasceu através deles.</Q>
          <P>Após o Primeiro Canto, a Essência deixou de ser apenas possibilidade. Ela começou a organizar-se. Durante incontáveis eras, essas tendências permaneceram instáveis. Construíam. Desfaziam. Uniam. Separavam. Transformavam.</P>
          <P>Até que, pela primeira vez, encontraram equilíbrio. Nesse instante, nasceram as <strong className="text-arcane-gold">Trinta e Três Leis da Existência</strong>.</P>
          <H>As Sete Primeiras</H>
          <div className="space-y-2 my-4">
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-red-500">
              <div className="font-bold text-red-400">Prime — A Primeira Ordem</div>
              <div className="text-xs text-gray-400 mt-1">A capacidade do caos transformar-se em estrutura. Toda arquitetura. Toda colmeia. Toda galáxia. Existe porque Prime existe.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-purple-500">
              <div className="font-bold text-purple-400">Voro — A Lei da Dúvida</div>
              <div className="text-xs text-gray-400 mt-1">Toda evolução começa quando alguém pergunta: "E se houver outro caminho?" Sem Voro, o universo seria perfeito — e imóvel.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-blue-500">
              <div className="font-bold text-blue-400">Loghis — A Lei da Compreensão</div>
              <div className="text-xs text-gray-400 mt-1">Toda informação tende a organizar-se. Todo conhecimento deseja conectar-se. Bibliotecas, escritas, mapas, matemática.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-pink-500">
              <div className="font-bold text-pink-400">Emohna — A Lei do Vínculo</div>
              <div className="text-xs text-gray-400 mt-1">Toda relação que fortalece duas existências diferentes nasce da influência de Emohna. Amizade. Família. Lealdade. Guildas.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-cyan-500">
              <div className="font-bold text-cyan-400">Raan — A Lei do Movimento Consciente</div>
              <div className="text-xs text-gray-400 mt-1">A diferença entre caminhar e decidir caminhar. Toda expedição. Toda descoberta. Todo aventureiro.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-green-500">
              <div className="font-bold text-green-400">Synthes — A Lei da União</div>
              <div className="text-xs text-gray-400 mt-1">Tudo aquilo que combina duas coisas para produzir uma terceira. Alquimia. Metalurgia. Culinária. Engenharia.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-yellow-500">
              <div className="font-bold text-yellow-500">Chronos — A Lei da Continuidade</div>
              <div className="text-xs text-gray-400 mt-1">Os mortais acreditam que Chronos representa apenas o tempo. Estão errados. O tempo apenas mede. Chronos representa aquilo que continua.</div>
            </div>
          </div>
          <P>Os Arquivistas afirmam que existem outras vinte e seis Leis Primárias. Algumas governam conceitos tão profundos que nenhuma civilização conseguiu compreendê-las por inteiro. Há uma Lei que rege o Sacrifício. Outra, a Curiosidade. Outra, o Equilíbrio. Outra, o Sonho.</P>
          <H>O Primeiro Pulso</H>
          <P>Quando as Trinta e Três finalmente coexistiram em perfeita harmonia... algo extraordinário aconteceu. O universo inteiro pulsou. Não houve explosão. Não houve clarão. Houve apenas um único pulso.</P>
          <P>Um movimento tão delicado que nenhum mortal seria capaz de percebê-lo. Mas esse pulso atravessou cada Filamento da Essência. Cada estrela. Cada planeta. Cada partícula.</P>
          <P>Quando alcançou um pequeno mundo ainda sem nome... algo mudou para sempre. O núcleo daquele planeta respondeu. Pela primeira vez. Não porque recebeu uma ordem. Mas porque encontrou ressonância.</P>
          <Q>O universo nunca pediu para ser adorado. Apenas para ser compreendido.</Q>
        </div>
      );

    case 7:
      return (
        <div>
          <Q>Os nômades acreditavam que o mundo lhes pertencia porque podiam caminhar por ele. Mas o mundo acabou pertencendo àqueles que decidiram parar.</Q>
          <P>Durante milênios, as tribos vagaram pelo Continente de Aethor. Mas algo começou a mudar. Certas tribos perceberam que em regiões específicas do mundo, o fogo queimava por mais tempo. A caça era mais forte. A água curava doenças simples. As mentes pareciam mais afiadas.</P>
          <P>Eles não sabiam explicar, mas haviam encontrado os <strong className="text-arcane-gold">Nexos</strong>. Pontos geográficos onde as Veias da Essência afloravam na superfície.</P>
          <H>A Grande Ancoragem</H>
          <P>Você pode carregar uma tenda. Você pode guiar um rebanho. Mas você não pode carregar um Nexo. Para usufruir daquele poder contínuo, as tribos precisaram tomar uma decisão que contrariava a Lei de Raan (O Movimento): eles precisaram <strong className="text-arcane-gold">parar</strong>.</P>
          <P>Ao redor do Nexo de Dhor (Matéria), no norte montanhoso, os Filhos da Terra ergueram a primeira grande estrutura: <strong className="text-arcane-gold">Vaelghar</strong>, o Primeiro Trono. Ao redor do Nexo de Lyss (Vida), nas planícies do leste, os Filhos do Vínculo plantaram árvores cujas raízes formaram muralhas impenetráveis. Nasceu <strong className="text-arcane-gold">Sylanis</strong>, a Cidade-Semente.</P>
          <H>O Nascimento da Economia e da Alquimia</H>
          <P>Ao parar, os povos começaram a acumular. Quem tem muito de algo, troca pelo que não tem. Foi nesse momento que a Lei de Synthes (União) inspirou as primeiras profissões. Os povos de Sylanis descobriram que ao extrair o sumo de certas flores, eles podiam engarrafar a sensação de vitalidade. Era a primeira poção.</P>
          <P>Com o comércio, vieram as rotas. Com as rotas, vieram os guardas. Com os guardas, vieram os exércitos. Os primeiros reinos não nasceram de coroações divinas. Nasceram da necessidade de proteger os Nexos.</P>
        </div>
      );

    case 8:
      return (
        <div>
          <Q>Magia não é um milagre. Milagres pertencem aos deuses, e nós não os temos. Magia é o momento em que a vontade de um mortal se recusa a aceitar a realidade.</Q>
          <P>A magia bruta não foi ensinada por um dragão ancestral ou por um espírito da floresta. Ela foi descoberta pelo desespero.</P>
          <H>A História de Kael</H>
          <P>Nos anais mais antigos de Vaelghar, conta-se a história de um guarda de caravana chamado Kael. Durante uma emboscada nas rotas comerciais, Kael foi fatalmente ferido. Ele sangrava no chão, observando seu irmão mais novo ser encurralado por feras.</P>
          <P>Kael tentou levantar, mas seu corpo não respondia. Ele não orou. (Não havia para quem orar). Ele apenas sentiu uma vontade absoluta, irracional e furiosa de que a rocha ao lado de seu irmão se movesse para protegê-lo.</P>
          <P>Seu desespero atingiu uma frequência exata. Ele ressoou com Prime e Kaelor ao mesmo tempo. E pela primeira vez na história de Mythreon... <strong className="text-arcane-gold">a Essência ouviu um mortal</strong>.</P>
          <P>A rocha estilhaçou-se e ergueu-se do chão, empalando as feras. Kael morreu no processo, pois seu corpo não suportou a passagem de tanta energia bruta. Mas o irmão sobreviveu. E o mais importante: ele <strong className="text-arcane-gold">viu</strong>.</P>
          <H>Os Três Caminhos Primários</H>
          <P>Com o domínio da Essência, os reinos perceberam que nenhum mortal conseguia manipular todas as frequências. O corpo precisava se especializar. Isso deu origem aos Três Caminhos:</P>
          <div className="space-y-3 my-4">
            <div className="bg-arcane-bg rounded-lg p-4 border-l-4 border-gray-500">
              <div className="font-bold text-gray-300">🛡️ O Caminho da Formação (Moldadores)</div>
              <div className="text-xs text-gray-400 mt-1">Focados em Dhor, Prime e Chronos. Tornam sua pele tão dura quanto aço. Infundem armas com energia cinética. Manipulam a gravidade.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-4 border-l-4 border-red-500">
              <div className="font-bold text-red-400">⚔️ O Caminho da Ruptura (Condutores)</div>
              <div className="text-xs text-gray-400 mt-1">Focados em Kaelor, Raan e Voro. Aceleram a Essência criando fogo, calor e explosões. Magos de batalha, assassinos do vento.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-4 border-l-4 border-green-500">
              <div className="font-bold text-green-400">💚 O Caminho da Ressonância (Tecelões)</div>
              <div className="text-xs text-gray-400 mt-1">Focados em Lyss, Emohna e Veyra. Conectam. Curam. Transferem vitalidade. Invocam ecos de memória. Suportes, curandeiros e invocadores.</div>
            </div>
          </div>
        </div>
      );

    case 9:
      return (
        <div>
          <Q>Ninguém declara guerra dizendo que está errado. Toda atrocidade começa com duas pessoas tendo certeza absoluta de que estão certas.</Q>
          <P>O Continente Original não poderia suportar os Três Caminhos por muito tempo. Vaelghar (Moldadores) precisava de mais cristais de Essência para expandir suas muralhas e forjas. Sylanis (Tecelões e Condutores) recusava-se a permitir a mineração profunda, pois sabiam que isso adoeceria as Veias de Lyss.</P>
          <P>A diplomacia falhou quando as ideologias colidiram. Para Vaelghar, proteger a civilização era a missão suprema. Para Sylanis, o planeta vinha antes de qualquer civilização.</P>
          <H>O Dia do Céu Vermelho</H>
          <P>A Primeira Guerra não durou cem anos. Durou apenas três dias.</P>
          <P>Quando o exército de Moldadores marchou para as planícies, o chão tremia a quilômetros de distância. Os Condutores de Sylanis responderam incendiando a própria atmosfera acima deles.</P>
          <P>A colisão de magias primárias em escalas tão massivas criou um efeito que ninguém previu. A Essência do continente entrou em colapso.</P>
          <H>O Corte no Mundo</H>
          <P>O Nexo Central de Aethor, incapaz de processar tanta energia destrutiva simultânea, sofreu uma detonação silenciosa. Não foi uma explosão de fogo. Foi uma explosão de Espaço e Tempo.</P>
          <P>A terra rasgou-se. O oceano invadiu a ferida. Em questão de horas, o Continente Original partiu-se em vários pedaços menores, empurrados por maremotos que engoliram milhões.</P>
          <P>Foi assim que Mythreon ganhou seus continentes atuais. A guerra não teve um vencedor. Apenas sobreviventes isolados por oceanos que antes não existiam.</P>
          <Q>E assim, a Era das maravilhas terminou em cinzas, dando início a uma Era de isolamento, reconstrução e medo.</Q>
        </div>
      );

    case 10:
      return (
        <div>
          <Q>Não culpe o lobo por ter três olhos e respirar fogo. Fomos nós que incendiamos o céu e envenenamos a terra com magia pura. As feras apenas tentaram sobreviver ao que nós fizemos.</Q>
          <H>A Cicatriz da Essência</H>
          <P>Quando o Continente de Aethor se partiu, bilhões de toneladas de pedras e florestas afundaram. Mas a Essência que alimentava essas terras não afundou. Ela ficou à deriva no ar, como uma névoa radioativa de puro poder mágico.</P>
          <P>As Leis da Existência tentaram reequilibrar o mundo. A Lei de Lyss (Vida) forçou as criaturas a absorverem essa energia para não morrerem. O resultado foi a <strong className="text-arcane-gold">Primeira Mutação</strong>.</P>
          <H>As Três Ordens da Ameaça</H>
          <P>Com o passar dos séculos, os estudiosos catalogaram as criaturas de Mythreon não por sua aparência, mas por como a Essência havia alterado suas naturezas:</P>
          <div className="space-y-3 my-4">
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-yellow-600">
              <div className="font-bold text-yellow-500">🐺 Primeira Ordem: Os Ferais (Mutação Física)</div>
              <div className="text-xs text-gray-400 mt-1">Animais cujos corpos foram densificados pela Lei de Dhor. Escamas mais duras que aço. Ossos cristalizados. Exemplo: O Urso-Fenda, cujo rugido cria ondas de choque.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-red-500">
              <div className="font-bold text-red-400">🔥 Segunda Ordem: Os Ressonantes (Mutação Arcana)</div>
              <div className="text-xs text-gray-400 mt-1">Criaturas que absorveram tanta energia de Kaelor que perderam grande parte de seus corpos físicos. Elementais vivos. Exemplo: Os Espectros de Brasa.</div>
            </div>
            <div className="bg-arcane-bg rounded-lg p-3 border-l-4 border-purple-600">
              <div className="font-bold text-purple-400">🌑 Terceira Ordem: Os Vazios (A Ausência)</div>
              <div className="text-xs text-gray-400 mt-1">Criaturas que estavam em locais onde toda Essência foi sugada. Elas não têm magia. Elas devoram magia. Exemplo: Os Caminhantes da Névoa.</div>
            </div>
          </div>
          <H>O Pacto de Prata e as Guildas</H>
          <P>Com o mundo dividido por oceanos perigosos e estradas infestadas pelas Três Ordens, os antigos reinos entraram em colapso logístico. Vaelghar tinha o minério, mas o povo passava fome. Sylanis tinha curas, mas não tinha aço.</P>
          <P>Grupos de mercenários, antigos soldados e exploradores perceberam que o monopólio da sobrevivência estava em suas mãos. Eles começaram a cobrar para escoltar caravanas. Depois, começaram a comprar as mercadorias e vender dez vezes mais caro do outro lado do oceano.</P>
          <P>O comércio global não nasceu de um tratado de paz. Nasceu da fundação do <strong className="text-arcane-gold">Sindicato da Lâmina e da Moeda</strong>. Essas alianças de guerreiros, magos e mercadores passaram a ser chamadas de <strong className="text-arcane-gold">Guildas</strong>.</P>
          <Q>Uma espada protege você. Duas espadas protegem uma carroça. Cem espadas ditam o preço do que está na carroça.</Q>
        </div>
      );

    case 11:
      return (
        <div>
          <Q>Um mercenário confia em sua espada até que ela estilhace contra a pele de um Feral. Um mestre entende que, para matar uma anomalia, sua arma também precisa ser uma.</Q>
          <H>A Morte do Ferro Comum</H>
          <P>Nos primeiros anos após a Grande Ruptura, as Guildas sofriam baixas massivas. O aço forjado pelos Moldadores era forte, mas inerte. Quando colidia contra um Espectro de Brasa, o aço derretia.</P>
          <P>A humanidade percebeu que a Lei de Dhor não era suficiente. Era necessário invocar <strong className="text-arcane-gold">Synthes</strong>. O grande avanço ocorreu nas oficinas escondidas. Um ferreiro rebelde chamado Vóran percebeu que, se as criaturas de Segunda Ordem deixavam para trás Núcleos de Essência ao morrer, esse material não deveria ser usado apenas para curar. Deveria ser usado para ferir.</P>
          <P>Vóran derreteu um minério raríssimo, batizado de Aço-Estrela, e, no momento exato em que o metal resfriava, ele mergulhou a lâmina não em água, mas no Núcleo incandescente de um Feral Abissal.</P>
          <P>A oficina explodiu. Vóran perdeu um braço. Mas quando a fumaça baixou, a espada não estava destruída. Ela pulsava. Nascia a primeira <strong className="text-arcane-gold">Arma Desperta</strong>.</P>
          <H>As Cicatrizes do Mundo (Masmorras)</H>
          <P>Quando a Primeira Guerra rasgou os continentes, a crosta terrestre não apenas quebrou. Em alguns lugares, ela dobrou sobre si mesma, engolindo cidades inteiras, florestas primordiais e Nexos de poder.</P>
          <P>Esses bolsões isolados no subsolo, privados da luz do sol e saturados com concentrações absurdas de magia estagnada, tornaram-se ecossistemas bizarros e hostis. Os Arquivistas chamaram esses lugares de <strong className="text-arcane-gold">Cicatrizes</strong>. Os desbravadores os chamaram de <strong className="text-arcane-gold">Abismos</strong> (Dungeons).</P>
          <P>Dentro de uma Cicatriz, o tempo e a física não obedecem mais a Chronos e Prime de forma perfeita. Uma cidade engolida há mil anos pode estar habitada por criaturas que não pararam de sofrer mutações. A gravidade pode funcionar de lado. Rios de metal líquido podem fluir para cima.</P>
          <H>A Primeira Relíquia</H>
          <P>Diferente das Armas Despertas, que são fabricadas, as Relíquias são acidentes cósmicos. Elas nascem quando uma Lei da Existência se concentra excessivamente em um objeto físico durante um evento traumático.</P>
          <P>A primeira Relíquia registrada foi o <strong className="text-arcane-gold">Manto da Fenda</strong>. Durante a destruição de Aethor, um Tecelão tentou usar Lyss para salvar uma árvore primordial que sustentava uma vila inteira. Ele falhou. A árvore foi obliterada pela magia caótica. Mas sua seiva fundiu-se com as roupas do Tecelão no exato milésimo de segundo em que o espaço-tempo se dobrou.</P>
          <P>O Tecelão virou pó. Mas seu manto caiu no chão, intacto. Aquela capa agora ressoava eternamente com o luto de uma floresta e o poder de um espaço rasgado.</P>
          <Q>Mas as Relíquias têm um preço. Elas carregam a vontade de sua origem. Usá-las por muito tempo distorce a mente do portador. A Essência não pertence a ninguém, e quem tenta segurá-la por muito tempo... acaba sendo segurado por ela.</Q>
        </div>
      );

    case 12:
      return (
        <div>
          <Q>Quando o Continente de Aethor se partiu, todas as criaturas fugiram. Menos uma. Um cão de pelagem marrom e branca, com o rosto largo de um pitbull, ficou parado no centro do mundo enquanto o chão se abria sob suas patas.</Q>
          <P>Ele não latiu. Não correu. Apenas esperou. E quando a poeira baixou, ele ainda estava lá — maior, mais velho, e agora algo que nenhum Arquivista consegue classificar.</P>
          <P>Chamaram-no de <strong className="text-arcane-gold">Apolossaurus Gigantus</strong>. Mas os que sobreviveram ao seu olhar sabem: ele não é um monstro. É um teste. O último teste de Mythreon.</P>
          <H>O Último Primordial</H>
          <P>Apolossaurus habita a <strong className="text-arcane-gold">Câmara do Vínculo</strong> — uma área que só é acessível após o Arquivista:</P>
          <ul className="list-disc list-inside text-gray-300 space-y-1 my-4 pl-4">
            <li>Ter nível 100 (T5 completo)</li>
            <li>Ter derrotado o Primordial do Vazio</li>
            <li>Ter coletado os 12 Primordiais</li>
            <li>Ter uma raça Ascendida equipada</li>
            <li>Ter a Bolsa da Memória Universal equipada</li>
          </ul>
          <P>Ele não ataca por maldade. Ele testa se o jogador realmente entendeu o <strong className="text-arcane-gold">Vínculo (Emohna)</strong> — a Lei da Lealdade. É por isso que ele é um cão.</P>
          <H>A Batalha em Quatro Fases</H>
          <P>O Apolossaurus não é um "saco de pancadas com HP alto". Ele testa se o jogador entendeu o jogo:</P>
          <ul className="list-disc list-inside text-gray-300 space-y-1 my-4 pl-4">
            <li><strong className="text-arcane-gold">Fase 1 — O Guardião:</strong> paciência. Não ataque antes da hora.</li>
            <li><strong className="text-arcane-gold">Fase 2 — O Protetor:</strong> sobrevivência. Aguente o dano.</li>
            <li><strong className="text-arcane-gold">Fase 3 — O Julgador:</strong> suporte. Use skills de cura e buff, não só ataque.</li>
            <li><strong className="text-arcane-gold">Fase 4 — O Vínculo Perfeito:</strong> entrega. Saiba a hora de finalizar.</li>
          </ul>
          <H>O Que Ele Deixa</H>
          <P>Ao morrer, o Apolossaurus dropa:</P>
          <ul className="list-disc list-inside text-gray-300 space-y-1 my-4 pl-4">
            <li><strong className="text-arcane-gold">Coração de Apolossaurus</strong> — o único Primordial de Emohna</li>
            <li>O item lendário <strong className="text-arcane-gold">Colar do Vínculo Perfeito</strong></li>
            <li>A chance de obter <strong className="text-arcane-gold">The Lord of the Backpacks</strong> (o item mais raro do jogo)</li>
            <li>Fragmentos da <strong className="text-arcane-gold">Oitava Essência</strong> — a chave para a 34ª raça secreta</li>
          </ul>
          <Q>Quando a Oitava Essência retornar, o próprio destino do mundo poderá ser reescrito. A maioria considera isso apenas uma lenda. Os Arquivistas... não.</Q>
          <H>O Futuro de Mythreon</H>
          <P>A história de Mythreon não termina com o Apolossaurus. Ela continua a ser escrita a cada segundo, conforme cada Guilda tenta impor sua própria Vontade sobre as Sete Consciências Primordiais e o fluxo das Trinta e Três Leis.</P>
          <P>Cada descoberta. Cada vitória. Cada nova raça. Cada batalha. <strong className="text-arcane-gold">Tudo ficará gravado na própria Essência de Mythreon.</strong></P>
          <Q>E isso significa que o mundo nunca esquece.</Q>
        </div>
      );

    case 13:
      return (
        <div>
          <Q>Nem toda memória quer ser guardada em um arquivo. Algumas escolhem continuar vivas — e caminhar ao lado de alguém.</Q>
          <H>O Nome que os Mortais Deram</H>
          <P>Depois da Grande Ruptura, os Arquivistas encontraram doze ressonâncias vivas. Cinco surgiram nas grandes regiões conhecidas; outras sete carregavam traços das Consciências Primordiais. Nenhuma delas era uma Consciência em si, e nenhuma era um dos doze Primordiais ligados ao teste de Apolossaurus. Eram ecos menores, vivos e ainda assim impossíveis de explicar.</P>
          <P>Os povos passaram a chamá-las de <strong className="text-arcane-gold">Divine Beasts</strong>. O nome não significa que sejam deuses. É apenas a palavra que encontraram para descrever seres cuja presença parece antiga como o mundo.</P>
          <H>Os Cinco Ecos Regionais</H>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 pl-4">
            <li><strong className="text-arcane-gold">Elarion</strong>, o Cervo das Raízes Luminosas, guarda a persistência de Lyss.</li>
            <li><strong className="text-arcane-gold">Kharad</strong>, o Grifo da Coroa de Basalto, carrega a firmeza de Dhor.</li>
            <li><strong className="text-arcane-gold">Nerith</strong>, a Serpe das Marés de Nacre, acompanha o fluxo de Azhar.</li>
            <li><strong className="text-arcane-gold">Orivane</strong>, a Coruja dos Arquivos Celestes, preserva as lembranças de Asterion.</li>
            <li><strong className="text-arcane-gold">Vesper</strong>, a Raposa do Limiar Silencioso, atravessa as memórias feridas da Cicatriz Profunda.</li>
          </ul>
          <H>Os Sete Ecos das Consciências</H>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 pl-4">
            <li><strong className="text-arcane-gold">Solenne</strong>, a Fênix da Primeira Luz, carrega o eco de Aster.</li>
            <li><strong className="text-arcane-gold">Nhal</strong>, a Mariposa do Silêncio Sereno, carrega o eco de Nocthar.</li>
            <li><strong className="text-arcane-gold">Cindervane</strong>, a Salamandra da Mudança, carrega o eco de Kaelor.</li>
            <li><strong className="text-arcane-gold">Memnora</strong>, a Tartaruga do Arquivo Vivo, carrega o eco de Veyra.</li>
            <li><strong className="text-arcane-gold">Orruk</strong>, o Besouro-Cristal da Matéria, carrega o eco de Dhor.</li>
            <li><strong className="text-arcane-gold">Floravelle</strong>, a Mariposa dos Brotos, carrega o eco de Lyss.</li>
            <li><strong className="text-arcane-gold">Aeralis</strong>, a Raia-Celeste das Correntes, carrega o eco de Nyr.</li>
          </ul>
          <H>O Vínculo</H>
          <P>Uma Divine Beast não é capturada nem obrigada a obedecer. Quando um viajante vence o guardião de uma região, a Essência pode reconhecer naquela jornada uma frequência compatível. Se a criatura aceitar, forma-se um vínculo — um encontro de vontades associado à Lei do Vínculo, Emohna.</P>
          <P>Uma Matriz e uma Divine Beast ocupam o mesmo espaço de Ressonância. A Matriz canaliza um padrão de Leis; a Beast compartilha sua própria memória viva. O viajante pode escolher qual dessas presenças conduzirá sua força. A escolha pode ser desfeita, e nenhuma descoberta é perdida.</P>
          <Q>Não caminham atrás de nós. Caminham conosco. E, enquanto houver memória, nenhum vínculo desaparece por completo.</Q>
        </div>
      );

    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MONSTROS
// ═══════════════════════════════════════════════════════════════
function MonstersSection({ search }: { search: string }) {
  const allMonsters = useMemo(() => {
    const list: any[] = [];
    Object.values(ZONES).forEach(zone => {
      zone.enemies.forEach(enemy => list.push({ ...enemy, zoneName: zone.name, zoneTheme: zone.theme, zoneTier: zone.tier }));
    });
    return list;
  }, []);

  const filtered = allMonsters.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.zoneName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-arcane-panel border border-arcane-border rounded-lg p-3 text-xs text-gray-400">
        <strong className="text-white">{filtered.length}</strong> monstros catalogados · Todos os stats mostrados são por 1⭐ (multiplicam pela dificuldade)
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => (
          <div key={m.id} className={`bg-arcane-panel border-2 rounded-lg p-3 ${m.isBoss ? "border-red-900/70" : "border-arcane-border"}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {m.sprite ? <AssetImage src={m.sprite} alt="" className="h-12 w-12 object-contain [image-rendering:pixelated]" /> : <span className="text-2xl">{m.emoji}</span>}
                <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1">
                  {m.name}
                  {m.isBoss && <span className="text-[9px] bg-red-600 text-white px-1 rounded">👑</span>}
                </h3>
                <p className="text-[10px] text-gray-500">{m.zoneName} · Nv {m.minLevel}</p>
                </div>
              </div>
              <span className="text-yellow-400 text-xs">{'⭐'.repeat(m.difficulty)}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] mb-2">
              <div className="bg-arcane-bg rounded px-1 py-0.5"><span className="text-red-400">HP:</span> <span className="text-white">{m.hp}</span></div>
              <div className="bg-arcane-bg rounded px-1 py-0.5"><span className="text-orange-400">ATK:</span> <span className="text-white">{m.atk}</span></div>
              <div className="bg-arcane-bg rounded px-1 py-0.5"><span className="text-gray-400">ARM:</span> <span className="text-white">{m.arm}</span></div>
              <div className="bg-arcane-bg rounded px-1 py-0.5"><span className="text-yellow-400">XP:</span> <span className="text-white">{m.xp}</span></div>
            </div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>💰 Ouro: {m.goldMin}–{m.goldMax}</div>
              {m.element && <div className="text-orange-200">{ELEMENTS.find(element => element.id === m.element)?.icon} Afinidade: {ELEMENTS.find(element => element.id === m.element)?.name} · dano elemental</div>}
              {m.elementalResistances && Object.entries(m.elementalResistances).map(([element, resistance]) => <div key={element} className="text-cyan-200">Resistência: {ELEMENTS.find(entry => entry.id === element)?.name ?? element} {Math.round((resistance ?? 0) * 100)}%</div>)}
              <div>⚔️ Equipamento: {m.isBoss ? "60%" : "15%"} de chance base · Tier da zona</div>
              <div>🔮 Drop: <span className="text-arcane-cyan">{ATAQUES[m.componentId]?.name || m.componentId}</span> ({(m.componentChance * 100).toFixed(0)}%)</div>
              {m.essenceId && <div>💎 Essência: <span className="text-arcane-cyan">{SUPORTES[m.essenceId]?.name || m.essenceId}</span> ({((m.essenceChance || 0) * 100).toFixed(0)}%)</div>}
              {m.uniqueDropId && <div className="text-yellow-400">🏆 Único: {UNIQUE_TEMPLATES[m.uniqueDropId]?.name} ({((m.uniqueDropChance || 0) * 100).toFixed(1)}%)</div>}
              {m.backpackDrop && <div className="text-emerald-300">🎒 Mochila: {BACKPACKS[m.backpackDrop]?.name} ({((m.backpackChance || 0) * 100).toFixed(1)}%)</div>}
              {m.isBoss && <div className="text-arcane-gold">🐾 Divine Beast: 12% enquanto houver ecos não descobertos para este chefe</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ZONAS
// ═══════════════════════════════════════════════════════════════
function ZonesSection({ search }: { search: string }) {
  const zones = Object.values(ZONES).filter(z => z.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-3">
      {zones.map(z => (
        <div key={z.id} className="relative isolate overflow-hidden bg-arcane-panel border border-arcane-border rounded-lg p-4">
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden opacity-20"><AssetImage src={`/assets/backgrounds/${z.theme}.png`} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#090e12]/90 to-[#090e12]/55" /></div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-arcane-gold text-lg">🗺️ {z.name}</h3>
              <p className="text-xs text-gray-500">Tier {z.tier} · Nível {z.minLevel}–{z.maxLevel}</p>
            </div>
            <div className="text-xs text-gray-400 text-right">
              <div>Tema: <span className="text-arcane-cyan">{z.theme}</span></div>
              <div>{z.enemies.length} inimigos</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {z.enemies.map(e => (
              <div key={e.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/35 px-2 py-1.5 text-xs">
                {e.sprite ? <AssetImage src={e.sprite} alt="" className="h-10 w-10 object-contain [image-rendering:pixelated]" /> : <span className="text-xl">{e.emoji}</span>}
                <span className="min-w-0"><strong className="block truncate text-gray-200">{e.name}</strong><span className="text-yellow-400">{'⭐'.repeat(e.difficulty)}</span>{e.isBoss && <span className="ml-1 text-red-300">Chefe</span>}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EQUIPAMENTOS
// ═══════════════════════════════════════════════════════════════
function ElementalChartSection() {
  return <div className="space-y-4">
    <section className="rounded-xl border border-arcane-gold/25 bg-arcane-panel p-4"><h2 className="text-lg font-black text-arcane-gold">Relações elementais</h2><p className="mt-1 text-xs text-gray-400">Vantagem causa 1,25×; resistência reduz para 0,75×. As resistências próprias da criatura ou do personagem também se aplicam depois da relação. Base é neutro.</p><div className="mt-3 flex flex-wrap gap-2">{ELEMENTS.map(element => <span key={element.id} className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-gray-200">{element.icon} {element.name}</span>)}</div></section>
    <div className="overflow-x-auto rounded-xl border border-arcane-border bg-arcane-panel"><table className="min-w-[840px] border-collapse text-center text-[10px]"><thead><tr><th className="sticky left-0 bg-arcane-panel p-2 text-gray-400">Ataque ↓ / Defesa →</th>{ELEMENTS.map(def => <th key={def.id} className="p-2 text-gray-300">{def.icon}<br />{def.name}</th>)}</tr></thead><tbody>{ELEMENTS.map(atk => <tr key={atk.id} className="border-t border-white/5"><th className="sticky left-0 bg-arcane-panel p-2 text-left text-gray-200">{atk.icon} {atk.name}</th>{ELEMENTS.map(def => { const mult = elementMultiplier(atk.id, def.id); return <td key={def.id} className={`p-2 font-bold ${mult > 1 ? "text-emerald-300" : mult < 1 ? "text-rose-300" : "text-gray-600"}`}>{mult.toFixed(2)}×</td>; })}</tr>)}</tbody></table></div>
    <p className="text-[10px] text-gray-500">Armas Incomuns ou superiores podem receber elemento e bônus aleatório de dano elemental. O valor fica gravado no item e não muda ao recarregar.</p>
  </div>;
}

function EquipmentSection({ search }: { search: string }) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<number>(0);
  const categories = ["all", "ARMA", "ARMADURA", "JOIA", "ESCUDO", "FLECHA"];

  const items = [...Object.values(ALL_EQUIPMENT_TEMPLATES), ...Object.values(ARROW_TEMPLATES)].filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || i.category === categoryFilter;
    const matchTier = tierFilter === 0 || i.tier === tierFilter;
    return matchSearch && matchCategory && matchTier;
  });

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-arcane-cyan/20 bg-arcane-cyan/5 p-3 text-xs text-gray-400">Flechas T1–T5 são munição equipável e podem cair durante a caça. No momento, não são consumidas pelo combate automático.</p>
      <div className="flex flex-wrap gap-2 bg-arcane-panel border border-arcane-border rounded-lg p-3">
        <div className="text-xs text-gray-400 mr-2 self-center">Categoria:</div>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-2 py-1 rounded text-xs font-bold ${categoryFilter === c ? "bg-arcane-cyan text-black" : "bg-arcane-bg text-gray-400"}`}>
            {c === "all" ? "Todos" : c}
          </button>
        ))}
        <div className="text-xs text-gray-400 mr-2 self-center ml-4">Tier:</div>
        {[0, 1, 2, 3, 4, 5].map(t => (
          <button key={t} onClick={() => setTierFilter(t)} className={`px-2 py-1 rounded text-xs font-bold ${tierFilter === t ? "bg-arcane-cyan text-black" : "bg-arcane-bg text-gray-400"}`}>
            {t === 0 ? "Todos" : `T${t}`}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400">{items.length} itens encontrados</div>
      <div className="overflow-hidden rounded-xl border border-arcane-border bg-arcane-panel shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead className="bg-black/30 text-[10px] uppercase tracking-wider text-gray-400"><tr><th className="px-4 py-3">Equipamento</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Atributos base</th></tr></thead>
            <tbody className="divide-y divide-white/5">{items.map(item => <tr key={item.templateId} className="transition hover:bg-white/[.035]">
              <td className="px-4 py-2"><div className="flex items-center gap-3"><WikiItemIcon item={item} size="h-10 w-10" /><span className="font-bold text-white">{item.name}</span></div></td>
              <td className="px-4 py-2"><span className="rounded-full border border-arcane-cyan/30 bg-arcane-cyan/10 px-2 py-1 font-bold text-arcane-cyan">T{item.tier}</span></td>
              <td className="px-4 py-2 text-gray-300">{item.category}</td>
              <td className="px-4 py-2"><div className="flex flex-wrap gap-1">{item.element && <span className="rounded border border-orange-900/40 bg-orange-950/20 px-2 py-1 text-[10px] text-orange-200">{ELEMENTS.find(e => e.id === item.element)?.icon} {ELEMENTS.find(e => e.id === item.element)?.name} · até {Math.round((item.elementalDamagePct ?? 0) * 100)}% bônus nos drops</span>}{Object.entries(item.stats).map(([k, v]) => <span key={k} className="rounded bg-black/30 px-2 py-1 text-[10px]"><span className="text-gray-500 uppercase">{k}:</span> <strong className="text-white">{formatWikiStat(k, v as number)}</strong></span>)}</div></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONSUMÍVEIS
// ═══════════════════════════════════════════════════════════════
function ConsumablesSection({ search }: { search: string }) {
  const potions = Object.values(POTION_TEMPLATES).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const vials = Object.values(VIALS).filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-blue-400 mb-3">🧪 Poções</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {potions.map(p => (
            <div key={p.templateId} className="bg-arcane-panel border border-arcane-border rounded-lg p-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2"><WikiItemIcon item={p} size="h-9 w-9" /> {p.name}</h4>
              <p className="text-[10px] text-gray-500 mt-1">{p.stats.hp ? `❤️ Cura ${p.stats.hp} HP` : `🔮 Restaura ${p.stats.mp} MP`}</p>
              <p className="text-[10px] text-arcane-gold mt-1">💰 {getPotionUsePrice(p.templateId).toLocaleString("pt-BR")} gold por uso</p>
              <p className="text-[10px] text-gray-500 mt-1">Ative o consumo automático na tela de caça. O valor só é cobrado quando a poção é acionada.</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-arcane-cyan mb-3">💉 Vials (Buffs Temporários)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {vials.map(v => (
            <div key={v.id} className="bg-arcane-panel border border-arcane-border rounded-lg p-3">
              <h4 className="font-bold text-white text-sm">{v.icon} {v.name}</h4>
              <p className="text-[10px] text-arcane-cyan mt-1">{v.description}</p>
              <div className="flex justify-between text-[10px] mt-2">
                <span className="text-gray-400">⏱️ {v.durationMinutes} min</span>
                <span className="text-yellow-400 font-bold">💰 {v.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTES
// ═══════════════════════════════════════════════════════════════
function ComponentsSection({ search }: { search: string }) {
  const [typeFilter, setTypeFilter] = useState<string>("ATAQUE");
  const allComponents = { ATAQUE: Object.values(ATAQUES), SUPORTE: Object.values(SUPORTES), PASSIVA: Object.values(PASSIVAS) };
  const filtered = allComponents[typeFilter as keyof typeof allComponents].filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.skillName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-arcane-panel border border-arcane-border rounded-lg p-3">
        {["ATAQUE", "SUPORTE", "PASSIVA"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded text-xs font-bold ${typeFilter === t ? "bg-arcane-purple text-white" : "bg-arcane-bg text-gray-400"}`}>
            {t === "ATAQUE" ? "⚔️ Ataques" : t === "SUPORTE" ? "💚 Suportes" : "✨ Passivas"}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(c => {
          const sources = getComponentSources(c.id);
          const effect = typeFilter === "ATAQUE" ? ATTACK_SKILLS[c.id] : typeFilter === "SUPORTE" ? SUPPORT_EFFECTS[c.id] : PASSIVE_EFFECTS[c.id];
          return (
            <div key={c.id} className="bg-arcane-panel border border-arcane-border rounded-lg p-3">
              <h4 className="font-bold text-white text-sm">{c.icon} {c.name}</h4>
              <p className="text-[10px] text-gray-500">ID: {c.id} · Lei: {c.law}</p>
              <div className="text-xs text-arcane-cyan mt-2"><strong>{c.skillName}</strong></div>
              {effect && <p className="text-[10px] text-gray-400 mt-1">{"desc" in effect ? effect.desc : c.skillDescription}</p>}
              <div className="mt-2 pt-2 border-t border-arcane-border">
                <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">Onde Encontrar:</div>
                {sources.length > 0 ? (
                  <div className="space-y-0.5">
                    {sources.slice(0, 3).map((s, i) => (
                      <div key={i} className="text-[10px] text-gray-400">· {s.monster} <span className="text-gray-600">({s.zone})</span></div>
                    ))}
                    {sources.length > 3 && <div className="text-[9px] text-gray-600">+{sources.length - 3} mais</div>}
                  </div>
                ) : <div className="text-[10px] text-gray-600 italic">Desconhecido</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RAÇAS
// ═══════════════════════════════════════════════════════════════
function RacesSection({ search }: { search: string }) {
  const [showCombos, setShowCombos] = useState(false);
  const filtered = NAMED_RACES.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  const lineages = [HUMAN_LINEAGE, ...Object.values(LINEAGES)].filter(lineage => `${lineage.name} ${lineage.description}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-arcane-cyan/25 bg-gradient-to-br from-arcane-panel via-slate-950 to-arcane-panel p-4 shadow-lg">
        <div className="mb-3"><h3 className="text-lg font-black text-arcane-cyan">Linhagens de combate</h3><p className="text-xs text-gray-400">As artes abaixo identificam a linhagem humana inicial e as 15 linhagens associadas aos componentes de Ataque. A combinação com Suporte e Passiva forma uma raça/build.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{lineages.map(lineage => <article key={lineage.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/5 bg-black/25 p-2 transition hover:border-arcane-cyan/30">
          <AssetImage src={lineage.sprite} alt={lineage.name} className="h-12 w-12 shrink-0 object-contain [image-rendering:pixelated]" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />
          <div className="min-w-0"><h4 className="truncate text-[11px] font-bold text-white">{lineage.name}</h4><p className="line-clamp-2 text-[9px] leading-tight text-gray-500">{lineage.description}</p></div>
        </article>)}</div>
      </section>
      <div className="bg-arcane-panel border border-arcane-border rounded-lg p-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-arcane-gold">★ As 33 Raças Nomeadas</h3>
            <p className="text-xs text-gray-500">Cada uma requer uma combinação exata de Ataque + Suporte + Passiva</p>
          </div>
          <button onClick={() => setShowCombos(!showCombos)} className={`px-3 py-1.5 rounded font-bold text-xs ${showCombos ? "bg-red-600 text-white" : "bg-arcane-cyan text-black"}`}>
            {showCombos ? "🙈 Ocultar Combinações" : "👁️ Revelar Combinações"}
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(r => {
          const atk = ATAQUES[r.ataqueId];
          const sup = SUPORTES[r.suporteId];
          const pas = PASSIVAS[r.passivaId];
          const atkEffect = ATTACK_SKILLS[r.ataqueId];
          const supEffect = SUPPORT_EFFECTS[r.suporteId];
          const pasEffect = PASSIVE_EFFECTS[r.passivaId];
          return (
            <div key={r.id} className="bg-arcane-panel border-2 border-arcane-gold/30 rounded-lg p-4">
              <div className="mb-2 flex items-center gap-3"><AssetImage src={LINEAGES[r.ataqueId]?.sprite} alt="" className="h-14 w-14 object-contain [image-rendering:pixelated]" /><div><h3 className="font-bold text-arcane-gold text-base">{r.name}</h3><p className="text-[10px] text-gray-500">Linhagem {LINEAGES[r.ataqueId]?.name ?? ""}</p></div></div>
              <p className="text-[10px] text-gray-500 mb-2">ID: {r.id} · ★ Nomeada</p>
              <p className="text-[11px] italic text-gray-400 mb-3">"{RACE_LORE[r.id]}"</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] mb-3">
                {Object.entries(r.bonus).map(([k, v]) => (
                  <div key={k} className="bg-arcane-bg px-1 py-0.5 rounded text-center">
                    <span className="text-gray-500 uppercase">{k}:</span> <span className="text-green-400 font-bold">+{formatWikiStat(k, v as number)}</span>
                  </div>
                ))}
              </div>
              {showCombos ? (
                <div className="space-y-1 text-[10px] mb-3">
                  <div className="bg-red-900/20 px-2 py-1 rounded"><span className="text-red-400 font-bold">⚔️ Ataque:</span> {atk?.icon} {atk?.name}</div>
                  <div className="bg-green-900/20 px-2 py-1 rounded"><span className="text-green-400 font-bold">💚 Suporte:</span> {sup?.icon} {sup?.name}</div>
                  <div className="bg-yellow-900/20 px-2 py-1 rounded"><span className="text-yellow-400 font-bold">✨ Passiva:</span> {pas?.icon} {pas?.name}</div>
                </div>
              ) : (
                <div className="bg-arcane-bg px-2 py-1 rounded text-[10px] text-gray-600 italic mb-3">Combinação secreta</div>
              )}
              <div className="space-y-1 text-[10px]">
                <div className="text-red-400">⚔️ {atkEffect?.desc.split(":")[0]}</div>
                <div className="text-green-400">💚 {supEffect?.desc.split(":")[0]}</div>
                <div className="text-yellow-400">✨ {pasEffect?.desc.split(":")[0]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHEFES
// ═══════════════════════════════════════════════════════════════
function BossesSection({ search }: { search: string }) {
  const bosses = useMemo(() => {
    const list: any[] = [];
    Object.values(ZONES).forEach(zone => {
      zone.enemies.filter(e => e.isBoss).forEach(enemy => list.push({ ...enemy, zoneName: zone.name }));
    });
    return list;
  }, []);

  const filtered = bosses.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  const uniques = Object.values(UNIQUE_TEMPLATES).filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-red-400 mb-3">👑 Chefes de Zona</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map(b => {
            const unique = b.uniqueDropId ? UNIQUE_TEMPLATES[b.uniqueDropId] : null;
            return (
              <div key={b.id} className="bg-arcane-panel border-2 border-red-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">{b.sprite ? <AssetImage src={b.sprite} alt="" className="h-14 w-14 object-contain [image-rendering:pixelated]" /> : <span className="text-2xl">{b.emoji}</span>}<h4 className="font-bold text-white text-base">{b.name} <span className="text-red-500">👑</span></h4></div>
                    <p className="text-[10px] text-gray-500">{b.zoneName} · Nv {b.minLevel}</p>
                  </div>
                  <span className="text-yellow-400">{'⭐'.repeat(b.difficulty)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] mb-2">
                  <div className="bg-arcane-bg rounded p-1 text-center"><span className="text-red-400">HP</span><div className="text-white font-bold">{b.hp}</div></div>
                  <div className="bg-arcane-bg rounded p-1 text-center"><span className="text-orange-400">ATK</span><div className="text-white font-bold">{b.atk}</div></div>
                  <div className="bg-arcane-bg rounded p-1 text-center"><span className="text-gray-400">ARM</span><div className="text-white font-bold">{b.arm}</div></div>
                  <div className="bg-arcane-bg rounded p-1 text-center"><span className="text-yellow-400">XP</span><div className="text-white font-bold">{b.xp}</div></div>
                </div>
                {unique && (
                  <div className="bg-yellow-900/20 border border-yellow-800/50 p-2 rounded">
                    <div className="text-[10px] text-yellow-400 font-bold">🏆 Drop Único: {unique.icon} {unique.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{unique.uniqueEffect}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-arcane-gold mb-3">🏆 Itens Únicos</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {uniques.map(u => (
            <div key={u.templateId} className="bg-gradient-to-br from-yellow-900/20 to-arcane-panel border-2 border-arcane-gold/50 rounded-lg p-3">
              <h4 className="font-bold text-arcane-gold text-sm flex items-center gap-2"><WikiItemIcon item={u} size="h-10 w-10" /> {u.name}</h4>
              <p className="text-[10px] text-gray-400 italic mt-1">{u.uniqueEffect}</p>
              <div className="flex flex-wrap gap-1 text-[10px] mt-2">
                {Object.entries(u.stats).map(([k, v]) => (
                  <span key={k} className="bg-arcane-bg px-1 py-0.5 rounded"><span className="text-gray-500 uppercase">{k}:</span> <span className="text-white">{formatWikiStat(k, v as number)}</span></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOCHILAS
// ═══════════════════════════════════════════════════════════════
function BackpacksSection({ search }: { search: string }) {
  const backpacks = Object.entries(BACKPACKS).filter(([_, bp]) => bp.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {backpacks.map(([key, bp]) => {
        const sources = Object.values(ZONES).flatMap(zone => zone.enemies.filter(enemy => enemy.backpackDrop === key).map(enemy => ({ zone: zone.name, enemy: enemy.name, chance: enemy.backpackChance ?? 0 })));
        return (
          <div key={key} className="bg-arcane-panel border border-arcane-border rounded-lg p-4">
            <div className="flex items-center gap-3"><WikiAssetIcon templateId={bp.templateId} name={bp.name} /><h3 className="font-bold text-white text-sm">{bp.name}</h3></div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-gray-400">Slots:</span><span className="text-arcane-cyan font-bold">{bp.slots}</span></div>
              {bp.xpBonus > 0 && <div className="flex justify-between"><span className="text-gray-400">Bônus XP:</span><span className="text-green-400 font-bold">+{(bp.xpBonus * 100).toFixed(0)}%</span></div>}
              {bp.dropBonus > 0 && <div className="flex justify-between"><span className="text-gray-400">Bônus Drop:</span><span className="text-green-400 font-bold">+{(bp.dropBonus * 100).toFixed(0)}%</span></div>}
              {bp.rareDropBonus > 0 && <div className="flex justify-between"><span className="text-gray-400">Bônus Raro:</span><span className="text-blue-400 font-bold">+{(bp.rareDropBonus * 100).toFixed(0)}%</span></div>}
              <div className="border-t border-arcane-border pt-2"><span className="text-gray-400">Origem:</span>{sources.length ? sources.map(source => <div key={`${source.zone}-${source.enemy}`} className="mt-1 text-emerald-300">{source.enemy} · {source.zone} · {(source.chance * 100).toFixed(1)}% de chance</div>) : <div className="mt-1 text-gray-400">Mochila inicial do personagem</div>}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FRAGMENTOS
// ═══════════════════════════════════════════════════════════════
function FragmentsSection({ search }: { search: string }) {
  const fragments = Object.values(FRAGMENT_TEMPLATES).filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="bg-arcane-panel border border-arcane-border rounded-lg p-4">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">💎 Fragmentos de Essência</h3>
        <p className="text-xs text-gray-400">
          Fragmentos são obtidos ao usar a desmontagem seletiva no <strong className="text-white">Ferreiro</strong>. A Forja consome Fragmentos e gold para aprimorar equipamentos; a quantidade necessária cresce conforme o nível do item.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {fragments.map(f => (
          <div key={f.templateId} className="bg-arcane-panel border border-arcane-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <WikiItemIcon item={f} size="h-12 w-12" />
              <div>
                <h3 className={`font-bold text-sm ${f.rarity === "EPICO" ? "text-purple-400" : f.rarity === "RARO" ? "text-blue-400" : "text-gray-400"}`}>{f.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase">{f.rarity}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400">
              {f.rarity === "COMUM" ? "Obtido ao desmanchar itens Comum/Incomum" :
               f.rarity === "RARO" ? "Obtido ao desmanchar itens Raros (2 por item)" :
               "Obtido ao desmanchar itens Épicos/Lendários (3 por item)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
