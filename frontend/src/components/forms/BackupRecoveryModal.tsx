"use client";

import { History, X } from "lucide-react";
import type { LocalBackup } from "@/lib/formularioBackup";

interface BackupRecoveryModalProps {
  backup: LocalBackup;
  onRecover: () => void;
  onDiscard: () => void;
}

/**
 * Modal que aparece quando detectamos um backup local mais novo
 * que o estado salvo no servidor (ex: aba fechou antes do save concluir).
 */
export function BackupRecoveryModal({
  backup,
  onRecover,
  onDiscard,
}: BackupRecoveryModalProps) {
  const date = new Date(backup.timestamp);
  const formattedDate = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <History className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Backup local encontrado
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Detectamos dados não salvos no servidor da sua última sessão.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
          <p className="text-sm text-amber-900">
            <strong>Última edição local:</strong>{" "}
            <span className="font-mono">{formattedDate}</span>
          </p>
          <p className="text-xs text-amber-800 mt-2">
            Isso pode acontecer se a internet caiu, a aba foi fechada antes do save, ou houve algum erro de conexão.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Descartar backup
          </button>
          <button
            onClick={onRecover}
            className="flex-1 px-4 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2 shadow-md"
          >
            <History className="w-4 h-4" />
            Recuperar dados
          </button>
        </div>
      </div>
    </div>
  );
}
