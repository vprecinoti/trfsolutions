"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, TrendingUp, DollarSign, PiggyBank, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { access_token, refresh_token, user } = response.data;
      login(user, access_token, refresh_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 font-sans"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
          #06070a
        `
      }}
    >
      {/* Container Principal - Glass Effect */}
      <div 
        className="w-full max-w-6xl rounded-[32px] overflow-hidden flex flex-col lg:flex-row min-h-[700px] backdrop-blur-[30px]"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        
        {/* Lado Esquerdo - Formulário */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center items-center p-12 lg:p-16">
          
          <div className="w-full max-w-[400px] mx-auto">
            {/* Logo TRF */}
            <div className="mb-8">
              <Image 
                src="https://waystdio.com/wp-content/uploads/2026/01/TRF-LOGO.png" 
                alt="TRF Logo" 
                width={120}
                height={52}
                className="w-[120px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </div>

            {/* Título */}
            <div className="mb-16">
              <h1 className="text-5xl font-semibold text-white tracking-tight leading-[1.1]">
                Olá,<br />
                Bem-vindo!
              </h1>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Input Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className={`w-full h-14 pl-14 pr-4 rounded-2xl bg-white/5 text-white text-base placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all border ${
                    errors.email ? "border-red-500/50 bg-red-500/10" : "border-white/10 hover:border-white/20 focus:border-[#3A8DFF]/50"
                  }`}
                  style={{ paddingLeft: '3.5rem' }}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Input Senha */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha secreta"
                  className={`w-full h-14 pl-14 pr-12 rounded-2xl bg-white/5 text-white text-base placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all border ${
                    errors.password ? "border-red-500/50 bg-red-500/10" : "border-white/10 hover:border-white/20 focus:border-[#3A8DFF]/50"
                  }`}
                  style={{ paddingLeft: '3.5rem' }}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-400 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Checkbox e Esqueceu senha */}
              <div className="flex justify-between items-center text-sm pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md border-2 border-white/20 bg-white/5 text-[#3A8DFF] focus:ring-[#3A8DFF] focus:ring-offset-0 cursor-pointer"
                    {...register("rememberMe")}
                  />
                  <span className="text-white/50">Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  className="text-white/40 hover:text-[#3A8DFF] transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#3A8DFF] hover:bg-[#2d7be8] disabled:bg-[#3A8DFF]/50 text-white font-semibold text-base rounded-xl shadow-lg shadow-[#3A8DFF]/20 hover:shadow-[#3A8DFF]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10">
              <p className="text-white/40 text-sm text-center">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-[#3A8DFF] hover:text-[#5aa0ff] font-semibold transition-colors">
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Ilustração Financeira */}
        <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-[#3A8DFF]/20 via-[#3A8DFF]/10 to-[#2563eb]/20 relative items-center justify-center p-12 border-l border-white/5">
          
          {/* Elementos decorativos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-20 bg-[#3A8DFF]/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-60 h-30 bg-[#3A8DFF]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#2563eb]/15 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
            {/* Badge de Meta */}
            <div className="absolute top-0 left-0 rounded-full p-4 shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Target className="w-8 h-8 text-[#3A8DFF]" />
            </div>

            {/* Card Principal - Dashboard Financeiro */}
            <div className="relative">
              <div 
                className="w-72 rounded-3xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                
                {/* Header do Card */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Patrimônio Total</p>
                      <p className="text-white font-bold text-lg">R$ 125.430</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-semibold">+12%</span>
                  </div>
                </div>

                {/* Gráfico de Barras Simplificado */}
                <div className="flex items-end justify-between gap-2 h-32 mb-6 px-2">
                  <div className="flex-1 bg-white/10 rounded-t-lg" style={{ height: '40%' }}></div>
                  <div className="flex-1 bg-white/15 rounded-t-lg" style={{ height: '55%' }}></div>
                  <div className="flex-1 bg-white/20 rounded-t-lg" style={{ height: '45%' }}></div>
                  <div className="flex-1 bg-white/25 rounded-t-lg" style={{ height: '70%' }}></div>
                  <div className="flex-1 bg-white/30 rounded-t-lg" style={{ height: '60%' }}></div>
                  <div className="flex-1 bg-gradient-to-t from-[#3A8DFF] to-[#5aa0ff] rounded-t-lg" style={{ height: '85%' }}></div>
                  <div className="flex-1 bg-gradient-to-t from-[#3A8DFF] to-[#5aa0ff] rounded-t-lg" style={{ height: '100%' }}></div>
                </div>

                {/* Metas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Meta Mensal</span>
                    <span className="text-white font-semibold text-sm">78%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-gradient-to-r from-[#3A8DFF] to-[#5aa0ff] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Card Flutuante - Economia */}
              <div 
                className="absolute -right-6 -bottom-4 rounded-2xl p-4 shadow-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.07)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Economizado</p>
                    <p className="text-white font-bold">R$ 8.540</p>
                  </div>
                </div>
              </div>

              {/* Card Flutuante - Crescimento */}
              <div 
                className="absolute -left-4 top-1/3 rounded-2xl p-3 shadow-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.07)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3A8DFF] to-cyan-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">+24%</span>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="mt-16 text-center text-white">
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Seu futuro financeiro</h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                Consultoria especializada para<br />alcançar suas metas e objetivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
