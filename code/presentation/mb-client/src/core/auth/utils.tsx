import { getItem, removeItem, setItem } from '@/core/storage';

import { googleAuthMethod } from './googleSignIn';

const TOKEN = 'token';

export type AuthMethodList = {
  Google: undefined;
};

export type AuthMethod = {
  type: keyof AuthMethodList;
  initialize: () => void;
  signIn: () => Promise<string | null>;
  signOut: () => void;
};

export type TokenType = {
  access: string;
  refresh: string;
  type: keyof AuthMethodList;
};

export const methods: AuthMethod[] = [googleAuthMethod];

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
