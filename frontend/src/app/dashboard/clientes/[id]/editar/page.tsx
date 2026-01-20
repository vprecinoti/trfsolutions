"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { ArrowLeft, User, Mail, Phone, Building, Loader2, Save, CreditCard, Users, Heart, MapPin, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { getLead, updateLead } from "@/lib/api/leads";

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const estadosCivis = [
  "Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)", "Separado(a)"
];

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
    rg: "",
    genero: "",
    estadoCivil: "",
    profissao: "",
    conjuge: "",
    endereco: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
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
        rg: data.rg || "",
        genero: data.genero || "",
        estadoCivil: data.estadoCivil || "",
        profissao: data.profissao || "",
        conjuge: data.conjuge || "",
        endereco: data.endereco || "",
        bairro: data.bairro || "",
        cep: data.cep || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
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
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
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
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
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
      <Header title="Editar Cliente" subtitle="Atualize as informações do cliente" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Link href={`/dashboard/clientes/${clienteId}`}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para detalhes
        </Link>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Dados Pessoais */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#3A8DFF]" />
                Dados Pessoais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Nome completo *</label>
                  <input type="text" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className={`w-full h-12 px-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${errors.nome ? "border-red-500/50" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`} />
                  {errors.nome && <p className="mt-1.5 text-sm text-red-400">{errors.nome}</p>}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">CPF</label>
                  <input type="text" value={formData.cpf} 
                    onChange={(e) => handleChange("cpf", formatCPF(e.target.value))}
                    placeholder="000.000.000-00" maxLength={14}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* RG */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">RG</label>
                  <input type="text" value={formData.rg} onChange={(e) => handleChange("rg", e.target.value)}
                    placeholder="00.000.000-0"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Gênero */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Gênero</label>
                  <select value={formData.genero} onChange={(e) => handleChange("genero", e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer">
                    {generoOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[#0a0f1a] text-white">{opt.label}</option>)}
                  </select>
                </div>

                {/* Estado Civil */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Estado Civil</label>
                  <select value={formData.estadoCivil} onChange={(e) => handleChange("estadoCivil", e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-[#0a0f1a] text-white">Selecione...</option>
                    {estadosCivis.map(ec => <option key={ec} value={ec} className="bg-[#0a0f1a] text-white">{ec}</option>)}
                  </select>
                </div>

                {/* Profissão */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Profissão</label>
                  <input type="text" value={formData.profissao} onChange={(e) => handleChange("profissao", e.target.value)}
                    placeholder="Profissão do cliente"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Cônjuge */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Cônjuge</label>
                  <input type="text" value={formData.conjuge} onChange={(e) => handleChange("conjuge", e.target.value)}
                    placeholder="Nome do cônjuge (opcional)"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#3A8DFF]" />
                Endereço
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Endereço</label>
                  <input type="text" value={formData.endereco} onChange={(e) => handleChange("endereco", e.target.value)}
                    placeholder="Rua, número, complemento"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Bairro</label>
                  <input type="text" value={formData.bairro} onChange={(e) => handleChange("bairro", e.target.value)}
                    placeholder="Bairro"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">CEP</label>
                  <input type="text" value={formData.cep} 
                    onChange={(e) => handleChange("cep", formatCEP(e.target.value))}
                    placeholder="00000-000" maxLength={9}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Cidade</label>
                  <input type="text" value={formData.cidade} onChange={(e) => handleChange("cidade", e.target.value)}
                    placeholder="Cidade"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Estado</label>
                  <select value={formData.estado} onChange={(e) => handleChange("estado", e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-[#0a0f1a] text-white">Selecione...</option>
                    {estadosBrasil.map(uf => <option key={uf} value={uf} className="bg-[#0a0f1a] text-white">{uf}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#3A8DFF]" />
                Contato
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                    className={`w-full h-12 px-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${errors.email ? "border-red-500/50" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`} />
                  {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Celular</label>
                  <input type="tel" value={formData.telefone} 
                    onChange={(e) => handleChange("telefone", formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000" maxLength={15}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Empresa</label>
                  <input type="text" value={formData.empresa} onChange={(e) => handleChange("empresa", e.target.value)}
                    placeholder="Nome da empresa (opcional)"
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all" />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer">
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[#0a0f1a] text-white">{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3">
              <Link href={`/dashboard/clientes/${clienteId}`}
                className="h-11 px-5 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center gap-2 text-sm text-white/70 hover:bg-white/[0.1] hover:text-white transition-all">
                Cancelar
              </Link>
              <button type="submit" disabled={saving}
                className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
