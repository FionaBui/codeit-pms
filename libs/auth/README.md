# @codeit/auth

Provider-agnostic auth library. Use one implementation (MSAL, Google, custom) and the same `useAuth()` API everywhere.

## Core (provider-agnostic)

- **`AuthProvider`** – Wraps the app; receives the auth implementation value.
- **`useAuth()`** – Returns `{ user, isAuthenticated, isLoading, error, login, logout }`.
- **`LoginButton`** – Button that calls `login()` (label customizable).
- **`RequireAuth`** – Protects routes; redirects to login when not authenticated.
- **`Login`** – Simple login page (centered `LoginButton`).

## Implementations

### MSAL (Microsoft)

```js
import { MsalAuthProvider, createMsalInstanceFromConfig } from '@codeit/auth/msal';

<MsalAuthProvider getInstance={createMsalInstanceFromConfig}>
  <App />
</MsalAuthProvider>
```

- Put `clientId`, `authority`, `redirectUri` in your app’s `/public/config.json` under `msal`.
- Use `useAuth()` from `@codeit/auth` for logout, user, etc.

### Google or custom (later)

1. Create e.g. `libs/auth/src/google/GoogleAuthProvider.jsx` that:
   - Wraps your Google/custom provider.
   - Reads user/loading from that provider and maps to the same shape: `{ user, isAuthenticated, isLoading, login, logout }`.
   - Renders `<AuthProvider value={mappedValue}>{children}</AuthProvider>`.
2. Export it as `@codeit/auth/google` (add `"./google": ...` in package.json exports).
3. In the app, wrap with `<GoogleAuthProvider>` instead of `MsalAuthProviderAsync`. All `useAuth()` and `RequireAuth` / `Login` / `LoginButton` usage stays the same.
