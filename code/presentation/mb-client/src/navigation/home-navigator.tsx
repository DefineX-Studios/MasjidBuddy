import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { masjid } from '@/core/supabase'; // Import supabase instance
import { HomeScreen } from '@/screens/home';
import { AudioScreen } from '@/screens/home/audio-screen';
import { FindMasjid } from '@/screens/home/find-masjid';
import { MasjidInfo } from '@/screens/home/masjid-info';
import { MasjidScreen } from '@/screens/home/masjid-screen';
import { NamazTimingsScreen } from '@/screens/home/namaz-timings';
import { SubscriptionScreen } from '@/screens/home/subscriptions';
import { VideoScreen } from '@/screens/home/video-screen';
export type HomeStackParamList = {
  HomeScreen: undefined;
  FindMasjid: undefined;
  MasjidScreen: { selectedMasjidId: number };
  NamazTimingsScreen: { selectedMasjidId: number };
  AudioScreen: undefined;
  VideoScreen: undefined;
  MasjidInfo: { selectedMasjidId: number };
  FindMasjidFirstTime: undefined;
  SubscriptionScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  const [subscribedMasjids, setSubscribedMasjids] = React.useState<any[]>([]);
  const hasFetchedMasjids = React.useRef(false);

  const handleFetchSubscribedMasjids = async () => {
    try {
      const response = await masjid.getSubscribed();
      if (response.error) {
        throw new Error(response.error.message);
      }
      const data = response.data;
      if (Array.isArray(data)) {
        setSubscribedMasjids(data);
      } else {
        throw new Error('Data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching subscribed masjids:', error);
    }
  };

  // Fetch subscribed masjids when the component mounts
  if (!hasFetchedMasjids.current) {
    handleFetchSubscribedMasjids();
    hasFetchedMasjids.current = true;
  }

  const hasSubscribedMasjids = subscribedMasjids.length > 0;

  return (
    <Stack.Navigator>
      {/* Render HomeNavigator if there are subscribed masjids, otherwise render FindMasjid */}
      {hasSubscribedMasjids ? (
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      ) : (
        <Stack.Screen name="FindMasjidFirstTime" component={FindMasjid} />
      )}
      <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
      <Stack.Screen name="NamazTimingsScreen" component={NamazTimingsScreen} />
      <Stack.Screen name="AudioScreen" component={AudioScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="MasjidInfo" component={MasjidInfo} />
      <Stack.Screen name="FindMasjid" component={FindMasjid} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
};
