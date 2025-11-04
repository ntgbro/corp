import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { PreferencesForm } from '../components/PreferencesForm';
import { usePreferences } from '../hooks/usePreferences';

export const PreferencesScreen = () => {
  const { theme } = useThemeContext();
  const { preferences, loading, saving, updatePreferences } = usePreferences();

  const handleSave = async (data: any) => {
    try {
      await updatePreferences(data);
      Alert.alert('Success', 'Preferences updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Preferences</Text>
        <View style={styles.content}>
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading preferences...
            </Text>
          ) : (
            <PreferencesForm
              initialData={preferences}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
});

export default PreferencesScreen;