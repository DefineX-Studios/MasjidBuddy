import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Login, Settings } from '@/screens';
export type SettingsStackParamList = {
  Login: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);
