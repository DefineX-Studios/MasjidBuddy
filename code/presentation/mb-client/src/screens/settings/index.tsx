import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import * as React from 'react';

import { useAuth } from '@/core';
import { FocusAwareStatusBar, ScrollView, View } from '@/ui';

import { Item } from './item';
import { ItemsContainer } from './items-container';
import { LanguageItem } from './language-item';
import { ThemeItem } from './theme-item';

export const Settings = () => {
  const signOut = useAuth.use.signOut();
  const { navigate } = useNavigation();

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <View>
            <ItemsContainer title="settings.generale">
              <Item text={t('Sign in')} onPress={() => navigate('Login')} />
            </ItemsContainer>
          </View>

          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
