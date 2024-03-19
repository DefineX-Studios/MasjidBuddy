/* eslint-disable max-lines-per-function */
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { supabase } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Dark grey background color
  },
  text: {
    color: 'green', // Green font color
    marginBottom: 10,
    fontSize: 18, // Increased font size
    fontWeight: 'bold', // Bold text
  },
  timingsContainer: {
    backgroundColor: '#FFF', // White background color for the container
    padding: 10, // Padding around the timings
    borderRadius: 5, // Rounded corners
  },
  timingsText: {
    marginBottom: 5, // Spacing between timings
  },
});

const NamazTimingsScreen = () => {
  const [namazTimings, setNamazTimings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { params } = useRoute<RouteProp<'NamazTimingsScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;

  useEffect(() => {
    const fetchNamazTimings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query the namaz timings data from Supabase based on the selectedMasjidId
        const { data: namazTimingsData, error: timingsError } = await supabase
          .from('namaz_timing')
          .select('*')
          .eq('masjid_id', selectedMasjidId);

        if (timingsError) {
          throw new Error('Error fetching namaz timings');
        }

        // Assuming namazTimingsData contains only one entry for the selected masjid

        // Set the fetched namaz timings
        setNamazTimings(namazTimingsData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error');
      }
    };

    fetchNamazTimings();
  }, [selectedMasjidId]); // Run this effect whenever selectedMasjidId changes

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
  console.log(namazTimings);
  const fajrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'fajar'
  );

  // Find Dhuhr timing
  const dhuhrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'zohar'
  );

  // Find Asr timing
  const asrTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'asr'
  );

  // Find Maghrib timing
  const maghribTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'magrib'
  );

  // Find Isha timing
  const ishaTiming = namazTimings.find(
    (timing: { namaz: string }) => timing.namaz === 'isha'
  );
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Namaz Timings for Masjid:{' '}
        {namazTimings.length > 0 ? namazTimings[0].masjid_id : 'Unknown'}
      </Text>
      {/* Display the namaz timings for the selected masjid */}
      <View style={styles.timingsContainer}>
        <Text style={styles.timingsText}>
          Fajr: {fajrTiming ? fajrTiming.time : 'Unknown'}
        </Text>
        <Text style={styles.timingsText}>
          Dhuhr: {dhuhrTiming ? dhuhrTiming.time : 'Unknown'}
        </Text>
        <Text style={styles.timingsText}>
          Asr: {asrTiming ? asrTiming.time : 'Unknown'}
        </Text>
        <Text style={styles.timingsText}>
          Maghrib: {maghribTiming ? maghribTiming.time : 'Unknown'}
        </Text>
        <Text style={styles.timingsText}>
          Isha: {ishaTiming ? ishaTiming.time : 'Unknown'}
        </Text>
      </View>
    </View>
  );
};

export default NamazTimingsScreen;
