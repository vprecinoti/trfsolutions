// ============================================
// Tipos do sistema de pontuacao por pilar
// ============================================

// Faixa qualitativa derivada de uma porcentagem 0-100
export type Faixa = "ruim" | "medio" | "bom" | "excelente";

// Pilares avaliados
export type PilarId =
  | "patrimonial"
  | "protecao"
  | "aposentadoria"
  | "otimizacao"
  | "fluxo";

// Resultado do calculo de um pilar
export interface ResultadoPilar {
  id: PilarId;
  titulo: string;
  pontosObtidos: number;
  pontosMaximos: number;
  nota: number; // 0-100, ja arredondada
  faixa: Faixa;
}

// Resultado consolidado de todos os pilares
export interface ResultadoGeral {
  pilares: ResultadoPilar[];
  media: number; // 0-100, ja arredondada
  faixa: Faixa;
}

// ============================================
// Inputs por pilar
// ============================================

// Pilar Patrimonial (Aba 3)
export type RentabilidadeOpcao = "ate_6" | "entre_6_13" | "mais_13" | "nao_se_aplica";
export type EstrategiaVeiculoOpcao =
  | "sem_interesse"
  | "estrategia_inteligente"
  | "planejamento_inicial"
  | "financiamento_tradicional";
export type EstrategiaImovelOpcao =
  | "sem_interesse"
  | "estrategia_avancada"
  | "financiamento_imobiliario"
  | "sem_estrategia";

export interface InputPilarPatrimonial {
  totalAtivos: number;
  totalPassivos: number;
  rentabilidade?: RentabilidadeOpcao | "";
  estrategiaVeiculo?: EstrategiaVeiculoOpcao | "";
  estrategiaImovel?: EstrategiaImovelOpcao | "";
}

// Pilar Protecao (Aba 4)
export type ReservaEmergenciaOpcao = "nao" | "ate_6_meses" | "mais_6_meses";
export type PlanoSaudeOpcao = "nao" | "sim";
export type ProtecaoRendaOpcao = "nao" | "reserva" | "seguro_renda";
export type ProtecaoDependentesOpcao =
  | "nao"
  | "parcialmente"
  | "sim"
  | "nao_se_aplica";
export type SeguroAutoOpcao =
  | "nao"
  | "alguns"
  | "todos"
  | "nao_se_aplica";
export type SeguroResidencialOpcao = "nao" | "sim";
export type ResponsabilidadeCivilOpcao =
  | "nao"
  | "sim"
  | "nao_se_aplica";
export type SucessaoOpcao = "nao_conheco" | "apenas_conheco" | "tenho_estrategia";

export interface InputPilarProtecao {
  reservaEmergencia?: ReservaEmergenciaOpcao | "";
  planoSaude?: PlanoSaudeOpcao | "";
  protecaoRenda?: ProtecaoRendaOpcao | "";
  protecaoDependentes?: ProtecaoDependentesOpcao | "";
  seguroAuto?: SeguroAutoOpcao | "";
  seguroResidencial?: SeguroResidencialOpcao | "";
  responsabilidadeCivil?: ResponsabilidadeCivilOpcao | "";
  sucessao?: SucessaoOpcao | "";
}

// Pilar Aposentadoria (Aba 5)
export type ClarezaAlvoOpcao = "nao_faco_ideia" | "estimativa" | "valor_exato";
export type AporteMensalOpcao = "nao_sei" | "sei_mas_nao_consigo" | "sei_e_aporto";
export type EstrategiaAposentadoriaOpcao =
  | "sem_estrategia"
  | "simples"
  | "diversificada";
export type EvolucaoAtualOpcao = "ate_5" | "entre_6_25" | "entre_26_50" | "mais_50";

export interface InputPilarAposentadoria {
  // Informativos (nao pontuam)
  idadeAlvo?: number | string;
  rendaPassivaDesejada?: number | string;
  // Pontuados
  clarezaAlvo?: ClarezaAlvoOpcao | "";
  aporteMensal?: AporteMensalOpcao | "";
  estrategia?: EstrategiaAposentadoriaOpcao | "";
  evolucaoAtual?: EvolucaoAtualOpcao | "";
}

// Pilar Otimizacao Financeira (nova Aba 6)
export type ImpostoRendaOpcao =
  | "otimizado"
  | "basico"
  | "prejuizo_malha"
  | "isento"; // isento = anula
export type CartaoCreditoOpcao = "consciente" | "anuidade_sem_saber" | "perigo";
export type MilhasOpcao = "mestre" | "acumulo_por_tabela" | "nao_conheco";
export type ControleGastosOpcao =
  | "app_planilha_pro"
  | "planilha_basica"
  | "caderno"
  | "vou_na_raca";

export interface InputPilarOtimizacao {
  impostoRenda?: ImpostoRendaOpcao | "";
  cartaoCredito?: CartaoCreditoOpcao | "";
  milhas?: MilhasOpcao | "";
  controleGastos?: ControleGastosOpcao | "";
  // Informativo (nao pontua)
  percepcaoSobraMensal?: number | string;
}

// Pilar Fluxo de Caixa (Aba 7)
// Recebe os totais ja consolidados da etapa de orcamento.
export interface InputPilarFluxo {
  rendaLiquida: number;
  totalGastosFixos: number;
  totalGastosVariaveis: number;
  totalProtecao: number; // gastos com seguros/plano de saude
  totalInvestimentos: number; // aporte mensal informado
  percepcaoSobra: number; // quanto o cliente acha que sobra
}
