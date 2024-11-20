import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Comment, AddCommentRequest, FakeSOSocket, Notification } from '../types';
import { addComment, populateDocument, saveComment } from '../models/application';
import QuestionModel from '../models/questions';
import NotificationModel from '../models/notifications';
import AnswerModel from '../models/answers';

const commentController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddCommentRequest): boolean =>
    !!req.body.id &&
    !!req.body.type &&
    (req.body.type === 'question' || req.body.type === 'answer') &&
    !!req.body.comment &&
    req.body.comment.text !== undefined &&
    req.body.comment.commentBy !== undefined &&
    req.body.comment.commentDateTime !== undefined;

  /**
   * Validates the comment object to ensure it is not empty.
   *
   * @param comment The comment to validate.
   *
   * @returns `true` if the coment is valid, otherwise `false`.
   */
  const isCommentValid = (comment: Comment): boolean =>
    comment.text !== undefined &&
    comment.text !== '' &&
    comment.commentBy !== undefined &&
    comment.commentBy !== '' &&
    comment.commentDateTime !== undefined &&
    comment.commentDateTime !== null;

  /**
   * Handles adding a new comment to the specified question or answer. The comment is first validated and then saved.
   * If the comment is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddCommentRequest object containing the comment data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of the comment, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const addCommentRoute = async (req: AddCommentRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { comment, type } = req.body;

    if (!isCommentValid(comment)) {
      res.status(400).send('Invalid comment body');
      return;
    }

    try {
      const comFromDb = await saveComment(comment);

      if ('error' in comFromDb) {
        throw new Error(comFromDb.error);
      }

      const status = await addComment(id, type, comFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the question or answer that this comment
      // was added to, and emits the updated object
      const populatedDoc = await populateDocument(id, type);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      if (type === 'question') {
        // if its a question, notify the question author
        const question = await QuestionModel.findById(id).exec();
        if (!question) {
          throw new Error('Question not found');
        }

        const authorUsername = question.askedBy;

        // Create the notification
        const notification: Notification = {
          user: authorUsername,
          type: 'comment',
          caption: `${comment.commentBy} commented on your question`,
          read: false,
          createdAt: new Date(),
          redirectUrl: `/question/${id}`,
        };

        // Save the notification to the DB
        const savedNotification = await NotificationModel.create(notification);

        if ('error' in savedNotification) {
          throw new Error(savedNotification.error as string);
        }

        // Emit the notification to the socket
        socket.emit('notificationUpdate', notification);
      } else {
        const answer = await AnswerModel.findById(id).exec();
        if (!answer) {
          throw new Error('Answer not found');
        }

        // Find the question
        const answerQuestion = await QuestionModel.findOne({
          answers: new ObjectId(id),
        }).exec();

        if (!answerQuestion) {
          throw new Error('Question not found for the answer');
        }

        const authorUsername = answer.ansBy;
        const qid = answerQuestion._id.toString();

        // Create the notification
        const notification: Notification = {
          user: authorUsername,
          type: 'comment',
          caption: `${comment.commentBy} commented on your answer`,
          read: false,
          createdAt: new Date(),
          redirectUrl: `/question/${qid}`,
        };

        // Save the notification to the DB
        const savedNotification = await NotificationModel.create(notification);

        if ('error' in savedNotification) {
          throw new Error(savedNotification.error as string);
        }

        // Emit the notification to the socket
        socket.emit('notificationUpdate', notification);
      }

      socket.emit('commentUpdate', {
        result: populatedDoc,
        type,
      });
      res.json(comFromDb);
    } catch (err: unknown) {
      res.status(500).send(`Error when adding comment: ${(err as Error).message}`);
    }
  };

  router.post('/addComment', addCommentRoute);

  return router;
};

export default commentController;
