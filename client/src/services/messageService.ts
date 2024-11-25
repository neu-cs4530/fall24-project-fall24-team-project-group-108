import { Message, Correspondence } from '../types';
import api from './config';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/message`;

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
  console.log(message);
  const res = await api.post(`${MESSAGE_API_URL}/addMessage`, { cid, message });

  if (res.status !== 200) {
    throw new Error('Error while creating a new message');
  }

  return res.data;
};

/**
 * Function to update a message text contents
 *
 * @param mid - The ID of the correspondence to retrieve.
 * @param updatedMessageText - the new text content of the message
 * @param isCodeStyle - boolean describing whether or not the text is a code cell
 * @throws Error if there is an issue updating the new message.
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
 * Function to update the views of a message
 *
 * @param mid - The ID of the message to retrieve.
 * @param username - A new username who has viewed the message
 * @throws Error if there is an issue updating the message.
 */
const updateMessageViewsById = async (mid: string, username: string) => {
  const data = { mid, username };
  const res = await api.post(`${MESSAGE_API_URL}/updateMessageViews`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating message views');
  }
  return res.data;
};

/**
 * Function to delete a message.
 *
 * @param mid - The ID of the message to retrieve.
 * @param isDeleted - A boolean determining whether or not the message has been deleted
 * @throws Error if there is an issue deleting the message.
 */
const updateMessageIsDeletedById = async (mid: string, isDeleted: boolean) => {
  const data = { mid, isDeleted };
  const res = await api.post(`${MESSAGE_API_URL}/updateMessageIsDeleted`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating message isDeleted');
  }
  return res.data;
};

/**
 * Function to update the emoji reactions of a message
 *
 * @param mid - The ID of the message to retrieve.
 * @param emojis - A map where each key is a username, and each value is their corresponding emoji reaction
 * @throws Error if there is an issue updating the message.
 */
const updateMessageEmojisById = async (mid: string, emojis: { [key: string]: string }) => {
  const data = { mid, emojis };
  const res = await api.post(`${MESSAGE_API_URL}/updateMessageEmojis`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating message emojis');
  }
  return res.data;
};

export {
  getMessageById,
  addMessage,
  updateMessageById,
  updateMessageViewsById,
  updateMessageEmojisById,
  updateMessageIsDeletedById,
};
