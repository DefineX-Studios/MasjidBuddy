import 'react-native-url-polyfill/auto';

import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

import type { AuthMethods, TokenType } from './auth/utils';

// Create a single supabase client for interacting with your database
const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_KEY);

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
export const fetchMasjidDetails = async (selectedMasjidId: number) => {
  try {
    const { data: masjidDetails, error: masjidError } = await supabase
      .from('masjid')
      .select('*')
      .eq('id', selectedMasjidId);

    if (masjidError) {
      throw new Error('Error fetching masjid details');
    }

    if (!masjidDetails || masjidDetails.length === 0) {
      throw new Error('Masjid details not found');
    }

    return masjidDetails[0];
  } catch (error) {
    throw new Error('Error fetching masjid details');
  }
};

export const fetchNamazTimings = async (selectedMasjidId: number) => {
  try {
    const { data, error } = await supabase
      .from('namaz_timing')
      .select('*')
      .eq('masjid_id', selectedMasjidId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error('Error fetching namaz timings');
  }
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
    return await supabase
      .from('user_masjid_subscription')
      .insert([{ masjid_id: masjid_id }])
      .select();
  },

  async unsubscribe(masjid_id: number) {
    return await supabase
      .from('user_masjid_subscription')
      .delete()
      .eq('masjid_id', masjid_id);
  },
  async isSubscribed(masjid_id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_masjid_subscription')
      .select('*')
      .eq('masjid_id', masjid_id)
      .single(); // Use single() to ensure only one result is returned

    if (error) {
      return false;
    }

    return data !== null; // Return true if a masjid is found, false otherwise
  },
};
