# Pack 19 — Mineração e Pesca

Data: 04/11/2026  
Escopo: primeira versão funcional de duas vocações manuais, persistentes e compatíveis com o modo online.

## Entregue

- Estado persistente `character.professions` com níveis de Mineração e Pesca.
- Três veios de mineração e três pontos de pesca, com requisitos progressivos.
- Cooldown decrescente conforme a skill, bloqueio de bolsa cheia e drops empilháveis até 999.
- Recursos iniciais: Minério de Ferro, Cristal de Essência, Minério Obsidiano, Peixe do Refúgio e Peixe-Cicatriz.
- Aba responsiva `Ofícios` com instruções e desbloqueios por skill.
- Ações online `mineResource` e `fishSpot` validadas pelo servidor e pelo mesmo fluxo idempotente de `world.command`.
- Testes de integração para coleta, cooldown e persistência.

## Ainda falta para a versão completa

1. Transformar as varas T1–T5 em itens equipáveis e validar requisitos de treino no Ferreiro.
2. Adicionar minigame de precisão com janela de clique, sons e fallback para celular.
3. Criar receitas de lingotes, iscas, sopas e elixires usando os recursos.
4. Integrar recursos com Mercado Negro, Cards, Pets e Boss Diário.
