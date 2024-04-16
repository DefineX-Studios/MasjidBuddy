/* eslint-disable max-lines-per-function */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import type { Details, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';

import { useLocation } from '@/api/location';
import type { MasjidWithDistance } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { Text, View } from '@/ui';
import { useSearch } from '@/ui/core/search-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});

const onRegionChangeComplete = (region: Region, details: Details) => {
  console.log(
    `region changed: ${JSON.stringify(region)} | ${JSON.stringify(details)}`
  );
};

const SelectMasjidView = (selectedMasjidWithDistance: MasjidWithDistance) => {
  return (
    <View className="border-r-5 border-#ccc mt-10 p-10">
      <View>
        <Text className="mb-5 bg-green-300">
          Masjid Name: {selectedMasjidWithDistance.masjid.name}
        </Text>
        <Text className="mb-5 bg-green-300">
          Distance: {selectedMasjidWithDistance.distance} km
        </Text>
        <Text className="mb-5 bg-green-300">
          Address: {selectedMasjidWithDistance.masjid.address.line1}
        </Text>
        <Text className="mb-5 bg-green-300">
          Next-Namaz:{' '}
          {
            getNextNamaz(
              new Date().toLocaleTimeString(),
              selectedMasjidWithDistance.masjid.namaz_timings
            ).namaz
          }
        </Text>
      </View>
    </View>
  );
};

export const FindMasjid = () => {
  const { navigate } = useNavigation();
  const {
    data: masjidsWithDistance,
    isLoading: _isLoading,
    isError: _isError,
  } = useMasjids();
  const mapRef = React.createRef<MapView>();

  const [selectedMasjidWithDistance, setSelectedMasjidWithDistance] =
    useState<MasjidWithDistance>();

  const { userLocation } = useLocation();
  const SearchView = useSearch(
    masjidsWithDistance ?? [],
    setSelectedMasjidWithDistance,
    (masjidWithDistance) => masjidWithDistance.masjid.name
  );

  return (
    <View className="flex-1 bg-gray-100 pb-6">
      <>{SearchView}</>

      {userLocation && (
        <View className="flex-1 pb-20 ">
          <View className="h-3 flex-1">
            <MapView
              ref={mapRef}
              onRegionChangeComplete={onRegionChangeComplete}
              style={styles.map}
              region={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              {masjidsWithDistance &&
                masjidsWithDistance.map((marker: MasjidWithDistance) => (
                  <Marker
                    key={marker.masjid.id}
                    coordinate={{
                      latitude: marker.masjid.latitude,
                      longitude: marker.masjid.longitude,
                    }}
                    title={marker.masjid.name}
                    onPress={() => setSelectedMasjidWithDistance(marker)}
                  />
                ))}

              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Location"
                  pinColor="blue"
                />
              )}
            </MapView>
          </View>
        </View>
      )}

      {selectedMasjidWithDistance && (
        <SelectMasjidView {...selectedMasjidWithDistance} />
      )}

      <View className="bg-orange-200">
        <Button
          title="Open"
          onPress={() => {
            if (!selectedMasjidWithDistance) return;
            navigate('MasjidScreen', {
              selectedMasjidId: selectedMasjidWithDistance.masjid.id,
            });
          }}
        />
      </View>
    </View>
  );
};
