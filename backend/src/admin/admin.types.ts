export interface SystemStats {
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

export interface ActivityItem {
  id: string;
  type: 'user_created' | 'client_created' | 'formulario_created' | 'login_success' | 'login_failed';
  description: string;
  timestamp: string;
  userEmail?: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}