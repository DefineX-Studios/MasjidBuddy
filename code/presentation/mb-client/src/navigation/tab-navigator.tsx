import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import type { SvgProps } from 'react-native-svg';

import { entries, typeValidate as valueTypeValidator } from '@/core';
import { Settings, Style } from '@/screens';
import { HomeScreen } from '@/screens/home';
import {
  colors,
  Feed as FeedIcon,
  Home,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/ui';

import { FeedNavigator } from './feed-navigator';

const TabsInfo = valueTypeValidator({
  Home: {
    component: HomeScreen,
    label: 'Home',
    icon: (props: SvgProps) => <Home {...props} />,
  },
  Style: {
    component: Style,
    label: 'Style',
    icon: (props: SvgProps) => <StyleIcon {...props} />,
  },
  FeedNavigator: {
    component: FeedNavigator,
    label: 'Feed',
    icon: (props: SvgProps) => <FeedIcon {...props} />,
  },
  Settings: {
    component: Settings,
    label: 'Settings',
    icon: (props: SvgProps) => <SettingsIcon {...props} />,
  },
});

const Tab = createBottomTabNavigator<typeof TabsInfo>();

export type TabList<T extends keyof typeof TabsInfo> = {
  navigation: NativeStackNavigationProp<typeof TabsInfo, T>;
  route: RouteProp<typeof TabsInfo, T>;
};

type BarIconType = {
  name: keyof typeof TabsInfo;
  color: string;
};

const TabComponents = entries(TabsInfo).map(([name, tab]) => (
  <Tab.Screen
    key={name}
    name={name}
    component={tab.component}
    options={{
      title: tab.label,
      tabBarTestID: `${name}-tab`,
    }}
  />
));

const BarIcon = ({ color, name, ...reset }: BarIconType) => {
  const Icon = TabsInfo[name].icon;
  return <Icon color={color} {...reset} />;
};

export const TabNavigator = () => {
  const { colorScheme } = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor:
          colorScheme === 'dark' ? colors.charcoal[400] : colors.neutral[400],
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => <BarIcon name={route.name} color={color} />,
      })}
    >
      <Tab.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        {TabComponents}
      </Tab.Group>
    </Tab.Navigator>
  );
};
