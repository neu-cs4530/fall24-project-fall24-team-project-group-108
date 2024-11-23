import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Message,
  FindMessageByIdRequest,
  AddMessageRequest,
  FakeSOSocket,
  UpdateMessageRequest,
  UpdateMessageViewsRequest,
  UpdateMessageEmojisRequest,
  Correspondence,
} from '../types';
import {
  fetchAndIncrementMessageViewsById,
  getMessagesByOrder,
  saveMessage,
  addMessageToCorrespondence,
  updateMessageById,
  updateMessageViewsById,
  updateMessageEmojisById,
} from '../models/application';
import CorrespondenceModel from '../models/correspondence';
import MessageModel from '../models/message';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Gets a list of all messages in the database
   * @param _ 
   * @param res 
   */
  const getMessages = async(_: Request, res: Response): Promise<void> => {

    try {
      const mlist = await getMessagesByOrder();

      if (mlist && !('error' in mlist)) {
        // socket.emit('viewsUpdate', m);
        res.json(mlist);
        return;
      }

      throw new Error('Error while fetching messages');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching messages: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching messages`);
      }
    }

  }

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
    message.messageDateTime !== null &&
    message.isCodeStyle !== undefined &&
    message.views !== undefined &&
    message.views.every(element => [...message.messageTo, message.messageBy].includes(element));

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

  /**
   * Adds a given username to a list of people who have viewed the message
   *
   * @param req The AddMessageRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateMessageViews = async (
    req: UpdateMessageViewsRequest,
    res: Response,
  ): Promise<void> => {
    const { mid, username } = req.body;
    try {
      const result = await updateMessageViewsById(mid, username);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const updatedCorrespondenceWithMessage = (await CorrespondenceModel.findOne({
        messages: { _id: mid },
      }).populate([{ path: 'messages', model: MessageModel }])) as Correspondence;

      socket.emit('correspondenceUpdate', updatedCorrespondenceWithMessage);
      socket.emit('messageUpdate', result);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving correspondence: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving correspondence`);
      }
    }
  };

  /**
   * Updates the emoji tracker in the message with the corresponding id
   *
   * @param req The UpdateMessageEmojisRequest object containing the message id and updated emojis.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateMessageEmojis = async (
    req: UpdateMessageEmojisRequest,
    res: Response,
  ): Promise<void> => {
    const { mid, emojis } = req.body;
    try {
      const result = await updateMessageEmojisById(mid, emojis);
      if ('error' in result) {
        throw new Error(result.error);
      }
      socket.emit('messageUpdate', result);

      const updatedCorrespondenceWithMessage = (await CorrespondenceModel.findOne({
        messages: { _id: mid },
      }).populate([{ path: 'messages', model: MessageModel }])) as Correspondence;

      socket.emit('correspondenceUpdate', updatedCorrespondenceWithMessage);

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
  router.get('/getMessageById/:mid', getMessageById);
  router.post('/addMessage', addMessage);
  router.post('/updateMessage', updateMessage);
  router.post('/updateMessageViews', updateMessageViews);
  router.post('/updateMessageEmojis', updateMessageEmojis);

  return router;
};

export default messageController;
