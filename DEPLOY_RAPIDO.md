# 🚀 Deploy Rápido - Guia Resumido

Este é um guia resumido para deploy. Para instruções detalhadas, veja `DEPLOY.md`.

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Railway (backend)
- Conta na Vercel (frontend)
- Conta no Neon (banco de dados PostgreSQL)

---

## 🎯 Passo a Passo (15 minutos)

### 1️⃣ GitHub (2 min)

```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 2️⃣ Neon - Banco de Dados (2 min)

1. Acesse [neon.tech](https://neon.tech)
2. Crie novo projeto PostgreSQL
3. Copie a `DATABASE_URL`

### 3️⃣ Railway - Backend (5 min)

1. Acesse [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecione seu repositório
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

5. Adicione variáveis (Settings → Variables):

```bash
DATABASE_URL=sua_url_do_neon
PORT=3001
FRONTEND_URL=https://temporario.vercel.app
JWT_SECRET=GERAR_ABAIXO
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

**Gerar JWT_SECRET:**
```bash
node scripts/generate-jwt-secret.js
```

6. Anote a URL: `https://_____.up.railway.app`

### 4️⃣ Vercel - Frontend (5 min)

1. Acesse [vercel.com](https://vercel.com)
2. Add New → Project
3. Importe seu repositório
4. Configure:
   - Framework: Next.js
   - Root Directory: `frontend`

5. Adicione variável (Environment Variables):

```bash
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```

6. Deploy!
7. Anote a URL: `https://_____.vercel.app`

### 5️⃣ Atualizar URLs (1 min)

**No Railway:**
- Vá em Variables
- Atualize `FRONTEND_URL` com a URL da Vercel
- Redeploy

---

## ✅ Testar

1. Acesse seu site na Vercel
2. Crie uma conta
3. Faça login
4. Teste criar um cliente

---

## 🌐 Domínio Personalizado (Opcional)

### Na Vercel:
1. Settings → Domains
2. Adicione seu domínio

### No Registro.br:
1. Adicione os registros DNS que a Vercel mostrar
2. Aguarde propagação (1-48h)

### Atualizar Railway:
```bash
FRONTEND_URL=https://seu-dominio.com.br
```

---

## 🆘 Problemas Comuns

### Backend não inicia:
- Verifique `DATABASE_URL` no Railway
- Veja logs: Railway → Deployments → View Logs

### Frontend não conecta:
- Verifique `NEXT_PUBLIC_API_URL` na Vercel
- Verifique `FRONTEND_URL` no Railway
- Veja console do navegador (F12)

### CORS Error:
- Confirme que `FRONTEND_URL` no Railway está correto
- Deve ser a URL exata da Vercel (com https://)

---

## 📚 Documentação Completa

- **Guia Detalhado:** `DEPLOY.md`
- **Checklist:** `DEPLOY_CHECKLIST.md`
- **Verificar projeto:** `node scripts/check-deploy-ready.js`

---

## 💰 Custos

- Vercel: Grátis
- Railway: ~$5/mês
- Neon: Grátis
- **Total: ~$5/mês**

---

**Pronto! Seu sistema está no ar! 🎉**
