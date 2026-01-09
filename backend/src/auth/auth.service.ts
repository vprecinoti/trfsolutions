import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  private readonly maxLoginAttempts: number;
  private readonly lockTimeMinutes: number;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.maxLoginAttempts = parseInt(this.configService.get('MAX_LOGIN_ATTEMPTS') || '5');
    this.lockTimeMinutes = parseInt(this.configService.get('LOCK_TIME_MINUTES') || '15');
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Este email já está em uso');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
    });

    return {
      message: 'Conta criada com sucesso! Aguarde a aprovação do administrador para acessar recursos premium.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // Log de tentativa (mesmo se usuário não existir)
    const logLogin = async (success: boolean, failReason?: string) => {
      await this.prisma.loginLog.create({
        data: {
          email: loginDto.email,
          success,
          ipAddress,
          userAgent,
          failReason,
          userId: user?.id,
        },
      });
    };

    // Usuário não encontrado
    if (!user) {
      await logLogin(false, 'user_not_found');
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Verificar se conta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      await logLogin(false, 'account_locked');
      throw new ForbiddenException(
        `Conta bloqueada por tentativas excessivas. Tente novamente em ${minutesLeft} minutos.`
      );
    }

    // Verificar se usuário está ativo
    if (!user.active) {
      await logLogin(false, 'account_inactive');
      throw new UnauthorizedException('Conta desativada. Entre em contato com o administrador.');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      // Incrementar tentativas falhas
      const newFailedAttempts = user.failedLoginAttempts + 1;
      const shouldLock = newFailedAttempts >= this.maxLoginAttempts;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil: shouldLock 
            ? new Date(Date.now() + this.lockTimeMinutes * 60 * 1000)
            : null,
        },
      });

      await logLogin(false, 'invalid_password');

      if (shouldLock) {
        throw new ForbiddenException(
          `Conta bloqueada por ${this.lockTimeMinutes} minutos devido a tentativas excessivas.`
        );
      }

      const attemptsLeft = this.maxLoginAttempts - newFailedAttempts;
      throw new UnauthorizedException(
        `Email ou senha inválidos. ${attemptsLeft} tentativa(s) restante(s).`
      );
    }

    // Login bem sucedido - resetar tentativas
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await logLogin(true);

    // Gerar tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  private async generateTokens(
    user: { id: string; email: string; role: string; tokenVersion: number },
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    // Access token (curta duração)
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
    });

    // Refresh token (longa duração)
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
    const expiresAt = new Date();
    
    // Parse do tempo de expiração
    const match = refreshExpiresIn.match(/^(\d+)([dhm])$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      if (unit === 'd') expiresAt.setDate(expiresAt.getDate() + value);
      else if (unit === 'h') expiresAt.setHours(expiresAt.getHours() + value);
      else if (unit === 'm') expiresAt.setMinutes(expiresAt.getMinutes() + value);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 dias
    }

    // Salvar refresh token no banco
    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return {
      access_token,
      refresh_token: refreshTokenValue,
    };
  }

  async refreshTokens(refreshToken: string, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Buscar refresh token no banco
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Verificar se expirou
    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token expirado. Faça login novamente.');
    }

    // Verificar se usuário ainda está ativo
    if (!storedToken.user.active) {
      throw new UnauthorizedException('Conta desativada');
    }

    // Deletar o refresh token usado (rotação de token)
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Gerar novos tokens
    const tokens = await this.generateTokens(storedToken.user, ipAddress, userAgent);

    return {
      ...tokens,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role,
      },
    };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    // Deletar o refresh token
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logout realizado com sucesso' };
  }

  async logoutAllDevices(userId: string): Promise<{ message: string }> {
    // Incrementar tokenVersion para invalidar todos os access tokens
    await this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    // Deletar todos os refresh tokens do usuário
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Logout realizado em todos os dispositivos' };
  }

  // Chamado quando usuário troca a senha
  async invalidateAllSessions(userId: string): Promise<void> {
    await this.logoutAllDevices(userId);
  }

  // Desbloquear conta (para admin)
  async unlockAccount(userId: string): Promise<{ message: string }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    return { message: 'Conta desbloqueada com sucesso' };
  }

  // Buscar logs de login (para admin)
  async getLoginLogs(filters?: {
    userId?: string;
    email?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.email) where.email = { contains: filters.email, mode: 'insensitive' };
    if (filters?.success !== undefined) where.success = filters.success;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.loginLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Limpar tokens expirados (pode ser chamado por um cron job)
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }
}
