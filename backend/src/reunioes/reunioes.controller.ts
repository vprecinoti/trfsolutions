import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReunioesService } from './reunioes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('reunioes')
@UseGuards(JwtAuthGuard)
export class ReunioesController {
  constructor(private readonly reunioesService: ReunioesService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.reunioesService.findAll(user.id, user.role);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.reunioesService.create(user.id, user.name, user.email, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.reunioesService.findOne(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: string, @CurrentUser() user: CurrentUserData, @Body() body: any) {
    return this.reunioesService.update(id, user.id, user.role, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.reunioesService.remove(id, user.id, user.role);
  }
}
