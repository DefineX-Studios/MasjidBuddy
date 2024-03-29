import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Details, Region } from 'react-native-maps';
import MapView, { enableLatestRenderer, Marker } from 'react-native-maps';

import type { MasjidWithDistance, NamazTimings } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';

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
    backgroundColor: '#f0f0f0',
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
    color: '#333',
  },
  masjidDistance: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  masjidAddress: {
    fontSize: 16,
    color: '#666',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
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
const FindMasjid = (props: {
  navigation: {
    navigate: (arg0: string, arg1: { selectedMasjidId: number | null }) => void;
  };
}) => {
  const _navigation = useNavigation();
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
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />

        <FlatList
          data={searchQuery ? filteredMasjids : []}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleMarkerPress(item)}
            >
              <Text style={styles.listItemText}>{item.masjid.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.masjid.id.toString()}
        />
      </View>

      {userLocation && (
        <View style={styles.mapContainer}>
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
      )}

      <View style={styles.masjidDetailsContainer}>
        {selectedMasjidDetails && (
          <View>
            <Text style={styles.masjidName}>
              Masjid Name: {selectedMasjidDetails.masjid.name}
            </Text>
            <Text style={styles.masjidDistance}>
              Distance: {selectedMasjidDetails.distance} km
            </Text>
            <Text style={styles.masjidAddress}>
              Address: {selectedMasjidDetails.masjid.address.line1}
            </Text>
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

      <View style={styles.buttonContainer}>
        <Button
          title="Open"
          onPress={() => {
            props.navigation.navigate('MasjidScreen', {
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
