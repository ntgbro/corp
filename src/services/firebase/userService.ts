// src/services/firebase/userService.ts
import { collection, doc, getDoc, setDoc, updateDoc } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types/firestore';

export class UserService {
  static async getUser(userId: string): Promise<User | null> {
    const docSnap = await getDoc(doc(collection(db, 'users'), userId));
    return docSnap.exists() ? (docSnap.data() as User) : null;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(collection(db, 'users'), userId), updates);
  }

  static async createUser(user: Omit<User, 'userId'>): Promise<string> {
    const docRef = doc(collection(db, 'users'));
    await setDoc(docRef, { ...user, userId: docRef.id });
    return docRef.id;
  }
}
