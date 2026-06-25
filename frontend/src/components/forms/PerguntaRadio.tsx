"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface PerguntaRadioOpcao {
  id: string;
  label: string;
  descricao?: string;
  // Mantido apenas para uso interno/logica. Nao e renderizado em tela
  // para nao revelar a melhor resposta ao cliente.
  badge?: string;
  highlight?: "neutra" | "anulada";
}

interface PerguntaRadioProps {
  numero?: number | string;
  icon?: LucideIcon;
  titulo: string;
  subtitulo?: string;
  valor: string;
  opcoes: PerguntaRadioOpcao[];
  onChange: (valor: string) => void;
  obrigatoria?: boolean;
  ajuda?: ReactNode;
  className?: string;
}

// Pergunta padrao com opcoes radio em estilo escuro.
// Os pontos das alternativas NAO sao exibidos (cliente nao deve ver o gabarito).
export function PerguntaRadio({
  numero,
  icon: Icon,
  titulo,
  subtitulo,
  valor,
  opcoes,
  onChange,
  obrigatoria,
  ajuda,
  className = "",
}: PerguntaRadioProps) {
  return (
    <div
      className={`bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 ${className}`}
    >
      <div className="flex items-start gap-3 mb-2">
        {(Icon || numero !== undefined) && (
          <div className="shrink-0 w-9 h-9 rounded-xl bg-[#3A8DFF]/15 border border-[#3A8DFF]/30 flex items-center justify-center text-sm font-semibold text-[#3A8DFF]">
            {Icon ? <Icon className="w-4 h-4" /> : numero}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
            {titulo}
            {obrigatoria && <span className="text-[#3A8DFF]"> *</span>}
          </h3>
          {subtitulo && (
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{subtitulo}</p>
          )}
        </div>
      </div>

      {ajuda && (
        <div className="mt-3 mb-4 text-xs text-slate-500 italic">{ajuda}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {opcoes.map((op) => {
          const ativo = valor === op.id;
          const ehAnulada = op.highlight === "anulada";
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => onChange(op.id)}
              className={`text-left p-4 rounded-xl border transition-all flex gap-3 items-start ${
                ativo
                  ? "bg-[#3A8DFF]/15 border-[#3A8DFF]/60 ring-1 ring-[#3A8DFF]/40"
                  : ehAnulada
                  ? "bg-slate-900/30 border-slate-700/40 hover:border-slate-600 border-dashed"
                  : "bg-slate-900/30 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-full shrink-0 border flex items-center justify-center ${
                  ativo
                    ? "bg-[#3A8DFF] border-[#3A8DFF]"
                    : "border-slate-500"
                }`}
              >
                {ativo && <Check className="w-3 h-3 text-slate-900" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{op.label}</p>
                {op.descricao && (
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {op.descricao}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
