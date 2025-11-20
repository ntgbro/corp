// src/services/firebase/orderService.ts
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { Order, OrderItem, StatusHistory, Payment } from '../../types/firestore';

export class OrderService {
  static async getOrder(orderId: string): Promise<Order | null> {
    const docSnap = await getDoc(doc(collection(db, 'orders'), orderId));
    return docSnap.exists() ? (docSnap.data() as Order) : null;
  }

  static async getOrdersByUser(userId: string): Promise<Order[]> {
    const snapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)));
    return snapshot.docs.map((doc: any) => doc.data() as Order);
  }

  static async createOrder(order: Omit<Order, 'orderId'>): Promise<string> {
    const docRef = doc(collection(db, 'orders'));
    await setDoc(docRef, { ...order, orderId: docRef.id });
    return docRef.id;
  }

  static async addOrderItem(orderId: string, item: Omit<OrderItem, 'itemId'>): Promise<void> {
    const docRef = doc(collection(db, 'orders', orderId, 'order_items'));
    await setDoc(docRef, { ...item, itemId: docRef.id });
  }

  static async addPayment(orderId: string, payment: Omit<Payment, 'paymentId'>): Promise<void> {
    const docRef = doc(collection(db, 'orders', orderId, 'payment'));
    await setDoc(docRef, { ...payment, paymentId: docRef.id });
  }

  static async addStatusHistory(orderId: string, history: Omit<StatusHistory, 'statusId'>): Promise<void> {
    const docRef = doc(collection(db, 'orders', orderId, 'status_history'));
    await setDoc(docRef, { ...history, statusId: docRef.id });
  }

  static async updateOrderStatus(orderId: string, status: string, paymentStatus?: string): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      status: status,
      updatedAt: new Date()
    };
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    await updateDoc(orderRef, updateData);
  }
}