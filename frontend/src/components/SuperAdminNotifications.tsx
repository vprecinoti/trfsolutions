"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { Bell, X, AlertTriangle, Users, FileText } from "lucide-react";

interface Notification {
  id: string;
  type: 'user_created' | 'client_created' | 'formulario_created' | 'login_failed' | 'system_alert';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export default function SuperAdminNotifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Só mostrar para o super admin específico
  if (!user || user.email !== 'admin@thiagoplatform.com') {
    return null;
  }

  useEffect(() => {
    loadNotifications();
    
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/admin/recent-activity');
      const activities = response.data.slice(0, 10);
      
      const formattedNotifications: Notification[] = activities.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        title: getNotificationTitle(activity.type),
        description: activity.description,
        timestamp: activity.timestamp,
        read: false,
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.length);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'user_created':
        return 'Novo Usuário';
      case 'client_created':
        return 'Novo Cliente';
      case 'formulario_created':
        return 'Novo Formulário';
      case 'login_failed':
        return 'Falha no Login';
      case 'system_alert':
        return 'Alerta do Sistema';
      default:
        return 'Notificação';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-4 h-4 text-green-400" />;
      case 'client_created':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'formulario_created':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'login_failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'system_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300"
        title="Notificações do Super Admin"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-80 bg-[#0a0b0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-semibold">Super Admin</h3>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Marcar todas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-white/50">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-red-500/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white text-sm font-medium">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                        )}
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {notification.description}
                      </p>
                      <span className="text-white/40 text-xs">
                        {new Date(notification.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10">
            <a
              href="/dashboard/super-admin"
              className="block w-full text-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver painel completo →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}