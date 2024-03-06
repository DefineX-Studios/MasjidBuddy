import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import FindMasjid from '@/screens/home/find-masjid';
import MasjidScreen from '@/screens/home/masjid-screen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  FindMasjid: undefined;
  MasjidScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const GoToMasjidScreen = () => {
  const { navigate } = useNavigation();

  return (
    <Pressable onPress={() => navigate('MasjidScreen')} style={{ padding: 10 }}>
      <View>Go to Masjid Screen</View>
    </Pressable>
  );
};

export const HomeNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            headerRight: () => <GoToMasjidScreen />,
          }}
        >
          <Stack.Screen name="FindMasjid" component={FindMasjid} />
          <Stack.Screen name="MasjidScreen" component={MasjidScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
