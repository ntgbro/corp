import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface NotificationIconProps {
  size?: number;
  color?: string;
  style?: any;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <Path
        d="M10,20h4a2,2,0,0,1-4,0Zm8-4V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v6L4,18H20Z"
        fill={color}
      />
    </Svg>
  );
};

export default NotificationIcon;