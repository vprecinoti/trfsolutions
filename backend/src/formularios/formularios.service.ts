import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto, FormularioStatus } from './dto/update-formulario.dto';

@Injectable()
export class FormulariosService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Criar novo formulário (rascunho)
  async create(userId: string, dto: CreateFormularioDto) {
    return this.prisma.formulario.create({
      data: {
        userId,
        clienteNome: dto.clienteNome,
        clienteEmail: dto.clienteEmail,
        clienteTelefone: dto.clienteTelefone,
        objetivosSelecionados: dto.objetivosSelecionados || [],
        respostas: dto.respostas || {},
        stepAtual: dto.stepAtual || 0,
        progresso: dto.progresso || 0,
        status: 'RASCUNHO',
      },
    });
  }

  // Listar formulários do usuário
  async findAllByUser(userId: string, status?: FormularioStatus) {
    return this.prisma.formulario.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        lead: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  // Buscar formulário por ID
  async findOne(id: string, userId: string) {
    const formulario = await this.prisma.formulario.findUnique({
      where: { id },
      include: {
        lead: true,
      },
    });

    if (!formulario) {
      throw new NotFoundException('Formulário não encontrado');
    }

    if (formulario.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este formulário');
    }

    return formulario;
  }

  // Atualizar formulário (auto-save)
  async update(id: string, userId: string, dto: UpdateFormularioDto) {
    // Verificar se existe e pertence ao usuário
    await this.findOne(id, userId);

    const updateData: any = {
      ...dto,
    };

    // Se está completando, adicionar data de conclusão
    if (dto.status === FormularioStatus.COMPLETO) {
      updateData.completedAt = new Date();
    }

    return this.prisma.formulario.update({
      where: { id },
      data: updateData,
    });
  }

  // Excluir formulário
  async remove(id: string, userId: string) {
    // Verificar se existe e pertence ao usuário
    await this.findOne(id, userId);

    return this.prisma.formulario.delete({
      where: { id },
    });
  }

  // Completar formulário e criar/atualizar lead
  async complete(id: string, userId: string, dadosContrato?: {
    cpf?: string;
    rg?: string;
    endereco?: string;
    bairro?: string;
    cep?: string;
    cidade?: string;
    estado?: string;
    estadoCivil?: string;
    profissao?: string;
    valorContrato?: number;
    formaPagamento?: string;
  }) {
    const formulario = await this.findOne(id, userId);

    if (!formulario.clienteNome || !formulario.clienteEmail) {
      throw new ForbiddenException('Preencha os dados do cliente para finalizar');
    }

    let lead;

    // Se já existe um lead vinculado, atualiza ao invés de criar
    if (formulario.leadId) {
      lead = await this.prisma.lead.update({
        where: { id: formulario.leadId },
        data: {
          nome: formulario.clienteNome,
          email: formulario.clienteEmail,
          telefone: formulario.clienteTelefone,
          // Dados do contrato
          cpf: dadosContrato?.cpf,
          rg: dadosContrato?.rg,
          endereco: dadosContrato?.endereco,
          bairro: dadosContrato?.bairro,
          cep: dadosContrato?.cep,
          cidade: dadosContrato?.cidade,
          estado: dadosContrato?.estado,
          estadoCivil: dadosContrato?.estadoCivil,
          profissao: dadosContrato?.profissao,
          valorContrato: dadosContrato?.valorContrato,
          formaPagamento: dadosContrato?.formaPagamento,
          statusContrato: 'enviado',
          contratoEnviadoEm: new Date(),
          status: 'PROPOSTA_ENVIADA',
          resultadoJson: {
            objetivos: formulario.objetivosSelecionados,
            respostas: formulario.respostas,
          },
        },
      });
    } else {
      // Criar novo lead a partir do formulário
      lead = await this.prisma.lead.create({
        data: {
          userId,
          nome: formulario.clienteNome,
          email: formulario.clienteEmail,
          telefone: formulario.clienteTelefone,
          // Dados do contrato
          cpf: dadosContrato?.cpf,
          rg: dadosContrato?.rg,
          endereco: dadosContrato?.endereco,
          bairro: dadosContrato?.bairro,
          cep: dadosContrato?.cep,
          cidade: dadosContrato?.cidade,
          estado: dadosContrato?.estado,
          estadoCivil: dadosContrato?.estadoCivil,
          profissao: dadosContrato?.profissao,
          valorContrato: dadosContrato?.valorContrato,
          formaPagamento: dadosContrato?.formaPagamento,
          statusContrato: dadosContrato ? 'enviado' : 'pendente',
          contratoEnviadoEm: dadosContrato ? new Date() : undefined,
          status: dadosContrato ? 'PROPOSTA_ENVIADA' : 'FORMULARIO_PREENCHIDO',
          resultadoJson: {
            objetivos: formulario.objetivosSelecionados,
            respostas: formulario.respostas,
          },
        },
      });
    }

    // Atualizar formulário como completo e vincular ao lead
    const formularioAtualizado = await this.prisma.formulario.update({
      where: { id },
      data: {
        status: 'COMPLETO',
        completedAt: new Date(),
        leadId: lead.id,
        progresso: 100,
      },
      include: {
        lead: true,
      },
    });

    // Enviar email de formulário preenchido
    if (lead.email) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
      this.emailService.enviarFormularioPreenchido(
        lead.email,
        lead.nome,
        user?.name || 'TRF Solutions',
      ).catch((err) => {
        console.error('Falha ao enviar email de formulário preenchido:', err);
      });
    }

    return formularioAtualizado;
  }

  // Estatísticas
  async getStats(userId: string) {
    const [total, rascunhos, completos, abandonados] = await Promise.all([
      this.prisma.formulario.count({ where: { userId } }),
      this.prisma.formulario.count({ where: { userId, status: 'RASCUNHO' } }),
      this.prisma.formulario.count({ where: { userId, status: 'COMPLETO' } }),
      this.prisma.formulario.count({ where: { userId, status: 'ABANDONADO' } }),
    ]);

    return {
      total,
      rascunhos,
      completos,
      abandonados,
    };
  }
}

