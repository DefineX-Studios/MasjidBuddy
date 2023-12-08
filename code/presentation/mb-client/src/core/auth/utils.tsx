import { getItem, removeItem, setItem } from '@/core/storage';

const TOKEN = 'token';

export enum AuthMethodType {
  NONE,
  GOOGLE,
}

export interface AuthMethod {
  type: AuthMethodType;
  initialize: () => void;
  signIn: () => Promise<string | null>;
  signOut: () => void;
}

export type TokenType = {
  access: string;
  refresh: string;
  type: AuthMethodType;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
