import * as React from 'react';

import { Item } from './item';
import * as supabase from '@/core/supabase';

export const DebugItem = () => {
  const onPress = async () => {
    console.log("debug pressed");
  }

  return (
    <>
      <Item
        text="settings.debug"
        onPress={onPress}
      />
    </>
  );
};
