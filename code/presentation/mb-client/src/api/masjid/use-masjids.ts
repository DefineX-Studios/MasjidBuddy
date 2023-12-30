import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import GetLocation from 'react-native-get-location';

import { supabase } from '@/core/supabase';

import type { Masjid, MasjidWithDistance } from './types';
import { getDistanceFromLocationInKm } from './util';

export const useMasjids = () => {
  return useQuery({
    queryKey: ['masjids'],
    queryFn: async () => {
      const result: PostgrestSingleResponse<Masjid[]> = await supabase.rpc(
        'get_masjids_with_namaz_timings'
      );

      const { data, error: _err } = result;

      if (data == null) return null;

      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      const fromLoc = { lon: location.longitude, lat: location.latitude };

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
