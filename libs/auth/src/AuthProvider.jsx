import { AuthContext } from './AuthContext';

/**
 * Provider-agnostic auth wrapper. Pass the value from any implementation
 * (MSAL, Google, custom). Use with MsalAuthProvider, GoogleAuthProvider, etc.
 */
export function AuthProvider({ value, children }) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
