import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import React from 'react';

import { fetchNamazTimings } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Text, View } from '@/ui';

export const NamazTimingsScreen = () => {
  const { params } = useRoute<RouteProp<'NamazTimingsScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;

  const {
    data: namazTimings,
    isLoading,
    error,
  } = useQuery(
    ['namazTimings', selectedMasjidId], // Query key
    () => fetchNamazTimings(selectedMasjidId), // Query function
    { enabled: !!selectedMasjidId } // Option to enable/disable query based on selectedMasjidId
  );

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
          Error: {'error'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-5 text-xl font-bold text-green-500">
        Namaz Timings for Masjid:{' '}
        {namazTimings && namazTimings.length > 0
          ? namazTimings[0].masjid_id
          : 'Unknown'}
      </Text>
      <View>
        {namazTimings &&
          namazTimings.map((timing, index) => (
            <Text key={index} className="mb-4 text-lg font-bold text-green-500">
              {timing.namaz}: {timing.time}
            </Text>
          ))}
      </View>
      {/* Music Play Button */}
    </View>
  );
};
