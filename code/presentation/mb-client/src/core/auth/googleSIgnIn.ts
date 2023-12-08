import { GoogleSignin } from '@react-native-google-signin/google-signin';
import secrets from 'secrets.json';

export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: secrets.googleSignIn.webClientId,
  });
};

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(JSON.stringify(userInfo));
    return userInfo.idToken;
  } catch (error: any) {
    console.error(`error: ${error.code}`);
  }

  return null;
};
