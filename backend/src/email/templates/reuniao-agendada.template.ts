import { baseTemplate } from './base.template';

interface ReuniaoAgendadaData {
  nomeCliente: string;
  tituloReuniao: string;
  dataFormatada: string;
  horaFormatada: string;
  duracao: number;
  tipo: string;
}

export function reuniaoAgendadaTemplate(data: ReuniaoAgendadaData): string {
  return baseTemplate(`
    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${data.nomeCliente}! 📅</h2>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
      Sua reunião foi agendada com sucesso! Confira os detalhes:
    </p>
    <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #3A8DFF33; margin-bottom: 24px;">
      <h3 style="color: #3A8DFF; margin: 0 0 16px 0; font-size: 18px;">${data.tituloReuniao}</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #94a3b8; padding: 6px 0; width: 100px;">Data</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.dataFormatada}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Horário</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.horaFormatada}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Duração</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.duracao} minutos</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Tipo</td>
          <td style="color: #ffffff; padding: 6px 0;">${data.tipo}</td>
        </tr>
      </table>
    </div>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0;">
      Caso precise reagendar, entre em contato conosco.
    </p>
  `);
}
