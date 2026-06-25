// ============================================
// Calculo de cada pilar - funcoes puras
// ============================================
import {
  Faixa,
  InputPilarAposentadoria,
  InputPilarFluxo,
  InputPilarOtimizacao,
  InputPilarPatrimonial,
  InputPilarProtecao,
  PilarId,
  ResultadoGeral,
  ResultadoPilar,
} from "./types";
import { classificarFaixa } from "./faixas";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function montarResultado(
  id: PilarId,
  titulo: string,
  pontosObtidos: number,
  pontosMaximos: number
): ResultadoPilar {
  const segura = pontosMaximos > 0 ? pontosMaximos : 0;
  const nota = segura > 0 ? Math.round((pontosObtidos / segura) * 100) : 0;
  const faixa: Faixa = classificarFaixa(nota);
  return {
    id,
    titulo,
    pontosObtidos: Math.round(pontosObtidos * 10) / 10,
    pontosMaximos: segura,
    nota,
    faixa,
  };
}

// ----------------------------------------------------------------
// Pilar Patrimonial (Aba 3)
// 4 itens, max 30 ou 40 pontos
// ----------------------------------------------------------------

// Item 1 - Balanco PL (calculado a partir de ativos x passivos).
// Regras (acordadas com o cliente):
// - PL negativo (passivos > ativos)            => 0
// - "Zero a Zero" (ativos = 0 e passivos = 0)  => 5
// - Divida Alta  (passivos / ativos > 50%)     => 4
// - Divida Baixa (1-50%)                       => 8
// - Divida Zero  (passivos = 0 e ativos > 0)   => 10
export function pontosBalanco(totalAtivos: number, totalPassivos: number): number {
  const ativos = Math.max(0, totalAtivos || 0);
  const passivos = Math.max(0, totalPassivos || 0);

  if (ativos === 0 && passivos === 0) return 5; // Zero a Zero
  if (passivos > ativos) return 0; // PL negativo
  if (passivos === 0) return 10; // Divida Zero
  const razao = passivos / ativos;
  if (razao > 0.5) return 4; // Divida Alta
  return 8; // Divida Baixa
}

export function pontosRentabilidade(opcao?: string): number | null {
  if (!opcao || opcao === "nao_se_aplica") return null; // anula
  if (opcao === "mais_13") return 10;
  if (opcao === "entre_6_13") return 6;
  if (opcao === "ate_6") return 2;
  return 0;
}

export function pontosEstrategiaVeiculo(opcao?: string): number {
  if (opcao === "sem_interesse" || opcao === "estrategia_inteligente") return 10;
  if (opcao === "planejamento_inicial") return 5;
  if (opcao === "financiamento_tradicional") return 2;
  return 0;
}

export function pontosEstrategiaImovel(opcao?: string): number {
  if (opcao === "sem_interesse" || opcao === "estrategia_avancada") return 10;
  if (opcao === "financiamento_imobiliario") return 5;
  return 0; // sem_estrategia ou nao respondida
}

export function calcularPilarPatrimonial(input: InputPilarPatrimonial): ResultadoPilar {
  const balanco = pontosBalanco(input.totalAtivos, input.totalPassivos);
  const rent = pontosRentabilidade(input.rentabilidade as string);
  const veic = pontosEstrategiaVeiculo(input.estrategiaVeiculo as string);
  const imov = pontosEstrategiaImovel(input.estrategiaImovel as string);

  let obtidos = balanco + veic + imov;
  let maximo = 30; // 3 itens fixos x 10
  if (rent !== null) {
    obtidos += rent;
    maximo += 10;
  }

  return montarResultado("patrimonial", "Analise Patrimonial", obtidos, maximo);
}

// ----------------------------------------------------------------
// Pilar Protecao (Aba 4)
// 8 perguntas, max variavel ate 80 pontos
// ----------------------------------------------------------------

const mapaReserva: Record<string, number> = {
  nao: 0,
  ate_6_meses: 6,
  mais_6_meses: 10,
};
const mapaPlanoSaude: Record<string, number> = { nao: 0, sim: 10 };
const mapaProtRenda: Record<string, number> = {
  nao: 0,
  reserva: 6,
  seguro_renda: 10,
};
const mapaProtDependentes: Record<string, number> = {
  nao: 0,
  parcialmente: 5,
  sim: 10,
};
const mapaSeguroAuto: Record<string, number> = {
  nao: 0,
  alguns: 5,
  todos: 10,
};
const mapaSeguroResid: Record<string, number> = { nao: 0, sim: 10 };
const mapaRespCivil: Record<string, number> = { nao: 0, sim: 10 };
const mapaSucessao: Record<string, number> = {
  nao_conheco: 0,
  apenas_conheco: 4,
  tenho_estrategia: 10,
};

// Cada pergunta soma se respondida; se for "nao_se_aplica" e a regra do .md
// deixa anular, ela some do maximo. Caso ainda nao respondida (string vazia),
// ainda pontua zero e conta no maximo (forma de pressionar a resposta).
function aplicarPergunta(
  acumulado: { obtidos: number; maximo: number },
  resposta: string | undefined,
  mapa: Record<string, number>,
  podeAnular: boolean
) {
  if (!resposta) {
    acumulado.maximo += 10;
    return; // sem resposta -> 0 pontos mas continua contando no maximo
  }
  if (podeAnular && resposta === "nao_se_aplica") {
    return; // anula totalmente
  }
  acumulado.obtidos += mapa[resposta] ?? 0;
  acumulado.maximo += 10;
}

export function calcularPilarProtecao(input: InputPilarProtecao): ResultadoPilar {
  const acc = { obtidos: 0, maximo: 0 };
  aplicarPergunta(acc, input.reservaEmergencia as string, mapaReserva, false);
  aplicarPergunta(acc, input.planoSaude as string, mapaPlanoSaude, false);
  aplicarPergunta(acc, input.protecaoRenda as string, mapaProtRenda, false);
  aplicarPergunta(acc, input.protecaoDependentes as string, mapaProtDependentes, true);
  aplicarPergunta(acc, input.seguroAuto as string, mapaSeguroAuto, true);
  aplicarPergunta(acc, input.seguroResidencial as string, mapaSeguroResid, false);
  aplicarPergunta(acc, input.responsabilidadeCivil as string, mapaRespCivil, true);
  aplicarPergunta(acc, input.sucessao as string, mapaSucessao, false);

  return montarResultado("protecao", "Protecao Financeira", acc.obtidos, acc.maximo);
}

// ----------------------------------------------------------------
// Pilar Aposentadoria (Aba 5)
// 4 perguntas pontuadas (3,4,5,6 do questionario), max 40 pontos
// ----------------------------------------------------------------

const mapaClareza: Record<string, number> = {
  nao_faco_ideia: 0,
  estimativa: 5,
  valor_exato: 10,
};
const mapaAporte: Record<string, number> = {
  nao_sei: 0,
  sei_mas_nao_consigo: 5,
  sei_e_aporto: 10,
};
const mapaEstrategia: Record<string, number> = {
  sem_estrategia: 0,
  simples: 5,
  diversificada: 10,
};
const mapaEvolucao: Record<string, number> = {
  ate_5: 1,
  entre_6_25: 4,
  entre_26_50: 7,
  mais_50: 10,
};

export function calcularPilarAposentadoria(input: InputPilarAposentadoria): ResultadoPilar {
  let obtidos = 0;
  obtidos += mapaClareza[(input.clarezaAlvo as string) ?? ""] ?? 0;
  obtidos += mapaAporte[(input.aporteMensal as string) ?? ""] ?? 0;
  obtidos += mapaEstrategia[(input.estrategia as string) ?? ""] ?? 0;
  obtidos += mapaEvolucao[(input.evolucaoAtual as string) ?? ""] ?? 0;
  return montarResultado("aposentadoria", "Aposentadoria", obtidos, 40);
}

// ----------------------------------------------------------------
// Pilar Otimizacao Financeira (nova Aba 6)
// 4 perguntas pontuadas, max 40 (ou 30 se IR for "isento")
// ----------------------------------------------------------------

const mapaIR: Record<string, number> = {
  otimizado: 10,
  basico: 4,
  prejuizo_malha: 0,
};
const mapaCartao: Record<string, number> = {
  consciente: 10,
  anuidade_sem_saber: 4,
  perigo: 0,
};
const mapaMilhas: Record<string, number> = {
  mestre: 10,
  acumulo_por_tabela: 5,
  nao_conheco: 0,
};
const mapaControle: Record<string, number> = {
  app_planilha_pro: 10,
  planilha_basica: 5,
  caderno: 2,
  vou_na_raca: 0,
};

export function calcularPilarOtimizacao(input: InputPilarOtimizacao): ResultadoPilar {
  let obtidos = 0;
  let maximo = 0;

  if (input.impostoRenda === "isento") {
    // anula a pergunta
  } else {
    obtidos += mapaIR[(input.impostoRenda as string) ?? ""] ?? 0;
    maximo += 10;
  }

  obtidos += mapaCartao[(input.cartaoCredito as string) ?? ""] ?? 0;
  maximo += 10;
  obtidos += mapaMilhas[(input.milhas as string) ?? ""] ?? 0;
  maximo += 10;
  obtidos += mapaControle[(input.controleGastos as string) ?? ""] ?? 0;
  maximo += 10;

  return montarResultado("otimizacao", "Otimizacao Financeira", obtidos, maximo);
}

// ----------------------------------------------------------------
// Pilar Fluxo de Caixa (Aba 7)
// Combina dois sinais:
// 1. Aderencia aos percentuais ideais 50/25/10/15 (peso 70%)
// 2. Tamanho do "Rombo Invisivel" (percepcao vs realidade) (peso 30%)
// Saldo negativo => penalidade adicional.
// ----------------------------------------------------------------

interface DiagnosticoCategoria {
  percReal: number;
  percIdeal: number;
  desvio: number; // |real - ideal|
}

export function diagnosticosFluxo(input: InputPilarFluxo): {
  fixo: DiagnosticoCategoria;
  variavel: DiagnosticoCategoria;
  protecao: DiagnosticoCategoria;
  investimento: DiagnosticoCategoria;
  saldo: number;
  rombo: number;
  rendaLiquida: number;
} {
  const renda = Math.max(0, input.rendaLiquida || 0);

  const calcPerc = (valor: number) => (renda > 0 ? (valor / renda) * 100 : 0);
  const fixoR = calcPerc(input.totalGastosFixos);
  const variavelR = calcPerc(input.totalGastosVariaveis);
  const protecaoR = calcPerc(input.totalProtecao);
  const investimentoR = calcPerc(input.totalInvestimentos);

  const totalGastos =
    (input.totalGastosFixos || 0) +
    (input.totalGastosVariaveis || 0) +
    (input.totalProtecao || 0) +
    (input.totalInvestimentos || 0);
  const saldo = renda - totalGastos;
  const rombo = Math.abs((input.percepcaoSobra || 0) - saldo);

  return {
    fixo: { percReal: fixoR, percIdeal: 50, desvio: Math.abs(fixoR - 50) },
    variavel: { percReal: variavelR, percIdeal: 25, desvio: Math.abs(variavelR - 25) },
    protecao: { percReal: protecaoR, percIdeal: 10, desvio: Math.abs(protecaoR - 10) },
    investimento: {
      percReal: investimentoR,
      percIdeal: 15,
      desvio: Math.abs(investimentoR - 15),
    },
    saldo,
    rombo,
    rendaLiquida: renda,
  };
}

export function calcularPilarFluxo(input: InputPilarFluxo): ResultadoPilar {
  const diag = diagnosticosFluxo(input);

  // Sinal 1 - Aderencia (0 a 100). Para cada categoria,
  // se desvio = 0 -> 100; cada ponto percentual de desvio reduz 4 pontos
  // (ex.: desvio de 10pp -> 60). Saturacao em 0.
  const aderenciaCat = (desvio: number) => Math.max(0, 100 - desvio * 4);
  const aderencia =
    (aderenciaCat(diag.fixo.desvio) +
      aderenciaCat(diag.variavel.desvio) +
      aderenciaCat(diag.protecao.desvio) +
      aderenciaCat(diag.investimento.desvio)) /
    4;

  // Sinal 2 - Rombo. Se renda for 0, considera 0.
  // Rombo de 0 = 100. Cada 1% da renda em rombo reduz 5 pontos (ex.: 20% -> 0).
  const rombo = diag.rendaLiquida > 0 ? Math.max(0, 100 - (diag.rombo / diag.rendaLiquida) * 100 * 5) : 0;

  // Penalidade de saldo negativo: zera ate metade da nota se saldo < 0.
  let nota = aderencia * 0.7 + rombo * 0.3;
  if (diag.saldo < 0 && diag.rendaLiquida > 0) {
    const profundidade = Math.min(1, Math.abs(diag.saldo) / diag.rendaLiquida);
    nota = nota * (1 - 0.5 * profundidade);
  }

  // Convertemos para "obtidos / maximo" para manter padrao das demais.
  const pontosMaximos = 100;
  const pontosObtidos = Math.max(0, Math.min(100, nota));
  return montarResultado("fluxo", "Fluxo de Caixa", pontosObtidos, pontosMaximos);
}

// ----------------------------------------------------------------
// Consolidador
// ----------------------------------------------------------------

export interface InputResultadoGeral {
  patrimonial: InputPilarPatrimonial;
  protecao: InputPilarProtecao;
  aposentadoria: InputPilarAposentadoria;
  otimizacao: InputPilarOtimizacao;
  fluxo: InputPilarFluxo;
}

export function calcularResultadoGeral(input: InputResultadoGeral): ResultadoGeral {
  const pilares: ResultadoPilar[] = [
    calcularPilarPatrimonial(input.patrimonial),
    calcularPilarProtecao(input.protecao),
    calcularPilarAposentadoria(input.aposentadoria),
    calcularPilarOtimizacao(input.otimizacao),
    calcularPilarFluxo(input.fluxo),
  ];

  const media = Math.round(pilares.reduce((s, p) => s + p.nota, 0) / pilares.length);
  return {
    pilares,
    media,
    faixa: classificarFaixa(media),
  };
}
