import { createContext } from 'react';

/**
 * Minimal user shape shared across auth providers.
 * Each provider (MSAL, Google, custom) can map its user to this.
 */
export const defaultAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext(defaultAuthState);
