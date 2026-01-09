import { api } from "../api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BASIC" | "PREMIUM";
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    leads: number;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "BASIC" | "PREMIUM";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: "ADMIN" | "BASIC" | "PREMIUM";
  active?: boolean;
}

// Listar todos os usuários (apenas admin)
export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

// Buscar usuário por ID
export async function getUser(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

// Criar novo usuário
export async function createUser(data: CreateUserDto): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response.data;
}

// Atualizar usuário
export async function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

// Ativar/Desativar usuário
export async function toggleUserActive(id: string): Promise<User> {
  const response = await api.put<User>(`/users/${id}/toggle-active`);
  return response.data;
}

// Deletar usuário
export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

// ============================================
// FUNÇÕES PARA O PRÓPRIO USUÁRIO (Minha Conta)
// ============================================

// Buscar dados do usuário logado
export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

// Atualizar perfil do usuário logado
export async function updateProfile(data: { name?: string; email?: string }): Promise<User> {
  const response = await api.put<User>("/users/me", data);
  return response.data;
}

// Alterar senha do usuário logado
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>("/users/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
}
