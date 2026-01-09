import { api } from "../api";

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  genero?: string;
  conjuge?: string;
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
  // Dados do usuário responsável (para Admin ver quem é o dono)
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Listar todos os leads do usuário
export async function getLeads(): Promise<Lead[]> {
  const response = await api.get<Lead[]>("/leads");
  return response.data;
}

// Buscar lead por ID
export async function getLead(id: string): Promise<Lead> {
  const response = await api.get<Lead>(`/leads/${id}`);
  return response.data;
}

// Atualizar status do lead
export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  const response = await api.put<Lead>(`/leads/${id}/status`, { status });
  return response.data;
}

// Deletar lead
export async function deleteLead(id: string): Promise<void> {
  await api.delete(`/leads/${id}`);
}

// Criar novo lead
export async function createLead(data: {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}): Promise<Lead> {
  const response = await api.post<Lead>("/leads", data);
  return response.data;
}

// Atualizar lead
export async function updateLead(id: string, data: Partial<{
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
}>): Promise<Lead> {
  const response = await api.put<Lead>(`/leads/${id}`, data);
  return response.data;
}

