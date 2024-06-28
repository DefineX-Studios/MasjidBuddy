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
    flex: 1, // we had to use css as native wind didn't work with Mapview
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
    <View className=" border-#ccc">
      <View>
        <Text className=" bg-green-300">
          Masjid Name: {selectedMasjidWithDistance.masjid.name}
        </Text>
        <Text className=" bg-green-300">
          Distance: {selectedMasjidWithDistance.distance} km
        </Text>
        <Text className=" bg-green-300">
          Address: {selectedMasjidWithDistance.masjid.address.line1}
        </Text>
        <Text className=" bg-green-300">
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

const OpenButton = (selectedMasjidWithDistance: MasjidWithDistance) => {
  const { navigate } = useNavigation();
  return (
    <View className="bg-orange-200">
      <Button
        title="Open"
        onPress={() => {
          if (!selectedMasjidWithDistance) return;
          navigate('MasjidInfoScreen', {
            selectedMasjidId: selectedMasjidWithDistance.masjid.id,
          });
        }}
      />
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const CustomMapView = function ({
  userLocation,
  mapRef,
  masjidsWithDistance,
  setSelectedMasjidWithDistance,
  selectedMasjidWithDistance,
}: {
  userLocation: any;
  mapRef: any;
  masjidsWithDistance: any;
  setSelectedMasjidWithDistance: any;
  selectedMasjidWithDistance: any;
}) {
  return (
    <MapView
      ref={mapRef}
      onRegionChangeComplete={onRegionChangeComplete}
      style={styles.map}
      region={
        selectedMasjidWithDistance
          ? {
              latitude: selectedMasjidWithDistance.masjid.latitude,
              longitude: selectedMasjidWithDistance.masjid.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }
          : userLocation
          ? {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }
          : {
              latitude: 19.076,
              longitude: 72.8777,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }
      }
    >
      {/* Markers for masjids */}
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

      {/* User location marker */}

      {/* Marker for selected masjid */}
      {selectedMasjidWithDistance && selectedMasjidWithDistance.masjid && (
        <Marker
          coordinate={{
            latitude: selectedMasjidWithDistance.masjid.latitude,
            longitude: selectedMasjidWithDistance.masjid.longitude,
          }}
          title={selectedMasjidWithDistance.masjid.name}
          pinColor="orange"
        />
      )}
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="Your Location"
          pinColor="blue"
        />
      )}
    </MapView>
  );
};

export const FindMasjid = () => {
  const {
    data: masjidsWithDistance,
    isLoading: _isLoading,
    isError: _isError,
  } = useMasjids();
  const mapRef = React.createRef<MapView>();

  const [selectedMasjidWithDistance, setSelectedMasjidWithDistance] =
    useState<MasjidWithDistance>();

  const { userLocation } = useLocation();
  const [userLocationOverride, setUserLocationOverride] = useState<any>(null);

  console.log(userLocationOverride);
  const SearchView = useSearch(
    masjidsWithDistance ?? [],
    (selectedMasjidWithDistance) => {
      if (
        selectedMasjidWithDistance &&
        typeof selectedMasjidWithDistance !== 'function'
      ) {
        // Update userLocationOverride to the coordinates of the selected masjid
        setUserLocationOverride({
          latitude: selectedMasjidWithDistance.masjid.latitude,
          longitude: selectedMasjidWithDistance.masjid.longitude,
        });
        // Set the selected masjid with distance
        setSelectedMasjidWithDistance(selectedMasjidWithDistance);
      }
    },
    (masjidWithDistance) => masjidWithDistance.masjid.name
  );
  return (
    <View className="flex-1 border bg-gray-100 pt-10">
      <View className=" w-100 h-100 flex-1 border">{SearchView}</View>

      <View className="pb-03 flex-1">
        <View className="w-50 h-50  flex-1 border">
          <CustomMapView
            userLocation={userLocation}
            mapRef={mapRef}
            masjidsWithDistance={masjidsWithDistance}
            setSelectedMasjidWithDistance={setSelectedMasjidWithDistance}
            selectedMasjidWithDistance={selectedMasjidWithDistance}
          />
        </View>
      </View>

      {selectedMasjidWithDistance && (
        <SelectMasjidView {...selectedMasjidWithDistance} />
      )}

      {selectedMasjidWithDistance && (
        <OpenButton {...selectedMasjidWithDistance} />
      )}
    </View>
  );
};
