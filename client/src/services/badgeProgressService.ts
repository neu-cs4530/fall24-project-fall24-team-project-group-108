import api from './config';
import { Badge } from '../types';

const BADGE_PROGRESS_API_URL = `${process.env.REACT_APP_SERVER_URL}/badgeProgress`;

/**
 * Gets all the badges from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const updateBadgeProgress = async (user: string, category: string): Promise<Badge[]> => {
  const res = await api.post(`${BADGE_PROGRESS_API_URL}/update?username=${user}`, {
    username: user,
    category,
  });
  if (res.status !== 200) {
    throw new Error('Error while updating badge progress');
  }

  return res.data;
};

export default updateBadgeProgress;
