import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import React from 'react';
import { TextInput } from 'react-native';

import { Text, TouchableOpacity, View } from '@/ui';

export const useSearch = <T,>(
  list: T[],
  setSelectedMasjidWithDistance: React.Dispatch<
    React.SetStateAction<T | undefined>
  >,
  objToSearchString: (obj: T) => string
) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMasjids =
    list.filter((marker: T) =>
      objToSearchString(marker)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) ?? [];

  const handleItemSelect = (item: T) => {
    setSelectedMasjidWithDistance(item);
    setSearchQuery('');
  };

  return (
    <View className="flex-1 bg-gray-100 pb-0 pt-20">
      <TextInput
        className="bg-gray-200"
        placeholder="Search"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <View
        style={{ height: '100%', width: '100%' }}
        className="h-20 flex-1 pb-2 pt-10"
      >
        <FlashList
          data={searchQuery ? filteredMasjids : []}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-gray-200"
              onPress={() => handleItemSelect(item)}
            >
              <Text className="scroll-pb-10 bg-green-500 pb-10">
                {objToSearchString(item)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => objToSearchString(item)}
          estimatedItemSize={20}
        />
      </View>
    </View>
  );
};
