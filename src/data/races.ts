import { Race } from "../types";

// ═══════════════════════════════════════════════════════════════
// AS 33 RAÇAS NOMEADAS
// ═══════════════════════════════════════════════════════════════
export const NAMED_RACES: Race[] = [
  { id: "R01", name: "Portador da Primeira Luz", tier: "NOMEADA", ataqueId: "A3", suporteId: "S3", passivaId: "P5", skills: { ataque: "Raio Nascente", suporte: "Renovação", passiva: "Alvorecer" }, bonus: { hp: 100, mp: 50, atk: 10 } },
  { id: "R02", name: "Caminhante do Silêncio", tier: "NOMEADA", ataqueId: "A8", suporteId: "S4", passivaId: "P6", skills: { ataque: "Golpe Crepuscular", suporte: "Véu de Descanso", passiva: "Serenidade" }, bonus: { hp: 120, dge: 0.08 } },
  { id: "R03", name: "Metamorfo", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P7", skills: { ataque: "Erupção Muda", suporte: "Adaptação", passiva: "Evolução Constante" }, bonus: { atk: 15, matk: 20, hp: 80 } },
  { id: "R04", name: "Arquivista Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P10", skills: { ataque: "Eco do Passado", suporte: "Leitura de Memória", passiva: "Codex Vivo" }, bonus: { mp: 150, atk: 10, matk: 15 } },
  { id: "R05", name: "Moldador de Baluartes", tier: "NOMEADA", ataqueId: "A4", suporteId: "S7", passivaId: "P2", skills: { ataque: "Impacto Sísmico", suporte: "Muralha de Pedra", passiva: "Pele de Granito" }, bonus: { arm: 50, def: 20, hp: 250 } },
  { id: "R06", name: "Tecelão da Vida", tier: "NOMEADA", ataqueId: "A7", suporteId: "S1", passivaId: "P1", skills: { ataque: "Chicote de Seiva", suporte: "Vínculo Empático", passiva: "Memória da Floresta" }, bonus: { hp: 350, def: 15 } },
  { id: "R07", name: "Andarilho do Vento", tier: "NOMEADA", ataqueId: "A10", suporteId: "S8", passivaId: "P4", skills: { ataque: "Lâmina de Vendaval", suporte: "Passo Etéreo", passiva: "Vento nas Costas" }, bonus: { spd: 0.12, dge: 0.06 } },
  { id: "R08", name: "Arquiteto da Ordem", tier: "NOMEADA", ataqueId: "A9", suporteId: "S10", passivaId: "P3", skills: { ataque: "Pilar de Cristal", suporte: "Estrutura Coesa", passiva: "Padrão Perfeito" }, bonus: { def: 20, arm: 30, resMagico: 0.05 } },
  { id: "R09", name: "Herege da Dúvida", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P9", skills: { ataque: "Golpe Imprevisível", suporte: "Dissonância", passiva: "Ceticismo" }, bonus: { crit: 0.10, hit: 0.06 } },
  { id: "R10", name: "Sábio da Compreensão", tier: "NOMEADA", ataqueId: "A15", suporteId: "S10", passivaId: "P11", skills: { ataque: "Cadeia Lógica", suporte: "Insight Tático", passiva: "Erudição" }, bonus: { matk: 30, crit: 0.06, hit: 0.06 } },
  { id: "R11", name: "Vinculador de Almas", tier: "NOMEADA", ataqueId: "A13", suporteId: "S2", passivaId: "P5", skills: { ataque: "Laço Compartilhado", suporte: "Juramento", passiva: "Lealdade" }, bonus: { hp: 250, atk: 15, arm: 20 } },
  { id: "R12", name: "Explorador do Horizonte", tier: "NOMEADA", ataqueId: "A6", suporteId: "S8", passivaId: "P4", skills: { ataque: "Investida Distante", suporte: "Rota Alternativa", passiva: "Mapa Mental" }, bonus: { spd: 0.10, hit: 0.06, dge: 0.06 } },
  { id: "R13", name: "Alquimista da União", tier: "NOMEADA", ataqueId: "A11", suporteId: "S12", passivaId: "P12", skills: { ataque: "Reação em Cadeia", suporte: "Síntese Rápida", passiva: "Fórmula Secreta" }, bonus: { matk: 25, atk: 15, crit: 0.06 } },
  { id: "R14", name: "Guardião dos Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S5", passivaId: "P8", skills: { ataque: "Dívida Temporal", suporte: "Adiantar", passiva: "Ritmo" }, bonus: { hp: 200, mp: 120, spd: 0.06 } },
  { id: "R15", name: "Ferreiro de Mundos", tier: "NOMEADA", ataqueId: "A9", suporteId: "S11", passivaId: "P12", skills: { ataque: "Martelo Primordial", suporte: "Forja Rápida", passiva: "Mestre Artesão" }, bonus: { atk: 35, arm: 35, hp: 200 } },
  { id: "R16", name: "Construtor Instável", tier: "NOMEADA", ataqueId: "A1", suporteId: "S9", passivaId: "P7", skills: { ataque: "Detonação Programada", suporte: "Reconfigurar", passiva: "Caos Controlado" }, bonus: { atk: 25, matk: 20, crit: 0.06 } },
  { id: "R17", name: "Sombra da Dúvida", tier: "NOMEADA", ataqueId: "A13", suporteId: "S4", passivaId: "P6", skills: { ataque: "Facada nas Costas", suporte: "Desaparecer", passiva: "Névoa Pessoal" }, bonus: { dge: 0.12, crit: 0.10, atk: 20 } },
  { id: "R18", name: "Desertor", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P8", skills: { ataque: "Golpe de Fuga", suporte: "Rota de Fuga", passiva: "Instinto" }, bonus: { spd: 0.18, dge: 0.06 } },
  { id: "R19", name: "Bibliotecário Vivo", tier: "NOMEADA", ataqueId: "A14", suporteId: "S6", passivaId: "P9", skills: { ataque: "Palavra de Poder", suporte: "Reescrever", passiva: "Arquivo Vivo" }, bonus: { mp: 180, matk: 25, crit: 0.06 } },
  { id: "R20", name: "Vidente dos Ciclos", tier: "NOMEADA", ataqueId: "A10", suporteId: "S5", passivaId: "P8", skills: { ataque: "Premonição", suporte: "Prever", passiva: "Clarividência" }, bonus: { spd: 0.12, crit: 0.10, hit: 0.12 } },
  { id: "R21", name: "Mãe da Floresta", tier: "NOMEADA", ataqueId: "A7", suporteId: "S2", passivaId: "P1", skills: { ataque: "Raízes Estranguladoras", suporte: "Regeneração Coletiva", passiva: "Berço Vivo" }, bonus: { hp: 500, def: 20, matk: 15 } },
  { id: "R22", name: "Portador do Vínculo", tier: "NOMEADA", ataqueId: "A3", suporteId: "S11", passivaId: "P5", skills: { ataque: "Chama Compartilhada", suporte: "Renascimento", passiva: "Chama da Amizade" }, bonus: { hp: 250, atk: 25, matk: 20 } },
  { id: "R23", name: "Vendaval", tier: "NOMEADA", ataqueId: "A2", suporteId: "S8", passivaId: "P4", skills: { ataque: "Tempestade de Lâminas", suporte: "Corrente de Ar", passiva: "Imprevisível" }, bonus: { spd: 0.18, dge: 0.10 } },
  { id: "R24", name: "Mutante Veloz", tier: "NOMEADA", ataqueId: "A11", suporteId: "S9", passivaId: "P9", skills: { ataque: "Investida Mutante", suporte: "Adaptação Rápida", passiva: "Evolução em Combate" }, bonus: { atk: 25, spd: 0.12, crit: 0.06 } },
  { id: "R25", name: "Forjador de Relíquias", tier: "NOMEADA", ataqueId: "A4", suporteId: "S12", passivaId: "P12", skills: { ataque: "Arma Forjada", suporte: "Encantar", passiva: "Mãos de Ouro" }, bonus: { atk: 30, arm: 25, hp: 200 } },
  { id: "R26", name: "Jardineiro Arcano", tier: "NOMEADA", ataqueId: "A7", suporteId: "S12", passivaId: "P2", skills: { ataque: "Pólen Explosivo", suporte: "Cultivar", passiva: "Colheita" }, bonus: { hp: 300, def: 25, matk: 20 } },
  { id: "R27", name: "Guardião da Memória", tier: "NOMEADA", ataqueId: "A12", suporteId: "S6", passivaId: "P11", skills: { ataque: "Eco Temporal", suporte: "Rebobinar", passiva: "Memória Perfeita" }, bonus: { mp: 120, matk: 25, crit: 0.06 } },
  { id: "R28", name: "Ceifador de Ciclos", tier: "NOMEADA", ataqueId: "A12", suporteId: "S4", passivaId: "P3", skills: { ataque: "Golpe Final", suporte: "Encerrar", passiva: "Fim Inevitável" }, bonus: { atk: 35, crit: 0.10, resMagico: 0.06 } },
  { id: "R29", name: "Crepúsculo Eterno", tier: "NOMEADA", ataqueId: "A15", suporteId: "S3", passivaId: "P5", skills: { ataque: "Eclipse", suporte: "Equilíbrio", passiva: "Ciclo Perfeito" }, bonus: { hp: 250, atk: 20, matk: 20, crit: 0.06 } },
  { id: "R30", name: "Evolucionista", tier: "NOMEADA", ataqueId: "A11", suporteId: "S1", passivaId: "P11", skills: { ataque: "Mutação Ofensiva", suporte: "Regeneração Adaptativa", passiva: "Seleção Natural" }, bonus: { hp: 300, atk: 20, matk: 20 } },
  { id: "R31", name: "Guardião da Terra", tier: "NOMEADA", ataqueId: "A4", suporteId: "S3", passivaId: "P2", skills: { ataque: "Terremoto", suporte: "Cura da Rocha", passiva: "Raízes Profundas" }, bonus: { hp: 350, arm: 35, def: 20 } },
  { id: "R32", name: "Investigador Herege", tier: "NOMEADA", ataqueId: "A8", suporteId: "S13", passivaId: "P10", skills: { ataque: "Pergunta Certa", suporte: "Interrogar", passiva: "Dúvida Metódica" }, bonus: { crit: 0.12, hit: 0.10, atk: 20 } },
  { id: "R33", name: "Inventor Caótico", tier: "NOMEADA", ataqueId: "A1", suporteId: "S13", passivaId: "P9", skills: { ataque: "Gambiarra", suporte: "Improvisar", passiva: "Sorte do Caos" }, bonus: { atk: 20, crit: 0.10, spd: 0.06 } },
];

// ═══════════════════════════════════════════════════════════════
// TÍTULOS DOS SUPORTES (13) — geram o primeiro pedaço do sobrenome
// ═══════════════════════════════════════════════════════════════
export const SUPPORT_TITLES: Record<string, string> = {
  S1: "do Vigor", S2: "do Vínculo", S3: "da Aurora",
  S4: "do Véu", S5: "do Ritmo", S6: "da Revelação",
  S7: "do Baluarte", S8: "do Passo", S9: "da Adaptação",
  S10: "do Cálculo", S11: "do Equilíbrio", S12: "da Fusão",
  S13: "da Predação",
};

// ═══════════════════════════════════════════════════════════════
// SUFIXOS DAS PASSIVAS (12) — geram o segundo pedaço do sobrenome
// ═══════════════════════════════════════════════════════════════
export const PASSIVE_SUFFIXES: Record<string, string> = {
  P1: "Eterna", P2: "de Granito", P3: "Elemental",
  P4: "Veloz", P5: "Sagrada", P6: "Nebulosa",
  P7: "Furiosa", P8: "Acelerada", P9: "Cruel",
  P10: "Erudita", P11: "Rara", P12: "Áurea",
};

// ═══════════════════════════════════════════════════════════════
// GERADOR DE NOME PROCEDURAL
// Ex: "Presa de Lobo-Feral do Vigor Eterno"
// ═══════════════════════════════════════════════════════════════
const ATAQUE_NOMES_CURTOS: Record<string, string> = {
  A1: "Presa de Lobo", A2: "Ferrão de Vespa", A3: "Chama de Espectro",
  A4: "Garra de Urso", A5: "Peçonha de Serpente", A6: "Lâmina de Bandido",
  A7: "Espinho de Planta", A8: "Mandíbula de Hiena", A9: "Núcleo de Golem",
  A10: "Pena de Falcão", A11: "Cristal de Gelo", A12: "Tentáculo Abissal",
  A13: "Fragmento de Tempestade", A14: "Presa de Verme", A15: "Fragmento de Asterion",
};

export function generateRaceName(ataqueId: string, suporteId: string, passivaId: string): string {
  const atk = ATAQUE_NOMES_CURTOS[ataqueId] || "Raça";
  const title = SUPPORT_TITLES[suporteId] || "do Vazio";
  const suffix = PASSIVE_SUFFIXES[passivaId] || "Eterna";
  return `${atk} ${title} ${suffix}`;
}

export function generateRaceId(ataqueId: string, suporteId: string, passivaId: string): string {
  return `RC-${ataqueId}-${suporteId}-${passivaId}`;
}

// ═══════════════════════════════════════════════════════════════
// LORE DAS 33 RAÇAS NOMEADAS
// ═══════════════════════════════════════════════════════════════
export const RACE_LORE: Record<string, string> = {
  R01: "Aster foi a primeira a despertar. Cada portador carrega o eco daquele primeiro amanhecer.",
  R02: "Nocthar não é o mal — é o descanso que precede um novo começo.",
  R03: "Kaelor ensina que toda forma é apenas um instante congelado entre duas mudanças.",
  R04: "Veyra guarda cada vida já vivida. Os arquivistas aprendem a ler o que o mundo lembra.",
  R05: "Dhor é o osso do mundo. Seus filhos esculpem montanhas.",
  R06: "Lyss é a respiração de todas as florestas. Seus seguidores curam com as mãos abertas.",
  R07: "Raan é a escolha de dar o próximo passo. Nada é mais sagrado que o movimento.",
  R08: "Prime é a estrutura invisível por trás de todo caos. Seus discípulos constroem o que permanece.",
  R09: "Voro sussurra: 'e se houver outro caminho?'. Sem dúvida, o universo seria perfeito — e imóvel.",
  R10: "Loghis conecta cada fragmento de conhecimento. Os sábios veem o padrão antes de ver as partes.",
  R11: "Emohna une o que a distância separa. Todo vínculo verdadeiro é uma magia.",
  R12: "O horizonte nunca foi o limite — sempre foi o convite.",
  R13: "Synthes transforma duas coisas em uma terceira. É a arte de criar o que ainda não existe.",
  R14: "Chronos não é o tempo — é o que continua. As estações retornam porque Chronos existe.",
  R15: "Onde Prime e Dhor se encontram, nascem as forjas que aquecem o mundo.",
  R16: "Criar exige destruir. Kaelor e Prime dançam juntos — e o resultado é sempre inesperado.",
  R17: "Voro ensina a perguntar. Nocthar ensina a ouvir a resposta na escuridão.",
  R18: "Nem toda fuga é covardia. Raan sabe quando o movimento é a única sobrevivência.",
  R19: "Cada livro é uma memória que ganhou voz. Você é o arquivo que respira.",
  R20: "O sábio não prevê o futuro — reconhece padrões que se repetem desde o Primeiro Canto.",
  R21: "Emohna e Lyss se encontram no milagre de uma semente que decide crescer.",
  R22: "Aster criou a luz. Emohna a manteve acesa entre dois corações.",
  R23: "Raan dá a direção. Nyr dá a força. Juntos, são a tempestade que escolhe seu caminho.",
  R24: "Kaelor exige mudança. Raan exige movimento. Juntos, não param jamais.",
  R25: "Synthes e Dhor criam o que sobrevive ao tempo — as relíquias que contam história.",
  R26: "Cada planta é uma magia em câmera lenta. Synthes e Lyss cuidam dela.",
  R27: "Chronos garante a continuidade. Veyra garante que nada se perca no caminho.",
  R28: "Chronos encerra. Nocthar abraça o fim. Juntos, são a morte serena que liberta.",
  R29: "Aster e Nocthar — dois nomes para o mesmo ciclo. A luz que se despede é a promessa do amanhã.",
  R30: "Kaelor exige mudança. Lyss exige vida. A evolução é apenas a resposta da vida à mudança.",
  R31: "Dhor é a montanha. Lyss é a semente. A força real é permitir que algo cresça mesmo sob pedra.",
  R32: "Veyra guarda o passado. Voro duvida dele. O investigador é quem ousa perguntar o que todos aceitaram.",
  R33: "Synthes quer criar. Voro quer duvidar. O resultado é uma invenção que ninguém pediu — e que o mundo precisava.",
};

export function findNamedRace(ataqueId: string, suporteId: string, passivaId: string): Race | null {
  return NAMED_RACES.find((r) => r.ataqueId === ataqueId && r.suporteId === suporteId && r.passivaId === passivaId) ?? null;
}

// ═══════════════════════════════════════════════════════════════
// ESTATÍSTICAS DA MATRIZ
// ═══════════════════════════════════════════════════════════════
export const MATRIX_STATS = {
  totalAtaques: 15,
  totalSuportes: 13,
  totalPassivas: 12,
  totalCombinacoes: 15 * 13 * 12, // 2.340
  totalNomeadas: 33,
  totalSobrenomes: 13 * 12, // 156
};