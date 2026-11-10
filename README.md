# Conecseg-NR12 Control — Fase 1

Aplicação web inicial em React + TypeScript + Vite, preparada para Netlify e Supabase.

## Pré-requisitos
- Node.js 20 ou superior
- Projeto Supabase
- Conta GitHub
- Conta Netlify

## 1. Banco de dados Supabase
1. Abra o projeto Supabase.
2. Acesse SQL Editor.
3. Execute `supabase/migrations/0001_foundation.sql`.
4. Em Authentication, habilite o método Email.
5. Crie o usuário inicial em Authentication > Users.
6. Crie a organização e o vínculo do usuário em `organizations` e `organization_memberships` pelo SQL Editor. Use o UUID do usuário criado.

Exemplo administrativo (substitua os valores):
```sql
insert into public.organizations (legal_name, trade_name)
values ('Empresa Demonstrativa Ltda', 'Empresa Demonstrativa')
returning id;

-- Com o organization_id retornado e o UUID do usuário:
insert into public.organization_memberships (organization_id, user_id, role)
values ('UUID-DA-ORGANIZACAO', 'UUID-DO-USUARIO', 'owner');
```

## 2. Configuração local
```bash
npm install
cp .env.example .env
```
Preencha:
- `VITE_SUPABASE_URL`: Project URL
- `VITE_SUPABASE_ANON_KEY`: chave publicável (anon/publishable)

Nunca coloque `service_role` no frontend, GitHub ou variáveis `VITE_`.

Executar:
```bash
npm run dev
```
Build:
```bash
npm run build
```

## 3. GitHub
Crie um repositório privado chamado `conecseg-nr12-control`, envie os arquivos e mantenha `.env` fora do repositório.

## 4. Netlify
1. Add new site > Import an existing project.
2. Conecte o repositório GitHub.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Em Site configuration > Environment variables, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
6. Faça deploy.

O arquivo `netlify.toml` já contém build e redirecionamento SPA.

## Estado da Fase 1
Implementado no starter:
- Estrutura React/TypeScript e identidade visual inicial.
- Login Supabase.
- Shell de navegação.
- Dashboard inicial conectado à tabela `machines`.
- Consulta e pesquisa básica do inventário.
- Migração SQL inicial com organizações, memberships, unidades, setores, máquinas, perfis e auditoria; RLS inicial.

Ainda não implementado:
- Formulários CRUD completos para empresa/unidade/setor/máquina.
- Convite e gestão visual de usuários.
- Cadastro de organização pelo fluxo de onboarding.
- Módulos de diagnóstico, APR, plano de ação, checklists, realtime e laudos.
- Integração de IA e notificações.

## Importante
Revise as políticas RLS com o responsável técnico de segurança da informação antes de produção. O primeiro usuário/organização deve ser provisionado por procedimento administrativo protegido. Dados de demonstração não devem ser misturados com dados reais.
