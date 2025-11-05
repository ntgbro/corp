import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface SocialMediaItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

interface SocialMediaRowProps {
  items: SocialMediaItem[];
}

export const SocialMediaRow: React.FC<SocialMediaRowProps> = ({ items }) => {
  const { theme } = useThemeContext();

  const handlePress = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.log('Failed to open URL:', url);
    });
  };

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.socialButton, { backgroundColor: item.color }]}
          onPress={() => handlePress(item.url)}
        >
          <Text style={styles.socialIcon}>{item.icon}</Text>
          <Text style={styles.socialName}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  socialButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  socialIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  socialName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

export default SocialMediaRow;