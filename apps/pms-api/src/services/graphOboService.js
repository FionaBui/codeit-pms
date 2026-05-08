import { ConfidentialClientApplication } from '@azure/msal-node';

/** Delegated Graph via OAuth 2.0 On-Behalf-Of (RFC 8693). */
function createOboClient() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      'Set AAD_TENANT_ID, AAD_CLIENT_ID, and AAD_CLIENT_SECRET for Microsoft Graph OBO.'
    );
  }
  return new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`
    }
  });
}

/**
 * @param {string} userApiAccessToken - Bearer token for this API (same aud as AAD_AUDIENCE).
 * @returns {Promise<string>}
 */
export async function acquireGraphTokenOnBehalfOf(userApiAccessToken) {
  const cca = createOboClient();
  const result = await cca.acquireTokenOnBehalfOf({
    oboAssertion: userApiAccessToken,
    scopes: ['https://graph.microsoft.com/User.Read.All']
  });
  if (!result?.accessToken) {
    throw new Error('On-behalf-of token acquisition returned no access token.');
  }
  return result.accessToken;
}
