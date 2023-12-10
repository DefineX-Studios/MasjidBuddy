import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/ui';

export const HomeScreen = () => {
  return (
    <>
      <FocusAwareStatusBar />
      <View>
        <Text variant="h1">this is home</Text>
      </View>
    </>
  );
};
