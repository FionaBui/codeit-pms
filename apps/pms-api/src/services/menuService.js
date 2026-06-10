import { Menu } from '../models/Menu.js';

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

function hasAllowedRole(allowedRoles, userRoles) {
  return allowedRoles.some((role) => userRoles.has(role));
}

function canAccessMenu(menu, { jobTitle, userRoles }) {
  const allowedTitles = menu.allowedTitles ?? [];
  const allowedRoles = menu.allowedRoles ?? [];

  if (!allowedTitles.length && !allowedRoles.length) return true;

  if (allowedRoles.length && hasAllowedRole(allowedRoles, userRoles)) {
    return true;
  }

  if (!allowedTitles.length) return false;
  if (!jobTitle) return false;

  const normalized = normalizeTitle(jobTitle);
  return allowedTitles.some((title) => normalizeTitle(title) === normalized);
}

export async function listMenusForUser({ jobTitle, userRoles }) {
  const menus = await Menu.find({}).sort({ order: 1 });
  return menus.filter((menu) => canAccessMenu(menu, { jobTitle, userRoles }));
}
