import { Correspondence } from '../types';
import api from './config';

const CORRESPONDENCE_API_URL = `${process.env.REACT_APP_SERVER_URL}/correspondence`;

/**
 * Function to get all correspondences in db
 *
 * @throws Error if there is an issue fetching correspondences
 */
const getCorrespondences = async (): Promise<Correspondence[]> => {
  const res = await api.get(`${CORRESPONDENCE_API_URL}/getCorrespondence`);
  if (res.status !== 200) {
    throw new Error('Error when fetching correspondences');
  }
  return res.data;
};

/**
 * Function to get a correspondence by its ID.
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @throws Error if there is an issue fetching the correspondence by ID.
 */
const getCorrespondenceById = async (cid: string): Promise<Correspondence> => {
  const res = await api.get(`${CORRESPONDENCE_API_URL}/getCorrespondenceById/${cid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching correspondence by id');
  }
  return res.data;
};

/**
 * Function to add a new correspondence.
 *
 * @param c - The correpondence object to add.
 * @throws Error if there is an issue creating the new correspondence.
 */
const addCorrespondence = async (c: Correspondence): Promise<Correspondence> => {
  const res = await api.post(`${CORRESPONDENCE_API_URL}/addCorrespondence`, c);

  if (res.status !== 200) {
    throw new Error('Error while creating a new correspondence');
  }

  return res.data;
};

/**
 * Function to update the members of a correspondence
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @param updatedMessageMembers - the updated members of the correspondence
 * @throws Error if there is an issue updating the new correspondence.
 */
const updateCorrespondenceMembersById = async (
  cid: string,
  updatedMessageMembers: string[],
): Promise<Correspondence> => {
  const updatedCId = cid.split('&')[0];
  const res = await api.post(`${CORRESPONDENCE_API_URL}/updateCorrespondence`, {
    cid: updatedCId,
    updatedMessageMembers,
  });

  if (res.status !== 200) {
    throw new Error('Error while updating correspondence');
  }

  return res.data;
};

/**
 * Function to update the list of users who are typing for a correspondence
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @param updatedUserTyping - A list of users who are currently typing on the correspondence
 * @throws Error if there is an issue updating the new correspondence.
 */
const updateCorrespondenceUserTypingByIdNames = async (
  cid: string,
  username: string,
  push: boolean,
): Promise<Correspondence> => {
  const updatedCId = cid.split('&')[0];
  const res = await api.post(`${CORRESPONDENCE_API_URL}/updateCorrespondenceUserTypingNames`, {
    cid: updatedCId,
    username,
    push,
  });

  if (res.status !== 200) {
    throw new Error('Error while updating correspondence');
  }

  return res.data;
};

/**
 * Function to add a new user who has viewed the correspondence
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @param username - A new username who has viewed the correspondence
 * @throws Error if there is an issue updating the new correspondence.
 */
const updateCorrespondenceViewsById = async (cid: string, username: string) => {
  const data = { cid, username };
  const res = await api.post(`${CORRESPONDENCE_API_URL}/updateCorrespondenceViews`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating correspondence views');
  }
  return res.data;
};

export {
  getCorrespondences,
  getCorrespondenceById,
  addCorrespondence,
  updateCorrespondenceMembersById,
  updateCorrespondenceViewsById,
  updateCorrespondenceUserTypingByIdNames,
};
