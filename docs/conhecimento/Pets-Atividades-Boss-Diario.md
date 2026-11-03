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
