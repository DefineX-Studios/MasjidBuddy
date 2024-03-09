import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import FindMasjid from '@/screens/home/find-masjid';
import MasjidScreen from '@/screens/home/masjid-screen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  FindMasjid: undefined;
  MasjidScreen: undefined;
  TestScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="FindMasjid" component={FindMasjid} />
        <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
