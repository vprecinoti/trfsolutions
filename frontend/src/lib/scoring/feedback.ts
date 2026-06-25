// ============================================
// Textos de feedback de cada pilar e do diagnostico geral
// Conteudo extraido do .md "ajustes analise thiago - preci"
// ============================================
import type { Faixa, PilarId } from "./types";

interface BlocoFeedback {
  titulo: string;
  feedback: string;
  proximoPasso?: string;
}

type FeedbackPorFaixa = Record<Faixa, BlocoFeedback>;

// ----------------------------------------------------------------
// Pilar Patrimonial
// ----------------------------------------------------------------
const feedbackPatrimonial: FeedbackPorFaixa = {
  ruim: {
    titulo: "Alerta Patrimonial",
    feedback:
      "Sua situacao patrimonial exige cuidados urgentes. Suas dividas atuais estao sufocando seus bens (Patrimonio Liquido zerado ou negativo) ou o seu dinheiro esta parado rendendo quase nada, perdendo valor para a inflacao. Alem disso, planejar comprar carro ou casa atraves de financiamentos tradicionais sem uma estrategia clara vai fazer voce pagar o preco de dois ou tres bens para o banco. Voce esta trabalhando para enriquecer o sistema financeiro.",
    proximoPasso:
      "Precisamos estancar os juros das dividas atuais, mudar urgentemente onde seu dinheiro esta guardado e redesenhar suas metas de compra para fugir dos juros bancarios altos.",
  },
  medio: {
    titulo: "Patrimonio Engessado",
    feedback:
      "Seu patrimonio e positivo, mas ele esta vulneravel. Ou mais da metade dos seus bens pertence ao banco por causa de financiamentos longos, ou seus investimentos estao rendendo apenas o basico do mercado. Voce deseja trocar de carro ou comprar um imovel, mas sua estrategia atual (como o financiamento comum de longo prazo ou a falta de um plano focado) vai travar a sua capacidade de poupar dinheiro pelos proximos anos, atrasando a sua liberdade financeira.",
    proximoPasso:
      "O foco aqui e acelerar a quitacao dos passivos caros, otimizar a rentabilidade dos seus investimentos atuais e estruturar ferramentas inteligentes (como consorcios ou investimentos carimbados) para suas proximas aquisicoes.",
  },
  bom: {
    titulo: "Construcao Saudavel",
    feedback:
      "Parabens! Suas dividas estao controladas (representam menos da metade dos seus bens) e seu dinheiro esta rendendo em uma faixa muito saudavel de mercado. Suas estrategias para aquisicao de veiculos e imoveis sao conscientes, focando em compras planejadas ou a vista, o que evita o desperdicio de dinheiro com juros abusivos. Voce esta no caminho certo para acumular riqueza real.",
    proximoPasso:
      "O seu proximo passo e refinar a sua carteira para buscar ganhos acima da media (acima de 13%) sem correr riscos bobos, e calibrar o fluxo de caixa para acelerar o prazo dos seus objetivos de compra de bens.",
  },
  excelente: {
    titulo: "Solidez e Liberdade Total",
    feedback:
      "Excelente trabalho! Voce atingiu o nivel maximo de saude patrimonial. Seus ativos estao completamente livres de dividas e o seu dinheiro trabalha na velocidade maxima, com rendimento de alta performance. Alem disso, suas estrategias de aquisicao para o futuro sao impecaveis, garantindo que voce compre seus bens com o maximo de desconto e inteligencia financeira. Seu patrimonio esta blindado e gerando riqueza real no piloto automatico.",
    proximoPasso:
      "Manter a consistencia e utilizar essa imensa forca patrimonial para gerar renda passiva, focando nos pilares de protecao e aposentadoria das proximas abas.",
  },
};

// ----------------------------------------------------------------
// Pilar Protecao
// ----------------------------------------------------------------
const feedbackProtecao: FeedbackPorFaixa = {
  ruim: {
    titulo: "Exposicao Total",
    feedback:
      "Voce esta exposto a grandes riscos. Qualquer imprevisto de saude, batida de carro ou afastamento do trabalho pode destruir tudo o que voce construiu. E urgente criar uma reserva e contratar as protecoes basicas (Plano de Saude e Seguro de Renda).",
  },
  medio: {
    titulo: "Blindagem com Buracos",
    feedback:
      "Voce ja deu os primeiros passos e tem alguma protecao (como uma reserva curta ou plano de saude). Porem, ainda existem buracos graves na sua blindagem que podem ameacar o seu futuro ou o sustento da sua familia.",
  },
  bom: {
    titulo: "Estrutura Solida",
    feedback:
      "Sua estrutura de protecao e solida. Voce tem uma boa reserva de emergencia e os principais seguros ativos. Falta apenas ajustar detalhes especificos (como planejamento sucessorio ou responsabilidade civil) para atingir a blindagem total.",
  },
  excelente: {
    titulo: "Blindagem Completa",
    feedback:
      "Parabens! Sua vida, sua familia, sua renda e seus bens estao completamente blindados. Voce possui o conforto de saber que, nao importa o imprevisto que aconteca, seu padrao de vida e seu patrimonio estao salvos.",
  },
};

// ----------------------------------------------------------------
// Pilar Aposentadoria
// ----------------------------------------------------------------
const feedbackAposentadoria: FeedbackPorFaixa = {
  ruim: {
    titulo: "Planejamento Inexistente",
    feedback:
      "Voce tem o desejo de se aposentar, mas ainda nao desenhou um plano pratico para isso. Nao saber os seus numeros e depender apenas da previdencia publica (INSS) coloca o seu padrao de vida futuro em grande risco. E urgente definir suas metas e separar o primeiro investimento focado exclusivamente no seu eu do futuro.",
  },
  medio: {
    titulo: "Estrategia Fragil",
    feedback:
      "Voce ja tem metas de idade e renda na cabeca, mas falta clareza nos calculos e constancia nos aportes. Ter apenas uma intencao ou guardar dinheiro sem regularidade nao ativa a forca dos juros compostos a seu favor. O foco agora deve ser organizar o orcamento para investir todos os meses com uma estrategia clara.",
  },
  bom: {
    titulo: "Rumo Certo",
    feedback:
      "Parabens! Voce tem metas bem desenhadas, sabe exatamente quanto precisa poupar e age com disciplina fazendo aportes frequentes. Seu plano de liberdade financeira e real e esta em andamento. O proximo passo e otimizar a rentabilidade dos seus investimentos e reduzir custos desnecessarios para acelerar o processo.",
  },
  excelente: {
    titulo: "Rota de Liberdade Ativa",
    feedback:
      "Excelente trabalho! Voce assumiu o controle total do seu destino financeiro. Suas metas sao claras, voce poupa o valor ideal mensalmente e utiliza uma estrategia diversificada e inteligente. Voce esta avancando rapido e a sua transicao para viver de renda e apenas uma questao de tempo.",
  },
};

// ----------------------------------------------------------------
// Pilar Otimizacao Financeira
// ----------------------------------------------------------------
const feedbackOtimizacao: FeedbackPorFaixa = {
  ruim: {
    titulo: "Alvo Facil dos Bancos e do Governo",
    feedback:
      "Voce esta sendo o cliente dos sonhos dos bancos e do governo, mas o pior inimigo do seu proprio bolso. Pagar anuidade de cartao de credito sem usar os beneficios, nao acumular milhas e ainda entregar mais dinheiro do que deveria para a Receita Federal por falta de planejamento fiscal e um combo perigoso. Voce esta queimando um dinheiro que ja e seu e que poderia estar sendo usado para acelerar a compra da sua casa, do seu carro ou a sua aposentadoria.",
    proximoPasso:
      "E urgente cancelar essas taxas abusivas, entender como funciona o acumulo de pontos do seu cartao e tracar uma estrategia legal para reduzir o seu imposto ou aumentar a sua restituicao no proximo ano.",
  },
  medio: {
    titulo: "Dinheiro Deixado na Mesa",
    feedback:
      "Voce faz apenas o basico e joga na defesa. Voce declara o seu imposto normalmente e usa cartoes de credito, mas nao extrai nenhuma inteligencia dessas ferramentas. Suas milhas e pontos provavelmente estao vencendo no sistema sem voce ver, e a sua declaracao de Imposto de Renda nao aproveita os incentivos fiscais corretos para colocar mais dinheiro de volta na sua conta. Voce nao chega a passar sufoco, mas esta deixando muito dinheiro na mesa por pura falta de conhecimento tecnico.",
    proximoPasso:
      "O foco aqui e ativar e acompanhar o acumulo de milhas do seu cartao de forma consciente e ajustar o seu planejamento tributario anual para recuperar parte do imposto pago atraves de investimentos estrategicos.",
  },
  bom: {
    titulo: "Consumo Inteligente",
    feedback:
      "Parabens! Voce ja e um consumidor consciente. Voce foge das taxas abusivas dos grandes bancos, nao aceita pagar anuidade de cartao a toa e cuida para nao perder dinheiro. O seu fluxo financeiro ja e limpo e eficiente. Falta apenas dar o passo de elite: aprender a alavancar o uso das milhas para transforma-las em lucro real (dinheiro de volta ou viagens baratas) e calibrar os detalhes da sua declaracao de IR para atingir a eficiencia maxima.",
    proximoPasso:
      "Aprender estrategias avancadas de multiplicacao de pontos e otimizar pequenos detalhes tributarios para subir para o nivel de elite.",
  },
  excelente: {
    titulo: "Gestao Avancada de Elite",
    feedback:
      "Excelente! Voce aprendeu a jogar o jogo do sistema e venceu. Voce e o tipo de cliente que os bancos odeiam: nao paga tarifas desnecessarias, sabe exatamente como gerir e multiplicar suas milhas para colocar dinheiro direto no bolso e utiliza incentivos fiscais perfeitos para pagar o minimo de imposto possivel para o governo. O seu nivel de otimizacao e impecavel e cada ferramenta financeira na sua mao se transforma em um acelerador de riqueza.",
    proximoPasso:
      "Manter essa disciplina impecavel e garantir que todo esse dinheiro extra economizado e otimizado seja direcionado para os seus investimentos de longo prazo.",
  },
};

// ----------------------------------------------------------------
// Pilar Fluxo de Caixa
// ----------------------------------------------------------------
const feedbackFluxo: FeedbackPorFaixa = {
  ruim: {
    titulo: "Pilotando no Escuro",
    feedback:
      "Voce esta pilotando seu bolso de olhos vendados. Seu fluxo de caixa deu negativo ou seu Rombo Invisivel e muito alto. Seus percentuais estao totalmente desregulados e o dinheiro do seu trabalho esta sumindo por um ralo financeiro aberto sem voce ver. Pilotar o orcamento assim impede qualquer chance de construir riqueza.",
  },
  medio: {
    titulo: "Dominio Fragil",
    feedback:
      "O mes fecha no positivo, mas o seu dominio e fragil. Voce controla as contas grandes (fixas), mas e passado para tras pelas pequenas despesas diarias (variaveis) que estouram o seu limite de 25%. Voce vive em uma zona de risco: se tiver qualquer imprevisto de saude ou despesa extra, seu mes quebra porque falta margem de seguranca.",
  },
  bom: {
    titulo: "Dominio Saudavel",
    feedback:
      "Otimo dominio sobre o fluxo de caixa. Sua percepcao de sobra bateu muito perto da realidade matematica e seus percentuais reais estao muito proximos do modelo ideal de 50/25/10/15. Isso prova que voce tem consciencia do preco do seu padrao de vida e sabe exatamente o limite do seu bolso.",
  },
  excelente: {
    titulo: "Dominio Absoluto",
    feedback:
      "Dominio orcamentario absoluto e impecavel. Nao existe nenhum Rombo Invisivel no seu bolso e a sua distribuicao de renda segue perfeitamente o padrao de elite do mercado financeiro. Essa precisao cirurgica te da total seguranca e liberdade para acelerar todas as suas metas de vida.",
  },
};

// ----------------------------------------------------------------
// Diagnostico Geral
// ----------------------------------------------------------------
const feedbackGeral: FeedbackPorFaixa = {
  ruim: {
    titulo: "Em Estado de Emergencia",
    feedback:
      "A sua saude financeira esta na UTI. O diagnostico mostra que voce esta exposto a riscos graves em quase todas as areas: seu patrimonio esta sufocado por dividas ou estagnado, voce nao tem protecao contra imprevistos de saude ou renda, e seu dinheiro esta sumindo por um ralo invisivel no orcamento. Continuar nesse caminho coloca o seu futuro e o sustento da sua familia em perigo iminente. E hora de parar de pilotar seu bolso no escuro.",
    proximoPasso:
      "Estancar os juros, fechar os ralos de gastos invisiveis e montar a sua primeira reserva de seguranca imediatamente.",
  },
  medio: {
    titulo: "Situacao de Alerta",
    feedback:
      "Suas financas estao em uma zona de risco e instabilidade. Voce consegue fazer o basico (gerar renda e pagar as contas do mes), mas o seu patrimonio esta engessado e sua blindagem tem buracos graves. Voce tem a intencao de poupar e crescer, mas a falta de um metodo organizado e de estrategias tributarias e de milhas faz voce deixar muito dinheiro na mesa. Qualquer imprevisto de medio prazo pode desestruturar a sua vida atual.",
    proximoPasso:
      "Organizar o fluxo de caixa com ferramentas profissionais, comecar a investir com constancia mensal e fechar os buracos de seguranca (seguros e plano de saude).",
  },
  bom: {
    titulo: "Saude Financeira Boa",
    feedback:
      "Parabens! Voce tem uma vida financeira saudavel e equilibrada. Seus numeros mostram que voce tem controle sobre seus gastos, suas dividas sao baixas ou inexistentes e voce ja possui uma boa estrutura de investimentos e protecao ativa. O seu eu do futuro ja esta sendo cuidado. Voce ja faz o que a maioria das pessoas nao faz, mas ainda existem pequenos ajustes que podem acelerar a sua independencia financeira.",
    proximoPasso:
      "Otimizar a rentabilidade dos seus investimentos, usar os beneficios fiscais ao maximo e alavancar suas milhas para transformar gastos em lucro.",
  },
  excelente: {
    titulo: "Performance de Elite",
    feedback:
      "O seu resultado e espetacular. Voce atingiu o nivel maximo de eficiencia, controle e solidez financeira. Voce nao tem dividas, seu dinheiro trabalha na velocidade maxima, sua vida e sua familia estao 100% blindadas contra qualquer imprevisto e voce domina o sistema bancario e tributario a seu favor. O seu orcamento e cirurgico e previsivel. Alcancar a liberdade financeira total para voce e apenas uma questao de tempo.",
    proximoPasso:
      "Manter a disciplina impecavel e focar em estrategias avancadas de sucessao patrimonial (como Holding) para proteger o legado que voce esta construindo.",
  },
};

// ----------------------------------------------------------------
// API publica
// ----------------------------------------------------------------
const tabelaFeedback: Record<PilarId, FeedbackPorFaixa> = {
  patrimonial: feedbackPatrimonial,
  protecao: feedbackProtecao,
  aposentadoria: feedbackAposentadoria,
  otimizacao: feedbackOtimizacao,
  fluxo: feedbackFluxo,
};

export function feedbackPilar(pilar: PilarId, faixa: Faixa): BlocoFeedback {
  return tabelaFeedback[pilar][faixa];
}

export function feedbackDiagnosticoGeral(faixa: Faixa): BlocoFeedback {
  return feedbackGeral[faixa];
}

// Metadados visuais (titulo, subtitulo)
export const pilaresMeta: Record<PilarId, { titulo: string; subtitulo: string }> = {
  patrimonial: {
    titulo: "Analise Patrimonial",
    subtitulo: "Saude entre bens e dividas + estrategia de aquisicoes",
  },
  protecao: {
    titulo: "Protecao Financeira",
    subtitulo: "Blindagem contra imprevistos de saude, renda e fatalidades",
  },
  aposentadoria: {
    titulo: "Aposentadoria e Futuro",
    subtitulo: "Clareza de objetivos e velocidade rumo a independencia",
  },
  otimizacao: {
    titulo: "Otimizacao Financeira",
    subtitulo: "Eficiencia com IR, cartoes, milhas e controle de gastos",
  },
  fluxo: {
    titulo: "Fluxo de Caixa",
    subtitulo: "Aderencia ao orcamento ideal e dominio sobre o seu dinheiro",
  },
};
