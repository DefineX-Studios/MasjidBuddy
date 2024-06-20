import { create } from 'zustand';

import * as supabase from '../supabase';
import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { AuthMethods, getToken, removeToken, setToken } from './utils';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';

  _setAndStore: (token: TokenType) => void;

  signIn: (type: keyof typeof AuthMethods) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,

  _setAndStore(token: TokenType) {
    setToken(token);
    set({ status: 'signIn', token });
  },

  async signIn(type: keyof typeof AuthMethods) {
    const method = AuthMethods[type];

    if (!method) return;

    const idToken = await method.signIn();
    console.log(idToken);
    if (!idToken) return;

    const token = await supabase.login(idToken, type);
    if (!token) return;
    console.log(token);
    this._setAndStore(token);
  },
  signOut: () => {
    const userType = getToken();

    //sign out from the auth provider
    if (userType) {
      const method = AuthMethods[userType.type];
      if (method) {
        method.initialize();
        method.signOut();
      }
    }

    removeToken();
    set({ status: 'signOut', token: null });
  },

  /**
   * runs the signIn/signOut function again so that status is updated,
   * triggering splash screen to go away and root-navigator to decide which navigator to use
   */
  async hydrate() {
    try {
      const token = getToken();

      if (token !== null) {
        const newToken = await supabase.setSession(token);
        if (newToken == null) {
          console.error('unable to re authenticate, logging out...');
          get().signOut();
          return;
        }

        this._setAndStore(newToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const signIn = (type: keyof typeof AuthMethods) =>
  _useAuth.getState().signIn(type);
