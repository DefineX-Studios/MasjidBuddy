import { GoogleSignin } from '@react-native-google-signin/google-signin';
import secrets from 'secrets.json';

import type { AuthMethod } from './utils';
import { AuthMethodType } from './utils';

export const googleAuthMethod: AuthMethod = {
  type: AuthMethodType.GOOGLE,
  initialize: () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: secrets.googleSignIn.webClientId,
    });
  },
  signIn: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return userInfo.idToken;
    } catch (error: any) {
      console.error(`error: ${error.code}`);
    }

    return null;
  },
  signOut: () => {
    GoogleSignin.signOut();
  },
};
