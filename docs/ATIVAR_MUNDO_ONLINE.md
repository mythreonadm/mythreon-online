# Ativar contas e o mundo online de Mythreon

O código já foi publicado na Vercel, com a inicialização da API corrigida em 9f4285b. O projeto Supabase real mythreon-online já foi criado na região sa-east-1 e as migrações online foram aplicadas. A Vercel já recebeu as URLs/chaves públicas e WORLD_ALLOWED_ORIGINS. Ainda falta apenas a conexão privada DATABASE_URL, o SMTP e uma nova implantação para o mundo responder a comandos.

## 1. Preserve o progresso anterior

No jogo local, o cabeçalho agora tem **Baixar backup**. Entre na conta local e guarde o JSON antes de ativar o mundo online.

Os saves locais continuam no navegador e não são apagados. Contas antigas locais não eram cadastros no servidor. A senha antiga não é enviada nem importada para o Supabase. A conta online é um novo cadastro com e-mail confirmado; cada conta pode ter até três personagens.

Nesta versão, o mundo online inicia uma economia oficial separada. Importar diretamente gold/itens de um JSON editável permitiria duplicações. Não há migração automática de personagens locais para ranking/trocas: uma migração de veteranos precisa de validação administrativa e de um fluxo próprio. O backup não é perdido e não deve ser apagado para resolver conflitos.

## 2. Projeto Supabase

O projeto criado é mythreon-online, ref ezjtbyouxnxleaapkrxv, na região sa-east-1. Guarde a senha do banco em local privado.

No painel, obtenha:

- Project URL, semelhante a https://seu-projeto.supabase.co.
- Chave pública publishable ou anon. Nunca use secret/service_role no aplicativo.
- Em Connect, URI do Transaction pooler, normalmente na porta 6543. Ela contém a senha do banco e ficará SOMENTE no servidor/Vercel.

Não é necessário fornecer uma chave service_role para esta implementação: o servidor usa a conexão privada do Postgres e verifica a sessão no Supabase Auth.

## 3. Tabelas e políticas aplicadas

No SQL Editor do seu projeto, execute nesta ordem os arquivos da pasta do jogo:

1. supabase/migrations/001_online_world.sql
2. supabase/migrations/002_realtime.sql
3. supabase/migrations/003_trade_audit.sql

As duas primeiras migrações criam contas, personagens, ranking, mensagens, amigos, correio e trocas. A terceira cria a auditoria de trocas e a view de estatísticas. As políticas RLS restringem leituras privadas. O navegador não recebe permissão para escrever gold, inventário, mensagens ou ranking diretamente nas tabelas; operações passam pela API autenticada.

A segunda migração ativa as notificações Realtime das quatro tabelas sociais. Não execute estes arquivos em um banco de outro projeto.

## 4. Configure autenticação e e-mails

Mantenha o provedor Email ativo e a confirmação de e-mail habilitada.

Defina o Site URL de autenticação para https://mythreon-online.vercel.app e permita os endereços de retorno desse site. Para testar localmente, adicione http://localhost:5173 e o endereço local efetivamente utilizado. Redefinição de senha e confirmação devem retornar ao site HTTPS; o jogo reconhece a recuperação e apresenta a nova senha.

Para cadastro público, configure um provedor SMTP próprio no Supabase. O remetente padrão é destinado a testes, envia apenas para membros da organização e tem limite muito baixo; não serve como envio público de confirmação/recuperação. Referência oficial: https://supabase.com/docs/guides/auth/auth-smtp . Não desative a confirmação para contornar falhas de SMTP: a API exige e-mail confirmado.

## 5. Configure as variáveis na Vercel

No projeto existente Mythreon, abra Settings → Environment Variables. Cadastre os nomes abaixo com os seus valores reais:

| Variável | Conteúdo | Pode entrar no aplicativo? |
|---|---|---|
| VITE_SUPABASE_URL | URL do projeto | Sim |
| VITE_SUPABASE_ANON_KEY | Chave pública publishable/anon | Sim |
| VITE_WORLD_API_URL | /api/world para a versão web | Sim |
| SUPABASE_URL | Mesma URL do projeto, para a API | Servidor |
| SUPABASE_ANON_KEY | Mesma chave pública, para a API | Servidor |
| DATABASE_URL | URI privada do transaction pooler com senha | NÃO |
| WORLD_ALLOWED_ORIGINS | https://mythreon-online.vercel.app,mythreon://game | Servidor |

Acrescente às origens permitidas o domínio de preview que realmente estiver usando. Não use '*' para liberar qualquer domínio.

Se a conexão TLS exigir uma autoridade certificadora específica, configure DATABASE_SSL_CA no servidor com o certificado oficial fornecido pelo seu projeto. A implementação valida certificados; não desabilite essa validação para resolver um erro de conexão.

O arquivo .env.example da raiz mostra os nomes e exemplos fictícios. Para desenvolvimento local, copie-o para .env e preencha no seu próprio computador. .env é ignorado pelo Git e pelo Cérebro. Nunca dê prefixo VITE_ a uma senha de banco, chave secreta ou credencial administrativa. A compilação recusa chave service_role/secret no campo público.

## 6. Valide antes de publicar

Na pasta do projeto:

    npm run typecheck
    npm run online:check
    npm run online:doctor

online:check utiliza PostgreSQL local em memória e dados fictícios. online:doctor tenta a conexão real configurada em .env e verifica as nove tabelas e RLS, sem mostrar segredos.

Para desenvolver com a API local, use duas janelas:

    npm run online:dev

    npm run dev

O Vite encaminha /api/world para a API local na porta 8787. Cadastro e banco continuam usando seu projeto Supabase real. Não abra essas portas publicamente como substituto da hospedagem.

Para a versão web:

    npm run build

O projeto inclui api/world.js para a Vercel, e vercel.json preserva a rota /api/world. Fazer build local não publica nada; faça seu git push/deploy somente depois de conferir esta configuração. As variáveis VITE_ são incorporadas na compilação: alterá-las exige uma nova build.

## 7. Confira em dois aparelhos

Após publicar e configurar o projeto:

1. Cadastre um e-mail, confirme o link e crie um personagem.
2. Entre com a MESMA conta no celular e no PC. Escolha o mesmo personagem e confirme nível, gold e inventário.
3. Crie uma segunda conta para testar chat global e mensagem privada.
4. Adicione à VIP, aceite o convite e confira a presença online.
5. Conclua a iniciação e alcance nível 5 para testar transferências.
6. Envie um correio com gold e um stack parcial. Receba uma vez; confirme o destino dos itens no depósito.
7. Inicie troca com os dois online. Faça ofertas, dê um OK, altere a oferta e confira que os dois OKs foram apagados. Confirme de novo dos dois lados.
8. Cancele outra troca e confira o retorno integral das reservas. Desconecte durante uma ação e confira a recuperação sem duplicação.
9. Teste confirmação e redefinição de senha com o serviço de e-mail real e verifique o Realtime hospedado.

## Windows

O navegador do PC já usa o mesmo servidor que o celular. Para o executável, compile depois de configurar:

    VITE_WORLD_API_URL=https://mythreon-online.vercel.app/api/world

Use as mesmas variáveis públicas do Supabase e execute npm run desktop:package. Mantenha a pasta win-unpacked inteira. A build grava somente origens públicas em dist/online-origins.json para permitir HTTPS/WebSocket no aplicativo sem liberar scripts externos.

Os executáveis já gerados anteriormente não contêm esta integração nova. Não foram recompilados nesta etapa sem o projeto real configurado. O portátil único anterior também continua anterior. A tentativa antiga de compactação falhou por falta de espaço; confira o espaço disponível antes de gerar um novo portátil.

## Estado atual da ativação

- Supabase real criado e saudável: ezjtbyouxnxleaapkrxv.
- As nove tabelas online existem com RLS habilitado; Realtime foi ativado para mensagens, amigos, correio e trocas.
- Vercel configurada com as variáveis públicas e origens permitidas.
- Falta cadastrar DATABASE_URL com a URI privada do Transaction Pooler. A senha do banco não é exposta pela integração e deve ser inserida diretamente na Vercel como variável criptografada.
- Falta configurar SMTP público, Site URL/Redirect URLs no Auth e publicar uma nova implantação depois de preencher DATABASE_URL.

## Limites desta entrega

- Código, regras transacionais e interfaces foram implementados/testados localmente. Não há conexão hospedada configurada nem cadastro público ativado.
- O teste visual usa o cliente oficial Supabase com Auth e Realtime simulados localmente, banco PostgreSQL e duas contas de teste; não substitui o teste final no serviço hospedado.
- Troca e correio são liberados no nível 5 depois da iniciação. Amigos/chat/ranking não exigem premium. A relíquia de iniciação é vinculada e não pode ser transferida.
- A taxa inicial de cada envio e de cada lado da troca é 10 gold + 2% do gold oferecido. Na troca, é reservada e só consumida ao concluir. Cancelar devolve gold/taxa e itens; itens retornam ao depósito.
- Uma troca expira após 30 minutos. A expiração é processada na próxima interação com a troca; se ficar reservada após desconectar, abra a troca e cancele para devolver. Não existe ainda um serviço de limpeza agendado independente.
- Anexos de correio e recebimentos de troca precisam de espaço no depósito. Reembolso de reserva nunca perde itens por falta de espaço.
- Recompensas da arena local não são aceitas na economia online. A arena precisa ter suas partidas/resultados validados no servidor antes de liberar essas recompensas; o modo local antigo é preservado.
- Antes de abrir para muitos jogadores, validar concorrência real, carga, limites/custo da hospedagem, moderação e retenção de mensagens/recibos. Não apague recibos de idempotência sem uma política de expiração que impeça replays antigos.

## Fontes oficiais consultadas

- Cadastro e sessão: https://supabase.com/docs/reference/javascript/auth-signup e https://supabase.com/docs/reference/javascript/auth-onauthstatechange
- Segurança de linhas: https://supabase.com/docs/guides/database/postgres/row-level-security
- Realtime: https://supabase.com/docs/guides/realtime/postgres-changes
- Conexão do banco: https://supabase.com/docs/guides/database/connecting-to-postgres
- E-mail público: https://supabase.com/docs/guides/auth/auth-smtp
- Vercel/Vite: https://vercel.com/docs/frameworks/frontend/vite

## Prévias em ambiente isolado

Estas imagens usam contas fictícias e serviços de teste, não jogadores de produção:

- [Ranking](anexos/online-teste-ranking.png)
- [Janela bilateral de troca](anexos/online-teste-troca.png)

## Empacotamento da API

A entrada publicada é api/world.js; a fonte editável é server/http.ts. O comando npm run build gera server/generated/online-runtime.cjs antes da build web, para evitar imports TypeScript sem extensão no Node da Vercel. Rode npm run online:bundle-check e node scripts/online-runtime-check.mjs antes de publicar alterações no servidor.
