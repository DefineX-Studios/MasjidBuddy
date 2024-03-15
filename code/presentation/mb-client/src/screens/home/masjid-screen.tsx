import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useMasjids } from '@/api/masjid/use-masjids'; // Import the useMasjids hook
import { getNextNamaz } from '@/api/masjid/util'; // Import the getNextNamaz function

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
    borderWidth: 1, // Border width
    borderColor: 'green', // Border color
    padding: 10, // Padding around the text
    borderRadius: 5, // Border radius for box shape
  },
});

// eslint-disable-next-line max-lines-per-function
const MasjidScreen = (props: {
  route: {
    params: {
      selectedMasjidId:
        | string
        | number
        | boolean
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | Iterable<React.ReactNode>
        | React.ReactPortal
        | null
        | undefined;
    };
  };
}) => {
  const { data: masjidsWithDistance, isLoading, isError } = useMasjids(); // Call the useMasjids hook
  const selectedMasjidId = props.route.params.selectedMasjidId;
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

  // Calculate and set the next namaz time
  const nextNamaz = getNextNamaz(
    new Date().toLocaleTimeString(),
    selectedMasjid.masjid.namaz_timings
  );

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
      {/* Display other masjid details as needed */}
      <Button
        title="Namaz Timings"
        onPress={() => {
          navigation.navigate('NamazTimingsScreen', { selectedMasjidId });
          // Navigate to MasjidScreen with filtered masjids
        }}
      />
    </View>
  );
};

export default MasjidScreen;
