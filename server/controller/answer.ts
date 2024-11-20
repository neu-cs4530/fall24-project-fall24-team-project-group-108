import express, { Response } from 'express';
import { Answer, AnswerRequest, AnswerResponse, EndorseRequest, FakeSOSocket } from '../types';
import {
  addAnswerToQuestion,
  populateDocument,
  saveAnswer,
  endorseAnswer,
  getQuestionById,
  getQuestionByAnswerId,
} from '../models/application';
import AnswerModel from '../models/answers';
import QuestionModel from '../models/questions';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;

    try {
      const ansFromDb = await saveAnswer(ansInfo);

      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');

      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });
      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  /**
   * Updates the current endorsed status of an answer. If successful, the answer has it's endorsed status updated
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The EndorseRequest object containing the answer ID and the endorsed status.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateEndorsement = async (req: EndorseRequest, res: Response): Promise<void> => {
    try {
      const { qid, aid, endorsed, user } = req.body;

      // Find the question by ID
      const question = await getQuestionById(qid);

      if (!question) {
        res.status(404).json({ message: 'Question not found' });
        return;
      }

      // Check if the user endorsing the answer is the one who asked the question
      if (question.askedBy !== user.username) {
        res
          .status(403)
          .json({ message: 'Only the user who asked the question can endorse answers' });
        return;
      }

      // Find and update the endorsement status of the answer in the database
      const updatedAnswer = await endorseAnswer(aid, endorsed);

      if ('error' in updatedAnswer) {
        throw new Error(updatedAnswer.error as string);
      }

      res.json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating endorsement' });
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.patch('/endorseAnswer', updateEndorsement);

  return router;
};

export default answerController;
