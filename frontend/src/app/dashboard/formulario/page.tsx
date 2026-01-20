"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { FileText, Clock, Trash2, ChevronRight, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFormularios, deleteFormulario, createFormulario, Formulario } from "@/lib/api/formularios";

const objetivosNomes: Record<string, string> = {
  imovel: "Imóvel", veiculo: "Veículo", viagens: "Viagens", aposentadoria: "Aposentadoria",
  familia: "Família", organizacao: "Organização", dividas: "Dívidas", outro: "Outro",
};

export default function FormularioPage() {
  const router = useRouter();
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { loadFormularios(); }, []);

  const loadFormularios = async () => {
    try {
      setLoading(true);
      const data = await getFormularios();
      setFormularios(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar formulários:", err);
      setError("Erro ao carregar formulários");
    } finally {
      setLoading(false);
    }
  };

  const handleNovoFormulario = async () => {
    try {
      const novoFormulario = await createFormulario({});
      router.push(`/dashboard/formulario/novo?id=${novoFormulario.id}`);
    } catch (err) {
      console.error("Erro ao criar formulário:", err);
      setError("Erro ao criar formulário");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;
    try {
      setDeletingId(id);
      await deleteFormulario(id);
      setFormularios((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Erro ao excluir formulário:", err);
      setError("Erro ao excluir formulário");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const rascunhos = formularios.filter((f) => f.status === "RASCUNHO");
  const completos = formularios.filter((f) => f.status === "COMPLETO");

  return (
    <>
      <Header title="Formulário de Consultoria" subtitle="Inicie o questionário com seu cliente" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:items-start">
          {/* Card para iniciar formulário */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/[0.08] p-6 md:p-8 flex flex-col h-fit">
            <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#3A8DFF]/20 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 md:w-8 md:h-8 text-[#3A8DFF]" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Questionário de Avaliação</h2>
            
            <button onClick={handleNovoFormulario}
              className="py-3 px-6 bg-[#3A8DFF] text-white rounded-xl font-semibold hover:bg-[#3A8DFF]/80 transition-all flex items-center justify-center gap-3 w-fit">
              <Plus className="w-5 h-5" />
              Novo Questionário
            </button>
          </div>

          {/* Lista de formulários salvos */}
          <div className="space-y-6">
            {/* Rascunhos */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden">
              <div className="p-6 border-b border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">Em Progresso</h3>
                    <p className="text-sm text-white/50">Formulários salvos automaticamente</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {loading ? (
                  <div className="p-8 text-center text-white/50">
                    <div className="w-6 h-6 border-2 border-[#3A8DFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Carregando...
                  </div>
                ) : rascunhos.length === 0 ? (
                  <div className="p-8 text-center text-white/40">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Nenhum formulário em progresso</p>
                  </div>
                ) : (
                  rascunhos.map((formulario) => (
                    <div key={formulario.id} className="p-4 hover:bg-white/[0.03] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white truncate">{formulario.clienteNome || "Cliente não identificado"}</h4>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <span>{formatDate(formulario.updatedAt)}</span>
                            <span>•</span>
                            <span>{formulario.progresso}% completo</span>
                          </div>
                          {formulario.objetivosSelecionados && (formulario.objetivosSelecionados as string[]).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(formulario.objetivosSelecionados as string[]).slice(0, 3).map((obj) => (
                                <span key={obj} className="px-2 py-0.5 bg-[#3A8DFF]/20 text-[#3A8DFF] text-xs rounded-full">{objetivosNomes[obj] || obj}</span>
                              ))}
                              {(formulario.objetivosSelecionados as string[]).length > 3 && (
                                <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full">+{(formulario.objetivosSelecionados as string[]).length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="w-20 hidden sm:block">
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#3A8DFF] rounded-full transition-all" style={{ width: `${formulario.progresso}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(formulario.id)} disabled={deletingId === formulario.id}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            {deletingId === formulario.id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                          <Link href={`/dashboard/formulario/novo?id=${formulario.id}`} className="p-2 text-[#3A8DFF] hover:bg-[#3A8DFF]/10 rounded-lg transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completos */}
            {completos.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden">
                <div className="p-6 border-b border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">Finalizados</h3>
                      <p className="text-sm text-white/50">Formulários completos</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-white/[0.08] max-h-64 overflow-auto">
                  {completos.map((formulario) => (
                    <div key={formulario.id} className="p-4 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{formulario.clienteNome}</h4>
                          <p className="text-xs text-white/50">Finalizado em {formatDate(formulario.completedAt || formulario.updatedAt)}</p>
                        </div>
                        {formulario.lead && (
                          <Link href={`/dashboard/clientes/${formulario.lead.id}`}
                            className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                            Ver cliente
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
