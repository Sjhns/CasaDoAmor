import { Clock, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import type { Notification } from '../types/notification';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { removeNotification, markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'quase-vencido':
        return <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      case 'vencido':
        return <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'quase-esgotado':
        return <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      case 'esgotado':
        return <X className="w-5 h-5 text-red-500 flex-shrink-0" />;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  const getMessage = () => {
    switch (notification.type) {
      case 'quase-vencido':
        return (
          <>
            <span className="font-medium">{notification.medicineName}</span>
            <span className="text-sm text-gray-600">Vence em: {formatDate(notification.expiryDate)}</span>
          </>
        );
      case 'vencido':
        return (
          <>
            <span className="font-medium">{notification.medicineName}</span>
            <span className="text-sm text-gray-600">Vencido em: {formatDate(notification.expiryDate)}</span>
          </>
        );
      case 'quase-esgotado':
        return (
          <>
            <span className="font-medium">{notification.medicineName}</span>
            <span className="text-sm text-gray-600">Quantidade atual: {notification.quantity}</span>
          </>
        );
      case 'esgotado':
        return (
          <>
            <span className="font-medium">{notification.medicineName}</span>
            <span className="text-sm text-gray-600">Quantidade de remédios: 0</span>
          </>
        );
    }
  };

  const handleGoToStock = () => {
    markAsRead(notification.id);
    navigate('/');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(notification.id);
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      {/* Ícone */}
      <div className="mt-0.5">{getIcon()}</div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {getMessage()}
        <button
          onClick={handleGoToStock}
          className="text-xs text-sky-600 hover:text-sky-700 font-medium text-left w-fit"
        >
          Ver estoque →
        </button>
      </div>

      {/* Botão remover */}
      <button
        onClick={handleRemove}
        className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
        aria-label="Remover notificação"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

interface NotificationPopupProps {
  onClose: () => void;
}

export const NotificationPopup = ({ onClose }: NotificationPopupProps) => {
  const { notifications, clearAll } = useNotifications();
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Popup */}
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notificações</h3>
          {unreadNotifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              Limpar todas
            </button>
          )}
        </div>

        {/* Lista de notificações */}
        <div className="max-h-96 overflow-y-auto">
          {unreadNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhuma notificação pendente</p>
            </div>
          ) : (
            unreadNotifications
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
          )}
        </div>
      </div>
    </>
  );
};
