import { api } from "../api";

export interface Formulario {
  id: string;
  clienteNome?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  objetivosSelecionados?: string[];
  respostas?: Record<string, Record<number, string>>;
  stepAtual: number;
  status: "RASCUNHO" | "COMPLETO" | "ABANDONADO";
  progresso: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  leadId?: string;
  lead?: {
    id: string;
    nome: string;
  };
}

export interface FormularioStats {
  total: number;
  rascunhos: number;
  completos: number;
  abandonados: number;
}

export interface CreateFormularioDto {
  clienteNome?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  objetivosSelecionados?: string[];
  respostas?: Record<string, Record<number, string>>;
  stepAtual?: number;
  progresso?: number;
}

export interface UpdateFormularioDto extends CreateFormularioDto {
  status?: "RASCUNHO" | "COMPLETO" | "ABANDONADO";
}

// Criar novo formulário
export async function createFormulario(data: CreateFormularioDto): Promise<Formulario> {
  const response = await api.post<Formulario>("/formularios", data);
  return response.data;
}

// Listar formulários
export async function getFormularios(status?: string): Promise<Formulario[]> {
  const params = status ? { status } : {};
  const response = await api.get<Formulario[]>("/formularios", { params });
  return response.data;
}

// Buscar formulário por ID
export async function getFormulario(id: string): Promise<Formulario> {
  const response = await api.get<Formulario>(`/formularios/${id}`);
  return response.data;
}

// Atualizar formulário (auto-save)
export async function updateFormulario(id: string, data: UpdateFormularioDto): Promise<Formulario> {
  const response = await api.put<Formulario>(`/formularios/${id}`, data);
  return response.data;
}

// Completar formulário
export async function completeFormulario(id: string, dadosContrato?: {
  cpf?: string;
  rg?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  estadoCivil?: string;
  profissao?: string;
  valorContrato?: number;
  formaPagamento?: string;
}): Promise<Formulario> {
  const response = await api.post<Formulario>(`/formularios/${id}/complete`, dadosContrato || {});
  return response.data;
}

// Excluir formulário
export async function deleteFormulario(id: string): Promise<void> {
  await api.delete(`/formularios/${id}`);
}

// Estatísticas
export async function getFormularioStats(): Promise<FormularioStats> {
  const response = await api.get<FormularioStats>("/formularios/stats");
  return response.data;
}

