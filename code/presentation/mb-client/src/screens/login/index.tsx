import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';

import { useAuth } from '@/core';
import { FocusAwareStatusBar } from '@/ui';

import { supabase } from '../../core/supabase';

export const Login = () => {
  const signIn = useAuth.use.signIn();
  // useSoftKeyboardEffect();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',
  });
  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.idToken,
              });
              console.log(error, data);
              signIn({ access: 'access-token', refresh: 'refresh-token' });
            } else {
              throw new Error('no ID token present!');
            }
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      />
    </>
  );
};
