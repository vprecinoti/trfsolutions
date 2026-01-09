"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import {
  User, Lock, Loader2, Save, Eye, EyeOff,
  CheckCircle, Shield, LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getMe, updateProfile, changePassword } from "@/lib/api/users";

export default function MinhaContaPage() {
  const { user: currentUser, setUser, logout } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getMe();
      setProfileData({
        name: userData.name,
        email: userData.email,
      });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN": return "Administrador";
      case "BASIC": return "Básico";
      case "PREMIUM": return "Premium";
      default: return role;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "BASIC": return "bg-white/10 text-white/60 border-white/20";
      case "PREMIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!profileData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Senha atual é obrigatória";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "Nova senha é obrigatória";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirmação é obrigatória";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    try {
      setSavingProfile(true);
      const updatedUser = await updateProfile({ name: profileData.name });
      
      if (currentUser) {
        const newUser = { ...currentUser, name: updatedUser.name };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      alert(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setSavingPassword(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage("Senha alterada com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      const message = err.response?.data?.message || "Erro ao alterar senha";
      if (message.includes("incorreta")) {
        setPasswordErrors({ currentPassword: "Senha atual incorreta" });
      } else {
        alert(message);
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Minha Conta" subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#3A8DFF] animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Minha Conta"
        subtitle="Atualize suas informações pessoais e senha"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Card de Info do Usuário */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/[0.08] p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ${currentUser?.role === "ADMIN" ? "bg-purple-500/20" : "bg-[#3A8DFF]/20"}`}>
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{profileData.name}</h2>
                <p className="text-white/50">{profileData.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(currentUser?.role)}`}>
                    <Shield className="w-3 h-3" />
                    {getRoleLabel(currentUser?.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Sair */}
          <button
            onClick={handleLogout}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/[0.08] p-6 md:p-8 flex items-center gap-4 text-left hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
          >
            <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center text-white/50 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
                Sair
              </h3>
              <p className="text-white/50">Encerrar sessão</p>
            </div>
          </button>

          {/* Formulário de Perfil */}
          <form onSubmit={handleSaveProfile} className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/[0.08] p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#3A8DFF]" />
              Informações Pessoais
            </h3>

            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`w-full h-11 px-4 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${profileErrors.name ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`}
                />
                {profileErrors.name && <p className="mt-1 text-sm text-red-400">{profileErrors.name}</p>}
              </div>

              {/* Email (somente leitura) */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email
                  <span className="ml-2 text-xs text-white/30 font-normal">(somente administrador pode alterar)</span>
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full h-11 px-4 bg-white/[0.02] border border-white/[0.05] rounded-xl text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={savingProfile}
                className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </button>
            </div>
          </form>

          {/* Formulário de Senha */}
          <form onSubmit={handleChangePassword} className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/[0.08] p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#3A8DFF]" />
              Alterar Senha
            </h3>

            <div className="space-y-5">
              {/* Senha Atual */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Senha atual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Digite sua senha atual"
                    className={`w-full h-11 px-4 pr-11 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${passwordErrors.currentPassword ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>}
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full h-11 px-4 pr-11 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${passwordErrors.newPassword ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Repita a nova senha"
                    className={`w-full h-11 px-4 pr-11 bg-white/[0.05] border rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/[0.08] transition-all ${passwordErrors.confirmPassword ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-[#3A8DFF]/50"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={savingPassword}
                className="h-11 px-5 bg-[#3A8DFF] text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#3A8DFF]/80 transition-colors disabled:opacity-50"
              >
                {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Alterar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
