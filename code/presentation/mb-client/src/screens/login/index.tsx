import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

import { signIn } from '@/core';
import { googleSignIn, initializeGoogleSignIn } from '@/core/auth/googleSIgnIn';
import { supabaseLogin } from '@/core/supabase';
import { FocusAwareStatusBar } from '@/ui';

export const Login = () => {
  initializeGoogleSignIn();
  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          const idToken = await googleSignIn();
          if (!idToken) return;

          const session = await supabaseLogin(idToken);
          if (!session) return;

          await signIn({
            access: session.access_token,
            refresh: session.refresh_token,
          });
        }}
      />
    </>
  );
};
