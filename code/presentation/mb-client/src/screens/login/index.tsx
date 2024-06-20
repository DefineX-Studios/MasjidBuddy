import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

import { signIn } from '@/core';
import {facebookAuthMethod} from '@/core/auth/facebook-signin';
import { googleAuthMethod } from '@/core/auth/google-signin';
import { Button, FocusAwareStatusBar } from '@/ui';

export const Login = () => {
  googleAuthMethod.initialize();
  facebookAuthMethod.initialize();

  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn('google')}
      />
      <Button label ="Facebook"onPress={() => signIn('facebook')}  />
     
    </>
  );
};
