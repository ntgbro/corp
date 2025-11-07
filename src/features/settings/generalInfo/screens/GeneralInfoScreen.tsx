import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { TermsAndConditions } from '../components/TermsAndConditions';
import { useGeneralInfo } from '../hooks/useGeneralInfo';

export const GeneralInfoScreen = () => {
  const { theme } = useThemeContext();
  const { appInfo, loading, acceptTerms, declineTerms } = useGeneralInfo();

  const handleAccept = async () => {
    try {
      await acceptTerms();
      Alert.alert('Success', 'Terms accepted');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept terms');
    }
  };

  const handleDecline = async () => {
    try {
      await declineTerms();
      Alert.alert('Success', 'Terms declined');
    } catch (error) {
      Alert.alert('Error', 'Failed to decline terms');
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>App Version</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{appInfo.version}</Text>
        </View>
        
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Build Number</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{appInfo.build}</Text>
        </View>
        
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Terms & Conditions</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {appInfo.termsAccepted ? 'Accepted' : 'Not Accepted'}
          </Text>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Terms and Conditions</Text>
        <TermsAndConditions 
          showActions={!appInfo.termsAccepted}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Add padding at the top
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
});

export default GeneralInfoScreen;