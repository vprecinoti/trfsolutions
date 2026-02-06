import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'TRF Solutions <onboarding@resend.dev>';
  }

  async enviarBoasVindas(para: string, nomeCliente: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: para,
        subject: 'Bem-vindo à TRF Solutions! 🎉',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1a2235 0%, #0a0f1a 100%); padding: 40px 32px; text-align: center;">
              <h1 style="color: #3A8DFF; margin: 0 0 8px 0; font-size: 28px;">TRF Solutions</h1>
              <p style="color: #94a3b8; margin: 0; font-size: 14px;">Consultoria Financeira</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${nomeCliente}! 👋</h2>
              <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0;">
                Seja muito bem-vindo(a) à TRF Solutions! Estamos muito felizes em ter você conosco.
              </p>
              <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0;">
                A partir de agora, vamos trabalhar juntos para organizar sua vida financeira e alcançar seus objetivos.
              </p>
              <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
                Em breve entraremos em contato para agendar nossa primeira reunião. Fique à vontade para nos procurar caso tenha qualquer dúvida.
              </p>
              <div style="background: #1a2235; border-radius: 12px; padding: 20px; border: 1px solid #2a3245;">
                <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 13px;">Próximos passos:</p>
                <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Reunião de apresentação</li>
                  <li>Análise do seu perfil financeiro</li>
                  <li>Plano personalizado</li>
                </ul>
              </div>
            </div>
            <div style="padding: 24px 32px; border-top: 1px solid #1a2235; text-align: center;">
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                TRF Solutions - Consultoria Financeira
              </p>
            </div>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Erro ao enviar email de boas-vindas para ${para}:`, error);
        return { success: false, error };
      }

      this.logger.log(`Email de boas-vindas enviado para ${para} (id: ${data?.id})`);
      return { success: true, id: data?.id };
    } catch (err) {
      this.logger.error(`Exceção ao enviar email para ${para}:`, err);
      return { success: false, error: err };
    }
  }

  async enviarLembreteReuniao(para: string, nomeCliente: string, dataReuniao: Date, tituloReuniao: string) {
    try {
      const dataFormatada = dataReuniao.toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      });
      const horaFormatada = dataReuniao.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit',
      });

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: para,
        subject: `Reunião agendada: ${tituloReuniao} 📅`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1a2235 0%, #0a0f1a 100%); padding: 40px 32px; text-align: center;">
              <h1 style="color: #3A8DFF; margin: 0 0 8px 0; font-size: 28px;">TRF Solutions</h1>
              <p style="color: #94a3b8; margin: 0; font-size: 14px;">Consultoria Financeira</p>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${nomeCliente}! 📅</h2>
              <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
                Sua reunião foi agendada com sucesso! Confira os detalhes abaixo:
              </p>
              <div style="background: #1a2235; border-radius: 12px; padding: 24px; border: 1px solid #3A8DFF33;">
                <h3 style="color: #3A8DFF; margin: 0 0 16px 0; font-size: 18px;">${tituloReuniao}</h3>
                <div style="display: flex; margin-bottom: 12px;">
                  <span style="color: #94a3b8; width: 80px;">Data:</span>
                  <span style="color: #ffffff;">${dataFormatada}</span>
                </div>
                <div style="display: flex;">
                  <span style="color: #94a3b8; width: 80px;">Horário:</span>
                  <span style="color: #ffffff;">${horaFormatada}</span>
                </div>
              </div>
              <p style="color: #cbd5e1; line-height: 1.6; margin: 24px 0 0 0;">
                Caso precise reagendar, entre em contato conosco.
              </p>
            </div>
            <div style="padding: 24px 32px; border-top: 1px solid #1a2235; text-align: center;">
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                TRF Solutions - Consultoria Financeira
              </p>
            </div>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Erro ao enviar lembrete de reunião para ${para}:`, error);
        return { success: false, error };
      }

      this.logger.log(`Lembrete de reunião enviado para ${para} (id: ${data?.id})`);
      return { success: true, id: data?.id };
    } catch (err) {
      this.logger.error(`Exceção ao enviar email para ${para}:`, err);
      return { success: false, error: err };
    }
  }
}
