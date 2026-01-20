"use client";

import { useState, useEffect } from "react";
import { X, FileText, Loader2, Download, Send, User, MapPin, Phone, CreditCard } from "lucide-react";

// Interface para os dados do contrato
export interface DadosContrato {
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  telefoneFixo: string;
  celular: string;
  email: string;
  rg: string;
  cpf: string;
  estadoCivil: string;
  profissao: string;
  valorAP: string;
  valorAPExtenso: string;
  formaPagamento: "pix" | "cartao";
  numeroParcelas?: string;
  vencimentoAP?: string;
  numeroConta?: string;
  numeroAgencia?: string;
  nomeBanco?: string;
}

interface ContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnviar: (dados: DadosContrato) => Promise<void>;
  dadosIniciais?: {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    profissao?: string;
    estadoCivil?: string;
    valorConsultoria?: number;
  };
}

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const estadosCivis = [
  "Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)", "Separado(a)"
];

// Função para converter número em extenso
function numeroParaExtenso(valor: number): string {
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  if (valor === 0) return "zero reais";
  if (valor === 100) return "cem reais";

  const partes: string[] = [];
  const milhares = Math.floor(valor / 1000);
  
  if (milhares > 0) {
    if (milhares === 1) {
      partes.push("mil");
    } else if (milhares < 10) {
      partes.push(unidades[milhares] + " mil");
    } else if (milhares < 20) {
      partes.push(especiais[milhares - 10] + " mil");
    } else {
      const dezMil = Math.floor(milhares / 10);
      const uniMil = milhares % 10;
      if (uniMil === 0) {
        partes.push(dezenas[dezMil] + " mil");
      } else {
        partes.push(dezenas[dezMil] + " e " + unidades[uniMil] + " mil");
      }
    }
  }

  const resto = valor % 1000;
  const cent = Math.floor(resto / 100);
  const dez = Math.floor((resto % 100) / 10);
  const uni = resto % 10;

  if (cent > 0) {
    if (resto === 100) {
      partes.push("cem");
    } else {
      partes.push(centenas[cent]);
    }
  }

  if (dez === 1) {
    partes.push(especiais[uni]);
  } else {
    if (dez > 1) partes.push(dezenas[dez]);
    if (uni > 0) partes.push(unidades[uni]);
  }

  return partes.join(" e ") + " reais";
}

export function ContratoModal({ isOpen, onClose, onEnviar, dadosIniciais }: ContratoModalProps) {
  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "preview">("form");
  
  const [dados, setDados] = useState<DadosContrato>({
    nomeCompleto: "",
    endereco: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    telefoneFixo: "",
    celular: "",
    email: "",
    rg: "",
    cpf: "",
    estadoCivil: "",
    profissao: "",
    valorAP: "",
    valorAPExtenso: "",
    formaPagamento: "pix",
    numeroParcelas: "",
    vencimentoAP: "",
    numeroConta: "12345-6",
    numeroAgencia: "0001",
    nomeBanco: "Itaú Unibanco",
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const formatCurrencyInput = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = Number(numbers) / 100;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
  };

  const parseCurrencyToNumber = (value: string): number => {
    const numbers = value.replace(/\D/g, "");
    return numbers ? parseInt(numbers, 10) / 100 : 0;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  useEffect(() => {
    if (isOpen && dadosIniciais) {
      setDados(prev => ({
        ...prev,
        nomeCompleto: dadosIniciais.nome || "",
        email: dadosIniciais.email || "",
        celular: dadosIniciais.telefone || "",
        cpf: dadosIniciais.cpf || "",
        profissao: dadosIniciais.profissao || "",
        estadoCivil: dadosIniciais.estadoCivil || "",
        valorAP: dadosIniciais.valorConsultoria ? formatCurrency(dadosIniciais.valorConsultoria) : "",
        valorAPExtenso: dadosIniciais.valorConsultoria ? numeroParaExtenso(Math.round(dadosIniciais.valorConsultoria)) : "",
      }));
      setStep("form");
      setPdfUrl(null);
    }
  }, [isOpen, dadosIniciais]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleChange = (field: keyof DadosContrato, value: string) => {
    let formattedValue = value;
    
    if (field === "cep") formattedValue = formatCEP(value);
    if (field === "cpf") formattedValue = formatCPF(value);
    if (field === "celular" || field === "telefoneFixo") formattedValue = formatPhone(value);
    if (field === "valorAP") {
      formattedValue = formatCurrencyInput(value);
      const valorNumerico = parseCurrencyToNumber(value);
      setDados(prev => ({
        ...prev,
        valorAP: formattedValue,
        valorAPExtenso: valorNumerico > 0 ? numeroParaExtenso(Math.round(valorNumerico)) : "",
      }));
      return;
    }
    
    setDados(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validarDados = (): boolean => {
    const camposObrigatorios: (keyof DadosContrato)[] = [
      "nomeCompleto", "endereco", "bairro", "cep", "cidade", "estado",
      "celular", "email", "rg", "cpf", "estadoCivil", "profissao", "valorAP"
    ];
    
    for (const campo of camposObrigatorios) {
      if (!dados[campo]) {
        alert(`Por favor, preencha o campo: ${campo}`);
        return false;
      }
    }
    return true;
  };

  const gerarPDF = async () => {
    if (!validarDados()) return;
    
    try {
      setGerando(true);
      
      // Import dinâmico para evitar problemas de SSR
      const { pdf } = await import("@react-pdf/renderer");
      const { ContratoPDF } = await import("@/lib/contract/ContratoPDF");
      
      const blob = await pdf(<ContratoPDF dados={dados} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      
      setPdfUrl(url);
      setStep("preview");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setGerando(false);
    }
  };

  const baixarPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `contrato_${dados.nomeCompleto.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnviar = async () => {
    try {
      setLoading(true);
      await onEnviar(dados);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3A8DFF]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#3A8DFF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {step === "form" ? "Dados do Contrato" : "Visualizar Contrato"}
              </h3>
              <p className="text-sm text-slate-400">
                {step === "form" ? "Preencha os dados para gerar o contrato" : "Revise o contrato antes de enviar"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "form" ? (
            <div className="space-y-6">
              {/* Dados Pessoais */}
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-[#3A8DFF]" />
                  <h4 className="font-semibold text-white">Dados Pessoais</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Nome Completo *</label>
                    <input type="text" value={dados.nomeCompleto} onChange={(e) => handleChange("nomeCompleto", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="Nome completo do cliente" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">CPF *</label>
                    <input type="text" value={dados.cpf} onChange={(e) => handleChange("cpf", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="000.000.000-00" maxLength={14} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">RG *</label>
                    <input type="text" value={dados.rg} onChange={(e) => handleChange("rg", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Estado Civil *</label>
                    <select value={dados.estadoCivil} onChange={(e) => handleChange("estadoCivil", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white">
                      <option value="">Selecione</option>
                      {estadosCivis.map(ec => <option key={ec} value={ec}>{ec}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Profissão *</label>
                    <input type="text" value={dados.profissao} onChange={(e) => handleChange("profissao", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="Profissão do cliente" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#3A8DFF]" />
                  <h4 className="font-semibold text-white">Endereço</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Endereço *</label>
                    <input type="text" value={dados.endereco} onChange={(e) => handleChange("endereco", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="Rua, número, complemento" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Bairro *</label>
                    <input type="text" value={dados.bairro} onChange={(e) => handleChange("bairro", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="Bairro" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">CEP *</label>
                    <input type="text" value={dados.cep} onChange={(e) => handleChange("cep", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="00000-000" maxLength={9} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cidade *</label>
                    <input type="text" value={dados.cidade} onChange={(e) => handleChange("cidade", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="Cidade" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Estado *</label>
                    <select value={dados.estado} onChange={(e) => handleChange("estado", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white">
                      <option value="">Selecione</option>
                      {estadosBrasil.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-[#3A8DFF]" />
                  <h4 className="font-semibold text-white">Contato</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Celular *</label>
                    <input type="text" value={dados.celular} onChange={(e) => handleChange("celular", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="(00) 00000-0000" maxLength={15} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Telefone Fixo</label>
                    <input type="text" value={dados.telefoneFixo} onChange={(e) => handleChange("telefoneFixo", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="(00) 0000-0000" maxLength={14} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">E-mail *</label>
                    <input type="email" value={dados.email} onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="email@exemplo.com" />
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-[#3A8DFF]" />
                  <h4 className="font-semibold text-white">Pagamento</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Valor da Consultoria *</label>
                    <input type="text" value={dados.valorAP} onChange={(e) => handleChange("valorAP", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="R$ 0,00" />
                    {dados.valorAPExtenso && <p className="text-xs text-slate-500 mt-1 italic">({dados.valorAPExtenso})</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Forma de Pagamento *</label>
                    <select value={dados.formaPagamento} onChange={(e) => handleChange("formaPagamento", e.target.value as "pix" | "cartao")}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white">
                      <option value="pix">PIX / Transferência</option>
                      <option value="cartao">Cartão de Crédito</option>
                    </select>
                  </div>
                  {dados.formaPagamento === "pix" && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Data de Vencimento</label>
                      <input type="text" value={dados.vencimentoAP} onChange={(e) => handleChange("vencimentoAP", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white" placeholder="DD/MM/AAAA" />
                    </div>
                  )}
                  {dados.formaPagamento === "cartao" && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Número de Parcelas</label>
                      <select value={dados.numeroParcelas} onChange={(e) => handleChange("numeroParcelas", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white">
                        <option value="">Selecione</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>{n}x</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {pdfUrl && (
                <iframe src={pdfUrl} className="w-full h-[60vh] rounded-lg border border-slate-700" title="Preview do Contrato" />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex justify-between items-center shrink-0">
          {step === "form" ? (
            <>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white">
                Cancelar
              </button>
              <button onClick={gerarPDF} disabled={gerando}
                className="px-6 py-2.5 rounded-xl bg-[#3A8DFF] hover:bg-[#3A8DFF]/80 transition-colors text-white font-medium flex items-center gap-2">
                {gerando ? (<><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>) : (<><FileText className="w-4 h-4" />Gerar Contrato</>)}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep("form")} className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white">
                Voltar e Editar
              </button>
              <div className="flex gap-3">
                <button onClick={baixarPDF} className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-white flex items-center gap-2">
                  <Download className="w-4 h-4" />Baixar PDF
                </button>
                <button onClick={handleEnviar} disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium flex items-center gap-2">
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>) : (<><Send className="w-4 h-4" />Confirmar e Enviar</>)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
