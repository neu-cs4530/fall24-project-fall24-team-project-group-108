import { Question, Message, Correspondence } from '../types';
import api from './config';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/message`;

/**
 * Function to get messages by filter.
 *
 * @param order - The order in which to fetch messages. Default is 'newest'.
 * @throws Error if there is an issue fetching or filtering messages.
 */
const getMessagesByOrder = async (order: string = 'newest'): Promise<Message[]> => {
  const res = await api.get(`${MESSAGE_API_URL}/getMessage?order=${order}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering messages');
  }
  return res.data;
};

/**
 * Function to get a message by its ID.
 *
 * @param mid - The ID of the question to retrieve.
 * @param username - The username of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getMessageById = async (mid: string, username: string): Promise<Message> => {
  const res = await api.get(`${MESSAGE_API_URL}/getMessageById/${mid}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching message by id');
  }
  return res.data;
};

/**
 * Function to add a new message.
 *
 * @param cid - The id of the message's associated correspondence
 * @param message - The message object to add.
 * @throws Error if there is an issue creating the new message.
 */
const addMessage = async (cid: string, message: Message): Promise<Correspondence> => {
  console.log('at addMessage');
  const res = await api.post(`${MESSAGE_API_URL}/addMessage`, { cid, message });
  console.log('end of addMessage');
  console.log(res);

  if (res.status !== 200) {
    throw new Error('Error while creating a new message');
  }

  return res.data;
};

/**
 * Function to add a new correspondence.
 *
 * @param mid - The ID of the correspondence to retrieve.
 * @param updatedMessageText - the updated message text of the correspondence
 * @throws Error if there is an issue updating the new correspondence.
 */
const updateMessageById = async (
  mid: string,
  updatedMessageText: string,
): Promise<Correspondence> => {
  console.log('updateMessage called!');
  // console.log(
  //   `${CORRESPONDENCE_API_URL}/updateCorrespondence/cid={${cid.split('&')[0]}}&updatedMessageMembers={${updatedMessageMembers}}`,
  // );
  // const res = await api.post(
  //   `${CORRESPONDENCE_API_URL}/updateCorrespondence/cid={${cid.split('&')[0]}}&updatedMessageMembers={${updatedMessageMembers}}`,
  // );
  const updatedMId = mid.split('&')[0];
  console.log(updatedMId);
  const res = await api.post(`${MESSAGE_API_URL}/updateMessage`, {
    mid: updatedMId,
    updatedMessageText,
  });
  console.log('updateMessage finished!');
  console.log(res);

  if (res.status !== 200) {
    throw new Error('Error while updating message');
  }

  return res.data;
};

export { getMessagesByOrder, getMessageById, addMessage, updateMessageById };
