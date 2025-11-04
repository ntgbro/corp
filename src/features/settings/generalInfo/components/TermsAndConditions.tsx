import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface TermsAndConditionsProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onAccept,
  onDecline,
  showActions = false,
}) => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Terms and Conditions</Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>1. Introduction</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          Welcome to Corpease. These terms and conditions outline the rules and regulations for the use of Corpease's Website and Services.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>2. Intellectual Property Rights</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          Other than the content you own, under these Terms, Corpease and/or its licensors own all the intellectual property rights and materials contained in this Website and Services.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>3. Restrictions</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          You are specifically restricted from all of the following:
        </Text>
        <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>• Publishing any Website and Services material in any other media</Text>
        <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>• Selling, sublicensing and/or otherwise commercializing any Website and Services material</Text>
        <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>• Using this Website and Services in any way that is or may be damaging to this Website and Services</Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>4. Your Content</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          In these Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website and Services.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>5. No Warranties</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          This Website and Services is provided "as is," with all faults, and Corpease expresses no representations or warranties.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>6. Limitation of Liability</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          In no event shall Corpease, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website and Services.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>7. Indemnification</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          You hereby indemnify to the fullest extent Corpease from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>8. Severability</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          If any provision of these Terms and Conditions is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>9. Variation of Terms</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          Corpease is permitted to revise these Terms and Conditions at any time as it sees fit, and by using this Website and Services you are expected to review these Terms and Conditions regularly.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>10. Assignment</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          Corpease is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms and Conditions without any notification.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>11. Entire Agreement</Text>
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          These Terms and Conditions constitute the entire agreement between Corpease and you in relation to your use of this Website and Services.
        </Text>
      </ScrollView>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={onAccept}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={onDecline}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    margin: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TermsAndConditions;