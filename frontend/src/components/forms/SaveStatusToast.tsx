"use client";

import { AlertTriangle, CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

interface SaveStatusToastProps {
  saving: boolean;
  saveError: string | null;
  lastSaved: Date | null;
  onRetry?: () => void;
}

/**
 * Componente visual que mostra o status do auto-save.
 * - "Salvando..." durante save
 * - "Salvo às HH:MM" após sucesso
 * - Alerta vermelho persistente se erro
 * - Detecta navegador offline
 */
export function SaveStatusToast({
  saving,
  saveError,
  lastSaved,
  onRetry,
}: SaveStatusToastProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Caso 1: Sem internet - alerta crítico persistente
  if (!isOnline) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm bg-amber-50 border-2 border-amber-500 rounded-lg shadow-2xl p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <WifiOff className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Sem conexão com internet</p>
            <p className="text-sm text-amber-800 mt-1">
              Seus dados estão sendo salvos localmente. Quando a conexão voltar, salvaremos no servidor automaticamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Caso 2: Erro de save - alerta vermelho persistente
  if (saveError) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm bg-red-50 border-2 border-red-500 rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-red-900">Erro ao salvar</p>
            <p className="text-sm text-red-800 mt-1">{saveError}</p>
            <p className="text-xs text-red-700 mt-2">
              Seus dados estão salvos localmente no navegador. Não feche esta aba.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Caso 3: Salvando
  if (saving) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-300 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        <span className="text-sm text-blue-800 font-medium">Salvando...</span>
      </div>
    );
  }

  // Caso 4: Salvo recentemente
  if (lastSaved) {
    const minutesAgo = Math.floor((Date.now() - lastSaved.getTime()) / 60000);
    const timeText =
      minutesAgo < 1
        ? "agora"
        : minutesAgo === 1
          ? "há 1 min"
          : `há ${minutesAgo} min`;

    return (
      <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-300 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 opacity-90">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-800">Salvo {timeText}</span>
      </div>
    );
  }

  return null;
}
