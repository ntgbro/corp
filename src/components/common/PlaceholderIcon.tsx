import React from 'react';
import { View, Text } from 'react-native';

interface PlaceholderIconProps {
  size?: number;
  color?: string;
  style?: any;
  label?: string;
}

const PlaceholderIcon: React.FC<PlaceholderIconProps> = ({
  size = 24,
  color = '#000000',
  style,
  label = 'Icon',
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color, fontSize: size / 2 }}>{label.charAt(0)}</Text>
    </View>
  );
};

export default PlaceholderIcon;