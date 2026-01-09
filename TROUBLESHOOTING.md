# 🔧 Troubleshooting - Soluções para Problemas Comuns

## 🚂 Problemas no Railway (Backend)

### ❌ Build falha com erro "Cannot find module"

**Sintoma:**
```
Error: Cannot find module '@nestjs/core'
```

**Solução:**
```bash
# Localmente, teste:
cd backend
rm -rf node_modules package-lock.json
npm install
npm run build

# Se funcionar localmente, no Railway:
# Settings → Redeploy
```

---

### ❌ "Can't reach database server"

**Sintoma:**
```
Error: Can't reach database server at `xxx.neon.tech`
```

**Solução:**
1. Verifique se `DATABASE_URL` está correta
2. Confirme que tem `?sslmode=require` no final
3. Teste a conexão:
```bash
# Copie sua DATABASE_URL e teste:
psql "sua_database_url_aqui"
```

---

### ❌ Migrations não executam

**Sintoma:**
```
Error: Migration failed
```

**Solução:**
1. No Railway, adicione ao Build Command:
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

2. Ou adicione ao Start Command:
```bash
npx prisma migrate deploy && npm run start:prod
```

---

### ❌ "Port already in use"

**Sintoma:**
```
Error: Port 3001 is already in use
```

**Solução:**
- Railway define a porta automaticamente via variável `PORT`
- Verifique se seu código usa `process.env.PORT`
- No Railway, configure `PORT=3001` nas variáveis

---

### ❌ JWT_SECRET não está funcionando

**Sintoma:**
```
Error: Invalid token
```

**Solução:**
1. Gere um novo JWT_SECRET:
```bash
node scripts/generate-jwt-secret.js
```

2. Atualize no Railway (Variables)
3. Redeploy
4. Limpe cookies do navegador
5. Faça login novamente

---

## ▲ Problemas na Vercel (Frontend)

### ❌ Build falha com "Module not found"

**Sintoma:**
```
Error: Module not found: Can't resolve 'axios'
```

**Solução:**
```bash
# Localmente:
cd frontend
rm -rf node_modules package-lock.json .next
npm install
npm run build

# Se funcionar, na Vercel:
# Deployments → Redeploy
```

---

### ❌ "NEXT_PUBLIC_API_URL is not defined"

**Sintoma:**
- Frontend não conecta ao backend
- Console mostra: `undefined/api/auth/login`

**Solução:**
1. Na Vercel: Settings → Environment Variables
2. Adicione:
```bash
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```
3. Redeploy

---

### ❌ Página 404 após refresh

**Sintoma:**
- Página funciona ao navegar
- Dá 404 ao dar refresh (F5)

**Solução:**
- Isso não deve acontecer na Vercel (Next.js)
- Se acontecer, verifique se está usando App Router corretamente
- Verifique se não tem `output: 'export'` no `next.config.ts`

---

## 🌐 Problemas de CORS

### ❌ "Access-Control-Allow-Origin" error

**Sintoma:**
```
Access to fetch at 'https://api.railway.app' from origin 'https://vercel.app' 
has been blocked by CORS policy
```

**Solução:**
1. No Railway, verifique `FRONTEND_URL`:
```bash
FRONTEND_URL=https://seu-projeto.vercel.app
```

2. Deve ser EXATAMENTE a URL da Vercel (com https://)
3. Sem `/` no final
4. Redeploy do backend
5. Aguarde 1-2 minutos

---

### ❌ CORS funciona localmente mas não em produção

**Sintoma:**
- Funciona em `localhost`
- Não funciona em produção

**Solução:**
1. Verifique se `FRONTEND_URL` no Railway está correta
2. Verifique se não tem URLs hardcoded no código
3. Limpe cache do navegador (Ctrl+Shift+Delete)
4. Teste em aba anônima

---

## 🗄️ Problemas no Neon (Banco)

### ❌ "Too many connections"

**Sintoma:**
```
Error: Too many connections
```

**Solução:**
1. Neon Free tem limite de conexões
2. Configure connection pooling no Prisma:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

3. Use Neon's connection pooling URL

---

### ❌ Banco está vazio após deploy

**Sintoma:**
- Deploy funcionou
- Mas não tem tabelas no banco

**Solução:**
1. Verifique se migrations rodaram:
```bash
# No Railway, veja os logs
# Deve aparecer: "Running migrations..."
```

2. Se não rodou, adicione ao Start Command:
```bash
npx prisma migrate deploy && npm run start:prod
```

---

## 🔐 Problemas de Autenticação

### ❌ "Invalid credentials" mesmo com senha correta

**Sintoma:**
- Senha está correta
- Mas não consegue logar

**Solução:**
1. Verifique se o usuário existe no banco
2. Verifique se a senha foi hasheada corretamente
3. Teste criar novo usuário
4. Verifique logs do backend

---

### ❌ Token expira muito rápido

**Sintoma:**
- Precisa fazer login toda hora

**Solução:**
1. No Railway, ajuste:
```bash
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

2. Verifique se refresh token está funcionando
3. Verifique se cookies estão sendo salvos

---

### ❌ "Account locked" após poucas tentativas

**Sintoma:**
- Conta bloqueia muito rápido

**Solução:**
1. No Railway, ajuste:
```bash
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

2. Para desbloquear manualmente, acesse o banco e:
```sql
UPDATE users 
SET failed_login_attempts = 0, locked_until = NULL 
WHERE email = 'usuario@email.com';
```

---

## 🌐 Problemas com Domínio

### ❌ Domínio não funciona após configurar DNS

**Sintoma:**
- Configurou DNS
- Mas domínio não abre

**Solução:**
1. Aguarde propagação DNS (pode levar até 48h)
2. Verifique propagação: https://dnschecker.org
3. Confirme registros DNS:
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com

Tipo: A
Nome: @
Valor: 76.76.21.21
```

---

### ❌ Domínio funciona mas dá erro SSL

**Sintoma:**
- Domínio abre
- Mas mostra "Not Secure"

**Solução:**
1. Aguarde alguns minutos (Vercel gera SSL automaticamente)
2. Na Vercel: Settings → Domains → Refresh SSL
3. Pode levar até 24h para propagar

---

## 🔄 Problemas de Deploy Automático

### ❌ Push no GitHub não dispara deploy

**Sintoma:**
- Fez push
- Mas não deployou

**Solução:**

**Railway:**
1. Settings → GitHub → Reconnect
2. Verifique se está na branch correta (main)

**Vercel:**
1. Settings → Git → Reconnect
2. Verifique Production Branch (deve ser `main`)

---

## 📊 Problemas de Performance

### ❌ Backend muito lento

**Sintoma:**
- Requisições demoram muito

**Solução:**
1. Verifique logs do Railway
2. Verifique queries do banco (podem estar lentas)
3. Adicione índices no Prisma:
```prisma
@@index([userId])
@@index([email])
```

4. Considere upgrade do plano Railway

---

### ❌ Frontend muito lento

**Sintoma:**
- Páginas demoram para carregar

**Solução:**
1. Verifique se está usando `next/image` para imagens
2. Verifique se está usando `next/link` para navegação
3. Considere adicionar loading states
4. Verifique Network tab (F12) para ver o que está lento

---

## 🧪 Como Debugar

### Ver logs do Railway
```bash
# No dashboard:
Deployments → Selecionar deploy → View Logs
```

### Ver logs da Vercel
```bash
# No dashboard:
Deployments → Selecionar deploy → View Function Logs
```

### Testar API diretamente
```bash
# Health check
curl https://sua-api.railway.app/health

# Login
curl -X POST https://sua-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Ver console do navegador
```
1. Abra o site
2. Pressione F12
3. Vá na aba Console
4. Veja erros em vermelho
```

---

## 🆘 Ainda com Problemas?

### Checklist Final

- [ ] `DATABASE_URL` está correta no Railway
- [ ] `FRONTEND_URL` está correta no Railway
- [ ] `NEXT_PUBLIC_API_URL` está correta na Vercel
- [ ] `JWT_SECRET` foi gerado e configurado
- [ ] Migrations rodaram com sucesso
- [ ] Logs não mostram erros críticos
- [ ] Testou em aba anônima (sem cache)
- [ ] Aguardou 2-3 minutos após mudanças

### Comandos de Emergência

**Resetar tudo no Railway:**
```bash
# Settings → Redeploy
```

**Resetar tudo na Vercel:**
```bash
# Deployments → Redeploy
```

**Resetar banco (CUIDADO: apaga tudo!):**
```bash
# Localmente:
cd backend
npx prisma migrate reset
npx prisma db seed
```

---

## 📚 Documentação Oficial

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)

---

**Se nada disso resolver, revise o `DEPLOY.md` do início! 📖**
