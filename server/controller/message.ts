import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  Message,
  Correspondence,
  FindQuestionRequest,
  FindMessageRequest,
  FindMessageByIdRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
  AddMessageRequest,
  VoteRequest,
  FakeSOSocket,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  fetchAndIncrementMessageViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  getMessagesByOrder,
  processTags,
  populateDocument,
  saveQuestion,
  saveMessage,
  addMessageToCorrespondence,
} from '../models/application';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of messages ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindMessageRequest object containing the query parameter `order`
   * @param res The HTTP response object used to send back the ordered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getMessagesByFilter = async (req: FindMessageRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { askedBy } = req.query;
    try {
      const mlist: Message[] = await getMessagesByOrder(order);
      res.json(mlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

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

  //   export interface Message {
  //     _id?: string,
  //     messageText: string,
  //     messageDateTime: Date,
  //     messageBy: string,
  //     messageTo: string[]
  //   }

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
    const isRequestValid = (req: AddMessageRequest): boolean => {
      return !!req.body.cid && !!req.body.message;
    }
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

      console.log('saveMessage finished!');
      console.log(status);
      // if ('error' in result) {
      //   throw new Error(result.error);
      // }

      // // Populates the fields of the message that was added, and emits the new object
      // const populatedMessage = await populateDocument(result._id?.toString(), 'question');

      // if (populatedMessage && 'error' in populatedMessage) {
      //   throw new Error(populatedMessage.error);
      // }

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

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getMessage', getMessagesByOrder);
  router.get('/getMessageById/:qid', getMessageById);
  router.post('/addMessage', addMessage);

  return router;
};

export default messageController;
