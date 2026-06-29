import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto, FormularioStatus, CompleteFormularioDto } from './dto/update-formulario.dto';
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
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress;
    const source = (req.headers['x-save-source'] as string) || 'auto-save';

    return this.formulariosService.update(id, user.id, updateDto, {
      source,
      userAgent,
      ipAddress,
    });
  }

  // POST /formularios/:id/beacon - Endpoint para Beacon API (save garantido ao fechar aba)
  // Usa POST com body porque sendBeacon só aceita POST. Sem retorno significativo.
  @Post(':id/beacon')
  @HttpCode(204)
  async beacon(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateDto: UpdateFormularioDto,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress;

    try {
      await this.formulariosService.update(id, user.id, updateDto, {
        source: 'beacon',
        userAgent,
        ipAddress,
      });
    } catch (err) {
      console.error('Beacon save failed:', err);
    }
    return;
  }

  // GET /formularios/:id/snapshots - Listar snapshots de um formulário
  @Get(':id/snapshots')
  getSnapshots(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.formulariosService.getSnapshots(id, user.id);
  }

  // GET /formularios/snapshots/:snapshotId - Buscar conteúdo de um snapshot
  @Get('snapshots/:snapshotId')
  getSnapshot(
    @CurrentUser() user: CurrentUserData,
    @Param('snapshotId') snapshotId: string,
  ) {
    return this.formulariosService.getSnapshot(snapshotId, user.id);
  }

  // POST /formularios/snapshots/:snapshotId/restore - Restaurar formulário de um snapshot
  @Post('snapshots/:snapshotId/restore')
  restoreSnapshot(
    @CurrentUser() user: CurrentUserData,
    @Param('snapshotId') snapshotId: string,
  ) {
    return this.formulariosService.restoreSnapshot(snapshotId, user.id);
  }

  // POST /formularios/:id/complete - Finalizar e criar lead
  @Post(':id/complete')
  complete(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dadosContrato?: CompleteFormularioDto,
  ) {
    return this.formulariosService.complete(id, user.id, dadosContrato);
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
