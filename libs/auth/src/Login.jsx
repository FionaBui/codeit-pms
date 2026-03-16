import { LoginButton } from './LoginButton';

/**
 * Generic login page: a single login button. The label and behavior
 * come from the active auth provider (MSAL, Google, custom).
 * Override by using <LoginButton>Your label</LoginButton> in your own page.
 */
export function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <LoginButton>Login</LoginButton>
    </div>
  );
}
