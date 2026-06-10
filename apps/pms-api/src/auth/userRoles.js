/**
 * Resolves app roles from the access token `roles` claim.
 * Roles are assigned in Entra ID: Enterprise application → Users and groups.
 *
 * @param {{ auth?: object }} options
 * @returns {Set<string>}
 */
export function resolveUserRoles({ auth }) {
  const roles = auth?.roles;
  if (!Array.isArray(roles)) return new Set();

  return new Set(
    roles
      .filter((role) => typeof role === 'string' && role.trim())
      .map((role) => role.trim())
  );
}
