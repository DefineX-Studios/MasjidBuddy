/* eslint-disable max-lines-per-function */
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { supabase } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Text, View } from '@/ui';

const NamazTimingsScreen = () => {
  const [namazTimings, setNamazTimings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { params } = useRoute<RouteProp<'NamazTimingsScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;

  useEffect(() => {
    const fetchNamazTimings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query the namaz timings data from Supabase based on the selectedMasjidId
        const { data: namazTimingsData, error: timingsError } = await supabase
          .from('namaz_timing')
          .select('*')
          .eq('masjid_id', selectedMasjidId);

        if (timingsError) {
          throw new Error('Error fetching namaz timings');
        }

        // Assuming namazTimingsData contains only one entry for the selected masjid

        // Set the fetched namaz timings
        setNamazTimings(namazTimingsData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error');
      }
    };

    fetchNamazTimings();
  }, [selectedMasjidId]); // Run this effect whenever selectedMasjidId changes

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-5 text-xl font-bold text-green-500">
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-5 text-xl font-bold text-green-500">
          Error: {error}
        </Text>
      </View>
    );
  }

  const fajrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'fajar'
  );

  // Find Dhuhr timing
  const dhuhrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'zohar'
  );

  // Find Asr timing
  const asrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'asr'
  );

  // Find Maghrib timing
  const maghribTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'magrib'
  );

  // Find Isha timing
  const ishaTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'isha'
  );

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-5 text-xl font-bold text-green-500">
        Namaz Timings for Masjid:{' '}
        {namazTimings.length > 0 ? namazTimings[0].masjid_id : 'Unknown'}
      </Text>
      <View>
        <Text className="mb-4 text-lg font-bold text-green-500">
          Fajr: {fajrTiming ? fajrTiming.time : 'Unknown'}
        </Text>
        <Text className="mb-4 text-lg font-bold text-green-500">
          Dhuhr: {dhuhrTiming ? dhuhrTiming.time : 'Unknown'}
        </Text>
        <Text className="mb-4 text-lg font-bold text-green-500">
          Asr: {asrTiming ? asrTiming.time : 'Unknown'}
        </Text>
        <Text className="mb-4 text-lg font-bold text-green-500">
          Maghrib: {maghribTiming ? maghribTiming.time : 'Unknown'}
        </Text>
        <Text className="mb-4 text-lg font-bold text-green-500">
          Isha: {ishaTiming ? ishaTiming.time : 'Unknown'}
        </Text>
      </View>
      {/* Music Play Button */}
    </View>
  );
};

export default NamazTimingsScreen;
