import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { MasjidWithDistance } from '@/api/masjid';
import { useMasjids } from '@/api/masjid/use-masjids';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/ui';

import { MasjidCard } from './masjid';

export const HomeScreen = () => {
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

  if (isError) {
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
      </View>
    </>
  );
};
