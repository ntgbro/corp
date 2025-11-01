import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface SettingsItemProps {
  icon?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
  rightComponent?: React.ReactNode;
  containerStyle?: any;
  titleTextStyle?: any;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  disabled = false,
  rightComponent,
  containerStyle,
  titleTextStyle,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { opacity: disabled ? 0.5 : 1 },
        containerStyle
      ]} 
      onPress={onPress}
      disabled={disabled || (isSwitch && !onPress)}
    >
      <View style={styles.leftContainer}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.iconText, { color: colors.primary }]}>{icon || '⚙️'}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }, titleTextStyle]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: colors.text + '80' }]}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent || (
          isSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          ) : showChevron ? (
            <Text style={{ color: colors.text + '80', fontSize: 16 }}>›</Text>
          ) : null
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  rightContainer: {
    marginLeft: 8,
  },
});
