import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Modal, ToastAndroid, Platform } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { FAQList } from '../components/FAQList';
import { useFAQs } from '../hooks/useFAQs';
import { SupportTicketForm } from '../components/SupportTicketForm';
import { SupportTicketList } from '../components/SupportTicketList';
import { useSupportTickets } from '../hooks/useSupportTickets';

export const HelpSupportScreen = () => {
  const { theme } = useThemeContext();
  const { faqs, loading } = useFAQs();
  const { tickets, loading: ticketsLoading, refreshTickets } = useSupportTickets();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showTicketList, setShowTicketList] = useState(true);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        {
          text: 'Call Us',
          onPress: () => Linking.openURL('tel:+919916198492')
        },
        {
          text: 'Email Us',
          onPress: () => Linking.openURL('mailto:business@corpeas.com')
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert('Feedback', 'Feedback functionality will be implemented soon!');
  };

  const confirmDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteAccountModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      console.log('Delete account initiated');
      setShowDeleteAccountModal(false);
      // Redirect to corpeas.com where users can raise a complaint to delete their account
      Linking.openURL('https://corpeas.com/support-ticket');
    } catch (error) {
      console.error('Delete account error:', error);
      setShowDeleteAccountModal(false);
      
      // Show error message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to open website. Please try again.', ToastAndroid.LONG);
      } else {
        Alert.alert('Error', 'Failed to open website. Please try again.');
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.supportCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Need Help?</Text>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>
            Our support team is available 24/7 to assist you with any questions or issues.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleContactSupport}
          >
            <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>Contact Support</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.supportCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Send Feedback</Text>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>
            We value your feedback and suggestions to improve our service.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleFeedback}
          >
            <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>Send Feedback</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.supportCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>          
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Support Tickets</Text>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>            
            View or create support tickets.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowTicketModal(true)}
          >
            <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>View/Create Tickets</Text>
          </TouchableOpacity>
        </View>
        
        <Modal
          visible={showTicketModal}
          animationType="slide"
          onRequestClose={() => setShowTicketModal(false)}
        >
          <SafeAreaWrapper>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text }}>{showTicketList ? 'Support Tickets' : 'Create Ticket'}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {showTicketList ? (
                    <TouchableOpacity onPress={() => setShowTicketList(false)} style={{ marginRight: 16 }}>
                      <Text style={{ fontSize: 16, color: theme.colors.primary }}>Create New</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setShowTicketList(true)} style={{ marginRight: 16 }}>
                      <Text style={{ fontSize: 16, color: theme.colors.primary }}>View All</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setShowTicketModal(false)}>
                    <Text style={{ fontSize: 16, color: theme.colors.primary }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                {showTicketList ? (
                  <SupportTicketList 
                    tickets={tickets} 
                    onTicketPress={(ticket) => {
                      // For now, just show an alert with ticket details
                      Alert.alert(
                        ticket.title,
                        `Status: ${ticket.status}
Category: ${ticket.category}
Priority: ${ticket.priority}

${ticket.description}`
                      );
                    }} 
                  />
                ) : (
                  <SupportTicketForm onTicketCreated={() => {
                    setShowTicketList(true);
                    refreshTickets();
                  }} />
                )}
              </ScrollView>
            </View>
          </SafeAreaWrapper>
        </Modal>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
        {loading ? (
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading FAQs...
          </Text>
        ) : (
          <FAQList faqs={faqs} />
        )}
        
        {/* Delete Account Card - Placed below FAQ questions as requested */}
        <View style={[styles.supportCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Delete Account</Text>
          <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.colors.error }]}
            onPress={confirmDeleteAccount}
          >
            <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        
        {/* Delete Account Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteAccountModal}
          onRequestClose={cancelDeleteAccount}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Delete Account</Text>
              <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
                Are you sure you want to delete your account? You will be redirected to our website where you can raise a complaint to delete your account. This action cannot be undone and all your data will be permanently lost.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
                  onPress={cancelDeleteAccount}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteAccountModalButton, { backgroundColor: theme.colors.error }]}
                  onPress={handleDeleteAccount}
                >
                  <Text style={[styles.deleteAccountModalButtonText, { color: theme.colors.white }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Add padding at the top
  },
  supportCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteAccountModalButton: {
    backgroundColor: '#FF3B30',
  },
  deleteAccountModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpSupportScreen;