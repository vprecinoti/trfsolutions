import { baseTemplate } from './base.template';

interface ReuniaoAgendadaData {
  nomeCliente: string;
  dataFormatada: string;
  horaFormatada: string;
  nomeConsultor: string;
}

export function reuniaoAgendadaTemplate(data: ReuniaoAgendadaData): string {
  return baseTemplate(`
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 24px 0; font-size: 15px;">
      Olá <strong style="color: #ffffff;">${data.nomeCliente}</strong>, tudo bem?
    </p>
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 16px 0; font-size: 15px;">
      Você acaba de dar o primeiro passo para tornar sua vida financeira pessoal organizada, protegida e equipada com ferramentas para alcançar seus objetivos de maneira estratégica e inteligente.
    </p>
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 16px 0; font-size: 15px;">
      Nesta reunião, apresentaremos nosso trabalho e entenderemos seus objetivos e sua situação financeira atual. Juntos, iremos avaliar se você está no caminho certo para alcançar suas metas. Além disso, geraremos um diagnóstico completo com feedback sobre todas as áreas financeiras.
    </p>
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 24px 0; font-size: 15px;">
      Nosso objetivo é trazer conhecimento e otimização do seu tempo, proporcionando clareza e direção para suas finanças.
    </p>
    <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #3A8DFF33; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0; width: 160px;">Data da Análise</td>
          <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">${data.dataFormatada} às ${data.horaFormatada}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Nome do Consultor</td>
          <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">${data.nomeConsultor}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Telefone do Consultor</td>
          <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">16 99716-4180</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Local da Análise</td>
          <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">A confirmar</td>
        </tr>
      </table>
    </div>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 15px;">
      Aguardamos você!
    </p>
  `);
}
