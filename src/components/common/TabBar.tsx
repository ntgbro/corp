import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useTheme } from '../../config/theme';

export interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: ViewStyle;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={[
                styles.tab,
                {
                  borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              {tab.icon && (
                <View style={styles.icon}>
                  {typeof tab.icon === 'string' ? (
                    <Text style={{ color: isActive ? theme.colors.primary : theme.colors.textSecondary }}>
                      {tab.icon}
                    </Text>
                  ) : (
                    React.cloneElement(tab.icon as React.ReactElement, {
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    })
                  )}
                </View>
              )}

              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab.label}
              </Text>

              {isActive && <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    position: 'relative',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
  },
});

export default TabBar;
