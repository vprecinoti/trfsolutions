# 🔐 Template de Variáveis de Ambiente

Use este arquivo como referência para configurar as variáveis de ambiente no Railway e Vercel.

---

## 🚂 Railway (Backend)

Copie e cole estas variáveis em: **Settings → Variables**

```bash
# ============================================
# BANCO DE DADOS (Neon PostgreSQL)
# ============================================
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# ============================================
# SERVIDOR
# ============================================
PORT=3001

# ============================================
# FRONTEND (Atualizar após deploy da Vercel)
# ============================================
FRONTEND_URL=https://seu-projeto.vercel.app

# ============================================
# JWT - SEGURANÇA
# ============================================
# IMPORTANTE: Gerar com: node scripts/generate-jwt-secret.js
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA_DE_128_CARACTERES
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# SEGURANÇA - CONTROLE DE LOGIN
# ============================================
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

### 📝 Notas Railway:

1. **DATABASE_URL**: Copie do Neon após criar o banco
2. **FRONTEND_URL**: Atualize após deploy da Vercel
3. **JWT_SECRET**: NUNCA use o exemplo, gere um novo!

---

## ▲ Vercel (Frontend)

Copie e cole estas variáveis em: **Settings → Environment Variables**

```bash
# ============================================
# API BACKEND (Railway)
# ============================================
NEXT_PUBLIC_API_URL=https://seu-projeto.up.railway.app
```

### 📝 Notas Vercel:

1. **NEXT_PUBLIC_API_URL**: URL gerada pelo Railway após deploy
2. Não esqueça o `https://` no início
3. Não adicione `/` no final da URL

---

## 🔄 Ordem de Configuração

### 1️⃣ Primeiro: Neon (Banco)
1. Criar projeto no Neon
2. Copiar `DATABASE_URL`

### 2️⃣ Segundo: Railway (Backend)
1. Configurar todas as variáveis acima
2. Gerar `JWT_SECRET` novo
3. Usar `FRONTEND_URL` temporária
4. Deploy
5. Anotar URL gerada

### 3️⃣ Terceiro: Vercel (Frontend)
1. Configurar `NEXT_PUBLIC_API_URL` com URL do Railway
2. Deploy
3. Anotar URL gerada

### 4️⃣ Quarto: Atualizar Railway
1. Voltar no Railway
2. Atualizar `FRONTEND_URL` com URL da Vercel
3. Redeploy

---

## 🔐 Gerar JWT_SECRET

### Opção 1: Script do Projeto (Recomendado)
```bash
node scripts/generate-jwt-secret.js
```

### Opção 2: Comando Node
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Opção 3: Online (Menos Seguro)
- https://generate-secret.vercel.app/64

**⚠️ IMPORTANTE:**
- Nunca compartilhe seu JWT_SECRET
- Nunca commite no Git
- Use um diferente para cada ambiente

---

## 📋 Checklist de Variáveis

### Railway (Backend)
- [ ] DATABASE_URL configurada
- [ ] PORT = 3001
- [ ] FRONTEND_URL configurada
- [ ] JWT_SECRET gerado e configurado
- [ ] JWT_ACCESS_EXPIRES_IN = 15m
- [ ] JWT_REFRESH_EXPIRES_IN = 7d
- [ ] MAX_LOGIN_ATTEMPTS = 5
- [ ] LOCK_TIME_MINUTES = 15

### Vercel (Frontend)
- [ ] NEXT_PUBLIC_API_URL configurada

---

## 🧪 Testar Variáveis

### Testar Backend
```bash
# Deve retornar: {"status":"ok"}
curl https://sua-api.railway.app/health
```

### Testar Frontend
```bash
# Abrir no navegador e verificar console (F12)
# Não deve ter erros de CORS ou conexão
https://seu-projeto.vercel.app
```

---

## 🔄 Ambientes Diferentes

### Desenvolvimento Local

**Backend (.env):**
```bash
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/thiago_platform
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev-secret-key-not-for-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Produção

Use as variáveis configuradas no Railway e Vercel (acima).

---

## 🆘 Problemas Comuns

### Backend não conecta ao banco
**Sintoma:** Erro "Can't reach database server"

**Solução:**
- Verifique se `DATABASE_URL` está correta
- Confirme que tem `?sslmode=require` no final
- Verifique se o banco Neon está ativo

### Frontend não conecta ao backend
**Sintoma:** Erro de rede ou CORS

**Solução:**
- Verifique `NEXT_PUBLIC_API_URL` na Vercel
- Verifique `FRONTEND_URL` no Railway
- Aguarde 1-2 minutos após atualizar variáveis
- Faça redeploy se necessário

### JWT inválido
**Sintoma:** Erro "Invalid token"

**Solução:**
- Verifique se `JWT_SECRET` está configurado
- Confirme que é o mesmo em todos os ambientes
- Limpe cookies do navegador
- Faça logout e login novamente

---

## 📚 Referências

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon Connection String](https://neon.tech/docs/connect/connect-from-any-app)

---

*Última atualização: Janeiro 2026*
