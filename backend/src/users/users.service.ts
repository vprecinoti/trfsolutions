import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'BASIC' | 'PREMIUM';
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'BASIC' | 'PREMIUM';
  active?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: UserRole.BASIC, // Usuário sempre criado como BASIC
      },
    });
  }

  // Criar usuário com senha (para admin criar usuários)
  async createUser(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Verificar se email já existe
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Este email já está em uso');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: (dto.role as UserRole) || UserRole.BASIC,
      },
    });

    // Retornar sem a senha
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });

    if (!user) return null;

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });

    // Remover passwordHash de todos os usuários
    return users.map(({ passwordHash: _, ...user }) => user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se está alterando email, verificar se já existe
    if (dto.email && dto.email !== existingUser.email) {
      const emailInUse = await this.findByEmail(dto.email);
      if (emailInUse) {
        throw new ConflictException('Este email já está em uso');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
        ...(dto.role && { role: dto.role as UserRole }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  // Atualizar perfil do próprio usuário
  async updateProfile(id: string, dto: { name?: string; email?: string }): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se está alterando email, verificar se já existe
    if (dto.email && dto.email !== user.email) {
      const emailInUse = await this.findByEmail(dto.email);
      if (emailInUse) {
        throw new ConflictException('Este email já está em uso');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Alterar senha do próprio usuário
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new ForbiddenException('Senha atual incorreta');
    }

    // Validar nova senha (força)
    if (newPassword.length < 8) {
      throw new ConflictException('A nova senha deve ter pelo menos 8 caracteres');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new ConflictException('A nova senha deve conter letra maiúscula, minúscula e número');
    }

    // Atualizar senha e incrementar tokenVersion para invalidar todas as sessões
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { 
        passwordHash: newPasswordHash,
        tokenVersion: { increment: 1 }, // Invalida todos os tokens existentes
      },
    });

    // Deletar todos os refresh tokens do usuário
    await this.prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    return { message: 'Senha alterada com sucesso. Você foi deslogado de todos os dispositivos.' };
  }

  async toggleActive(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}

