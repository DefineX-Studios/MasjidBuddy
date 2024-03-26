import 'react-native-url-polyfill/auto';

import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

import type { AuthMethods, TokenType } from './auth/utils';

// Create a single supabase client for interacting with your database
// todo mohsin dont export supabase instead define all the functions u need which uses supabase here and then export those functions
export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_KEY);

export const login = async (
  idToken: string,
  provider: keyof typeof AuthMethods
) => {
  const { data, error: _ } = await supabase.auth.signInWithIdToken({
    provider,
    token: idToken,
  });

  if (!data.session) return null;

  return {
    access: data.session.access_token,
    refresh: data.session.refresh_token,
    type: provider,
  };
};

export const setSession = async (token: TokenType) => {
  const { data, error: _ } = await supabase.auth.setSession({
    access_token: token.access,
    refresh_token: token.refresh,
  });

  if (!data.session) return null;

  return {
    access: data.session.access_token,
    refresh: data.session.refresh_token,
    type: token.type,
  };
};

export const masjid = {
  async getAll() {
    return await supabase.rpc('get_masjids_with_namaz_timings');
  },

  async getSubscribed() {
    return await supabase.rpc('get_subscribed_masjids');
  },

  async subscribe(masjid_id: number) {
    return await supabase.rpc('subscribe_to_masjid', { masjid_id });
  },

  async unsubscribe(masjid_id: number) {
    return await supabase.rpc('unsubscribe_from_masjid', { masjid_id });
  },
};
