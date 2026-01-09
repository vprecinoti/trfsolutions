"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  UserPlus, 
  Users, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  UserCog,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useState, useEffect, useMemo, useCallback, memo } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Formulário",
    href: "/dashboard/formulario",
    icon: <UserPlus className="w-5 h-5" />,
    roles: ["ADMIN", "PREMIUM"],
  },
  {
    label: "Clientes",
    href: "/dashboard/clientes",
    icon: <Users className="w-5 h-5" />,
    roles: ["ADMIN", "PREMIUM"],
  },
  {
    label: "Configurações",
    href: "/dashboard/configuracoes",
    icon: <Settings className="w-5 h-5" />,
    roles: ["ADMIN"],
  },
  {
    label: "Minha Conta",
    href: "/dashboard/configuracoes/conta",
    icon: <UserCog className="w-5 h-5" />,
    roles: ["BASIC", "PREMIUM"],
  },
];

// Componente de item de navegação memoizado
const NavItemComponent = memo(function NavItemComponent({ 
  item, 
  isActive, 
  isCollapsed,
  onClick 
}: { 
  item: NavItem; 
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        title={isCollapsed ? item.label : undefined}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
          isCollapsed ? "justify-center" : ""
        } ${
          isActive
            ? "bg-[#3A8DFF]/20 text-[#3A8DFF]"
            : "text-white/60 hover:bg-white/[0.05] hover:text-white"
        }`}
      >
        <span className={isActive ? "text-[#3A8DFF]" : "text-white/40 group-hover:text-white/70"}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <>
            <span className="font-medium">{item.label}</span>
            {isActive && (
              <ChevronRight className="w-4 h-4 ml-auto text-[#3A8DFF]/60" />
            )}
          </>
        )}
      </Link>
    </li>
  );
});

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const visibleItems = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.role || "");
    });
  }, [user?.role]);

  const userInitial = useMemo(() => user?.name?.charAt(0).toUpperCase() || "U", [user?.name]);
  const roleLabel = useMemo(() => {
    if (user?.role === "ADMIN") return "Administrador";
    if (user?.role === "PREMIUM") return "Premium";
    return "Básico";
  }, [user?.role]);

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className={`p-6 ${isCollapsed ? "flex justify-center" : ""}`}>
        <Link href="/dashboard" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <Image
            src="https://waystdio.com/wp-content/uploads/2026/01/TRF-LOGO.png"
            alt="TRF Logo"
            width={isCollapsed ? 40 : 110}
            height={isCollapsed ? 40 : 110}
            className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))}
              isCollapsed={isCollapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </ul>
      </nav>

      {/* Usuário */}
      <div className="p-4">
        <div className={`flex items-center gap-3 px-3 py-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white/80 font-semibold text-sm">
              {userInitial}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {roleLabel}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botão de colapsar - Desktop only */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-[#1a2235] border border-white/[0.1] rounded-full items-center justify-center text-white/50 hover:text-white hover:bg-[#2a3245] transition-all z-10"
        title={isCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </>
  );

  // Conteúdo mobile (sempre expandido)
  const MobileSidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="https://waystdio.com/wp-content/uploads/2026/01/TRF-LOGO.png"
            alt="TRF Logo"
            width={110}
            height={110}
            className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))}
              isCollapsed={false}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </ul>
      </nav>

      {/* Usuário */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-10 h-10 bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white/80 font-semibold text-sm">
              {userInitial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm truncate">
              {user?.name || "Usuário"}
            </p>
            <p className="text-xs text-white/40 truncate">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/[0.05] backdrop-blur-xl rounded-xl border border-white/[0.1] text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors"
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex ${isCollapsed ? "w-20" : "w-72"} bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] min-h-screen flex-col relative transition-all duration-300`}>
        {SidebarContent}
      </aside>

      {/* Sidebar Mobile */}
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0f1a]/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {MobileSidebarContent}
      </aside>
    </>
  );
}
