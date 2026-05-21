import { listUsersFromSevera, getUserByIdFromSevera } from '../services/severa/severaUserService.js';

export async function getSeveraUsers(req, res, next) {
  try {
    const { data, nextPageToken } = await listUsersFromSevera(req.query);

    if (nextPageToken) {
      res.setHeader('NextPageToken', nextPageToken);
    }

    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getSeveraUser(req, res, next) {
  try {
    const user = await getUserByIdFromSevera(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: { code: 'not_found', message: 'User not found' },
      });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}
