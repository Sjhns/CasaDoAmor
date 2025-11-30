export type NotificationType = 
  | 'quase-vencido' 
  | 'vencido' 
  | 'quase-esgotado' 
  | 'esgotado';

export interface Notification {
  id: number;
  type: NotificationType;
  medicineName: string;
  expiryDate?: Date; // Para vencido e quase-vencido
  quantity?: number; // Para esgotado e quase-esgotado
  createdAt: Date;
  read: boolean;
}
