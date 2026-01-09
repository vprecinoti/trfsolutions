import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SystemStats, ActivityItem, SystemAlert } from './admin.types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats(): Promise<SystemStats> {
    // Contar totais
    const [totalUsers, totalClients, totalFormularios, totalLeads] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.formulario.count(),
      this.prisma.lead.count(), // Assumindo que leads são os resultados dos formulários
    ]);

    // Atividade recente
    const recentActivity = await this.getRecentActivity();

    // Alertas do sistema
    const systemAlerts = await this.getSystemAlerts();

    // Uso do banco (estimativa)
    const databaseUsage = await this.getDatabaseUsage();

    return {
      totalUsers,
      totalClients: totalClients,
      totalFormularios,
      totalLeads,
      recentActivity,
      systemAlerts,
      databaseUsage,
    };
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];

    // Últimos usuários criados
    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_created',
        description: `Novo usuário cadastrado: ${user.name}`,
        timestamp: user.createdAt.toISOString(),
        userEmail: user.email,
      });
    });

    // Últimos clientes/leads criados
    const recentLeads = await this.prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    recentLeads.forEach(lead => {
      activities.push({
        id: `lead_${lead.id}`,
        type: 'client_created',
        description: `Novo cliente cadastrado: ${lead.nome}`,
        timestamp: lead.createdAt.toISOString(),
        userEmail: lead.email,
      });
    });

    // Últimos formulários criados
    const recentFormularios = await this.prisma.formulario.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, user: { select: { name: true, email: true } } },
    });

    recentFormularios.forEach(form => {
      activities.push({
        id: `form_${form.id}`,
        type: 'formulario_created',
        description: `Novo formulário iniciado por ${form.user.name}`,
        timestamp: form.createdAt.toISOString(),
        userEmail: form.user.email,
      });
    });

    // Últimos logins (sucessos e falhas)
    const recentLogins = await this.prisma.loginLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, success: true, createdAt: true, failReason: true },
    });

    recentLogins.forEach(login => {
      activities.push({
        id: `login_${login.id}`,
        type: login.success ? 'login_success' : 'login_failed',
        description: login.success 
          ? `Login realizado com sucesso`
          : `Falha no login: ${login.failReason || 'Credenciais inválidas'}`,
        timestamp: login.createdAt.toISOString(),
        userEmail: login.email,
      });
    });

    // Ordenar por timestamp (mais recente primeiro)
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  async getSystemAlerts(): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    // Verificar usuários bloqueados
    const lockedUsers = await this.prisma.user.count({
      where: {
        lockedUntil: {
          gt: new Date(),
        },
      },
    });

    if (lockedUsers > 0) {
      alerts.push({
        id: 'locked_users',
        type: 'warning',
        title: 'Usuários Bloqueados',
        description: `${lockedUsers} usuário(s) estão temporariamente bloqueados`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    // Verificar tentativas de login falhadas recentes
    const recentFailedLogins = await this.prisma.loginLog.count({
      where: {
        success: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        },
      },
    });

    if (recentFailedLogins > 10) {
      alerts.push({
        id: 'failed_logins',
        type: 'warning',
        title: 'Muitas Tentativas de Login Falhadas',
        description: `${recentFailedLogins} tentativas falhadas nas últimas 24h`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    // Verificar uso do banco (simulado)
    const databaseUsage = await this.getDatabaseUsage();
    if (databaseUsage.percentage > 80) {
      alerts.push({
        id: 'database_usage',
        type: 'error',
        title: 'Uso Alto do Banco de Dados',
        description: `Banco usando ${databaseUsage.percentage.toFixed(1)}% da capacidade`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    } else if (databaseUsage.percentage > 60) {
      alerts.push({
        id: 'database_usage_warning',
        type: 'warning',
        title: 'Uso Moderado do Banco',
        description: `Banco usando ${databaseUsage.percentage.toFixed(1)}% da capacidade`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    return alerts;
  }

  private async getDatabaseUsage() {
    // Estimativa baseada no número de registros
    // Em produção, você poderia usar queries específicas do PostgreSQL
    const [userCount, leadCount, formCount, logCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.formulario.count(),
      this.prisma.loginLog.count(),
    ]);

    // Estimativa: cada registro ocupa ~5KB em média
    const estimatedUsedKB = (userCount + leadCount + formCount + logCount) * 5;
    const estimatedUsedMB = Math.round(estimatedUsedKB / 1024);
    
    // Neon Free tier: 3GB = 3072MB
    const totalMB = 3072;
    const percentage = (estimatedUsedMB / totalMB) * 100;

    return {
      used: estimatedUsedMB,
      total: 3, // 3GB
      percentage: Math.min(percentage, 100),
    };
  }
}