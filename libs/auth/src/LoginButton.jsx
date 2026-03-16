import { Button } from '@codeit/ui';
import { useAuth } from './useAuth';

/**
 * Generic login button. Calls the current auth provider's login (redirect or popup).
 * Pass children to customize label, e.g. <LoginButton>Sign in with Google</LoginButton>
 */
export function LoginButton({ children = 'Login', ...props }) {
  const { login, isLoading } = useAuth();

  return (
    <Button onClick={login} loading={isLoading} {...props}>
      {children}
    </Button>
  );
}
