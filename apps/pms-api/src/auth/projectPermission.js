import { Project } from '../models/Project.js';
import { resolveUserRoles } from './userRoles.js';
import {
  findResourceByDisplayName,
  getDisplayNameFromAuth,
  PMS_ADMIN_ROLE,
} from './userIdentity.js';

/**
 * @param {Set<string>} roles
 * @returns {boolean}
 */
export function isPmsAdmin(roles) {
  return roles.has(PMS_ADMIN_ROLE);
}

/**
 * @param {{ roles: Set<string>, resourceId?: string|null, project: object }} options
 * @returns {boolean}
 */
export function canManageProject({ roles, resourceId, project }) {
  if (isPmsAdmin(roles)) return true;

  if (!resourceId || !project?.manager) return false;

  return project.manager === resourceId;
}

/**
 * Resolves permission context for the current request.
 *
 * @param {{ auth?: object }} req
 * @returns {Promise<{ roles: Set<string>, displayName: string|null, resourceId: string|null }>}
 */
export async function buildPermissionContext(req) {
  const roles = resolveUserRoles({ auth: req.auth });
  const displayName = getDisplayNameFromAuth(req.auth);
  const resource = await findResourceByDisplayName(displayName);

  return {
    roles,
    displayName,
    resourceId: resource?._id ?? null,
  };
}

/**
 * Loads a project and verifies the caller may manage it.
 *
 * @param {{ auth?: object }} req
 * @param {string} projectId
 * @returns {Promise<
 *   | { ok: true, project: object, context: Awaited<ReturnType<typeof buildPermissionContext>> }
 *   | { ok: false, status: number, message: string }
 * >}
 */
export async function assertCanManageProject(req, projectId) {
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return { ok: false, status: 404, message: 'Project not found' };
  }

  const context = await buildPermissionContext(req);
  if (!canManageProject({ roles: context.roles, resourceId: context.resourceId, project })) {
    return {
      ok: false,
      status: 403,
      message: 'You do not have permission to manage this project',
    };
  }

  return { ok: true, project, context };
}
