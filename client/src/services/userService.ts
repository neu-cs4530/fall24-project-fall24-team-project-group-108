import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Authenticates the information provided by a user.
 *
 * @param username - The username of the user logging in.
 * @param password - The password of the user logging in.
 *
 * @throws Error - Throws an error if the request fails or the response status is not 200.
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
 * @throws Error - Throws an error if the request fails or the response status is not 200.
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

/**
 * Makes a user in the database a moderator.
 *
 * @param username - The username of the user being made into a moderator.
 *
 * @throws Error - Throws an error if the request fails or the response status is not 200.
 * @returns the User object with an updated isModerator field.
 */
const makeUserModerator = async (username: string): Promise<User> => {
  const data = { username };
  const res = await api.post(`${USER_API_URL}/makeUserModerator`, data);
  if (res.status !== 200) {
    throw new Error('Error while making user a moderator');
  }
  return res.data;
};

/**
 * Switches a user's do not disturb setting.
 *
 * @param username - The username of the user.
 *
 * @throws Error - Throws an error if the request fails or the response status is not 200.
 * @returns the User object with an updated doNotDisturb field.
 */
const toggleDoNotDisturb = async (username: string): Promise<User> => {
  const data = { username };
  const res = await api.post(`${USER_API_URL}/doNotDisturb`, data);
  if (res.status !== 200) {
    throw new Error('Error while changing do not disturb status');
  }
  return res.data;
};

/**
 * Function to get a list of all users
 *
 * @throws Error if there is an issue fetching or filtering messages.
 */
const getUsers = async (): Promise<User[]> => {
  const res = await api.get(`${USER_API_URL}/getUsers`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering correspondences');
  }
  return res.data;
};

/**
 * Gets a user's do not disturb setting.
 *
 * @param username - The username of the user.
 *
 * @throws Error - Throws an error if the request fails or the response status is not 200.
 * @returns the User object with the doNotDisturb field.
 */
const getDoNotDisturb = async (username: string): Promise<boolean> => {
  const res = await api.get(`${USER_API_URL}/doNotDisturb/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while getting do not disturb status');
  }
  return res.data;
};
 
/**
 * Updates a user's profile picture.
 *
 * @param username - The username of the user being edited.
 * @param badgeName - The badge they are updating their profile picture to.
 *
 * @returns the User object with an updated isModerator field.
 */
const changeProfilePicture = async (username: string, badgeName: string): Promise<User> => {
  const data = { username, badgeName };
  const res = await api.post(`${USER_API_URL}/updatePicture`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating user profile picture');
  }
  return res.data;
};

export { authenticateUser, createUser, makeUserModerator, toggleDoNotDisturb, getDoNotDisturb, getUsers, changeProfilePicture };
