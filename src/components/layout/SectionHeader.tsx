import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';
import Typography from '../common/Typography';
import { SPACING, BORDERS } from '../../constants/ui';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Typography variant="h6" color="text" style={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.content.medium,
    paddingHorizontal: SPACING.screen,
    marginBottom: SPACING.content.medium,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    marginTop: SPACING.content.small,
  },
  action: {
    marginLeft: SPACING.content.medium,
  },
});

export default SectionHeader;
