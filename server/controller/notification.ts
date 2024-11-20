import express, { Request, Response } from 'express';
import { FakeSOSocket, Notification } from "../types";
import NotificationModel from '../models/notifications';


const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves notifications for the given user.
   *
   * @param req The FindQuestionByAswerer object containing the query parameter 'answeredBy'.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getNotifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { username } = req.query;
    const { readStatus } = req.query;
  
    if (!username) {
      res.status(400).send('Username is required');
      return;
    }
  
    try {
      let query: any = { user: username }; 
  
      if (readStatus === 'read') {
        query.read = true;
      } else if (readStatus === 'unread') {
        query.read = false;
      }
  
      // Fetch the notifications 
      const notifications: Notification[] = await NotificationModel.find(query)
        .sort({ createdAt: -1 }); 
  
      res.status(200).json(notifications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching notifications: ${err.message}`);
      } else {
        res.status(500).send('Error when fetching notifications');
      }
    }
  };

  router.get('/getAll', getNotifications);

  return router;
};

export default notificationController;
