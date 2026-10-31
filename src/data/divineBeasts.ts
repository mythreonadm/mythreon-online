import { DivineBeastId, DivineBeastTemplate } from "../types";

// Ecos vivos do Primeiro Canto. Cada guardião responde à ressonância de sua região.
// A chance é aplicada somente ao chefe regional e a criatura só pode ser obtida uma vez.
export const DIVINE_BEASTS: Record<DivineBeastId, DivineBeastTemplate> = {
  LYSS_STAG: {
    id: "LYSS_STAG", name: "Elarion", title: "Cervo das Raízes Luminosas", region: "Bosque de Lyss",
    bossId: "ESPECTRO", rarity: "RARO", emoji: "🦌", sprite: "/assets/pets/divine-beast-lyss.png",
    lore: "Quando a primeira floresta sentiu a ruptura da Essência, um cervo permaneceu entre as raízes. Lyss guardou sua lembrança e a fez renascer como um eco vivo do Primeiro Canto.",
    bond: "Elarion acompanha quem protege a vida mesmo quando a floresta está ferida.",
    bonus: { hp: 35, dge: 0.01 }, dropChance: 0.12,
  },
  DHOR_GRIFFIN: {
    id: "DHOR_GRIFFIN", name: "Kharad", title: "Grifo da Coroa de Basalto", region: "Pico de Dhor",
    bossId: "COLOSSO", rarity: "RARO", emoji: "🦅", sprite: "/assets/pets/divine-beast-dhor.png",
    lore: "Nascido no instante em que uma montanha resistiu à Grande Ruptura, Kharad carrega a memória da pedra que não cedeu. Suas asas guardam poeira de basalto e luz primordial.",
    bond: "Kharad responde à firmeza: ele protege quem permanece de pé diante da adversidade.",
    bonus: { arm: 4, def: 2 }, dropChance: 0.12,
  },
  AZHAR_SERPENT: {
    id: "AZHAR_SERPENT", name: "Nerith", title: "Serpe das Marés de Nacre", region: "Mar de Azhar",
    bossId: "LEVIATA", rarity: "EPICO", emoji: "🐉", sprite: "/assets/pets/divine-beast-azhar.png",
    lore: "Nerith surgiu onde a maré tocou uma veia primordial. Seu corpo guarda o ritmo de Azhar: recuar, lembrar e voltar com a força de um oceano inteiro.",
    bond: "Nerith segue quem aprende a mudar de caminho sem abandonar o próprio propósito.",
    bonus: { mp: 35, resMagico: 0.02 }, dropChance: 0.12,
  },
  ASTERION_OWL: {
    id: "ASTERION_OWL", name: "Orivane", title: "Coruja dos Arquivos Celestes", region: "Ruínas de Asterion",
    bossId: "GUARDIAO", rarity: "EPICO", emoji: "🦉", sprite: "/assets/pets/divine-beast-asterion.png",
    lore: "As ruínas registraram cada voz que se perdeu na queda. Orivane nasceu dessa memória: uma testemunha alada que nunca esquece um nome, uma promessa ou uma batalha.",
    bond: "Orivane escolhe quem observa antes de agir e honra aquilo que aprendeu.",
    bonus: { hit: 0.02, crit: 0.01 }, dropChance: 0.12,
  },
  VOID_FOX: {
    id: "VOID_FOX", name: "Vesper", title: "Raposa do Limiar Silencioso", region: "Cicatriz Profunda",
    bossId: "DEVORADOR", rarity: "LENDARIO", emoji: "🦊", sprite: "/assets/pets/divine-beast-void.png",
    lore: "Na Cicatriz, até a memória parece se desfazer. Vesper nasceu do último fio de Essência que se recusou a desaparecer e aprendeu a caminhar entre o que o mundo lembra e o que teme esquecer.",
    bond: "Vesper se aproxima de quem atravessa a escuridão sem permitir que ela decida quem essa pessoa será.",
    bonus: { atk: 6, dge: 0.02 }, dropChance: 0.12,
  },
  ASTER_PHOENIX: {
    id: "ASTER_PHOENIX", name: "Solenne", title: "Fênix da Primeira Luz", region: "Ecos de Aster",
    bossId: "ESPECTRO", rarity: "EPICO", emoji: "🐦‍🔥", sprite: "/assets/pets/divine-beast-aster.png",
    lore: "Solenne não é Aster, mas um eco de tudo que começa. Sua chama nasceu na primeira alvorada após a Ruptura e reacende a esperança nos lugares esquecidos.",
    bond: "Solenne acompanha quem encontra um começo mesmo depois de uma grande perda.",
    bonus: { hp: 20, crit: 0.01 }, dropChance: 0.12,
  },
  NOCTHAR_MOTH: {
    id: "NOCTHAR_MOTH", name: "Nhal", title: "Mariposa do Silêncio Sereno", region: "Ecos de Nocthar",
    bossId: "COLOSSO", rarity: "EPICO", emoji: "🦋", sprite: "/assets/pets/divine-beast-nocthar.png",
    lore: "As asas de Nhal guardam o instante quieto entre o fim de um ciclo e o início do próximo. Sua escuridão oferece repouso, nunca ameaça.",
    bond: "Nhal escolhe viajantes que entendem que descansar também é continuar.",
    bonus: { mp: 25, resMagico: 0.01 }, dropChance: 0.12,
  },
  KAELOR_SALAMANDER: {
    id: "KAELOR_SALAMANDER", name: "Cindervane", title: "Salamandra da Mudança", region: "Ecos de Kaelor",
    bossId: "LEVIATA", rarity: "EPICO", emoji: "🦎", sprite: "/assets/pets/divine-beast-kaelor.png",
    lore: "Cindervane muda de cor conforme a Essência ao redor se transforma. Ela sobrevive à mudança porque nunca tenta voltar a ser aquilo que já foi.",
    bond: "Cindervane se aproxima de quem aprende, se adapta e segue em frente.",
    bonus: { atk: 3, spd: 0.01 }, dropChance: 0.12,
  },
  VEYRA_TORTOISE: {
    id: "VEYRA_TORTOISE", name: "Memnora", title: "Tartaruga do Arquivo Vivo", region: "Ecos de Veyra",
    bossId: "GUARDIAO", rarity: "EPICO", emoji: "🐢", sprite: "/assets/pets/divine-beast-veyra.png",
    lore: "Cada marca no casco de Memnora é uma lembrança preservada. Ela carrega histórias sem aprisioná-las e nunca confunde memória com destino.",
    bond: "Memnora caminha com quem guarda o passado sem deixar de escolher o futuro.",
    bonus: { hp: 25, arm: 2 }, dropChance: 0.12,
  },
  DHOR_BEETLE: {
    id: "DHOR_BEETLE", name: "Orruk", title: "Besouro-Cristal da Matéria", region: "Ecos de Dhor",
    bossId: "COLOSSO", rarity: "RARO", emoji: "🪲", sprite: "/assets/pets/divine-beast-dhor-beetle.png",
    lore: "Orruk molda cristais com as patas e deixa caminhos firmes por onde passa. Seu corpo lembra que toda ideia precisa de matéria para permanecer no mundo.",
    bond: "Orruk segue quem constrói com paciência e cuida daquilo que criou.",
    bonus: { def: 3, blk: 0.01 }, dropChance: 0.12,
  },
  LYSS_MOTH: {
    id: "LYSS_MOTH", name: "Floravelle", title: "Mariposa dos Brotos de Lyss", region: "Ecos de Lyss",
    bossId: "ESPECTRO", rarity: "RARO", emoji: "🦋", sprite: "/assets/pets/divine-beast-floravelle.png",
    lore: "Floravelle surge onde a vida insiste em crescer. O pó luminoso de suas asas não cura feridas; ele desperta sementes adormecidas na Essência.",
    bond: "Floravelle escolhe quem protege o crescimento dos outros sem exigir recompensa.",
    bonus: { hp: 20, hit: 0.01 }, dropChance: 0.12,
  },
  NYR_SKY_RAY: {
    id: "NYR_SKY_RAY", name: "Aeralis", title: "Raia-Celeste das Correntes de Nyr", region: "Ecos de Nyr",
    bossId: "LEVIATA", rarity: "LENDARIO", emoji: "🪽", sprite: "/assets/pets/divine-beast-nyr.png",
    lore: "Aeralis nada pelo ar seguindo correntes que olhos mortais não veem. Para ela, distância é apenas outro nome para o próximo caminho.",
    bond: "Aeralis acompanha quem continua explorando mesmo sem conhecer o destino.",
    bonus: { spd: 0.02, dge: 0.01 }, dropChance: 0.12,
  },
};

export const DIVINE_BEAST_ORDER: DivineBeastId[] = [
  "LYSS_STAG", "DHOR_GRIFFIN", "AZHAR_SERPENT", "ASTERION_OWL", "VOID_FOX",
  "ASTER_PHOENIX", "NOCTHAR_MOTH", "KAELOR_SALAMANDER", "VEYRA_TORTOISE", "DHOR_BEETLE", "LYSS_MOTH", "NYR_SKY_RAY",
];
