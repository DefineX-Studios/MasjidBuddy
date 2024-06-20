import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import type { AuthMethod } from './utils';
import { Env } from '@env'; // Assuming you have environment variables

export const facebookAuthMethod: AuthMethod = {
  type: 'facebook',
  initialize: () => {
    Settings.setAppID("471978288574638"); // Set your Facebook App ID
    Settings.initializeSDK();
  },
  signIn: async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        console.log('Login cancelled');
        return null;
      }

      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        console.log('Something went wrong obtaining access token');
        return null;
      }
      const idToken = data.accessToken;
      return idToken;
    } catch (error: any) {
      console.error(`${error}`);
      return null;
    }
  },
  signOut: () => {
    LoginManager.logOut();
  },
};
