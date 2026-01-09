"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { ArrowLeft, Shield, Check, X, Info } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface Permission {
  feature: string;
  admin: boolean;
  basic: boolean;
  premium: boolean;
}

const permissions: Permission[] = [
  { feature: "Ver Dashboard", admin: true, basic: true, premium: true },
  { feature: "Criar Cliente (formulário)", admin: true, basic: true, premium: true },
  { feature: "Ver TODOS os clientes", admin: true, basic: false, premium: false },
  { feature: "Ver SEUS clientes", admin: true, basic: true, premium: true },
  { feature: "Editar clientes", admin: true, basic: true, premium: true },
  { feature: "Excluir clientes", admin: true, basic: true, premium: true },
  { feature: "Acessar Configurações", admin: true, basic: false, premium: false },
  { feature: "Gerenciar usuários", admin: true, basic: false, premium: false },
  { feature: "Ver relatórios avançados", admin: true, basic: false, premium: true },
  { feature: "Exportar dados", admin: true, basic: false, premium: true },
];

export default function PermissoesPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Header
        title="Permissões"
        subtitle="Visualize os níveis de acesso de cada tipo de usuário"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Voltar */}
        <Link
          href="/dashboard/configuracoes"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para configurações
        </Link>

        <div className="max-w-4xl">
          {/* Info */}
          <div className="mb-6 p-4 bg-[#3A8DFF]/10 backdrop-blur-xl rounded-xl border border-[#3A8DFF]/20 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/70">
                Esta tabela mostra as permissões de cada tipo de usuário. 
                As permissões são definidas pelo sistema e não podem ser alteradas individualmente.
              </p>
            </div>
          </div>

          {/* Tabela de Permissões */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.08]">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Funcionalidade
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                <span className="inline-flex items-center px-2.5 py-1 bg-white/10 text-white/60 rounded-full border border-white/20">
                  Básico
                </span>
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                <span className="inline-flex items-center px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  Premium
                </span>
              </div>
            </div>

            {/* Linhas */}
            <div className="divide-y divide-white/[0.08]">
              {permissions.map((perm, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors"
                >
                  <div className="text-sm text-white/70 font-medium">
                    {perm.feature}
                  </div>
                  <div className="flex justify-center">
                    {perm.admin ? (
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {perm.basic ? (
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {perm.premium ? (
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-6 flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span>Permitido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-red-400" />
              </div>
              <span>Não permitido</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
