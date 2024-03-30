import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { supabase } from '@/core/supabase'; // Import supabase instance
import { HomeScreen } from '@/screens/home';
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
  MasjidInfo: { selectedMasjidId: number };
  FindMasjid1: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  const [subscribedMasjids, setSubscribedMasjids] = React.useState<any[]>([]);

  const fetchSubscribedMasjids = async () => {
    try {
      const { data, error } = await supabase.rpc('get_subscribed_masjids');
      if (error) {
        throw error;
      }
      setSubscribedMasjids(data);
    } catch (error) {
      console.error('Error fetching subscribed masjids:');
    }
  };

  // Fetch subscribed masjids when the component mounts
  React.useEffect(() => {
    fetchSubscribedMasjids();
  }, []);

  // Determine whether any masjids are subscribed
  const hasSubscribedMasjids = subscribedMasjids.length > 0;

  return (
    <Stack.Navigator>
      {/* Render HomeNavigator if there are subscribed masjids, otherwise render FindMasjid */}
      {hasSubscribedMasjids ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </>
      ) : (
        <Stack.Screen name="FindMasjid1" component={FindMasjid} />
      )}
      <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
      <Stack.Screen name="NamazTimingsScreen" component={NamazTimingsScreen} />
      <Stack.Screen name="AudioScreen" component={AudioScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="MasjidInfo" component={MasjidInfo} />
      <Stack.Screen name="FindMasjid" component={FindMasjid} />
    </Stack.Navigator>
  );
};
