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
    <View className="flex-1 bg-gray-100 ">
      <TextInput
        className="bg-gray-200"
        placeholder="Search"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <View className="h-20 flex-1 pb-2 pt-10">
        <FlashList
          data={searchQuery ? filteredMasjids : []}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="h-02 flex-1 bg-gray-200"
              onPress={() => handleItemSelect(item)}
            >
              <Text
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'green',
                  display: 'flex',
                }}
              >
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
