# @codeit/api

Reusable HTTP client + runtime configuration for frontend apps.

This package is intentionally **auth-provider-agnostic**: it knows how to
load runtime config and build an Axios client that asks *someone else* for
a token. MSAL-specific helpers live in [`@codeit/auth/msal`](../auth).

## Install

```bash
npm install axios
```

## Runtime config

Apps ship `/config.json` (or any URL you choose) so the same build can be
deployed to multiple environments:

```json
{
  "api": {
    "baseUrl": "https://api.example.com",
    "scopes": ["api://<app-id>/access_as_user"]
  }
}
```

`scopes` is only required if the consumer is going to acquire tokens for
those scopes (e.g. MSAL).

## API

### Runtime config

- `loadRuntimeConfig(options?)` — fetch and cache config. Options:
  - `configUrl` (default `/config.json`)
  - `throwOnError` (default `false`; when `false`, returns `{}` and logs a warning)
- `getApiBaseUrl(options?)` — returns `api.baseUrl`, normalized (no trailing slash). Throws if missing.
- `getApiScopes(options?)` — returns `api.scopes` as a string array (defaults to `[]`).
- `resetRuntimeConfigCache()` — clears the cache (tests, or when config changes).

Failed config loads are not cached, so a transient failure can be retried.

### HTTP client

- `createApiClient(options)` — low-level Axios factory.
  - `baseUrl` (required)
  - `accessToken?: string` — static Bearer token. Use for tokens that don't change per request (PAT, API key, env-injected secret).
  - `getToken?: () => Promise<string|null>` — called on every request to fetch a fresh token. Use for tokens that rotate (MSAL/OAuth).
  - `accessToken` and `getToken` are mutually exclusive; passing both throws.
  - `axiosConfig?` — extra Axios options (timeout, headers, etc.). `baseURL` is always overridden by `baseUrl`.
  - `onRequest?`, `onResponse?`, `onError?` — extra interceptors.

- `createRuntimeApiClient(options?)` — same as `createApiClient`, but reads `baseUrl` from runtime config.

Neither factory caches the resulting client. Apps that want a singleton
should wrap the call themselves, so cache ownership is explicit.

## Usage

### Anonymous client

```js
import { createRuntimeApiClient } from '@codeit/api';

const client = await createRuntimeApiClient();
const res = await client.get('/projects');
```

### With a static token (PAT, API key)

```js
import { createRuntimeApiClient } from '@codeit/api';

const client = await createRuntimeApiClient({
  accessToken: import.meta.env.VITE_API_TOKEN,
});
```

### With a rotating token

```js
import { createRuntimeApiClient } from '@codeit/api';

const client = await createRuntimeApiClient({
  getToken: () => myAuth.getAccessToken(),
});
```

### With MSAL

Use `@codeit/auth/msal`:

```js
import { createAuthedApiClient } from '@codeit/auth/msal';

const client = await createAuthedApiClient({ instance });
```

`createAuthedApiClient` attaches a fresh MSAL token on every request, so
tokens never go stale during a session. If MSAL requires interactive
sign-in, the failing request rejects with `MsalInteractionRequiredError`.

### Adding interceptors

```js
const client = await createRuntimeApiClient({
  onRequest: (config) => {
    config.headers.set('x-correlation-id', crypto.randomUUID());
    return config;
  },
  onError: (err) => {
    // normalize errors here
    return Promise.reject(err);
  },
});
```
