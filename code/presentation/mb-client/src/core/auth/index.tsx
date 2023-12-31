import { create } from 'zustand';

import { supabaseLogin } from '../supabase';
import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { AuthMethods, getToken, removeToken, setToken } from './utils';

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
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const signIn = async (type: keyof typeof AuthMethods) => {
  const method = AuthMethods[type];

  if (!method) return;

  const idToken = await method.signIn();
  if (!idToken) return;

  const session = await supabaseLogin(idToken, type);
  if (!session) return;

  await _useAuth.getState().signIn({
    access: session.access_token,
    refresh: session.refresh_token,
    type,
  });
};
