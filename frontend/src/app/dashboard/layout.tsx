"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Páginas que NÃO usam sidebar (layout exclusivo/limpo)
  const isSemSidebar = 
    pathname === "/dashboard" || 
    pathname?.startsWith("/dashboard/formulario/novo");

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [setLoading]);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  // Loading state com tema dark
  if (!mounted || isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
            #06070a
          `
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-[#3A8DFF] font-bold text-xl">T</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Páginas sem sidebar (dashboard principal e formulário novo)
  if (isSemSidebar) {
    return <>{children}</>;
  }

  // Outras páginas - com sidebar responsiva e tema dark
  return (
    <div 
      className="min-h-screen flex"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
          #06070a
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden w-full lg:w-auto">
        {children}
      </main>
    </div>
  );
}
