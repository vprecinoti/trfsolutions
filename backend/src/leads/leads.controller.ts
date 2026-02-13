import { Controller, Get, Post, Param, Delete, Put, Body, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

interface CreateLeadDto {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  genero?: string;
  conjuge?: string;
}

interface UpdateLeadDto {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  cpf?: string;
  genero?: string;
  conjuge?: string;
}

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // GET /leads - Listar todos os leads (Admin vê todos, usuário vê apenas os seus)
  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.leadsService.findAll(user.id, user.role);
  }

  // POST /leads - Criar novo lead
  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createLeadDto: CreateLeadDto,
  ) {
    return this.leadsService.create(user.id, user.name, user.email, createLeadDto);
  }

  // GET /leads/:id - Buscar lead por ID
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.leadsService.findOne(id, user.id, user.role);
  }

  // PUT /leads/:id/status - Atualizar status do lead
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body('status') status: string,
  ) {
    return this.leadsService.updateStatus(id, user.id, user.role, status);
  }

  // PUT /leads/:id - Atualizar lead
  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, user.id, user.role, updateLeadDto);
  }

  // DELETE /leads/:id - Deletar lead
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.leadsService.remove(id, user.id, user.role);
  }
}

