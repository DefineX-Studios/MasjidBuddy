import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import FindMasjid from '@/screens/home/find-masjid';

export type HomeStackParamList = {
  HomeScreen: undefined;
  FindMasjid: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="FindMasjid" component={FindMasjid} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
