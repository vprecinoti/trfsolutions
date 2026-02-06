import { baseTemplate } from './base.template';

interface BoasVindasData {
  nomeCliente: string;
  dataReuniao?: string; // formatada, ex: "segunda-feira, 10 de fevereiro de 2026"
  horaReuniao?: string; // ex: "10:00"
}

export function boasVindasTemplate(data: BoasVindasData): string {
  const reuniaoInfo = data.dataReuniao
    ? `
      <div style="background: #1a2235; border-radius: 12px; padding: 20px; border: 1px solid #3A8DFF33; margin-bottom: 20px;">
        <p style="color: #3A8DFF; margin: 0 0 12px 0; font-size: 15px; font-weight: 600;">📅 Reunião agendada</p>
        <div style="margin-bottom: 8px;">
          <span style="color: #94a3b8;">Data:</span>
          <span style="color: #ffffff; margin-left: 8px;">${data.dataReuniao}</span>
        </div>
        ${data.horaReuniao ? `
        <div>
          <span style="color: #94a3b8;">Horário:</span>
          <span style="color: #ffffff; margin-left: 8px;">${data.horaReuniao}</span>
        </div>
        ` : ''}
      </div>
    `
    : '';

  return baseTemplate(`
    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${data.nomeCliente}! 👋</h2>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0;">
      Seja muito bem-vindo(a) à TRF Solutions! Estamos muito felizes em ter você conosco.
    </p>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
      A partir de agora, vamos trabalhar juntos para organizar sua vida financeira e alcançar seus objetivos.
    </p>
    ${reuniaoInfo}
    <div style="background: #1a2235; border-radius: 12px; padding: 20px; border: 1px solid #2a3245;">
      <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 13px;">Próximos passos:</p>
      <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Reunião de apresentação</li>
        <li>Análise do seu perfil financeiro</li>
        <li>Plano personalizado</li>
      </ul>
    </div>
  `);
}
