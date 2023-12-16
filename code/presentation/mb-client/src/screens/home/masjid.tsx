import React from 'react';

import { type Masjid } from '@/api/masjid';
import { Pressable, Text, View } from '@/ui';

type Props = Masjid & { onPress?: () => void };

export const MasjidCard = ({ name, onPress = () => {} }: Props) => {
  return (
    <Pressable
      className="m-2 block w-11/12 overflow-hidden rounded-xl  bg-neutral-200 p-2 shadow-xl dark:bg-charcoal-900"
      onPress={onPress}
    >
      <View>
        <Text variant="md" className="pb-1 text-center font-bold">
          {name}
        </Text>
      </View>

      <View className="rounded-md bg-neutral-50 dark:bg-charcoal-800">
        <Text variant="xxs" className="pt-1 text-center">
          Next Namaz:
        </Text>
        <View className="py-4 align-bottom">
          <Text variant="xs" className="text-center">
            Magrib
          </Text>
          <Text variant="xs" className="text-center">
            06:30pm
          </Text>
        </View>

        <Text variant="xxs" className="pb-1 text-center">
          Within 50m
        </Text>
      </View>

      <View>
        <Text variant="xs" className="pt-1 text-center">
          Offline
        </Text>
      </View>
    </Pressable>
  );
};
