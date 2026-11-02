---
projeto: Mythreon Online
tipo: moc
status: ativo
resumo: Entrada principal para pessoas e IAs no conhecimento de Mythreon.
---

# Mythreon Online — comece aqui

**Este cofre é a base de conhecimento do projeto.** As notas originais ficam em `docs/conhecimento/`; o Obsidian é a interface para consultar, escrever e conectar esse conhecimento. Os arquivos Markdown permanecem disponíveis mesmo com o observador desligado.

1. Abra [[docs/conhecimento/00 - Fonte de conhecimento|Fonte de conhecimento]] e escolha o assunto.
2. Consulte [[docs/conhecimento/01 - Estado e pendencias|Estado e pendências]] para saber o que existe e o que falta.
3. Para trabalhar com uma IA, use [[docs/PROMPT_DOCUMENTACAO_MYTHREON|Prompt de documentação]]. O [[CEREBRO_MYTHREON|Cérebro]] guarda contexto e histórico de continuidade.
4. Veja [[Mythreon Obsidian/Estado da sincronização|Estado da sincronização]] para conferir se o índice está atualizado ou se algum arquivo ficou pendente.

## Onde escrever

- **Regras, ideias, decisões e procedimentos:** edite/crie notas em `docs/conhecimento/`. Essas notas não são substituídas pelo observador.
- **Índices automáticos e mapa de arquivos:** [[Mythreon Obsidian/Início|Painel técnico]]. Essa visualização pode ser recriada e aponta para as notas originais.
- **Experimentos e prompts recebidos:** pasta `experimental/`; são referências para revisão, não regras automaticamente adotadas.

## Como manter ativo

Dê duplo clique em `Ativação Cérebro.bat` e mantenha a janela aberta. Ela inicia o observador v2, recarrega as regras quando o script muda e tenta novamente após falhas. Sem essa janela, use `npm run brain:sync` quando terminar uma tarefa.

O observador cataloga alterações e conecta arquivos. Ele não compreende sozinho por que uma regra mudou: o criador ou a IA deve registrar a decisão na nota do assunto. Mais pontos no grafo não significam mais conhecimento.

## Se aparecer um erro

Consulte [[docs/conhecimento/Operacao do Cerebro e Obsidian|Operação do Cérebro]] e [[docs/conhecimento/Registro de problemas|Registro de problemas]]. As notas originais e o código permanecem no disco; o índice pode ser reconstruído.
