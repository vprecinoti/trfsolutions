import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SystemStats, ActivityItem, SystemAlert } from './admin.types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats(): Promise<SystemStats> {
    const [totalUsers, totalClients, totalFormularios, totalLeads] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.formulario.count(),
      this.prisma.lead.count(),
    ]);

    const recentActivity = await this.getRecentActivity();
    const systemAlerts = await this.getSystemAlerts();
    const databaseUsage = await this.getDatabaseUsage();

    return {
      totalUsers,
      totalClients,
      totalFormularios,
      totalLeads,
      recentActivity,
      systemAlerts,
      databaseUsage,
    };
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_created',
        description: `Novo usuário: ${user.name}`,
        timestamp: user.createdAt.toISOString(),
        userEmail: user.email,
      });
    });

    const recentLeads = await this.prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    recentLeads.forEach(lead => {
      activities.push({
        id: `lead_${lead.id}`,
        type: 'client_created',
        description: `Novo cliente: ${lead.nome}`,
        timestamp: lead.createdAt.toISOString(),
        userEmail: lead.email,
      });
    });

    const recentFormularios = await this.prisma.formulario.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, user: { select: { name: true, email: true } } },
    });

    recentFormularios.forEach(form => {
      activities.push({
        id: `form_${form.id}`,
        type: 'formulario_created',
        description: `Formulário por ${form.user.name}`,
        timestamp: form.createdAt.toISOString(),
        userEmail: form.user.email,
      });
    });

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
          ? `Login: ${login.email}`
          : `Falha login: ${login.failReason || 'Credenciais inválidas'}`,
        timestamp: login.createdAt.toISOString(),
        userEmail: login.email,
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  async getSystemAlerts(): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    const lockedUsers = await this.prisma.user.count({
      where: { lockedUntil: { gt: new Date() } },
    });

    if (lockedUsers > 0) {
      alerts.push({
        id: 'locked_users',
        type: 'warning',
        title: 'Usuários Bloqueados',
        description: `${lockedUsers} usuário(s) bloqueados`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    const recentFailedLogins = await this.prisma.loginLog.count({
      where: {
        success: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (recentFailedLogins > 10) {
      alerts.push({
        id: 'failed_logins',
        type: 'warning',
        title: 'Tentativas de Login Falhadas',
        description: `${recentFailedLogins} falhas nas últimas 24h`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    const databaseUsage = await this.getDatabaseUsage();
    if (databaseUsage.percentage > 80) {
      alerts.push({
        id: 'database_usage',
        type: 'error',
        title: 'Uso Alto do Banco',
        description: `${databaseUsage.percentage.toFixed(1)}% utilizado`,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }

    return alerts;
  }

  private async getDatabaseUsage() {
    const [userCount, leadCount, formCount, logCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.formulario.count(),
      this.prisma.loginLog.count(),
    ]);

    const estimatedUsedKB = (userCount + leadCount + formCount + logCount) * 5;
    const estimatedUsedMB = Math.round(estimatedUsedKB / 1024);
    const totalMB = 3072;
    const percentage = (estimatedUsedMB / totalMB) * 100;

    return {
      used: estimatedUsedMB,
      total: 3,
      percentage: Math.min(percentage, 100),
    };
  }
}