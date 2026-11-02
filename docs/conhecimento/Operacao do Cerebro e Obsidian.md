---
projeto: Mythreon Online
tipo: runbook
status: ativo
atualizado: 2026-11-02
resumo: Como iniciar, conferir, escrever e recuperar o conhecimento do Mythreon.
---

# Operação do Cérebro e Obsidian

## Estrutura oficial

O cofre continua sendo a raiz `MYTHREON ONLINE`, já aberta no Obsidian. Abra [[00 - Comece aqui]] para navegar.

- `docs/conhecimento/`: notas autorais preservadas, fonte de decisões e explicações.
- `CEREBRO_MYTHREON.md`: contexto, arquitetura e histórico de continuidade, com links para as notas.
- `Mythreon Obsidian/`: somente painel, catálogo e mapa técnico gerados; não há segunda cópia ativa do Cérebro.
- `Mythreon Obsidian/Arquivo/`: versões antigas preservadas na reorganização; não representam o estado atual.
- `.mythreon-brain/`: índice, estado, journal de caminhos alterados, lock e diagnóstico. Pode ser reconstruído; não é substituto das notas ou do Git.

## Iniciar

1. Feche a janela antiga do observador que aparece na captura.
2. Dê duplo clique em `Ativação Cérebro.bat`.
3. Confirme a indicação `cerebro v2`, estado `ok` e `Observando arquivos e notas`.
4. Deixe a janela aberta enquanto trabalhar. O supervisor recarrega o observador quando seus scripts mudam e reinicia se o processo falhar.
5. No Obsidian, abra [[00 - Comece aqui]]. Reabra o gráfico caso ele ainda mostre os filtros antigos.

O observador verifica eventos com pequena pausa e também faz uma conferência a cada 30 s. Fechar a janela encerra a observação; não foi instalado serviço de inicialização do Windows.

## Conferir atualização

Abra [[Mythreon Obsidian/Estado da sincronização]]. `ok` é a última sincronização concluída; não é garantia de que a janela continua aberta. `parcial` indica arquivos temporariamente indisponíveis; `erro` indica que a sincronização não terminou.

Alterações completas de caminhos ficam em `.mythreon-brain/changes.jsonl`. O JSON compacto conserva histórico recente para economizar contexto. Esse histórico técnico registra alterações observadas; não reconstrói versões intermediárias enquanto o observador estava desligado, não contém diffs de código nem o motivo das decisões. Use Git e notas autorais para isso.

As pastas release, dist, node_modules, .git, .obsidian e arquivos binários de distribuição são ignorados. Assets são catalogados por metadados sem abrir seu conteúdo. Arquivos de texto ocupados não derrubam o processo; o índice anterior é preservado quando disponível, com aviso e nova tentativa.

## Escrever conhecimento

Escreva diretamente na nota original em `docs/conhecimento/`. Use título claro, resumo, estado, regras/decisões, evidências e pendências. Relacione apenas assuntos com ligação real.

O catálogo automático inclui novas notas dessa pasta. Ele não copia nem reescreve o corpo delas. Código alterado precisa de uma IA ou pessoa para registrar o significado, conforme [[docs/PROMPT_DOCUMENTACAO_MYTHREON]].

## Recuperar

Execute `npm run brain:sync` na raiz para reconstruir os índices. Se falhar, veja o estado e o código do erro; as notas autorais não são apagadas pela sincronização. `npm run brain:watch` inicia somente o observador; o arquivo de ativação usa o supervisor.

Um observador v2 impede duplicatas por lock de PID. Locks de processos encerrados são recuperados. Se houver outro observador vivo, use a janela existente ou feche-a antes de iniciar outro. Não elimine um processo desconhecido nem um lock de processo ainda ativo.

Arquivos gerados são gravados por substituição de arquivo temporário; uma falha de escrita é registrada e tentada novamente. Índices podem ficar temporariamente atrasados. Backup/versionamento das notas continua necessário; Obsidian e OneDrive não substituem histórico de decisões e controle de versões.

## Documentação consultada

- [Como Obsidian guarda os dados](https://github.com/obsidianmd/obsidian-help/blob/master/en/Files%20and%20folders/How%20Obsidian%20stores%20data.md)
- [Filtros do gráfico](https://obsidian.md/help/Plugins/Graph%2Bview)
- [Busca por caminho](https://obsidian.md/help/Plugins/Search)

[[docs/conhecimento/00 - Fonte de conhecimento|Fonte de conhecimento]] · [[docs/conhecimento/Registro de problemas|Problemas]]

## Configuração do Obsidian

Novas notas são criadas em docs/conhecimento e anexos em docs/anexos. O gráfico padrão mostra as notas de conhecimento, a entrada e o Cérebro; assets e referências não revisadas ficam fora dessa visualização. Pastas técnicas podem continuar aparecendo no explorador de arquivos, pois não foram removidas. Configurações anteriores estão em .mythreon-brain/backups/obsidian-*.
