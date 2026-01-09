"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { 
  Users, Search, Mail, Phone, Calendar, 
  Loader2, Plus, ChevronRight, ChevronLeft, UserCircle
} from "lucide-react";
import Link from "next/link";
import { getLeads, Lead } from "@/lib/api/leads";

const ITEMS_PER_PAGE = 20;

export default function ClientesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [userRole, setUserRole] = useState<string>("BASIC");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadLeads();
    
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role || "BASIC");
        } catch (err) {
          console.error("Erro ao parsear usuário:", err);
        }
      }
    }
  }, []);

  const isAdmin = userRole === "ADMIN";

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        lead.nome.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        (lead.telefone && lead.telefone.includes(searchTerm));
      
      const matchesStatus = statusFilter === "TODOS" || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const statusOptions = [
    { value: "TODOS", label: "Todos" },
    { value: "NOVO", label: "Novo" },
    { value: "FORMULARIO_PREENCHIDO", label: "Form. Preenchido" },
    { value: "PROPOSTA_ENVIADA", label: "Proposta Enviada" },
    { value: "PROPOSTA_ACEITA", label: "Proposta Aceita" },
    { value: "PAGAMENTO_PENDENTE", label: "Pgto. Pendente" },
    { value: "ATIVO", label: "Ativo" },
    { value: "INATIVO", label: "Inativo" },
    { value: "CANCELADO", label: "Cancelado" },
  ];

  return (
    <>
      <Header 
        title="Clientes"
        subtitle="Gerencie seus clientes e acompanhe o progresso"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Barra de ações */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Busca */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all"
                />
              </div>

              {/* Filtro de Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:outline-none focus:border-[#3A8DFF]/50 transition-all cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[#0a0f1a] text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Adicionar Cliente */}
            <Link
              href="/dashboard/clientes/novo"
              className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="sm:inline">Adicionar</span>
            </Link>
          </div>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-12 sm:p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#3A8DFF] animate-spin mx-auto mb-4" />
            <p className="text-white/50">Carregando clientes...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-12 sm:p-16 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              {searchTerm || statusFilter !== "TODOS" ? "Nenhum cliente encontrado" : "Nenhum cliente ainda"}
            </h3>
            <p className="text-white/50 mb-6 max-w-sm mx-auto text-sm">
              {searchTerm || statusFilter !== "TODOS"
                ? "Tente buscar com outros termos ou altere o filtro"
                : "Adicione seu primeiro cliente para começar a gerenciar."
              }
            </p>
            {!searchTerm && statusFilter === "TODOS" && (
              <Link
                href="/dashboard/clientes/novo"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#3A8DFF] text-white rounded-xl font-medium hover:bg-[#3A8DFF]/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Cliente
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden">
            {/* Versão Mobile - Cards */}
            <div className="lg:hidden divide-y divide-white/[0.08]">
              {paginatedLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/clientes/${lead.id}`}
                  className="block p-4 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center text-[#3A8DFF] font-semibold text-sm flex-shrink-0">
                      {lead.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{lead.nome}</p>
                          {lead.empresa && (
                            <p className="text-xs text-white/50 truncate">{lead.empresa}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 border ${getStatusColor(lead.status)}`}>
                          {lead.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        {lead.telefone && (
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Phone className="w-3 h-3" />
                            <span>{lead.telefone}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.08]">
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                        {isAdmin && lead.user && (
                          <div className="flex items-center gap-1 text-xs text-white/40">
                            <UserCircle className="w-3 h-3" />
                            <span className="truncate max-w-[80px]">{lead.user.name}</span>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Versão Desktop - Tabela */}
            <div className="hidden lg:block">
              <div className={`grid gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.08] text-xs font-semibold text-white/40 uppercase tracking-wider ${isAdmin ? 'grid-cols-14' : 'grid-cols-12'}`}>
                <div className="col-span-4">Cliente</div>
                <div className="col-span-3">Contato</div>
                {isAdmin && <div className="col-span-2">Responsável</div>}
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Cadastro</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {paginatedLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/clientes/${lead.id}`}
                    className={`grid gap-4 px-6 py-4 hover:bg-white/[0.05] transition-colors cursor-pointer items-center group ${isAdmin ? 'grid-cols-14' : 'grid-cols-12'}`}
                  >
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center text-[#3A8DFF] font-semibold text-sm">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white group-hover:text-[#3A8DFF] transition-colors truncate">
                            {lead.nome}
                          </p>
                          {lead.empresa && (
                            <p className="text-sm text-white/50 truncate">{lead.empresa}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Mail className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        {lead.telefone && (
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Phone className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                            <span>{lead.telefone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4 text-white/40 flex-shrink-0" />
                          <span className="text-sm text-white/60 truncate">
                            {lead.user?.name || "—"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#3A8DFF] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer com paginação */}
            <div className="px-4 sm:px-6 py-3 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-white/50">
                {filteredLeads.length} cliente{filteredLeads.length !== 1 ? 's' : ''} 
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/[0.1] text-white/60 hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#3A8DFF] text-white'
                              : 'text-white/60 hover:bg-white/[0.05] border border-white/[0.1]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/[0.1] text-white/60 hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
