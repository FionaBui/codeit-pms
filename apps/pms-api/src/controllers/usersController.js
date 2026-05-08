import { acquireGraphTokenOnBehalfOf } from '../services/graphOboService.js';
import { listAllTenantUsers } from '../services/graphUsersService.js';

export async function getTenantUsers(req, res, next) {
  try {
    const apiToken = req.bearerToken;
    if (!apiToken) {
      return res.status(401).json({
        error: {
          code: 'unauthorized',
          message: 'Missing bearer token after authentication'
        }
      });
    }

    const graphToken = await acquireGraphTokenOnBehalfOf(apiToken);
    const users = await listAllTenantUsers(graphToken);
    res.status(200).json({ data: users });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes('Set AAD_TENANT_ID')
    ) {
      return res.status(503).json({
        error: {
          code: 'configuration_error',
          message: err.message
        }
      });
    }
    const status = err.status ?? err.statusCode;
    if (status === 401 || status === 403) {
      return res.status(status).json({
        error: {
          code: 'graph_authorization_failed',
          message:
            'Microsoft Graph refused directory access. Add delegated permission User.Read.All to codeit-pms, grant admin consent, and set AAD_CLIENT_SECRET.'
        }
      });
    }
    next(err);
  }
}
