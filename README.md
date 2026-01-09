# 🚀 Plataforma de Propostas Comerciais

Sistema web para captura de dados e apresentação de propostas comerciais com foco em vendas de mentoria.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Executando o Projeto](#executando-o-projeto)
- [Deploy](#deploy)

## 🚀 Deploy Rápido

**Quer colocar no ar agora?** Leia: **[COMECE_AQUI.md](COMECE_AQUI.md)** (20 minutos)

## Sobre o Projeto

Sistema completo com:
- 📝 Formulário inteligente com múltiplas etapas
- 📊 Dashboard administrativo
- 🔐 Autenticação com níveis de acesso
- 📈 Cálculo automático de scores
- 💼 Geração de propostas personalizadas

## Tecnologias

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- TanStack Query
- Zustand

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose (recomendado)
- PostgreSQL (ou usar via Docker)

## Instalação

### 1. Clone o repositório
```bash
cd /Users/victorprecinoti/Plataformas/Thiagoplatform
```

### 2. Configurar variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

### 3. Iniciar o banco de dados (Docker)

```bash
docker-compose up -d
```

### 4. Instalar dependências

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 5. Executar migrações do banco

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Executando o Projeto

### Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Acessos

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

## Estrutura do Projeto

```
Thiagoplatform/
├── frontend/          # Aplicação Next.js
├── backend/           # API NestJS
├── docs/              # Documentação
├── docker-compose.yml # Configuração Docker
├── .env.example       # Variáveis de ambiente
├── PLANEJAMENTO.md    # Documento de planejamento
└── README.md          # Este arquivo
```

## Deploy

Este projeto está configurado para deploy em:
- **Frontend:** Vercel
- **Backend:** Railway
- **Banco de Dados:** Neon PostgreSQL

### 📚 Guias de Deploy

- **[DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)** - Guia resumido (15 minutos)
- **[DEPLOY.md](DEPLOY.md)** - Guia completo e detalhado
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Checklist passo a passo
- **[COMANDOS_UTEIS.md](COMANDOS_UTEIS.md)** - Comandos úteis para desenvolvimento e deploy

### 🚀 Deploy Rápido

```bash
# 1. Verificar se está pronto
node scripts/check-deploy-ready.js

# 2. Gerar JWT Secret
node scripts/generate-jwt-secret.js

# 3. Push para GitHub
git add .
git commit -m "Ready for deploy"
git push origin main

# 4. Seguir guia em DEPLOY_RAPIDO.md
```

### 💰 Custos Estimados

- Vercel (Frontend): **Grátis**
- Railway (Backend): **~$5/mês**
- Neon (Database): **Grátis**
- **Total: ~$5/mês**

---

## 📝 Licença

Projeto privado - Todos os direitos reservados.

