"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Header } from "@/components/dashboard/Header";
import { 
  Users, FileText, Activity, Database, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle, RefreshCw, Shield
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
  type: string;
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

export default function MonitoramentoPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.email !== 'admin@thiagoplatform.com') {
      router.push('/dashboard');
      return;
    }
    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/admin/system-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (user?.email !== 'admin@thiagoplatform.com') {
    return null;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return <Users className="w-4 h-4 text-green-400" />;
      case 'client_created': return <Users className="w-4 h-4 text-blue-400" />;
      case 'formulario_created': return <FileText className="w-4 h-4 text-purple-400" />;
      case 'login_success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'login_failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      <Header 
        title="Monitoramento do Sistema"
        subtitle="Painel exclusivo - admin@thiagoplatform.com"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Aviso de acesso exclusivo */}
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">
            Acesso exclusivo para <span className="font-semibold">admin@thiagoplatform.com</span>
          </p>
          <button
            onClick={loadStats}
            disabled={refreshing}
            className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[#3A8DFF] animate-spin" />
          </div>
        ) : stats && (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Usuários" value={stats.totalUsers} icon={<Users />} color="blue" />
              <StatCard title="Clientes" value={stats.totalClients} icon={<Users />} color="green" />
              <StatCard title="Formulários" value={stats.totalFormularios} icon={<FileText />} color="purple" />
              <StatCard title="Leads" value={stats.totalLeads} icon={<TrendingUp />} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Atividade Recente */}
              <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#3A8DFF]" />
                  Atividade Recente
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{activity.description}</p>
                        {activity.userEmail && (
                          <p className="text-xs text-white/50">{activity.userEmail}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-white/40" />
                          <span className="text-xs text-white/40">
                            {new Date(activity.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna Lateral */}
              <div className="space-y-6">
                {/* Alertas */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Alertas
                  </h2>
                  {stats.systemAlerts.length === 0 ? (
                    <p className="text-sm text-white/50 text-center py-4">Nenhum alerta</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.systemAlerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border ${
                          alert.type === 'error' ? 'bg-red-500/10 border-red-500/20' :
                          alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                          'bg-blue-500/10 border-blue-500/20'
                        }`}>
                          <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                          <p className="text-xs text-white/60 mt-1">{alert.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Uso do Banco */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#3A8DFF]" />
                    Uso do Banco
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Usado</span>
                      <span className="text-white">{stats.databaseUsage.used}MB / {stats.databaseUsage.total}GB</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          stats.databaseUsage.percentage > 80 ? 'bg-red-500' :
                          stats.databaseUsage.percentage > 60 ? 'bg-amber-500' : 'bg-[#3A8DFF]'
                        }`}
                        style={{ width: `${Math.min(stats.databaseUsage.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/50 text-center">
                      {stats.databaseUsage.percentage.toFixed(2)}% utilizado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-4 sm:p-6">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        <span className={colors[color].split(' ')[0]}>{icon}</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white">{value.toLocaleString()}</h3>
      <p className="text-xs sm:text-sm text-white/60">{title}</p>
    </div>
  );
}