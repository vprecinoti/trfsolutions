"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft, Users, Search, Plus, Edit2, Trash2, Loader2,
  UserCheck, UserX, Mail, X, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import {
  getUsers, createUser, updateUser, toggleUserActive, deleteUser,
  User, CreateUserDto, UpdateUserDto
} from "@/lib/api/users";

export default function UsuariosPage() {
  const { user: currentUser } = useAuthStore();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("TODOS");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "BASIC" as "ADMIN" | "BASIC" | "PREMIUM",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN": return "Administrador";
      case "BASIC": return "Básico";
      case "PREMIUM": return "Premium";
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "BASIC": return "bg-white/10 text-white/60 border-white/20";
      case "PREMIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "TODOS" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({ name: "", email: "", password: "", role: "BASIC" });
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (modalMode === "create" && !formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      if (modalMode === "create") {
        await createUser(formData as CreateUserDto);
      } else if (selectedUser) {
        const updateData: UpdateUserDto = { name: formData.name, email: formData.email, role: formData.role };
        await updateUser(selectedUser.id, updateData);
      }
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      console.error("Erro ao salvar usuário:", err);
      alert(err.response?.data?.message || "Erro ao salvar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (user.id === currentUser?.id) {
      alert("Você não pode desativar sua própria conta");
      return;
    }
    const action = user.active ? "desativar" : "ativar";
    if (!confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) return;
    try {
      await toggleUserActive(user.id);
      loadUsers();
    } catch (err: any) {
      console.error("Erro ao alterar status:", err);
      alert(err.response?.data?.message || "Erro ao alterar status");
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUser?.id) {
      alert("Você não pode deletar sua própria conta");
      return;
    }
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteUser(user.id);
      loadUsers();
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      alert(err.response?.data?.message || "Erro ao excluir usuário");
    }
  };

  if (currentUser?.role !== "ADMIN") return null;

  return (
    <>
      <Header title="Gerenciar Usuários" subtitle="Visualize, crie e gerencie os usuários da plataforma" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Link href="/dashboard/configuracoes" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para configurações
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input type="text" placeholder="Buscar usuário..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-11 pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3A8DFF]/50 transition-all" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:outline-none focus:border-[#3A8DFF]/50 transition-all cursor-pointer">
              <option value="TODOS" className="bg-[#0a0f1a]">Todos os tipos</option>
              <option value="ADMIN" className="bg-[#0a0f1a]">Administrador</option>
              <option value="BASIC" className="bg-[#0a0f1a]">Básico</option>
              <option value="PREMIUM" className="bg-[#0a0f1a]">Premium</option>
            </select>
          </div>
          <button onClick={openCreateModal} className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>

        {loading ? (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#3A8DFF] animate-spin mx-auto mb-4" />
            <p className="text-white/50">Carregando usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] p-16 text-center">
            <div className="w-20 h-20 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm || roleFilter !== "TODOS" ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
            </h3>
            <p className="text-white/50 mb-6">
              {searchTerm || roleFilter !== "TODOS" ? "Tente buscar com outros termos ou altere o filtro" : "Adicione o primeiro usuário para começar"}
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.08] text-xs font-semibold text-white/40 uppercase tracking-wider">
              <div className="col-span-4">Usuário</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Clientes</div>
              <div className="col-span-2">Ações</div>
            </div>
            <div className="divide-y divide-white/[0.08]">
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors">
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${user.role === "ADMIN" ? "bg-purple-500/20" : "bg-[#3A8DFF]/20"}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user.name}
                          {user.id === currentUser?.id && <span className="ml-2 text-xs text-[#3A8DFF]">(você)</span>}
                        </p>
                        <p className="text-sm text-white/50 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.active ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      {user.active ? <><UserCheck className="w-3 h-3" />Ativo</> : <><UserX className="w-3 h-3" />Inativo</>}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-white/60">{user._count?.leads || 0} cliente{(user._count?.leads || 0) !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <button onClick={() => openEditModal(user)} className="p-2 text-white/40 hover:text-[#3A8DFF] hover:bg-[#3A8DFF]/10 rounded-lg transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleActive(user)} disabled={user.id === currentUser?.id}
                      className={`p-2 rounded-lg transition-colors ${user.id === currentUser?.id ? "text-white/20 cursor-not-allowed" : user.active ? "text-white/40 hover:text-amber-400 hover:bg-amber-500/10" : "text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10"}`}
                      title={user.active ? "Desativar" : "Ativar"}>
                      {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(user)} disabled={user.id === currentUser?.id}
                      className={`p-2 rounded-lg transition-colors ${user.id === currentUser?.id ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"}`} title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.08]">
              <p className="text-sm text-white/50">{filteredUsers.length} usuário{filteredUsers.length !== 1 ? "s" : ""} encontrado{filteredUsers.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0f1a] rounded-[24px] w-full max-w-md border border-white/[0.1]">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">{modalMode === "create" ? "Novo Usuário" : "Editar Usuário"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Nome completo *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Digite o nome"
                  className={`w-full h-11 px-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${errors.name ? "border-red-500/50" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`} />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@exemplo.com"
                  className={`w-full h-11 px-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${errors.email ? "border-red-500/50" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`} />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Senha *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Mínimo 6 caracteres"
                      className={`w-full h-11 px-4 pr-11 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${errors.password ? "border-red-500/50" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Tipo de usuário</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full h-11 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#3A8DFF]/50 transition-all cursor-pointer">
                  <option value="BASIC" className="bg-[#0a0f1a]">Básico</option>
                  <option value="PREMIUM" className="bg-[#0a0f1a]">Premium</option>
                  <option value="ADMIN" className="bg-[#0a0f1a]">Administrador</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="h-11 px-5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/70 hover:bg-white/[0.1] transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === "create" ? "Criar Usuário" : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
