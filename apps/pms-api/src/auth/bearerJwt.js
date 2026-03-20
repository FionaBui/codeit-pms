import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { getEnv } from '@codeit/utils';

function getBearerToken(req) {
  const raw = req.headers.authorization;
  if (!raw) return null;
  const [scheme, token] = raw.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

function getTenantId() {
  return process.env.AAD_TENANT_ID ?? 'common';
}

function buildJwksUri() {
  const explicit = process.env.AAD_JWKS_URI;
  if (explicit) return explicit;

  const tenantId = getTenantId();
  return `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
}

function buildIssuer() {
  const explicit = process.env.AAD_ISSUER;
  if (explicit) return explicit;

  const tenantId = getTenantId();
  return `https://login.microsoftonline.com/${tenantId}/v2.0`;
}

const AAD_ISSUER_PATTERN = /^https:\/\/login\.microsoftonline\.com\/[^/]+\/v2\.0$/;

function isMultiTenant() {
  const t = getTenantId();
  return t === 'common' || t === 'organizations' || t === 'consumers';
}

function buildAudienceList() {
  const raw = getEnv('AAD_AUDIENCE');
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const jwksClient = jwksRsa({
  cache: true,
  cacheMaxEntries: 10,
  cacheMaxAge: 10 * 60 * 1000,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: buildJwksUri(),
});

function getSigningKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({
        error: { code: 'unauthorized', message: 'Missing bearer token' },
      });
    }

    const audiences = buildAudienceList();
    const multiTenant = isMultiTenant();
    const opts = {
      algorithms: ['RS256'],
      audience: audiences.length === 1 ? audiences[0] : audiences,
    };
    if (!multiTenant) opts.issuer = buildIssuer();

    jwt.verify(token, getSigningKey, opts, (err, payload) => {
      if (err) {
        const errPayload = { code: 'unauthorized', message: 'Invalid access token' };
        if (process.env.NODE_ENV !== 'production') {
          errPayload.detail = err.message;
          try {
            const decoded = jwt.decode(token, { complete: true });
            if (decoded?.payload) {
              errPayload.tokenAud = decoded.payload.aud;
              errPayload.tokenIss = decoded.payload.iss;
              errPayload.expectedAudience = audiences;
            }
          } catch (_) {}
        }
        return res.status(401).json({ error: errPayload });
      }
      if (multiTenant && (!payload.iss || !AAD_ISSUER_PATTERN.test(payload.iss))) {
        return res.status(401).json({
          error: { code: 'unauthorized', message: 'Invalid access token' },
        });
      }
      req.auth = payload;
      next();
    });
  } catch (e) {
    next(e);
  }
}
