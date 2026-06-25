"use client";

import { faixaCores } from "@/lib/scoring";
import type { Faixa } from "@/lib/scoring";

interface GaugeNotaProps {
  nota: number;
  faixa: Faixa;
  size?: number; // diametro em px
  strokeWidth?: number;
  label?: string;
}

// Gauge circular com cor da faixa, no estilo "score".
export function GaugeNota({
  nota,
  faixa,
  size = 220,
  strokeWidth = 14,
  label,
}: GaugeNotaProps) {
  const cor = faixaCores[faixa].hex;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, nota)) / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`grad-${faixa}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={cor} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#grad-${faixa})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 12px ${cor}77)`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="text-5xl md:text-6xl font-bold tracking-tight"
          style={{ color: cor }}
        >
          {Math.round(nota)}
          <span className="text-2xl text-white/60 ml-0.5">%</span>
        </span>
        {label && (
          <span className="text-xs uppercase tracking-wider text-white/50 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
