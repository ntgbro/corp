// src/features/settings/helpSupport/hooks/useSupportTickets.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { SupportTicketService } from '../../../../services/firebase/supportTicketService';
import { SupportTicket } from '../../../../types/firestore';

export interface UseSupportTicketsReturn {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  createTicket: (ticket: Omit<SupportTicket, 'ticketId' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  refreshTickets: () => Promise<void>;
}

export const useSupportTickets = (): UseSupportTicketsReturn => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTickets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userTickets = await SupportTicketService.getTicketsByUser(user.userId);
      setTickets(userTickets);
    } catch (err: any) {
      console.error('Error fetching support tickets:', err);
      if (err.message && err.message.includes('permission')) {
        setError('You do not have permission to access support tickets. Please contact support.');
      } else {
        setError(err.message || 'Failed to fetch support tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (
    ticket: Omit<SupportTicket, 'ticketId' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      const ticketData = {
        ...ticket,
        userId: user.userId
      };
      
      const ticketId = await SupportTicketService.createTicket(ticketData);
      // Refresh tickets after creating a new one
      await fetchTickets();
      return ticketId;
    } catch (err: any) {
      console.error('Error creating support ticket:', err);
      if (err.message && err.message.includes('permission')) {
        setError('You do not have permission to create support tickets. Please contact support.');
      } else {
        setError(err.message || 'Failed to create support ticket');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = async () => {
    await fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    loading,
    error,
    createTicket,
    refreshTickets
  };
};