import { create } from 'zustand';

import { createSelectors } from '../utils';
import { googleAuthMethod } from './googleSignIn';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

// when new auth provider is added, need to include it in this list too
const methods = [googleAuthMethod];

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';

  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },
  signOut: () => {
    const userType = getToken();

    //sign out from the auth provider
    if (userType) {
      const method = methods.find((m) => m.type === userType.type);
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
  hydrate: () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        get().signIn(userToken);
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
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
