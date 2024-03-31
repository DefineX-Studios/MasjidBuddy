import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path, Text, TSpan } from 'react-native-svg';

//Return a component that uses the SvgUri component to render the svg file from the given uri
export const Backward10s = (props: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" {...props}>
      <Text
        xmlSpace="preserve"
        x={392.005}
        y={466.883}
        style={{
          fontSize: '22.2259px',
          fill: '#000',
          strokeWidth: 1.85215,
        }}
        transform="matrix(.92569 0 0 1.08028 -248.407 -283.424)"
      >
        <TSpan
          x={392.005}
          y={466.883}
          style={{
            strokeWidth: 1.85215,
          }}
        >
          {'10s'}
        </TSpan>
      </Text>
      <G
        style={{
          fill: 'none',
        }}
      >
        <Path
          fill="#1c274c"
          d="M244.086 165.03V29.5c0-22.461-19.535-36.658-35.432-25.75L134.25 57.974V37.97c0-19.653-17.908-32.076-32.479-22.531L11.245 74.733c-14.993 9.82-14.993 35.243 0 45.063l90.525 59.295c14.571 9.545 32.479-2.879 32.479-22.531v-20.005l74.405 54.225c15.897 10.908 35.432-3.289 35.432-25.75z"
        />
      </G>
    </Svg>
  );
};
