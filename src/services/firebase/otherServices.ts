// src/services/firebase/otherServices.ts
import { collection, doc, setDoc } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';

// Example service for notifications or other features
export class NotificationService {
  static async sendNotification(userId: string, message: string): Promise<void> {
    const docRef = doc(collection(db, 'notifications'));
    await setDoc(docRef, {
      notificationId: docRef.id,
      userId,
      message,
      isRead: false,
      createdAt: new Date(),
    });
  }
}
