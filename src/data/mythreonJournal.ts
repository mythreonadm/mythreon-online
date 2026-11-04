export type JournalKind = "ATUALIZAÇÃO" | "EVENTO" | "LORE" | "AVISO";

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  kind: JournalKind;
  summary: string;
  body: string;
  tags: string[];
  active?: boolean;
}

import releaseEntries from "./journal-releases.json";

const LEGACY_MYTHREON_JOURNAL: JournalEntry[] = [
  {
    id: "pack-60-biome-cards", date: "04/11/2026", title: "Memórias do lodo e do vidro", kind: "ATUALIZAÇÃO",
    summary: "Dez novos Cards chegam com as criaturas de Pântano de Veyra e Deserto de Kaelor.",
    body: "Sapo-Miasma, Libélula-Lâmina, Cipó da Memória, Crocodilo de Silte, Matriarca do Lodo, Escaravelho Vítreo, Espectro Solar, Serpente de Miragem, Golem de Obsidiana e Sentinela do Zênite agora podem deixar uma memória em seus abates. As cartas usam os sprites dos próprios biomas, fortalecem a formação sem substituir Matriz, Pet ou Treino e podem ser evoluídas pelas mesmas regras do Álbum. A temporada de novembro preserva seu catálogo original; a expansão passa a contar a partir de dezembro.",
    tags: ["Cards", "Veyra", "Kaelor", "Coleção"],
  },
  {
    id: "pack-59-card-evolution", date: "04/11/2026", title: "As memórias aprendem a crescer", kind: "ATUALIZAÇÃO",
    summary: "Cards agora evoluem até o nível 5 com gold e cópias livres, com bônus reais explicados no Álbum.",
    body: "Equipe cartas pelo próprio Álbum e compare o bônus que chega ao herói. Para evoluir, selecione cópias iguais de nível 1, revise o custo e confirme. A memória principal permanece; cópias equipadas e já evoluídas são protegidas. As imagens das criaturas ganham espaço na coleção, e a Wiki traz a tabela completa de evolução.",
    tags: ["Cards", "Coleção", "Evolução", "Wiki"],
  },
  {
    id: "pack-58-profession-scenes", date: "04/11/2026", title: "A vida além das caçadas", kind: "ATUALIZAÇÃO",
    summary: "Cenas de coleta com seu herói, efeitos existentes e iscas opcionais para a Pesca.",
    body: "Observe cada ponto de coleta em seu bioma e acompanhe a linha ou a picareta durante o pulso. A isca da Cicatriz ganha um uso: uma unidade por pesca concluída rende um peixe extra. Cancelar ou falhar preserva a isca. As cenas acompanham suas opções de animação e efeitos, e a Wiki reúne as regras e receitas.",
    tags: ["Profissões", "Pesca", "Mineração", "Iscas"],
  },
  {
    id: "pack-57-gathering-pulse", date: "04/11/2026",
    title: "O pulso da terra e das águas", kind: "ATUALIZAÇÃO",
    summary: "Mineração e Pesca online recebem um pulso único e confirmação de precisão.",
    body: "Segure para preparar a coleta, aguarde a contagem e solte na faixa dourada. Cada tentativa é vinculada ao seu personagem e ao ponto escolhido. A nota e o bônus são confirmados juntos, sem repetir o prêmio de um pulso já usado. Cancelar ou sair da página encerra a tentativa sem consumir recursos.",
    tags: ["Profissões", "Pesca", "Mineração"],
  },
  {
    id: "pack-56-online-queue",
    date: "04/11/2026",
    title: "Sua próxima ação acompanha o ritmo da aventura",
    kind: "ATUALIZAÇÃO",
    summary: "Plantios e equipamentos mantêm sua prévia enquanto as ações anteriores são confirmadas.",
    body: "A barra online mostra quantas ações aguardam confirmação. Se uma resposta se perder, você pode continuar consultando mapas, itens e a Wiki enquanto recuperamos a ação. Eclosões, compras e outros resultados sorteados só anunciam o prêmio confirmado. Ao retornar ao personagem, ações registradas neste navegador são retomadas sem cobrar novamente a mesma transação.",
    tags: ["Conexão", "Fazenda", "Inventário", "Pets"],
  },
  {
    id: "pack-55-wardrobe",
    date: "04/11/2026",
    title: "O guarda-roupa desperta novas formas",
    kind: "ATUALIZAÇÃO",
    summary: "Skin humana completa, aura independente de Pet, addon do Boss e controles para cada efeito.",
    body: "A Capa do Primeiro Canto agora usa sua arte completa na forma humana. Matrizes mantêm suas transformações. No guarda-roupa, veja humano e Matriz, selecione seus cosméticos e remova efeitos separadamente. A nova Aura da Besta Divina ilumina o companheiro sem alterar atributos. O addon ganha sua arte na arena cooperativa. Ao negociar o último item cosmético, o visual é desativado até você possuir um exemplar novamente.",
    tags: ["Cosméticos", "Skins", "Pets", "Boss"],
  },
  {
    id: "pack-54-calendar",
    date: "04/11/2026",
    title: "Cada presença deixa uma marca na Essência",
    kind: "ATUALIZAÇÃO",
    summary: "Calendário com dias reais, marcos de sete presenças e skin mensal permanente.",
    body: "Resgate uma presença por dia UTC usando um Cupom. Complete sete dias consecutivos para receber Fragmentos Raros; o marco seguinte vem depois de mais sete presenças. Alcance 30 presenças no mês para liberar a skin anunciada no guarda-roupa, mesmo com a bolsa cheia. O bônus semanal tenta o depósito se faltar espaço. Confira as regras e a coleção anunciada na Wiki.",
    tags: ["Calendário", "Recompensas", "Skins"],
  },
  {
    id: "pack-53-professions",
    date: "04/11/2026",
    title: "Do Refúgio ao Eclipse: novas rotas de coleta",
    kind: "ATUALIZAÇÃO",
    summary: "Mineração e Pesca ganham progressão T1–T5, pulso visível por toque e novas receitas.",
    body: "Libere as travessias em Jornadas, equipe ferramentas de sua skill e encontre cobre, trutas geladas, peixes dos corais e recursos do Eclipse. Segure e solte na faixa dourada para melhorar o rendimento. A Wiki reúne os requisitos e receitas; o Caldo da Marca-d’Água pode ser vendido ou usado para alimentar seu Pet.",
    tags: ["Profissões", "Pesca", "Mineração", "Pets"],
  },
  {
    id: "pack-37-pvp-season",
    date: "04/11/2026",
    title: "A primeira temporada da Arena foi selada",
    kind: "ATUALIZAÇÃO",
    summary: "O ranking agora guarda snapshots sazonais e entrega recompensas por tier.",
    body: "Cada vitória deixa uma marca no Registro de Combate. Ao fim da temporada, Bronze, Prata, Ouro, Platina e Mítico recebem Gold, Mythreon Shards e Mythreon Coins sem alterar o equilíbrio da hunt.",
    tags: ["PvP", "Ranking", "Temporada"],
  },
  {
    id: "pack-36-cosmetics",
    date: "04/11/2026",
    title: "A luz das Matrizes encontrou novas formas",
    kind: "ATUALIZAÇÃO",
    summary: "Skins, luminescências e addons cosméticos passaram a acompanhar o herói.",
    body: "Os cosméticos são registrados no loadout visual e não substituem Matriz, Pet ou equipamento. O brilho é uma assinatura de identidade, não uma vantagem escondida.",
    tags: ["Skins", "Pets", "Cosmético"],
  },
  {
    id: "pack-30-daily-boss",
    date: "03/11/2026",
    title: "O sino do Boss Diário voltou a tocar",
    kind: "EVENTO",
    summary: "Manhã, tarde e noite agora podem convocar uma criatura para todo o servidor.",
    body: "A vida do Boss cresce com a participação. Mesmo quando a fera não cai, todo golpe legítimo é registrado e gera uma recompensa proporcional; quando cai, a comunidade recebe uma celebração extra.",
    tags: ["Boss", "Coop", "Evento"],
    active: true,
  },
  {
    id: "lore-cabana-sinax",
    date: "02/11/2026",
    title: "A cabana que aprendeu a escutar",
    kind: "LORE",
    summary: "O Refúgio da Essência ganhou um lugar para mapas, treino e descanso.",
    body: "Dizem que cada tábua do Refúgio guarda um som do Primeiro Canto. Quando um aventureiro volta derrotado, a casa não pergunta quanto ele perdeu: apenas acende uma luz para indicar o próximo caminho.",
    tags: ["Lore", "Refúgio", "Primeiro Canto"],
  },
  {
    id: "roadmap-online",
    date: "01/11/2026",
    title: "O mundo online está em travessia",
    kind: "AVISO",
    summary: "Mercado Negro, Fazenda, Pets e comunicação seguem recebendo testes antes da abertura pública.",
    body: "As próximas inscrições de teste vão priorizar duas contas em dispositivos diferentes. Toda falha de sincronização deve ser anotada com horário, tela e ação para que o Cérebro de Mythreon possa rastrear a origem.",
    tags: ["Teste", "Online", "Roadmap"],
  },
];

/** Entradas editoriais são sincronizadas de docs/jornal/releases.json no build. */
export const MYTHREON_JOURNAL: JournalEntry[] = [
  ...(releaseEntries as JournalEntry[]),
  ...LEGACY_MYTHREON_JOURNAL,
];

export function journalKindClass(kind: JournalKind) {
  return kind === "ATUALIZAÇÃO" ? "text-cyan-200 border-cyan-300/30 bg-cyan-950/20" : kind === "EVENTO" ? "text-amber-200 border-amber-300/30 bg-amber-950/20" : kind === "LORE" ? "text-purple-200 border-purple-300/30 bg-purple-950/20" : "text-emerald-200 border-emerald-300/30 bg-emerald-950/20";
}
