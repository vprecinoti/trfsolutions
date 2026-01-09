"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  Bell, 
  Users, 
  FileText, 
  Activity, 
  Database, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface SystemStats {
  totalUsers: number;
  totalClients: number;
  totalFormularios: number;
  totalLeads: number;
  recentActivity: ActivityItem[];
  systemAlerts: SystemAlert[];
  databaseUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface ActivityItem {
  id: string;
  type: 'user_created' | 'client_created' | 'formulario_created' | 'login_success' | 'login_failed';
  description: string;
  timestamp: string;
  userEmail?: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function SuperAdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<ActivityItem[]>([]);

  // Verificar se é o super admin
  useEffect(() => {
    if (!user || user.email !== 'admin@thiagoplatform.com') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  // Carregar dados do sistema
  useEffect(() => {
    if (user?.email === 'admin@thiagoplatform.com') {
      loadSystemStats();
      // Atualizar a cada 30 segundos
      const interval = setInterval(loadSystemStats, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadSystemStats = async () => {
    try {
      const response = await api.get('/admin/system-stats');
      setStats(response.data);
      setNotifications(response.data.recentActivity.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.email !== 'admin@thiagoplatform.com') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06070a]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3A8DFF]"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen px-6 py-8"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
          #06070a
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          </div>
          <p className="text-white/60">Painel exclusivo para monitoramento do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Usuários"
            value={stats?.totalUsers || 0}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total de Clientes"
            value={stats?.totalClients || 0}
            icon={<Users className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Formulários"
            value={stats?.totalFormularios || 0}
            icon={<FileText className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Leads Gerados"
            value={stats?.totalLeads || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atividade Recente */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-[#3A8DFF]" />
                <h2 className="text-xl font-semibold text-white">Atividade Recente</h2>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-[#3A8DFF]/20 text-[#3A8DFF] text-sm rounded-full">
                    Tempo Real
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    Nenhuma atividade recente
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alertas do Sistema */}
          <div>
            <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-semibold text-white">Alertas</h2>
              </div>
              
              <div className="space-y-3">
                {stats?.systemAlerts?.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                )) || (
                  <div className="text-center py-4 text-white/50">
                    Nenhum alerta
                  </div>
                )}
              </div>
            </div>

            {/* Uso do Banco */}
            <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-5 h-5 text-[#3A8DFF]" />
                <h2 className="text-xl font-semibold text-white">Uso do Banco</h2>
              </div>
              
              {stats?.databaseUsage && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Usado</span>
                    <span className="text-white">
                      {stats.databaseUsage.used}MB / {stats.databaseUsage.total}GB
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                    <div 
                      className="bg-[#3A8DFF] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.databaseUsage.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50">
                    {stats.databaseUsage.percentage.toFixed(1)}% utilizado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-white/60 text-sm">{title}</p>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-4 h-4 text-green-400" />;
      case 'client_created':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'formulario_created':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'login_success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'login_failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
      <div className="mt-0.5">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{activity.description}</p>
        {activity.userEmail && (
          <p className="text-white/50 text-xs mt-1">{activity.userEmail}</p>
        )}
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-3 h-3 text-white/40" />
          <span className="text-white/40 text-xs">
            {new Date(activity.timestamp).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: SystemAlert }) {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400 bg-red-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${alert.resolved ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${getAlertColor(alert.type).split(' ')[1]}`} />
        <div className="flex-1">
          <h4 className="text-white text-sm font-medium">{alert.title}</h4>
          <p className="text-white/60 text-xs mt-1">{alert.description}</p>
          <span className="text-white/40 text-xs">
            {new Date(alert.timestamp).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
}