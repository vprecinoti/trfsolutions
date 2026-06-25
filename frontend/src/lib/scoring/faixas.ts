import type { Faixa } from "./types";

// Mapeia uma porcentagem 0-100 em uma faixa qualitativa.
// Faixas oficiais do .md:
// 0-30  Ruim
// 31-60 Medio
// 61-85 Bom
// 86-100 Excelente
export function classificarFaixa(percentual: number): Faixa {
  const p = Math.max(0, Math.min(100, Math.round(percentual)));
  if (p <= 30) return "ruim";
  if (p <= 60) return "medio";
  if (p <= 85) return "bom";
  return "excelente";
}

export const faixaLabel: Record<Faixa, string> = {
  ruim: "Ruim",
  medio: "Medio",
  bom: "Bom",
  excelente: "Excelente",
};

// Cores oficiais do .md (vermelho, amarelo, verde, azul)
export const faixaCores: Record<Faixa, { hex: string; bg: string; border: string; text: string; gradient: string }> = {
  ruim: {
    hex: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    gradient: "from-red-500 to-red-700",
  },
  medio: {
    hex: "#f59e0b",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    gradient: "from-amber-500 to-amber-700",
  },
  bom: {
    hex: "#10b981",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    gradient: "from-emerald-500 to-emerald-700",
  },
  excelente: {
    hex: "#3A8DFF",
    bg: "bg-[#3A8DFF]/10",
    border: "border-[#3A8DFF]/30",
    text: "text-[#3A8DFF]",
    gradient: "from-[#3A8DFF] to-blue-700",
  },
};

export const faixaEmoji: Record<Faixa, string> = {
  ruim: "🟥",
  medio: "🟨",
  bom: "🟩",
  excelente: "🟦",
};
