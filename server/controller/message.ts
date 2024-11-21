import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Message,
  FindMessageByIdRequest,
  AddMessageRequest,
  FakeSOSocket,
  UpdateMessageRequest,
  Notification
} from '../types';
import {
  fetchAndIncrementMessageViewsById,
  getMessagesByOrder,
  saveMessage,
  addMessageToCorrespondence,
  updateMessageById,
} from '../models/application';
import NotificationModel from '../models/notifications';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a message by its unique ID, and increments the view count for that message.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindMessageByIdRequest object containing the question ID as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getMessageById = async (req: FindMessageByIdRequest, res: Response): Promise<void> => {
    const { mid } = req.params;
    const { username } = req.query;

    if (!ObjectId.isValid(mid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (username === undefined) {
      res.status(400).send('Invalid username requesting question.');
      return;
    }

    try {
      const m = await fetchAndIncrementMessageViewsById(mid, username);

      if (m && !('error' in m)) {
        // socket.emit('viewsUpdate', m);
        res.json(m);
        return;
      }

      throw new Error('Error while fetching message by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching message by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching message by id`);
      }
    }
  };

  /**
   * Validates the message object to ensure it contains all the necessary fields.
   *
   * @param message The message object to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean =>
    message.messageText !== undefined &&
    message.messageText !== '' &&
    message.messageTo !== undefined &&
    message.messageTo.length > 0 &&
    message.messageBy !== undefined &&
    message.messageBy !== '' &&
    message.messageDateTime !== undefined &&
    message.messageDateTime !== null;

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean => !!req.body.cid && !!req.body.message;
  /**
   * Adds a new message to the database. The message is first validated and then saved.
   * If saving the message fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessage = async (req: AddMessageRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isMessageValid(req.body.message)) {
      res.status(400).send('Invalid message');
      return;
    }

    const { cid } = req.body;
    const messageInfo: Message = req.body.message;
    try {
      const messageFromDb = await saveMessage(messageInfo);

      if ('error' in messageFromDb) {
        throw new Error(messageFromDb.error as string);
      }

      const status = await addMessageToCorrespondence(cid, messageFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      for (const member of status.messageMembers) {
        if (member !== messageFromDb.messageBy) {
          // create the notification for the question author
          const notification: Notification = {
            user: member,
            type: 'message',
            caption: `${messageFromDb.messageBy} sent you a message`,
            read: false,
            createdAt: new Date(),
            redirectUrl: `/messagePage`,
          };

          // save the notification to the db
          const savedNotification = await NotificationModel.create(notification);
          if ('error' in savedNotification) {
            throw new Error(savedNotification.error as string);
          }
          socket.emit('notificationUpdate', savedNotification);
        }
      }

      socket.emit('correspondenceUpdate', status);
      res.json(status);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving message: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving message`);
      }
    }
  };

  /**
   * Updates a message in the database. The message is first validated and then saved.
   * If saving the message fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateMessage = async (req: UpdateMessageRequest, res: Response): Promise<void> => {
    const { mid, updatedMessageText, isCodeStyle } = req.body;
    try {
      const result = await updateMessageById(mid, updatedMessageText, isCodeStyle);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const messageResult = result.messages.filter(
        message => (message._id ? message._id.toString() : '') === mid,
      )[0];

      socket.emit('correspondenceUpdate', result);
      socket.emit('messageUpdate', messageResult);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving correspondence: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving correspondence`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getMessage', getMessagesByOrder);
  router.get('/getMessageById/:qid', getMessageById);
  router.post('/addMessage', addMessage);
  router.post('/updateMessage', updateMessage);

  return router;
};

export default messageController;
