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

/**
 * Gets all the badges earned by a given user from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const fetchEarnedUsers = async (badgeName: string): Promise<string[]> => {
  const res = await api.get(`${BADGE_API_URL}/getEarnedUsers/${badgeName}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching users');
  }

  return res.data;
};

/**
 * Fetches the badge category and tier for a user based on their profile icon.
 *
 * @param username - The username of the user.
 *
 * @returns An object containing the badge category and tier.
 */
export const getBadgeDetailsByUsername = async (
  username: string,
): Promise<{ category?: string; tier?: string; error?: string }> => {
  const res = await api.get(`${BADGE_API_URL}/getBadgeDetails`, {
    params: { username },
  });
  if (res.status !== 200) {
    throw new Error('Error while fetching badge details');
  }
  return res.data;
};

export default getAllBadges;
