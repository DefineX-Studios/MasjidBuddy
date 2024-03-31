import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path, Text, TSpan } from 'react-native-svg';

export const Forward10s = (props: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fill="#1c274c"
        d="M0 170.71V30.515C0 7.28 20.82-7.405 37.761 3.878l79.301 56.093V39.277c0-20.33 19.084-33.18 34.615-23.307l96.48 61.336c15.979 10.158 15.979 36.455 0 46.613l-96.48 61.336c-15.53 9.873-34.615-2.978-34.615-23.307v-20.693l-79.3 56.091C20.82 208.63 0 193.944 0 170.71Z"
      />
      <Text
        xmlSpace="preserve"
        x={342.736}
        y={468.606}
        style={{
          fontSize: '22.2259px',
          fill: '#000',
          strokeWidth: 1.85215,
        }}
        transform="matrix(.92569 0 0 1.08028 -264.284 -272.444)"
      >
        <TSpan
          x={342.736}
          y={468.606}
          style={{
            strokeWidth: 1.85215,
          }}
        >
          {'forward 10-s'}
        </TSpan>
      </Text>
    </Svg>
  );
};
