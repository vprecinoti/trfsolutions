import { api } from "../api";

export interface Reuniao {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora: string;
  duracao: number;
  tipo: "CONSULTORIA" | "ACOMPANHAMENTO" | "APRESENTACAO" | "OUTRO";
  status: "AGENDADA" | "CONFIRMADA" | "REALIZADA" | "CANCELADA";
  leadId?: string;
  lead?: { id: string; nome: string; email: string };
  user?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export async function getReunioes(): Promise<Reuniao[]> {
  const response = await api.get<Reuniao[]>("/reunioes");
  return response.data;
}

export async function getReuniao(id: string): Promise<Reuniao> {
  const response = await api.get<Reuniao>(`/reunioes/${id}`);
  return response.data;
}

export async function createReuniao(data: {
  titulo: string;
  descricao?: string;
  dataHora: string;
  duracao?: number;
  tipo?: string;
  leadId?: string;
}): Promise<Reuniao> {
  const response = await api.post<Reuniao>("/reunioes", data);
  return response.data;
}

export async function updateReuniao(id: string, data: Partial<{
  titulo: string;
  descricao: string;
  dataHora: string;
  duracao: number;
  tipo: string;
  status: string;
  leadId: string;
}>): Promise<Reuniao> {
  const response = await api.put<Reuniao>(`/reunioes/${id}`, data);
  return response.data;
}

export async function deleteReuniao(id: string): Promise<void> {
  await api.delete(`/reunioes/${id}`);
}
