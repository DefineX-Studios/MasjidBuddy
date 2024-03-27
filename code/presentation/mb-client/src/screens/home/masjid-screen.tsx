/* eslint-disable max-lines-per-function */
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { masjid } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  text: {
    color: 'green',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
});

const MasjidScreen = () => {
  const { data: masjidsWithDistance, isLoading, isError } = useMasjids();
  const { params } = useRoute<RouteProp<'MasjidScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !masjidsWithDistance) {
    return (
      <View>
        <Text>Error occurred while fetching masjid data.</Text>
      </View>
    );
  }

  const selectedMasjid = masjidsWithDistance.find(
    (masjid) => masjid.masjid.id === selectedMasjidId
  );

  if (!selectedMasjid) {
    return (
      <View>
        <Text>Selected masjid not found.</Text>
      </View>
    );
  }

  const nextNamaz = getNextNamaz(
    new Date().toLocaleTimeString(),
    selectedMasjid.masjid.namaz_timings
  );

  // Navigation function for subscribing
  const handleSubscribe = () => {
    masjid.subscribe(selectedMasjidId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Masjid Name: {selectedMasjid.masjid.name}</Text>
      <Text style={styles.text}>
        Masjid Address: {selectedMasjid.masjid.address.line1}
      </Text>
      <Text style={styles.text}>
        Masjid Distance: {selectedMasjid.distance.toFixed(2)} km
      </Text>
      <Text style={styles.text}>Next Namaz: {nextNamaz.time}</Text>

      {/* Button to subscribe */}
      <Button title="Subscribe" onPress={handleSubscribe} />

      {/* Other navigation buttons */}
      <Button
        title="Namaz Timings"
        onPress={() => {
          navigation.navigate('NamazTimingsScreen', { selectedMasjidId });
        }}
      />
      <Button
        title="Audio Live"
        onPress={() => {
          navigation.navigate('AudioScreen');
        }}
      />
      <Button
        title="Video Offline"
        onPress={() => {
          navigation.navigate('VideoScreen');
        }}
      />
      <Button
        title="Masjid Info"
        onPress={() => {
          navigation.navigate('MasjidInfo', { selectedMasjidId });
        }}
      />
    </View>
  );
};

export default MasjidScreen;
