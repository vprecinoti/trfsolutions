"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserPlus, CheckCircle2, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
        <div 
          className="w-full max-w-md rounded-[32px] p-12 text-center backdrop-blur-[30px]"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="w-20 h-20 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#3A8DFF]" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-4">
            Conta criada com sucesso!
          </h1>
          <p className="text-white/50 mb-6">
            Sua conta foi criada. Agora você pode acessar a plataforma.
          </p>
          <p className="text-sm text-white/30">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

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
        
        {/* Lado Esquerdo - Ilustração */}
        <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-[#3A8DFF]/20 via-[#3A8DFF]/10 to-[#2563eb]/20 relative items-center justify-center p-12 order-2 lg:order-1 border-r border-white/5">
          
          {/* Elementos decorativos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-40 h-20 bg-[#3A8DFF]/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 left-10 w-60 h-30 bg-[#3A8DFF]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
            {/* Badge */}
            <div 
              className="absolute top-0 right-0 rounded-full p-4 shadow-2xl"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <UserPlus className="w-8 h-8 text-[#3A8DFF]" />
            </div>

            {/* Card ilustrativo */}
            <div className="relative">
              <div 
                className="w-72 rounded-3xl p-8"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#3A8DFF]/20 rounded-2xl flex items-center justify-center">
                    <UserPlus className="w-7 h-7 text-[#3A8DFF]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Crie sua conta</h3>
                    <p className="text-white/50 text-sm">É rápido e fácil</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-[#3A8DFF]" />
                    </div>
                    <span className="text-white/70 text-sm">Gestão completa de clientes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[#3A8DFF]" />
                    </div>
                    <span className="text-white/70 text-sm">Análise de perfil financeiro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#3A8DFF]/20 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#3A8DFF]" />
                    </div>
                    <span className="text-white/70 text-sm">Dados seguros e protegidos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="mt-12 text-center text-white">
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Comece agora</h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                Crie sua conta e tenha acesso<br />à plataforma de consultoria
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center items-center p-12 lg:p-16 order-1 lg:order-2">
          
          <div className="w-full max-w-[400px] mx-auto">
            {/* Logo TRF */}
            <div className="mb-8">
              <Image 
                src="/trf-logo.png" 
                alt="TRF Logo" 
                width={120}
                height={52}
                className="w-[120px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </div>

            {/* Título */}
            <div className="mb-10">
              <h1 className="text-4xl font-semibold text-white tracking-tight leading-[1.1]">
                Criar conta
              </h1>
              <p className="text-white/50 mt-3">
                Preencha os dados abaixo para começar
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Input Nome */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className={`w-full h-14 pl-14 pr-4 rounded-2xl bg-white/5 text-white text-base placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all border ${
                    errors.name ? "border-red-500/50 bg-red-500/10" : "border-white/10 hover:border-white/20 focus:border-[#3A8DFF]/50"
                  }`}
                  style={{ paddingLeft: '3.5rem' }}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-2 text-xs text-red-400 ml-1">{errors.name.message}</p>
                )}
              </div>

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
                  placeholder="Sua senha"
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

              {/* Input Confirmar Senha */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  className={`w-full h-14 pl-14 pr-12 rounded-2xl bg-white/5 text-white text-base placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all border ${
                    errors.confirmPassword ? "border-red-500/50 bg-red-500/10" : "border-white/10 hover:border-white/20 focus:border-[#3A8DFF]/50"
                  }`}
                  style={{ paddingLeft: '3.5rem' }}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors z-10"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Dica de senha */}
              <p className="text-xs text-white/30 -mt-2">
                A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.
              </p>

              {/* Botão */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#3A8DFF] hover:bg-[#2d7be8] disabled:bg-[#3A8DFF]/50 text-white font-semibold text-base rounded-xl shadow-lg shadow-[#3A8DFF]/20 hover:shadow-[#3A8DFF]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8">
              <p className="text-white/40 text-sm text-center">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-[#3A8DFF] hover:text-[#5aa0ff] font-semibold transition-colors">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
