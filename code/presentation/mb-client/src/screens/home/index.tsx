import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import { useMasjids } from '@/api/masjid/use-masjids';
import { masjid } from '@/core/supabase';
import {
  EmptyList,
  FocusAwareStatusBar,
  Pressable,
  Search,
  Text,
  View,
} from '@/ui';

import { MasjidCard } from './masjid';

const HomeScreenContent = ({
  filteredMasjids,
  isLoading,
  navigate,
  currentIndex,
  handleNext,
}: {
  filteredMasjids: any;
  isLoading: boolean;
  navigate: any;

  currentIndex: number;
  handleNext: () => void;
}) => (
  <View className="mb-20 flex-1">
    <FocusAwareStatusBar />
    {filteredMasjids && filteredMasjids.length > 0 ? (
      <>
        <MasjidCard
          {...filteredMasjids[currentIndex]}
          onPress={() =>
            navigate('MasjidScreen', {
              selectedMasjidId: filteredMasjids[currentIndex].masjid.id,
            })
          }
        />
        <Pressable className="self-center bg-gray-200 p-4" onPress={handleNext}>
          <Text>Next</Text>
        </Pressable>
      </>
    ) : (
      <EmptyList isLoading={isLoading} />
    )}
    <Pressable
      className="mt-80 bg-gray-200 p-4"
      onPress={() => navigate('FindMasjid')}
    >
      <View className="flex-row ">
        <Search />
        <Text className="flex-1 ">FIND NEARBY MASJIDS</Text>
      </View>
    </Pressable>
  </View>
);

export const HomeScreen = () => {
  const { navigate } = useNavigation();
  const [subscribedMasjids, setSubscribedMasjids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubscribedFetched, setIsSubscribedFetched] =
    useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const result = useMasjids();
  const { data, isLoading: masjidIsLoading, isError: masjidIsError } = result;

  const fetchSubscribedMasjids = async () => {
    try {
      const response = await masjid.getSubscribed();
      if (response.error) {
        throw new Error(response.error.message);
      }
      const subscribed = response.data;
      setSubscribedMasjids(subscribed);
      setIsLoading(false);
      setIsSubscribedFetched(true);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('Error fetching subscribed masjids:', error);
    }
  };

  if (!isSubscribedFetched) {
    fetchSubscribedMasjids();
  }

  if (isError || (!masjidIsLoading && data == null) || masjidIsError) {
    return (
      <View>
        <Text>Error Loading data</Text>
      </View>
    );
  }

  const filteredMasjids = data?.filter((killnumber) =>
    subscribedMasjids.some(
      (subscribedMasjid) => subscribedMasjid.id === killnumber.masjid.id
    )
  );

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (filteredMasjids?.length ?? 0)
    );
  };

  return (
    <HomeScreenContent
      filteredMasjids={filteredMasjids}
      isLoading={isLoading}
      navigate={navigate}
      currentIndex={currentIndex}
      handleNext={handleNext}
    />
  );
};
