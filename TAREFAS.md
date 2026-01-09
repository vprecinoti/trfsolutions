# ✅ Lista de Tarefas - Desenvolvimento

## 🎯 Visão Geral do Fluxo

```
Login → Dashboard → [Criar Cliente | Meus Clientes | Configurações]
                          ↓
                   Formulário (cadastro)
                          ↓
                   Salvar Lead vinculado ao usuário
                          ↓
                   Exibir Resultado/Proposta
                          ↓
                   Aparece em "Meus Clientes"

🔐 ADMIN: vê TODOS os clientes de TODOS os usuários
👤 USUÁRIO: vê apenas SEUS clientes
```

---

## 📋 TAREFAS

### BLOCO 1: Setup Inicial ✅
- [x] **1.1** Criar projeto Next.js (frontend)
- [x] **1.2** Criar projeto NestJS (backend)
- [x] **1.3** Configurar banco de dados PostgreSQL (Neon)
- [x] **1.4** Configurar Prisma e criar tabelas (users, leads)
- [x] **1.5** Criar seed com usuário admin padrão
- [x] **1.6** Adicionar relação User → Leads (cada usuário tem seus clientes)

### BLOCO 2: Autenticação ✅
- [x] **2.1** Criar página de Login (frontend)
- [x] **2.2** Criar API de login (backend) com JWT
- [x] **2.3** Configurar proteção de rotas (middleware)
- [x] **2.4** Salvar usuário logado no contexto/estado
- [x] **2.5** Testar login funcionando completo

### BLOCO 3: Dashboard Principal ✅
- [x] **3.1** Criar layout do Dashboard (sidebar + header)
- [x] **3.2** Exibir nome do usuário logado no header
- [x] **3.3** Criar página inicial com 3 cards/botões:
        - 📋 Formulário (questionário)
        - 👥 Clientes
        - ⚙️ Configurações (só admin)
- [x] **3.4** Esconder "Configurações" para usuário comum (BASIC/PREMIUM)
- [x] **3.5** Configurar navegação entre páginas

### BLOCO 4: Formulário (Cadastro de Cliente)
- [x] **4.1** Criar estrutura da página de formulário
- [x] **4.2** Montar formulário com todas as perguntas (wizard multi-etapas)
- [x] **4.3** Criar API para receber dados do formulário
- [x] **4.4** **Vincular lead ao usuário logado (user_id)**
- [x] **4.5** Testar envio e salvamento

### BLOCO 5: Página de Clientes (Leads)
- [x] **5.1** Criar página de listagem de clientes
- [x] **5.2** Criar API para buscar leads:
        - **Admin**: busca TODOS os leads
        - **Usuário**: busca apenas SEUS leads (filtro por user_id)
- [x] **5.3** Exibir tabela com dados dos clientes
- [x] **5.4** **Admin: mostrar coluna "Responsável" (nome do usuário dono)**
- [x] **5.5** Criar página de detalhes do cliente
- [x] **5.6** Adicionar filtros e busca

### BLOCO 6: Resultado do Formulário
- [ ] **6.1** Criar lógica de cálculo do resultado/score
- [ ] **6.2** Criar página de resultado personalizado
- [ ] **6.3** Exibir diagnóstico + proposta de mentoria
- [ ] **6.4** Adicionar CTA (botão WhatsApp/agendamento)

### BLOCO 7: Configurações (Admin Only)
- [x] **7.1** Criar página de configurações (só para ADMIN)
- [ ] **7.2** Permitir editar textos do resultado
- [ ] **7.3** Configurar pesos das perguntas (para cálculo)
- [x] **7.4** **Gerenciar usuários (criar, editar, ativar/desativar)**

### BLOCO 8: Finalização
- [x] **8.1** Testar todo o fluxo completo (admin e usuário) - Análise realizada
- [x] **8.2** Ajustar responsividade (mobile) - Otimizado
- [ ] **8.3** Deploy do sistema
- [ ] **8.4** Configurar domínio

---

## 🔐 Regras de Permissão

| Funcionalidade | Admin | Usuário |
|----------------|-------|---------|
| Ver Dashboard | ✅ | ✅ |
| Criar Cliente (formulário) | ✅ | ✅ |
| Ver TODOS os clientes | ✅ | ❌ |
| Ver SEUS clientes | ✅ | ✅ |
| Editar clientes | ✅ | ✅ (só seus) |
| Configurações | ✅ | ❌ |
| Gerenciar usuários | ✅ | ❌ |

---

## 📊 Progresso

| Bloco | Status | Progresso |
|-------|--------|-----------|
| 1. Setup Inicial | 🟢 Concluído | 100% |
| 2. Autenticação | 🟢 Concluído | 100% |
| 3. Dashboard | 🟢 Concluído | 100% |
| 4. Formulário | 🟢 Concluído | 100% |
| 5. Clientes | 🟢 Concluído | 100% |
| 6. Resultado | 🟡 Pendente | 0% |
| 7. Configurações | 🟡 Parcial | 50% |
| 8. Finalização | � Parcial | 50% |

**Total: ~75%**

---

## 🗃️ Estrutura do Banco (Atualizada)

```
User (usuários)
├── id
├── email
├── password_hash
├── name
├── role (ADMIN | USER)
├── active
└── leads[] ←── relacionamento

Lead (clientes)
├── id
├── nome, email, telefone, empresa
├── status
├── score_final
├── resultado_json
├── user_id ←── DONO DO LEAD
└── responses[]

LeadResponse (respostas do formulário)
├── id
├── lead_id
├── pergunta_key
├── resposta_valor
└── peso
```

---

*Atualizado em: 29/12/2025*
