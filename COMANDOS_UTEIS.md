# 🛠️ Comandos Úteis - TRF Solutions

## 🔧 Desenvolvimento Local

### Backend
```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Seed do banco (dados iniciais)
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Rodar em produção
npm run start:prod
```

### Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm run start
```

---

## 🗄️ Banco de Dados (Prisma)

### Migrations
```bash
cd backend

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status
```

### Prisma Studio (Interface Visual)
```bash
cd backend
npx prisma studio
# Abre em http://localhost:5555
```

### Seed (Popular banco com dados)
```bash
cd backend
npx prisma db seed
```

---

## 🔐 Segurança

### Gerar JWT Secret
```bash
# Opção 1: Script do projeto
node scripts/generate-jwt-secret.js

# Opção 2: Comando direto
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Deploy

### Verificar se está pronto para deploy
```bash
node scripts/check-deploy-ready.js
```

### Git - Preparar para deploy
```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit - TRF Solutions"

# Renomear branch para main
git branch -M main

# Adicionar remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Push para GitHub
git push -u origin main
```

### Atualizar deploy (após mudanças)
```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
# Railway e Vercel fazem deploy automático!
```

---

## 🐳 Docker (Desenvolvimento Local)

### Iniciar banco PostgreSQL local
```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Resetar banco (apaga dados)
docker-compose down -v
docker-compose up -d
```

### Acessar Adminer (Interface do banco)
```
URL: http://localhost:8080
Sistema: PostgreSQL
Servidor: postgres
Usuário: postgres
Senha: postgres123
Base: thiago_platform
```

---

## 🧪 Testes

### Backend
```bash
cd backend

# Rodar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e
```

---

## 🔍 Debug e Logs

### Ver logs do Railway
```bash
# No dashboard do Railway:
# Deployments → Selecionar deploy → View Logs
```

### Ver logs da Vercel
```bash
# No dashboard da Vercel:
# Deployments → Selecionar deploy → View Function Logs
```

### Logs locais (desenvolvimento)
```bash
# Backend mostra logs no terminal automaticamente
cd backend
npm run start:dev

# Frontend mostra logs no terminal
cd frontend
npm run dev
```

---

## 📊 Monitoramento

### Verificar saúde do backend
```bash
# Local
curl http://localhost:3001/health

# Produção
curl https://sua-api.railway.app/health
```

### Verificar versão da API
```bash
curl https://sua-api.railway.app/
```

---

## 🔄 Rollback (Reverter Deploy)

### Railway
1. Acesse Deployments
2. Selecione deploy anterior que funcionava
3. Clique em "Redeploy"

### Vercel
1. Acesse Deployments
2. Selecione deploy anterior
3. Clique nos 3 pontos → "Promote to Production"

---

## 🧹 Limpeza e Manutenção

### Limpar node_modules
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Limpar builds
```bash
# Backend
cd backend
rm -rf dist

# Frontend
cd frontend
rm -rf .next
```

### Limpar tudo e reinstalar
```bash
# Backend
cd backend
rm -rf node_modules dist package-lock.json
npm install
npx prisma generate

# Frontend
cd frontend
rm -rf node_modules .next package-lock.json
npm install
```

---

## 📝 Variáveis de Ambiente

### Copiar exemplos
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Editar variáveis
```bash
# Backend
nano backend/.env
# ou
code backend/.env

# Frontend
nano frontend/.env
# ou
code frontend/.env
```

---

## 🆘 Comandos de Emergência

### Backend não inicia
```bash
cd backend
rm -rf node_modules dist package-lock.json
npm install
npx prisma generate
npm run build
npm run start:prod
```

### Frontend não inicia
```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run build
npm run start
```

### Banco de dados corrompido (desenvolvimento)
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

---

## 📚 Documentação

- **Prisma:** https://www.prisma.io/docs
- **NestJS:** https://docs.nestjs.com
- **Next.js:** https://nextjs.org/docs
- **Railway:** https://docs.railway.app
- **Vercel:** https://vercel.com/docs
- **Neon:** https://neon.tech/docs

---

**Dica:** Salve este arquivo nos favoritos para consulta rápida! 📌
