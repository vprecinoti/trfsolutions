# 📋 Planejamento do Sistema - Plataforma de Propostas Comerciais

## 🎯 Visão Geral do Projeto

**Objetivo:** Sistema web para captura de dados, organização e apresentação de propostas comerciais, focado na venda de mentoria através de um formulário inteligente.

**Tipo de Sistema:** SaaS Web Application
**Público-Alvo:** Empresa do cliente e seus potenciais clientes (leads)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Landing     │  │  Formulário  │  │  Dashboard Admin     │   │
│  │  Page        │  │  Inteligente │  │  (Gestão + Métricas) │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/NestJS)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Auth Module │  │  Forms API   │  │  Analytics Engine    │   │
│  │  (JWT)       │  │  (CRUD)      │  │  (Cálculos/Scores)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BANCO DE DADOS (PostgreSQL)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │  Users   │  │  Leads   │  │ Responses│  │  Settings    │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas do Projeto

```
Thiagoplatform/
├── frontend/                    # Aplicação Next.js
│   ├── src/
│   │   ├── app/                 # App Router (Next.js 14+)
│   │   │   ├── (auth)/          # Rotas de autenticação
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/     # Rotas protegidas (admin)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leads/
│   │   │   │   ├── configuracoes/
│   │   │   │   └── usuarios/
│   │   │   ├── formulario/      # Formulário público
│   │   │   ├── resultado/       # Página de resultado/proposta
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   ├── ui/              # Componentes base (shadcn/ui)
│   │   │   ├── forms/           # Componentes de formulário
│   │   │   ├── dashboard/       # Componentes do dashboard
│   │   │   └── layout/          # Header, Sidebar, Footer
│   │   ├── lib/                 # Utilitários
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API calls
│   │   ├── store/               # Estado global (Zustand)
│   │   └── types/               # TypeScript types
│   ├── public/                  # Assets estáticos
│   └── package.json
│
├── backend/                     # API NestJS
│   ├── src/
│   │   ├── auth/                # Módulo de autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── users/               # Módulo de usuários
│   │   ├── leads/               # Módulo de leads/respostas
│   │   ├── forms/               # Módulo de configuração de formulários
│   │   ├── analytics/           # Módulo de analytics/métricas
│   │   ├── common/              # Decorators, pipes, filters
│   │   └── database/            # Configuração do banco
│   ├── prisma/                  # ORM Prisma
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
│
├── docs/                        # Documentação
│   ├── API.md
│   ├── DEPLOY.md
│   └── DATABASE.md
│
├── docker-compose.yml           # Para desenvolvimento local
├── .env.example                 # Variáveis de ambiente
└── README.md
```

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama Entidade-Relacionamento

```
┌─────────────────┐       ┌─────────────────────┐
│     Users       │       │       Leads         │
├─────────────────┤       ├─────────────────────┤
│ id              │       │ id                  │
│ email           │       │ nome                │
│ password_hash   │       │ email               │
│ name            │       │ telefone            │
│ role (enum)     │       │ empresa             │
│ active          │       │ created_at          │
│ created_at      │       │ status (enum)       │
│ updated_at      │       │ score_final         │
└─────────────────┘       │ resultado_json      │
                          └─────────────────────┘
                                   │
                                   │ 1:N
                                   ▼
                          ┌─────────────────────┐
                          │   LeadResponses     │
                          ├─────────────────────┤
                          │ id                  │
                          │ lead_id (FK)        │
                          │ pergunta_key        │
                          │ resposta_valor      │
                          │ peso                │
                          │ created_at          │
                          └─────────────────────┘

┌─────────────────────┐
│   FormQuestions     │
├─────────────────────┤
│ id                  │
│ categoria           │
│ pergunta            │
│ tipo (enum)         │
│ opcoes (json)       │
│ peso_base           │
│ ordem               │
│ obrigatoria         │
│ active              │
└─────────────────────┘
```

### Enums e Tipos

```typescript
// Roles de usuário
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

// Status do lead
enum LeadStatus {
  NOVO = 'novo',
  VISUALIZADO = 'visualizado',
  CONTATADO = 'contatado',
  CONVERTIDO = 'convertido',
  DESCARTADO = 'descartado'
}

// Tipos de pergunta
enum QuestionType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  NUMBER = 'number',
  TEXTAREA = 'textarea'
}
```

---

## 📱 Telas e Funcionalidades

### 1. Landing Page (Pública)
- Hero section com proposta de valor
- Benefícios da mentoria
- CTA para acessar o formulário
- Depoimentos/Social proof

### 2. Formulário Inteligente (Pública)
**Estrutura em etapas (wizard):**

```
Etapa 1: Dados Pessoais
├── Nome completo
├── Email
├── Telefone/WhatsApp
└── Nome da empresa (opcional)

Etapa 2: Situação Atual
├── Qual seu faturamento atual?
├── Quantos funcionários você tem?
├── Qual seu principal desafio hoje?
└── Há quanto tempo está no mercado?

Etapa 3: Objetivos
├── Qual sua meta de faturamento?
├── O que te impede de alcançar essa meta?
├── Já investiu em mentoria/consultoria antes?
└── Qual seu nível de comprometimento? (1-10)

Etapa 4: Diagnóstico Específico
├── Perguntas customizáveis pelo admin
├── Cada resposta tem um peso
└── Calcula-se o score final

Etapa 5: Resultado/Proposta
├── Score calculado
├── Diagnóstico personalizado
├── Recomendação de mentoria
├── CTA para agendamento/compra
```

### 3. Página de Resultado (Pública)
- Exibe diagnóstico baseado nas respostas
- Mostra pontos fortes e fracos identificados
- Apresenta proposta personalizada de mentoria
- Botão de CTA (WhatsApp, Calendly, etc.)

### 4. Dashboard Admin (Protegida)
```
┌────────────────────────────────────────────────────────────┐
│  Dashboard                                                  │
├────────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Total Leads│ │ Novos Hoje │ │ Taxa Conv. │ │ Score Méd│ │
│  │    245     │ │     12     │ │   18.5%    │ │   7.2    │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Gráfico de Leads por Dia               │   │
│  │  📊                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Últimos Leads Recebidos                │   │
│  │  Nome        │ Email         │ Score │ Status       │   │
│  │  João Silva  │ joao@...      │ 8.5   │ 🟢 Novo      │   │
│  │  Maria Costa │ maria@...     │ 6.2   │ 🟡 Contatado │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### 5. Gestão de Leads (Protegida)
- Lista de todos os leads com filtros
- Visualização detalhada das respostas
- Alteração de status
- Exportação para CSV/Excel
- Notas internas

### 6. Configurações (Admin)
- Editar perguntas do formulário
- Definir pesos para cálculo de score
- Configurar textos da proposta
- Personalizar resultado por faixa de score

### 7. Gestão de Usuários (Admin)
- Criar usuários
- Definir permissões
- Ativar/desativar usuários

---

## 🔐 Sistema de Autenticação

### Fluxo de Login
```
1. Usuário acessa /login
2. Insere email e senha
3. Backend valida credenciais
4. Gera JWT (access_token + refresh_token)
5. Frontend armazena tokens (httpOnly cookies)
6. Requisições incluem token no header
7. Refresh automático quando expirar
```

### Níveis de Acesso
| Recurso | Admin | Usuário |
|---------|-------|---------|
| Dashboard | ✅ | ✅ |
| Ver leads | ✅ | ✅ |
| Editar leads | ✅ | ✅ |
| Configurar formulário | ✅ | ❌ |
| Gerenciar usuários | ✅ | ❌ |
| Exportar dados | ✅ | ✅ |

---

## 🧮 Lógica de Cálculo do Score

```typescript
// Exemplo de cálculo
interface Resposta {
  pergunta_key: string;
  valor: string | number;
  peso: number;
}

function calcularScore(respostas: Resposta[]): number {
  let pontuacaoTotal = 0;
  let pesoTotal = 0;
  
  for (const resposta of respostas) {
    const pontos = calcularPontosResposta(resposta);
    pontuacaoTotal += pontos * resposta.peso;
    pesoTotal += resposta.peso;
  }
  
  // Score de 0 a 10
  return (pontuacaoTotal / pesoTotal) * 10;
}

// Faixas de resultado
function getResultado(score: number): Resultado {
  if (score >= 8) {
    return {
      nivel: 'Alto Potencial',
      diagnostico: 'Você está pronto para escalar...',
      recomendacao: 'Mentoria Premium',
      cor: 'green'
    };
  } else if (score >= 5) {
    return {
      nivel: 'Potencial Moderado',
      diagnostico: 'Você tem uma boa base...',
      recomendacao: 'Mentoria Essencial',
      cor: 'yellow'
    };
  } else {
    return {
      nivel: 'Fase Inicial',
      diagnostico: 'Você precisa estruturar...',
      recomendacao: 'Mentoria Fundamentos',
      cor: 'blue'
    };
  }
}
```

---

## 🚀 Fases de Desenvolvimento

### FASE 1: Configuração Base (2-3 dias)
- [ ] Configurar projeto Next.js (frontend)
- [ ] Configurar projeto NestJS (backend)
- [ ] Configurar PostgreSQL (Docker local)
- [ ] Configurar Prisma ORM
- [ ] Criar estrutura base de pastas
- [ ] Configurar ESLint, Prettier
- [ ] Criar .env.example

### FASE 2: Backend - Autenticação (2-3 dias)
- [ ] Módulo de Users (CRUD)
- [ ] Módulo de Auth (login, registro, JWT)
- [ ] Guards de proteção de rotas
- [ ] Middleware de roles
- [ ] Hash de senhas (bcrypt)

### FASE 3: Backend - Core (3-4 dias)
- [ ] Módulo de Leads (CRUD)
- [ ] Módulo de Responses (CRUD)
- [ ] Módulo de FormQuestions (CRUD)
- [ ] Lógica de cálculo de score
- [ ] Endpoints de analytics

### FASE 4: Frontend - Autenticação (2 dias)
- [ ] Página de login
- [ ] Contexto de autenticação
- [ ] Proteção de rotas
- [ ] Interceptor de API

### FASE 5: Frontend - Formulário (4-5 dias)
- [ ] Componente de formulário wizard
- [ ] Etapas do formulário
- [ ] Validação de campos
- [ ] Envio para API
- [ ] Página de resultado
- [ ] Animações e UX

### FASE 6: Frontend - Dashboard (3-4 dias)
- [ ] Layout do dashboard
- [ ] Cards de métricas
- [ ] Gráficos (recharts/chart.js)
- [ ] Lista de leads
- [ ] Detalhes do lead
- [ ] Filtros e busca

### FASE 7: Frontend - Configurações (2 dias)
- [ ] CRUD de perguntas
- [ ] Configuração de pesos
- [ ] Gestão de usuários

### FASE 8: Testes e Ajustes (2-3 dias)
- [ ] Testes manuais
- [ ] Correção de bugs
- [ ] Otimização de performance
- [ ] Responsividade mobile

### FASE 9: Deploy e Entrega (1-2 dias)
- [ ] Deploy do backend (Render/Railway)
- [ ] Deploy do frontend (Vercel)
- [ ] Configurar banco de produção
- [ ] Configurar domínio
- [ ] Documentação final

---

## 🛠️ Stack Tecnológica Detalhada

### Frontend
| Tecnologia | Uso |
|------------|-----|
| Next.js 14+ | Framework React com App Router |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| shadcn/ui | Componentes UI |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas |
| Zustand | Estado global |
| TanStack Query | Cache e fetch de dados |
| Recharts | Gráficos |
| Framer Motion | Animações |

### Backend
| Tecnologia | Uso |
|------------|-----|
| NestJS | Framework Node.js |
| TypeScript | Tipagem estática |
| Prisma | ORM |
| PostgreSQL | Banco de dados |
| Passport.js | Autenticação |
| JWT | Tokens |
| Class-validator | Validação de DTOs |
| Swagger | Documentação da API |

### DevOps
| Tecnologia | Uso |
|------------|-----|
| Docker | Ambiente de desenvolvimento |
| Vercel | Deploy frontend |
| Render/Railway | Deploy backend |
| Supabase/Neon | PostgreSQL na nuvem |
| GitHub Actions | CI/CD (opcional) |

---

## 📋 Checklist de Entregáveis

- [ ] Sistema 100% funcional online
- [ ] Código-fonte no repositório Git
- [ ] Documentação da API (Swagger)
- [ ] README com instruções
- [ ] Banco de dados estruturado
- [ ] Layout responsivo testado
- [ ] Credenciais de acesso admin
- [ ] URL de produção
- [ ] Backup do banco de dados

---

## 🔗 URLs do Sistema (Sugestão)

```
Produção:
- Frontend: https://plataforma.dominiocliente.com.br
- API: https://api.plataforma.dominiocliente.com.br
- Formulário: https://plataforma.dominiocliente.com.br/formulario

Desenvolvimento:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Database: postgresql://localhost:5432/thiago_platform
```

---

## ⏱️ Cronograma Estimado

| Fase | Duração | Acumulado |
|------|---------|-----------|
| Fase 1: Configuração | 2-3 dias | 3 dias |
| Fase 2: Auth Backend | 2-3 dias | 6 dias |
| Fase 3: Core Backend | 3-4 dias | 10 dias |
| Fase 4: Auth Frontend | 2 dias | 12 dias |
| Fase 5: Formulário | 4-5 dias | 17 dias |
| Fase 6: Dashboard | 3-4 dias | 21 dias |
| Fase 7: Configurações | 2 dias | 23 dias |
| Fase 8: Testes | 2-3 dias | 26 dias |
| Fase 9: Deploy | 1-2 dias | 28 dias |

**Total estimado: 4 semanas (20-28 dias úteis)**

---

## 🎨 Identidade Visual (Sugestão)

```css
/* Cores principais */
--primary: #2563eb;      /* Azul profissional */
--secondary: #10b981;    /* Verde sucesso */
--accent: #f59e0b;       /* Amarelo destaque */
--background: #0f172a;   /* Azul escuro (modo dark) */
--surface: #1e293b;      /* Superfícies */
--text: #f8fafc;         /* Texto claro */

/* Tipografia */
font-family: 'Plus Jakarta Sans', sans-serif;
```

---

## 📞 Próximos Passos

1. **Validar este planejamento** com você
2. **Definir perguntas do formulário** específicas do negócio
3. **Definir lógica de scores** e resultados
4. **Iniciar Fase 1** - Configuração do projeto

---

*Documento criado em: 29/12/2024*
*Versão: 1.0*

