import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import secrets from 'secrets.json';

// Create a single supabase client for interacting with your database
const supabase = createClient(secrets.supabase.url, secrets.supabase.key);

export const supabaseLogin = async (idToken: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  console.log(error, data);
  return data.session;
};
