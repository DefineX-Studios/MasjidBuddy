/* eslint-disable max-lines-per-function */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  handlePrevious,
}: {
  filteredMasjids: any;
  isLoading: boolean;
  navigate: any;
  currentIndex: number;
  handleNext: () => void;
  handlePrevious: any;
}) => (
  <View className="mb-20 flex-1">
    <FocusAwareStatusBar />
    {filteredMasjids && filteredMasjids.length > 0 ? (
      <>
        <View className="flex-row items-center justify-between">
          <Pressable
            className="self-start bg-white p-4"
            onPress={() =>
              navigate('MasjidInfoScreen', {
                selectedMasjidId: filteredMasjids[currentIndex].masjid.id,
              })
            }
          >
            <Icon name="info" size={20} color="red" />
          </Pressable>
          <Pressable
            className="self-center bg-gray-200 p-2"
            onPress={handlePrevious}
          >
            <Icon name="chevron-left" size={20} color="red" />
          </Pressable>
          <Pressable
            className="self-center bg-gray-200 p-2"
            onPress={handleNext}
          >
            <Icon name="chevron-right" size={20} color="red" />
          </Pressable>
          <Pressable
            className="self-end bg-white p-4"
            onPress={() =>
              navigate('SubscriptionScreen', {
                selectedMasjidId: filteredMasjids[currentIndex].masjid.id,
              })
            }
          >
            <Icon name="edit" size={20} color="red" />
          </Pressable>
        </View>
        <MasjidCard
          {...filteredMasjids[currentIndex]}
          onPress={() =>
            navigate('MasjidInfoScreen', {
              selectedMasjidId: filteredMasjids[currentIndex].masjid.id,
            })
          }
        />
      </>
    ) : (
      <EmptyList isLoading={isLoading} />
    )}
    <View>
      <Pressable
        className="mt-40 bg-gray-200 p-3 "
        onPress={() => navigate('FindMasjid')}
      >
        <View className="flex-row self-end">
          <Search />
          <Text className="p-l-10 flex-1">FIND NEARBY MASJIDS</Text>
        </View>
      </Pressable>
    </View>
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
  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + (filteredMasjids?.length ?? 0)) %
        (filteredMasjids?.length ?? 0)
    );
  };

  return (
    <HomeScreenContent
      filteredMasjids={filteredMasjids}
      isLoading={isLoading}
      navigate={navigate}
      currentIndex={currentIndex}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  );
};
