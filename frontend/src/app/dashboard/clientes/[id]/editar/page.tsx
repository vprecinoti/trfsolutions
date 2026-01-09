"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { ArrowLeft, User, Mail, Phone, Building, Loader2, Save, CreditCard, Users, Heart } from "lucide-react";
import Link from "next/link";
import { getLead, updateLead } from "@/lib/api/leads";

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cpf: "",
    genero: "",
    conjuge: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clienteId) {
      loadLead();
    }
  }, [clienteId]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const data = await getLead(clienteId);
      setFormData({
        nome: data.nome || "",
        email: data.email || "",
        telefone: data.telefone || "",
        empresa: data.empresa || "",
        cpf: data.cpf || "",
        genero: data.genero || "",
        conjuge: data.conjuge || "",
        status: data.status || "NOVO",
      });
    } catch (err) {
      console.error("Erro ao carregar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      await updateLead(clienteId, formData);
      router.push(`/dashboard/clientes/${clienteId}`);
    } catch (err: any) {
      console.error("Erro ao atualizar cliente:", err);
      alert(err.response?.data?.message || "Erro ao atualizar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const generoOptions = [
    { value: "", label: "Selecione..." },
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
  ];

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

  return (
    <>
      <Header 
        title="Editar Cliente"
        subtitle="Atualize as informações do cliente"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Voltar */}
        <Link
          href={`/dashboard/clientes/${clienteId}`}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para detalhes
        </Link>

        {/* Formulário */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#3A8DFF]" />
              Informações do Cliente
            </h2>

            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Nome completo *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className={`w-full h-12 pl-11 pr-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${
                      errors.nome 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-white/[0.08] focus:border-[#3A8DFF]/50"
                    }`}
                  />
                </div>
                {errors.nome && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.nome}</p>
                )}
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  CPF
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Gênero
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <select
                    value={formData.genero}
                    onChange={(e) => handleChange("genero", e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer"
                  >
                    {generoOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#0a0f1a] text-white">{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cônjuge */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Cônjuge
                </label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={formData.conjuge}
                    onChange={(e) => handleChange("conjuge", e.target.value)}
                    placeholder="Nome do cônjuge (opcional)"
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#0a0f1a] text-white">{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                    className={`w-full h-12 pl-11 pr-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${
                      errors.email 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-white/[0.08] focus:border-[#3A8DFF]/50"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Empresa
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => handleChange("empresa", e.target.value)}
                    placeholder="Nome da empresa (opcional)"
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/[0.08]">
              <Link
                href={`/dashboard/clientes/${clienteId}`}
                className="h-11 px-5 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center gap-2 text-sm text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
