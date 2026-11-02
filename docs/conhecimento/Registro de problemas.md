---
projeto: Mythreon Online
tipo: log
status: ativo
atualizado: 2026-11-02
resumo: Problemas de documentação, sincronização e continuidade com suas evidências.
---

# Registro de problemas

| ID | Problema e evidência | Correção/estado | Próximo passo |
|---|---|---|---|
| P-001 | Captura do usuário: EBUSY ao abrir release/win-unpacked/electron.exe; observador encerrou com promise rejeitada. Captura usa índice antigo de 22 tópicos; execução manteve regras antigas na memória. | Correção implementada: filtro central ignora release/binários, coleta tolerante a falhas, escritas por substituição, status de sincronização, nova tentativa e supervisor que recarrega scripts. | Rodar testes de exclusão, falha de leitura e observação real; fechar a janela antiga uma vez. |
| P-002 | Grafo gerado conectava todos os tópicos entre si; cópia do Cérebro coexistia com original e podia confundir links/edição. | Correção implementada: fonte autoral única, cópia antiga arquivada, catálogo aponta para notas originais e conexões técnicas usam dependências reais. | Conferir a entrada Comece aqui e os filtros no Obsidian após reabrir o gráfico. |
| P-003 | Erros globais TypeScript e avisos da cadeia de build registrados na entrega Windows. | Aberto; a compilação web passou, mas isso não equivale a checagem de tipos limpa. | Tratar em tarefa de qualidade do jogo sem confundir com a falha do Cérebro. |

Os estados “correção implementada” não significam validação completa do Obsidian aberto pelo usuário. Resultados de testes são acrescentados abaixo após execução.

[[docs/conhecimento/Operacao do Cerebro e Obsidian|Operação e recuperação]] · [[docs/conhecimento/00 - Fonte de conhecimento|Índice]]

## Verificação da correção — 2026-11-02

P-001: npm run brain:check passou, incluindo falha EBUSY simulada de leitura com preservação do índice, exclusão de release e observação real com recarga. P-002: migração reversível testada preservou corpo da nota autoral e cópia antiga; catálogo aponta para originais. Ajustes de filtro foram gravados com backup da configuração anterior; a aparência no Obsidian precisa recarregar o gráfico aberto. Nenhum teste altera gameplay ou saves.

## 2026-11-02 — Espaço para compactar Windows

7zip falhou por falta de espaço no disco C: ao gerar o portátil da revisão Jornada. Build web, aplicativo win-unpacked e execução nativa passaram. Removida somente a extração antiga em node_modules/.cache/portable-temp (cache de teste, aproximadamente 250 MB) e o .7z incompleto criado pela compilação. A segunda tentativa ainda não tinha espaço para atualizar o arquivo compactado. Não foram apagados arquivos pessoais nem o portátil anterior. Pendente: liberar espaço adicional para uma nova compactação. Usar release/win-unpacked/Mythreon Online.exe enquanto isso.
