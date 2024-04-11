/* eslint-disable max-lines-per-function */
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';

import { supabase } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Text, View } from '@/ui';

const NamazTimingsScreen = () => {
  const { params } = useRoute<RouteProp<'NamazTimingsScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;

  const [namazTimings, setNamazTimings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNamazTimings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { data, error } = await supabase
        .from('namaz_timing')
        .select('*')
        .eq('masjid_id', selectedMasjidId);

      if (error) {
        throw error;
      }

      setNamazTimings(data);
      // eslint-disable-next-line @typescript-eslint/no-shadow, no-catch-shadow
    } catch (error) {
      setError('error ');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedMasjidId) {
    fetchNamazTimings();
  }

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

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-5 text-xl font-bold text-green-500">
        Namaz Timings for Masjid:{' '}
        {namazTimings.length > 0 ? namazTimings[0].masjid_id : 'Unknown'}
      </Text>
      <View>
        {namazTimings.map((timing, index) => (
          <Text key={index} className="mb-4 text-lg font-bold text-green-500">
            {timing.namaz}: {timing.time}
          </Text>
        ))}
      </View>
      {/* Music Play Button */}
    </View>
  );
};

export default NamazTimingsScreen;
