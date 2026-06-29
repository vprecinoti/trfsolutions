import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import { ErrorLogsService } from './error-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

const ADMIN_EMAIL = 'admin@thiagoplatform.com';

interface LogErrorBody {
  formularioId?: string;
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  payload?: any;
  url?: string;
}

@Controller('error-logs')
@UseGuards(JwtAuthGuard)
export class ErrorLogsController {
  constructor(private readonly errorLogsService: ErrorLogsService) {}

  // POST /error-logs - Registrar erro do frontend (usado pelo cliente)
  @Post()
  @HttpCode(204)
  async logError(
    @CurrentUser() user: CurrentUserData,
    @Body() body: LogErrorBody,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress;

    await this.errorLogsService.logError({
      userId: user.id,
      formularioId: body.formularioId,
      errorType: body.errorType,
      errorMessage: body.errorMessage,
      errorStack: body.errorStack,
      payload: body.payload,
      url: body.url,
      userAgent,
      ipAddress,
    });
    return;
  }

  // GET /error-logs/mine - Listar erros do próprio usuário
  @Get('mine')
  listMine(
    @CurrentUser() user: CurrentUserData,
    @Query('formularioId') formularioId?: string,
  ) {
    return this.errorLogsService.listMyErrors(user.id, formularioId);
  }

  // GET /error-logs/admin/all - Admin: listar todos os erros
  @Get('admin/all')
  listAll(
    @CurrentUser() user: CurrentUserData,
    @Query('resolved') resolved?: string,
    @Query('errorType') errorType?: string,
    @Query('userId') userId?: string,
  ) {
    if (user.email !== ADMIN_EMAIL) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.errorLogsService.listAllErrors({
      resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined,
      errorType,
      userId,
    });
  }

  // GET /error-logs/admin/:id - Admin: buscar erro específico (com payload)
  @Get('admin/:id')
  getOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    if (user.email !== ADMIN_EMAIL) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.errorLogsService.getError(id);
  }

  // POST /error-logs/admin/:id/resolve - Admin: marca como resolvido
  @Post('admin/:id/resolve')
  resolve(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    if (user.email !== ADMIN_EMAIL) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.errorLogsService.markResolved(id);
  }
}
