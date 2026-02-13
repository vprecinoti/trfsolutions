import { baseTemplate } from './base.template';

interface BoasVindasData {
  nomeCliente: string;
  dataReuniao?: string;
  horaReuniao?: string;
  nomeConsultor?: string;
}

export function boasVindasTemplate(data: BoasVindasData): string {
  const reuniaoInfo = data.dataReuniao
    ? `
      <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #3A8DFF33; margin-bottom: 24px;">
        <p style="color: #3A8DFF; margin: 0 0 16px 0; font-size: 15px; font-weight: 600;">📅 Sua análise financeira já está agendada</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; width: 160px;">Data da Análise</td>
            <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">${data.dataReuniao}${data.horaReuniao ? ` às ${data.horaReuniao}` : ''}</td>
          </tr>
          ${data.nomeConsultor ? `
          <tr>
            <td style="color: #94a3b8; padding: 8px 0;">Nome do Consultor</td>
            <td style="color: #ffffff; padding: 8px 0; font-weight: bold;">${data.nomeConsultor}</td>
          </tr>
          ` : ''}
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
    `
    : '';

  return baseTemplate(`
    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${data.nomeCliente}! 👋</h2>
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 16px 0; font-size: 15px;">
      Seja muito bem-vindo(a) à TRF Solutions! Estamos muito felizes em ter você conosco.
    </p>
    <p style="color: #cbd5e1; line-height: 1.8; margin: 0 0 24px 0; font-size: 15px;">
      A partir de agora, vamos trabalhar juntos para organizar sua vida financeira e alcançar seus objetivos.
    </p>
    ${reuniaoInfo}
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 15px;">
      Aguardamos você!
    </p>
  `);
}
