import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '@/core';
import { googleAuthMethod } from '@/core/auth/google-signin';
import { Button, FocusAwareStatusBar } from '@/ui';

export const Login = () => {
  googleAuthMethod.initialize();
  const { navigate } = useNavigation();
  

  return (
    <>
      <FocusAwareStatusBar />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn('google')}
      />
      <Button label="Whatsapp login" onPress={()=>{
      navigate("whatsAppLogin",)
      }} />
    </>
  );
};
