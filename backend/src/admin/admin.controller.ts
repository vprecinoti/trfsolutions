import { Controller, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('system-stats')
  async getSystemStats(@CurrentUser() user: CurrentUserData) {
    // Verificar se é o super admin específico
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getSystemStats();
  }

  @Get('recent-activity')
  async getRecentActivity(@CurrentUser() user: CurrentUserData) {
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getRecentActivity();
  }

  @Get('system-alerts')
  async getSystemAlerts(@CurrentUser() user: CurrentUserData) {
    if (user.email !== 'admin@thiagoplatform.com') {
      throw new ForbiddenException('Acesso negado. Apenas o super admin pode acessar.');
    }

    return this.adminService.getSystemAlerts();
  }
}