"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  User,
  Loader2,
  Trash2,
  Calendar,
} from "lucide-react";
import { getReunioes, createReuniao, updateReuniao, deleteReuniao, Reuniao } from "@/lib/api/reunioes";
import { getLeads, Lead } from "@/lib/api/leads";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const TIPOS_REUNIAO = [
  { value: "CONSULTORIA", label: "Consultoria", cor: "bg-blue-500" },
  { value: "ACOMPANHAMENTO", label: "Acompanhamento", cor: "bg-emerald-500" },
  { value: "APRESENTACAO", label: "Apresentação", cor: "bg-purple-500" },
  { value: "OUTRO", label: "Outro", cor: "bg-slate-500" },
];

const STATUS_REUNIAO = [
  { value: "AGENDADA", label: "Agendada" },
  { value: "CONFIRMADA", label: "Confirmada" },
  { value: "REALIZADA", label: "Realizada" },
  { value: "CANCELADA", label: "Cancelada" },
];

function getCorTipo(tipo: string) {
  return TIPOS_REUNIAO.find((t) => t.value === tipo)?.cor || "bg-slate-500";
}

export default function AgendaPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [novaReuniao, setNovaReuniao] = useState({
    titulo: "",
    descricao: "",
    dataHora: "",
    duracao: "60",
    tipo: "CONSULTORIA",
    leadId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reunioesData, leadsData] = await Promise.all([getReunioes(), getLeads()]);
      setReunioes(reunioesData);
      setLeads(leadsData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gerar dias do calendário
  const diasCalendario = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasAntes = primeiroDia.getDay();
    const dias: { data: Date; mesAtual: boolean }[] = [];

    // Dias do mês anterior
    for (let i = diasAntes - 1; i >= 0; i--) {
      dias.push({ data: new Date(ano, mes, -i), mesAtual: false });
    }
    // Dias do mês atual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push({ data: new Date(ano, mes, i), mesAtual: true });
    }
    // Completar até 42 (6 semanas)
    const restante = 42 - dias.length;
    for (let i = 1; i <= restante; i++) {
      dias.push({ data: new Date(ano, mes + 1, i), mesAtual: false });
    }
    return dias;
  }, [mesAtual]);

  const reunioesDoDia = (data: Date) => {
    return reunioes.filter((r) => {
      const d = new Date(r.dataHora);
      return d.getDate() === data.getDate() && d.getMonth() === data.getMonth() && d.getFullYear() === data.getFullYear();
    });
  };

  const reunioesDiaSelecionado = diaSelecionado ? reunioesDoDia(diaSelecionado) : [];

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
  };

  const mesAnterior = () => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
  const mesSeguinte = () => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));

  const abrirModalNova = (data?: Date) => {
    const d = data || new Date();
    const dataFormatada = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T10:00`;
    setNovaReuniao({ titulo: "", descricao: "", dataHora: dataFormatada, duracao: "60", tipo: "CONSULTORIA", leadId: "" });
    setShowModal(true);
  };

  const salvarReuniao = async () => {
    if (!novaReuniao.titulo || !novaReuniao.dataHora) {
      alert("Preencha o título e a data/hora");
      return;
    }
    try {
      setSaving(true);
      await createReuniao({
        titulo: novaReuniao.titulo,
        descricao: novaReuniao.descricao || undefined,
        dataHora: new Date(novaReuniao.dataHora).toISOString(),
        duracao: parseInt(novaReuniao.duracao),
        tipo: novaReuniao.tipo,
        leadId: novaReuniao.leadId || undefined,
      });
      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error("Erro ao criar reunião:", err);
      alert("Erro ao criar reunião");
    } finally {
      setSaving(false);
    }
  };

  const removerReuniao = async (id: string) => {
    if (!confirm("Deseja remover esta reunião?")) return;
    try {
      await deleteReuniao(id);
      await loadData();
    } catch (err) {
      console.error("Erro ao remover reunião:", err);
    }
  };

  const atualizarStatus = async (id: string, status: string) => {
    try {
      await updateReuniao(id, { status });
      await loadData();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const formatHora = (dataHora: string) => {
    const d = new Date(dataHora);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <>
        <Header title="Agenda" subtitle="Suas reuniões e compromissos" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A8DFF]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Agenda" subtitle="Suas reuniões e compromissos" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={mesAnterior} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white/60" />
                  </button>
                  <button
                    onClick={() => setMesAtual(new Date())}
                    className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                  >
                    Hoje
                  </button>
                  <button onClick={mesSeguinte} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-white/60" />
                  </button>
                  <button
                    onClick={() => abrirModalNova()}
                    className="ml-2 px-4 py-2 bg-[#3A8DFF] hover:bg-[#3A8DFF]/80 rounded-xl text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Reunião
                  </button>
                </div>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="text-center text-xs font-medium text-white/40 py-2">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Grid de dias */}
              <div className="grid grid-cols-7 gap-1">
                {diasCalendario.map(({ data, mesAtual: isMesAtual }, i) => {
                  const reunioesDia = reunioesDoDia(data);
                  const selecionado = diaSelecionado && data.getDate() === diaSelecionado.getDate() && data.getMonth() === diaSelecionado.getMonth() && data.getFullYear() === diaSelecionado.getFullYear();
                  return (
                    <button
                      key={i}
                      onClick={() => setDiaSelecionado(data)}
                      onDoubleClick={() => abrirModalNova(data)}
                      className={`relative min-h-[80px] p-2 rounded-xl border transition-all text-left ${
                        selecionado
                          ? "border-[#3A8DFF]/50 bg-[#3A8DFF]/10"
                          : "border-transparent hover:bg-white/[0.03]"
                      } ${!isMesAtual ? "opacity-30" : ""}`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isHoje(data)
                            ? "w-7 h-7 bg-[#3A8DFF] text-white rounded-full flex items-center justify-center"
                            : "text-white/70"
                        }`}
                      >
                        {data.getDate()}
                      </span>
                      {reunioesDia.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {reunioesDia.slice(0, 2).map((r) => (
                            <div
                              key={r.id}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${getCorTipo(r.tipo)} text-white truncate`}
                            >
                              {formatHora(r.dataHora)} {r.titulo}
                            </div>
                          ))}
                          {reunioesDia.length > 2 && (
                            <div className="text-[10px] text-white/40 px-1.5">
                              +{reunioesDia.length - 2} mais
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Painel lateral - Reuniões do dia */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#3A8DFF]" />
                {diaSelecionado
                  ? `${diaSelecionado.getDate()} de ${MESES[diaSelecionado.getMonth()]}`
                  : "Selecione um dia"}
              </h3>

              {diaSelecionado ? (
                reunioesDiaSelecionado.length > 0 ? (
                  <div className="space-y-3">
                    {reunioesDiaSelecionado.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCorTipo(r.tipo)}`} />
                            <span className="text-sm font-medium text-white">{r.titulo}</span>
                          </div>
                          <button
                            onClick={() => removerReuniao(r.id)}
                            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                          <Clock className="w-3.5 h-3.5" />
                          {formatHora(r.dataHora)} - {r.duracao}min
                        </div>
                        {r.lead && (
                          <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                            <User className="w-3.5 h-3.5" />
                            {r.lead.nome}
                          </div>
                        )}
                        {r.descricao && (
                          <p className="text-xs text-white/40 mb-3">{r.descricao}</p>
                        )}
                        <select
                          value={r.status}
                          onChange={(e) => atualizarStatus(r.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-white"
                        >
                          {STATUS_REUNIAO.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40 mb-3">Nenhuma reunião neste dia</p>
                    <button
                      onClick={() => abrirModalNova(diaSelecionado)}
                      className="px-4 py-2 bg-[#3A8DFF] hover:bg-[#3A8DFF]/80 rounded-xl text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agendar
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/40">Clique em um dia para ver as reuniões</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nova Reunião */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Nova Reunião</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Título *</label>
                <input
                  type="text"
                  value={novaReuniao.titulo}
                  onChange={(e) => setNovaReuniao((p) => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ex: Reunião com João"
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Data e Hora *</label>
                  <input
                    type="datetime-local"
                    value={novaReuniao.dataHora}
                    onChange={(e) => setNovaReuniao((p) => ({ ...p, dataHora: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Duração (min)</label>
                  <select
                    value={novaReuniao.duracao}
                    onChange={(e) => setNovaReuniao((p) => ({ ...p, duracao: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="30">30 min</option>
                    <option value="60">1 hora</option>
                    <option value="90">1h30</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Tipo</label>
                  <select
                    value={novaReuniao.tipo}
                    onChange={(e) => setNovaReuniao((p) => ({ ...p, tipo: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                  >
                    {TIPOS_REUNIAO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Cliente</label>
                  <select
                    value={novaReuniao.leadId}
                    onChange={(e) => setNovaReuniao((p) => ({ ...p, leadId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="">Nenhum</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>{l.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                <textarea
                  value={novaReuniao.descricao}
                  onChange={(e) => setNovaReuniao((p) => ({ ...p, descricao: e.target.value }))}
                  placeholder="Observações (opcional)"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarReuniao}
                disabled={saving}
                className="px-5 py-2.5 bg-[#3A8DFF] hover:bg-[#3A8DFF]/80 rounded-xl text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Criar Reunião
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
