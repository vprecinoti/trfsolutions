import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto, FormularioStatus } from './dto/update-formulario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('formularios')
@UseGuards(JwtAuthGuard)
export class FormulariosController {
  constructor(private readonly formulariosService: FormulariosService) {}

  // POST /formularios - Criar novo formulário
  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateFormularioDto,
  ) {
    return this.formulariosService.create(user.id, createDto);
  }

  // GET /formularios - Listar formulários do usuário
  @Get()
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('status') status?: FormularioStatus,
  ) {
    return this.formulariosService.findAllByUser(user.id, status);
  }

  // GET /formularios/stats - Estatísticas
  @Get('stats')
  getStats(@CurrentUser() user: CurrentUserData) {
    return this.formulariosService.getStats(user.id);
  }

  // GET /formularios/:id - Buscar formulário
  @Get(':id')
  findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.formulariosService.findOne(id, user.id);
  }

  // PUT /formularios/:id - Atualizar formulário (auto-save)
  @Put(':id')
  update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateDto: UpdateFormularioDto,
  ) {
    return this.formulariosService.update(id, user.id, updateDto);
  }

  // POST /formularios/:id/complete - Finalizar e criar lead
  @Post(':id/complete')
  complete(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.formulariosService.complete(id, user.id);
  }

  // DELETE /formularios/:id - Excluir formulário
  @Delete(':id')
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.formulariosService.remove(id, user.id);
  }
}

