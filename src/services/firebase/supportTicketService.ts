// src/services/firebase/supportTicketService.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  setDoc, 
  updateDoc, 
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp
} from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { SupportTicket, TicketMessage } from '../../types/firestore';

export class SupportTicketService {
  /**
   * Create a new support ticket
   * @param ticket - The support ticket data
   * @returns The ID of the created ticket
   */
  static async createTicket(ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const ticketRef = doc(collection(db, 'support_tickets'));
      const ticketData: SupportTicket = {
        ...ticket,
        ticketId: ticketRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(ticketRef, ticketData);
      return ticketRef.id;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  }

  /**
   * Get a support ticket by ID
   * @param ticketId - The ID of the ticket to retrieve
   * @returns The support ticket or null if not found
   */
  static async getTicket(ticketId: string): Promise<SupportTicket | null> {
    try {
      const docSnap = await getDoc(doc(collection(db, 'support_tickets'), ticketId));
      return docSnap.exists() ? (docSnap.data() as SupportTicket) : null;
    } catch (error) {
      console.error('Error getting support ticket:', error);
      throw error;
    }
  }

  /**
   * Get all support tickets for a user
   * @param userId - The ID of the user
   * @returns Array of support tickets
   */
  static async getTicketsByUser(userId: string): Promise<SupportTicket[]> {
    try {
      const q = query(
        collection(db, 'support_tickets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => doc.data() as SupportTicket);
    } catch (error: any) {
      console.error('Error getting support tickets by user:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to access support tickets. Please contact support.');
      }
      throw error;
    }
  }

  /**
   * Update a support ticket
   * @param ticketId - The ID of the ticket to update
   * @param updates - The updates to apply
   */
  static async updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<void> {
    try {
      const ticketRef = doc(db, 'support_tickets', ticketId);
      await updateDoc(ticketRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error updating support ticket:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to update this support ticket.');
      }
      throw error;
    }
  }

  /**
   * Add a message to a support ticket
   * @param ticketId - The ID of the ticket
   * @param message - The message to add
   * @returns The ID of the created message
   */
  static async addMessage(ticketId: string, message: Omit<TicketMessage, 'messageId' | 'timestamp'>): Promise<string> {
    try {
      const messagesRef = collection(db, 'support_tickets', ticketId, 'messages');
      const messageData: TicketMessage = {
        ...message,
        messageId: '',
        timestamp: Timestamp.now()
      };
      
      const docRef = await addDoc(messagesRef, messageData);
      
      // Update the message with its own ID
      await updateDoc(docRef, { messageId: docRef.id });
      
      // Update the ticket's updatedAt timestamp
      await this.updateTicket(ticketId, {});
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding message to support ticket:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to add a message to this support ticket.');
      }
      throw error;
    }
  }

  /**
   * Get messages for a support ticket
   * @param ticketId - The ID of the ticket
   * @returns Array of ticket messages
   */
  static async getMessages(ticketId: string): Promise<TicketMessage[]> {
    try {
      const q = query(
        collection(db, 'support_tickets', ticketId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => doc.data() as TicketMessage);
    } catch (error: any) {
      console.error('Error getting messages for support ticket:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to view messages for this support ticket.');
      }
      throw error;
    }
  }
}