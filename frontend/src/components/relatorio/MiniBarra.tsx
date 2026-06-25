"use client";

import { faixaCores } from "@/lib/scoring";
import type { Faixa } from "@/lib/scoring";

interface MiniBarraProps {
  nota: number;
  faixa: Faixa;
  showLabel?: boolean;
}

// Barra de progresso fina com cor da faixa.
export function MiniBarra({ nota, faixa, showLabel = false }: MiniBarraProps) {
  const cor = faixaCores[faixa].hex;
  const valor = Math.max(0, Math.min(100, nota));

  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${valor}%`,
            background: `linear-gradient(90deg, ${cor}AA, ${cor})`,
            boxShadow: `0 0 12px ${cor}55`,
            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-[10px] text-white/40 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
