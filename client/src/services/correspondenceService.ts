import { Question, Message, Correspondence } from '../types';
import api from './config';

const CORRESPONDENCE_API_URL = `${process.env.REACT_APP_SERVER_URL}/correspondence`;

/**
 * Function to get messages by filter.
 *
 * @param order - The order in which to fetch messages. Default is 'newest'.
 * @throws Error if there is an issue fetching or filtering messages.
 */
const getCorrespondencesByOrder = async (): Promise<Correspondence[]> => {
  console.log(CORRESPONDENCE_API_URL);
  const res = await api.get(`${CORRESPONDENCE_API_URL}/getCorrespondence`);
  console.log('Returned CORRESPONDENCE_API_URL');
  console.log(res);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering correspondences');
  }
  return res.data;
};

/**
 * Function to get a correspondence by its ID.
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @param username - The username of the user requesting the correspondence.
 * @throws Error if there is an issue fetching the correspondence by ID.
 */
const getCorrespondenceById = async (cid: string, username: string): Promise<Correspondence> => {
  const res = await api.get(
    `${CORRESPONDENCE_API_URL}/getCorrespondenceById/${cid}?username=${username}`,
  );
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
  console.log('addCorrespondence called!');
  const res = await api.post(`${CORRESPONDENCE_API_URL}/addCorrespondence`, c);
  console.log('addCorrespondence finished!');
  console.log(res);

  if (res.status !== 200) {
    throw new Error('Error while creating a new correspondence');
  }

  return res.data;
};

/**
 * Function to add a new correspondence.
 *
 * @param cid - The ID of the correspondence to retrieve.
 * @param updatedMessageMembers - the updated members of the correspondence
 * @throws Error if there is an issue updating the new correspondence.
 */
const updateCorrespondenceById = async (
  cid: string,
  updatedMessageMembers: string[],
): Promise<Correspondence> => {
  console.log('updateCorrespondence called!');
  // console.log(
  //   `${CORRESPONDENCE_API_URL}/updateCorrespondence/cid={${cid.split('&')[0]}}&updatedMessageMembers={${updatedMessageMembers}}`,
  // );
  // const res = await api.post(
  //   `${CORRESPONDENCE_API_URL}/updateCorrespondence/cid={${cid.split('&')[0]}}&updatedMessageMembers={${updatedMessageMembers}}`,
  // );
  const updatedCId = cid.split('&')[0];
  console.log(updatedCId);
  const res = await api.post(`${CORRESPONDENCE_API_URL}/updateCorrespondence`, {
    cid: updatedCId,
    updatedMessageMembers,
  });
  console.log('updateCorrespondence finished!');
  console.log(res);

  if (res.status !== 200) {
    throw new Error('Error while updating correspondence');
  }

  return res.data;
};

export {
  getCorrespondencesByOrder,
  getCorrespondenceById,
  addCorrespondence,
  updateCorrespondenceById,
};
