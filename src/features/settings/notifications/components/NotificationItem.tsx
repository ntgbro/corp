import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface NotificationItemProps {
  id: string;
  title: string;
  description?: string;
  enabled: boolean; // This represents whether the notification is unread (true) or read (false)
  onToggle: (id: string) => void; // Function to mark as read
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

  // Debug: Log notification item props
  useEffect(() => {
    console.log('NotificationItem props:', { id, title, description, enabled });
  }, [id, title, description, enabled]);

  const handlePress = () => {
    // Mark as read when pressed
    onToggle(id);
    // Also call onPress if provided
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { 
        backgroundColor: enabled ? theme.colors.surface : theme.colors.background,
        borderColor: theme.colors.border 
      }]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { 
          color: theme.colors.text,
          fontWeight: enabled ? '600' : '400' // Bold for unread notifications
        }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      {enabled && (
        <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
      )}
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default NotificationItem;