import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { boasVindasTemplate } from './templates/boas-vindas.template';
import { reuniaoAgendadaTemplate } from './templates/reuniao-agendada.template';
import { reuniaoRemarcadaTemplate } from './templates/reuniao-remarcada.template';
import { formularioPreenchidoTemplate } from './templates/formulario-preenchido.template';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'TRF Solutions <noreply@trfsolutions.com.br>';
    this.logger.log(`EmailService inicializado | from: ${this.fromEmail} | apiKey: ${apiKey ? 're_...' + apiKey.slice(-4) : 'NÃO CONFIGURADA'}`);
  }

  private async enviar(para: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: para,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Erro ao enviar email para ${para}: ${subject}`, error);
        return { success: false, error };
      }

      this.logger.log(`Email enviado para ${para}: ${subject} (id: ${data?.id})`);
      return { success: true, id: data?.id };
    } catch (err) {
      this.logger.error(`Exceção ao enviar email para ${para}:`, err);
      return { success: false, error: err };
    }
  }

  private formatarData(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  private formatarHora(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ============================================
  // EMAILS DISPONÍVEIS
  // ============================================

  /** Email de boas-vindas ao cadastrar novo cliente */
  async enviarBoasVindas(para: string, nomeCliente: string, dataReuniao?: Date) {
    const html = boasVindasTemplate({
      nomeCliente,
      dataReuniao: dataReuniao ? this.formatarData(dataReuniao) : undefined,
      horaReuniao: dataReuniao ? this.formatarHora(dataReuniao) : undefined,
    });
    return this.enviar(para, 'Bem-vindo à TRF Solutions! 🎉', html);
  }

  /** Email de reunião agendada (nova reunião com cliente existente) */
  async enviarReuniaoAgendada(para: string, nomeCliente: string, dataHora: Date, titulo: string, duracao: number, tipo: string) {
    const tipoLabel: Record<string, string> = {
      CONSULTORIA: 'Consultoria',
      ACOMPANHAMENTO: 'Acompanhamento',
      APRESENTACAO: 'Apresentação',
      OUTRO: 'Outro',
    };
    const html = reuniaoAgendadaTemplate({
      nomeCliente,
      tituloReuniao: titulo,
      dataFormatada: this.formatarData(dataHora),
      horaFormatada: this.formatarHora(dataHora),
      duracao,
      tipo: tipoLabel[tipo] || tipo,
    });
    return this.enviar(para, `Reunião agendada: ${titulo} 📅`, html);
  }

  /** Email de reunião remarcada */
  async enviarReuniaoRemarcada(para: string, nomeCliente: string, titulo: string, dataAnterior: Date, novaData: Date) {
    const html = reuniaoRemarcadaTemplate({
      nomeCliente,
      tituloReuniao: titulo,
      dataAnterior: this.formatarData(dataAnterior),
      horaAnterior: this.formatarHora(dataAnterior),
      novaData: this.formatarData(novaData),
      novaHora: this.formatarHora(novaData),
    });
    return this.enviar(para, `Reunião remarcada: ${titulo} 🔄`, html);
  }

  /** Email de formulário preenchido */
  async enviarFormularioPreenchido(para: string, nomeCliente: string, nomeConsultor: string) {
    const html = formularioPreenchidoTemplate({ nomeCliente, nomeConsultor });
    return this.enviar(para, 'Formulário preenchido com sucesso! ✅', html);
  }
}
