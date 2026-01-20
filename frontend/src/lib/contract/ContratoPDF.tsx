"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Registrar fonte (opcional - usa fonte padrão se não registrar)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf" },
  ],
});

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 5,
  },
  tableLabel: {
    width: "30%",
    fontWeight: "bold",
    color: "#333",
  },
  tableValue: {
    width: "70%",
    color: "#000",
  },
  contratadaBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 3,
  },
  clausula: {
    marginTop: 12,
    marginBottom: 8,
  },
  clausulaNumero: {
    fontWeight: "bold",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    textAlign: "center",
    fontSize: 8,
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  signatureLine: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: "60%",
    alignSelf: "center",
    paddingTop: 5,
    textAlign: "center",
  },
});

// Interface para os dados do contrato
export interface DadosContrato {
  // Dados do cliente
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
  
  // Dados do contrato
  valorAP: string;
  valorAPExtenso: string;
  formaPagamento: "pix" | "cartao";
  numeroParcelas?: string;
  vencimentoAP?: string;
  
  // Dados bancários (para PIX)
  numeroConta?: string;
  numeroAgencia?: string;
  nomeBanco?: string;
}

// Função para converter número em extenso
export function numeroParaExtenso(valor: number): string {
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  if (valor === 0) return "zero reais";
  if (valor === 100) return "cem reais";

  const partes: string[] = [];
  
  // Milhares
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

  // Centenas
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

// Componente do PDF
export function ContratoPDF({ dados }: { dados: DadosContrato }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título */}
        <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>

        {/* Preâmbulo */}
        <Text style={styles.sectionTitle}>PREÂMBULO</Text>

        {/* 1) Partes Contratantes */}
        <Text style={styles.subsectionTitle}>1) Partes Contratantes</Text>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Contratante:</Text>

        {/* Tabela de dados do cliente */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Nome:</Text>
            <Text style={styles.tableValue}>{dados.nomeCompleto}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Endereço:</Text>
            <Text style={styles.tableValue}>{dados.endereco}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Bairro:</Text>
            <Text style={styles.tableValue}>{dados.bairro}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>CEP:</Text>
            <Text style={styles.tableValue}>{dados.cep}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Município:</Text>
            <Text style={styles.tableValue}>{dados.cidade}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Estado:</Text>
            <Text style={styles.tableValue}>{dados.estado}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Telefone fixo:</Text>
            <Text style={styles.tableValue}>{dados.telefoneFixo || "-"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Celular:</Text>
            <Text style={styles.tableValue}>{dados.celular}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>E-mail:</Text>
            <Text style={styles.tableValue}>{dados.email}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>RG:</Text>
            <Text style={styles.tableValue}>{dados.rg}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>CPF/MF:</Text>
            <Text style={styles.tableValue}>{dados.cpf}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Estado Civil:</Text>
            <Text style={styles.tableValue}>{dados.estadoCivil}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Profissão:</Text>
            <Text style={styles.tableValue}>{dados.profissao}</Text>
          </View>
        </View>

        {/* Contratada */}
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Contratada:</Text>
        <View style={styles.contratadaBox}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>TRF SOLUTIONS LTDA</Text>, pessoa jurídica de direito privado inscrita no CNPJ/MF sob o n.º 55.574.403/0001-36, com sede na Rua Cezário Gonçalves, 150, 4º andar, Jd Botânico, Cidade de Ribeirão Preto, Estado de São Paulo, CEP 14021-656.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          doravante denominados, em conjunto, simplesmente "Partes" e, de forma genérica e individual, simplesmente "Parte"; tem entre si justa e acordada a celebração do presente Contrato de Prestação de Serviços ("Contrato"), com as opções manifestadas no Preâmbulo, se regerá pelas cláusulas dos Termos e Condições a seguir.
        </Text>

        {/* 2) Objeto */}
        <Text style={styles.subsectionTitle}>2) Objeto</Text>
        <Text style={styles.paragraph}>
          Constitui objeto do presente Contrato a prestação, pela Contratada ao(a) Contratante, de serviços de consultoria com vistas à educação e planejamento financeiro pessoais, especificados nas Seções I e II dos Termos e Condições Gerais a seguir.
        </Text>

        {/* 3) Vigência */}
        <Text style={styles.subsectionTitle}>3) Vigência</Text>
        <Text style={styles.paragraph}>
          Os serviços de consultoria destinados à educação e planejamento financeiro pessoal, conforme estipulado na Cláusula 1.3, terão validade de 1 (um) ano. Durante esse período, serão realizadas 6 (seis) reuniões de consultoria, abordando os seguintes temas: organização e planejamento; proteção e gestão de risco; acúmulo e investimento; expansão patrimonial; milhas; e previdência privada. Após a conclusão dessas reuniões, o cliente terá direito a reuniões de acompanhamento, com frequência média de 1 (uma) reunião por mês, sem limitação na quantidade, sendo agendadas de acordo com a demanda do cliente.
        </Text>

        {/* 4) Remuneração */}
        <Text style={styles.subsectionTitle}>4) Remuneração</Text>
        <Text style={styles.paragraph}>
          O(a) Contratante remunerará a Contratada de acordo com os serviços contratados, da seguinte forma:
        </Text>
        <Text style={styles.listItem}>
          1. Para os serviços de consultoria com vistas à educação e planejamento financeiro pessoal + as reuniões de acompanhamento, o(a) Contratante pagará à Contratada, a título de remuneração, o valor de {dados.valorAP} ({dados.valorAPExtenso}).
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Página 2 */}
      <Page size="A4" style={styles.page}>
        {/* 5) Forma de Pagamento */}
        <Text style={styles.subsectionTitle}>5) Forma de Pagamento</Text>
        <Text style={styles.paragraph}>
          A Remuneração prevista no item D.1 acima, será paga pelo(a) Contratante à Contratada:
        </Text>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkbox}>{dados.formaPagamento === "pix" ? "X" : " "}</Text>
          <Text style={{ flex: 1 }}>
            Mediante pix à vista à conta corrente {dados.numeroConta || "___________"}, agência {dados.numeroAgencia || "_______"}, banco {dados.nomeBanco || "_______________"}, de titularidade da Contratada, em parcela única, com vencimento em {dados.vencimentoAP || "___/___/______"}, na forma prevista nos Termos e Condições Gerais a seguir
          </Text>
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkbox}>{dados.formaPagamento === "cartao" ? "X" : " "}</Text>
          <Text style={{ flex: 1 }}>
            Mediante cartão de crédito, conforme dados informados pelo(a) Contratante. O pagamento será efetuado em {dados.numeroParcelas || "___"} parcelas.
          </Text>
        </View>

        {/* 6) Disposições Gerais */}
        <Text style={styles.subsectionTitle}>6) Disposições Gerais</Text>
        <Text style={styles.paragraph}>
          Em complemento ao disposto no Preâmbulo, aplicam-se integralmente à relação contratual entre Contratante e Contratado(a) os Termos e Condições Gerais dispostos a seguir, os quais são parte integrante e indissociável do Contrato.
        </Text>

        {/* TERMOS E CONDIÇÕES GERAIS */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>TERMOS E CONDIÇÕES GERAIS</Text>

        {/* Seção I - OBJETO */}
        <Text style={styles.subsectionTitle}>I – OBJETO</Text>
        <Text style={styles.paragraph}>
          1.1. Os presentes Termos e Condições Gerais são parte integrante do Contrato e estabelecem as regras, princípios e condições para a prestação dos serviços pela Contratada ao(a) Contratante, em conformidade com a Cláusula 1.3 e Seção II dispostos adiante.
        </Text>
        <Text style={styles.paragraph}>
          1.2. A contratação dos Serviços pelo(a) Contratante, implica a aceitação automática, de maneira irrevogável e irretratável, pelas Partes, das regras, princípios e condições estabelecidas neste Contrato.
        </Text>
        <Text style={styles.paragraph}>
          1.3. A Contratada prestará ao(a) Contratante serviços de consultoria com vistas à educação e planejamento financeiro pessoal ("Serviços"), que poderão incluir o desenvolvimento de uma ou mais das seguintes atividades, a depender do perfil do(a) Contratante e da efetiva necessidade:
        </Text>
        <Text style={styles.listItem}>a) Reunião para análise e identificação do perfil e diagnóstico dos objetivos financeiros do(a) Contratante;</Text>
        <Text style={styles.listItem}>b) elaboração de planejamento das conclusões obtidas com base no perfil e diagnóstico dos objetivos financeiros do(a) Contratante ("Planejamento");</Text>
        <Text style={styles.listItem}>c) Reunião para apresentação do planejamento financeiro, considerando as conclusões obtidas com base no perfil e diagnóstico dos objetivos financeiros do(a) Contratante, bem como, orientação no que se refere as conclusões contidas neste Planejamento;</Text>
        <Text style={styles.listItem}>d) esclarecimento de dúvidas do(a) Contratante relacionadas ao Planejamento apresentado;</Text>
        <Text style={styles.listItem}>e) Acompanhamento da evolução do planejamento financeiro pelo(a) Contratante.</Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Página 3 */}
      <Page size="A4" style={styles.page}>
        {/* Seção II - EXECUÇÃO DOS SERVIÇOS */}
        <Text style={styles.subsectionTitle}>II – EXECUÇÃO DOS SERVIÇOS</Text>
        <Text style={styles.paragraph}>
          2.1. Para a execução dos Serviços contratados, a Contratada poderá utilizar profissionais de empresas parceiras, subcontratadas e/ou consultores independentes.
        </Text>
        <Text style={styles.paragraph}>
          2.2. Os Serviços a serem desenvolvidos pela Contratada envolvem elaboração de metodologia para auxiliar a eventual tomada de decisões pelo(a) Contratante, a exclusivo critério e responsabilidade do(a) Contratante.
        </Text>

        {/* Seção III - OBRIGAÇÕES DAS PARTES */}
        <Text style={styles.subsectionTitle}>III – OBRIGAÇÕES DAS PARTES</Text>
        <Text style={styles.paragraph}>
          3.1. Constituem obrigações da Contratada, dentre outras previstas em lei:
        </Text>
        <Text style={styles.listItem}>a) preparar o Planejamento no prazo de até 30 (trinta) dias contados da data em que o(a) Contratante tiver colocado à disposição da Contratada todas as informações e documentos solicitados;</Text>
        <Text style={styles.listItem}>b) designar, para a prestação dos Serviços, profissional(is) com o conhecimento adequado ao desempenho das atividades que integram os Serviços.</Text>
        <Text style={styles.paragraph}>
          3.2. Constituem obrigações do(a) Contratante, dentre outras previstas em lei e neste Contrato:
        </Text>
        <Text style={styles.listItem}>a) realizar o pagamento da Remuneração e das despesas à Contratada, na forma e prazos ajustados pelas Partes;</Text>
        <Text style={styles.listItem}>b) fornecer de forma verídica, precisa e fidedigna, todos os documentos e/ou informações solicitados pela Contratada;</Text>
        <Text style={styles.listItem}>c) participar de reuniões presenciais ou através de ferramenta de vídeo conferência com a Contratada.</Text>

        {/* Seção IV - VIGÊNCIA */}
        <Text style={styles.subsectionTitle}>IV – VIGÊNCIA</Text>
        <Text style={styles.paragraph}>
          4.1. O Contrato terá início na data da assinatura e vigerá pelo(s) prazo(s) indicado(s) no item C do Preâmbulo.
        </Text>
        <Text style={styles.paragraph}>
          4.2. O(a) Contratante autoriza que, mesmo após o término da vigência do Contrato, a Contratada possa lhe oferecer serviços e/ou oportunidades adicionais.
        </Text>

        {/* Seção V - REMUNERAÇÃO */}
        <Text style={styles.subsectionTitle}>V – REMUNERAÇÃO, DESPESAS E FORMA DE PAGAMENTO</Text>
        <Text style={styles.paragraph}>
          5.1. Em contraprestação pelos Serviços, o Contratante pagará à Contratada o(s) valor(es) indicado(s) no item D do Preâmbulo.
        </Text>
        <Text style={styles.paragraph}>
          5.2. A Remuneração já inclui todos os tributos federais, estaduais, municipais e demais encargos legais.
        </Text>
        <Text style={styles.paragraph}>
          5.3. O pagamento da Remuneração será feito mediante pix para conta corrente da Contratada ou cartão de crédito, conforme assinalado no item E do Preâmbulo.
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Página 4 */}
      <Page size="A4" style={styles.page}>
        {/* Seção VI - CONFIDENCIALIDADE */}
        <Text style={styles.subsectionTitle}>VI – CONFIDENCIALIDADE</Text>
        <Text style={styles.paragraph}>
          6.1. Para os fins do Contrato, são consideradas "Informações Confidenciais" todas e quaisquer informações que forem divulgadas por uma das Partes à outra Parte, seja verbalmente, por escrito, por meio eletrônico ou por qualquer forma de transmissão.
        </Text>
        <Text style={styles.paragraph}>
          6.2. As Informações Confidenciais somente poderão ser utilizadas para a consecução dos objetivos do Contrato.
        </Text>
        <Text style={styles.paragraph}>
          6.3. As obrigações de confidencialidade sobreviverão mesmo após o término do Contrato.
        </Text>

        {/* Seção VII - TÉRMINO */}
        <Text style={styles.subsectionTitle}>VII – TÉRMINO DA RELAÇÃO CONTRATUAL</Text>
        <Text style={styles.paragraph}>
          7.1. O Contrato poderá ser rescindido, independentemente de notificação, nas hipóteses de insolvência, dissolução, pedido de recuperação judicial ou extrajudicial ou decretação de falência de qualquer das Partes; e caso fortuito ou força maior.
        </Text>
        <Text style={styles.paragraph}>
          7.2. Qualquer uma das Partes poderá resolver o Contrato imotivadamente, mediante simples comunicação por escrito à outra Parte, com pelo menos 30 (trinta) dias de antecedência.
        </Text>

        {/* Seção VIII - RELACIONAMENTO */}
        <Text style={styles.subsectionTitle}>VIII – RELACIONAMENTO DAS PARTES</Text>
        <Text style={styles.paragraph}>
          8.1. As Partes reconhecem inexistir qualquer vínculo de natureza empregatícia entre o(a) Contratante e a Contratada.
        </Text>
        <Text style={styles.paragraph}>
          8.2. O Contrato igualmente não estabelece entre as Partes qualquer forma de associação, sociedade ou consórcio.
        </Text>

        {/* Seção IX - LGPD */}
        <Text style={styles.subsectionTitle}>IX – LEI GERAL DE PROTEÇÃO DE DADOS</Text>
        <Text style={styles.paragraph}>
          9.1. No tratamento de dados pessoais, a Contratada cumpre toda a legislação aplicável sobre segurança da informação, privacidade e proteção de dados, inclusive a Lei Federal n. 13.709/2018 (LGPD).
        </Text>

        {/* Seção X - DISPOSIÇÕES GERAIS */}
        <Text style={styles.subsectionTitle}>X – DISPOSIÇÕES GERAIS</Text>
        <Text style={styles.paragraph}>
          10.1. O Contrato prevalece sobre quaisquer acordos anteriores havidos entre as Partes em relação ao correspondente objeto.
        </Text>
        <Text style={styles.paragraph}>
          10.2. O Contrato é firmado em caráter irretratável e irrevogável, obrigando as Partes e seus sucessores.
        </Text>

        {/* Seção XI - FORO */}
        <Text style={styles.subsectionTitle}>XI – FORO</Text>
        <Text style={styles.paragraph}>
          11.1. Para dirimir quaisquer questões oriundas do Contrato, as Partes elegem o Foro da Comarca de São Paulo, Estado de São Paulo, com renúncia a qualquer outro por mais privilegiado que seja.
        </Text>

        {/* Assinatura */}
        <View style={styles.signatureSection}>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            E, por estarem assim justas e contratadas, as Partes assinam o presente instrumento.
          </Text>
          <View style={styles.signatureLine}>
            <Text>{dados.nomeCompleto}</Text>
            <Text style={{ fontSize: 8, color: "#666" }}>Contratante</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
