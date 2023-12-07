import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

import { googleSignIn, initializeGoogleSignIn } from '@/core';
import { FocusAwareStatusBar } from '@/ui';

export const Login = () => {
  initializeGoogleSignIn();
  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => googleSignIn()}
      />
    </>
  );
};
