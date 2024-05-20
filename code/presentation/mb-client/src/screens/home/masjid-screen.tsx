/* eslint-disable max-lines-per-function */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';

import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { masjid } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Pressable, Text, View } from '@/ui';
export const MasjidScreen = () => {
  const { data: masjidsWithDistance, isLoading, isError } = useMasjids();
  const { params } = useRoute<RouteProp<'MasjidScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;
  const { navigate } = useNavigation();

  const [isSubscribed, setSubscribed] = useState(false);
  const [calledGetdbMasjid, setCalledGetdbMasjid] = useState(false);
  const getdbMasjid = async () => {
    const dbMasjidValue = await masjid.isSubscribed(selectedMasjidId);

    setSubscribed(dbMasjidValue); // Update isSubscribed state
    setCalledGetdbMasjid(true);
  };

  if (!calledGetdbMasjid) {
    getdbMasjid();
    setCalledGetdbMasjid(true);
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !masjidsWithDistance) {
    return (
      <View>
        <Text>Error occurred while fetching masjid data.</Text>
      </View>
    );
  }

  const selectedMasjid = masjidsWithDistance.find(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (masjid) => masjid.masjid.id === selectedMasjidId
  );

  if (!selectedMasjid) {
    return (
      <View>
        <Text>Selected masjid not found.</Text>
      </View>
    );
  }

  const nextNamaz = getNextNamaz(
    new Date().toLocaleTimeString(),
    selectedMasjid.masjid.namaz_timings
  );

  // Navigation function for subscribing
  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await masjid.unsubscribe(selectedMasjidId);
        console.log(`You unsubscribed from ${selectedMasjidId}`);
      } else {
        // Make the API request to subscribe
        const response = await masjid.subscribe(selectedMasjidId);
        console.log(response);
        // If the request succeeds, update the client state
      }
      setSubscribed(!isSubscribed);
    } catch (error) {
      // If the request fails, handle the error
      console.error('Error subscribing:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-5 text-xl font-bold text-green-500">
        {selectedMasjid.masjid.name}
      </Text>
      <Text className="mb-4 text-lg font-bold text-green-500">
        Next Namaz: {nextNamaz.namaz}
      </Text>
      {/* <Text className="mb-4 text-lg font-bold text-green-500">
        Masjid Distance: {selectedMasjid.distance.toFixed(2)} km
      </Text> */}
      <Text className="mb-4 text-lg font-bold text-green-500">
        Namaz Time: {nextNamaz.time}
      </Text>

      {/* Conditional rendering for the subscription button */}

      {/* Other navigation buttons */}
      <Pressable
        className="mb-6 flex flex-row items-center bg-green-500 p-3"
        onPress={() => {
          navigate('NamazTimingsScreen', { selectedMasjidId });
        }}
      >
        <Text className="flex-1 text-center">Namaz Timings</Text>
      </Pressable>

      <Pressable
        className="mb-6 flex flex-row items-center bg-green-500 p-3"
        onPress={() => {
          navigate('MasjidInfo', { selectedMasjidId });
        }}
      >
        <Text className="flex-1 text-center">Masjid Info</Text>
      </Pressable>

      <Pressable
        className="mb-6 flex flex-row items-center bg-green-500 p-9"
        onPress={() => {
          navigate('AudioScreen');
        }}
      >
        <Text variant="lg" className="flex-1 text-center">
          Audio Live
        </Text>
      </Pressable>
      <Pressable
        className="mb-9 flex flex-row items-center bg-green-500 p-3"
        onPress={() => {
          navigate('VideoScreen');
        }}
      >
        <Text className="flex-1 text-center">Video Offline</Text>
      </Pressable>

      {isSubscriptionLoaded ? (
        isSubscribed ? (
          <Pressable
            onPress={handleSubscribe}
            className="mt-23 mb-0 flex flex-row items-center bg-gray-200 p-3"
          >
            <Text className="flex-1 text-center  text-green-700">
              UnSubscribe
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSubscribe}
            className="flex flex-row items-center bg-red-500 p-4"
          >
            <Text className="flex-1 text-center">Subscribe</Text>
          </Pressable>
        )
      ) : (
        <Pressable
          onPress={handleSubscribe}
          className="flex flex-row items-center bg-red-500 p-4"
        >
          <Text className="flex-1 text-center">Subscribe</Text>
        </Pressable>
      )}
    </View>
  );
};
