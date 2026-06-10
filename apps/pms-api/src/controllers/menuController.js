import { resolveUserRoles } from '../auth/userRoles.js';
import { resolveUserJobTitle } from '../auth/userProfile.js';
import { listMenusForUser } from '../services/menuService.js';

export async function getMenus(req, res, next) {
  try {
    const userRoles = resolveUserRoles({ auth: req.auth });
    const jobTitle = await resolveUserJobTitle({
      auth: req.auth,
      accessToken: req.accessToken,
    });

    console.log(req.auth?.name, ' - ', jobTitle, ' - roles:', [...userRoles]);

    const menus = await listMenusForUser({ jobTitle, userRoles });

    res.status(200).json({
      data: menus,
    });
  } catch (err) {
    next(err);
  }
}
