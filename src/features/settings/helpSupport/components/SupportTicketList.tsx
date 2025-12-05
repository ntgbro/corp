// src/features/settings/helpSupport/components/SupportTicketList.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { SupportTicket } from '../../../../types/firestore';

interface SupportTicketListProps {
  tickets: SupportTicket[];
  onTicketPress: (ticket: SupportTicket) => void;
}

export const SupportTicketList: React.FC<SupportTicketListProps> = ({ tickets, onTicketPress }) => {
  const { theme } = useThemeContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#FF9800'; // Orange
      case 'in_progress':
        return '#2196F3'; // Blue
      case 'resolved':
        return '#4CAF50'; // Green
      case 'closed':
        return '#9E9E9E'; // Grey
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#F44336'; // Red
      case 'medium':
        return '#FF9800'; // Orange
      case 'low':
        return '#4CAF50'; // Green
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {tickets.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No support tickets found
          </Text>
        </View>
      ) : (
        tickets.map((ticket) => (
          <TouchableOpacity
            key={ticket.ticketId}
            style={[styles.ticketItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => onTicketPress(ticket)}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                {ticket.title}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                <Text style={styles.statusText}>{ticket.status.replace('_', ' ')}</Text>
              </View>
            </View>
            
            <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {ticket.description}
            </Text>
            
            <View style={styles.footer}>
              <Text style={[styles.category, { color: theme.colors.textSecondary }]}>
                {ticket.category}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
                <Text style={styles.priorityText}>{ticket.priority}</Text>
              </View>
            </View>
            
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {ticket.createdAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  ticketItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
});

export default SupportTicketList;