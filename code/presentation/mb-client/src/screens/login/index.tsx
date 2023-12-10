import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

import { signIn } from '@/core';
import { googleAuthMethod } from '@/core/auth/googleSignIn';
import { FocusAwareStatusBar } from '@/ui';

export const Login = () => {
  googleAuthMethod.initialize();
  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn('Google')}
      />
    </>
  );
};
