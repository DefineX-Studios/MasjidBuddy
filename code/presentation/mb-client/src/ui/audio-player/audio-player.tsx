import React from 'react';

import { Backward10s, Forward10s, Play, View } from '@/ui';

export const MusicPlayer = () => {
  return (
    <View className="flex-row justify-between">
      <View className="flex-auto">
        <Play />
      </View>
      <View className="flex-auto">
        <Backward10s />
      </View>
      <View className="flex-auto">
        <Forward10s />
      </View>
    </View>
  );
};
