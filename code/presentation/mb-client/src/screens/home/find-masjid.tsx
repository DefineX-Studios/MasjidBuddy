import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput } from 'react-native';
import type { Details, Region } from 'react-native-maps';
import MapView, { enableLatestRenderer, Marker } from 'react-native-maps';

import type { MasjidWithDistance, NamazTimings } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { Text, TouchableOpacity, View } from '@/ui';

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

const fetchUserLocation = async (setUserLocation: Function) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude, longitude });
  } catch (error) {
    console.error('Error getting user location:', error);
  }
};

const onRegionChangeComplete = (region: Region, details: Details) => {
  console.log(
    `region changed: ${JSON.stringify(region)} | ${JSON.stringify(details)}`
  );
};

// eslint-disable-next-line max-lines-per-function
const FindMasjid = () => {
  const navigation = useNavigation();
  const result = useMasjids();
  const mapRef = React.createRef<MapView>();

  const { data: masjidsWithDistance } = result;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMasjidId, setSelectedMasjidId] = useState<number>(0);

  const [selectedMasjidDetails, setSelectedMasjidDetails] =
    useState<MasjidWithDistance | null>(null);
  const [namazTimings, setNamazTimings] = useState<NamazTimings>(
    {} as NamazTimings
  );

  if (!userLocation) {
    fetchUserLocation(setUserLocation);
  }

  const handleMarkerPress = (masjid: MasjidWithDistance) => {
    const masjidId = masjid.masjid.id;
    setSelectedMasjidId(Number(masjidId));
    setSelectedMasjidDetails(masjid);
    setNamazTimings(masjid.masjid.namaz_timings);
    console.log('Selected Masjid ID:', masjidId);
  };

  const filteredMasjids =
    masjidsWithDistance?.filter((marker: MasjidWithDistance) =>
      marker.masjid.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  return (
    <View className="flex-1 bg-gray-100 pb-6">
      <View className="flex-1 bg-gray-100 pb-0 pt-20">
        <TextInput
          className="bg-gray-200"
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />

        <FlatList
          data={searchQuery ? filteredMasjids : []}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-gray-200"
              onPress={() => handleMarkerPress(item)}
            >
              <Text className="bg-green-500">{item.masjid.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.masjid.id.toString()}
        />
      </View>

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
              {filteredMasjids &&
                filteredMasjids.map((marker: MasjidWithDistance) => (
                  <Marker
                    key={marker.masjid.id}
                    coordinate={{
                      latitude: marker.masjid.latitude,
                      longitude: marker.masjid.longitude,
                    }}
                    title={marker.masjid.name}
                    onPress={() => handleMarkerPress(marker)}
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
      <View className="border-r-5 border-#ccc mt-10 p-10">
        {selectedMasjidDetails && (
          <View>
            <Text className="mb-5 bg-green-300">
              Masjid Name: {selectedMasjidDetails.masjid.name}
            </Text>
            <Text className="mb-5 bg-green-300">
              Distance: {selectedMasjidDetails.distance} km
            </Text>
            <Text className="mb-5 bg-green-300">
              Address: {selectedMasjidDetails.masjid.address.line1}
            </Text>
            <Text className="mb-5 bg-green-300">
              Next-Namaz:{' '}
              {
                getNextNamaz(new Date().toLocaleTimeString(), namazTimings)
                  .namaz
              }
            </Text>
          </View>
        )}
      </View>

      <View className="bg-orange-200">
        <Button
          title="Open"
          onPress={() => {
            navigation.navigate('MasjidScreen', {
              selectedMasjidId,
            });
          }}
        />
      </View>
    </View>
  );
};

enableLatestRenderer();

export default FindMasjid;
