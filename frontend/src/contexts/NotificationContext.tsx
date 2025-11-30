import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Notification } from '../types/notification';
import { notificationService } from '../services/notification-service';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getUnread();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notifica\u00e7\u00f5es:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Erro ao marcar notifica\u00e7\u00e3o como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const removeNotification = async (id: number) => {
    try {
      await notificationService.remove(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Erro ao remover notifica\u00e7\u00e3o:', error);
    }
  };

  const clearAll = async () => {
    try {
      const allIds = notifications.map(n => n.id);
      await Promise.all(allIds.map(id => notificationService.remove(id)));
      setNotifications([]);
    } catch (error) {
      console.error('Erro ao limpar todas as notifica\u00e7\u00f5es:', error);
    }
  };

  const refreshNotifications = () => {
    loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
