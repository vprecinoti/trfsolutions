import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ZapsignService } from './zapsign.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('zapsign')
export class ZapsignController {
  constructor(private readonly zapsignService: ZapsignService) {}

  /**
   * POST /zapsign/send - Envia documento para assinatura
   * Requer autenticação
   */
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendDocument(@Body() dto: {
    leadId: string;
    signerName: string;
    signerEmail: string;
    signerPhone?: string;
    pdfBase64: string;
    documentName?: string;
  }) {
    const result = await this.zapsignService.createDocument(dto);
    
    return {
      success: true,
      message: 'Documento enviado para assinatura com sucesso',
      data: {
        documentId: result.open_id,
        status: result.status,
        signerEmail: result.signers[0]?.email,
        signUrl: result.signers[0]?.sign_url,
      },
    };
  }

  /**
   * GET /zapsign/status/:token - Busca status do documento
   * Requer autenticação
   */
  @Get('status/:token')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Param('token') token: string) {
    const result = await this.zapsignService.getDocumentStatus(token);
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * POST /zapsign/webhook - Recebe webhooks do ZapSign
   * Público (ZapSign precisa acessar sem autenticação)
   */
  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    await this.zapsignService.handleWebhook(payload);
    
    return { received: true };
  }
}
