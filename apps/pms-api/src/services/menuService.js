import { Menu } from '../models/Menu.js';

export async function listMenus() {
  return await Menu.find({}).sort({ order: 1 });
}
