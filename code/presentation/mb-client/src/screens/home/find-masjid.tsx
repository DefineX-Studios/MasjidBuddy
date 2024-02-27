import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { enableLatestRenderer } from 'react-native-maps';

import type { MasjidWithDistance } from '@/api/masjid/types';
import { useMasjids } from '@/api/masjid/use-masjids';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight / 2,
  },
  map: {
    width: windowWidth,
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
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

const FindMasjid = () => {
  const result = useMasjids();
  const { data: masjidsWithDistance } = result;
  const [userLocation, setUserLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  if (!userLocation) {
    fetchUserLocation(setUserLocation);
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: userLocation?.latitude || 0,
            longitude: userLocation?.longitude || 0,
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
      <View style={{ position: 'absolute', top: 10, width: '100%' }}>
        <TextInput
          style={{
            borderRadius: 10,
            margin: 10,
            color: '#000',
            borderColor: '#666',
            backgroundColor: '#FFF',
            borderWidth: 1,
            height: 45,
            paddingHorizontal: 10,
            fontSize: 18,
          }}
          placeholder={'Search'}
          placeholderTextColor={'#666'}
        />
      </View>
    </View>
  );
};

enableLatestRenderer();

export default FindMasjid;
