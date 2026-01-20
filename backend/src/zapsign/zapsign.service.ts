import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface ZapSignSigner {
  name: string;
  email: string;
  phone_country?: string;
  phone_number?: string;
  auth_mode?: 'assinaturaTela' | 'tokenEmail' | 'tokenSms' | 'assinaturaTelaSelfie';
  send_automatic_email?: boolean;
  send_automatic_whatsapp?: boolean;
}

interface CreateDocumentDto {
  leadId: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  pdfBase64: string;
  documentName?: string;
}

interface ZapSignDocumentResponse {
  open_id: string;
  token: string;
  status: string;
  name: string;
  signers: Array<{
    token: string;
    status: string;
    name: string;
    email: string;
    sign_url: string;
  }>;
}

@Injectable()
export class ZapsignService {
  private readonly logger = new Logger(ZapsignService.name);
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(private prisma: PrismaService) {
    this.apiUrl = process.env.ZAPSIGN_API_URL || 'https://api.zapsign.com.br/api/v1';
    this.apiToken = process.env.ZAPSIGN_API_TOKEN || '';
    
    if (!this.apiToken) {
      this.logger.warn('ZAPSIGN_API_TOKEN não configurado!');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Cria um documento no ZapSign e envia para assinatura
   */
  async createDocument(dto: CreateDocumentDto): Promise<ZapSignDocumentResponse> {
    if (!this.apiToken) {
      throw new BadRequestException('ZapSign API Token não configurado');
    }

    try {
      // Preparar dados do signatário
      const signer: ZapSignSigner = {
        name: dto.signerName,
        email: dto.signerEmail,
        auth_mode: 'assinaturaTela', // Assinatura simples na tela
        send_automatic_email: true, // ZapSign envia o email automaticamente
      };

      // Se tiver telefone, adicionar para WhatsApp
      if (dto.signerPhone) {
        const phoneClean = dto.signerPhone.replace(/\D/g, '');
        signer.phone_country = '55';
        signer.phone_number = phoneClean;
        signer.send_automatic_whatsapp = true;
      }

      // Criar documento no ZapSign
      const payload = {
        name: dto.documentName || `Contrato - ${dto.signerName}`,
        base64_pdf: dto.pdfBase64,
        signers: [signer],
        lang: 'pt-br',
        disable_signer_emails: false,
        brand_logo: '', // Pode adicionar logo da empresa depois
        external_id: dto.leadId, // ID do lead para referência
        sandbox: process.env.NODE_ENV !== 'production', // Modo sandbox para desenvolvimento
      };

      this.logger.log(`Enviando documento para ZapSign: ${payload.name}`);

      const response = await axios.post<ZapSignDocumentResponse>(
        `${this.apiUrl}/docs/`,
        payload,
        { headers: this.getHeaders() }
      );

      this.logger.log(`Documento criado no ZapSign: ${response.data.open_id}`);

      // Atualizar o lead com as informações do ZapSign
      await this.prisma.lead.update({
        where: { id: dto.leadId },
        data: {
          statusContrato: 'enviado',
          contratoEnviadoEm: new Date(),
          status: 'PROPOSTA_ENVIADA',
          // Salvar referências do ZapSign no resultadoJson
          resultadoJson: {
            ...(await this.prisma.lead.findUnique({ where: { id: dto.leadId } }))?.resultadoJson as object || {},
            zapsign: {
              documentId: response.data.open_id,
              documentToken: response.data.token,
              signerToken: response.data.signers[0]?.token,
              signUrl: response.data.signers[0]?.sign_url,
              createdAt: new Date().toISOString(),
            },
          },
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao criar documento no ZapSign:', error.response?.data || error.message);
      
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          error.response?.data?.message || 'Erro ao enviar documento para ZapSign'
        );
      }
      throw error;
    }
  }

  /**
   * Busca status de um documento no ZapSign
   */
  async getDocumentStatus(documentToken: string): Promise<any> {
    if (!this.apiToken) {
      throw new BadRequestException('ZapSign API Token não configurado');
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/docs/${documentToken}/`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao buscar documento no ZapSign:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao buscar status do documento');
    }
  }

  /**
   * Processa webhook do ZapSign quando documento é assinado
   */
  async handleWebhook(payload: any): Promise<void> {
    this.logger.log('Webhook ZapSign recebido:', JSON.stringify(payload));

    const { event_type, doc } = payload;

    // Verificar se é evento de documento assinado
    if (event_type === 'doc_signed' || doc?.status === 'signed') {
      const externalId = doc?.external_id; // leadId que enviamos

      if (externalId) {
        this.logger.log(`Documento assinado! Atualizando lead: ${externalId}`);

        await this.prisma.lead.update({
          where: { id: externalId },
          data: {
            statusContrato: 'assinado',
            contratoAssinadoEm: new Date(),
            status: 'PROPOSTA_ACEITA',
          },
        });

        this.logger.log(`Lead ${externalId} atualizado para PROPOSTA_ACEITA`);
      }
    }
  }

  /**
   * Deleta um documento do ZapSign (se necessário cancelar)
   */
  async deleteDocument(documentToken: string): Promise<void> {
    if (!this.apiToken) {
      throw new BadRequestException('ZapSign API Token não configurado');
    }

    try {
      await axios.delete(
        `${this.apiUrl}/docs/${documentToken}/`,
        { headers: this.getHeaders() }
      );

      this.logger.log(`Documento ${documentToken} deletado do ZapSign`);
    } catch (error) {
      this.logger.error('Erro ao deletar documento no ZapSign:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao cancelar documento');
    }
  }
}
