import { Env } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import type { AuthMethod } from './utils';

export const googleAuthMethod: AuthMethod = {
  type: 'Google',
  initialize: () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: Env.GOOGLE_WEB_CLIENT_ID,
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
