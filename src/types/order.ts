// src/types/order.ts
export interface Order {
  orderId: string;
  userId: string;
  restaurantId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  itemId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface StatusHistory {
  statusId: string;
  status: string;
  timestamp: Date;
  notes?: string;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderQuery {
  status?: OrderStatus;
  userId?: string;
  restaurantId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface StatusHistoryEntry {
  statusId: string;
  status: OrderStatus;
  timestamp: Date;
  updatedBy: string;
  notes?: string;
}

export interface OrderDetail extends Order {
  id: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  payment?: Payment;
}
