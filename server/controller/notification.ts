import express, { Request, Response } from 'express';
import { FakeSOSocket, Notification } from '../types';
import NotificationModel from '../models/notifications';

// type to represent notification query
type Query = {
  user: string;
  read?: boolean;
};

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves notifications for the given user.
   *
   * @param req The Request object containing the query parameter 'username' and 'readstatus'.
   * @param res The HTTP response object used to send back the list of notifs.
   *
   * @returns A Promise that resolves to void.
   */
  const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    const { readStatus } = req.query;

    if (!username) {
      res.status(400).send('Username is required');
      return;
    }

    try {
      const query: Query = { user: username as string };

      if (readStatus === 'read') {
        query.read = true;
      } else if (readStatus === 'unread') {
        query.read = false;
      }

      // Fetch the notifications
      const notifications: Notification[] = await NotificationModel.find(query).sort({
        createdAt: -1,
      });

      res.status(200).json(notifications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching notifications: ${err.message}`);
      } else {
        res.status(500).send('Error when fetching notifications');
      }
    }
  };

  /**
   * Marks a notification as read.
   *
   * @param req The request object containing the query parameter 'nid'.
   * @param res The HTTP response object used to send back the notification.
   *
   * @returns A Promise that resolves to void.
   */
  const markAsRead = async (req: Request, res: Response): Promise<void> => {
    const { nid } = req.query;

    if (!nid) {
      res.status(400).send('Notification id is required');
      return;
    }

    try {
      const notification = await NotificationModel.findByIdAndUpdate(
        nid,
        { read: true },
        { new: true },
      );

      if (!notification) {
        res.status(404).send('Notification not found');
        return;
      }

      res.status(200).json(notification);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when marking notification as read: ${err.message}`);
      } else {
        res.status(500).send('Error when marking notification as read');
      }
    }
  };

  router.get('/getAll', getNotifications);
  router.post('/markRead', markAsRead);

  return router;
};

export default notificationController;
