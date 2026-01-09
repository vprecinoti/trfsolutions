# ✅ Checklist de Deploy - TRF Solutions

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

## 📋 Pré-Deploy

### 1. Preparação do Código
- [ ] Código commitado no Git
- [ ] Repositório criado no GitHub
- [ ] Push realizado para branch `main`
- [ ] Arquivos `.env` não estão no repositório (verificar .gitignore)

### 2. Banco de Dados (Neon)
- [ ] Conta criada em [neon.tech](https://neon.tech)
- [ ] Projeto PostgreSQL criado
- [ ] DATABASE_URL copiada
- [ ] Testado conexão localmente (opcional)

---

## 🚂 Deploy Backend (Railway)

### 3. Configuração Railway
- [ ] Conta criada em [railway.app](https://railway.app)
- [ ] Projeto criado e conectado ao GitHub
- [ ] Root Directory configurado: `backend`
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm run start:prod`

### 4. Variáveis de Ambiente Railway
Adicione em Settings → Variables:

```bash
# Banco de dados
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Servidor
PORT=3001

# Frontend (atualizar depois do deploy da Vercel)
FRONTEND_URL=https://seu-dominio.vercel.app

# JWT - GERAR CHAVE SEGURA!
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Segurança
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=15
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- [ ] Todas variáveis configuradas
- [ ] JWT_SECRET gerado e configurado
- [ ] Deploy realizado com sucesso
- [ ] URL do Railway anotada: `https://_____.up.railway.app`

### 5. Verificação Backend
- [ ] Acessar `https://sua-api.railway.app/health` (deve retornar OK)
- [ ] Logs sem erros críticos
- [ ] Migrations do Prisma executadas

---

## ▲ Deploy Frontend (Vercel)

### 6. Configuração Vercel
- [ ] Conta criada em [vercel.com](https://vercel.com)
- [ ] Projeto importado do GitHub
- [ ] Framework detectado: Next.js
- [ ] Root Directory configurado: `frontend`

### 7. Variáveis de Ambiente Vercel
Adicione em Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```

- [ ] Variável configurada
- [ ] Deploy realizado com sucesso
- [ ] URL da Vercel anotada: `https://_____.vercel.app`

### 8. Verificação Frontend
- [ ] Site acessível
- [ ] Página de login carrega
- [ ] Console do navegador sem erros de CORS
- [ ] Consegue fazer login (testar)

---

## 🔄 Sincronização Final

### 9. Atualizar URLs Cruzadas

**No Railway (Backend):**
- [ ] Atualizar `FRONTEND_URL` com URL da Vercel
- [ ] Redeploy do backend

**No Vercel (Frontend):**
- [ ] Confirmar `NEXT_PUBLIC_API_URL` está correto
- [ ] Redeploy do frontend (se necessário)

### 10. Teste de Integração
- [ ] Criar nova conta no frontend
- [ ] Fazer login
- [ ] Criar um cliente de teste
- [ ] Preencher formulário
- [ ] Verificar dados no dashboard

---

## 🌐 Domínio Personalizado (Opcional)

### 11. Configurar Domínio na Vercel
- [ ] Adicionar domínio em Settings → Domains
- [ ] Copiar registros DNS fornecidos pela Vercel

### 12. Configurar DNS no Registro.br
- [ ] Acessar painel do Registro.br
- [ ] Adicionar registros DNS:
  - [ ] CNAME: `www` → `cname.vercel-dns.com`
  - [ ] A: `@` → `76.76.21.21`
- [ ] Aguardar propagação (1-48h)

### 13. Atualizar URLs com Domínio
**No Railway:**
- [ ] Atualizar `FRONTEND_URL=https://seu-dominio.com.br`

**Verificar:**
- [ ] Domínio acessível
- [ ] HTTPS funcionando
- [ ] Redirecionamento www → domínio principal

---

## 🔒 Segurança Final

### 14. Checklist de Segurança
- [ ] JWT_SECRET é único e forte (64+ caracteres)
- [ ] Nenhum arquivo `.env` no GitHub
- [ ] CORS configurado apenas para domínio correto
- [ ] HTTPS habilitado (automático Vercel/Railway)
- [ ] Senhas de admin alteradas
- [ ] Logs de erro não expõem informações sensíveis

---

## 📊 Monitoramento

### 15. Configurar Alertas (Opcional)
- [ ] Configurar notificações de erro no Railway
- [ ] Configurar alertas de deploy na Vercel
- [ ] Adicionar monitoramento de uptime (UptimeRobot, etc)

---

## 🎉 Deploy Completo!

Se todos os itens acima estão marcados, seu deploy está completo e funcionando!

### URLs Finais:
- **Frontend:** https://seu-dominio.com.br
- **Backend:** https://sua-api.railway.app
- **Banco:** Neon PostgreSQL

### Próximos Passos:
1. Criar usuário admin
2. Configurar permissões
3. Adicionar primeiros clientes
4. Monitorar logs por 24-48h

---

**Data do Deploy:** ___/___/______
**Responsável:** _________________
