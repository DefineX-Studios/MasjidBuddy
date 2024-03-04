import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location'; // Importing Location module from Expo
import { Platform } from 'react-native';

import * as supabase from '@/core/supabase';

import type { Masjid, MasjidWithDistance } from './types';
import { getDistanceFromLocationInKm } from './util';

export const useMasjids = () => {
  return useQuery({
    queryKey: ['masjids'],
    queryFn: async () => {
      const result: PostgrestSingleResponse<Masjid[]> =
        await supabase.masjid.getAll();

      const { data, error: _err } = result;

      if (data == null) return null;

      let location = null;
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return null;
        }
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
      } else {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
      }

      const fromLoc = {
        lon: location.coords.longitude,
        lat: location.coords.latitude,
      };

      const masjidsWithDistance: MasjidWithDistance[] = [];

      for (const masjid of data) {
        const toLoc = { lon: masjid.longitude, lat: masjid.latitude };
        const distance = getDistanceFromLocationInKm(fromLoc, toLoc);

        masjidsWithDistance.push({ masjid, distance });
      }

      masjidsWithDistance.sort((m1, m2) => m1.distance - m2.distance);

      return masjidsWithDistance;
    },
  });
};
