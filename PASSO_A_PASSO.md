# 📝 Passo a Passo - Desenvolvimento do Sistema

Este documento contém os comandos exatos e a sequência para desenvolver o sistema do zero até o deploy.

---

## 🔢 FASE 1: Configuração Inicial do Ambiente

### Passo 1.1 - Verificar pré-requisitos

```bash
# Verificar Node.js (precisa ser 18+)
node --version

# Verificar npm
npm --version

# Verificar Docker
docker --version
docker-compose --version
```

### Passo 1.2 - Configurar variáveis de ambiente

```bash
# Entrar na pasta do projeto
cd /Users/victorprecinoti/Plataformas/Thiagoplatform

# Copiar arquivo de exemplo (renomear para .env)
cp env.example .env
```

### Passo 1.3 - Iniciar banco de dados PostgreSQL

```bash
# Subir container do PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker ps

# Ver logs (opcional)
docker-compose logs -f postgres
```

**Testar acesso ao banco:**
- Abra http://localhost:8080 (Adminer)
- Sistema: PostgreSQL
- Servidor: postgres
- Usuário: postgres
- Senha: postgres123
- Banco: thiago_platform

---

## 🔢 FASE 2: Criar Projeto Backend (NestJS)

### Passo 2.1 - Criar projeto NestJS

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform

# Instalar CLI do NestJS globalmente
npm install -g @nestjs/cli

# Criar projeto backend
nest new backend --package-manager npm --skip-git

# Entrar na pasta
cd backend
```

### Passo 2.2 - Instalar dependências do backend

```bash
# Prisma (ORM)
npm install prisma @prisma/client

# Autenticação
npm install @nestjs/passport passport passport-local passport-jwt
npm install @nestjs/jwt bcryptjs
npm install -D @types/passport-local @types/passport-jwt @types/bcryptjs

# Validação
npm install class-validator class-transformer

# Configuração
npm install @nestjs/config

# Swagger (documentação da API)
npm install @nestjs/swagger swagger-ui-express

# CORS
npm install @nestjs/platform-express
```

### Passo 2.3 - Configurar Prisma

```bash
# Inicializar Prisma
npx prisma init
```

Isso cria a pasta `prisma/` com o arquivo `schema.prisma`.

### Passo 2.4 - Configurar schema do banco

Editar o arquivo `backend/prisma/schema.prisma` com o modelo de dados.

### Passo 2.5 - Criar migrações

```bash
# Criar migração inicial
npx prisma migrate dev --name init

# Gerar cliente Prisma
npx prisma generate

# Visualizar banco (opcional)
npx prisma studio
```

---

## 🔢 FASE 3: Criar Projeto Frontend (Next.js)

### Passo 3.1 - Criar projeto Next.js

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform

# Criar projeto frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Entrar na pasta
cd frontend
```

### Passo 3.2 - Instalar dependências do frontend

```bash
# Componentes UI (shadcn/ui)
npx shadcn-ui@latest init

# Selecionar opções:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Adicionar componentes principais
npx shadcn-ui@latest add button card input label form select checkbox radio-group slider textarea toast dialog dropdown-menu avatar badge table tabs alert

# Formulários e validação
npm install react-hook-form @hookform/resolvers zod

# Estado e fetch
npm install @tanstack/react-query zustand axios

# Gráficos
npm install recharts

# Animações
npm install framer-motion

# Ícones
npm install lucide-react

# Utilitários
npm install date-fns
```

---

## 🔢 FASE 4: Desenvolver Backend

### Passo 4.1 - Criar módulos

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/backend

# Módulo de autenticação
nest generate module auth
nest generate controller auth
nest generate service auth

# Módulo de usuários
nest generate module users
nest generate controller users
nest generate service users

# Módulo de leads
nest generate module leads
nest generate controller leads
nest generate service leads

# Módulo de formulário/perguntas
nest generate module form-questions
nest generate controller form-questions
nest generate service form-questions

# Módulo de analytics
nest generate module analytics
nest generate controller analytics
nest generate service analytics

# Módulo de Prisma (database)
nest generate module prisma
nest generate service prisma
```

### Passo 4.2 - Implementar código

Ver arquivos na pasta `backend/src/` para implementação.

### Passo 4.3 - Testar API

```bash
# Rodar backend
npm run start:dev

# Acessar Swagger
# http://localhost:3001/api/docs
```

---

## 🔢 FASE 5: Desenvolver Frontend

### Passo 5.1 - Estrutura de pastas

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend/src

# Criar pastas
mkdir -p components/ui
mkdir -p components/forms
mkdir -p components/dashboard
mkdir -p components/layout
mkdir -p lib
mkdir -p hooks
mkdir -p services
mkdir -p store
mkdir -p types
```

### Passo 5.2 - Criar páginas

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend/src/app

# Criar estrutura de rotas
mkdir -p "(auth)/login"
mkdir -p "(auth)/register"
mkdir -p "(dashboard)/dashboard"
mkdir -p "(dashboard)/leads"
mkdir -p "(dashboard)/leads/[id]"
mkdir -p "(dashboard)/configuracoes"
mkdir -p "(dashboard)/usuarios"
mkdir -p "formulario"
mkdir -p "resultado/[id]"
```

### Passo 5.3 - Rodar frontend

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend
npm run dev

# Acessar: http://localhost:3000
```

---

## 🔢 FASE 6: Testes Locais

### Passo 6.1 - Rodar todo o sistema

**Terminal 1 - Banco de dados:**
```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/backend
npm run start:dev
```

**Terminal 3 - Frontend:**
```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend
npm run dev
```

### Passo 6.2 - URLs de acesso

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Backend | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |
| Adminer (banco) | http://localhost:8080 |
| Prisma Studio | npx prisma studio |

### Passo 6.3 - Criar usuário admin inicial

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/backend

# Via Prisma Studio ou seed
npx prisma db seed
```

---

## 🔢 FASE 7: Build para Produção

### Passo 7.1 - Build do Backend

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/backend

# Build
npm run build

# Testar produção localmente
npm run start:prod
```

### Passo 7.2 - Build do Frontend

```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend

# Build
npm run build

# Testar produção localmente
npm run start
```

---

## 🔢 FASE 8: Deploy

### Passo 8.1 - Deploy do Banco de Dados

**Opção A - Supabase (Gratuito):**
1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Copiar URL de conexão PostgreSQL
4. Atualizar DATABASE_URL no .env de produção

**Opção B - Neon (Gratuito):**
1. Criar conta em https://neon.tech
2. Criar novo projeto
3. Copiar connection string
4. Atualizar DATABASE_URL

**Opção C - Railway:**
1. Criar conta em https://railway.app
2. Adicionar PostgreSQL
3. Copiar connection string

### Passo 8.2 - Deploy do Backend

**Opção A - Render:**
```bash
# 1. Criar conta em https://render.com
# 2. Conectar repositório GitHub
# 3. Criar Web Service
# 4. Configurar:
#    - Root Directory: backend
#    - Build Command: npm install && npm run build
#    - Start Command: npm run start:prod
# 5. Adicionar variáveis de ambiente
```

**Opção B - Railway:**
```bash
# 1. Criar conta em https://railway.app
# 2. Novo projeto > GitHub Repo
# 3. Configurar variáveis
# 4. Deploy automático
```

### Passo 8.3 - Deploy do Frontend

**Vercel (Recomendado):**
```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform/frontend

# Instalar CLI
npm install -g vercel

# Deploy
vercel

# Configurar domínio personalizado no painel Vercel
```

### Passo 8.4 - Configurar Domínio

1. Comprar domínio (Registro.br, Namecheap, etc.)
2. Configurar DNS:
   - A record para frontend (Vercel)
   - A record para api.dominio (Backend)
3. SSL automático pela Vercel/Render

---

## 📦 Comandos Úteis de Referência

### Docker
```bash
docker-compose up -d      # Iniciar
docker-compose down       # Parar
docker-compose down -v    # Parar e limpar volumes
docker-compose logs -f    # Ver logs
```

### Prisma
```bash
npx prisma migrate dev    # Criar migração
npx prisma generate       # Gerar cliente
npx prisma studio         # Interface visual
npx prisma db push        # Push sem migração
npx prisma db seed        # Executar seed
```

### NestJS
```bash
nest generate module nome     # Novo módulo
nest generate controller nome # Novo controller
nest generate service nome    # Novo service
npm run start:dev             # Desenvolvimento
npm run build                 # Build produção
```

### Next.js
```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Rodar build
npm run lint     # Verificar código
```

---

## ✅ Checklist Final de Entrega

- [ ] Sistema rodando em produção
- [ ] Domínio configurado
- [ ] SSL ativo (HTTPS)
- [ ] Usuário admin criado
- [ ] Formulário funcionando
- [ ] Dashboard com dados
- [ ] Cálculo de score correto
- [ ] Layout responsivo
- [ ] Documentação entregue
- [ ] Código no GitHub

---

*Atualizado em: 29/12/2024*

