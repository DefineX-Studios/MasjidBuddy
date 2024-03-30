import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import type { MasjidWithDistance } from '@/api/masjid';
import { useMasjids } from '@/api/masjid/use-masjids';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/ui';

import { MasjidCard } from './masjid';

export const HomeScreen = () => {
  const navigation = useNavigation(); // Correct usage of useNavigation hook
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

        <TouchableOpacity
          style={{ backgroundColor: '#ddd', padding: 10 }}
          onPress={() => {
            navigation.navigate('FindMasjid'); // Correct usage of navigation object
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Replace the Search component with your actual search icon */}
            <Text style={{ flex: 1, textAlign: 'center' }}>
              FIND NEARBY MASJIDS
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
