import React from 'react';
import PlaceholderIcon from './PlaceholderIcon';

interface HomeIconProps {
  size?: number;
  color?: string;
  style?: any;
}

const HomeIcon: React.FC<HomeIconProps> = ({
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <PlaceholderIcon
      size={size}
      color={color}
      style={style}
      label="H"
    />
  );
};

export default HomeIcon;