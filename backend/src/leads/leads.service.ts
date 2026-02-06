import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

interface CreateLeadData {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  rg?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  conjuge?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  valorContrato?: number;
  formaPagamento?: string;
  statusContrato?: string;
}

interface UpdateLeadData {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  rg?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  conjuge?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  status?: 'NOVO' | 'FORMULARIO_PREENCHIDO' | 'PROPOSTA_ENVIADA' | 'PROPOSTA_ACEITA' | 'PAGAMENTO_PENDENTE' | 'ATIVO' | 'INATIVO' | 'CANCELADO';
  valorContrato?: number;
  formaPagamento?: string;
  statusContrato?: string;
}

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Criar novo lead
  async create(userId: string, data: CreateLeadData) {
    const lead = await this.prisma.lead.create({
      data: {
        ...data,
        userId,
        status: 'NOVO',
      },
    });

    // Enviar email de boas-vindas (async, não bloqueia)
    if (lead.email) {
      this.emailService.enviarBoasVindas(lead.email, lead.nome).catch((err) => {
        console.error('Falha ao enviar email de boas-vindas:', err);
      });
    }

    return lead;
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

