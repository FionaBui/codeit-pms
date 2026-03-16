import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Hook to access auth state and actions. Use in any component under an
 * AuthProvider (e.g. MsalAuthProvider). Works with any auth implementation.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
