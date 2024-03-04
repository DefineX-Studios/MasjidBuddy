import * as Location from 'expo-location';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { enableLatestRenderer } from 'react-native-maps';

import type { MasjidWithDistance } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
  },
  map: {
    width: '100%',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 10,
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

const Map = ({
  userLocation,
  filteredMasjids,
  handleMarkerPress,
}: {
  userLocation: { latitude: number; longitude: number } | null;
  filteredMasjids: MasjidWithDistance[] | null;
  handleMarkerPress: (masjid: MasjidWithDistance) => void;
}) => (
  <MapView
    style={styles.map}
    region={{
      latitude: userLocation?.latitude || 0,
      longitude: userLocation?.longitude || 0,
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
      <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />
    )}
  </MapView>
);

const SearchInput = ({
  setSearchQuery,
  searchQuery,
}: {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
}) => (
  <TextInput
    style={styles.input}
    placeholder={'Search'}
    placeholderTextColor={'#666'}
    onChangeText={setSearchQuery} // Update search query state
    value={searchQuery} // Bind search query state to the input value
  />
);

const FindMasjid = () => {
  const result = useMasjids();
  const { data: masjidsWithDistance } = result;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [_matchedMasjid, setMatchedMasjid] =
    useState<MasjidWithDistance | null>(null);

  if (!userLocation) {
    fetchUserLocation(setUserLocation);
  }

  const handleMarkerPress = (masjid: MasjidWithDistance) => {
    // Set the matched masjid to navigate the user to its location
    setUserLocation({
      latitude: masjid.masjid.latitude,
      longitude: masjid.masjid.longitude,
    });
    setMatchedMasjid(masjid);
  };

  // Filter masjids based on search query
  const filteredMasjids =
    masjidsWithDistance?.filter((marker: MasjidWithDistance) =>
      marker.masjid.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          userLocation={userLocation}
          filteredMasjids={filteredMasjids}
          handleMarkerPress={handleMarkerPress}
        />
      </View>
      <View style={{ position: 'absolute', top: 10, width: '100%' }}>
        <SearchInput
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      </View>
    </View>
  );
};

enableLatestRenderer();

export default FindMasjid;
