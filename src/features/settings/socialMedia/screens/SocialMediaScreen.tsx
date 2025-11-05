import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { SocialMediaRow } from '../components/SocialMediaRow';
import { useSocialMedia } from '../hooks/useSocialMedia';

export const SocialMediaScreen = () => {
  const { theme } = useThemeContext();
  const { socialMedia, loading } = useSocialMedia();

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Follow Us</Text>
        
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Stay connected with us on social media for the latest updates, promotions, and news.
          </Text>
          
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading social media links...
            </Text>
          ) : (
            <SocialMediaRow items={socialMedia} />
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
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
});

export default SocialMediaScreen;