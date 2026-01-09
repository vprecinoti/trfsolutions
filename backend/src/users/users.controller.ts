import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'BASIC' | 'PREMIUM';
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'BASIC' | 'PREMIUM';
  active?: boolean;
}

interface UpdateProfileDto {
  name?: string;
  email?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Verificar se é admin
  private checkAdmin(user: CurrentUserData) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem acessar esta funcionalidade');
    }
  }

  // GET /users/me - Buscar dados do usuário logado
  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserData) {
    return this.usersService.findById(user.id);
  }

  // PUT /users/me - Atualizar perfil do usuário logado
  @Put('me')
  async updateMe(
    @CurrentUser() user: CurrentUserData,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  // PUT /users/me/password - Alterar senha do usuário logado
  @Put('me/password')
  async changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
  }

  // GET /users - Listar todos os usuários (apenas admin)
  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    this.checkAdmin(user);
    return this.usersService.findAll();
  }

  // GET /users/:id - Buscar usuário por ID (apenas admin)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.checkAdmin(user);
    return this.usersService.findById(id);
  }

  // POST /users - Criar novo usuário (apenas admin)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.checkAdmin(user);
    return this.usersService.createUser(createUserDto);
  }

  // PUT /users/:id - Atualizar usuário (apenas admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.checkAdmin(user);
    return this.usersService.update(id, updateUserDto);
  }

  // PUT /users/:id/toggle-active - Ativar/Desativar usuário (apenas admin)
  @Put(':id/toggle-active')
  async toggleActive(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.checkAdmin(user);
    
    // Não pode desativar a si mesmo
    if (id === user.id) {
      throw new ForbiddenException('Você não pode desativar sua própria conta');
    }
    
    return this.usersService.toggleActive(id);
  }

  // DELETE /users/:id - Deletar usuário (apenas admin)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.checkAdmin(user);
    
    // Não pode deletar a si mesmo
    if (id === user.id) {
      throw new ForbiddenException('Você não pode deletar sua própria conta');
    }
    
    return this.usersService.remove(id);
  }
}
