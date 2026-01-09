import { Controller, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import type { SystemStats, ActivityItem, SystemAlert } from './admin.types';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('system-stats')
  async getSystemStats(@CurrentUser() user: CurrentUserData): Promise<SystemStats> {
    // Verificar se é o super admin específico
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getSystemStats();
  }

  @Get('recent-activity')
  async getRecentActivity(@CurrentUser() user: CurrentUserData): Promise<ActivityItem[]> {
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getRecentActivity();
  }

  @Get('system-alerts')
  async getSystemAlerts(@CurrentUser() user: CurrentUserData): Promise<SystemAlert[]> {
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getSystemAlerts();
  }
}