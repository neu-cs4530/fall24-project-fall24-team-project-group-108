import { Notification } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notifications`;

/**
 * Grabs all notifications for a given user.
 *
 * @param username - The username.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getNotifications = async (username: string, readStatus: string): Promise<Notification[]> => {
  const res = await api.get(
    `${NOTIFICATION_API_URL}/getAll?username=${username}&readStatus=${readStatus}`,
  );
  if (res.status !== 200) {
    throw new Error('Error while fetching notifications');
  }
  return res.data;
};

/**
 * Marks a given notification as read.
 *
 * @param username - The username.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const markNotificationAsRead = async (nid: string): Promise<Notification> => {
  const res = await api.post(`${NOTIFICATION_API_URL}/markRead?nid=${nid}`);
  if (res.status !== 200) {
    throw new Error('Error while marking notificaiton as read');
  }
  return res.data;
};

export default getNotifications;
