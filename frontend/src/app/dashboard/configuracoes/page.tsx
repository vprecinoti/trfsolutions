"use client";

import { Header } from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/auth";
import { Users, Shield, UserCog, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

interface SettingCard {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const settingCards: SettingCard[] = [
  {
    title: "Gerenciar Usuários",
    icon: <Users className="w-7 h-7 md:w-8 md:h-8" />,
    href: "/dashboard/configuracoes/usuarios",
  },
  {
    title: "Permissões",
    icon: <Shield className="w-7 h-7 md:w-8 md:h-8" />,
    href: "/dashboard/configuracoes/permissoes",
  },
  {
    title: "Minha Conta",
    icon: <UserCog className="w-7 h-7 md:w-8 md:h-8" />,
    href: "/dashboard/configuracoes/conta",
  },
];

export default function ConfiguracoesPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <Header 
        title="Configurações"
        subtitle="Gerencie as configurações da plataforma"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {settingCards.map((card) => (
              <button
                key={card.href}
                onClick={() => router.push(card.href)}
                className="group relative rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col items-start
                  bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08]
                  hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-1
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left"
              >
                <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-white/[0.05] rounded-xl flex items-center justify-center mb-4 md:mb-6 text-white/50 group-hover:bg-[#3A8DFF]/20 group-hover:text-[#3A8DFF] transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-[#3A8DFF] transition-colors">
                  {card.title}
                </h3>
              </button>
            ))}

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="group relative rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col items-start
                bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08]
                hover:bg-red-500/10 hover:border-red-500/30 hover:-translate-y-1
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left"
            >
              <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-white/[0.05] rounded-xl flex items-center justify-center mb-4 md:mb-6 text-white/50 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                <LogOut className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-red-400 transition-colors">
                Sair
              </h3>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
