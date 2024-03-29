import { getItem, removeItem, setItem } from '@/core/storage';

import { googleAuthMethod } from './google-signin';

const TOKEN = 'token';

// key should match provider parameter required by supabase
export const AuthMethods = {
  google: googleAuthMethod,
};

export type AuthMethod = {
  type: keyof typeof AuthMethods;
  initialize: () => void;
  signIn: () => Promise<string | null>;
  signOut: () => void;
};

export type TokenType = {
  access: string;
  refresh: string;
  type: keyof typeof AuthMethods;
};

//todo this is pretty unreadable, u dont get any idea that this is only saving in storage
//  maybe create tokenStorage object which get,set,remove functions
export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
