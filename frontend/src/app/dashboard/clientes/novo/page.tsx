"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { ArrowLeft, User, Mail, Phone, Building, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createLead } from "@/lib/api/leads";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setLoading(true);
      const newLead = await createLead(formData);
      router.push(`/dashboard/clientes/${newLead.id}`);
    } catch (err: any) {
      console.error("Erro ao criar cliente:", err);
      alert(err.response?.data?.message || "Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <Header 
        title="Novo Cliente"
        subtitle="Adicione um novo cliente à sua base"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Voltar */}
        <Link
          href="/dashboard/clientes"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para clientes
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
                  Telefone
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
                href="/dashboard/clientes"
                className="h-11 px-5 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center gap-2 text-sm text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
