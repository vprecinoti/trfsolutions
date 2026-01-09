import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateLeadData {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  genero?: string;
  conjuge?: string;
}

interface UpdateLeadData {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  genero?: string;
  conjuge?: string;
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  // Criar novo lead
  async create(userId: string, data: CreateLeadData) {
    return this.prisma.lead.create({
      data: {
        ...data,
        userId,
        status: 'NOVO',
      },
    });
  }

  // Buscar todos os leads (Admin vê todos, usuário vê apenas os seus)
  async findAll(userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    
    return this.prisma.lead.findMany({
      where: isAdmin ? {} : { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        formulario: {
          select: {
            id: true,
            completedAt: true,
            createdAt: true,
          },
        },
        // Incluir dados do usuário responsável (para Admin ver quem é o dono)
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Buscar lead por ID (Admin pode ver qualquer lead)
  async findOne(id: string, userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    
    const lead = await this.prisma.lead.findFirst({
      where: isAdmin ? { id } : { id, userId },
      include: {
        formulario: {
          select: {
            id: true,
            completedAt: true,
            createdAt: true,
          },
        },
        responses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    return lead;
  }

  // Atualizar status do lead (Admin pode atualizar qualquer lead)
  async updateStatus(id: string, userId: string, userRole: string, status: string) {
    const isAdmin = userRole === 'ADMIN';
    
    // Verificar se o lead existe e se o usuário tem permissão
    const lead = await this.prisma.lead.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        status: status as any,
      },
    });
  }

  // Atualizar lead (Admin pode atualizar qualquer lead)
  async update(id: string, userId: string, userRole: string, data: UpdateLeadData) {
    const isAdmin = userRole === 'ADMIN';
    
    // Verificar se o lead existe e se o usuário tem permissão
    const lead = await this.prisma.lead.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }

  // Deletar lead (Admin pode deletar qualquer lead)
  async remove(id: string, userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    
    // Verificar se o lead existe e se o usuário tem permissão
    const lead = await this.prisma.lead.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!lead) {
      throw new NotFoundException('Lead não encontrado');
    }

    return this.prisma.lead.delete({
      where: { id },
    });
  }
}

