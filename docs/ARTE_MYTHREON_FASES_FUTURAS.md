---
projeto: Mythreon Online
tipo: guia-de-arte
status: pronto para produção manual
---

# Prancha de arte — Pets, Ferreiro, Pesca, Treino e Jornal

Todas as artes devem ser pixel art 3D, fundo branco puro `#FFFFFF`, sem texto e sem moldura. Preparar em 32×32 e 64×64 para uso no jogo; a prancha pode usar células 128×128.

## Paletas oficiais

- Essência: `#071217` azul-noite, `#123D46` teal, `#36C7C0` brilho, `#D9A441` ouro, `#FFF1B0` luz.
- Biomas: `#203226` musgo, `#5C8A4A` folha, `#7AB9C2` água, `#7A4E2D` madeira, `#D8B26A` palha.
- Raridade: `#A6B0B8` comum, `#43D17B` incomum, `#4CA7FF` raro, `#B56CFF` épico, `#FFD35A` lendário, `#FF6B3D` elite.

## Itens — `public/assets/items`

### Ovos e pets

`OVO_BESTA_T1.png`, `OVO_BESTA_T2.png`, `OVO_BESTA_T3.png`, `OVO_BESTA_T4.png`, `OVO_BESTA_T5.png`, `RACAO_DOMADOR.png`, `CENOURA_PET.png`, `FRUTA_MEL.png`, `MELANCIA_LUNAR.png`, `TIGELA_ESSENCIA.png`, `CORACAO_HUMOR_PET.png`, `MEDALHA_LINHAGEM.png`.

Progressão visual dos ovos: T1 casca simples; T2 veios teal; T3 runas azuis; T4 casca roxa facetada e partículas; T5 casca dourada com núcleo teal, halo e três estrelas.

### Baús e recompensas

`BAU_TEMPO_T1.png`, `BAU_TEMPO_T2.png`, `BAU_TEMPO_T3.png`, `BAU_TEMPO_T4.png`, `BAU_TEMPO_T5.png`, `SELO_RECOMPENSA_DIARIA.png`, `COROA_30_DIAS.png`, `MOEDA_MERCADO_NEGRO.png`, `FRAGMENTO_MYTHREON_SHARD.png`.

Para o calendário: `CUPOM_RESGATE_CALENDARIO.png`, `SELO_SEQUENCIA_SEMANAL.png`, `SKIN_CAPA_PRIMEIRO_CANTO.png`. A prancha de referência está em `public/assets/ui/prancha-calendario-sequencia-skin-mes-01.png`.

### Ferreiro e economia

`MARTELO_TIER.png`, `BIGORNA_MYTHREON.png`, `CRISTAL_ALEATORIO.png`, `CRISTAL_ATRIBUTO_ESPECIFICO.png`, `SELO_ELEVACAO_TIER.png`, `BRASA_REFORJA.png`, `POEIRA_DE_AFIXO.png`.

### Pesca

`VARA_PESCA_T1.png`, `VARA_PESCA_T2.png`, `VARA_PESCA_T3.png`, `VARA_PESCA_T4.png`, `VARA_PESCA_T5.png`, `ISCA_COMUM.png`, `ISCA_RARA.png`, `PEIXE_RIO_LYSS.png`, `PEIXE_CRISTAL_DHOR.png`, `PEIXE_NACRE_AZHAR.png`, `PEIXE_SOMBRA_ASTERION.png`, `PEIXE_CICATRIZ.png`.

### Mineração

`PICARETA_T1.png`, `PICARETA_T2.png`, `PICARETA_T3.png`, `PICARETA_T4.png`, `PICARETA_T5.png`, `MINERIO_FERRO_ESTELAR.png`, `MINERIO_CRISTAL_ESSENCIA.png`, `MINERIO_OBSIDIANA_VIVA.png`, `MINERIO_GELO_SOLAR.png`, `MINERIO_VAZIO.png`.

## Interface e efeitos — `public/assets/ui`

`AURA_RARIDADE_INCOMUM.png`, `AURA_RARIDADE_RARA.png`, `AURA_RARIDADE_EPICA.png`, `AURA_RARIDADE_LENDARIA.png`, `EFEITO_HIT_COMBO_OURO.png`, `EFEITO_HIT_COMBO_PRATA.png`, `EFEITO_HIT_COMBO_BRONZE.png`, `EFEITO_PESCA_MORDIDA.png`, `EFEITO_MINERACAO_FAISCA.png`, `EFEITO_BAU_ABRINDO.png`, `MARCA_ELITE_MYTHREON.png`, `MARCA_BOSS_DIARIO.png`, `ICONE_JORNAL_MYTHREON.png`, `ICONE_CALENDARIO_ESSENCIA.png`.

## Fundos — `public/assets/backgrounds`

`pesca-corrego-lyss.png` (personagem sentado à margem, água corrente), `mineracao-galeria-mythreon.png` (galeria com veios e lanternas), `arena-boss-diario.png` (arena ampla para muitos jogadores), `jornal-redacao-mythreon.png` (mesa de escriba, pergaminhos e cristais).

## Skins — `public/assets/skins`

`SKIN_BETA_ESSENCIA.png`, `SKIN_MATRIZ_GOLEM.png`, `SKIN_MATRIZ_FALCAO.png`, `SKIN_MATRIZ_MIASMA.png`, `SKIN_PREMIUM_MES_01.png`, `ADDON_BOSS_LUMINESCENTE.png`.

Prancha complementar: `public/assets/ui/prancha-peixe-cicatriz-skin-addon.png`, contendo `PEIXE_CICATRIZ.png`, `SKIN_PREMIUM_MES_01.png` e `ADDON_BOSS_LUMINESCENTE.png` em ordem da esquerda para a direita.

Regras: sem texto dentro da arte, espaço branco de 24 px entre células, silhueta legível em 32 px e brilho sem esconder o item. O jogo mantém emoji como fallback até cada PNG existir.
