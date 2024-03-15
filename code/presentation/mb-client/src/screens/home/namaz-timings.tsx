/* eslint-disable max-lines-per-function */
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { createClient } from '@supabase/supabase-js';
import { Env } from 'env';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MasjidWithDistance } from '@/api/masjid';

type NamazTimingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NamazTimingsScreen'>;
};

// Define the type for the navigation stack
type RootStackParamList = {
  NamazTimingsScreen: { selectedMasjidId: string }; // Define the screen name and the parameter type
  // Add other screens if needed
};

// Define the type for the route props
type NamazTimingsScreenRouteProp = RouteProp<
  RootStackParamList,
  'NamazTimingsScreen'
>;

const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_KEY);

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
});

const NamazTimingsScreen: React.FC<NamazTimingsScreenProps> = ({
  // eslint-disable-next-line unused-imports/no-unused-vars
  navigation,
}) => {
  const [masjidsWithDistance, setMasjidsWithDistance] = useState<
    MasjidWithDistance[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<NamazTimingsScreenRouteProp>();

  const { selectedMasjidId } = route.params; // Get selected masjid ID from route params

  useEffect(() => {
    const fetchMasjids = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Query the masjids data from Supabase
        const { data: masjidsData, error: masjidsError } = await supabase
          .from('masjids')
          .select('*');
        if (masjidsError) {
          throw new Error('Error fetching masjids');
        }
        // Query the namaz timings data from Supabase
        const { data: namazTimingsData, error: timingsError } = await supabase
          .from('namaz_timings')
          .select('*');
        if (timingsError) {
          throw new Error('Error fetching namaz timings');
        }
        // Map the fetched masjid data to match the MasjidWithDistance type
        const masjidsWithDistance = masjidsData.map((masjid) => {
          const namazTimings = namazTimingsData.find(
            (timing) => timing.masjid_id === masjid.id
          );
          return {
            masjid,
            distance: 0, // You need to calculate distance based on user location
            namazTimings,
          };
        });
        setMasjidsWithDistance(masjidsWithDistance);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error');
      }
    };

    fetchMasjids();
  }, []);

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

  // Find the selected masjid by ID
  const selectedMasjid = masjidsWithDistance.find(
    (masjid) => masjid.masjid.id === selectedMasjidId
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Namaz Timings for Masjid: {selectedMasjid?.masjid.name}
      </Text>
      {/* Display the namaz timings for the selected masjid */}
      {selectedMasjid?.masjid.namaz_timings && (
        <View>
          <Text style={styles.text}>
            Fajr: {selectedMasjid.masjid.namaz_timings.fajar}
          </Text>
          <Text style={styles.text}>
            Dhuhr: {selectedMasjid.masjid.namaz_timings.zohar}
          </Text>
          <Text style={styles.text}>
            Asr: {selectedMasjid.masjid.namaz_timings.asr}
          </Text>
          <Text style={styles.text}>
            Maghrib: {selectedMasjid.masjid.namaz_timings.magrib}
          </Text>
          <Text style={styles.text}>
            Isha: {selectedMasjid.masjid.namaz_timings.isha}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NamazTimingsScreen;
