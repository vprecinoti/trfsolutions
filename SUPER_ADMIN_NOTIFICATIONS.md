# 🔔 Sistema de Notificações Super Admin

Sistema exclusivo de monitoramento e notificações para o super administrador `admin@thiagoplatform.com`.

## 🎯 **Funcionalidades**

### **1. Painel Super Admin** (`/dashboard/super-admin`)
- **Estatísticas em tempo real**: Usuários, clientes, formulários, leads
- **Atividade recente**: Últimas 20 ações no sistema
- **Alertas do sistema**: Usuários bloqueados, tentativas de login falhadas
- **Uso do banco**: Monitoramento do espaço utilizado no Neon
- **Atualização automática**: Dados atualizados a cada 30 segundos

### **2. Notificações Flutuantes**
- **Ícone de sino**: Canto superior esquerdo (só para super admin)
- **Contador de não lidas**: Badge vermelho com número
- **Notificações em tempo real**: Novos usuários, clientes, formulários
- **Histórico**: Últimas 10 atividades

### **3. Segurança**
- **Acesso restrito**: Apenas `admin@thiagoplatform.com`
- **Verificação dupla**: Frontend e backend verificam o email
- **Endpoints protegidos**: `/admin/*` só para super admin

## 📊 **Tipos de Notificações**

### **Atividades Monitoradas:**
- ✅ **Novos usuários** cadastrados
- ✅ **Novos clientes/leads** criados
- ✅ **Formulários** iniciados
- ✅ **Logins bem-sucedidos**
- ❌ **Tentativas de login falhadas**

### **Alertas do Sistema:**
- ⚠️ **Usuários bloqueados** (tentativas excessivas)
- ⚠️ **Muitas tentativas falhadas** (>10 em 24h)
- 🔴 **Uso alto do banco** (>80% da capacidade)
- 🟡 **Uso moderado do banco** (>60% da capacidade)

## 🚀 **Como Usar**

### **1. Acessar o Painel**
1. Faça login como `admin@thiagoplatform.com`
2. No dashboard, clique em **"Super Admin"**
3. Ou acesse diretamente: `/dashboard/super-admin`

### **2. Ver Notificações**
1. Procure o **ícone de sino vermelho** no canto superior esquerdo
2. Clique para ver as notificações recentes
3. Clique em uma notificação para marcá-la como lida
4. Use **"Marcar todas"** para limpar todas

### **3. Monitorar Métricas**
- **Cards de estatísticas**: Totais atualizados em tempo real
- **Gráfico de uso do banco**: Acompanhe o crescimento
- **Lista de atividades**: Veja quem está usando o sistema
- **Alertas**: Problemas que precisam de atenção

## 🔧 **Configuração Técnica**

### **Backend Endpoints:**
```
GET /admin/system-stats     - Estatísticas completas
GET /admin/recent-activity  - Atividades recentes
GET /admin/system-alerts    - Alertas do sistema
```

### **Atualização Automática:**
- **Painel**: Atualiza a cada 30 segundos
- **Notificações**: Atualizam a cada 30 segundos
- **Dados em cache**: Otimizado para performance

### **Estimativa de Uso do Banco:**
```
Cada registro ≈ 5KB
Usuário = ~5KB
Cliente/Lead = ~8KB
Formulário = ~3KB
Log = ~2KB
```

## 📈 **Métricas Importantes**

### **Limites do Neon (Free):**
- **Armazenamento**: 3GB (3.072MB)
- **Conexões**: Ilimitadas
- **Backups**: 7 dias

### **Quando se Preocupar:**
- **>1.000 usuários**: Considerar upgrade
- **>10.000 clientes**: Monitorar uso do banco
- **>50 tentativas falhadas/dia**: Possível ataque
- **>5 usuários bloqueados**: Revisar políticas

## 🧪 **Testar o Sistema**

### **1. Criar Dados de Teste:**
```bash
cd backend
node scripts/test-notifications.js
```

### **2. Simular Atividade:**
- Crie novos usuários via `/register`
- Faça login/logout várias vezes
- Crie clientes no sistema
- Inicie formulários

### **3. Verificar Notificações:**
- Acesse `/dashboard/super-admin`
- Veja o ícone de sino no canto superior esquerdo
- Observe as métricas atualizando

## 🔒 **Segurança**

### **Verificações de Acesso:**
```typescript
// Frontend
if (user?.email !== 'admin@thiagoplatform.com') {
  router.push('/dashboard');
}

// Backend
if (user.email !== 'admin@thiagoplatform.com') {
  throw new ForbiddenException('Acesso negado');
}
```

### **Proteções Implementadas:**
- ✅ Verificação de email específico
- ✅ Guards de autenticação
- ✅ Endpoints protegidos
- ✅ Dados sensíveis filtrados

## 📱 **Interface**

### **Cores do Sistema:**
- **Super Admin**: Vermelho (`#ef4444`)
- **Notificações**: Badge vermelho
- **Alertas**: Âmbar/Vermelho conforme severidade
- **Sucesso**: Verde
- **Info**: Azul

### **Responsividade:**
- ✅ Desktop otimizado
- ✅ Tablet compatível
- ✅ Mobile funcional

## 🚨 **Troubleshooting**

### **Notificações não aparecem:**
1. Verifique se está logado como `admin@thiagoplatform.com`
2. Limpe o cache do navegador
3. Verifique console (F12) por erros
4. Teste endpoint: `/admin/system-stats`

### **Dados não atualizam:**
1. Verifique conexão com internet
2. Veja se backend está online
3. Teste API diretamente
4. Verifique logs do Railway

### **Acesso negado:**
1. Confirme email exato: `admin@thiagoplatform.com`
2. Faça logout e login novamente
3. Verifique se usuário existe no banco
4. Confirme role `ADMIN`

## 🎉 **Pronto!**

Agora você tem um sistema completo de monitoramento exclusivo para o super admin. O sistema:

- ✅ **Monitora tudo** em tempo real
- ✅ **Notifica atividades** importantes
- ✅ **Alerta problemas** antes que se tornem críticos
- ✅ **Protege dados** com acesso restrito
- ✅ **Atualiza automaticamente** sem intervenção

**Acesse:** `/dashboard/super-admin` e comece a monitorar! 🚀