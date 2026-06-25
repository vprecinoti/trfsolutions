"use client";

import {
  faixaCores,
  faixaLabel,
  feedbackDiagnosticoGeral,
  feedbackPilar,
  pilaresMeta,
} from "@/lib/scoring";
import type { PilarId, ResultadoGeral } from "@/lib/scoring";
import { GaugeNota } from "./GaugeNota";
import { MiniBarra } from "./MiniBarra";
import {
  Sparkles,
  Target,
  Calendar,
  MessageCircle,
  Zap,
  Landmark,
  Shield,
  TrendingUp,
  Receipt,
  PieChart,
  Hammer,
  ClipboardList,
  HardHat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Iconografia monocromatica de cada pilar
const pilarIcone: Record<PilarId, LucideIcon> = {
  patrimonial: Landmark,
  protecao: Shield,
  aposentadoria: TrendingUp,
  otimizacao: Receipt,
  fluxo: PieChart,
};

interface RelatorioFinanceiroProps {
  resultado: ResultadoGeral;
  nomeCliente?: string;
  consultorNome?: string;
  dataEmissao?: string;
  // Campos opcionais para enriquecer o contexto do cliente no header
  rendaPassivaDesejada?: string | number;
  patrimonioLiquido?: number;
}

const moedaBR = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export function RelatorioFinanceiro({
  resultado,
  nomeCliente,
  consultorNome,
  dataEmissao,
  patrimonioLiquido,
}: RelatorioFinanceiroProps) {
  const corGeral = faixaCores[resultado.faixa];
  const diag = feedbackDiagnosticoGeral(resultado.faixa);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ============================================ */}
      {/* HEADER com gauge gigante e nota geral        */}
      {/* ============================================ */}
      <div
        className="relative overflow-hidden rounded-3xl border p-8 md:p-12"
        style={{
          background: `linear-gradient(135deg, ${corGeral.hex}15, rgba(15,23,42,0.6) 60%)`,
          borderColor: `${corGeral.hex}40`,
        }}
      >
        {/* halo de luz */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: corGeral.hex }}
        />

        <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="shrink-0">
            <GaugeNota
              nota={resultado.media}
              faixa={resultado.faixa}
              size={240}
              strokeWidth={16}
              label="Saude Financeira"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
              style={{
                background: `${corGeral.hex}20`,
                color: corGeral.hex,
                border: `1px solid ${corGeral.hex}55`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Diagnostico Financeiro
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              {nomeCliente ? `${nomeCliente},` : "Olá,"}{" "}
              <span style={{ color: corGeral.hex }}>{diag.titulo}</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
              {diag.feedback}
            </p>

            {diag.proximoPasso && (
              <div
                className="mt-5 p-4 rounded-2xl border flex items-start gap-3"
                style={{
                  background: `${corGeral.hex}10`,
                  borderColor: `${corGeral.hex}33`,
                }}
              >
                <Target className="w-5 h-5 mt-0.5 shrink-0" style={{ color: corGeral.hex }} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-1">
                    Meta principal
                  </p>
                  <p className="text-sm md:text-base text-white/90">{diag.proximoPasso}</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-white/50">
              {consultorNome && (
                <span>
                  Consultor: <span className="text-white/70">{consultorNome}</span>
                </span>
              )}
              {dataEmissao && (
                <span>
                  Emissao: <span className="text-white/70">{dataEmissao}</span>
                </span>
              )}
              {patrimonioLiquido !== undefined && (
                <span>
                  Patrimonio Liquido:{" "}
                  <span className="text-white/70">{moedaBR(patrimonioLiquido)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PLACAR GERAL - 5 mini cards                  */}
      {/* ============================================ */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#3A8DFF]" />
          Placar dos pilares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {resultado.pilares.map((p) => {
            const cor = faixaCores[p.faixa];
            const meta = pilaresMeta[p.id];
            const Icone = pilarIcone[p.id];
            return (
              <div
                key={p.id}
                className="relative rounded-2xl p-4 border bg-slate-800/40 backdrop-blur-sm"
                style={{ borderColor: `${cor.hex}33` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${cor.hex}18`, border: `1px solid ${cor.hex}44` }}
                  >
                    <Icone className="w-5 h-5" style={{ color: cor.hex }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `${cor.hex}20`, color: cor.hex }}
                  >
                    {faixaLabel[p.faixa]}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-snug min-h-[32px]">
                  {meta.titulo}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: cor.hex }}>
                    {p.nota}
                  </span>
                  <span className="text-xs text-white/40">/100</span>
                </div>
                <div className="mt-2">
                  <MiniBarra nota={p.nota} faixa={p.faixa} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* DIAGNOSTICO DETALHADO POR PILAR              */}
      {/* ============================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">Analise detalhada</h2>

        {resultado.pilares.map((p) => {
          const cor = faixaCores[p.faixa];
          const meta = pilaresMeta[p.id];
          const Icone = pilarIcone[p.id];
          const fb = feedbackPilar(p.id, p.faixa);
          return (
            <article
              key={p.id}
              className="rounded-2xl border bg-slate-800/40 overflow-hidden"
              style={{ borderColor: `${cor.hex}33` }}
            >
              {/* faixa lateral colorida */}
              <div className="grid grid-cols-[6px_1fr]">
                <div style={{ background: cor.hex }} />
                <div className="p-5 md:p-6">
                  <header className="flex flex-wrap items-start gap-3 justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${cor.hex}18`, border: `1px solid ${cor.hex}44` }}
                      >
                        <Icone className="w-6 h-6" style={{ color: cor.hex }} />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-white">
                          {meta.titulo}
                        </h3>
                        <p className="text-xs text-white/50">{meta.subtitulo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className="text-xl md:text-2xl font-bold leading-none"
                          style={{ color: cor.hex }}
                        >
                          {p.nota}%
                        </div>
                        <div
                          className="text-[10px] uppercase tracking-wider mt-1 font-semibold"
                          style={{ color: cor.hex }}
                        >
                          {faixaLabel[p.faixa]}
                        </div>
                      </div>
                    </div>
                  </header>

                  <MiniBarra nota={p.nota} faixa={p.faixa} />

                  <div className="mt-4">
                    <p className="font-semibold text-white text-sm mb-1">{fb.titulo}</p>
                    <p className="text-sm text-white/70 leading-relaxed">{fb.feedback}</p>
                  </div>

                  {fb.proximoPasso && (
                    <div
                      className="mt-4 p-3 rounded-xl border flex items-start gap-2"
                      style={{ background: `${cor.hex}10`, borderColor: `${cor.hex}33` }}
                    >
                      <Target className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cor.hex }} />
                      <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                        <span className="font-semibold uppercase tracking-wide text-[10px] text-white/50 mr-2">
                          Proximo passo
                        </span>
                        {fb.proximoPasso}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ============================================ */}
      {/* PROPOSTA DE CONSULTORIA                      */}
      {/* ============================================ */}
      <section className="rounded-3xl border border-[#3A8DFF]/30 bg-gradient-to-br from-[#3A8DFF]/10 via-slate-900/60 to-slate-900/80 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#3A8DFF]/15 border border-[#3A8DFF]/40 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-[#3A8DFF]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            A solucao: construindo a sua liberdade financeira
          </h2>
        </div>

        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
          Imagine a construcao de uma casa: voce precisa de um projeto antes de levantar paredes.
          Nosso trabalho e dividido em duas etapas para corrigir cada um dos pontos que aparecem
          neste diagnostico.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-[#3A8DFF]" />
              </div>
              <h3 className="font-semibold text-white">Etapa 1 - O Projeto</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Planejamento estrategico do zero, montado em <strong>6 reunioes ao longo de 2 meses</strong>.
              Funciona como o Waze da sua vida financeira: recalcula as rotas e te direciona pelo
              caminho mais seguro e rapido.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <HardHat className="w-4 h-4 text-[#3A8DFF]" />
              </div>
              <h3 className="font-semibold text-white">Etapa 2 - O Mestre de Obras</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Acompanhamento continuo para garantir que o plano seja executado, fiscalizando avancos,
              tirando duvidas e ajustando o que for preciso ao longo do caminho.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { titulo: "Reunioes ilimitadas", desc: "Tire suas duvidas sem se preocupar com o limite", icone: Calendar },
            { titulo: "Suporte 24h via WhatsApp", desc: "Acesso direto sempre que precisar de orientacao", icone: MessageCircle },
            { titulo: "6 reunioes estrategicas", desc: "Orcamento, protecao, investimentos, aquisicoes, aposentadoria e milhas", icone: Sparkles },
          ].map(({ titulo, desc, icone: Icon }) => (
            <div key={titulo} className="rounded-2xl border border-[#3A8DFF]/20 bg-[#3A8DFF]/5 p-4">
              <Icon className="w-5 h-5 text-[#3A8DFF] mb-2" />
              <p className="text-sm font-semibold text-white">{titulo}</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
