import { api } from "../api";

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  rg?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  conjuge?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  valorContrato?: number;
  formaPagamento?: string;
  statusContrato?: string;
  contratoEnviadoEm?: string;
  contratoAssinadoEm?: string;
  status: "NOVO" | "FORMULARIO_PREENCHIDO" | "PROPOSTA_ENVIADA" | "PROPOSTA_ACEITA" | "PAGAMENTO_PENDENTE" | "ATIVO" | "INATIVO" | "CANCELADO";
  scoreFinal?: number;
  resultadoJson?: any;
  createdAt: string;
  updatedAt: string;
  formulario?: {
    id: string;
    completedAt?: string;
    createdAt?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function getLeads(): Promise<Lead[]> {
  const response = await api.get<Lead[]>("/leads");
  return response.data;
}

export async function getLead(id: string): Promise<Lead> {
  const response = await api.get<Lead>(`/leads/${id}`);
  return response.data;
}

export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  const response = await api.put<Lead>(`/leads/${id}/status`, { status });
  return response.data;
}

export async function deleteLead(id: string): Promise<void> {
  await api.delete(`/leads/${id}`);
}

export async function createLead(data: {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  rg?: string;
  estadoCivil?: string;
  profissao?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
}): Promise<Lead> {
  const response = await api.post<Lead>("/leads", data);
  return response.data;
}

export async function updateLead(id: string, data: Partial<{
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cpf: string;
  rg: string;
  genero: string;
  estadoCivil: string;
  profissao: string;
  conjuge: string;
  endereco: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  status: string;
  valorContrato: number;
  formaPagamento: string;
  statusContrato: string;
}>): Promise<Lead> {
  const response = await api.put<Lead>(`/leads/${id}`, data);
  return response.data;
}
