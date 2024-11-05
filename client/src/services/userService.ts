import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Authenticates the information provided by a user.
 *
 * @param username - The username of the user logging in.
 * @param password - The password of the user logging in.
 *
 * @returns the user corresponding to the information provided in the login if said User object exists.
 */
const authenticateUser = async (username: string, password: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/authenticateUser`, {
    params: { username, password },
  });
  if (res.status !== 200) {
    throw new Error('Error while authenticating user');
  }
  return res.data;
};

/**
 * Creates a new user in the database if not already present.
 *
 * @param username - The desired username of the user creating an account.
 * @param password - The desired password of the user creating an account.
 *
 * @returns the new User object added to the database.
 */
const createUser = async (username: string, password: string): Promise<User> => {
  const data = { username, password, isModerator: false };
  const res = await api.post(`${USER_API_URL}/createUser`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating user');
  }
  return res.data;
};

const makeUserModerator = async (id: string, username: string): Promise<User> => {
  const data = { id, username };
  const res = await api.post(`${USER_API_URL}/makeUserModerator`, data);
  if (res.status !== 200) {
    throw new Error('Error while making user a moderator');
  }
  return res.data;
};
export { authenticateUser, createUser, makeUserModerator };
