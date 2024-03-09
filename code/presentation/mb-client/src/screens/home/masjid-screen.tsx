import * as Location from 'expo-location';
import React, { useState } from 'react';

import type { MasjidWithDistance, NamazTimings } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';
import { Text, View } from '@/ui';

const MasjidScreen = () => {
  const { data: masjidsWithDistance, isLoading, error } = useMasjids();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  if (!userLocation) {
    fetchUserLocation();
  }

  const calculateDistance = (userLocation: any, masjid: MasjidWithDistance) => {
    // Implement distance calculation logic here
    return masjid.distance; // Placeholder value, replace with actual calculation
  };

  const renderNamazTimings = (namazTimings: NamazTimings) => {
    return (
      <View>
        <Text>Fajr: {namazTimings.fajar}</Text>
        <Text>Zohar: {namazTimings.zohar}</Text>
        <Text>Jummah: {namazTimings.jummah}</Text>
        <Text>Asr: {namazTimings.asr}</Text>
        <Text>Maghrib: {namazTimings.magrib}</Text>
        <Text>Isha: {namazTimings.isha}</Text>
      </View>
    );
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error:</Text>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {masjidsWithDistance &&
        masjidsWithDistance.map((masjid) => (
          <View key={masjid.masjid.id} style={{ marginBottom: 20 }}>
            <Text variant="h2">{masjid.masjid.name}</Text>
            <Text>Distance: {calculateDistance(userLocation, masjid)} km</Text>
            {masjid.masjid.namaz_timings &&
              renderNamazTimings(masjid.masjid.namaz_timings)}
          </View>
        ))}
    </View>
  );
};

export default MasjidScreen;
