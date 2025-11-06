import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { FAQList } from '../components/FAQList';
import { useFAQs } from '../hooks/useFAQs';

export const HelpSupportScreen = () => {
  const { theme } = useThemeContext();
  const { faqs, loading } = useFAQs();

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        {
          text: 'Call Us',
          onPress: () => Linking.openURL('tel:+1234567890'),
        },
        {
          text: 'Email Us',
          onPress: () => Linking.openURL('mailto:support@corpease.com'),
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
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
        {loading ? (
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading FAQs...
          </Text>
        ) : (
          <FAQList faqs={faqs} />
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default HelpSupportScreen;