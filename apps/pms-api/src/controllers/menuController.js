import { listMenus } from '../services/menuService.js';

export async function getMenus(req, res, next) {
  try {
    const menus = await listMenus();

    res.status(200).json({
      data: menus
    });
  } catch (err) {
    next(err);
  }
}
