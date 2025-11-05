import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LocationIconProps {
  size?: number;
  color?: string;
  style?: any;
}

const LocationIcon: React.FC<LocationIconProps> = ({
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 145 260"
      fill="none"
      style={style}
    >
      <Path
        d="M72.5,2C33.56,2,2,33.56,2,72.5c0,9.77,2.027,21.524,5.58,30C23.98,141.617,72.5,258,72.5,258s48.52-116.258,64.92-155.375 C140.973,94.149,143,82.27,143,72.5C143,33.56,111.44,2,72.5,2z M72.5,105.05c-17.7,0-32.05-14.35-32.05-32.05 S54.8,40.95,72.5,40.95S104.55,55.3,104.55,73S90.2,105.05,72.5,105.05z"
        fill={color}
      />
    </Svg>
  );
};

export default LocationIcon;