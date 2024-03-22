import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import AudioScreen from '@/screens/home/audio-screen';
import FindMasjid from '@/screens/home/find-masjid';
import MasjidInfo from '@/screens/home/masjid-info';
import MasjidScreen from '@/screens/home/masjid-screen';
import NamazTimingsScreen from '@/screens/home/namaz-timings';
import VideoScreen from '@/screens/home/video-screen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  FindMasjid: undefined;
  MasjidScreen: { selectedMasjidId: number };
  TestScreen: undefined;
  NamazTimingsScreen: { selectedMasjidId: number };
  AudioScreen: undefined;
  VideoScreen: undefined;
  MasjidInfo: { selectedMasjidId: Number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="FindMasjid" component={FindMasjid} />
        <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
        <Stack.Screen
          name="NamazTimingsScreen"
          component={NamazTimingsScreen}
        />
      </Stack.Group>
      <Stack.Screen name="AudioScreen" component={AudioScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="MasjidInfo" component={MasjidInfo} />
    </Stack.Navigator>
  );
};
