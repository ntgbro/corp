import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface NotificationItemProps {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  onPress?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  description,
  enabled,
  onToggle,
  onPress,
}) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity
      style={[styles.container, { 
        backgroundColor: theme.colors.surface, 
        borderColor: theme.colors.border 
      }]}
      onPress={() => onPress && onPress(id)}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={enabled}
        onValueChange={(value) => onToggle(id, value)}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor="white"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default NotificationItem;