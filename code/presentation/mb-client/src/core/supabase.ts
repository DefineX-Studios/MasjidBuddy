import 'react-native-url-polyfill/auto';

import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

import type { AuthMethods, TokenType } from './auth/utils';

// Create a single supabase client for interacting with your database
export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_KEY);

export const login = async (
  idToken: string,
  provider: keyof typeof AuthMethods
) => {
  const { data, error: _ } = await supabase.auth.signInWithIdToken({
    provider,
    token: idToken,
  });

  if(!data.session) return null;

  return {
    access: data.session.access_token,
    refresh: data.session.refresh_token,
    type: provider,
  };
};


export const setSession = async (token: TokenType) => {
  const { data, error } = await supabase.auth.setSession({
    access_token: token.access,
    refresh_token: token.refresh
  });

  if(!data.session) return null;

  return {
    access: data.session.access_token,
    refresh: data.session.refresh_token,
    type: token.type,
  };
}
