const GRAPH_SCOPE = 'https://graph.microsoft.com/User.Read';
const GRAPH_ME_URL = 'https://graph.microsoft.com/v1.0/me?$select=jobTitle';

function resolveClientId() {
  const explicit = process.env.AAD_CLIENT_ID?.trim();
  if (explicit) return explicit;

  const audience = process.env.AAD_AUDIENCE?.trim();
  if (!audience) return null;

  return audience.replace(/^api:\/\//i, '');
}

function resolveTenantId(auth) {
  const explicit = process.env.AAD_TENANT_ID?.trim();
  if (explicit) return explicit;
  if (auth?.tid) return auth.tid;

  const match = auth?.iss?.match(/login\.microsoftonline\.com\/([^/]+)/);
  return match?.[1] ?? null;
}

function isOboConfigured() {
  return Boolean(resolveClientId() && process.env.AAD_CLIENT_SECRET?.trim());
}

async function acquireGraphTokenOnBehalfOf(accessToken, auth) {
  const clientId = resolveClientId();
  const clientSecret = process.env.AAD_CLIENT_SECRET?.trim();
  const tenantId = resolveTenantId(auth);

  if (!clientId || !clientSecret || !tenantId) {
    return null;
  }

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    client_id: clientId,
    client_secret: clientSecret,
    assertion: accessToken,
    scope: GRAPH_SCOPE,
    requested_token_use: 'on_behalf_of',
  });

  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }
  );

  if (!tokenRes.ok) {
    const detail = await tokenRes.text();
    console.warn('Graph OBO token request failed:', tokenRes.status, detail);
    return null;
  }

  const tokenData = await tokenRes.json();
  return typeof tokenData.access_token === 'string' ? tokenData.access_token : null;
}

async function graphOboGet({ accessToken, auth, url }) {
  if (!accessToken || !isOboConfigured()) {
    return null;
  }

  try {
    const graphToken = await acquireGraphTokenOnBehalfOf(accessToken, auth);
    if (!graphToken) return null;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${graphToken}` },
    });

    if (!res.ok) {
      const detail = await res.text();
      console.warn('Graph request failed:', res.status, detail);
      return null;
    }

    return res.json();
  } catch (err) {
    console.warn('Graph OBO request failed:', err);
    return null;
  }
}

/**
 * Resolves the signed-in user's job title via Microsoft Graph (OBO).
 * Returns null when OBO is not configured or Graph is unavailable.
 *
 * @param {{ accessToken: string, auth?: object }} options
 * @returns {Promise<string|null>}
 */
export async function fetchUserJobTitleFromGraph({ accessToken, auth }) {
  const profile = await graphOboGet({ accessToken, auth, url: GRAPH_ME_URL });
  const jobTitle = profile?.jobTitle;

  return typeof jobTitle === 'string' && jobTitle.trim() ? jobTitle.trim() : null;
}
