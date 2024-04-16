import * as Location from 'expo-location';
import { useState } from 'react';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  if (!userLocation) {
    fetchUserLocation(setUserLocation);
  }

  return { userLocation };
};

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
