import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface LogErrorInput {
  userId?: string;
  formularioId?: string;
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  payload?: any;
  url?: string;
  userAgent?: string;
  ipAddress?: string;
}

@Injectable()
export class ErrorLogsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra um erro do frontend. Nunca lança exceção (best-effort).
   */
  async logError(input: LogErrorInput) {
    try {
      return await this.prisma.errorLog.create({
        data: {
          userId: input.userId,
          formularioId: input.formularioId,
          errorType: input.errorType,
          errorMessage: input.errorMessage,
          errorStack: input.errorStack,
          payload: input.payload,
          url: input.url,
          userAgent: input.userAgent,
          ipAddress: input.ipAddress,
        },
      });
    } catch (err) {
      console.error('Falha ao registrar error log:', err);
      return null;
    }
  }

  /**
   * Lista erros do próprio usuário (formulários que ele criou)
   */
  async listMyErrors(userId: string, formularioId?: string) {
    return this.prisma.errorLog.findMany({
      where: {
        userId,
        ...(formularioId && { formularioId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Admin: lista TODOS os erros
   */
  async listAllErrors(filters?: {
    resolved?: boolean;
    errorType?: string;
    userId?: string;
  }) {
    return this.prisma.errorLog.findMany({
      where: {
        ...(filters?.resolved !== undefined && { resolved: filters.resolved }),
        ...(filters?.errorType && { errorType: filters.errorType }),
        ...(filters?.userId && { userId: filters.userId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  /**
   * Admin: marca erro como resolvido
   */
  async markResolved(id: string) {
    return this.prisma.errorLog.update({
      where: { id },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }

  /**
   * Admin: buscar erro específico com payload completo
   */
  async getError(id: string) {
    return this.prisma.errorLog.findUnique({ where: { id } });
  }
}
