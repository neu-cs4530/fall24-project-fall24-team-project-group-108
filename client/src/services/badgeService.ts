import api from './config';
import { Badge } from '../types';

const BADGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/badge`;

/**
 * Gets all the badges from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getAllBadges = async (): Promise<Badge[]> => {
  const res = await api.get(`${BADGE_API_URL}/allBadges`);
  if (res.status !== 200) {
    throw new Error('Error while fetching all badges');
  }
  return res.data;
};

/**
 * Gets all the badges earned by a given user from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const fetchBadgesByUser = async (user: string): Promise<Badge[]> => {
  const res = await api.get(`${BADGE_API_URL}/byUser/${user}`);
  if (res.status !== 200) {
    throw new Error('Error while updating badge progress');
  }

  return res.data;
};

export default getAllBadges;
