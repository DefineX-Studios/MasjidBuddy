import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchMasjidDetails } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
  },
  map: {
    width: '50%',
    height: 200,
    padding:100 // Fixed height for the MapView
  },
  mapContainer: {
    width: '100%',
    marginBottom: 20,
    paddingLeft:90,
  },
});

export const MasjidInfo = () => {
  const { params } = useRoute<RouteProp<'MasjidInfo'>>();
  const selectedMasjidId = params.selectedMasjidId;

  const [masjidInfo, setMasjidInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Call fetchMasjidDetails when component mounts
  if (masjidInfo === null && isLoading) {
    fetchMasjidDetails(selectedMasjidId)
      .then((data) => {
        setMasjidInfo(data);
      })
      .catch((error) => {
        setError(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error: {error}</Text>
      </View>
    );
  }

  if (!masjidInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No masjid details found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.text}>Name: {masjidInfo.name}</Text>
      <Text style={styles.text}>
        Address: {masjidInfo.address.line1}, {masjidInfo.address.line2}, {masjidInfo.address.pin}
      </Text>
      <Text style={styles.text}>Mobile: {masjidInfo.mobile}</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: masjidInfo.latitude,
            longitude: masjidInfo.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{
              latitude: masjidInfo.latitude,
              longitude: masjidInfo.longitude,
            }}
            title={masjidInfo.name}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};
