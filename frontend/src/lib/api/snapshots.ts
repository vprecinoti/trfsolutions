import { api } from "../api";

export interface SnapshotMeta {
  id: string;
  createdAt: string;
  stepAtual: number;
  progresso: number;
  source: string;
  clienteNome?: string;
  clienteEmail?: string;
}

export interface SnapshotFull extends SnapshotMeta {
  formularioId: string;
  userId: string;
  payload: any;
  userAgent?: string;
  ipAddress?: string;
}

// Listar snapshots de um formulário
export async function getSnapshots(formularioId: string): Promise<SnapshotMeta[]> {
  const response = await api.get<SnapshotMeta[]>(`/formularios/${formularioId}/snapshots`);
  return response.data;
}

// Buscar snapshot com payload completo
export async function getSnapshot(snapshotId: string): Promise<SnapshotFull> {
  const response = await api.get<SnapshotFull>(`/formularios/snapshots/${snapshotId}`);
  return response.data;
}

// Restaurar formulário a partir de um snapshot
export async function restoreSnapshot(snapshotId: string): Promise<void> {
  await api.post(`/formularios/snapshots/${snapshotId}/restore`);
}

// Logar erro do frontend
export async function logFrontendError(input: {
  formularioId?: string;
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  payload?: any;
  url?: string;
}): Promise<void> {
  try {
    await api.post("/error-logs", input);
  } catch (err) {
    // Não propaga - log de erro nunca deve quebrar a aplicação
    console.error("Falha ao registrar erro no servidor:", err);
  }
}
