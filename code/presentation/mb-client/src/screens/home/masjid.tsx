import React from 'react';

import type { MasjidWithDistance } from '@/api/masjid';
import { convertTimeToAMPM, getNextNamaz } from '@/api/masjid/util';
import { Pressable, Text, View } from '@/ui';

type Props = MasjidWithDistance & { onPress?: () => void };

export const MasjidCard = ({ distance, masjid, onPress = () => {} }: Props) => {
  const currentTime = new Date().toLocaleTimeString();
  const nextNamaz = getNextNamaz(currentTime, masjid.namaz_timings);

  // todo localize namaz names instead
  return (
    <Pressable
      className="m-2 block w-11/12 overflow-hidden rounded-xl  bg-neutral-200 p-2 shadow-xl dark:bg-charcoal-900"
      onPress={onPress}
    >
      <View>
        <Text variant="md" className="pb-1 text-center font-bold">
          {masjid.name}
        </Text>
      </View>

      <View className="rounded-md bg-neutral-50 dark:bg-charcoal-800">
        <Text variant="xxs" className="pt-1 text-center">
          Next Namaz:
        </Text>
        <View className="py-4 align-bottom">
          <Text variant="xs" className="text-center">
            {nextNamaz.namaz[0].toUpperCase()}
            {nextNamaz.namaz.slice(1)}
          </Text>
          <Text variant="xs" className="text-center">
            {convertTimeToAMPM(nextNamaz.time)}
          </Text>
        </View>

        <Text variant="xxs" className="pb-1 text-center">
          Within {distance.toFixed(2)}km
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
