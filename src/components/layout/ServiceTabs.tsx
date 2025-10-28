import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useTheme } from '../../config/theme';

interface Service {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  isActive: boolean;
}

interface ServiceTabsProps {
  services: Service[];
  selectedService?: string;
  onServicePress?: (service: Service) => void;
  style?: ViewStyle;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
}

export const ServiceTabs: React.FC<ServiceTabsProps> = ({
  services,
  selectedService,
  onServicePress,
  style,
  variant = 'default',
  size = 'medium',
  showDescription = false,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(selectedService || services.find(s => s.isActive)?.id || services[0]?.id);

  const handleTabPress = (service: Service) => {
    setActiveTab(service.id);
    onServicePress?.(service);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 12,
          iconSize: 14,
          height: 32,
        };
      case 'large':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 20,
          height: 48,
        };
      default: // medium
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
          height: 40,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderTab = (service: Service) => {
    const isActive = activeTab === service.id;

    return (
      <TouchableOpacity
        key={service.id}
        style={[
          styles.tab,
          variant === 'pills' && styles.pillTab,
          variant === 'underline' && styles.underlineTab,
          {
            backgroundColor: isActive
              ? (variant === 'pills' ? theme.colors.primary : 'transparent')
              : theme.colors.surface,
            borderColor: isActive
              ? theme.colors.primary
              : theme.colors.border,
            height: sizeStyles.height,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
          },
        ]}
        onPress={() => handleTabPress(service)}
        activeOpacity={0.7}
      >
        {service.icon && (
          <Text style={[styles.tabIcon, {
            color: isActive ? theme.colors.white : theme.colors.primary,
            fontSize: sizeStyles.iconSize,
          }]}>
            {service.icon}
          </Text>
        )}
        <Text
          style={[
            styles.tabText,
            {
              color: isActive
                ? (variant === 'pills' ? theme.colors.white : theme.colors.primary)
                : theme.colors.text,
              fontSize: sizeStyles.fontSize,
              fontWeight: isActive ? '600' : '400',
            },
          ]}
        >
          {service.name}
        </Text>
        {variant === 'underline' && isActive && (
          <View style={[styles.underline, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  const selectedServiceData = services.find(s => s.id === activeTab);

  return (
    <View style={[styles.container, style]}>
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {services.map(renderTab)}
      </ScrollView>

      {/* Description */}
      {showDescription && selectedServiceData?.description && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
            {selectedServiceData.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  pillTab: {
    borderRadius: 20,
  },
  underlineTab: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 8,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    textAlign: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default ServiceTabs;
