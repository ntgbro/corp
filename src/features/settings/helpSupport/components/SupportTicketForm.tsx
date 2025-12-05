// src/features/settings/helpSupport/components/SupportTicketForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { useSupportTickets } from '../hooks/useSupportTickets';

interface SupportTicketFormProps {
  onTicketCreated?: () => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onTicketCreated }) => {
  const { theme } = useThemeContext();
  const { createTicket, loading } = useSupportTickets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const ticketId = await createTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority as 'low' | 'medium' | 'high',
        status: 'open',
        attachmentURLs: []
      });

      if (ticketId) {
        Alert.alert('Success', 'Support ticket created successfully');
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('general');
        setPriority('medium');
        
        if (onTicketCreated) {
          onTicketCreated();
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create support ticket. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.colors.surface, 
          color: theme.colors.text,
          borderColor: theme.colors.border
        }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter ticket title"
        placeholderTextColor={theme.colors.textSecondary}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
      <TextInput
        style={[styles.textArea, { 
          backgroundColor: theme.colors.surface, 
          color: theme.colors.text,
          borderColor: theme.colors.border
        }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your issue in detail"
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity 
          style={[styles.pickerOption, category === 'general' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: category === 'general' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setCategory('general')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>General</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pickerOption, category === 'order_issue' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: category === 'order_issue' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setCategory('order_issue')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>Order Issue</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pickerOption, category === 'payment' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: category === 'payment' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setCategory('payment')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>Payment</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: theme.colors.text }]}>Priority</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity 
          style={[styles.pickerOption, priority === 'low' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: priority === 'low' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setPriority('low')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>Low</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pickerOption, priority === 'medium' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: priority === 'medium' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setPriority('medium')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pickerOption, priority === 'high' && styles.selectedOption, { 
            backgroundColor: theme.colors.surface,
            borderColor: priority === 'high' ? theme.colors.primary : theme.colors.border
          }]}
          onPress={() => setPriority('high')}
        >
          <Text style={[styles.pickerText, { color: theme.colors.text }]}>High</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.submitButtonText, { color: theme.colors.white }]}>
          {loading ? 'Creating...' : 'Submit Ticket'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedOption: {
    borderWidth: 2,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SupportTicketForm;