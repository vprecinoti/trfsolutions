# 🚀 Guia de Deploy - TRF Solutions

## Arquitetura de Deploy

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Vercel       │────▶│    Railway      │────▶│     Neon        │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
│   Next.js       │     │    NestJS       │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        └───────────────────────┘
              seu-dominio.com.br
```

---

## 1️⃣ Preparação - GitHub

### Criar repositório no GitHub:
1. Acesse github.com e crie um novo repositório
2. No terminal, na pasta do projeto:

```bash
git init
git add .
git commit -m "Initial commit - TRF Solutions"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

---

## 2️⃣ Deploy do Backend - Railway

### Passo a passo:
1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório
4. Railway vai detectar automaticamente, mas configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`

### Variáveis de ambiente (Settings → Variables):
```
DATABASE_URL=sua_url_do_neon
PORT=3001
FRONTEND_URL=https://seu-dominio.com.br
JWT_SECRET=GERE_UMA_CHAVE_SEGURA_AQUI
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

### Gerar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Após deploy:
- Anote a URL gerada (ex: `https://seu-projeto.up.railway.app`)
- Esta será a `NEXT_PUBLIC_API_URL` do frontend

---

## 3️⃣ Deploy do Frontend - Vercel

### Passo a passo:
1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New" → "Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `frontend`

### Variáveis de ambiente (Environment Variables):
```
NEXT_PUBLIC_API_URL=https://seu-projeto.up.railway.app
```

### Após deploy:
- Vercel vai gerar uma URL (ex: `https://seu-projeto.vercel.app`)
- Volte no Railway e atualize `FRONTEND_URL` com essa URL

---

## 4️⃣ Configurar Domínio (Registro.br)

### No Vercel (Frontend):
1. Vá em Settings → Domains
2. Adicione seu domínio: `seu-dominio.com.br`
3. Vercel vai mostrar os registros DNS necessários

### No Registro.br:
1. Acesse registro.br → Meus Domínios → seu domínio
2. Vá em "DNS" ou "Zona DNS"
3. Adicione os registros que a Vercel indicou:

**Opção A - CNAME (recomendado):**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**Opção B - A Record (para domínio raiz):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
```

### Aguarde propagação DNS (pode levar até 48h, geralmente 1-2h)

---

## 5️⃣ Atualizar URLs Finais

### No Railway (Backend):
```
FRONTEND_URL=https://seu-dominio.com.br
```

### No Vercel (Frontend):
```
NEXT_PUBLIC_API_URL=https://seu-projeto.up.railway.app
```

---

## 🔒 Checklist de Segurança para Produção

- [ ] JWT_SECRET é uma chave forte e única
- [ ] DATABASE_URL não está exposta no código
- [ ] CORS configurado apenas para seu domínio
- [ ] Arquivos .env não estão no GitHub
- [ ] HTTPS habilitado (Vercel e Railway fazem automaticamente)

---

## 🔄 Deploy Automático

Após configurar, todo push para `main` no GitHub vai:
1. Atualizar automaticamente o frontend na Vercel
2. Atualizar automaticamente o backend no Railway

---

## 🐛 Troubleshooting

### Backend não conecta ao banco:
- Verifique se DATABASE_URL está correta no Railway
- Confirme que o IP do Railway está liberado no Neon (geralmente já está)

### Frontend não conecta ao backend:
- Verifique NEXT_PUBLIC_API_URL no Vercel
- Confirme que FRONTEND_URL no Railway está correto
- Verifique CORS no backend

### Domínio não funciona:
- Aguarde propagação DNS (use dnschecker.org para verificar)
- Confirme registros DNS no Registro.br

---

## 💰 Custos Estimados

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | Grátis |
| Railway | Starter | ~$5/mês |
| Neon | Free | Grátis |
| Registro.br | Domínio | ~R$40/ano |

**Total: ~$5/mês + R$40/ano**

---

*Última atualização: Janeiro 2026*
