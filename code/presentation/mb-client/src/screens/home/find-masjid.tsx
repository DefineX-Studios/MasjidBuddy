/* eslint-disable max-lines-per-function */

import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Details, enableLatestRenderer, Marker, Region } from 'react-native-maps';

import type { MasjidWithDistance, NamazTimings } from '@/api/masjid/types'; // Importing Masjid type
import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util'; // Importing getNextNamaz function and NamazTimings type

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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  masjidDetailsContainer: {
    backgroundColor: '#f0f0f0', // Light gray background color
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  masjidName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Dark gray font color
  },
  masjidDistance: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Slightly darker gray font color
  },
  masjidAddress: {
    fontSize: 16,
    color: '#666', // Medium gray font color
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

const onRegionChange = (region: Region, details: Details) => {
  console.log(`region changed: ${JSON.stringify(region)} | ${JSON.stringify(details)}`);
}

const FindMasjid = (props: {
  navigation: {
    navigate: (arg0: string, arg1: { selectedMasjidId: number | null }) => void;
  };
}) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const navigation = useNavigation();
  const result = useMasjids();
  const mapRef = React.createRef<MapView>();

  const { data: masjidsWithDistance } = result;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMasjidId, setSelectedMasjidId] = useState<number | null>(null);
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
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          onRegionChange={onRegionChange}
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
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="blue"
            />
          )}
        </MapView>
      </View>
      <View style={styles.masjidDetailsContainer}>
        {selectedMasjidDetails && (
          <View>
            <Text style={styles.masjidName}>
              Masjid Name: {selectedMasjidDetails.masjid.name}
            </Text>
            <Text style={styles.masjidDistance}>
              Distance: {selectedMasjidDetails.distance} km
            </Text>
            {/* Displaying the address below the masjid name */}
            <Text style={styles.masjidAddress}>
              Address: {selectedMasjidDetails.masjid.address.line1}
            </Text>
            {/* Displaying the next Namaz time below the address */}
            <Text style={styles.masjidAddress}>
              Next-Namaz:{' '}
              {
                getNextNamaz(new Date().toLocaleTimeString(), namazTimings)
                  .namaz
              }
            </Text>
          </View>
        )}
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={styles.input}
          placeholder={'Search'}
          placeholderTextColor={'#666'}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Open"
          onPress={() => {
            props.navigation.navigate('MasjidScreen', {
              selectedMasjidId,
            });
            // Navigate to MasjidScreen with filtered masjids
          }}
        />
      </View>
    </View>
  );
};

enableLatestRenderer();

export default FindMasjid;
