// MasjidNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { MasjidScreen } from '@/screens/masjid/MasjidScreen';

export type MasjidStackParamList = {
  MasjidScreen: undefined;
  // Add other Masjid-related screens if needed
};

const Stack = createNativeStackNavigator<MasjidStackParamList>();

export const MasjidNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
     
    </Stack.Navigator>
  );
};

