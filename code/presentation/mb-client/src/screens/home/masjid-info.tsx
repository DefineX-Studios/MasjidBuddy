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
});

const MasjidInfo = () => {
  const { params } = useRoute<RouteProp<'MasjidInfo'>>();
  const selectedMasjidId = params.selectedMasjidId;

  const [masjidInfo, setMasjidInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasjidDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query the masjid details data from Supabase based on the selectedMasjidId
        const { data: masjidDetails, error: masjidError } = await supabase
          .from('masjid')
          .select('*')
          .eq('id', selectedMasjidId);

        if (masjidError) {
          throw new Error('Error fetching masjid details');
        }

        if (!masjidDetails || masjidDetails.length === 0) {
          throw new Error('Masjid details not found');
        }

        // Set the fetched masjid details
        setMasjidInfo(masjidDetails[0]); // Wrap in array if needed
      } catch (error) {
        setError('Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasjidDetails();
  }, [selectedMasjidId]);

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
    <View style={styles.container}>
      <Text style={styles.text}>Name: {masjidInfo.name}</Text>
      <Text style={styles.text}>
        Address: {masjidInfo.address.line1}, {masjidInfo.address.line2},{' '}
        {masjidInfo.address.pin}
      </Text>
      <Text style={styles.text}>Mobile: {masjidInfo.mobile}</Text>
    </View>
  );
};

export default MasjidInfo;
