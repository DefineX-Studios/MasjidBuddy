import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { MasjidWithDistance } from '@/api/masjid';
import { useMasjids } from '@/api/masjid/use-masjids';
import {
  EmptyList,
  FocusAwareStatusBar,
  Pressable,
  Search,
  Text,
  View,
} from '@/ui';

import { MasjidCard } from './masjid';

export const HomeScreen = () => {
  const { navigate } = useNavigation(); // Correct usage of useNavigation hook
  const result = useMasjids();
  const { data, isLoading, isError } = result;

  const renderItem = React.useCallback(
    ({ item }: { item: MasjidWithDistance }) => (
      <MasjidCard
        {...item}
        onPress={() => console.info(`${item.masjid.name} pressed`)}
      />
    ),
    []
  );

  if (isError || (!isLoading && data == null)) {
    return (
      <View>
        <Text> Error Loading data </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 ">
        <FocusAwareStatusBar />
        <FlashList
          data={data}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isLoading} />}
          estimatedItemSize={20}
        />

        <Pressable
          className="bg-neutral-50 p-3 dark:bg-charcoal-800"
          onPress={() => {
            navigate('FindMasjid');
          }}
        >
          <View className="flex flex-row items-center">
            <Search />

            <Text variant="md" className="flex-1 text-center">
              FIND NEARBY MASJIDS
            </Text>
          </View>
        </Pressable>
      </View>
    </>
  );
};
