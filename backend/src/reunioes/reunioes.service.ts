import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

interface CreateReuniaoData {
  titulo: string;
  descricao?: string;
  dataHora: string;
  duracao?: number;
  tipo?: 'CONSULTORIA' | 'ACOMPANHAMENTO' | 'APRESENTACAO' | 'OUTRO';
  leadId?: string;
}

interface UpdateReuniaoData {
  titulo?: string;
  descricao?: string;
  dataHora?: string;
  duracao?: number;
  tipo?: 'CONSULTORIA' | 'ACOMPANHAMENTO' | 'APRESENTACAO' | 'OUTRO';
  status?: 'AGENDADA' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA';
  leadId?: string;
}

@Injectable()
export class ReunioesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(userId: string, data: CreateReuniaoData) {
    const reuniao = await this.prisma.reuniao.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        dataHora: new Date(data.dataHora),
        duracao: data.duracao || 60,
        tipo: (data.tipo as any) || 'CONSULTORIA',
        leadId: data.leadId || null,
        userId,
      },
      include: {
        lead: { select: { id: true, nome: true, email: true } },
      },
    });

    // Enviar email de reunião agendada se tem cliente vinculado
    if (reuniao.lead?.email) {
      this.emailService.enviarReuniaoAgendada(
        reuniao.lead.email,
        reuniao.lead.nome,
        reuniao.dataHora,
        reuniao.titulo,
        reuniao.duracao,
        reuniao.tipo,
      ).catch((err) => {
        console.error('Falha ao enviar email de reunião agendada:', err);
      });
    }

    return reuniao;
  }

  async findAll(userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    return this.prisma.reuniao.findMany({
      where: isAdmin ? {} : { userId },
      orderBy: { dataHora: 'asc' },
      include: {
        lead: { select: { id: true, nome: true, email: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    const reuniao = await this.prisma.reuniao.findFirst({
      where: isAdmin ? { id } : { id, userId },
      include: {
        lead: { select: { id: true, nome: true, email: true } },
        user: { select: { id: true, name: true } },
      },
    });
    if (!reuniao) throw new NotFoundException('Reunião não encontrada');
    return reuniao;
  }

  async update(id: string, userId: string, userRole: string, data: UpdateReuniaoData) {
    const isAdmin = userRole === 'ADMIN';
    const reuniao = await this.prisma.reuniao.findFirst({
      where: isAdmin ? { id } : { id, userId },
      include: { lead: { select: { id: true, nome: true, email: true } } },
    });
    if (!reuniao) throw new NotFoundException('Reunião não encontrada');

    const dataAnterior = reuniao.dataHora;
    const mudouData = data.dataHora && new Date(data.dataHora).getTime() !== dataAnterior.getTime();

    const atualizada = await this.prisma.reuniao.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.dataHora && { dataHora: new Date(data.dataHora) }),
        ...(data.duracao && { duracao: data.duracao }),
        ...(data.tipo && { tipo: data.tipo as any }),
        ...(data.status && { status: data.status as any }),
        ...(data.leadId !== undefined && { leadId: data.leadId || null }),
      },
      include: {
        lead: { select: { id: true, nome: true, email: true } },
      },
    });

    // Enviar email de remarcação se a data mudou e tem cliente
    if (mudouData && atualizada.lead?.email) {
      this.emailService.enviarReuniaoRemarcada(
        atualizada.lead.email,
        atualizada.lead.nome,
        atualizada.titulo,
        dataAnterior,
        atualizada.dataHora,
      ).catch((err) => {
        console.error('Falha ao enviar email de reunião remarcada:', err);
      });
    }

    return atualizada;
  }

  async remove(id: string, userId: string, userRole: string) {
    const isAdmin = userRole === 'ADMIN';
    const reuniao = await this.prisma.reuniao.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });
    if (!reuniao) throw new NotFoundException('Reunião não encontrada');
    return this.prisma.reuniao.delete({ where: { id } });
  }
}
