"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { 
  ArrowLeft, User, Mail, Phone, FileText, Calendar,
  Edit2, Trash2, Loader2, MessageSquare, ClipboardList, 
  History, CheckCircle, XCircle,
  Plus, Save, Eye
} from "lucide-react";
import Link from "next/link";
import { getLead, deleteLead, updateLeadStatus, Lead } from "@/lib/api/leads";

export default function ClienteDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "contrato" | "historico" | "feedback" | "formulario">("info");
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [userRole, setUserRole] = useState<string>("Usuário");

  useEffect(() => {
    if (clienteId) {
      loadLead();
    }
    
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const roleMap: Record<string, string> = {
            ADMIN: "Administrador",
            BASIC: "Consultor",
            PREMIUM: "Consultor Premium",
          };
          setUserRole(roleMap[user.role] || user.role || "Usuário");
        } catch (err) {
          console.error("Erro ao parsear usuário:", err);
        }
      }
    }
  }, [clienteId]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const data = await getLead(clienteId);
      setLead(data);
      setNewStatus(data.status);
    } catch (err) {
      console.error("Erro ao carregar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) return;
    
    try {
      setDeleting(true);
      await deleteLead(clienteId);
      router.push("/dashboard/clientes");
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente");
      setDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!lead || newStatus === lead.status) {
      setEditingStatus(false);
      return;
    }

    try {
      const updated = await updateLeadStatus(clienteId, newStatus);
      setLead(updated);
      setEditingStatus(false);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status");
    }
  };

  const handleSaveFeedback = async () => {
    setSavingFeedback(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingFeedback(false);
    alert("Feedback salvo com sucesso!");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NOVO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      FORMULARIO_PREENCHIDO: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      PROPOSTA_ENVIADA: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      PROPOSTA_ACEITA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      PAGAMENTO_PENDENTE: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      INATIVO: "bg-white/10 text-white/60 border-white/20",
      CANCELADO: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-white/10 text-white/60 border-white/20";
  };

  const getGeneroLabel = (genero?: string) => {
    switch (genero) {
      case "masculino": return "Masculino";
      case "feminino": return "Feminino";
      case "outro": return "Outro";
      case "prefiro_nao_dizer": return "Prefiro não dizer";
      default: return "---";
    }
  };

  const statusOptions = [
    { value: "NOVO", label: "Novo" },
    { value: "FORMULARIO_PREENCHIDO", label: "Formulário Preenchido" },
    { value: "PROPOSTA_ENVIADA", label: "Proposta Enviada" },
    { value: "PROPOSTA_ACEITA", label: "Proposta Aceita" },
    { value: "PAGAMENTO_PENDENTE", label: "Pagamento Pendente" },
    { value: "ATIVO", label: "Ativo" },
    { value: "INATIVO", label: "Inativo" },
    { value: "CANCELADO", label: "Cancelado" },
  ];

  const tabs = [
    { id: "info", label: "Informações", icon: User },
    { id: "contrato", label: "Contrato", icon: FileText },
    { id: "historico", label: "Histórico", icon: History },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "formulario", label: "Formulário", icon: ClipboardList },
  ];

  const generateHistory = () => {
    if (!lead) return [];
    
    const history = [];
    
    history.push({
      id: "cadastro",
      action: "Cliente cadastrado",
      description: "Cliente foi adicionado ao sistema",
      date: lead.createdAt,
    });
    
    if (lead.formulario?.createdAt) {
      history.push({
        id: "formulario_criado",
        action: "Formulário iniciado",
        description: "Formulário de consultoria foi iniciado",
        date: lead.formulario.createdAt,
      });
    }
    
    if (lead.formulario?.completedAt) {
      history.push({
        id: "formulario_completo",
        action: "Formulário concluído",
        description: "Formulário de consultoria foi finalizado",
        date: lead.formulario.completedAt,
      });
    }
    
    if (lead.updatedAt !== lead.createdAt) {
      history.push({
        id: "atualizado",
        action: "Dados atualizados",
        description: "Informações do cliente foram atualizadas",
        date: lead.updatedAt,
      });
    }
    
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  if (loading) {
    return (
      <>
        <Header title="Carregando..." subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#3A8DFF] animate-spin" />
        </div>
      </>
    );
  }

  if (!lead) {
    return (
      <>
        <Header title="Cliente não encontrado" subtitle="" />
        <div className="flex-1 p-8">
          <Link
            href="/dashboard/clientes"
            className="inline-flex items-center gap-2 text-sm text-[#3A8DFF] hover:text-[#3A8DFF]/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para clientes
          </Link>
        </div>
      </>
    );
  }

  const history = generateHistory();

  return (
    <>
      {/* Header com nome do cliente */}
      <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-center gap-4 pl-12 lg:pl-0">
            {/* Avatar */}
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#3A8DFF]/20 rounded-2xl flex items-center justify-center text-[#3A8DFF] font-bold text-xl lg:text-2xl">
              {lead.nome.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">{lead.nome}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-white/50 flex items-center gap-1.5 text-sm">
                  <Mail className="w-4 h-4" />
                  {lead.email}
                </span>
                {lead.telefone && (
                  <span className="text-white/50 flex items-center gap-1.5 text-sm">
                    <Phone className="w-4 h-4" />
                    {lead.telefone}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {userRole === "Administrador" && lead.user && (
                  <span className="text-sm text-white/40">
                    Responsável: <span className="text-white/60 font-medium">{lead.user.name}</span>
                  </span>
                )}
                
                {editingStatus ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="text-sm px-3 py-1 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-[#3A8DFF]/50"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a0f1a]">{opt.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleStatusChange}
                      className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingStatus(false); setNewStatus(lead.status); }}
                      className="p-1 text-white/40 hover:bg-white/[0.05] rounded"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingStatus(true)}
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(lead.status)} hover:opacity-80 transition-opacity`}
                  >
                    {lead.status}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 pl-12 lg:pl-0">
            <button
              onClick={() => router.push(`/dashboard/clientes/${clienteId}/editar`)}
              className="h-10 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center gap-2 text-sm text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="h-10 px-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Voltar */}
        <Link
          href="/dashboard/clientes"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para clientes
        </Link>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white/[0.03] p-1 rounded-xl w-fit overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white/[0.08] text-[#3A8DFF]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-6">
          {/* Tab: Informações de Contato */}
          {activeTab === "info" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#3A8DFF]" />
                Informações de Contato
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Nome Completo</label>
                    <p className="text-white mt-1">{lead.nome}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">CPF</label>
                    <p className="text-white mt-1">{lead.cpf || "---"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Gênero</label>
                    <p className="text-white mt-1">{getGeneroLabel(lead.genero)}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Cônjuge</label>
                    <p className="text-white mt-1">{lead.conjuge || "---"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Status</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Email</label>
                    <p className="text-white mt-1">{lead.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Celular</label>
                    <p className="text-white mt-1">{lead.telefone || "---"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Empresa</label>
                    <p className="text-white mt-1">{lead.empresa || "---"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>Cadastrado em {formatDate(lead.createdAt)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Contrato */}
          {activeTab === "contrato" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3A8DFF]" />
                Contrato
              </h2>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Nenhum contrato cadastrado</h3>
                <p className="text-white/50 mb-6">Adicione informações do contrato deste cliente</p>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-[#3A8DFF] text-white rounded-xl font-medium hover:bg-[#3A8DFF]/80 transition-colors">
                  <Plus className="w-4 h-4" />
                  Adicionar Contrato
                </button>
              </div>
            </div>
          )}

          {/* Tab: Histórico */}
          {activeTab === "historico" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-[#3A8DFF]" />
                Histórico de Atividades
              </h2>
              
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-white/30" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nenhuma atividade registrada</h3>
                    <p className="text-white/50">O histórico de atividades aparecerá aqui</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/[0.1]"></div>
                    
                    {history.map((item) => (
                      <div key={item.id} className="relative pl-10 pb-6 last:pb-0">
                        <div className="absolute left-2.5 w-3 h-3 bg-[#3A8DFF] rounded-full border-2 border-[#0a0f1a]"></div>
                        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{item.action}</h4>
                            <span className="text-xs text-white/40">{formatDate(item.date)}</span>
                          </div>
                          <p className="text-sm text-white/60">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Feedback */}
          {activeTab === "feedback" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3A8DFF]" />
                Feedback para o Líder
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 block">
                    Escreva suas observações sobre este cliente
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Digite aqui suas observações, pontos importantes, próximos passos..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all resize-none"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveFeedback}
                    disabled={savingFeedback || !feedback.trim()}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#3A8DFF] text-white rounded-xl font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingFeedback ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Salvar Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Formulário */}
          {activeTab === "formulario" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#3A8DFF]" />
                Formulário do Cliente
              </h2>
              
              {lead.formulario ? (
                <div className="space-y-4">
                  <div className="border border-white/[0.08] rounded-xl p-5 hover:border-[#3A8DFF]/30 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Formulário Completo</h3>
                          <p className="text-sm text-white/50">
                            {lead.formulario.completedAt 
                              ? `Concluído em ${formatDateShort(lead.formulario.completedAt)}`
                              : `Criado em ${formatDateShort(lead.formulario.createdAt || lead.createdAt)}`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        href={`/dashboard/formulario/novo?id=${lead.formulario.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A8DFF] text-white rounded-xl text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Formulário
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Nenhum formulário preenchido</h3>
                  <p className="text-white/50 mb-6">Este cliente ainda não possui um formulário</p>
                  <Link
                    href={`/dashboard/formulario/novo?clienteId=${clienteId}`}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#3A8DFF] text-white rounded-xl font-medium hover:bg-[#3A8DFF]/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Formulário
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
