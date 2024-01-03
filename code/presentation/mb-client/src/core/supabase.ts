import 'react-native-url-polyfill/auto';

import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

import type { AuthMethods } from './auth/utils';

// Create a single supabase client for interacting with your database
export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_KEY);

export const supabaseLogin = async (
  idToken: string,
  provider: keyof typeof AuthMethods
) => {
  const { data, error: _ } = await supabase.auth.signInWithIdToken({
    provider,
    token: idToken,
  });
  return data.session;
};
