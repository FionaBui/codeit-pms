const GRAPH = 'https://graph.microsoft.com/v1.0';

const SELECT =
  'id,displayName,mail,userPrincipalName,jobTitle,accountEnabled';

/** Follow @odata.nextLink until exhausted or maxPages (tenant-size guard). */
export async function listAllTenantUsers(graphAccessToken, maxPages = 50) {
  const users = [];
  let url = `${GRAPH}/users?$select=${SELECT}&$top=999&$orderby=displayName`;
  let pages = 0;

  while (url && pages < maxPages) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${graphAccessToken}` }
    });
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(`Graph ${res.status}: ${text}`);
      err.status = res.status;
      throw err;
    }
    const body = JSON.parse(text);
    users.push(...(body.value ?? []));
    url = body['@odata.nextLink'] ?? null;
    pages += 1;
  }

  return users;
}
