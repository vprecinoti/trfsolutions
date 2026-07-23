/**
 * Sistema de backup local de formulários no localStorage.
 * 
 * Funciona como SAFETY NET: mesmo se o backend cair, se a internet
 * sumir, ou se o token expirar, os dados ficam salvos LOCALMENTE
 * no navegador do usuário e podem ser recuperados.
 */

const BACKUP_PREFIX = "formulario_backup_v1_";
const BACKUP_INDEX_KEY = "formulario_backup_index_v1";
const MAX_BACKUPS_PER_FORM = 5; // Mantém últimas 5 versões locais
const MAX_TOTAL_BACKUPS = 20; // Limite global (para não estourar localStorage)

export interface LocalBackup {
  formularioId: string;
  timestamp: number;
  isoTime: string;
  data: any;
  syncedAt?: number; // quando o servidor confirmou o save
}

interface BackupIndex {
  ids: string[]; // chaves de backup ordenadas por mais recente primeiro
}

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // QuotaExceeded - tenta limpar backups antigos
    console.warn("localStorage cheio, limpando backups antigos:", err);
    cleanupOldBackups();
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}

function getIndex(): BackupIndex {
  return safeGet<BackupIndex>(BACKUP_INDEX_KEY) || { ids: [] };
}

function setIndex(index: BackupIndex) {
  safeSet(BACKUP_INDEX_KEY, index);
}

function cleanupOldBackups() {
  const index = getIndex();
  // Remove os mais antigos até ficar no limite/2
  while (index.ids.length > MAX_TOTAL_BACKUPS / 2) {
    const oldKey = index.ids.pop();
    if (oldKey) {
      localStorage.removeItem(oldKey);
    }
  }
  setIndex(index);
}

/**
 * Salva um backup do formulário localmente.
 * Chame isso ANTES de tentar salvar no servidor.
 */
export function saveLocalBackup(formularioId: string, data: any): void {
  if (typeof window === "undefined") return;

  const timestamp = Date.now();
  const key = `${BACKUP_PREFIX}${formularioId}_${timestamp}`;
  const backup: LocalBackup = {
    formularioId,
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
    data,
  };

  if (!safeSet(key, backup)) {
    console.error("Não foi possível salvar backup local");
    return;
  }

  // Atualizar índice
  const index = getIndex();
  index.ids.unshift(key);

  // Limitar backups por formulário
  const sameFormBackups = index.ids.filter((k) =>
    k.startsWith(`${BACKUP_PREFIX}${formularioId}_`),
  );
  if (sameFormBackups.length > MAX_BACKUPS_PER_FORM) {
    const toRemove = sameFormBackups.slice(MAX_BACKUPS_PER_FORM);
    toRemove.forEach((k) => {
      localStorage.removeItem(k);
      index.ids = index.ids.filter((id) => id !== k);
    });
  }

  // Limitar total global
  while (index.ids.length > MAX_TOTAL_BACKUPS) {
    const oldKey = index.ids.pop();
    if (oldKey) localStorage.removeItem(oldKey);
  }

  setIndex(index);
}

/**
 * Marca o último backup local como sincronizado com o servidor
 */
export function markBackupSynced(formularioId: string): void {
  if (typeof window === "undefined") return;

  const backup = getLatestLocalBackup(formularioId);
  if (!backup) return;

  const key = `${BACKUP_PREFIX}${formularioId}_${backup.timestamp}`;
  const updated = { ...backup, syncedAt: Date.now() };
  safeSet(key, updated);
}

/**
 * Retorna o backup mais recente para um formulário (mesmo se sincronizado)
 */
export function getLatestLocalBackup(formularioId: string): LocalBackup | null {
  if (typeof window === "undefined") return null;

  const index = getIndex();
  const formKeys = index.ids.filter((k) =>
    k.startsWith(`${BACKUP_PREFIX}${formularioId}_`),
  );

  if (formKeys.length === 0) return null;

  const latest = safeGet<LocalBackup>(formKeys[0]);
  return latest;
}

/**
 * Retorna o backup mais recente NÃO sincronizado.
 * Útil ao abrir o formulário: se há um backup mais novo que o servidor, oferecer recuperação.
 */
export function getUnsyncedBackup(formularioId: string): LocalBackup | null {
  const latest = getLatestLocalBackup(formularioId);
  if (!latest) return null;
  if (latest.syncedAt && latest.syncedAt >= latest.timestamp) return null;
  return latest;
}

/**
 * Retorna todos os backups locais (para painel de recuperação)
 */
export function getAllLocalBackups(formularioId?: string): LocalBackup[] {
  if (typeof window === "undefined") return [];

  const index = getIndex();
  const keys = formularioId
    ? index.ids.filter((k) => k.startsWith(`${BACKUP_PREFIX}${formularioId}_`))
    : index.ids;

  return keys
    .map((k) => safeGet<LocalBackup>(k))
    .filter((b): b is LocalBackup => b !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Limpa backups de um formulário (chamar após complete com sucesso)
 */
export function clearBackupsForForm(formularioId: string): void {
  if (typeof window === "undefined") return;

  const index = getIndex();
  const formKeys = index.ids.filter((k) =>
    k.startsWith(`${BACKUP_PREFIX}${formularioId}_`),
  );
  formKeys.forEach((k) => localStorage.removeItem(k));
  index.ids = index.ids.filter((k) => !formKeys.includes(k));
  setIndex(index);
}

// ============================================================
// BACKUP PENDENTE (sem formularioId ainda)
// ============================================================
// Rede de segurança extra: se por algum motivo o usuário chegar
// na tela do formulário sem um formularioId (bug de rota, race
// condition, criação do formulário no backend falhou etc.), ainda
// assim conseguimos salvar os dados digitados no localStorage e
// depois migrá-los para o formulário definitivo assim que o id
// existir.

const PENDING_BACKUP_KEY = "formulario_backup_pending_v1";

export interface PendingBackup {
  timestamp: number;
  isoTime: string;
  clienteId?: string; // se o usuário veio a partir de um cliente
  data: any;
}

/**
 * Salva um backup pendente (ainda não tem formularioId associado).
 * Sobrescreve o anterior — mantemos apenas o mais recente.
 */
export function savePendingBackup(data: any, clienteId?: string): void {
  if (typeof window === "undefined") return;
  const timestamp = Date.now();
  const backup: PendingBackup = {
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
    clienteId,
    data,
  };
  safeSet(PENDING_BACKUP_KEY, backup);
}

export function getPendingBackup(): PendingBackup | null {
  if (typeof window === "undefined") return null;
  return safeGet<PendingBackup>(PENDING_BACKUP_KEY);
}

export function clearPendingBackup(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_BACKUP_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Migra o backup pendente para o formulário definitivo assim que o
 * formularioId estiver disponível. Depois de migrar, o pendente é
 * removido.
 */
export function migratePendingBackup(formularioId: string): PendingBackup | null {
  const pending = getPendingBackup();
  if (!pending) return null;
  saveLocalBackup(formularioId, pending.data);
  clearPendingBackup();
  return pending;
}
