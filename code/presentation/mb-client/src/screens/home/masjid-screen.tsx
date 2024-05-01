import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { useMasjids } from '@/api/masjid/use-masjids';
import { getNextNamaz } from '@/api/masjid/util';
import { masjid } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Pressable, Text, View } from '@/ui';

export const MasjidScreen = () => {
  const { data: masjidsWithDistance, isLoading, isError } = useMasjids();
  const { params } = useRoute<RouteProp<'MasjidScreen'>>();
  const selectedMasjidId = params.selectedMasjidId;
  const { navigate } = useNavigation();

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchIsSubscribed = async () => {
      const subscribed = await masjid.isSubscribed(selectedMasjidId);
      setIsSubscribed(subscribed);
    };

    fetchIsSubscribed();
  }, [selectedMasjidId]);

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await masjid.unsubscribe(selectedMasjidId);
        console.log(`You unsubscribed from ${selectedMasjidId}`);
      } else {
        const response = await masjid.subscribe(selectedMasjidId);
        console.log(response);
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError || !masjidsWithDistance) {
    return <ErrorMessage />;
  }

  const selectedMasjid = masjidsWithDistance.find(
    (m) => m.masjid.id === selectedMasjidId
  );

  if (!selectedMasjid) {
    return <Text>Selected masjid not found.</Text>;
  }

  const nextNamaz = getNextNamaz(
    new Date().toLocaleTimeString(),
    selectedMasjid.masjid.namaz_timings
  );

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mb-5 text-xl font-bold text-green-500">
        {selectedMasjid.masjid.name}
      </Text>
      <NamazInfo nextNamaz={nextNamaz} />
      <NavigationButtons
        navigate={navigate}
        selectedMasjidId={selectedMasjidId}
      />
      <SubscriptionButton
        onPress={handleSubscribe}
        isSubscribed={isSubscribed}
      />
    </View>
  );
};

const LoadingMessage = () => (
  <View>
    <Text>Loading...</Text>
  </View>
);

const ErrorMessage = () => (
  <View>
    <Text>Error occurred while fetching masjid data.</Text>
  </View>
);

const NamazInfo = ({ nextNamaz }: { nextNamaz: any }) => (
  <>
    <Text className="mb-4 text-lg font-bold text-green-500">
      Next Namaz: {nextNamaz.namaz}
    </Text>
    <Text className="mb-4 text-lg font-bold text-green-500">
      Namaz Time: {nextNamaz.time}
    </Text>
  </>
);

const NavigationButtons = ({
  navigate,
  selectedMasjidId,
}: {
  navigate: any;
  selectedMasjidId: any;
}) => (
  <>
    <Pressable
      className="mb-6 flex flex-row items-center bg-green-500 p-3"
      onPress={() => {
        navigate('NamazTimingsScreen', { selectedMasjidId });
      }}
    >
      <Text className="flex-1 text-center">Namaz Timings</Text>
    </Pressable>
    <Pressable
      className="mb-6 flex flex-row items-center bg-green-500 p-3"
      onPress={() => {
        navigate('MasjidInfo', { selectedMasjidId });
      }}
    >
      <Text className="flex-1 text-center">Masjid Info</Text>
    </Pressable>
    <Pressable
      className="mb-6 flex flex-row items-center bg-green-500 p-9"
      onPress={() => {
        navigate('AudioScreen');
      }}
    >
      <Text variant="lg" className="flex-1 text-center">
        Audio Live
      </Text>
    </Pressable>
    <Pressable
      className="mb-9 flex flex-row items-center bg-green-500 p-3"
      onPress={() => {
        navigate('VideoScreen');
      }}
    >
      <Text className="flex-1 text-center">Video Offline</Text>
    </Pressable>
  </>
);

const SubscriptionButton = ({
  onPress,
  isSubscribed,
}: {
  onPress: () => void;
  isSubscribed: boolean;
}) => (
  <Pressable
    onPress={onPress}
    className={`mt-23 mb-0 flex flex-row items-center ${
      isSubscribed ? 'bg-black' : 'bg-red-500'
    } p-3`}
  >
    <Text className="flex-1 text-center">
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </Text>
  </Pressable>
);

export default MasjidScreen;
