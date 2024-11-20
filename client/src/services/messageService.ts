import { Message, Correspondence } from '../types';
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
  console.log('Start addMessage');
  console.log(cid);
  console.log(message);
  const res = await api.post(`${MESSAGE_API_URL}/addMessage`, { cid, message });
  console.log('End addMessage');
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
  isCodeStyle: boolean,
): Promise<Correspondence> => {
  const updatedMId = mid.split('&')[0];
  const res = await api.post(`${MESSAGE_API_URL}/updateMessage`, {
    mid: updatedMId,
    updatedMessageText,
    isCodeStyle,
  });

  if (res.status !== 200) {
    throw new Error('Error while updating message');
  }

  return res.data;
};

/**
 * Function to add a new message.
 *
 * @param mid - The ID of the message to retrieve.
 * @param username - A new username who has viewed the message
 * @throws Error if there is an issue updating the new message.
 */
const updateMessageViewsById = async (mid: string, username: string) => {
  const data = { mid, username };
  console.log('In updateMessageViewsByID');
  console.log(mid);
  console.log(username);
  const res = await api.post(`${MESSAGE_API_URL}/updateMessageViews`, data);
  console.log('updateMessageViews done!');
  if (res.status !== 200) {
    throw new Error('Error while updating message views');
  }
  return res.data;
};

/**
 * Function to add a new message.
 *
 * @param mid - The ID of the message to retrieve.
 * @param emojis - A dictionary where each key is a username, and each value is their emoji selection
 * @throws Error if there is an issue updating the new message.
 */
const updateMessageEmojisById = async (mid: string, emojis: { [key: string]: string }) => {
  const data = { mid, emojis };
  console.log('In updateMessageEmojisByID');
  console.log(mid);
  console.log(emojis);
  const res = await api.post(`${MESSAGE_API_URL}/updateMessageEmojis`, data);
  console.log('updateMessageEmojis done!');
  if (res.status !== 200) {
    throw new Error('Error while updating message emojis');
  }
  return res.data;
};

export {
  getMessagesByOrder,
  getMessageById,
  addMessage,
  updateMessageById,
  updateMessageViewsById,
  updateMessageEmojisById,
};
