import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const Masjid = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    {/* Main Building */}
    <Path
      d="M17.5 2a.5.5 0 0 0-.5.5v3.5h-1V2.5a.5.5 0 0 0-1 0V6H9V2.5a.5.5 0 0 0-1 0V6h-1V2.5a.5.5 0 1 0-1 0V6H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM12 16h3v6h-3v-6zm-5 0h3v6H7v-6zm10 0h3v6h-3v-6z"
      fill={color}
    />
    {/* Minarets */}
    <Path
      d="M6.5 15.5a.5.5 0 0 0-1 0v2.5h1v-2.5zm12 0a.5.5 0 0 0-1 0v2.5h1v-2.5z"
      fill={color}
    />
  </Svg>
);
