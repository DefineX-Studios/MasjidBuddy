import React from 'react';

import { AddressString, type Masjid } from '@/api/masjid';
import { Image, Pressable, Text, View } from '@/ui';

type Props = Masjid & { onPress?: () => void };

export const MasjidCard = ({ name, address, onPress = () => {} }: Props) => {
  return (
    <Pressable
      className="m-2 block overflow-hidden rounded-xl  bg-neutral-200 p-2 shadow-xl dark:bg-charcoal-900"
      onPress={onPress}
    >
      <Image
        className="h-56 w-full object-cover "
        source={{
          uri: 'https://bookstack.definex.in/uploads/images/cover_bookshelf/2023-11/thumbs-440-250/360-f-158732220-nn9kmwnqglrqaar6jrdccpxt0omogovk.jpg',
        }}
      />

      <View>
        <Text variant="md" numberOfLines={1} className="font-bold">
          {name}
        </Text>
        <Text variant="xs" numberOfLines={3}>
          {AddressString(address)}
        </Text>
      </View>
    </Pressable>
  );
};
