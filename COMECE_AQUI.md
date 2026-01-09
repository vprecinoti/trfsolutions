# 👋 Comece Aqui - Deploy da Plataforma

## 🎯 Objetivo

Colocar sua plataforma TRF Solutions no ar em **~20 minutos**.

---

## ✅ Pré-requisitos

Você vai precisar criar contas (todas gratuitas ou com trial):

1. **GitHub** - Para hospedar o código
2. **Railway** - Para o backend (~$5/mês)
3. **Vercel** - Para o frontend (grátis)
4. **Neon** - Para o banco de dados (grátis)

---

## 🚀 Passo a Passo Simplificado

### 1. Verificar se está tudo pronto (1 min)

```bash
node scripts/check-deploy-ready.js
```

Se aparecer "✅ Projeto pronto para deploy!", continue!

---

### 2. Criar repositório no GitHub (3 min)

```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit - TRF Solutions"
git branch -M main

# Criar repositório no GitHub e depois:
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

---

### 3. Criar banco de dados no Neon (2 min)

1. Acesse: https://neon.tech
2. Clique em "Sign Up" (pode usar GitHub)
3. Clique em "Create Project"
4. Copie a **DATABASE_URL** (vai precisar depois)

---

### 4. Deploy do Backend no Railway (7 min)

1. Acesse: https://railway.app
2. Clique em "Login" (use GitHub)
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

6. Vá em "Variables" e adicione:

```bash
DATABASE_URL=cole_aqui_a_url_do_neon
PORT=3001
FRONTEND_URL=https://temporario.vercel.app
JWT_SECRET=GERAR_ABAIXO
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

7. Gerar JWT_SECRET:
```bash
node scripts/generate-jwt-secret.js
```

8. Copie o JWT_SECRET gerado e cole na variável
9. Aguarde o deploy terminar
10. **Anote a URL gerada** (ex: `https://xxx.up.railway.app`)

---

### 5. Deploy do Frontend na Vercel (5 min)

1. Acesse: https://vercel.com
2. Clique em "Sign Up" (use GitHub)
3. Clique em "Add New" → "Project"
4. Importe seu repositório
5. Configure:
   - Framework: Next.js (detectado automaticamente)
   - Root Directory: `frontend`

6. Vá em "Environment Variables" e adicione:

```bash
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```
(Use a URL que você anotou do Railway)

7. Clique em "Deploy"
8. Aguarde o deploy terminar
9. **Anote a URL gerada** (ex: `https://xxx.vercel.app`)

---

### 6. Conectar Frontend e Backend (2 min)

1. Volte no **Railway**
2. Vá em "Variables"
3. Atualize `FRONTEND_URL` com a URL da Vercel
4. Clique em "Redeploy"

---

### 7. Testar! (2 min)

1. Acesse a URL da Vercel
2. Clique em "Criar conta"
3. Preencha os dados
4. Faça login
5. Teste criar um cliente

**Se tudo funcionou, parabéns! 🎉**

---

## 🌐 Domínio Personalizado (Opcional)

Se você tem um domínio (ex: `meusite.com.br`):

1. Na Vercel: Settings → Domains → Add Domain
2. Siga as instruções para configurar DNS
3. Volte no Railway e atualize `FRONTEND_URL` com seu domínio

---

## 📚 Documentação Completa

Se precisar de mais detalhes:

- **[DEPLOY_RESUMO.md](DEPLOY_RESUMO.md)** - Visão geral
- **[DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)** - Guia resumido
- **[DEPLOY.md](DEPLOY.md)** - Guia completo
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Checklist detalhado
- **[ENV_TEMPLATE.md](ENV_TEMPLATE.md)** - Template de variáveis
- **[COMANDOS_UTEIS.md](COMANDOS_UTEIS.md)** - Comandos úteis

---

## 🆘 Problemas?

### Backend não inicia
- Verifique se `DATABASE_URL` está correta no Railway
- Veja os logs: Railway → Deployments → View Logs

### Frontend não conecta
- Verifique se `NEXT_PUBLIC_API_URL` está correta na Vercel
- Verifique se `FRONTEND_URL` está correta no Railway
- Aguarde 1-2 minutos e tente novamente

### CORS Error
- Confirme que as URLs estão corretas (com https://)
- Faça redeploy do backend no Railway

---

## 💰 Custos

- **Vercel:** Grátis ✅
- **Railway:** ~$5/mês
- **Neon:** Grátis ✅
- **Total:** ~$5/mês

---

## 🎉 Pronto!

Agora é só começar! Siga os passos acima e em 20 minutos sua plataforma estará no ar.

**Boa sorte! 🚀**
