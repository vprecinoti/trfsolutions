"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X, Save, Loader2, Calendar, DollarSign, Briefcase, ChevronDown, ChevronRight, User, Building2, Laptop, Stethoscope, StickyNote, Target, Landmark, Shield, Palmtree, PieChart, Home, Car, Plane, Users, CreditCard, Sparkles, Plus, TrendingUp, TrendingDown, Trash2, Tag, Wallet, Heart, Baby, Dog, UserPlus, Banknote, Receipt, ShoppingCart, Pencil, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  getFormulario, 
  updateFormulario, 
  completeFormulario,
  Formulario 
} from "@/lib/api/formularios";
import { ContratoModal } from "@/components/contract/ContratoModal";
import type { DadosContrato } from "@/components/contract/ContratoModal";

// Tipos
interface Objetivo {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  imagem: string;
}

// Mapeamento de ícones monocromáticos
const iconesObjetivos: Record<string, typeof Home> = {
  imovel: Home,
  veiculo: Car,
  viagens: Plane,
  aposentadoria: Palmtree,
  familia: Users,
  organizacao: PieChart,
  dividas: CreditCard,
  outro: Sparkles,
};

// Lista de objetivos financeiros
const objetivos: Objetivo[] = [
  {
    id: "imovel",
    titulo: "Aquisição de Imóvel",
    descricao: "Realização do sonho da casa própria ou investimento em imóveis",
    icone: "imovel",
    imagem: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  },
  {
    id: "veiculo",
    titulo: "Aquisição de Automóvel",
    descricao: "Conquista do carro ou moto ideal para o seu dia a dia",
    icone: "veiculo",
    imagem: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
  },
  {
    id: "viagens",
    titulo: "Viagens e Experiências",
    descricao: "Planejamento de viagens nacionais e internacionais",
    icone: "viagens",
    imagem: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
  },
  {
    id: "aposentadoria",
    titulo: "Aposentadoria",
    descricao: "Preparação para independência financeira futura",
    icone: "aposentadoria",
    imagem: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&q=80",
  },
  {
    id: "familia",
    titulo: "Segurança Financeira Familiar",
    descricao: "Planejamento para dar segurança e tranquilidade à família",
    icone: "familia",
    imagem: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80",
  },
  {
    id: "organizacao",
    titulo: "Organização Financeira",
    descricao: "Gestão eficiente do orçamento e das contas pessoais",
    icone: "organizacao",
    imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  },
  {
    id: "dividas",
    titulo: "Quitação de Dívidas",
    descricao: "Eliminação de dívidas e limpeza do nome",
    icone: "dividas",
    imagem: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
  },
  {
    id: "outro",
    titulo: "Outro",
    descricao: "Defina um objetivo personalizado e único para você",
    icone: "outro",
    imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

// Perguntas para cada objetivo
const perguntasPorObjetivo: Record<string, { 
  pergunta: string; 
  tipo: "texto" | "textarea" | "radio" | "numero" | "data" | "dinheiro"; 
  opcoes?: string[];
  condicional?: { perguntaIndex: number; valor: string }; // Mostra esta pergunta apenas se outra pergunta tiver um valor específico
}[]> = {
  imovel: [
    { pergunta: "Por que você quer adquirir um imóvel?", tipo: "textarea" },
    { pergunta: "Quando você quer conquistar esse objetivo? *", tipo: "data" },
    { pergunta: "Quanto você precisa para conquistar esse objetivo? *", tipo: "dinheiro" },
    { pergunta: "Você tem algum valor guardado para esse objetivo? *", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Quanto você tem guardado? *", tipo: "dinheiro", condicional: { perguntaIndex: 3, valor: "Sim" } },
    { pergunta: "Você está guardando mensalmente para ele? *", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "É para investimento ou consumo próprio?", tipo: "radio", opcoes: ["Investimento", "Consumo próprio", "Ambos"] },
    { pergunta: "Como você pretende realizar e como você tem a certeza que é a melhor estratégia?", tipo: "textarea" },
  ],
  veiculo: [
    { pergunta: "Por quê esse objetivo é uma prioridade e o que representa a realização dele pra você?", tipo: "textarea" },
    { pergunta: "Quando você quer conquistar esse objetivo? *", tipo: "data" },
    { pergunta: "Quanto você precisa para conquistar esse objetivo? *", tipo: "dinheiro" },
    { pergunta: "Você tem algum valor guardado para esse objetivo? *", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Quanto você tem guardado? *", tipo: "dinheiro", condicional: { perguntaIndex: 3, valor: "Sim" } },
    { pergunta: "Você está guardando mensalmente para ele? *", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Como você pretende realizar e como você tem a certeza que é a melhor estratégia?", tipo: "textarea" },
  ],
  viagens: [
    { pergunta: "Por que viajar é importante para você?", tipo: "textarea" },
    { pergunta: "Quando pretende realizar essa viagem? *", tipo: "data" },
    { pergunta: "Quanto pretende investir nessa viagem? *", tipo: "dinheiro" },
    { pergunta: "Já utiliza milhas aéreas?", tipo: "radio", opcoes: ["Sim", "Não", "Não sei como funciona"] },
    { pergunta: "É uma viagem específica ou você quer viajar periodicamente?", tipo: "radio", opcoes: ["Viagem específica", "Viagens periódicas"] },
    { pergunta: "Para onde você quer ir?", tipo: "texto" },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
  aposentadoria: [
    { pergunta: "Por que a aposentadoria é importante para você?", tipo: "textarea" },
    { pergunta: "Quando pretende se aposentar? *", tipo: "data" },
    { pergunta: "Qual renda passiva mensal você deseja ter? *", tipo: "dinheiro" },
    { pergunta: "Qual montante você precisa ter acumulado? *", tipo: "dinheiro" },
    { pergunta: "Quanto você precisa guardar por mês para alcançar esse objetivo? *", tipo: "dinheiro" },
    { pergunta: "Qual seria o melhor investimento para esse objetivo na sua opinião?", tipo: "textarea" },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
  familia: [
    { pergunta: "O que traria segurança para sua família?", tipo: "textarea" },
    { pergunta: "Você já tem uma reserva de emergência?", tipo: "radio", opcoes: ["Sim", "Estou construindo", "Não"] },
    { pergunta: "Possui seguro de vida?", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
  organizacao: [
    { pergunta: "Por que você quer se organizar financeiramente?", tipo: "textarea" },
    { pergunta: "Utiliza Excel ou algum aplicativo para controle financeiro?", tipo: "radio", opcoes: ["Sim, uso Excel", "Sim, uso aplicativo", "Não uso nada"] },
    { pergunta: "Se não usa, por que não?", tipo: "textarea" },
    { pergunta: "Você acredita que um aplicativo ajudaria você a se organizar melhor?", tipo: "radio", opcoes: ["Sim", "Talvez", "Não"] },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
  dividas: [
    { pergunta: "Por que você quer quitar suas dívidas?", tipo: "textarea" },
    { pergunta: "Como chegou nessa situação de endividamento?", tipo: "textarea" },
    { pergunta: "Qual o tipo da dívida principal?", tipo: "radio", opcoes: ["Cartão de crédito", "Cheque especial", "Empréstimo pessoal", "Financiamento", "Outro"] },
    { pergunta: "Qual o valor total das dívidas?", tipo: "numero" },
    { pergunta: "Há quanto tempo está endividado?", tipo: "texto" },
    { pergunta: "Já recebeu proposta de negociação?", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Está com nome no Serasa/SPC?", tipo: "radio", opcoes: ["Sim", "Não", "Não sei"] },
    { pergunta: "Tem dificuldade em conseguir crédito por conta disso?", tipo: "radio", opcoes: ["Sim", "Não"] },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
  outro: [
    { pergunta: "Qual é o seu objetivo?", tipo: "textarea" },
    { pergunta: "Por que esse objetivo é importante para você?", tipo: "textarea" },
    { pergunta: "Quando pretende alcançá-lo?", tipo: "texto" },
    { pergunta: "Quanto precisa para alcançar esse objetivo?", tipo: "numero" },
    { pergunta: "Qual é o seu plano para alcançar esse objetivo?", tipo: "textarea" },
    { pergunta: "O que você tem feito na prática para realizar esse objetivo?", tipo: "textarea" },
  ],
};

// ============================================
// SEÇÕES DO FORMULÁRIO
// ============================================

// Seções do formulário (após objetivos)
const secoesFormulario = [
  { id: "situacao", titulo: "Situação Profissional", subtitulo: "Vamos entender sua situação financeira atual", icone: Briefcase },
  { id: "patrimonio", titulo: "Patrimônio e Dívidas", subtitulo: "Entendendo sua situação patrimonial", icone: Landmark },
  { id: "protecao", titulo: "Proteção Financeira", subtitulo: "Sua segurança e da sua família", icone: Shield },
  { id: "aposentadoria", titulo: "Aposentadoria", subtitulo: "Planejando seu futuro", icone: Palmtree },
  { id: "orcamento", titulo: "Orçamento", subtitulo: "Entradas e saídas mensais", icone: PieChart },
];

// Bancos e instituições financeiras
const bancosPopulares = [
  { codigo: "001", nome: "Banco do Brasil", logo: "🏦" },
  { codigo: "341", nome: "Itaú Unibanco", logo: "🏧" },
  { codigo: "033", nome: "Banco Santander", logo: "🏦" },
  { codigo: "260", nome: "Nu Pagamentos (Nubank)", logo: "💜" },
  { codigo: "237", nome: "Banco Bradesco", logo: "🏦" },
  { codigo: "348", nome: "Banco XP S.A.", logo: "📈" },
  { codigo: "077", nome: "Banco Inter S.A.", logo: "🟠" },
];

const todasInstituicoes = [
  "Banco do Brasil", "Itaú Unibanco", "Banco Santander", "Nubank", "Bradesco",
  "Banco XP", "Banco Inter", "Caixa Econômica Federal", "BTG Pactual", "C6 Bank",
  "Original", "Safra", "Sicredi", "Sicoob", "Banrisul", "BV", "Pan", "Neon",
  "PicPay", "Mercado Pago", "PagBank", "Rico", "Clear", "Modal Mais", "Genial",
  "Guide", "Órama", "Easynvest", "Warren", "Magnetis", "Monetus", "Vitreo",
];

const categoriasImovel = [
  "Casa", "Apartamento", "Terreno", "Sala Comercial", "Galpão", "Fazenda", "Sítio", "Chácara", "Outro"
];

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const tiposDivida = [
  "Financiamento Imobiliário", "Financiamento de Veículo", "Empréstimo Pessoal",
  "Cartão de Crédito", "Cheque Especial", "Consignado", "Crédito Estudantil",
  "Dívida com Terceiros", "Outro"
];

const tiposOutrosBens = [
  "Jóias", "Arte/Colecionáveis", "Equipamentos", "Eletrônicos", "Móveis", "Outro"
];

const marcasAutomoveis = [
  "Fiat", "Volkswagen", "Chevrolet", "Ford", "Toyota", "Honda", "Hyundai", "Renault",
  "Jeep", "Nissan", "Peugeot", "Citroën", "BMW", "Mercedes-Benz", "Audi", "Volvo",
  "Kia", "Mitsubishi", "Land Rover", "Porsche", "Yamaha", "Honda Motos", "Kawasaki", "Outro"
];

// Opções para Proteção Financeira
const estadosCivis = [
  "Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)", "Separado(a)"
];

const tiposPartilha = [
  "Comunhão Parcial de Bens", "Comunhão Universal de Bens", "Separação Total de Bens", "Participação Final nos Aquestos"
];

const generos = [
  { id: "feminino", label: "Feminino" },
  { id: "masculino", label: "Masculino" },
  { id: "outro", label: "Outro" },
  { id: "nao_informar", label: "Prefiro não informar" },
];

const tiposPets = [
  "Cachorro", "Gato", "Pássaro", "Peixe", "Hamster", "Coelho", "Tartaruga", "Outro"
];

const planosSaude = [
  "Amil", "Bradesco Saúde", "SulAmérica", "Unimed", "Notre Dame Intermédica",
  "Hapvida", "Prevent Senior", "Porto Seguro Saúde", "Allianz Saúde", "Golden Cross",
  "Mediservice", "Care Plus", "Omint", "Outro"
];

// Opções de idade para aposentadoria
const idadesAposentadoria = Array.from({ length: 41 }, (_, i) => 40 + i); // 40 a 80 anos

// Lista de profissões
const profissoes = [
  // Saúde
  "Médico(a)",
  "Enfermeiro(a)",
  "Dentista",
  "Fisioterapeuta",
  "Psicólogo(a)",
  "Nutricionista",
  "Farmacêutico(a)",
  "Veterinário(a)",
  "Biomédico(a)",
  "Fonoaudiólogo(a)",
  "Terapeuta Ocupacional",
  
  // Direito e Segurança
  "Advogado(a)",
  "Juiz(a)",
  "Promotor(a)",
  "Delegado(a)",
  "Policial Militar",
  "Policial Civil",
  "Policial Federal",
  "Bombeiro(a)",
  "Militar",
  "Agente Penitenciário",
  
  // Engenharia e Arquitetura
  "Engenheiro(a) Civil",
  "Engenheiro(a) Mecânico",
  "Engenheiro(a) Elétrico",
  "Engenheiro(a) de Produção",
  "Engenheiro(a) de Software",
  "Engenheiro(a) Ambiental",
  "Engenheiro(a) Químico",
  "Arquiteto(a)",
  "Designer de Interiores",
  
  // Tecnologia
  "Desenvolvedor(a) de Software",
  "Analista de Sistemas",
  "Cientista de Dados",
  "Analista de TI",
  "DevOps",
  "UX/UI Designer",
  "Product Manager",
  "Scrum Master",
  "QA/Tester",
  "DBA",
  "Suporte Técnico",
  
  // Negócios e Finanças
  "Administrador(a)",
  "Contador(a)",
  "Economista",
  "Analista Financeiro",
  "Controller",
  "Auditor(a)",
  "Consultor(a) Empresarial",
  "Gestor(a) de Projetos",
  "Analista de Investimentos",
  "Corretor(a) de Imóveis",
  "Corretor(a) de Seguros",
  "Assessor(a) de Investimentos",
  
  // Educação
  "Professor(a)",
  "Pedagogo(a)",
  "Coordenador(a) Pedagógico",
  "Diretor(a) Escolar",
  "Tutor(a)",
  "Instrutor(a)",
  
  // Comunicação e Marketing
  "Jornalista",
  "Publicitário(a)",
  "Relações Públicas",
  "Social Media",
  "Redator(a)",
  "Editor(a)",
  "Fotógrafo(a)",
  "Videomaker",
  "Designer Gráfico",
  "Analista de Marketing",
  
  // Vendas e Comércio
  "Vendedor(a)",
  "Representante Comercial",
  "Gerente de Vendas",
  "Executivo(a) de Contas",
  "Comprador(a)",
  "Lojista",
  "Comerciante",
  
  // Serviços
  "Cabeleireiro(a)",
  "Esteticista",
  "Personal Trainer",
  "Chef de Cozinha",
  "Garçom/Garçonete",
  "Recepcionista",
  "Secretário(a)",
  "Assistente Administrativo",
  "Porteiro(a)",
  "Zelador(a)",
  "Motorista",
  "Motoboy/Entregador",
  
  // Indústria e Construção
  "Técnico(a) em Segurança do Trabalho",
  "Técnico(a) em Enfermagem",
  "Técnico(a) em Eletrônica",
  "Técnico(a) em Mecânica",
  "Eletricista",
  "Encanador(a)",
  "Pedreiro(a)",
  "Carpinteiro(a)",
  "Pintor(a)",
  "Soldador(a)",
  "Operador(a) de Máquinas",
  
  // Agro e Meio Ambiente
  "Agrônomo(a)",
  "Zootecnista",
  "Produtor(a) Rural",
  "Técnico(a) Agrícola",
  "Biólogo(a)",
  "Gestor(a) Ambiental",
  
  // Arte e Entretenimento
  "Músico(a)",
  "Ator/Atriz",
  "Produtor(a) Cultural",
  "DJ",
  "Locutor(a)",
  "Apresentador(a)",
  
  // Outros
  "Empresário(a)",
  "Empreendedor(a)",
  "Autônomo(a)",
  "Freelancer",
  "Aposentado(a)",
  "Estudante",
  "Do Lar",
  "Desempregado(a)",
  "Servidor(a) Público",
  "Funcionário(a) Público",
  "Estagiário(a)",
  "Trainee",
  "Outro",
].sort();

// Regimes de trabalho
const regimesTrabalho = [
  { id: "autonomo", label: "Autônomo", icone: User },
  { id: "clt", label: "CLT", icone: Building2 },
  { id: "pj", label: "PJ", icone: Laptop },
  { id: "liberal", label: "Profissional Liberal", icone: Stethoscope },
  { id: "servidor", label: "Servidor Público", icone: Building2 },
  { id: "empresario", label: "Empresário", icone: Briefcase },
];

// Funções auxiliares para formatação
const formatCurrency = (value: string | number): string => {
  // Se for número, formata diretamente
  if (typeof value === "number") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  
  // Converte para número e formata como moeda brasileira
  const amount = Number(numbers) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

const formatCurrencyNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (value: string): string => {
  if (!value) return "";
  
  // Se já está formatado, retorna como está
  if (value.includes("/")) {
    return value;
  }
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  
  // Formata como DD/MM/YYYY
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const parseCurrency = (value: string): string => {
  // Remove formatação e retorna apenas números
  return value.replace(/\D/g, "");
};

const parseCurrencyToNumber = (value: string): number => {
  // Remove formatação e retorna como número (centavos)
  const numbers = value.replace(/\D/g, "");
  return numbers ? parseInt(numbers, 10) / 100 : 0;
};

const parseDate = (value: string): string => {
  // Remove formatação e retorna formatado como DD/MM/YYYY para salvar
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

function FormularioNovoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formularioId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [step, setStep] = useState(0); // 0 = seleção de objetivos
  const [objetivosSelecionados, setObjetivosSelecionados] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<Record<string, Record<number, string>>>({});
  const [dadosCliente, setDadosCliente] = useState({ nome: "", email: "", telefone: "" });
  
  // Novos estados para as seções adicionais
  const [situacaoProfissional, setSituacaoProfissional] = useState({
    profissao: "",
    regime: "",
  });
  const [notas, setNotas] = useState("");
  const [showNotasModal, setShowNotasModal] = useState(false);

  // Estados para Patrimônio e Dívidas
  const [patrimonio, setPatrimonio] = useState({
    instituicaoFinanceira: "",
    perfilInvestidor: "",
    moradiaAtual: "",
  });
  
  // Listas de patrimônio
  const [imoveis, setImoveis] = useState<Array<{
    id: string;
    nome: string;
    valor: string;
    categoria: string;
    estado: string;
    cidade: string;
    quitado: string;
    segurado: string;
    reside: string;
    alugando: string;
    descricao: string;
  }>>([]);
  
  const [automoveis, setAutomoveis] = useState<Array<{
    id: string;
    nome: string;
    marca: string;
    modelo: string;
    ano: string;
    valor: string;
    quitado: string;
    segurado: string;
  }>>([]);
  
  const [aplicacoesFinanceiras, setAplicacoesFinanceiras] = useState({
    bancosInveste: [] as string[],
    corretorasInveste: [] as string[],
    rendaFixa: "",
    fundosInvestimento: "",
    previdenciaPrivada: "",
    acoes: "",
    coe: "",
    criptomoedas: "",
    outro: "",
  });
  
  const [dividas, setDividas] = useState<Array<{
    id: string;
    nome: string;
    tipo: string;
    instituicao: string;
    garantia: string;
    saldoDevedor: string;
  }>>([]);
  
  const [outrosBens, setOutrosBens] = useState<Array<{
    id: string;
    nome: string;
    tipo: string;
    valor: string;
  }>>([]);
  
  // Modais
  const [modalImovel, setModalImovel] = useState(false);
  const [modalAutomovel, setModalAutomovel] = useState(false);
  const [modalDivida, setModalDivida] = useState(false);
  const [modalOutroBem, setModalOutroBem] = useState(false);
  
  // Estados temporários para modais
  const [novoImovel, setNovoImovel] = useState({
    nome: "", valor: "", categoria: "", estado: "", cidade: "",
    quitado: "", segurado: "", reside: "", alugando: "", descricao: ""
  });
  const [novoAutomovel, setNovoAutomovel] = useState({
    nome: "", marca: "", modelo: "", ano: "", valor: "", quitado: "", segurado: ""
  });
  const [novaDivida, setNovaDivida] = useState({
    nome: "", tipo: "", instituicao: "", garantia: "", saldoDevedor: ""
  });
  const [novoOutroBem, setNovoOutroBem] = useState({
    nome: "", tipo: "", valor: ""
  });
  
  // Tab ativa na seção de patrimônio
  const [patrimonioTab, setPatrimonioTab] = useState<"imoveis" | "automoveis" | "aplicacoes" | "dividas" | "outros">("imoveis");

  // Estados para Proteção Financeira
  const [infoFamiliar, setInfoFamiliar] = useState({
    estadoCivil: "",
    tabFamiliar: "estadoCivil" as "estadoCivil" | "filhos" | "pets",
  });

  const [conjuge, setConjuge] = useState({
    nome: "",
    dataNascimento: "",
    tipoPartilha: "",
    profissao: "",
    genero: "",
  });

  const [filhos, setFilhos] = useState<Array<{
    id: string;
    nome: string;
    dataNascimento: string;
    genero: string;
  }>>([]);

  const [pets, setPets] = useState<Array<{
    id: string;
    nome: string;
    tipo: string;
    raca: string;
  }>>([]);

  const [protecaoFinanceira, setProtecaoFinanceira] = useState({
    possuiPlanoSaude: "",
    planoEmpresa: "",
    instituicaoPlano: "",
    protecaoForcaTrabalho: "",
    protecaoDependentes: "",
    seguroBensTrabalho: "",
    conheceEstrategiasSucessao: "",
    possuiEstrategiaSucessao: "",
  });

  // Modais para Proteção Financeira
  const [modalFilho, setModalFilho] = useState(false);
  const [modalPet, setModalPet] = useState(false);

  const [novoFilho, setNovoFilho] = useState({ nome: "", dataNascimento: "", genero: "" });
  const [novoPet, setNovoPet] = useState({ nome: "", tipo: "", raca: "" });

  // Estados para Aposentadoria
  const [aposentadoria, setAposentadoria] = useState({
    ultimaDeclaracaoIR: "",
    conheceVantagensTributarias: "",
    restituiuAnoAnterior: "",
    dataNascimento: "",
    jaAposentado: "",
    idadeDesejadaAposentadoria: "",
    rendaDesejadaAposentadoria: "",
    possuiEstrategiaAposentadoria: "",
    fezProjecaoAposentadoria: "",
  });

  // Estados para Orçamento
  const [habitosConsumo, setHabitosConsumo] = useState({
    formaGastosMaisUsada: "",
    costumaParcelar: "",
    detalhes: "",
  });

  const [outrasInfoOrcamento, setOutrasInfoOrcamento] = useState({
    conheceEstrategiasMilhas: "",
    fazControleGastos: "",
    investeMensalmente: "",
  });

  const [cartoesCredito, setCartoesCredito] = useState<Array<{
    id: string;
    nome: string;
    descricao: string;
    limiteTotal: string;
    limiteDisponivel: string;
  }>>([]);

  const [modalCartao, setModalCartao] = useState(false);
  const [novoCartao, setNovoCartao] = useState({
    nome: "", descricao: "", limiteTotal: "", limiteDisponivel: ""
  });

  // Renda - estrutura com categorias e subcategorias
  const [rendas, setRendas] = useState<Array<{
    id: string;
    categoria: string;
    valorBruto: string;
    valorLiquido: string;
    expandido: boolean;
    subcategorias: Array<{ id: string; nome: string; valorBruto: string; valorLiquido: string; }>;
  }>>([
    { id: "1", categoria: "Retorno investimentos", valorBruto: "", valorLiquido: "", expandido: false, subcategorias: [] },
    { id: "2", categoria: "Pró-labore", valorBruto: "", valorLiquido: "", expandido: false, subcategorias: [] },
    { id: "3", categoria: "Salário", valorBruto: "", valorLiquido: "", expandido: false, subcategorias: [] },
    { id: "4", categoria: "Recebimento Aluguel", valorBruto: "", valorLiquido: "", expandido: false, subcategorias: [] },
    { id: "5", categoria: "Aposentadoria", valorBruto: "", valorLiquido: "", expandido: false, subcategorias: [] },
  ]);

  // Gastos Fixos - estrutura com categorias e subcategorias pré-definidas
  const [gastosFixos, setGastosFixos] = useState<Array<{
    id: string;
    categoria: string;
    valor: string;
    expandido: boolean;
    subcategorias: Array<{ id: string; nome: string; valor: string; }>;
  }>>([
    { id: "gf1", categoria: "Alimentação", valor: "", expandido: false, subcategorias: [
      { id: "gf1s1", nome: "Restaurantes", valor: "" },
      { id: "gf1s2", nome: "Supermercado", valor: "" },
      { id: "gf1s3", nome: "Delivery", valor: "" },
    ]},
    { id: "gf2", categoria: "Filhos", valor: "", expandido: false, subcategorias: [] },
    { id: "gf3", categoria: "Pet", valor: "", expandido: false, subcategorias: [
      { id: "gf3s1", nome: "Alimentação pet", valor: "" },
      { id: "gf3s2", nome: "Clínica Veterinária", valor: "" },
      { id: "gf3s3", nome: "Pet shop", valor: "" },
      { id: "gf3s4", nome: "Plano de Saúde Pet", valor: "" },
    ]},
    { id: "gf4", categoria: "Serviços de terceiros", valor: "", expandido: false, subcategorias: [
      { id: "gf4s1", nome: "Diarista", valor: "" },
    ]},
    { id: "gf5", categoria: "Automóvel", valor: "", expandido: false, subcategorias: [
      { id: "gf5s1", nome: "Combustível", valor: "" },
      { id: "gf5s2", nome: "Estacionamento", valor: "" },
      { id: "gf5s3", nome: "Pedágio", valor: "" },
      { id: "gf5s4", nome: "Manutenção", valor: "" },
      { id: "gf5s5", nome: "Multa", valor: "" },
    ]},
    { id: "gf6", categoria: "Bem-estar", valor: "", expandido: false, subcategorias: [
      { id: "gf6s1", nome: "Academia", valor: "" },
      { id: "gf6s2", nome: "Esporte", valor: "" },
      { id: "gf6s3", nome: "Personal trainer", valor: "" },
      { id: "gf6s4", nome: "Suplementos", valor: "" },
    ]},
    { id: "gf7", categoria: "Habitação", valor: "", expandido: false, subcategorias: [
      { id: "gf7s1", nome: "Aluguel", valor: "" },
    ]},
    { id: "gf8", categoria: "Saúde", valor: "", expandido: false, subcategorias: [
      { id: "gf8s1", nome: "Dentista", valor: "" },
      { id: "gf8s2", nome: "Consulta Médica Particular", valor: "" },
      { id: "gf8s3", nome: "Plano de saúde", valor: "" },
      { id: "gf8s4", nome: "Terapia", valor: "" },
      { id: "gf8s5", nome: "Nutricionista", valor: "" },
    ]},
    { id: "gf9", categoria: "Dívidas", valor: "", expandido: false, subcategorias: [
      { id: "gf9s1", nome: "Empréstimo", valor: "" },
      { id: "gf9s2", nome: "Financiamento", valor: "" },
    ]},
    { id: "gf10", categoria: "Contas residenciais", valor: "", expandido: false, subcategorias: [
      { id: "gf10s1", nome: "Internet", valor: "" },
      { id: "gf10s2", nome: "Plano de Celular", valor: "" },
      { id: "gf10s3", nome: "Água", valor: "" },
      { id: "gf10s4", nome: "Energia", valor: "" },
      { id: "gf10s5", nome: "Gás", valor: "" },
      { id: "gf10s6", nome: "Condomínio", valor: "" },
    ]},
    { id: "gf11", categoria: "Impostos", valor: "", expandido: false, subcategorias: [
      { id: "gf11s1", nome: "IPTU", valor: "" },
      { id: "gf11s2", nome: "IPVA", valor: "" },
      { id: "gf11s3", nome: "DAS", valor: "" },
    ]},
    { id: "gf12", categoria: "Seguros", valor: "", expandido: false, subcategorias: [
      { id: "gf12s1", nome: "Seguro de vida", valor: "" },
      { id: "gf12s2", nome: "Seguro residencial", valor: "" },
      { id: "gf12s3", nome: "Seguro automotivo", valor: "" },
    ]},
    { id: "gf13", categoria: "Educação", valor: "", expandido: false, subcategorias: [
      { id: "gf13s1", nome: "Cursos", valor: "" },
    ]},
    { id: "gf14", categoria: "Assinaturas", valor: "", expandido: false, subcategorias: [
      { id: "gf14s1", nome: "Netflix", valor: "" },
      { id: "gf14s2", nome: "Disney+", valor: "" },
      { id: "gf14s3", nome: "Prime Video", valor: "" },
      { id: "gf14s4", nome: "Spotify", valor: "" },
      { id: "gf14s5", nome: "Deezer", valor: "" },
    ]},
    { id: "gf15", categoria: "Dízimo", valor: "", expandido: false, subcategorias: [
      { id: "gf15s1", nome: "Sem subcategoria", valor: "" },
    ]},
    { id: "gf16", categoria: "Taxas", valor: "", expandido: false, subcategorias: [
      { id: "gf16s1", nome: "Taxas bancárias", valor: "" },
      { id: "gf16s2", nome: "Anuidade cartão", valor: "" },
    ]},
  ]);

  // Gastos Variáveis
  const [gastosVariaveis, setGastosVariaveis] = useState<Array<{
    id: string;
    categoria: string;
    valor: string;
    expandido: boolean;
    subcategorias: Array<{ id: string; nome: string; valor: string; }>;
  }>>([
    { id: "gv1", categoria: "Estética e Beleza", valor: "", expandido: false, subcategorias: [] },
    { id: "gv2", categoria: "Farmácia", valor: "", expandido: false, subcategorias: [] },
    { id: "gv3", categoria: "Viagens", valor: "", expandido: false, subcategorias: [] },
    { id: "gv4", categoria: "Transporte", valor: "", expandido: false, subcategorias: [] },
    { id: "gv5", categoria: "Compras", valor: "", expandido: false, subcategorias: [] },
    { id: "gv6", categoria: "Lazer", valor: "", expandido: false, subcategorias: [] },
    { id: "gv7", categoria: "Presentes", valor: "", expandido: false, subcategorias: [] },
    { id: "gv8", categoria: "Doação", valor: "", expandido: false, subcategorias: [] },
  ]);

  // Investimentos mensais
  const [investimentosMensais, setInvestimentosMensais] = useState("");
  const [protecaoMensal, setProtecaoMensal] = useState("");

  // Rentabilidade e Projeção
  const [taxaRentabilidade, setTaxaRentabilidade] = useState("15");

  // Estados para Recomendações (indicações)
  const [showRecomendacaoModal, setShowRecomendacaoModal] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState<Array<{
    id: string;
    nome: string;
    celular: string;
    genero: string;
    circuloSocial: string;
    estadoCivil: string;
    temFilhos: string;
    profissao: string;
    comentario: string;
  }>>([]);
  const [novaRecomendacao, setNovaRecomendacao] = useState({
    nome: "",
    celular: "",
    genero: "",
    circuloSocial: "",
    estadoCivil: "",
    temFilhos: "",
    profissao: "",
    comentario: "",
  });
  const [editandoRecomendacao, setEditandoRecomendacao] = useState<string | null>(null);

  // Estados para Proposta Comercial
  const [showProposta, setShowProposta] = useState(false);
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<number | null>(null); // Valor do cupom aplicado
  const [emailContrato, setEmailContrato] = useState("");
  const [enviandoContrato, setEnviandoContrato] = useState(false);
  const [planoAcompanhamento, setPlanoAcompanhamento] = useState<"standard" | "premium" | "infinity" | "nenhum">("standard");
  const [showContratoModal, setShowContratoModal] = useState(false);

  // Carregar formulário existente
  useEffect(() => {
    if (formularioId) {
      loadFormulario();
    } else {
      setLoading(false);
    }
  }, [formularioId]);

  const loadFormulario = async () => {
    try {
      const data = await getFormulario(formularioId!);
      setObjetivosSelecionados((data.objetivosSelecionados as string[]) || []);
      setStep(data.stepAtual);
      setDadosCliente({
        nome: data.clienteNome || "",
        email: data.clienteEmail || "",
        telefone: data.clienteTelefone || "",
      });
      
      // Carregar dados completos salvos
      const dadosSalvos = data.respostas as Record<string, unknown> || {};
      
      // Respostas dos objetivos
      if (dadosSalvos.objetivos) {
        setRespostas(dadosSalvos.objetivos as Record<string, Record<number, string>>);
      }
      
      // Situação Profissional
      if (dadosSalvos.situacaoProfissional) {
        setSituacaoProfissional(dadosSalvos.situacaoProfissional as { profissao: string; regime: string });
      }
      
      // Patrimônio
      if (dadosSalvos.patrimonio) {
        setPatrimonio(dadosSalvos.patrimonio as { instituicaoFinanceira: string; perfilInvestidor: string; moradiaAtual: string });
      }
      if (dadosSalvos.imoveis) {
        setImoveis(dadosSalvos.imoveis as typeof imoveis);
      }
      if (dadosSalvos.automoveis) {
        setAutomoveis(dadosSalvos.automoveis as typeof automoveis);
      }
      if (dadosSalvos.aplicacoesFinanceiras) {
        setAplicacoesFinanceiras(dadosSalvos.aplicacoesFinanceiras as typeof aplicacoesFinanceiras);
      }
      if (dadosSalvos.dividas) {
        setDividas(dadosSalvos.dividas as typeof dividas);
      }
      if (dadosSalvos.outrosBens) {
        setOutrosBens(dadosSalvos.outrosBens as typeof outrosBens);
      }
      
      // Proteção Financeira
      if (dadosSalvos.infoFamiliar) {
        setInfoFamiliar(dadosSalvos.infoFamiliar as typeof infoFamiliar);
      }
      if (dadosSalvos.conjuge) {
        setConjuge(dadosSalvos.conjuge as typeof conjuge);
      }
      if (dadosSalvos.filhos) {
        setFilhos(dadosSalvos.filhos as typeof filhos);
      }
      if (dadosSalvos.pets) {
        setPets(dadosSalvos.pets as typeof pets);
      }
      if (dadosSalvos.protecaoFinanceira) {
        setProtecaoFinanceira(dadosSalvos.protecaoFinanceira as typeof protecaoFinanceira);
      }
      if (dadosSalvos.aposentadoria) {
        setAposentadoria(dadosSalvos.aposentadoria as typeof aposentadoria);
      }
      
      // Orçamento
      if (dadosSalvos.rendas) {
        setRendas(dadosSalvos.rendas as typeof rendas);
      }
      if (dadosSalvos.gastosFixos) {
        setGastosFixos(dadosSalvos.gastosFixos as typeof gastosFixos);
      }
      if (dadosSalvos.gastosVariaveis) {
        setGastosVariaveis(dadosSalvos.gastosVariaveis as typeof gastosVariaveis);
      }
      if (dadosSalvos.cartoesCredito) {
        setCartoesCredito(dadosSalvos.cartoesCredito as typeof cartoesCredito);
      }
      if (dadosSalvos.habitosConsumo) {
        setHabitosConsumo(dadosSalvos.habitosConsumo as typeof habitosConsumo);
      }
      if (dadosSalvos.outrasInfoOrcamento) {
        setOutrasInfoOrcamento(dadosSalvos.outrasInfoOrcamento as typeof outrasInfoOrcamento);
      }
      if (dadosSalvos.investimentosMensais) {
        setInvestimentosMensais(dadosSalvos.investimentosMensais as string);
      }
      if (dadosSalvos.protecaoMensal) {
        setProtecaoMensal(dadosSalvos.protecaoMensal as string);
      }
      if (dadosSalvos.taxaRentabilidade) {
        setTaxaRentabilidade(dadosSalvos.taxaRentabilidade as string);
      }
      if (dadosSalvos.notas) {
        setNotas(dadosSalvos.notas as string);
      }
      if (dadosSalvos.recomendacoes) {
        setRecomendacoes(dadosSalvos.recomendacoes as typeof recomendacoes);
      }
    } catch (err) {
      console.error("Erro ao carregar formulário:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save - salva TODOS os dados do formulário
  const autoSave = useCallback(async () => {
    if (!formularioId) return;
    
    try {
      setSaving(true);
      
      // Calcular progresso baseado em quantas seções foram preenchidas
      let secoesConcluidas = 0;
      const totalSecoes = 7; // Cliente + Objetivos + Sit.Prof + Patrimônio + Proteção + Aposentadoria + Orçamento
      
      if (dadosCliente.nome && dadosCliente.email) secoesConcluidas++;
      if (objetivosSelecionados.length > 0) secoesConcluidas++;
      if (situacaoProfissional.profissao) secoesConcluidas++;
      if (patrimonio.instituicaoFinanceira || patrimonio.perfilInvestidor) secoesConcluidas++;
      if (infoFamiliar.estadoCivil) secoesConcluidas++;
      if (rendas.some(r => r.valorLiquido)) secoesConcluidas++;
      if (gastosFixos.some(g => parseCurrencyToNumber(g.valor) > 0 || g.subcategorias.some(s => parseCurrencyToNumber(s.valor) > 0))) secoesConcluidas++;
      
      const progresso = Math.round((secoesConcluidas / totalSecoes) * 100);

      // Criar objeto completo com TODOS os dados do formulário
      const dadosCompletos = {
        // Respostas dos objetivos
        objetivos: respostas,
        // Situação Profissional
        situacaoProfissional,
        // Patrimônio
        patrimonio,
        imoveis,
        automoveis,
        aplicacoesFinanceiras,
        dividas,
        outrosBens,
        // Proteção Financeira
        infoFamiliar,
        conjuge,
        filhos,
        pets,
        protecaoFinanceira,
        aposentadoria,
        // Orçamento
        rendas,
        gastosFixos,
        gastosVariaveis,
        cartoesCredito,
        habitosConsumo,
        outrasInfoOrcamento,
        investimentosMensais,
        protecaoMensal,
        taxaRentabilidade,
        notas,
        // Recomendações
        recomendacoes,
      };

      await updateFormulario(formularioId, {
        objetivosSelecionados,
        respostas: dadosCompletos as unknown as Record<string, Record<number, string>>,
        stepAtual: step,
        progresso,
        clienteNome: dadosCliente.nome || undefined,
        clienteEmail: dadosCliente.email || undefined,
        clienteTelefone: dadosCliente.telefone || undefined,
      });
      
      setLastSaved(new Date());
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  }, [formularioId, objetivosSelecionados, respostas, step, dadosCliente, situacaoProfissional, patrimonio, imoveis, automoveis, aplicacoesFinanceiras, dividas, outrosBens, infoFamiliar, conjuge, filhos, pets, protecaoFinanceira, aposentadoria, rendas, gastosFixos, gastosVariaveis, cartoesCredito, habitosConsumo, outrasInfoOrcamento, investimentosMensais, protecaoMensal, taxaRentabilidade, notas, recomendacoes]);

  // Auto-save com debounce
  useEffect(() => {
    if (!formularioId || loading) return;
    
    const timer = setTimeout(() => {
      autoSave();
    }, 2000); // Salva 2s após última alteração
    
    return () => clearTimeout(timer);
  }, [objetivosSelecionados, respostas, step, dadosCliente, situacaoProfissional, patrimonio, imoveis, automoveis, aplicacoesFinanceiras, dividas, outrosBens, infoFamiliar, conjuge, filhos, pets, protecaoFinanceira, aposentadoria, rendas, gastosFixos, gastosVariaveis, cartoesCredito, habitosConsumo, outrasInfoOrcamento, investimentosMensais, protecaoMensal, taxaRentabilidade, notas, recomendacoes, autoSave, formularioId, loading]);

  // Toggle seleção de objetivo
  const toggleObjetivo = (id: string) => {
    setObjetivosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  // Atualizar resposta
  const setResposta = (objetivoId: string, perguntaIndex: number, valor: string) => {
    setRespostas((prev) => {
      const newRespostas = {
        ...prev,
        [objetivoId]: {
          ...prev[objetivoId],
          [perguntaIndex]: valor,
        },
      };

      // Limpar respostas condicionais quando a condição não for mais atendida
      const perguntas = perguntasPorObjetivo[objetivoId] || [];
      perguntas.forEach((pergunta, idx) => {
        if (pergunta.condicional && pergunta.condicional.perguntaIndex === perguntaIndex) {
          // Se a pergunta que controla a condicional mudou e não atende mais a condição
          if (valor !== pergunta.condicional.valor) {
            // Limpa a resposta da pergunta condicional
            delete newRespostas[objetivoId]?.[idx];
          }
        }
      });

      return newRespostas;
    });
  };

  // Navegar para próximo step
  const proximoStep = () => {
    // Step 0 = Dados do Cliente - validar nome e email
    if (step === 0 && (!dadosCliente.nome || !dadosCliente.email)) {
      alert("Preencha o nome e email do cliente antes de continuar");
      return;
    }
    // Step 1 = Seleção de objetivos - validar se tem pelo menos 1
    if (step === 1 && objetivosSelecionados.length === 0) {
      alert("Selecione pelo menos um objetivo financeiro");
      return;
    }
    setStep((prev) => prev + 1);
  };

  // Navegar para step anterior
  const stepAnterior = () => {
    setStep((prev) => prev - 1);
  };

  // Objetivo atual baseado no step
  // Steps: 0=Cliente, 1=Seleção, 2 a N+1=Perguntas dos objetivos
  const objetivoAtualId = step > 1 && step <= objetivosSelecionados.length + 1 ? objetivosSelecionados[step - 2] : null;
  const objetivoAtual = objetivoAtualId ? objetivos.find((o) => o.id === objetivoAtualId) : null;
  const perguntasAtuais = objetivoAtualId ? perguntasPorObjetivo[objetivoAtualId] : [];

  // Cálculo dos steps
  // Step 0: Dados do Cliente (PRIMEIRO - antes de tudo)
  // Step 1: Seleção de objetivos
  // Steps 2 a N+1: Perguntas de cada objetivo selecionado
  // Step N+2: Situação Profissional
  // Step N+3: Patrimônio e Dívidas
  // Step N+4: Proteção Financeira
  // Step N+5: Aposentadoria
  // Step N+6: Orçamento (FINAL)
  
  const numSecoesExtras = 5; // Situação Profissional + Patrimônio + Proteção + Aposentadoria + Orçamento
  const totalSteps = objetivosSelecionados.length + numSecoesExtras + 2; // +1 dados cliente +1 seleção objetivos
  
  const isClientDataStep = step === 0; // PRIMEIRO passo agora
  const isSelecaoObjetivosStep = step === 1; // Segundo passo
  const isSituacaoProfissionalStep = step === objetivosSelecionados.length + 2;
  const isPatrimonioStep = step === objetivosSelecionados.length + 3;
  const isProtecaoFinanceiraStep = step === objetivosSelecionados.length + 4;
  const isAposentadoriaStep = step === objetivosSelecionados.length + 5;
  const isOrcamentoStep = step === objetivosSelecionados.length + 6; // ÚLTIMO passo agora

  // Funções auxiliares para Orçamento
  const adicionarCartao = () => {
    if (!novoCartao.nome) return;
    setCartoesCredito(prev => [...prev, { ...novoCartao, id: Date.now().toString() }]);
    setNovoCartao({ nome: "", descricao: "", limiteTotal: "", limiteDisponivel: "" });
    setModalCartao(false);
  };

  const toggleGastoFixoExpand = (id: string) => {
    setGastosFixos(prev => prev.map(gf => 
      gf.id === id ? { ...gf, expandido: !gf.expandido } : gf
    ));
  };

  const toggleGastoVariavelExpand = (id: string) => {
    setGastosVariaveis(prev => prev.map(gv => 
      gv.id === id ? { ...gv, expandido: !gv.expandido } : gv
    ));
  };

  const toggleRendaExpand = (id: string) => {
    setRendas(prev => prev.map(r => 
      r.id === id ? { ...r, expandido: !r.expandido } : r
    ));
  };

  const updateGastoFixoSubcategoria = (categoriaId: string, subcategoriaId: string, valor: string) => {
    setGastosFixos(prev => prev.map(gf => {
      if (gf.id === categoriaId) {
        const newSubcategorias = gf.subcategorias.map(sub => 
          sub.id === subcategoriaId ? { ...sub, valor } : sub
        );
        const totalCategoria = newSubcategorias.reduce((sum, sub) => sum + parseCurrencyToNumber(sub.valor), 0);
        return { ...gf, subcategorias: newSubcategorias, valor: totalCategoria.toString() };
      }
      return gf;
    }));
  };

  const updateGastoVariavelSubcategoria = (categoriaId: string, subcategoriaId: string, valor: string) => {
    setGastosVariaveis(prev => prev.map(gv => {
      if (gv.id === categoriaId) {
        const newSubcategorias = gv.subcategorias.map(sub => 
          sub.id === subcategoriaId ? { ...sub, valor } : sub
        );
        const totalCategoria = newSubcategorias.reduce((sum, sub) => sum + parseCurrencyToNumber(sub.valor), 0);
        return { ...gv, subcategorias: newSubcategorias, valor: totalCategoria.toString() };
      }
      return gv;
    }));
  };

  const updateGastoVariavelCategoria = (categoriaId: string, valor: string) => {
    setGastosVariaveis(prev => prev.map(gv => 
      gv.id === categoriaId ? { ...gv, valor } : gv
    ));
  };

  const updateRendaCategoria = (categoriaId: string, field: 'valorBruto' | 'valorLiquido', valor: string) => {
    setRendas(prev => prev.map(r => 
      r.id === categoriaId ? { ...r, [field]: valor } : r
    ));
  };

  // Cálculos do Orçamento
  const totalRendaBruta = rendas.reduce((sum, r) => sum + parseCurrencyToNumber(r.valorBruto), 0);
  const totalRendaLiquida = rendas.reduce((sum, r) => sum + parseCurrencyToNumber(r.valorLiquido), 0);
  
  const totalGastosFixos = gastosFixos.reduce((sum, gf) => {
    if (gf.subcategorias.length > 0) {
      return sum + gf.subcategorias.reduce((s, sub) => s + parseCurrencyToNumber(sub.valor), 0);
    }
    return sum + parseCurrencyToNumber(gf.valor);
  }, 0);

  const totalGastosVariaveis = gastosVariaveis.reduce((sum, gv) => {
    if (gv.subcategorias.length > 0) {
      return sum + gv.subcategorias.reduce((s, sub) => s + parseCurrencyToNumber(sub.valor), 0);
    }
    return sum + parseCurrencyToNumber(gv.valor);
  }, 0);

  const totalInvestimentos = parseCurrencyToNumber(investimentosMensais);
  const totalProtecao = parseCurrencyToNumber(protecaoMensal);
  const totalGastos = totalGastosFixos + totalGastosVariaveis + totalInvestimentos + totalProtecao;
  const saldoFinal = totalRendaLiquida - totalGastos;

  // Percentuais para gráfico
  const percFixo = totalRendaLiquida > 0 ? (totalGastosFixos / totalRendaLiquida * 100).toFixed(0) : "0";
  const percVariavel = totalRendaLiquida > 0 ? (totalGastosVariaveis / totalRendaLiquida * 100).toFixed(0) : "0";
  const percInvestimento = totalRendaLiquida > 0 ? (totalInvestimentos / totalRendaLiquida * 100).toFixed(0) : "0";
  const percSaldo = totalRendaLiquida > 0 ? Math.max(0, saldoFinal / totalRendaLiquida * 100).toFixed(0) : "0";

  // Simulação anual
  const rendaBrutaAnual = totalRendaBruta * 12;
  const rendaLiquidaAnual = totalRendaLiquida * 12;
  const gastosAnuais = totalGastos * 12;
  const saldoAnual = saldoFinal * 12;
  
  // Cálculo AUTOMÁTICO da capacidade de poupar (igual à plataforma de referência)
  // Capacidade mínima = Saldo arredondado para cima para o próximo múltiplo de 500
  const capacidadeMinPouparMensal = saldoFinal > 0 
    ? Math.ceil(saldoFinal / 500) * 500 
    : 0;
  
  // Capacidade máxima = Renda Líquida - Gastos Variáveis (potencial se cortar variáveis)
  const capacidadeMaxPouparMensal = Math.max(0, totalRendaLiquida - totalGastosVariaveis);
  
  const capacidadeMinPouparAnual = capacidadeMinPouparMensal * 12;
  const capacidadeMaxPouparAnual = capacidadeMaxPouparMensal * 12;
  
  // Valor investido anualmente: usa a diferença (capacidade máxima - saldo)
  const valorInvestidoAnual = capacidadeMaxPouparAnual > 0 
    ? capacidadeMaxPouparAnual - saldoAnual
    : (saldoAnual > 0 ? saldoAnual : 0);
  
  // Diferença anual entre saldo e capacidade de poupança informada
  const diferencaAnual = capacidadeMaxPouparAnual - saldoAnual;

  // Projeção de investimento (30 anos) - gera dados para o gráfico
  const dadosProjecao = useMemo(() => {
    const taxa = parseFloat(taxaRentabilidade) / 100;
    const anos = 30;
    const dados: { ano: number; investimento: number; poupanca: number }[] = [];
    
    let investimento = 0;
    let poupanca = 0;
    
    for (let i = 1; i <= anos; i++) {
      investimento = (investimento + valorInvestidoAnual) * (1 + taxa);
      poupanca = poupanca + valorInvestidoAnual;
      dados.push({ ano: i, investimento, poupanca });
    }
    
    return dados;
  }, [valorInvestidoAnual, taxaRentabilidade]);

  const projecao = {
    investimento: dadosProjecao[dadosProjecao.length - 1]?.investimento || 0,
    poupanca: dadosProjecao[dadosProjecao.length - 1]?.poupanca || 0
  };
  
  // Formatar valores grandes para o eixo Y do gráfico
  const formatarValorGrafico = (valor: number) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(0)} milhões`;
    }
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)} mil`;
    }
    return `R$ ${valor.toFixed(0)}`;
  };

  // Funções auxiliares para Proteção Financeira
  const adicionarFilho = () => {
    if (!novoFilho.nome) return;
    setFilhos(prev => [...prev, { ...novoFilho, id: Date.now().toString() }]);
    setNovoFilho({ nome: "", dataNascimento: "", genero: "" });
    setModalFilho(false);
  };

  const adicionarPet = () => {
    if (!novoPet.nome) return;
    setPets(prev => [...prev, { ...novoPet, id: Date.now().toString() }]);
    setNovoPet({ nome: "", tipo: "", raca: "" });
    setModalPet(false);
  };

  // Funções auxiliares para patrimônio
  const adicionarImovel = () => {
    if (!novoImovel.nome || !novoImovel.valor) return;
    setImoveis(prev => [...prev, { ...novoImovel, id: Date.now().toString() }]);
    setNovoImovel({ nome: "", valor: "", categoria: "", estado: "", cidade: "", quitado: "", segurado: "", reside: "", alugando: "", descricao: "" });
    setModalImovel(false);
  };
  
  const adicionarAutomovel = () => {
    if (!novoAutomovel.nome || !novoAutomovel.valor) return;
    setAutomoveis(prev => [...prev, { ...novoAutomovel, id: Date.now().toString() }]);
    setNovoAutomovel({ nome: "", marca: "", modelo: "", ano: "", valor: "", quitado: "", segurado: "" });
    setModalAutomovel(false);
  };
  
  const adicionarDivida = () => {
    if (!novaDivida.nome || !novaDivida.saldoDevedor) return;
    setDividas(prev => [...prev, { ...novaDivida, id: Date.now().toString() }]);
    setNovaDivida({ nome: "", tipo: "", instituicao: "", garantia: "", saldoDevedor: "" });
    setModalDivida(false);
  };
  
  const adicionarOutroBem = () => {
    if (!novoOutroBem.nome || !novoOutroBem.valor) return;
    setOutrosBens(prev => [...prev, { ...novoOutroBem, id: Date.now().toString() }]);
    setNovoOutroBem({ nome: "", tipo: "", valor: "" });
    setModalOutroBem(false);
  };

  // Cálculo do patrimônio líquido
  const calcularTotalAtivos = () => {
    const totalImoveis = imoveis.reduce((acc, item) => acc + parseCurrencyToNumber(item.valor), 0);
    const totalAutomoveis = automoveis.reduce((acc, item) => acc + parseCurrencyToNumber(item.valor), 0);
    const totalAplicacoes = (
      parseCurrencyToNumber(aplicacoesFinanceiras.rendaFixa) +
      parseCurrencyToNumber(aplicacoesFinanceiras.fundosInvestimento) +
      parseCurrencyToNumber(aplicacoesFinanceiras.previdenciaPrivada) +
      parseCurrencyToNumber(aplicacoesFinanceiras.acoes) +
      parseCurrencyToNumber(aplicacoesFinanceiras.coe) +
      parseCurrencyToNumber(aplicacoesFinanceiras.criptomoedas) +
      parseCurrencyToNumber(aplicacoesFinanceiras.outro)
    );
    const totalOutros = outrosBens.reduce((acc, item) => acc + parseCurrencyToNumber(item.valor), 0);
    return { totalImoveis, totalAutomoveis, totalAplicacoes, totalOutros, total: totalImoveis + totalAutomoveis + totalAplicacoes + totalOutros };
  };

  const calcularTotalPassivos = () => {
    return dividas.reduce((acc, item) => acc + parseCurrencyToNumber(item.saldoDevedor), 0);
  };

  const ativos = calcularTotalAtivos();
  const passivos = calcularTotalPassivos();
  const patrimonioLiquido = ativos.total - passivos;

  // Finalizar formulário
  // Calcular preço da consultoria baseado na renda bruta anual
  const calcularPrecoBase = () => {
    // Cálculo baseado na renda bruta anual (3% da renda bruta anual)
    const precoBase = rendaBrutaAnual * 0.03;
    return Math.round(precoBase * 100) / 100; // Arredonda para 2 casas decimais
  };

  const precoBase = calcularPrecoBase();
  
  // À vista: se tem cupom aplicado, usa o valor do cupom diretamente (sem desconto)
  // Senão, usa o preço base com desconto de 14,2%
  const precoAvista = cupomAplicado !== null ? cupomAplicado : precoBase;
  const descontoAvista = cupomAplicado !== null ? 0 : precoBase * 0.14; // 14% de desconto só se não tiver cupom
  const precoAvistaComDesconto = cupomAplicado !== null ? cupomAplicado : (precoBase - descontoAvista);
  const economiaAvista = descontoAvista;
  const percentualEconomia = 14.2;

  // Parcelado: sempre 14,2% mais caro que o à vista
  const numParcelas = 12;
  const precoParcelado = precoAvistaComDesconto * 1.142; // 14,2% mais caro
  const valorParcela = precoParcelado / numParcelas;

  // Preços dos planos de acompanhamento
  const precosAcompanhamento = {
    standard: 149.90,
    premium: 199.90,
    infinity: 349.90,
    nenhum: 0
  };

  const finalizarFormulario = async () => {
    if (!dadosCliente.nome || !dadosCliente.email) {
      alert("Preencha o nome e email do cliente");
      return;
    }

    if (!formularioId) {
      alert("Erro: ID do formulário não encontrado");
      return;
    }

    try {
      setSaving(true);
      
      // Primeiro salva os dados do cliente
      await updateFormulario(formularioId, {
        clienteNome: dadosCliente.nome,
        clienteEmail: dadosCliente.email,
        clienteTelefone: dadosCliente.telefone || undefined,
      });
      
      // Depois completa
      await completeFormulario(formularioId);
      
      alert("Formulário finalizado com sucesso! Cliente adicionado à sua lista.");
      router.push("/dashboard/clientes");
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      alert("Erro ao finalizar formulário");
    } finally {
      setSaving(false);
    }
  };

  // Abre o modal de contrato para preencher os dados
  const abrirModalContrato = () => {
    setShowContratoModal(true);
  };

  // Função chamada quando o contrato é enviado pelo modal
  const handleEnviarContrato = async (dadosContrato: DadosContrato) => {
    if (!formularioId) {
      alert("Erro: ID do formulário não encontrado");
      return;
    }

    try {
      // Primeiro salva os dados do cliente
      await updateFormulario(formularioId, {
        clienteNome: dadosContrato.nomeCompleto,
        clienteEmail: dadosContrato.email,
        clienteTelefone: dadosContrato.celular || undefined,
      });
      
      // Completar formulário - isso já cria o lead/cliente automaticamente
      await completeFormulario(formularioId);
      
      // Fechar o modal
      setShowContratoModal(false);
      
      // Mostrar mensagem de sucesso
      alert(`✅ Contrato gerado e enviado com sucesso para ${dadosContrato.email}\n\nCliente cadastrado na aba de Clientes!`);
      
      // Redirecionar para a página de clientes
      router.push("/dashboard/clientes");
    } catch (err) {
      console.error("Erro ao enviar contrato:", err);
      alert("Erro ao enviar contrato. Tente novamente.");
    }
  };

  const enviarContrato = async () => {
    if (!emailContrato) {
      alert("Preencha o email para envio do contrato");
      return;
    }

    if (!formularioId) {
      alert("Erro: ID do formulário não encontrado");
      return;
    }

    try {
      setEnviandoContrato(true);
      
      // Simular envio de email (depois será implementado com API real)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de envio
      
      // Completar formulário - isso já cria o lead/cliente automaticamente
      await completeFormulario(formularioId);
      
      // Mostrar mensagem de sucesso
      alert(`✅ Contrato enviado com sucesso para ${emailContrato}\n\nCliente cadastrado na aba de Clientes!`);
      
      // Redirecionar para a página de clientes
      router.push("/dashboard/clientes");
    } catch (err) {
      console.error("Erro ao enviar contrato:", err);
      alert("Erro ao enviar contrato. Tente novamente.");
    } finally {
      setEnviandoContrato(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#3A8DFF] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando formulário...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header do formulário */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/formulario")}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">
                {isClientDataStep ? "Dados do Cliente" :
                 isSelecaoObjetivosStep ? "Objetivos Financeiros" : 
                 isSituacaoProfissionalStep ? "Situação Profissional" :
                 isPatrimonioStep ? "Patrimônio e Dívidas" :
                 isProtecaoFinanceiraStep ? "Proteção Financeira" :
                 isAposentadoriaStep ? "Aposentadoria" :
                 isOrcamentoStep ? "Orçamento" :
                 objetivoAtual?.titulo || "Formulário"}
              </h1>
              <p className="text-sm text-slate-400">
                {isClientDataStep
                  ? "Informações de contato para registro"
                  : isSelecaoObjetivosStep
                  ? "Selecione os objetivos financeiros"
                  : isSituacaoProfissionalStep
                  ? "Vamos entender sua situação financeira atual"
                  : isPatrimonioStep
                  ? "Organize seus bens e compromissos financeiros"
                  : isProtecaoFinanceiraStep
                  ? "Informações familiares e proteção financeira"
                  : isAposentadoriaStep
                  ? "Planejamento para independência financeira no longo prazo"
                  : isOrcamentoStep
                  ? "Controle suas receitas e despesas para alcançar equilíbrio financeiro"
                  : `${step - 1} de ${objetivosSelecionados.length} - ${objetivoAtual?.titulo}`}
              </p>
            </div>
          </div>

          {/* Save indicator */}
          <div className="flex items-center gap-4">
            {saving ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2 text-sm text-[#3A8DFF]">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvo</span>
              </div>
            ) : null}

            {/* Progress bar pequena */}
            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i <= step ? "bg-[#3A8DFF] w-8" : "bg-slate-700 w-4"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Barra de navegação horizontal das etapas */}
        <div className="bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex flex-nowrap items-center gap-2">
              {/* 1. Objetivos Financeiros (step 1) */}
              <button
                onClick={() => dadosCliente.nome && dadosCliente.email && setStep(1)}
                disabled={!dadosCliente.nome || !dadosCliente.email}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isSelecaoObjetivosStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : step > 1
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600"
                    : dadosCliente.nome && dadosCliente.email
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Target className={`w-4 h-4 flex-shrink-0 ${isSelecaoObjetivosStep ? "text-[#3A8DFF]" : "text-slate-400"}`} />
                <span className="text-xs font-medium truncate">1. Objetivos Financeiros</span>
                {step > 1 && objetivosSelecionados.length > 0 && (
                  <div className="w-2 h-2 rounded-full bg-[#3A8DFF] flex-shrink-0" />
                )}
                {isSelecaoObjetivosStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>

              {/* 2. Situação Profissional */}
              <button
                onClick={() => objetivosSelecionados.length > 0 && setStep(objetivosSelecionados.length + 2)}
                disabled={objetivosSelecionados.length === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isSituacaoProfissionalStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : step > objetivosSelecionados.length + 2
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600"
                    : objetivosSelecionados.length > 0
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Briefcase className={`w-4 h-4 flex-shrink-0 ${isSituacaoProfissionalStep ? "text-[#3A8DFF]" : "text-slate-500"}`} />
                <span className="text-xs font-medium truncate">2. Situação profissional</span>
                {step > objetivosSelecionados.length + 2 && situacaoProfissional.profissao && (
                  <div className="w-2 h-2 rounded-full bg-[#3A8DFF] flex-shrink-0" />
                )}
                {isSituacaoProfissionalStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>

              {/* 3. Patrimônio e dívidas */}
              <button
                onClick={() => objetivosSelecionados.length > 0 && situacaoProfissional.profissao && setStep(objetivosSelecionados.length + 3)}
                disabled={objetivosSelecionados.length === 0 || !situacaoProfissional.profissao}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isPatrimonioStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : step > objetivosSelecionados.length + 3
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600"
                    : situacaoProfissional.profissao && objetivosSelecionados.length > 0
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Landmark className={`w-4 h-4 flex-shrink-0 ${isPatrimonioStep ? "text-[#3A8DFF]" : "text-slate-500"}`} />
                <span className="text-xs font-medium truncate">3. Patrimônio e dívidas</span>
                {step > objetivosSelecionados.length + 3 && (
                  <div className="w-2 h-2 rounded-full bg-[#3A8DFF] flex-shrink-0" />
                )}
                {isPatrimonioStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>

              {/* 4. Proteção financeira */}
              <button
                onClick={() => objetivosSelecionados.length > 0 && situacaoProfissional.profissao && setStep(objetivosSelecionados.length + 4)}
                disabled={objetivosSelecionados.length === 0 || !situacaoProfissional.profissao}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isProtecaoFinanceiraStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : step > objetivosSelecionados.length + 4
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600"
                    : situacaoProfissional.profissao && objetivosSelecionados.length > 0
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Shield className={`w-4 h-4 flex-shrink-0 ${isProtecaoFinanceiraStep ? "text-[#3A8DFF]" : "text-slate-500"}`} />
                <span className="text-xs font-medium truncate">4. Proteção financeira</span>
                {step > objetivosSelecionados.length + 4 && (
                  <div className="w-2 h-2 rounded-full bg-[#3A8DFF] flex-shrink-0" />
                )}
                {isProtecaoFinanceiraStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>

              {/* 5. Aposentadoria */}
              <button
                onClick={() => objetivosSelecionados.length > 0 && situacaoProfissional.profissao && setStep(objetivosSelecionados.length + 5)}
                disabled={objetivosSelecionados.length === 0 || !situacaoProfissional.profissao}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isAposentadoriaStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : step > objetivosSelecionados.length + 5
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600"
                    : situacaoProfissional.profissao && objetivosSelecionados.length > 0
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Palmtree className={`w-4 h-4 flex-shrink-0 ${isAposentadoriaStep ? "text-[#3A8DFF]" : "text-slate-500"}`} />
                <span className="text-xs font-medium truncate">5. Aposentadoria</span>
                {step > objetivosSelecionados.length + 5 && (
                  <div className="w-2 h-2 rounded-full bg-[#3A8DFF] flex-shrink-0" />
                )}
                {isAposentadoriaStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>

              {/* 6. Orçamento (FINAL) */}
              <button
                onClick={() => objetivosSelecionados.length > 0 && situacaoProfissional.profissao && setStep(objetivosSelecionados.length + 6)}
                disabled={objetivosSelecionados.length === 0 || !situacaoProfissional.profissao}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl transition-all min-w-0 ${
                  isOrcamentoStep
                    ? "bg-[#3A8DFF]/20 border border-[#3A8DFF]/50 text-white"
                    : situacaoProfissional.profissao && objetivosSelecionados.length > 0
                    ? "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 cursor-pointer"
                    : "bg-slate-800/20 border border-slate-700/20 text-slate-600 cursor-not-allowed"
                }`}
              >
                <PieChart className={`w-4 h-4 flex-shrink-0 ${isOrcamentoStep ? "text-[#3A8DFF]" : "text-slate-500"}`} />
                <span className="text-xs font-medium truncate">6. Orçamento</span>
                {isOrcamentoStep && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Step 0: Dados do Cliente (PRIMEIRO) */}
        {isClientDataStep && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <User className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Dados do Cliente</h2>
                <p className="text-slate-400 text-sm">Antes de começar, identifique o cliente</p>
              </div>
            </div>

            {/* Campos */}
            <div className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Nome completo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={dadosCliente.nome}
                  onChange={(e) => setDadosCliente((prev) => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent"
                  placeholder="Nome do cliente..."
                />
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={dadosCliente.email}
                  onChange={(e) => setDadosCliente((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={dadosCliente.telefone}
                  onChange={(e) => setDadosCliente((prev) => ({ ...prev, telefone: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={proximoStep}
                disabled={!dadosCliente.nome || !dadosCliente.email}
                className="px-6 py-3 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Seleção de objetivos */}
        {isSelecaoObjetivosStep && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <p className="text-slate-400 text-sm mb-2">
                Selecione as categorias que representam suas principais metas financeiras.
              </p>
              <p className="text-slate-500 text-xs">
                A ordem de seleção define a prioridade das suas metas.
              </p>
            </div>

            {/* Grid de objetivos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {objetivos.map((objetivo, index) => {
                const isSelected = objetivosSelecionados.includes(objetivo.id);
                const orderIndex = objetivosSelecionados.indexOf(objetivo.id);
                const numeroNaLista = index + 1; // Número sequencial baseado na posição na lista

                return (
                  <button
                    key={objetivo.id}
                    onClick={() => toggleObjetivo(objetivo.id)}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-[#3A8DFF] ring-offset-2 ring-offset-slate-900"
                        : "hover:ring-2 hover:ring-slate-600 hover:ring-offset-2 hover:ring-offset-slate-900"
                    }`}
                  >
                    {/* Imagem de fundo */}
                    <div className="aspect-[4/3] relative">
                      <img
                        src={objetivo.imagem}
                        alt={objetivo.titulo}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isSelected ? "brightness-75" : "brightness-50 group-hover:brightness-75"
                        }`}
                      />

                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Ícone de seleção */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 w-7 h-7 bg-[#3A8DFF] rounded-lg flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Número sequencial na lista */}
                      <div className="absolute top-3 right-3 w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold">
                        {numeroNaLista}
                      </div>

                      {/* Conteúdo */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {(() => {
                            const IconComponent = iconesObjetivos[objetivo.icone];
                            return IconComponent ? <IconComponent className="w-5 h-5 text-white" /> : null;
                          })()}
                          <h3 className="font-semibold text-sm leading-tight">
                            {objetivo.titulo}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {objetivo.descricao}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info de seleção */}
            {objetivosSelecionados.length > 0 && (
              <div className="mt-8 p-4 bg-[#3A8DFF]/10 border border-[#3A8DFF]/30 rounded-xl">
                <p className="text-[#3A8DFF] text-sm text-center">
                  <span className="font-bold">{objetivosSelecionados.length}</span> objetivo(s) selecionado(s)
                  {" • "}
                  <span className="text-slate-400">
                    {objetivosSelecionados.map((id) => objetivos.find((o) => o.id === id)?.titulo).join(", ")}
                  </span>
                </p>
              </div>
            )}

            {/* Botões de navegação */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                disabled={objetivosSelecionados.length === 0}
                className="px-6 py-3 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Steps de perguntas para cada objetivo (steps 2 a N+1) */}
        {step > 1 && !isSituacaoProfissionalStep && !isPatrimonioStep && !isProtecaoFinanceiraStep && !isAposentadoriaStep && !isOrcamentoStep && objetivoAtual && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {/* Header do objetivo */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              {(() => {
                const IconComponent = iconesObjetivos[objetivoAtual.icone];
                return IconComponent ? <IconComponent className="w-12 h-12 text-[#3A8DFF]" /> : null;
              })()}
              <div>
                <h2 className="text-xl font-bold">{objetivoAtual.titulo}</h2>
                <p className="text-slate-400 text-sm">{objetivoAtual.descricao}</p>
              </div>
            </div>

            {/* Perguntas */}
            <div className="space-y-6">
              {perguntasAtuais.map((pergunta, index) => {
                // Verificar se a pergunta deve ser exibida (lógica condicional)
                const shouldShow = !pergunta.condicional || 
                  respostas[objetivoAtual.id]?.[pergunta.condicional.perguntaIndex] === pergunta.condicional.valor;

                if (!shouldShow) return null;

                const isRequired = pergunta.pergunta.includes("*");
                const hasError = isRequired && !respostas[objetivoAtual.id]?.[index];
                
                // Função para determinar se uma pergunta faz parte de um par lado a lado
                const getPairInfo = (objetivoId: string, perguntaIndex: number) => {
                  // Imóvel, veículo, viagens: perguntas 1 e 2 (data e dinheiro)
                  if ((objetivoId === "imovel" || objetivoId === "veiculo" || objetivoId === "viagens") && (perguntaIndex === 1 || perguntaIndex === 2)) {
                    return { isInPair: true, isFirst: perguntaIndex === 1, pairIndex: 1, secondIndex: 2 };
                  }
                  // Aposentadoria: perguntas 1 e 2 (data e dinheiro), e perguntas 3 e 4 (dinheiro e dinheiro)
                  if (objetivoId === "aposentadoria") {
                    if (perguntaIndex === 1 || perguntaIndex === 2) {
                      return { isInPair: true, isFirst: perguntaIndex === 1, pairIndex: 1, secondIndex: 2 };
                    }
                    if (perguntaIndex === 3 || perguntaIndex === 4) {
                      return { isInPair: true, isFirst: perguntaIndex === 3, pairIndex: 3, secondIndex: 4 };
                    }
                  }
                  // Família: perguntas 1 e 2 (radio e radio) - reserva de emergência e seguro de vida
                  if (objetivoId === "familia" && (perguntaIndex === 1 || perguntaIndex === 2)) {
                    return { isInPair: true, isFirst: perguntaIndex === 1, pairIndex: 1, secondIndex: 2 };
                  }
                  return { isInPair: false, isFirst: false, pairIndex: -1, secondIndex: -1 };
                };
                
                const pairInfo = getPairInfo(objetivoAtual.id, index);
                const isFirstOfPair = pairInfo.isFirst;

                // Renderizar pares lado a lado
                if (isFirstOfPair) {
                  const pergunta1 = perguntasAtuais[pairInfo.pairIndex];
                  const pergunta2 = perguntasAtuais[pairInfo.secondIndex];
                  
                  const shouldShow1 = !pergunta1.condicional || 
                    respostas[objetivoAtual.id]?.[pergunta1.condicional?.perguntaIndex || 0] === pergunta1.condicional?.valor;
                  const shouldShow2 = !pergunta2.condicional || 
                    respostas[objetivoAtual.id]?.[pergunta2.condicional?.perguntaIndex || 0] === pergunta2.condicional?.valor;
                  
                  const renderField = (pergunta: typeof pergunta1, idx: number, isFirst: boolean) => {
                    const hasErrorField = pergunta.pergunta.includes("*") && !respostas[objetivoAtual.id]?.[idx];
                    
                    if (pergunta.tipo === "data") {
                      return (
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={respostas[objetivoAtual.id]?.[idx] ? formatDate(respostas[objetivoAtual.id][idx]) : ""}
                            onChange={(e) => {
                              const formatted = formatDate(e.target.value);
                              if (formatted.length <= 10) {
                                setResposta(objetivoAtual.id, idx, parseDate(formatted));
                              }
                            }}
                            maxLength={10}
                            className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                              hasErrorField ? "border-red-500" : "border-slate-600"
                            }`}
                            placeholder="DD/MM/AAAA"
                          />
                        </div>
                      );
                    }
                    
                    if (pergunta.tipo === "dinheiro") {
                      return (
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={respostas[objetivoAtual.id]?.[idx] ? formatCurrency(respostas[objetivoAtual.id][idx]) : ""}
                            onChange={(e) => {
                              const raw = parseCurrency(e.target.value);
                              setResposta(objetivoAtual.id, idx, raw);
                            }}
                            className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                              hasErrorField ? "border-red-500" : "border-slate-600"
                            }`}
                            placeholder="R$ 0,00"
                          />
                        </div>
                      );
                    }
                    
                    if (pergunta.tipo === "radio" && pergunta.opcoes) {
                      return (
                        <div className="space-y-2">
                          {pergunta.opcoes.map((opcao, opcaoIndex) => {
                            const isSelected = respostas[objetivoAtual.id]?.[idx] === opcao;
                            return (
                              <label
                                key={opcaoIndex}
                                className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                                  isSelected
                                    ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                                    : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`pergunta-${objetivoAtual.id}-${idx}`}
                                  value={opcao}
                                  checked={isSelected}
                                  onChange={(e) => setResposta(objetivoAtual.id, idx, e.target.value)}
                                  className="sr-only"
                                />
                                <span className="text-sm flex-1">{opcao}</span>
                                {isSelected && (
                                  <div className="w-5 h-5 bg-[#3A8DFF] rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      );
                    }
                    
                    return null;
                  };
                  
                  return (
                    <div key={`pair-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Primeira pergunta do par */}
                      {shouldShow1 && (
                        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                          <label className="block text-sm font-medium text-slate-300 mb-3">
                            {pairInfo.pairIndex + 1}. {pergunta1.pergunta}
                          </label>
                          {renderField(pergunta1, pairInfo.pairIndex, true)}
                          {(pergunta1.pergunta.includes("*") && !respostas[objetivoAtual.id]?.[pairInfo.pairIndex]) && (
                            <p className="text-red-400 text-xs mt-2">Campo obrigatório</p>
                          )}
                        </div>
                      )}
                      
                      {/* Segunda pergunta do par */}
                      {shouldShow2 && (
                        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                          <label className="block text-sm font-medium text-slate-300 mb-3">
                            {pairInfo.secondIndex + 1}. {pergunta2.pergunta}
                          </label>
                          {renderField(pergunta2, pairInfo.secondIndex, false)}
                          {(pergunta2.pergunta.includes("*") && !respostas[objetivoAtual.id]?.[pairInfo.secondIndex]) && (
                            <p className="text-red-400 text-xs mt-2">Campo obrigatório</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Pular a segunda pergunta do par se já renderizamos o par
                if (pairInfo.isInPair && index === pairInfo.secondIndex) return null;

                return (
                  <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      {index + 1}. {pergunta.pergunta}
                    </label>

                    {pergunta.tipo === "texto" && (
                      <input
                        type="text"
                        value={respostas[objetivoAtual.id]?.[index] || ""}
                        onChange={(e) => setResposta(objetivoAtual.id, index, e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                          hasError ? "border-red-500" : "border-slate-600"
                        }`}
                        placeholder="Digite sua resposta..."
                      />
                    )}

                    {pergunta.tipo === "data" && (
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={respostas[objetivoAtual.id]?.[index] ? formatDate(respostas[objetivoAtual.id][index]) : ""}
                          onChange={(e) => {
                            const formatted = formatDate(e.target.value);
                            if (formatted.length <= 10) {
                              setResposta(objetivoAtual.id, index, parseDate(formatted));
                            }
                          }}
                          maxLength={10}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                            hasError ? "border-red-500" : "border-slate-600"
                          }`}
                          placeholder="DD/MM/AAAA"
                        />
                      </div>
                    )}

                    {pergunta.tipo === "dinheiro" && (
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={respostas[objetivoAtual.id]?.[index] ? formatCurrency(respostas[objetivoAtual.id][index]) : ""}
                          onChange={(e) => {
                            const raw = parseCurrency(e.target.value);
                            setResposta(objetivoAtual.id, index, raw);
                          }}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                            hasError ? "border-red-500" : "border-slate-600"
                          }`}
                          placeholder="R$ 0,00"
                        />
                      </div>
                    )}

                    {pergunta.tipo === "numero" && (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={respostas[objetivoAtual.id]?.[index] || ""}
                        onChange={(e) => setResposta(objetivoAtual.id, index, e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent ${
                          hasError ? "border-red-500" : "border-slate-600"
                        }`}
                        placeholder="R$ 0,00"
                      />
                    )}

                    {pergunta.tipo === "textarea" && (
                      <textarea
                        value={respostas[objetivoAtual.id]?.[index] || ""}
                        onChange={(e) => setResposta(objetivoAtual.id, index, e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent resize-none ${
                          hasError ? "border-red-500" : "border-slate-600"
                        }`}
                        placeholder="Digite sua resposta..."
                      />
                    )}

                    {pergunta.tipo === "radio" && pergunta.opcoes && (
                      <div className="space-y-2">
                        {pergunta.opcoes.map((opcao, opcaoIndex) => {
                          const isSelected = respostas[objetivoAtual.id]?.[index] === opcao;
                          return (
                            <label
                              key={opcaoIndex}
                              className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                                isSelected
                                  ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                                  : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`pergunta-${objetivoAtual.id}-${index}`}
                                value={opcao}
                                checked={isSelected}
                                onChange={(e) => setResposta(objetivoAtual.id, index, e.target.value)}
                                className="sr-only"
                              />
                              <span className="text-sm flex-1">{opcao}</span>
                              {isSelected && (
                                <div className="w-5 h-5 bg-[#3A8DFF] rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </label>
                          );
                        })}
                        {hasError && (
                          <p className="text-red-400 text-xs mt-2">Campo obrigatório</p>
                        )}
                      </div>
                    )}

                    {hasError && pergunta.tipo !== "radio" && (
                      <p className="text-red-400 text-xs mt-2">Campo obrigatório</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botões de navegação */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                disabled={perguntasAtuais.some((pergunta, index) => {
                  const isRequired = pergunta.pergunta.includes("*");
                  if (!isRequired) return false;
                  const shouldShow = !pergunta.condicional || 
                    respostas[objetivoAtual.id]?.[pergunta.condicional.perguntaIndex] === pergunta.condicional.valor;
                  if (!shouldShow) return false;
                  return !respostas[objetivoAtual.id]?.[index];
                })}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Situação Profissional */}
        {isSituacaoProfissionalStep && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <Briefcase className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Situação Profissional</h2>
                <p className="text-slate-400 text-sm">Vamos entender sua situação financeira atual</p>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-white mb-1">Situação Profissional</h3>
                <p className="text-slate-400 text-sm">Como você trabalha atualmente?</p>
              </div>

              {/* Campo Profissão */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Profissão <span className="text-[#3A8DFF]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={situacaoProfissional.profissao}
                    onChange={(e) => setSituacaoProfissional(prev => ({ ...prev, profissao: e.target.value }))}
                    className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A8DFF] focus:border-transparent"
                  >
                    <option value="" className="bg-slate-800">Selecione sua profissão...</option>
                    {profissoes.map((prof) => (
                      <option key={prof} value={prof} className="bg-slate-800">{prof}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Campo Regime de Trabalho */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Regime de trabalho <span className="text-[#3A8DFF]">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {regimesTrabalho.map((regime) => {
                    const Icon = regime.icone;
                    const isSelected = situacaoProfissional.regime === regime.id;
                    
                    return (
                      <button
                        key={regime.id}
                        type="button"
                        onClick={() => setSituacaoProfissional(prev => ({ ...prev, regime: regime.id }))}
                        className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                            : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-[#3A8DFF]" : "text-slate-400"}`} />
                        <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-slate-300"}`}>
                          {regime.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#3A8DFF] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                disabled={!situacaoProfissional.profissao || !situacaoProfissional.regime}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Patrimônio e Dívidas */}
        {isPatrimonioStep && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <Landmark className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Patrimônio e dívidas</h2>
                <p className="text-slate-400 text-sm">Organize seus bens e compromissos financeiros</p>
              </div>
            </div>

            {/* Instituição Financeira */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Instituição Financeira</h3>
              <p className="text-slate-400 text-sm mb-6">Selecione sua instituição financeira principal</p>
              
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Instituição financeira principal <span className="text-[#3A8DFF]">*</span>
              </label>
              
              <p className="text-sm text-slate-500 mb-3">Instituições mais buscadas</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {bancosPopulares.map((banco) => (
                  <button
                    key={banco.codigo}
                    type="button"
                    onClick={() => setPatrimonio(prev => ({ ...prev, instituicaoFinanceira: banco.nome }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      patrimonio.instituicaoFinanceira === banco.nome
                        ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                        : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-2xl">{banco.logo}</span>
                    <div className="text-left">
                      <p className="text-xs text-slate-500">[{banco.codigo}]</p>
                      <p className="text-sm text-white truncate">{banco.nome.substring(0, 15)}...</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-slate-500 mb-3">Todas as instituições</p>
              <div className="relative">
                <select
                  value={patrimonio.instituicaoFinanceira}
                  onChange={(e) => setPatrimonio(prev => ({ ...prev, instituicaoFinanceira: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]"
                >
                  <option value="" className="bg-slate-800">Selecione...</option>
                  {todasInstituicoes.map((inst) => (
                    <option key={inst} value={inst} className="bg-slate-800">{inst}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Perfil do Investidor e Moradia */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Perfil do investidor <span className="text-[#3A8DFF]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {["Arrojado", "Conservador", "Moderado"].map((perfil) => (
                  <button
                    key={perfil}
                    type="button"
                    onClick={() => setPatrimonio(prev => ({ ...prev, perfilInvestidor: perfil }))}
                    className={`p-4 rounded-xl border transition-all text-center ${
                      patrimonio.perfilInvestidor === perfil
                        ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                        : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-sm font-medium">{perfil}</span>
                    {patrimonio.perfilInvestidor === perfil && (
                      <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />
                    )}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">Situação de Moradia</h3>
              <p className="text-slate-400 text-sm mb-4">Informações sobre sua moradia atual</p>
              
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Moradia atual <span className="text-[#3A8DFF]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Casa de parentes ou colegas", "Imóvel Alugado", "Imóvel próprio"].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setPatrimonio(prev => ({ ...prev, moradiaAtual: tipo }))}
                    className={`p-4 rounded-xl border transition-all text-center ${
                      patrimonio.moradiaAtual === tipo
                        ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                        : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-sm font-medium">{tipo}</span>
                    {patrimonio.moradiaAtual === tipo && (
                      <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs de Patrimônio */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 mb-6">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-700/50 overflow-x-auto">
                {[
                  { id: "imoveis", label: "Imóveis", icon: Home },
                  { id: "automoveis", label: "Automóveis", icon: Car },
                  { id: "aplicacoes", label: "Aplicações financeiras", icon: TrendingUp },
                  { id: "dividas", label: "Dívidas", icon: CreditCard },
                  { id: "outros", label: "Outros bens", icon: Tag },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPatrimonioTab(tab.id as typeof patrimonioTab)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        patrimonioTab === tab.id
                          ? "border-[#3A8DFF] text-[#3A8DFF]"
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Imóveis */}
                {patrimonioTab === "imoveis" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">Cadastro de imóvel</span>
                      </div>
                      <button
                        onClick={() => setModalImovel(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    
                    {imoveis.length > 0 ? (
                      <div className="space-y-3">
                        {imoveis.map((imovel) => (
                          <div key={imovel.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{imovel.nome}</p>
                              <p className="text-sm text-slate-400">{imovel.categoria} • {imovel.cidade}/{imovel.estado}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-[#3A8DFF]">{formatCurrency(imovel.valor)}</p>
                              <button
                                onClick={() => setImoveis(prev => prev.filter(i => i.id !== imovel.id))}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhum imóvel cadastrado</p>
                    )}
                  </div>
                )}

                {/* Automóveis */}
                {patrimonioTab === "automoveis" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">Cadastro de automóvel</span>
                      </div>
                      <button
                        onClick={() => setModalAutomovel(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    
                    {automoveis.length > 0 ? (
                      <div className="space-y-3">
                        {automoveis.map((auto) => (
                          <div key={auto.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{auto.nome}</p>
                              <p className="text-sm text-slate-400">{auto.marca} {auto.modelo} • {auto.ano}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-[#3A8DFF]">{formatCurrency(auto.valor)}</p>
                              <button
                                onClick={() => setAutomoveis(prev => prev.filter(a => a.id !== auto.id))}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhum automóvel cadastrado</p>
                    )}
                  </div>
                )}

                {/* Aplicações Financeiras */}
                {patrimonioTab === "aplicacoes" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Bancos onde investe</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                          onChange={(e) => {
                            if (e.target.value && !aplicacoesFinanceiras.bancosInveste.includes(e.target.value)) {
                              setAplicacoesFinanceiras(prev => ({
                                ...prev,
                                bancosInveste: [...prev.bancosInveste, e.target.value]
                              }));
                            }
                          }}
                        >
                          <option value="">Selecione</option>
                          {todasInstituicoes.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Corretoras onde investe</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                          onChange={(e) => {
                            if (e.target.value && !aplicacoesFinanceiras.corretorasInveste.includes(e.target.value)) {
                              setAplicacoesFinanceiras(prev => ({
                                ...prev,
                                corretorasInveste: [...prev.corretorasInveste, e.target.value]
                              }));
                            }
                          }}
                        >
                          <option value="">Selecione</option>
                          {todasInstituicoes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "rendaFixa", label: "Renda fixa" },
                        { key: "fundosInvestimento", label: "Fundos de investimento" },
                        { key: "previdenciaPrivada", label: "Previdência privada" },
                        { key: "acoes", label: "Ações" },
                        { key: "coe", label: "COE" },
                        { key: "criptomoedas", label: "Criptomoedas" },
                        { key: "outro", label: "Outro" },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                          <input
                            type="text"
                            value={aplicacoesFinanceiras[key as keyof typeof aplicacoesFinanceiras] ? formatCurrency(aplicacoesFinanceiras[key as keyof typeof aplicacoesFinanceiras] as string) : ""}
                            onChange={(e) => {
                              const formatted = formatCurrency(e.target.value);
                              setAplicacoesFinanceiras(prev => ({
                                ...prev,
                                [key]: parseCurrency(formatted).toString()
                              }));
                            }}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500"
                            placeholder="R$"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {/* Dívidas */}
                {patrimonioTab === "dividas" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">Cadastro de dívidas</span>
                      </div>
                      <button
                        onClick={() => setModalDivida(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    
                    {dividas.length > 0 ? (
                      <div className="space-y-3">
                        {dividas.map((divida) => (
                          <div key={divida.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{divida.nome}</p>
                              <p className="text-sm text-slate-400">{divida.tipo} • {divida.instituicao}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-red-400">{formatCurrency(divida.saldoDevedor)}</p>
                              <button
                                onClick={() => setDividas(prev => prev.filter(d => d.id !== divida.id))}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhuma dívida cadastrada</p>
                    )}
                  </div>
                )}

                {/* Outros Bens */}
                {patrimonioTab === "outros" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">Cadastro de outros bens</span>
                      </div>
                      <button
                        onClick={() => setModalOutroBem(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    
                    {outrosBens.length > 0 ? (
                      <div className="space-y-3">
                        {outrosBens.map((bem) => (
                          <div key={bem.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{bem.nome}</p>
                              <p className="text-sm text-slate-400">{bem.tipo}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-[#3A8DFF]">{formatCurrency(bem.valor)}</p>
                              <button
                                onClick={() => setOutrosBens(prev => prev.filter(b => b.id !== bem.id))}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhum outro bem cadastrado</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resumo Patrimonial */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-6">Resumo Patrimonial</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ativos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#3A8DFF]" />
                    <span className="font-medium text-[#3A8DFF]">Ativos</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Imóveis</span>
                      <span className="text-white">{formatCurrencyNumber(ativos.totalImoveis)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Automóveis</span>
                      <span className="text-white">{formatCurrencyNumber(ativos.totalAutomoveis)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Aplicações financeiras</span>
                      <span className="text-white">{formatCurrencyNumber(ativos.totalAplicacoes)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Outros bens</span>
                      <span className="text-white">{formatCurrencyNumber(ativos.totalOutros)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-3 border-t border-slate-700">
                      <span className="text-slate-300 font-medium">Total de ativos</span>
                      <span className="text-[#3A8DFF] font-medium">{formatCurrencyNumber(ativos.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Passivos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-red-400">Passivos</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm pt-3 border-t border-slate-700">
                      <span className="text-slate-300 font-medium">Total de passivos</span>
                      <span className="text-red-400 font-medium">{formatCurrencyNumber(passivos)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patrimônio Líquido */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Patrimônio Líquido</span>
                  <span className={`text-xl font-bold ${patrimonioLiquido >= 0 ? "text-[#3A8DFF]" : "text-red-400"}`}>
                    {formatCurrencyNumber(patrimonioLiquido)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Proteção Financeira */}
        {isProtecaoFinanceiraStep && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <Shield className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Proteção Financeira</h2>
                <p className="text-slate-400 text-sm">Informações familiares e proteção financeira</p>
              </div>
            </div>

            {/* Informações Familiares */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 mb-6">
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#3A8DFF]" />
                  <h3 className="text-lg font-semibold text-white">Informações familiares</h3>
                </div>
              </div>

              {/* Tab Headers */}
              <div className="flex border-b border-slate-700/50">
                {[
                  { id: "estadoCivil", label: "Estado civil", icon: Heart },
                  { id: "filhos", label: "Possui filhos", icon: Baby },
                  { id: "pets", label: "Possui pets", icon: Dog },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInfoFamiliar(prev => ({ ...prev, tabFamiliar: tab.id as typeof prev.tabFamiliar }))}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                        infoFamiliar.tabFamiliar === tab.id
                          ? "border-[#3A8DFF] text-[#3A8DFF]"
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Estado Civil */}
                {infoFamiliar.tabFamiliar === "estadoCivil" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">
                      Selecione seu estado civil atual <span className="text-red-400">*</span>
                    </label>
                    <div className="relative mb-6">
                      <select
                        value={infoFamiliar.estadoCivil}
                        onChange={(e) => setInfoFamiliar(prev => ({ ...prev, estadoCivil: e.target.value }))}
                        className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]"
                      >
                        <option value="" className="bg-slate-800">Selecione...</option>
                        {estadosCivis.map(ec => <option key={ec} value={ec} className="bg-slate-800">{ec}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Formulário de Cônjuge (condicional) */}
                    {(infoFamiliar.estadoCivil === "Casado(a)" || infoFamiliar.estadoCivil === "União Estável") && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Informações do Cônjuge</h4>
                        <p className="text-sm text-slate-400 mb-4">Cônjuge cadastrado</p>

                        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/50">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-slate-400" />
                              <span className="font-medium">Adicionar cônjuge</span>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                              <input
                                type="text"
                                value={conjuge.nome}
                                onChange={(e) => setConjuge(prev => ({ ...prev, nome: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                                placeholder="Nome"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Data de nascimento</label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                  type="text"
                                  value={conjuge.dataNascimento ? formatDate(conjuge.dataNascimento) : ""}
                                  onChange={(e) => {
                                    const formatted = formatDate(e.target.value);
                                    if (formatted.length <= 10) {
                                      setConjuge(prev => ({ ...prev, dataNascimento: parseDate(formatted) }));
                                    }
                                  }}
                                  maxLength={10}
                                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                                  placeholder="Selecione uma data"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de partilha</label>
                              <select
                                value={conjuge.tipoPartilha}
                                onChange={(e) => setConjuge(prev => ({ ...prev, tipoPartilha: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                              >
                                <option value="">Selecione</option>
                                {tiposPartilha.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Profissão</label>
                              <select
                                value={conjuge.profissao}
                                onChange={(e) => setConjuge(prev => ({ ...prev, profissao: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                              >
                                <option value="">Selecione</option>
                                {profissoes.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Gênero</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {generos.map(g => (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => setConjuge(prev => ({ ...prev, genero: g.id }))}
                                  className={`p-3 rounded-xl border transition-all text-sm ${
                                    conjuge.genero === g.id
                                      ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                                      : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                                  }`}
                                >
                                  {g.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Filhos */}
                {infoFamiliar.tabFamiliar === "filhos" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">Filhos cadastrados</h4>
                        <p className="text-sm text-slate-400">
                          {filhos.length === 0 ? "Nenhum filho cadastrado" : `${filhos.length} filho(s) cadastrado(s)`}
                        </p>
                      </div>
                      <button
                        onClick={() => setModalFilho(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar filho
                      </button>
                    </div>

                    {filhos.length > 0 && (
                      <div className="space-y-3">
                        {filhos.map(filho => (
                          <div key={filho.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{filho.nome}</p>
                              <p className="text-sm text-slate-400">{filho.dataNascimento} • {generos.find(g => g.id === filho.genero)?.label}</p>
                            </div>
                            <button
                              onClick={() => setFilhos(prev => prev.filter(f => f.id !== filho.id))}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pets */}
                {infoFamiliar.tabFamiliar === "pets" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">Pets cadastrados</h4>
                        <p className="text-sm text-slate-400">
                          {pets.length === 0 ? "Nenhum pet cadastrado" : `${pets.length} pet(s) cadastrado(s)`}
                        </p>
                      </div>
                      <button
                        onClick={() => setModalPet(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar pet
                      </button>
                    </div>

                    {pets.length > 0 && (
                      <div className="space-y-3">
                        {pets.map(pet => (
                          <div key={pet.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                            <div>
                              <p className="font-medium text-white">{pet.nome}</p>
                              <p className="text-sm text-slate-400">{pet.tipo} • {pet.raca}</p>
                            </div>
                            <button
                              onClick={() => setPets(prev => prev.filter(p => p.id !== pet.id))}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Proteção Financeira */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#3A8DFF]" />
                <h3 className="text-lg font-semibold text-white">Proteção Financeira</h3>
              </div>

              {/* Plano de Saúde */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui plano de saúde? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, possuiPlanoSaude: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.possuiPlanoSaude === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.possuiPlanoSaude === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.possuiPlanoSaude === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condicionais do Plano de Saúde */}
              {protecaoFinanceira.possuiPlanoSaude === "Sim" && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      É um plano pela empresa que trabalha? <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Sim", "Não"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setProtecaoFinanceira(prev => ({ ...prev, planoEmpresa: opt }))}
                          className={`p-4 rounded-xl border transition-all ${
                            protecaoFinanceira.planoEmpresa === opt
                              ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                              : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                          }`}
                        >
                          <span className={protecaoFinanceira.planoEmpresa === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                          {protecaoFinanceira.planoEmpresa === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Qual a instituição do plano? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={protecaoFinanceira.instituicaoPlano}
                      onChange={(e) => setProtecaoFinanceira(prev => ({ ...prev, instituicaoPlano: e.target.value }))}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {planosSaude.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Proteção da força de trabalho */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui proteção da força de trabalho? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Não", "Não aplicável", "Sim"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, protecaoForcaTrabalho: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.protecaoForcaTrabalho === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.protecaoForcaTrabalho === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.protecaoForcaTrabalho === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proteção para dependentes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui proteção para dependentes? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Não", "Não aplicável", "Sim"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, protecaoDependentes: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.protecaoDependentes === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.protecaoDependentes === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.protecaoDependentes === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seguro para bens relativos ao trabalho */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui seguro para bens relativos ao trabalho? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Não", "Não aplicável", "Sim"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, seguroBensTrabalho: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.seguroBensTrabalho === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.seguroBensTrabalho === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.seguroBensTrabalho === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conhece estratégias para sucessão patrimonial */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Conhece as estratégias para sucessão patrimonial? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Não", "Parcialmente", "Sim"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, conheceEstrategiasSucessao: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.conheceEstrategiasSucessao === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.conheceEstrategiasSucessao === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.conheceEstrategiasSucessao === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Possui estratégia definida */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui estratégia definida e ativa para sucessão patrimonial? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProtecaoFinanceira(prev => ({ ...prev, possuiEstrategiaSucessao: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        protecaoFinanceira.possuiEstrategiaSucessao === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={protecaoFinanceira.possuiEstrategiaSucessao === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {protecaoFinanceira.possuiEstrategiaSucessao === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Aposentadoria */}
        {isAposentadoriaStep && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <Palmtree className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Aposentadoria</h2>
                <p className="text-slate-400 text-sm">Planejamento para independência financeira no longo prazo</p>
              </div>
            </div>

            {/* Informações Fiscais */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Informações Fiscais</h3>
              <p className="text-slate-400 text-sm mb-6">Dados sobre sua declaração de imposto de renda</p>

              {/* Como foi a última declaração de IR */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Como foi a última declaração de IR? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Completo", "Não declarado", "Simplificado"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, ultimaDeclaracaoIR: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.ultimaDeclaracaoIR === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.ultimaDeclaracaoIR === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.ultimaDeclaracaoIR === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conhece sobre vantagens tributárias */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Conhece sobre possíveis vantagens tributárias vindas de investimentos? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, conheceVantagensTributarias: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.conheceVantagensTributarias === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.conheceVantagensTributarias === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.conheceVantagensTributarias === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restituiu na declaração do ano anterior */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Restituiu na declaração do ano anterior? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, restituiuAnoAnterior: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.restituiuAnoAnterior === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.restituiuAnoAnterior === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.restituiuAnoAnterior === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Informações de Aposentadoria */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              {/* Data de nascimento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Data de nascimento <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={aposentadoria.dataNascimento ? formatDate(aposentadoria.dataNascimento) : ""}
                    onChange={(e) => {
                      const formatted = formatDate(e.target.value);
                      if (formatted.length <= 10) {
                        setAposentadoria(prev => ({ ...prev, dataNascimento: parseDate(formatted) }));
                      }
                    }}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
              </div>

              {/* Já está aposentado */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Já está aposentado? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, jaAposentado: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.jaAposentado === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.jaAposentado === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.jaAposentado === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idade desejada e Renda desejada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Idade desejada de aposentadoria <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={aposentadoria.idadeDesejadaAposentadoria}
                      onChange={(e) => setAposentadoria(prev => ({ ...prev, idadeDesejadaAposentadoria: e.target.value }))}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {idadesAposentadoria.map(idade => (
                        <option key={idade} value={idade.toString()}>{idade} anos</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Renda desejada na aposentadoria <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={aposentadoria.rendaDesejadaAposentadoria ? formatCurrency(aposentadoria.rendaDesejadaAposentadoria) : ""}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setAposentadoria(prev => ({ ...prev, rendaDesejadaAposentadoria: parseCurrency(formatted).toString() }));
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                      placeholder="R$ 20.000,00"
                    />
                  </div>
                </div>
              </div>

              {/* Possui uma estratégia para aposentadoria */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Possui uma estratégia para aposentadoria? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, possuiEstrategiaAposentadoria: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.possuiEstrategiaAposentadoria === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.possuiEstrategiaAposentadoria === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.possuiEstrategiaAposentadoria === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Já fez alguma projeção para a aposentadoria */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Já fez alguma projeção para a aposentadoria? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAposentadoria(prev => ({ ...prev, fezProjecaoAposentadoria: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        aposentadoria.fezProjecaoAposentadoria === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={aposentadoria.fezProjecaoAposentadoria === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {aposentadoria.fezProjecaoAposentadoria === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={proximoStep}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Orçamento */}
        {isOrcamentoStep && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <PieChart className="w-12 h-12 text-[#3A8DFF]" />
              <div>
                <h2 className="text-xl font-bold">Orçamento</h2>
                <p className="text-slate-400 text-sm">Controle suas receitas e despesas para alcançar equilíbrio financeiro</p>
              </div>
            </div>

            {/* Hábitos de Consumo */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Hábitos de Consumo</h3>
              <p className="text-slate-400 text-sm mb-6">Como você costuma fazer seus gastos?</p>

              {/* Forma de gastos mais usada */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Forma de gastos mais usado <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "credito", label: "Crédito", icon: CreditCard },
                    { id: "debito", label: "Débito", icon: CreditCard },
                    { id: "dinheiro", label: "Dinheiro", icon: Banknote },
                  ].map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setHabitosConsumo(prev => ({ ...prev, formaGastosMaisUsada: opt.id }))}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          habitosConsumo.formaGastosMaisUsada === opt.id
                            ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                            : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${habitosConsumo.formaGastosMaisUsada === opt.id ? "text-[#3A8DFF]" : "text-slate-400"}`} />
                        <span className={habitosConsumo.formaGastosMaisUsada === opt.id ? "text-[#3A8DFF]" : ""}>{opt.label}</span>
                        {habitosConsumo.formaGastosMaisUsada === opt.id && <Check className="w-4 h-4 text-[#3A8DFF] ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Costuma parcelar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Você costuma parcelar seus gastos? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHabitosConsumo(prev => ({ ...prev, costumaParcelar: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        habitosConsumo.costumaParcelar === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={habitosConsumo.costumaParcelar === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {habitosConsumo.costumaParcelar === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detalhes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Detalhes</label>
                <textarea
                  value={habitosConsumo.detalhes}
                  onChange={(e) => setHabitosConsumo(prev => ({ ...prev, detalhes: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white resize-none"
                  rows={3}
                  placeholder="Descreva aqui como costuma organizar e realizar seus gastos."
                />
              </div>
            </div>

            {/* Cartões de Crédito */}
            {habitosConsumo.formaGastosMaisUsada === "credito" && (
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#3A8DFF]" />
                    <h3 className="text-lg font-semibold text-white">Cartões de Crédito</h3>
                  </div>
                  <button
                    onClick={() => setModalCartao(true)}
                    className="px-4 py-2 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar cartão
                  </button>
                </div>

                {cartoesCredito.length === 0 ? (
                  <p className="text-slate-400 text-sm">Nenhum cartão cadastrado</p>
                ) : (
                  <div className="space-y-3">
                    {cartoesCredito.map(cartao => (
                      <div key={cartao.id} className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">{cartao.nome}</span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-xs text-slate-300">Crédito</span>
                            </div>
                            <p className="text-sm text-slate-400">{cartao.descricao}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-slate-400">Limite total: <span className="text-[#3A8DFF]">{formatCurrency(cartao.limiteTotal)}</span></span>
                              <span className="text-slate-400">Limite disponível: <span className="text-[#3A8DFF]">{formatCurrency(cartao.limiteDisponivel)}</span></span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setCartoesCredito(prev => prev.filter(c => c.id !== cartao.id))}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Outras Informações */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-6">Outras Informações</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Conhece sobre estratégias de milhas? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Sim", "Parcialmente", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOutrasInfoOrcamento(prev => ({ ...prev, conheceEstrategiasMilhas: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        outrasInfoOrcamento.conheceEstrategiasMilhas === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={outrasInfoOrcamento.conheceEstrategiasMilhas === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {outrasInfoOrcamento.conheceEstrategiasMilhas === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Faz controle dos gastos? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Sim", "Parcialmente", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOutrasInfoOrcamento(prev => ({ ...prev, fazControleGastos: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        outrasInfoOrcamento.fazControleGastos === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={outrasInfoOrcamento.fazControleGastos === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {outrasInfoOrcamento.fazControleGastos === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Investe mensalmente? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOutrasInfoOrcamento(prev => ({ ...prev, investeMensalmente: opt }))}
                      className={`p-4 rounded-xl border transition-all ${
                        outrasInfoOrcamento.investeMensalmente === opt
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <span className={outrasInfoOrcamento.investeMensalmente === opt ? "text-[#3A8DFF]" : ""}>{opt}</span>
                      {outrasInfoOrcamento.investeMensalmente === opt && <Check className="w-4 h-4 text-[#3A8DFF] inline-block ml-2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Renda */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 mb-6 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#3A8DFF]" />
                  <h3 className="text-lg font-semibold text-white">Renda</h3>
                </div>
                <button
                  onClick={() => setRendas(prev => [...prev, { 
                    id: Date.now().toString(), 
                    categoria: "Nova categoria", 
                    valorBruto: "", 
                    valorLiquido: "", 
                    expandido: false, 
                    subcategorias: [] 
                  }])}
                  className="px-4 py-2 rounded-xl border border-[#3A8DFF]/50 text-[#3A8DFF] hover:bg-[#3A8DFF]/10 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Categoria
                </button>
              </div>

              {/* Header da tabela */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-900/30 text-sm text-slate-400">
                <div className="col-span-1"></div>
                <div className="col-span-4">Categoria/Subcategoria</div>
                <div className="col-span-3">Valor bruto</div>
                <div className="col-span-3">Valor líquido</div>
                <div className="col-span-1"></div>
              </div>

              {/* Categorias de Renda */}
              {rendas.map(renda => (
                <div key={renda.id} className="border-b border-slate-700/30 last:border-b-0">
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                    <div className="col-span-1">
                      <button 
                        onClick={() => toggleRendaExpand(renda.id)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${renda.expandido ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={renda.categoria}
                        onChange={(e) => setRendas(prev => prev.map(r => r.id === renda.id ? { ...r, categoria: e.target.value } : r))}
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={renda.valorBruto ? formatCurrency(renda.valorBruto) : ""}
                        onChange={(e) => updateRendaCategoria(renda.id, 'valorBruto', parseCurrency(e.target.value).toString())}
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={renda.valorLiquido ? formatCurrency(renda.valorLiquido) : ""}
                        onChange={(e) => updateRendaCategoria(renda.id, 'valorLiquido', parseCurrency(e.target.value).toString())}
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button className="p-1 text-slate-400 hover:text-[#3A8DFF]">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total de Renda */}
              <div className="grid grid-cols-12 gap-2 px-4 py-4 bg-slate-900/50 items-center">
                <div className="col-span-5 text-white font-medium">Total de renda</div>
                <div className="col-span-3 text-[#3A8DFF] font-medium">{formatCurrency(totalRendaBruta)}</div>
                <div className="col-span-3 text-[#3A8DFF] font-medium">{formatCurrency(totalRendaLiquida)}</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Gastos Fixos */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 mb-6 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#3A8DFF]" />
                  <h3 className="text-lg font-semibold text-white">Gastos Fixos</h3>
                </div>
                <button
                  onClick={() => setGastosFixos(prev => [...prev, { 
                    id: Date.now().toString(), 
                    categoria: "Nova categoria", 
                    valor: "", 
                    expandido: false, 
                    subcategorias: [] 
                  }])}
                  className="px-4 py-2 rounded-xl border border-[#3A8DFF]/50 text-[#3A8DFF] hover:bg-[#3A8DFF]/10 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Categoria
                </button>
              </div>

              {/* Header da tabela */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-900/30 text-sm text-slate-400">
                <div className="col-span-1"></div>
                <div className="col-span-6">Categoria/Subcategoria</div>
                <div className="col-span-4">Valor</div>
                <div className="col-span-1"></div>
              </div>

              {/* Categorias de Gastos Fixos */}
              {gastosFixos.map(gasto => (
                <div key={gasto.id}>
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-slate-700/30">
                    <div className="col-span-1">
                      {gasto.subcategorias.length > 0 && (
                        <button 
                          onClick={() => toggleGastoFixoExpand(gasto.id)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${gasto.expandido ? '' : '-rotate-90'}`} />
                        </button>
                      )}
                      {gasto.subcategorias.length === 0 && (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={gasto.categoria}
                        onChange={(e) => setGastosFixos(prev => prev.map(g => g.id === gasto.id ? { ...g, categoria: e.target.value } : g))}
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={gasto.subcategorias.length > 0 
                          ? formatCurrency(gasto.subcategorias.reduce((sum, sub) => sum + parseCurrencyToNumber(sub.valor), 0))
                          : gasto.valor ? formatCurrency(gasto.valor) : ""
                        }
                        onChange={(e) => {
                          if (gasto.subcategorias.length === 0) {
                            setGastosFixos(prev => prev.map(g => g.id === gasto.id ? { ...g, valor: parseCurrency(e.target.value) } : g));
                          }
                        }}
                        readOnly={gasto.subcategorias.length > 0}
                        className={`px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full ${gasto.subcategorias.length > 0 ? 'cursor-not-allowed opacity-70' : ''}`}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => {
                          setGastosFixos(prev => prev.map(g => {
                            if (g.id === gasto.id) {
                              return {
                                ...g,
                                subcategorias: [...g.subcategorias, { id: Date.now().toString(), nome: "Nova subcategoria", valor: "" }]
                              };
                            }
                            return g;
                          }));
                        }}
                        className="p-1 text-slate-400 hover:text-[#3A8DFF]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategorias */}
                  {gasto.expandido && gasto.subcategorias.map(sub => (
                    <div key={sub.id} className="grid grid-cols-12 gap-2 px-4 py-2 items-center bg-slate-900/20 border-b border-slate-800/50">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#3A8DFF]/50"></div>
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.nome}
                          onChange={(e) => {
                            setGastosFixos(prev => prev.map(g => {
                              if (g.id === gasto.id) {
                                return {
                                  ...g,
                                  subcategorias: g.subcategorias.map(s => s.id === sub.id ? { ...s, nome: e.target.value } : s)
                                };
                              }
                              return g;
                            }));
                          }}
                          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300 w-full text-sm"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={sub.valor ? formatCurrency(sub.valor) : ""}
                          onChange={(e) => updateGastoFixoSubcategoria(gasto.id, sub.id, parseCurrency(e.target.value).toString())}
                          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full text-sm"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button 
                          onClick={() => {
                            setGastosFixos(prev => prev.map(g => {
                              if (g.id === gasto.id) {
                                return {
                                  ...g,
                                  subcategorias: g.subcategorias.filter(s => s.id !== sub.id)
                                };
                              }
                              return g;
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Total de Gastos Fixos */}
              <div className="grid grid-cols-12 gap-2 px-4 py-4 bg-slate-900/50 items-center">
                <div className="col-span-7 text-white font-medium">Total de gastos fixos</div>
                <div className="col-span-4 text-red-400 font-medium">{formatCurrency(totalGastosFixos)}</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Gastos Variáveis */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 mb-6 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#3A8DFF]" />
                  <h3 className="text-lg font-semibold text-white">Gastos Variáveis</h3>
                </div>
                <button
                  onClick={() => setGastosVariaveis(prev => [...prev, { 
                    id: Date.now().toString(), 
                    categoria: "Nova categoria", 
                    valor: "", 
                    expandido: false, 
                    subcategorias: [] 
                  }])}
                  className="px-4 py-2 rounded-xl border border-[#3A8DFF]/50 text-[#3A8DFF] hover:bg-[#3A8DFF]/10 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Categoria
                </button>
              </div>

              {/* Header da tabela */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-900/30 text-sm text-slate-400">
                <div className="col-span-1"></div>
                <div className="col-span-6">Categoria/Subcategoria</div>
                <div className="col-span-4">Valor</div>
                <div className="col-span-1"></div>
              </div>

              {/* Categorias de Gastos Variáveis */}
              {gastosVariaveis.map(gasto => (
                <div key={gasto.id}>
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-slate-700/30">
                    <div className="col-span-1">
                      {gasto.subcategorias.length > 0 && (
                        <button 
                          onClick={() => toggleGastoVariavelExpand(gasto.id)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${gasto.expandido ? '' : '-rotate-90'}`} />
                        </button>
                      )}
                      {gasto.subcategorias.length === 0 && (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={gasto.categoria}
                        readOnly
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={gasto.valor ? formatCurrency(gasto.valor) : ""}
                        onChange={(e) => updateGastoVariavelCategoria(gasto.id, parseCurrency(e.target.value).toString())}
                        className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => {
                          setGastosVariaveis(prev => prev.map(g => {
                            if (g.id === gasto.id) {
                              return {
                                ...g,
                                subcategorias: [...g.subcategorias, { id: Date.now().toString(), nome: "Nova subcategoria", valor: "" }]
                              };
                            }
                            return g;
                          }));
                        }}
                        className="p-1 text-slate-400 hover:text-[#3A8DFF]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategorias */}
                  {gasto.expandido && gasto.subcategorias.map(sub => (
                    <div key={sub.id} className="grid grid-cols-12 gap-2 px-4 py-2 items-center bg-slate-900/20 border-b border-slate-800/50">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#3A8DFF]/50"></div>
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.nome}
                          onChange={(e) => {
                            setGastosVariaveis(prev => prev.map(g => {
                              if (g.id === gasto.id) {
                                return {
                                  ...g,
                                  subcategorias: g.subcategorias.map(s => s.id === sub.id ? { ...s, nome: e.target.value } : s)
                                };
                              }
                              return g;
                            }));
                          }}
                          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300 w-full text-sm"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={sub.valor ? formatCurrency(sub.valor) : ""}
                          onChange={(e) => updateGastoVariavelSubcategoria(gasto.id, sub.id, parseCurrency(e.target.value).toString())}
                          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white w-full text-sm"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button 
                          onClick={() => {
                            setGastosVariaveis(prev => prev.map(g => {
                              if (g.id === gasto.id) {
                                return {
                                  ...g,
                                  subcategorias: g.subcategorias.filter(s => s.id !== sub.id)
                                };
                              }
                              return g;
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Total de Gastos Variáveis */}
              <div className="grid grid-cols-12 gap-2 px-4 py-4 bg-slate-900/50 items-center">
                <div className="col-span-7 text-white font-medium">Total de gastos variáveis</div>
                <div className="col-span-4 text-red-400 font-medium">{formatCurrency(totalGastosVariaveis)}</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Investimentos e Proteção */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <TrendingUp className="w-4 h-4 inline-block mr-2 text-blue-400" />
                  Investimentos mensais
                </label>
                <input
                  type="text"
                  value={investimentosMensais ? formatCurrency(investimentosMensais) : ""}
                  onChange={(e) => setInvestimentosMensais(parseCurrency(e.target.value).toString())}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <Shield className="w-4 h-4 inline-block mr-2 text-purple-400" />
                  Proteção mensal (seguros)
                </label>
                <input
                  type="text"
                  value={protecaoMensal ? formatCurrency(protecaoMensal) : ""}
                  onChange={(e) => setProtecaoMensal(parseCurrency(e.target.value).toString())}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#3A8DFF]" />
                <h3 className="text-lg font-semibold text-white">Resumo financeiro</h3>
              </div>

              {/* Barra de progresso */}
              <div className="flex h-8 rounded-lg overflow-hidden mb-6">
                {totalRendaLiquida > 0 && (
                  <>
                    <div 
                      className="bg-orange-500 flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${percFixo}%` }}
                    >
                      {Number(percFixo) > 5 && `${percFixo}%`}
                    </div>
                    <div 
                      className="bg-yellow-500 flex items-center justify-center text-xs font-medium text-slate-900"
                      style={{ width: `${percVariavel}%` }}
                    >
                      {Number(percVariavel) > 5 && `${percVariavel}%`}
                    </div>
                    <div 
                      className="bg-blue-500 flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${percInvestimento}%` }}
                    >
                      {Number(percInvestimento) > 5 && `${percInvestimento}%`}
                    </div>
                    <div 
                      className="bg-slate-600 flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${percSaldo}%` }}
                    >
                      {Number(percSaldo) > 5 && `${percSaldo}%`}
                    </div>
                  </>
                )}
                {totalRendaLiquida === 0 && (
                  <div className="bg-slate-700 w-full flex items-center justify-center text-xs text-slate-400">
                    Preencha a renda para ver o resumo
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Descrição</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3A8DFF]"></div>
                    <span className="text-slate-300">Renda Bruta</span>
                    <span className="ml-auto text-white">{formatCurrency(totalRendaBruta)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3A8DFF]"></div>
                    <span className="text-slate-300">Renda Líquida</span>
                    <span className="ml-auto text-white">{formatCurrency(totalRendaLiquida)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Descrição</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-slate-300">Fixo</span>
                    <span className="ml-auto text-red-400">-{formatCurrency(totalGastosFixos)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-300">Variável</span>
                    <span className="ml-auto text-red-400">-{formatCurrency(totalGastosVariaveis)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-slate-300">Investimentos</span>
                    <span className="ml-auto text-red-400">-{formatCurrency(totalInvestimentos)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-slate-300">Proteção</span>
                    <span className="ml-auto text-red-400">-{formatCurrency(totalProtecao)}</span>
                  </div>
                </div>
              </div>

              {/* Saldo Final */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-white font-medium">Saldo final</span>
                  </div>
                  <span className={`text-xl font-bold ${saldoFinal >= 0 ? 'text-[#3A8DFF]' : 'text-red-400'}`}>
                    {formatCurrency(saldoFinal)}
                  </span>
                </div>
                <div className="flex justify-between mt-4 text-sm text-slate-400">
                  <div>
                    <span>Capacidade mínima de poupar informada</span>
                    <span className="ml-2 text-white">{formatCurrency(capacidadeMinPouparMensal)}</span>
                  </div>
                  <div>
                    <span>Capacidade máxima de poupar informada</span>
                    <span className="ml-2 text-white">{formatCurrency(capacidadeMaxPouparMensal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulação do Futuro */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#3A8DFF]" />
                <h3 className="text-lg font-semibold text-white">Simulação do futuro</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700/50">
                      <th className="text-left py-3 px-2"></th>
                      <th className="text-left py-3 px-2">Renda Líquida</th>
                      <th className="text-left py-3 px-2">Gastos</th>
                      <th className="text-left py-3 px-2">Saldo</th>
                      <th className="text-left py-3 px-2">Capacidade de poupança informada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/30">
                      <td className="py-3 px-2 text-slate-300">Mensal</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(totalRendaLiquida)}</td>
                      <td className="py-3 px-2 text-red-400">{formatCurrency(totalGastos)}</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(saldoFinal)}</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(capacidadeMinPouparMensal)} - {formatCurrency(capacidadeMaxPouparMensal)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-slate-300">Anual</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(rendaLiquidaAnual)}</td>
                      <td className="py-3 px-2 text-red-400">{formatCurrency(gastosAnuais)}</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(saldoAnual)}</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(capacidadeMinPouparAnual)} - {formatCurrency(capacidadeMaxPouparAnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl text-center">
                <p className="text-sm text-slate-400 mb-1">Diferença anual entre saldo e capacidade de poupança informada</p>
                <p className={`text-2xl font-bold ${diferencaAnual >= 0 ? 'text-[#3A8DFF]' : 'text-red-400'}`}>
                  {formatCurrency(diferencaAnual)}
                </p>
              </div>
            </div>

            {/* Rentabilidade e Projeção */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#3A8DFF]" />
                <h3 className="text-lg font-semibold text-white">Rentabilidade e Projeção</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Taxa de Rentabilidade Anual (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={taxaRentabilidade}
                    onChange={(e) => setTaxaRentabilidade(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="15%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Valor investido anualmente <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(valorInvestidoAnual)}
                    readOnly
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white opacity-70"
                  />
                </div>
              </div>

              {/* Projeção de Crescimento */}
              <div className="bg-slate-900/30 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">Projeção de Crescimento Patrimonial (30 anos)</h4>
                <p className="text-sm text-slate-400 mb-6">
                  Comparação entre dinheiro guardado e investimento com rentabilidade de {taxaRentabilidade}% a.a.
                </p>

                {/* Gráfico de linhas */}
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dadosProjecao}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="ano" 
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => {
                          if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(0)} milhões`;
                          if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)} mil`;
                          return `R$ ${value}`;
                        }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value, name) => [
                          formatCurrency(Number(value) || 0), 
                          name === 'investimento' ? 'Investimento' : 'Poupança'
                        ]}
                        labelFormatter={(label) => `Ano ${label}`}
                      />
                      <Legend 
                        formatter={(value) => value === 'investimento' ? 'Investimento' : 'Poupança'}
                        wrapperStyle={{ color: '#94a3b8' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="investimento" 
                        stroke="#22d3d1" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#22d3d1' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="poupanca" 
                        stroke="#64748b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={{ r: 6, fill: '#64748b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Dinheiro guardado (30 anos)</p>
                    <p className="text-xl font-bold text-slate-300">{formatCurrency(projecao.poupanca)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Investimento (30 anos)</p>
                    <p className="text-xl font-bold text-[#3A8DFF]">{formatCurrency(projecao.investimento)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-end gap-3">
              <button
                onClick={stepAnterior}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={() => setShowRecomendacaoModal(true)}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Página de Recomendações (tela inteira sem menus) */}
      {showRecomendacaoModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-auto">
          <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header da Página */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-[#3A8DFF]" />
              </div>
                <h1 className="text-2xl font-bold text-white">Recomendação</h1>
            </div>

              {/* Formulário de Nova Recomendação */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 mb-8">
                {/* Linha 1: Nome, Celular, Gênero */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="min-w-0">
                    <label className="block text-sm text-slate-400 mb-2">
                      Nome <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                      value={novaRecomendacao.nome}
                      onChange={(e) => setNovaRecomendacao(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500"
                      placeholder="Digite o nome completo"
                />
              </div>
                  <div className="min-w-0">
                    <label className="block text-sm text-slate-400 mb-2">
                      Celular <span className="text-red-400">*</span>
                </label>
                    <div className="flex w-full">
                      <div className="flex items-center gap-1 px-2 bg-slate-800/50 border border-r-0 border-slate-700 rounded-l-xl flex-shrink-0">
                        <span className="text-xs font-medium text-slate-400">BR</span>
                        <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
                <input
                  type="tel"
                        value={novaRecomendacao.celular}
                        onChange={(e) => setNovaRecomendacao(prev => ({ ...prev, celular: e.target.value }))}
                        className="w-full min-w-0 px-3 py-3.5 bg-slate-800/50 border border-slate-700 rounded-r-xl text-white placeholder:text-slate-500"
                        placeholder="(99) 99999-9999"
                />
              </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm text-slate-400 mb-2">
                      Gênero <span className="text-red-400">*</span>
                </label>
                    <select
                      value={novaRecomendacao.genero}
                      onChange={(e) => setNovaRecomendacao(prev => ({ ...prev, genero: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none"
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
              </div>
            </div>

                {/* Círculo Social */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-3">Círculo social</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "Amigos", label: "Amigos", icon: UserPlus },
                      { id: "Família", label: "Família", icon: Users },
                      { id: "Trabalho", label: "Trabalho", icon: Briefcase },
                    ].map((opcao) => (
              <button
                        key={opcao.id}
                        type="button"
                        onClick={() => setNovaRecomendacao(prev => ({ ...prev, circuloSocial: opcao.id }))}
                        className={`flex flex-col items-start gap-4 p-5 rounded-xl border transition-all ${
                          novaRecomendacao.circuloSocial === opcao.id
                            ? "bg-[#3A8DFF]/10 border-[#3A8DFF]/50 text-[#3A8DFF]"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <opcao.icon className="w-6 h-6" />
                          {novaRecomendacao.circuloSocial === opcao.id && (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-medium text-lg">{opcao.label}</span>
              </button>
                    ))}
                  </div>
                </div>

                {/* Estado Civil */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-3">Estado Civil</label>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { id: "Casado(a)", icon: Users },
                      { id: "Separado(a)", icon: User },
                      { id: "Solteiro(a)", icon: User },
                      { id: "União Estável", icon: User },
                      { id: "Viúvo(a)", icon: User },
                    ].map((estado) => (
              <button
                        key={estado.id}
                        type="button"
                        onClick={() => setNovaRecomendacao(prev => ({ ...prev, estadoCivil: estado.id }))}
                        className={`flex flex-col items-start gap-3 p-4 rounded-xl border transition-all ${
                          novaRecomendacao.estadoCivil === estado.id
                            ? "bg-[#3A8DFF]/10 border-[#3A8DFF]/50 text-[#3A8DFF]"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <estado.icon className="w-5 h-5" />
                          {novaRecomendacao.estadoCivil === estado.id && (
                    <Check className="w-4 h-4" />
                )}
                        </div>
                        <span className="text-sm font-medium">{estado.id}</span>
              </button>
                    ))}
            </div>
          </div>

                {/* Filhos */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-3">Filhos</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Sim", "Não"].map((opcao) => (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => setNovaRecomendacao(prev => ({ ...prev, temFilhos: opcao }))}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          novaRecomendacao.temFilhos === opcao
                            ? "bg-[#3A8DFF]/10 border-[#3A8DFF]/50 text-[#3A8DFF]"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <span className="font-medium">{opcao}</span>
                        {novaRecomendacao.temFilhos === opcao && (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profissão */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Profissão</label>
                  <select
                    value={novaRecomendacao.profissao}
                    onChange={(e) => setNovaRecomendacao(prev => ({ ...prev, profissao: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    <option value="Empresário">Empresário</option>
                    <option value="Funcionário Público">Funcionário Público</option>
                    <option value="Autônomo">Autônomo</option>
                    <option value="CLT">CLT</option>
                    <option value="Profissional Liberal">Profissional Liberal</option>
                    <option value="Aposentado">Aposentado</option>
                    <option value="Policial militar">Policial militar</option>
                    <option value="Médico">Médico</option>
                    <option value="Advogado">Advogado</option>
                    <option value="Engenheiro">Engenheiro</option>
                    <option value="Arquiteto">Arquiteto</option>
                    <option value="Account manager">Account manager</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Comentário */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Comentário</label>
                  <textarea
                    value={novaRecomendacao.comentario}
                    onChange={(e) => setNovaRecomendacao(prev => ({ ...prev, comentario: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 resize-none"
                    placeholder="Digite um comentário sobre o contato..."
                    rows={3}
                />
              </div>

                {/* Botão Confirmar */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!novaRecomendacao.nome || !novaRecomendacao.celular) {
                        alert("Preencha o nome e celular da recomendação");
                        return;
                      }
                      if (editandoRecomendacao) {
                        setRecomendacoes(prev => prev.map(r => 
                          r.id === editandoRecomendacao ? { ...novaRecomendacao, id: editandoRecomendacao } : r
                        ));
                        setEditandoRecomendacao(null);
                      } else {
                        setRecomendacoes(prev => [...prev, { ...novaRecomendacao, id: Date.now().toString() }]);
                      }
                      setNovaRecomendacao({
                        nome: "", celular: "", genero: "", circuloSocial: "", 
                        estadoCivil: "", temFilhos: "", profissao: "", comentario: ""
                      });
                    }}
                    className="px-6 py-3 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
                  >
                    <Check className="w-5 h-5" />
                    {editandoRecomendacao ? "Atualizar" : "Confirmar"}
                  </button>
              </div>
            </div>

              {/* Lista de Recomendações Cadastradas */}
              {recomendacoes.length > 0 && (
                <div className="space-y-4 mb-8">
                  {recomendacoes.map((rec) => (
                    <div key={rec.id} className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
                      {/* Header do Card */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                        <h4 className="font-semibold text-white text-lg">{rec.nome}</h4>
                        <div className="flex items-center gap-3">
              <button
                            onClick={() => {
                              setNovaRecomendacao(rec);
                              setEditandoRecomendacao(rec.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setRecomendacoes(prev => prev.filter(r => r.id !== rec.id))}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {/* Dados do Card - Layout igual à referência */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500">Celular</span>
                            <span className="text-white">{rec.celular}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500">Estado Civil</span>
                            <span className="text-white">{rec.estadoCivil || "-"}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 bg-slate-800/30 rounded-lg px-3 -mx-3">
                            <span className="text-slate-500">Gênero</span>
                            <span className="text-white">{rec.genero || "-"}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 bg-slate-800/30 rounded-lg px-3 -mx-3">
                            <span className="text-slate-500">Filhos</span>
                            <span className="text-white">{rec.temFilhos || "-"}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500">Círculo social</span>
                            <span className="text-white">{rec.circuloSocial || "-"}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500">Profissão</span>
                            <span className="text-white">{rec.profissao || "-"}</span>
                          </div>
                        </div>
                        {/* Comentário */}
                        {rec.comentario && (
                          <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <p className="text-sm text-slate-400">{rec.comentario}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botões de Navegação */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRecomendacaoModal(false)}
                  className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowRecomendacaoModal(false);
                  setEmailContrato(dadosCliente.email || "");
                  setShowProposta(true);
                }}
                className="px-8 py-3 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] transition-colors flex items-center gap-2 font-medium"
              >
                <ArrowRight className="w-5 h-5" />
                Ver Proposta
              </button>
              </div>
            </div>
            </div>
          </div>
        )}

      {/* Página de Proposta Comercial */}
      {showProposta && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-auto">
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Proposta Comercial</h1>
                  <p className="text-slate-400">Renda bruta anual {formatCurrency(rendaBrutaAnual)}</p>
                </div>
                <button
                  onClick={() => setShowProposta(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Cards de Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Card À Vista */}
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">À vista</h3>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-2">
                      {formatCurrency(precoAvistaComDesconto)}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Método de pagamento</span>
                        <select className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm">
                          <option>Selecione</option>
                          <option>PIX</option>
                          <option>Transferência Bancária</option>
                          <option>Boleto</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400">Economia</span>
                        <span className="text-[#3A8DFF] font-semibold">
                          {formatCurrency(economiaAvista)} ({percentualEconomia}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-[#3A8DFF] hover:bg-[#3A8DFF] rounded-xl text-white font-medium transition-colors">
                    Selecionar
                  </button>
                </div>

                {/* Card Parcelado */}
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Parcelado</h3>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-2">
                      {formatCurrency(precoParcelado)}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">N° de parcelas</span>
                        <select className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm">
                          <option>12 parcelas</option>
                          <option>6 parcelas</option>
                          <option>3 parcelas</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400">Valor da parcela</span>
                        <span className="text-[#3A8DFF] font-semibold">
                          {formatCurrency(valorParcela)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-[#3A8DFF] hover:bg-[#3A8DFF] rounded-xl text-white font-medium transition-colors">
                    Selecionar
                  </button>
                </div>
              </div>

              {/* Cupom (menor, embaixo) */}
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 mb-6 max-w-md">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400 whitespace-nowrap">Cupom</label>
                  <input
                    type="text"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    placeholder="Digite o cupom"
                    className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 text-sm"
                  />
                  <button
                    onClick={() => {
                      // Valida e aplica o cupom apenas quando clicar
                      if (cupom && cupom.toLowerCase().startsWith('t')) {
                        const valorCupom = parseFloat(cupom.toLowerCase().replace('t', ''));
                        if (!isNaN(valorCupom) && valorCupom > 0) {
                          setCupomAplicado(valorCupom);
                          alert(`Cupom aplicado! Valor à vista alterado para ${formatCurrency(valorCupom)}`);
                        } else {
                          alert("Cupom inválido. Use o formato t2500, t3000, etc.");
                        }
                      } else if (cupom) {
                        alert("Cupom inválido. Use o formato t2500, t3000, etc.");
                      } else {
                        // Remove cupom se campo estiver vazio
                        setCupomAplicado(null);
                      }
                    }}
                    className="px-4 py-2 bg-[#3A8DFF] hover:bg-[#3A8DFF] rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Validar cupom
                  </button>
                </div>
              </div>

              {/* Escolha do Serviço de Acompanhamento */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Escolha seu acompanhamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Standard */}
                  <div
                    onClick={() => setPlanoAcompanhamento("standard")}
                    className={`bg-slate-800/30 rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                      planoAcompanhamento === "standard"
                        ? "border-[#3A8DFF] bg-[#3A8DFF]/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-[#3A8DFF] mb-4">Standard</h3>
                    <ul className="space-y-2 mb-6 text-slate-300">
                      <li>4 reuniões de acompanhamento</li>
                      <li>Relatórios Quinzenais Eleven</li>
                      <li>Clube de descontos</li>
                    </ul>
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-4">
                      {formatCurrency(precosAcompanhamento.standard)}
                    </p>
                    <button
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        planoAcompanhamento === "standard"
                          ? "bg-[#3A8DFF] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {planoAcompanhamento === "standard" ? "Selecionado" : "Selecionar"}
                    </button>
                  </div>

                  {/* Premium */}
                  <div
                    onClick={() => setPlanoAcompanhamento("premium")}
                    className={`bg-slate-800/30 rounded-2xl border-2 p-6 cursor-pointer transition-all relative ${
                      planoAcompanhamento === "premium"
                        ? "border-[#3A8DFF] bg-[#3A8DFF]/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-[#3A8DFF] text-white text-xs font-semibold rounded-full">
                        Recomendado
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#3A8DFF] mb-4">Premium</h3>
                    <ul className="space-y-2 mb-6 text-slate-300">
                      <li>8 reuniões de acompanhamento</li>
                      <li>Relatórios Semanais Eleven</li>
                      <li>Clube de descontos</li>
                    </ul>
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-4">
                      {formatCurrency(precosAcompanhamento.premium)}
                    </p>
                    <button
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        planoAcompanhamento === "premium"
                          ? "bg-[#3A8DFF] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {planoAcompanhamento === "premium" ? "Selecionado" : "Selecionar"}
                    </button>
                  </div>

                  {/* Infinity */}
                  <div
                    onClick={() => setPlanoAcompanhamento("infinity")}
                    className={`bg-slate-800/30 rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                      planoAcompanhamento === "infinity"
                        ? "border-[#3A8DFF] bg-[#3A8DFF]/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-[#3A8DFF] mb-4">Infinity</h3>
                    <ul className="space-y-2 mb-6 text-slate-300">
                      <li>10 reuniões de acompanhamento</li>
                      <li>Relatórios Diários Eleven</li>
                      <li>Clube de descontos</li>
                    </ul>
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-4">
                      {formatCurrency(precosAcompanhamento.infinity)}
                    </p>
                    <button
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        planoAcompanhamento === "infinity"
                          ? "bg-[#3A8DFF] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {planoAcompanhamento === "infinity" ? "Selecionado" : "Selecionar"}
                    </button>
                  </div>
                </div>
                {/* Opção de prosseguir sem acompanhamento */}
                <div className="text-center">
                  <button
                    onClick={() => setPlanoAcompanhamento("nenhum")}
                    className={`text-sm text-slate-400 hover:text-white transition-colors ${
                      planoAcompanhamento === "nenhum" ? "text-[#3A8DFF] font-semibold" : ""
                    }`}
                  >
                    Prosseguir sem acompanhamento
                  </button>
                </div>
              </div>

              {/* Seção de Confirmação */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Consultoria</h4>
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-1">
                      {formatCurrency(precoAvistaComDesconto)}
                    </p>
                    <p className="text-sm text-slate-400">
                      (valor único de adesão, válido até a renovação de 12 meses)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Serviço de Acompanhamento</h4>
                    <p className="text-3xl font-bold text-[#3A8DFF] mb-1">
                      {planoAcompanhamento === "nenhum" 
                        ? "R$ 0,00" 
                        : formatCurrency(precosAcompanhamento[planoAcompanhamento])
                      }
                    </p>
                    <p className="text-sm text-slate-400">
                      {planoAcompanhamento === "nenhum" 
                        ? "(sem acompanhamento)" 
                        : "(valor mensal)"
                      }
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">DECIDA REALIZAR</h3>
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-center text-slate-400 text-sm mb-4">
                      Clique no botão abaixo para preencher os dados do contrato e gerar o PDF
                    </p>
                    <button
                      onClick={abrirModalContrato}
                      className="w-full py-4 bg-[#3A8DFF] hover:bg-[#3A8DFF]/80 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Gerar Contrato e Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

      {/* Modal de Contrato */}
      <ContratoModal
        isOpen={showContratoModal}
        onClose={() => setShowContratoModal(false)}
        onEnviar={handleEnviarContrato}
        dadosIniciais={{
          nome: dadosCliente.nome,
          email: dadosCliente.email,
          telefone: dadosCliente.telefone,
          cpf: undefined, // Será preenchido no modal
          profissao: situacaoProfissional.profissao,
          estadoCivil: infoFamiliar.estadoCivil,
          valorConsultoria: precoAvistaComDesconto,
        }}
      />

      {/* Modal de Notas */}
      {showNotasModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-yellow-400" />
                Notas do Consultor
              </h3>
              <p className="text-sm text-slate-400 mt-1">Adicione observações sobre o cliente</p>
            </div>
            <div className="p-6">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Digite suas observações..."
              />
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowNotasModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowNotasModal(false)}
                className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium transition-colors"
              >
                Salvar Notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Imóvel */}
      {modalImovel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl my-8">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-[#3A8DFF]" />
                Cadastro de imóvel
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome/Título <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoImovel.nome}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: Casa da Praia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Valor estimado <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoImovel.valor ? formatCurrency(novoImovel.valor) : ""}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, valor: parseCurrency(e.target.value).toString() }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="R$ 1.000.000,00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Categoria <span className="text-red-400">*</span></label>
                  <select
                    value={novoImovel.categoria}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {categoriasImovel.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estado <span className="text-red-400">*</span></label>
                  <select
                    value={novoImovel.estado}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {estadosBrasil.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cidade <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoImovel.cidade}
                    onChange={(e) => setNovoImovel(prev => ({ ...prev, cidade: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Digite a cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Imóvel quitado? <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    {["Sim", "Não"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNovoImovel(prev => ({ ...prev, quitado: opt }))}
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                          novoImovel.quitado === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Imóvel segurado? <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    {["Sim", "Não"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNovoImovel(prev => ({ ...prev, segurado: opt }))}
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                          novoImovel.segurado === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reside atualmente no imóvel? <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    {["Sim", "Não"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNovoImovel(prev => ({ ...prev, reside: opt }))}
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                          novoImovel.reside === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Imóvel está sendo alugado? <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNovoImovel(prev => ({ ...prev, alugando: opt }))}
                      className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                        novoImovel.alugando === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={novoImovel.descricao}
                  onChange={(e) => setNovoImovel(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white resize-none"
                  placeholder="Observações sobre o imóvel..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalImovel(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarImovel}
                disabled={!novoImovel.nome || !novoImovel.valor}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Automóvel */}
      {modalAutomovel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-[#3A8DFF]" />
                Cadastro de automóvel
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoAutomovel.nome}
                    onChange={(e) => setNovoAutomovel(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: Carro da Família"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Marca <span className="text-red-400">*</span></label>
                  <select
                    value={novoAutomovel.marca}
                    onChange={(e) => setNovoAutomovel(prev => ({ ...prev, marca: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {marcasAutomoveis.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Modelo <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoAutomovel.modelo}
                    onChange={(e) => setNovoAutomovel(prev => ({ ...prev, modelo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: Civic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ano do modelo <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoAutomovel.ano}
                    onChange={(e) => setNovoAutomovel(prev => ({ ...prev, ano: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: 2023"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Valor <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoAutomovel.valor ? formatCurrency(novoAutomovel.valor) : ""}
                    onChange={(e) => setNovoAutomovel(prev => ({ ...prev, valor: parseCurrency(e.target.value).toString() }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="R$ 100.000,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Automóvel quitado? <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    {["Sim", "Não"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNovoAutomovel(prev => ({ ...prev, quitado: opt }))}
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                          novoAutomovel.quitado === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Automóvel segurado? <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  {["Sim", "Não"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNovoAutomovel(prev => ({ ...prev, segurado: opt }))}
                      className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                        novoAutomovel.segurado === opt ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50" : "bg-slate-900/50 border-slate-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalAutomovel(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarAutomovel}
                disabled={!novoAutomovel.nome || !novoAutomovel.valor}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Dívida */}
      {modalDivida && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-400" />
                Cadastro de dívidas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novaDivida.nome}
                    onChange={(e) => setNovaDivida(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: Financiamento do Carro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de dívida <span className="text-red-400">*</span></label>
                  <select
                    value={novaDivida.tipo}
                    onChange={(e) => setNovaDivida(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {tiposDivida.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Instituição <span className="text-red-400">*</span></label>
                  <select
                    value={novaDivida.instituicao}
                    onChange={(e) => setNovaDivida(prev => ({ ...prev, instituicao: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {todasInstituicoes.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Possui bem em garantia?</label>
                  <select
                    value={novaDivida.garantia}
                    onChange={(e) => setNovaDivida(prev => ({ ...prev, garantia: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Saldo devedor <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={novaDivida.saldoDevedor ? formatCurrency(novaDivida.saldoDevedor) : ""}
                  onChange={(e) => setNovaDivida(prev => ({ ...prev, saldoDevedor: parseCurrency(e.target.value).toString() }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="R$"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalDivida(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarDivida}
                disabled={!novaDivida.nome || !novaDivida.saldoDevedor}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Outros Bens */}
      {modalOutroBem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#3A8DFF]" />
                Cadastro de outros bens
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoOutroBem.nome}
                    onChange={(e) => setNovoOutroBem(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="Ex: Relógio Rolex"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo <span className="text-red-400">*</span></label>
                  <select
                    value={novoOutroBem.tipo}
                    onChange={(e) => setNovoOutroBem(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                  >
                    <option value="">Selecione</option>
                    {tiposOutrosBens.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={novoOutroBem.valor ? formatCurrency(novoOutroBem.valor) : ""}
                  onChange={(e) => setNovoOutroBem(prev => ({ ...prev, valor: parseCurrency(e.target.value).toString() }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="R$"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalOutroBem(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarOutroBem}
                disabled={!novoOutroBem.nome || !novoOutroBem.valor}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filho */}
      {modalFilho && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Baby className="w-5 h-5 text-[#3A8DFF]" />
                Adicionar filho
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={novoFilho.nome}
                  onChange={(e) => setNovoFilho(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="Nome do filho"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Data de nascimento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={novoFilho.dataNascimento ? formatDate(novoFilho.dataNascimento) : ""}
                    onChange={(e) => {
                      const formatted = formatDate(e.target.value);
                      if (formatted.length <= 10) {
                        setNovoFilho(prev => ({ ...prev, dataNascimento: parseDate(formatted) }));
                      }
                    }}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gênero</label>
                <div className="grid grid-cols-2 gap-3">
                  {generos.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setNovoFilho(prev => ({ ...prev, genero: g.id }))}
                      className={`p-3 rounded-xl border transition-all text-sm ${
                        novoFilho.genero === g.id
                          ? "bg-[#3A8DFF]/20 border-[#3A8DFF]/50"
                          : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalFilho(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarFilho}
                disabled={!novoFilho.nome}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pet */}
      {modalPet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dog className="w-5 h-5 text-[#3A8DFF]" />
                Adicionar pet
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={novoPet.nome}
                  onChange={(e) => setNovoPet(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="Nome do pet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                <select
                  value={novoPet.tipo}
                  onChange={(e) => setNovoPet(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white appearance-none"
                >
                  <option value="">Selecione</option>
                  {tiposPets.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Raça</label>
                <input
                  type="text"
                  value={novoPet.raca}
                  onChange={(e) => setNovoPet(prev => ({ ...prev, raca: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="Raça do pet"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalPet(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarPet}
                disabled={!novoPet.nome}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cartão de Crédito */}
      {modalCartao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#3A8DFF]" />
                Cadastro cartão de crédito
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome/Título do cartão <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={novoCartao.nome}
                  onChange={(e) => setNovoCartao(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                  placeholder="Informe o nome/título do cartão"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={novoCartao.descricao}
                  onChange={(e) => setNovoCartao(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white resize-none"
                  rows={3}
                  placeholder="Breve descrição do uso do cartão"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Limite total <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoCartao.limiteTotal ? formatCurrency(novoCartao.limiteTotal) : ""}
                    onChange={(e) => setNovoCartao(prev => ({ ...prev, limiteTotal: parseCurrency(e.target.value).toString() }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Limite disponível <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={novoCartao.limiteDisponivel ? formatCurrency(novoCartao.limiteDisponivel) : ""}
                    onChange={(e) => setNovoCartao(prev => ({ ...prev, limiteDisponivel: parseCurrency(e.target.value).toString() }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setModalCartao(false)}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarCartao}
                disabled={!novoCartao.nome || !novoCartao.limiteTotal}
                className="px-5 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF] text-slate-900 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function FormularioNovoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#3A8DFF] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    }>
      <FormularioNovoContent />
    </Suspense>
  );
}