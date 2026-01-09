"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/store/auth";
import { LogOut } from "lucide-react";

// --- Types ---
interface MenuBlock {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  size: "large" | "small";
  roles?: UserRole[];
}

// --- Icons SVG ---
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" className={className}>
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const FileAddIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={className}>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className={className}>
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"/>
  </svg>
);

// --- Configuration ---
const menuBlocks: MenuBlock[] = [
  {
    title: "Base de Clientes",
    subtitle: "Gerenciar cadastros e portfólios.",
    href: "/dashboard/clientes",
    icon: <UsersIcon className="fill-[#3A8DFF] drop-shadow-[0_0_12px_rgba(58,141,255,0.4)]" />,
    size: "large",
    roles: ["ADMIN", "PREMIUM"],
  },
  {
    title: "Novo Formulário",
    subtitle: "Iniciar questionário.",
    href: "/dashboard/formulario",
    icon: <FileAddIcon className="fill-white opacity-90" />,
    size: "small",
    roles: ["ADMIN", "PREMIUM"],
  },
  {
    title: "Configurações",
    subtitle: "Ajustes do sistema.",
    href: "/dashboard/configuracoes",
    icon: <SettingsIcon className="fill-white opacity-90" />,
    size: "small",
    roles: ["ADMIN"],
  },
  {
    title: "Minha Conta",
    subtitle: "Ajustes da conta.",
    href: "/dashboard/configuracoes/conta",
    icon: <SettingsIcon className="fill-white opacity-90" />,
    size: "small",
    roles: ["PREMIUM", "BASIC"],
  },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const visibleBlocks = menuBlocks.filter((block) => {
    if (!block.roles) return true;
    return block.roles.includes(user?.role || "BASIC");
  });

  const largeBlock = visibleBlocks.find(b => b.size === "large");
  const smallBlocks = visibleBlocks.filter(b => b.size === "small");

  return (
    <div 
      className="min-h-screen flex justify-center items-start px-5 md:px-10 pt-4 md:pt-6 pb-10"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
          #06070a
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Logout Button - Fixed Position */}
      <button 
        onClick={handleLogout}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
        title="Sair"
      >
        <LogOut className="w-5 h-5" />
      </button>

      <div className="w-full max-w-[1000px]">
        {/* Logo */}
        <div className="mb-3 flex justify-start">
          <Image
            src="https://waystdio.com/wp-content/uploads/2026/01/TRF-LOGO.png"
            alt="TRF Logo"
            width={185}
            height={185}
            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] w-[80px] h-[80px] md:w-[140px] md:h-[140px]"
            priority
          />
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-4 md:gap-0">
          <div>
            <h1 className="text-[2.2rem] md:text-[3.5rem] font-bold tracking-[-1px] md:tracking-[-2px] leading-[1.1] text-white">
              Bem-vindo,
              <br />
              {user?.name?.split(" ")[0] || "Administrador"}.
            </h1>
          </div>
          
          {/* Date */}
          <div className="flex flex-col items-start md:items-end md:mb-2">
            <span className="text-[0.75rem] md:text-[0.9rem] font-semibold text-[#3A8DFF] tracking-[2px] mb-1">
              HOJE
            </span>
            <span className="text-[1.1rem] md:text-[1.6rem] font-bold text-white tracking-[-0.5px]">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Large Card - Base de Clientes */}
          {largeBlock && (
            <Link
              href={largeBlock.href}
              className="col-span-1 md:col-span-2 group relative rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0
                bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08]
                hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-2
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-center mr-5 md:mr-8">
                  {largeBlock.icon}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-1 md:mb-2">
                    {largeBlock.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/50 leading-relaxed">
                    {largeBlock.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 md:relative md:top-auto md:right-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/[0.05] flex items-center justify-center
                group-hover:bg-[#3A8DFF] group-hover:-rotate-45 transition-all duration-400">
                <ArrowUpRightIcon />
              </div>
            </Link>
          )}

          {/* Small Cards */}
          {smallBlocks.map((block) => (
            <Link
              key={block.href}
              href={block.href}
              className="group relative rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col items-start
                bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08]
                hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-2
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-start mb-4 md:mb-6">
                {block.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-1 md:mb-2">
                {block.title}
              </h3>
              <p className="text-sm md:text-base text-white/50 leading-relaxed">
                {block.subtitle}
              </p>
            </Link>
          ))}

          {/* Empty State */}
          {visibleBlocks.length === 0 && (
            <div className="col-span-1 md:col-span-2 py-20 text-center">
              <p className="text-white/50">Nenhum módulo disponível para seu perfil.</p>
            </div>
          )}
        </div>

        {/* Basic User Notice */}
        {user?.role === "BASIC" && (
          <div className="mt-6 md:mt-8">
            <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] p-6 md:p-8
              bg-amber-500/10 backdrop-blur-[30px] border border-amber-500/20">
              <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Acesso Restrito</h3>
                  <p className="text-white/60">
                    Sua conta está no nível <span className="font-semibold text-amber-400">Básico</span>. 
                    Solicite upgrade ao administrador.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
