import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  style?: object;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text style={[styles.sectionTitle, { color: colors.text + '80' }]}>
          {title.toUpperCase()}
        </Text>
      )}
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
  content: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
});
