# @codeit/api

Shared API utilities for frontend apps: runtime config, MSAL token, and Axios client helpers.

## Install

Ensure peer dependencies are installed:

```bash
npm install axios @azure/msal-browser
```

`@azure/msal-browser` is optional if you only use `createApiClient` / `createRuntimeApiClient` without MSAL.

## Config

By default, the library loads config from `/config.json`. Expected shape:

```json
{
  "api": {
    "baseUrl": "http://localhost:3333",
    "scopes": ["api://your-app-id/pms.read"]
  }
}
```

Override the config URL via options (e.g. for tests or different apps):

```js
loadRuntimeConfig({ configUrl: '/my-config.json' });
getApiBaseUrl({ configUrl: '/my-config.json' });
createRuntimeApiClient({ configUrl: '/my-config.json' });
```

## API

### Runtime config

- `loadRuntimeConfig(options?)` – Load config (cached). Options: `configUrl`, `throwOnError`
- `getApiBaseUrl(options?)` – Get `api.baseUrl`
- `getApiScopes(options?)` – Get `api.scopes` array
- `resetRuntimeConfigCache()` – Clear config cache (tests, config changes)

### API client

- `createApiClient({ baseUrl, accessToken?, axiosConfig? })` – Create Axios client with baseURL and optional Bearer token
- `createRuntimeApiClient(options?)` – Create client from config (cached). Options: `configUrl`, `axiosConfig`
- `createAuthedApiClient({ instance, configUrl? })` – Create client with MSAL token (baseUrl + scopes from config)
- `resetRuntimeApiClientCache()` – Clear runtime client cache

### MSAL token

- `getMsalAccessToken({ instance, scopes })` – Get access token via `acquireTokenSilent`. Returns `null` if no account or empty scopes. May throw if interaction is required; callers should catch and trigger login.

## Usage

**Simple (no auth):**

```js
import { createRuntimeApiClient } from '@codeit/api';

const client = await createRuntimeApiClient();
const res = await client.get('/projects');
```

**With MSAL (e.g. in React hook):**

```js
import { useMsal } from '@azure/msal-react';
import { createAuthedApiClient } from '@codeit/api';

function useApiClient() {
  const { instance } = useMsal();
  const [client, setClient] = useState(null);

  useEffect(() => {
    createAuthedApiClient({ instance }).then(setClient);
  }, [instance]);

  return client;
}
```

Or compose manually:

```js
import { createApiClient, getApiBaseUrl, getApiScopes, getMsalAccessToken } from '@codeit/api';

const [baseUrl, scopes] = await Promise.all([getApiBaseUrl(), getApiScopes()]);
const token = await getMsalAccessToken({ instance, scopes });
const client = createApiClient({ baseUrl, accessToken: token });
```
