import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
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

const renderItem = (
  { item }: { item: any } // Adjust the type as needed
) => (
  <MasjidCard
    {...item}
    onPress={() => console.info(`${item.masjid.name} pressed`)} // Adjust the property access based on the actual item structure
  />
);

const HomeScreenContent = ({
  filteredMasjids,
  isLoading,
  navigate,
}: {
  filteredMasjids: any;
  isLoading: boolean;
  navigate: any;
}) => (
  <View style={{ flex: 1 }}>
    <FocusAwareStatusBar />
    <FlashList
      data={filteredMasjids}
      renderItem={renderItem}
      numColumns={2}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyList isLoading={isLoading} />}
      estimatedItemSize={20}
    />
    <Pressable
      style={{ backgroundColor: '#f0f0f0', padding: 10 }}
      onPress={() => navigate('FindMasjid')}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Search />
        <Text style={{ flex: 1, textAlign: 'center' }}>
          FIND NEARBY MASJIDS
        </Text>
      </View>
    </Pressable>
  </View>
);

export const HomeScreen = () => {
  const { navigate } = useNavigation(); // Correct usage of useNavigation hook
  const [subscribedMasjids, setSubscribedMasjids] = useState<any[]>([]); // Adjust the type as needed
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubscribedFetched, setIsSubscribedFetched] =
    useState<boolean>(false);

  const result = useMasjids();
  const { data, isLoading: masjidIsLoading, isError: masjidIsError } = result;

  // Function to fetch subscribed masjids
  const fetchSubscribedMasjids = async () => {
    try {
      const response = await masjid.getSubscribed();
      if (response.error) {
        throw new Error(response.error.message);
      }
      const subscribed = response.data; // Adjust the property access based on the actual response structure
      setSubscribedMasjids(subscribed);
      console.log(subscribed);
      setIsLoading(false);
      setIsSubscribedFetched(true);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('Error fetching subscribed masjids:', error);
    }
  };

  // Fetch subscribed masjids only once when the component mounts
  if (!isSubscribedFetched) {
    fetchSubscribedMasjids();
  }

  // Handle errors
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

  return (
    <HomeScreenContent
      filteredMasjids={filteredMasjids}
      isLoading={isLoading}
      navigate={navigate}
    />
  );
};
