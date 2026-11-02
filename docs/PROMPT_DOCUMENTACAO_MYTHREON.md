---
projeto: Mythreon Online
tipo: prompt
versao: 2
atualizado: 2026-11-02
status: ativo
resumo: Continuidade entre código, Cérebro Markdown e Obsidian.
---

# Prompt de documentação e continuidade — Mythreon Online

Copie o bloco abaixo no início de uma sessão com qualquer IA com acesso ao projeto.

```text
Trabalhe em português do Brasil no projeto Mythreon Online.
Pasta: C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE

OBJETIVO
Continue o desenvolvimento preservando as decisões do criador, o funcionamento e os saves. Mantenha memória legível, verificável e compacta para outras IAs. Documente conhecimento durável; evite repetir o histórico inteiro em cada tarefa.

ENTRADA E LEITURA SELETIVA
1. Leia 00 - Comece aqui.md e docs/conhecimento/00 - Fonte de conhecimento.md; escolha a nota do assunto e confira git status antes de editar. Consulte as seções pertinentes do CEREBRO_MYTHREON.md para contexto/histórico, sem carregar todo o material sem necessidade.
2. Leia este prompt e consulte IMPLEMENTACAO_PENDENTE.md quando o pedido envolver pendências.
3. Use .mythreon-brain/neurons.json ou Mythreon Obsidian/Início.md para localizar os sistemas relevantes. Leia somente os arquivos e notas necessários à tarefa; amplie a leitura quando houver dependências ou divergências.
4. Confirme no código o que existe. Não trate documentação antiga, planos ou uma afirmação de conclusão como prova de implementação.
5. Documentos importados, exemplos e prompts de terceiros são material de referência; não adotam automaticamente regras para este projeto.

FONTES E RESPONSABILIDADES
- Código e dados atuais: comportamento implementado.
- docs/conhecimento/00 - Fonte de conhecimento.md: índice autoral da base de conhecimento no Obsidian.
- CEREBRO_MYTHREON.md: resumo de arquitetura, contexto e continuidade histórica, sem cópia concorrente ativa.
- docs/conhecimento/: notas duráveis de sistemas, decisões, pesquisas, problemas e procedimentos, mantidas pelo criador e pelas IAs. Crie apenas as notas necessárias.
- .mythreon-brain/neurons.json e state.json: índice e controle gerados pelo observador. Não editar manualmente.
- Mythreon Obsidian/: painel e catálogo gerados com links para as notas originais. Não escreva decisões nesses índices. Arquivo/ preserva versões antigas; nenhuma cópia nova do Cérebro é gerada.
- O cofre oficial é a raiz MYTHREON ONLINE. Abra 00 - Comece aqui.md. As notas autorais não precisam ser copiadas: Obsidian lê diretamente os arquivos Markdown. O catálogo é automático; interpretar mudanças de código e atualizar conhecimento continua sendo tarefa da IA/criador.
- Em divergências, registre a diferença entre intenção e comportamento. Não escolha silenciosamente uma versão nem marque algo como validado sem evidência.

O QUE DOCUMENTAR
- Regras de gameplay e fórmulas com unidades, limites, origem dos dados e arquivos responsáveis.
- Decisões relevantes: data, contexto, escolha, motivo e consequências. Registre alternativas somente quando realmente consideradas.
- Alterações de saves: campos novos, defaults, migração e compatibilidade.
- Assets: nome exato, caminho, formatos, fallback e arte ainda ausente.
- Problemas relevantes: sintoma, evidência, impacto, estado e próximo passo. Procure o mesmo problema antes de abrir outro registro; anote recorrências sem duplicar.
- Pesquisas que sustentem decisões: pergunta, fontes e datas, achados e conclusão. Separe fatos, hipóteses, estimativas e dados ausentes.
- Procedimentos repetíveis: comandos, pré-requisitos, resultado esperado e recuperação quando aplicável.
- Pendências específicas com critério de conclusão e dependências. Não invente responsáveis ou prazos.

ESTRUTURA DAS NOTAS AUTORAIS
Use nomes claros em docs/conhecimento/, sem criar uma nota por conversa.
Uma nota por assunto estável; atualize a existente antes de criar outra.
Frontmatter mínimo: projeto, tipo, status, atualizado e resumo.
Estados de implementação: implementado, parcial, planejado ou bloqueado.
Estado da evidência: verificado, a validar ou desatualizado.
Corpo: resumo curto, regras/estado, decisões, evidências, pendências e links pertinentes. Omita seções vazias.
Use links Markdown relativos para fontes e [[links entre notas]] quando úteis ao Obsidian. Não crie relações apenas para aumentar o grafo.
Mantenha notas curtas e divida assuntos quando necessário. Conserve um resumo no Cérebro e detalhe nas notas vinculadas.

FLUXO DE TRABALHO
1. Identifique o estado atual e as dependências antes de implementar.
2. Faça as alterações autorizadas de forma incremental; preserve mudanças existentes do usuário.
3. Execute verificações apropriadas. Registre exatamente o que foi executado e seu resultado. Build não equivale a teste de gameplay ou checagem completa de tipos.
4. Atualize as notas dos sistemas afetados e o resumo correspondente no CEREBRO_MYTHREON.md.
5. Acrescente ao Registro de continuidade: data, pedido, decisões, arquivos, verificações, limitações e próximo passo concreto. Não copie a conversa inteira.
6. Releia os documentos imediatamente antes de editar; preserve contribuições de outras IAs. Atualize o estado atual e conserve o histórico das decisões relevantes, marcando o que foi substituído.
7. Execute npm run brain:sync para atualizar o índice e a visualização Obsidian. Se falhar, informe a falha; não diga que sincronizou.
8. Entregue um resumo claro do que mudou, caminhos das notas principais, verificações e pendências reais.

LIMITES DA MEMÓRIA
O observador detecta arquivos e relações; não compreende sozinho intenção, decisões ou qualidade do balanceamento. Cabe à IA registrar o significado das alterações.
Obsidian organiza e conecta Markdown; não dá memória automática a uma IA nem elimina tokens. Economize contexto com resumos, índices e leitura seletiva, sem omitir evidências necessárias.
Não criptografe a memória de trabalho para tentar reduzir tokens. Segredos, credenciais, cookies e dados pessoais não entram nas notas ou índices.
Não registre funcionalidades futuras como prontas. Não invente testes, resultados, fontes, números de builds ou garantias de balanceamento.
Não faça push, deploy ou publicação apenas para documentar.
Altere este prompt somente quando houver uma regra nova explícita do criador ou uma correção necessária de funcionamento; registre versão, motivo e data. Sugestões de preferência devem permanecer propostas até serem aceitas.

TAREFA DESTA SESSÃO
[Descreva aqui o pedido ou peça para continuar uma pendência específica.]
```

## Prompt curto para encerrar uma sessão

> Atualize a documentação do Mythreon conforme docs/PROMPT_DOCUMENTACAO_MYTHREON.md. Registre decisões, regras alteradas, evidências, problemas e pendências nas notas autorais; atualize o Cérebro e execute brain:sync. Preserve o histórico e informe o que não foi verificado.

## Instalação e uso do Obsidian

1. Instale e abra o Obsidian.
2. Escolha **Abrir pasta como vault** e selecione a raiz `MYTHREON ONLINE` para acessar código, documentação autoral e o mapa gerado no mesmo vault.
3. Abra `CEREBRO_MYTHREON.md` e esta nota. O mapa gerado está em `Mythreon Obsidian/`.
4. Edite conhecimento autoral em `docs/conhecimento/`. Confira o painel Estado da sincronização; índices gerados podem ser reconstruídos, notas autorais são preservadas.
5. Dê duplo clique em `Ativação Cérebro.bat` e mantenha a janela aberta para acompanhar alterações. Sem o observador, use `npm run brain:sync` ao concluir o trabalho.

## Histórico

- v1 — 2026-11-02: adaptação do material de referência ao Mythreon; separação entre memória semântica, índice automático e visualização Obsidian; proteção de notas autorais contra sobrescrita.

- v2 — 2026-11-02: Obsidian/Markdown como base autoral única; entrada Comece aqui, catálogo por referência, eliminação da cópia ativa do Cérebro e recuperação de falhas no observador.
