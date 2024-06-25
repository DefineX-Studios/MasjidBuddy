/* eslint-disable max-lines-per-function */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { masjid } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Pressable, Text, View } from '@/ui';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
  },
  mapContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export const MasjidInfoScreen = () => {
  const { data: masjidsWithDistance, isLoading, isError } = useMasjids();
  const { params } = useRoute<RouteProp<'MasjidInfoScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;
  const { navigate } = useNavigation();

  const [calledGetdbMasjid, setCalledGetdbMasjid] = useState(false);
  const [isSubscribed, setSubscribed] = useState(false);
  const [isSubscriptionLoaded, setSubscriptionLoaded] = useState(false);

  const getdbMasjid = async () => {
    console.log(selectedMasjidId);
    const dbMasjidValue = await masjid.isSubscribed(selectedMasjidId);
    setSubscribed(dbMasjidValue);
    console.log('Our masjid is ' + dbMasjidValue);
    setSubscriptionLoaded(true);
    setCalledGetdbMasjid(true);
  };

  if (!calledGetdbMasjid) {
    getdbMasjid();
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !masjidsWithDistance) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occurred while fetching masjid data.</Text>
      </View>
    );
  }

  const selectedMasjid = masjidsWithDistance.find(
    (masjid) => masjid.masjid.id === selectedMasjidId
  );

  if (!selectedMasjid) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Selected masjid not found.</Text>
      </View>
    );
  }

  const masjidInfo = selectedMasjid.masjid;

  const nextNamaz = getNextNamaz(
    new Date().toLocaleTimeString(),
    selectedMasjid.masjid.namaz_timings
  );

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await masjid.unsubscribe(selectedMasjidId);
        console.log(`You unsubscribed from ${selectedMasjidId}`);
      } else {
        const response = await masjid.subscribe(selectedMasjidId);
        console.log(response);
      }
      setSubscribed((prevSubscribed) => !prevSubscribed);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900" contentContainerStyle={{ alignItems: 'center', padding: 10 }}>
      <Text className="mb-5 text-xl font-bold text-green-500">
        {selectedMasjid.masjid.name}
      </Text>
      <Text className="mb-4 text-lg font-bold text-green-500">
        Next Namaz: {nextNamaz.namaz}
      </Text>
      <Text className="mb-4 text-lg font-bold text-green-500">
        Namaz Time: {nextNamaz.time}
      </Text>

      <Pressable
        className="mb-6 flex flex-row items-center bg-green-500 p-3"
        onPress={() => {
          navigate('NamazTimingsScreen', { selectedMasjidId });
        }}
      >
        <Text className="flex-1 text-center">Namaz Timings</Text>
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

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: selectedMasjid.masjid.latitude,
            longitude: selectedMasjid.masjid.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{
              latitude: selectedMasjid.masjid.latitude,
              longitude: selectedMasjid.masjid.longitude,
            }}
            title={selectedMasjid.masjid.name}
          />
        </MapView>
      </View>

      <Text className="mb-4 text-lg font-bold text-green-500">
        Address: {masjidInfo.address.line1}, {masjidInfo.address.line2}, {masjidInfo.address.pin}
      </Text>

      

      {isSubscriptionLoaded ? (
        isSubscribed ? (
          <Pressable
            onPress={handleSubscribe}
            className="mt-6 mb-0 flex flex-row items-center bg-white p-3"
          >
            <Text className="flex-1 text-center text-green-700">UnSubscribe</Text>
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
        <Text className="mb-4 text-lg font-bold text-green-500">Checking subscription status...</Text>
      )}
    </ScrollView>
  );
};
