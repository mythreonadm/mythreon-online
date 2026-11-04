---
projeto: Mythreon Online
tipo: especificacao
status: em desenvolvimento
---

# Pets, atividades e Boss Diário

## Estado implementado nesta etapa

- Ovos de Besta Divina T1–T5 com tabelas de raridade.
- Eclosão aleatória e fusão de quatro cópias com Ração Especial do Domador.
- Encontros Elite com multiplicadores de vida, ataque, recompensa e chance de ovo/ração.
- Necessidades persistidas por Besta: nutrição e humor.
- Alimentação por `CENOURA_PET`, `FRUTA_MEL`, `MELANCIA_LUNAR` e `RACAO_DOMADOR`.
- Ataque elemental da Besta com cadência alvo de 5 segundos. Nutrição zerada reduz o dano; humor baixo reduz o dano.

## Regra de design dos Pets

As Bestas Divinas são o terceiro caminho de evolução, ao lado de Matriz e Treino. Elas não devem substituir a Matriz: o jogador escolhe entre dano próprio, especialização e ressonância. A alimentação cria uma decisão de manutenção, não uma punição permanente.

| Estado | Nutrição | Humor | Efeito de combate |
|---|---:|---:|---|
| Pleno | 60–100 | 60–100 | dano integral |
| Faminto | 1–59 | qualquer | dano da Besta ×0,90 |
| Exausto | 0 | qualquer | dano da Besta ×0,65 |
| Desanimado | qualquer | 0–29 | dano da Besta ×0,75 |

## Próximas camadas

1. Baú por tempo online: contador por sessão, uma abertura por ciclo e recompensa sem duplicar itens por corrida.
2. Recompensa diária: janela UTC do servidor, sequência de dias e proteção contra voltar o relógio local.
3. Cards colecionáveis: coleção e bônus por conjunto; o bônus deve ser pequeno e auditável para não invalidar equipamentos.
4. Mineração e pesca: atividades com ferramenta, duração, stamina, tabela de recursos e resultado validado no servidor.
5. Boss Diário: inscrição, snapshot de participantes, HP escalado por participantes com teto, dano individual, janela de encerramento e distribuição por contribuição. O cliente nunca decide loot, dano ou conclusão.

## Contrato recomendado para o Boss Diário online

`daily_boss_runs`: id, janela, boss_template_id, level, hp_total, hp_remaining, status, opened_at, closes_at, resolved_at.

`daily_boss_participants`: run_id, user_id, character_id, damage, joined_at, last_action_at, claimed_at.

Operações críticas devem ser transações idempotentes: `join`, `deal_damage`, `resolve`, `claim_reward`. A recompensa mínima existe mesmo quando o Boss não morre; a recompensa de conclusão e o bônus de +5% de XP só existem quando `status = defeated`.

## Nota de escopo

O protótipo atual ainda possui núcleo local e uma camada online em evolução. Não apresentar o Boss cooperativo como pronto até existir autoridade de servidor, RLS, rate limit e testes de concorrência.

## Pack 49 — ciclos recuperáveis — 04/11/2026



A fundação online dos Packs 17/30/34 foi aprimorada: recompensas de ciclos antigos ficam acessíveis por runId, sem perder a oportunidade quando abre o próximo Boss. Inscrição sem dano não premia; o último golpe só conta HP efetivamente retirado. Bolsa/depósito cheios mantêm a recompensa pendente e a tentativa de empilhar parcialmente não duplica itens. O painel mostra pendências e cooldown. Ver [[docs/conhecimento/Pack-49-Boss-Ciclos-e-Recompensas-2026-11-04|Pack 49: regras, testes e limites]]. As janelas seguem UTC; mapa cooperativo visual, dano recebido e testes de carga ainda faltam.

## Pack 50 — arena visual — 04/11/2026

Arena com bioma, herói/Matriz, Boss, HP compartilhado, cosméticos e aliados recentes implementada. Golpes próprios aparecem após confirmação; contribuições remotas são agregadas entre leituras. Prévia visual PC/390px e teste de roster público passaram. [[docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04|Pack 50: reprodução, evidências e limites]]. Retaliação, posição controlável e transmissão de ataques individuais ainda não foram desenvolvidas.

## Pack 51 — retaliação — 04/11/2026

Boss agora reage aos ataques aceitos, com vida cooperativa privada separada da hunt, defesa/resistências, nocaute e recuperação de 30s. A reinscrição não cura. Contribuição e direito de recompensa são preservados. A arena mostra vida e retaliação confirmadas. [[docs/conhecimento/Pack-51-Retaliacao-e-Vida-Cooperativa-2026-11-04|Pack 51: fórmulas, testes e limites]]. Inscrição do próximo ciclo, defesa ativa e carga real seguem pendentes.

## Pack 53 — Mineração e Pesca — 04/11/2026

Cinco tiers de coleta e ferramentas conectados por requisitos de skill e travessia, pulso visível por segurar/soltar (toque e teclado), recarga em segundos e receitas para todos os novos recursos. Caldo usa colheita da Fazenda e alimenta o Pet ativo. Wiki/Jornal atualizados. [[docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04|Regras, testes e limites]]. Precisão continua informada pelo cliente; isca ainda não é consumida; cenas, rotas laterais e destinos adicionais no Ferreiro permanecem pendentes.

## Pack 54 — calendário e conquistas — 04/11/2026

Calendário usa dias reais, presença UTC, marcos de sete dias consecutivos, progresso mensal por presenças no mês e gold diário limitado a 8.000. Fragmentos tentam depósito quando a mochila não comporta, com rollback integral se ambos cheios. Skin é conquista permanente do personagem, incluindo recuperação de marcador legado; pode ser equipada no guarda-roupa. Artes existentes, Wiki e Jornal integrados. [[docs/conhecimento/Pack-54-Calendario-e-Conquistas-Permanentes-2026-11-04|Regras, compatibilidade, evidências e limites]]. Outros meses, skins de beta, histórico de meses e sprite humana de skin permanecem pendentes.

## Pack 57 — pulso de coleta online — 04/11/2026

Mineração/Pesca online agora preparam um desafio por personagem, com UUID, início programado, expiração e nota baseada no relógio do servidor. Comando direto com precisão foi bloqueado. A interface mantém segurar/soltar em PC/toque, cancela preparações tardias ao soltar/sair e mostra o resultado confirmado. [[docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04|Protocolo, arquivos e evidências]]. Offline mantém o desafio local. Cenas, iscas e rede/dispositivos reais seguem pendentes.

## Pack 58 — cenas e iscas — 04/11/2026

Cenas com bioma, humano/skin, ferramenta e estados reais da atividade integradas. Observar não altera hunt/personagem. Artes de mordida/faísca existentes passaram a ser usadas; preferências de vídeo respeitadas. Isca da Cicatriz opcional:1 unidade por captura confirmada,+1 peixe, consumo/entrega atômicos e sem gasto em cancelamento/falha. [[docs/conhecimento/Pack-58-Cenas-e-Iscas-de-Profissoes-2026-11-04|Arquivos, testes e limites]]. Pose sentada, cenário próprio, iscas adicionais, destinos de minério e dispositivos físicos continuam pendentes.
