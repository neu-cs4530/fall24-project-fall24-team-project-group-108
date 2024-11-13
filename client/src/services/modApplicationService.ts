import { ModApplication, User } from '../types';
import api from './config';

const MODAPPLICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/modApplication`;

/**
 * Creates a new application in the database if not already present.
 *
 * @param user - The User who applied.
 * @param applicationText - The additional text provided by the user in the application.
 *
 * @returns the new ModApplication object added to the database or already present one.
 */
const submitModApplication = async (
  user: User,
  applicationText: string,
): Promise<ModApplication> => {
  const data = { modApplication: { user, applicationText } };
  const res = await api.post(`${MODAPPLICATION_API_URL}/createModApplication`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating mod application');
  }
  return res.data;
};

/**
 * Gets all applications in the database.
 *
 * @returns A list of all the ModApplication documents in the database.
 */
const getModApplications = async (): Promise<ModApplication[]> => {
  const res = await api.get(`${MODAPPLICATION_API_URL}/getModApplications`);
  if (res.status !== 200) {
    throw new Error('Error while retrieving mod applications');
  }
  return res.data;
};

/**
 * Updates an application's status in the database.
 *
 * @param username - The username of the user whose application will be deleted.
 *
 * @returns A boolean which evaluates to true if an object was deleted, and false if there was an error.
 */
const updateModApplicationStatus = async (
  username: string,
  accepted: boolean,
): Promise<boolean> => {
  const data = { username, accepted };
  const res = await api.post(`${MODAPPLICATION_API_URL}/updateModApplicationStatus`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating mod application status');
  }
  return res.data;
};

export { submitModApplication, getModApplications, updateModApplicationStatus };
