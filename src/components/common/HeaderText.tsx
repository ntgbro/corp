import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../config';

export interface HeaderTextProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TextStyle;
}

export const HeaderText: React.FC<HeaderTextProps> = ({
  children,
  level = 1,
  style,
}) => {
  const theme = useTheme();

  const getTextStyles = () => {
    const sizes = {
      1: { fontSize: 32, fontWeight: 'bold' as const },
      2: { fontSize: 24, fontWeight: 'bold' as const },
      3: { fontSize: 20, fontWeight: '600' as const },
      4: { fontSize: 18, fontWeight: '600' as const },
      5: { fontSize: 16, fontWeight: '500' as const },
      6: { fontSize: 14, fontWeight: '500' as const },
    };
    return sizes[level];
  };

  const textStyles = getTextStyles();

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: textStyles.fontSize,
          fontWeight: textStyles.fontWeight,
          color: theme.colors.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default HeaderText;
