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

const getModApplications = async (): Promise<ModApplication[]> => {
  const res = await api.get(`${MODAPPLICATION_API_URL}/getModApplications`);
  if (res.status !== 200) {
    throw new Error('Error while retrieving mod applications');
  }
  return res.data;
};

const deleteModApplication = async (): Promise<void> => {
  const res = await api.delete(`${MODAPPLICATION_API_URL}/deleteModApplication`);
  if (res.status !== 200) {
    throw new Error('Error while deleting mod applications');
  }
  return res.data;
};

export { submitModApplication, getModApplications, deleteModApplication };
