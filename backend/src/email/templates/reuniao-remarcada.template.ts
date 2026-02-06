import { baseTemplate } from './base.template';

interface ReuniaoRemarcadaData {
  nomeCliente: string;
  tituloReuniao: string;
  dataAnterior: string;
  horaAnterior: string;
  novaData: string;
  novaHora: string;
}

export function reuniaoRemarcadaTemplate(data: ReuniaoRemarcadaData): string {
  return baseTemplate(`
    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${data.nomeCliente}! 🔄</h2>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
      Sua reunião foi remarcada. Confira os novos detalhes:
    </p>
    <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #f59e0b33; margin-bottom: 16px;">
      <p style="color: #f59e0b; margin: 0 0 12px 0; font-size: 13px; font-weight: 600;">❌ Data anterior</p>
      <p style="color: #94a3b8; margin: 0; text-decoration: line-through;">
        ${data.dataAnterior} às ${data.horaAnterior}
      </p>
    </div>
    <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #3A8DFF33; margin-bottom: 24px;">
      <p style="color: #3A8DFF; margin: 0 0 12px 0; font-size: 13px; font-weight: 600;">✅ Nova data</p>
      <h3 style="color: #3A8DFF; margin: 0 0 8px 0; font-size: 18px;">${data.tituloReuniao}</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #94a3b8; padding: 6px 0; width: 100px;">Data</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.novaData}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Horário</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.novaHora}</td>
        </tr>
      </table>
    </div>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0;">
      Caso tenha alguma dúvida, entre em contato conosco.
    </p>
  `);
}
