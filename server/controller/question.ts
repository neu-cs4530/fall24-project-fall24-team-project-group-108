import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
  VoteRequest,
  FakeSOSocket,
  FindQuestionByAswerer,
  UpdateTagsRequest,
  FindQuestionByCommenter,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  processTags,
  populateDocument,
  saveQuestion,
  filterQuestionsByAnswerer,
  updateTagAnswers,
  filterQuestionsByCommenter,
} from '../models/application';

const questionController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of questions filtered by a search term and ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionRequest object containing the query parameters `order` and `search`.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByFilter = async (req: FindQuestionRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { search } = req.query;
    const { askedBy } = req.query;
    try {
      let qlist: Question[] = await getQuestionsByOrder(order);
      // Filter by askedBy if provided
      if (askedBy) {
        qlist = filterQuestionsByAskedBy(qlist, askedBy);
      }
      // Filter by search keyword and tags
      const resqlist: Question[] = await filterQuestionsBySearch(qlist, search);
      res.json(resqlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  /**
   * Retrieves a list of questions filtered by a user who answered the question.
   *
   * @param req The FindQuestionByAswerer object containing the query parameter 'answeredBy'.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByAnswerer = async (
    req: FindQuestionByAswerer,
    res: Response,
  ): Promise<void> => {
    const { answeredBy } = req.params;
    try {
      const qlist: Question[] = await filterQuestionsByAnswerer(answeredBy);
      res.json(qlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by answerer: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by answerer`);
      }
    }
  };

  /**
   * Retrieves a list of questions filtered by a user who commented on the question or one of its answers
   *
   * @param req The FindQuestionByCommenter object containing the query parameter 'commentBy'.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionsByCommenter = async (
    req: FindQuestionByCommenter,
    res: Response,
  ): Promise<void> => {
    console.log('At server: getQuestionsByCommenter');
    const { commentBy } = req.params;
    try {
      console.log('Awaiting: filterQuestionsByCommenter');
      const qlist: Question[] = await filterQuestionsByCommenter(commentBy);
      console.log('Awaiting is Done: filterQuestionsByCommenter');
      console.log(qlist);
      res.json(qlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by commenter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by commenter`);
      }
    }
  };


  /**
   * Retrieves a question by its unique ID, and increments the view count for that question.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionByIdRequest object containing the question ID as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getQuestionById = async (req: FindQuestionByIdRequest, res: Response): Promise<void> => {
    const { qid } = req.params;
    const { username } = req.query;

    if (!ObjectId.isValid(qid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (username === undefined) {
      res.status(400).send('Invalid username requesting question.');
      return;
    }

    try {
      const q = await fetchAndIncrementQuestionViewsById(qid, username);

      if (q && !('error' in q)) {
        socket.emit('viewsUpdate', q);
        res.json(q);
        return;
      }

      throw new Error('Error while fetching question by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching question by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching question by id`);
      }
    }
  };

  /**
   * Validates the question object to ensure it contains all the necessary fields.
   *
   * @param question The question object to validate.
   *
   * @returns `true` if the question is valid, otherwise `false`.
   */
  const isQuestionBodyValid = (question: Question): boolean =>
    question.title !== undefined &&
    question.title !== '' &&
    question.text !== undefined &&
    question.text !== '' &&
    question.tags !== undefined &&
    question.tags.length > 0 &&
    question.askedBy !== undefined &&
    question.askedBy !== '' &&
    question.askDateTime !== undefined &&
    question.askDateTime !== null;

  /**
   * Adds a new question to the database. The question is first validated and then saved.
   * If the tags are invalid or saving the question fails, the HTTP response status is updated.
   *
   * @param req The AddQuestionRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addQuestion = async (req: AddQuestionRequest, res: Response): Promise<void> => {
    if (!isQuestionBodyValid(req.body)) {
      res.status(400).send('Invalid question body');
      return;
    }
    const question: Question = req.body;
    try {
      const questionswithtags: Question = {
        ...question,
        tags: await processTags(question.tags),
      };
      if (questionswithtags.tags.length === 0) {
        throw new Error('Invalid tags');
      }
      const result = await saveQuestion(questionswithtags);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the question that was added, and emits the new object
      const populatedQuestion = await populateDocument(result._id?.toString(), 'question');

      if (populatedQuestion && 'error' in populatedQuestion) {
        throw new Error(populatedQuestion.error);
      }

      socket.emit('questionUpdate', populatedQuestion as Question);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving question: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving question`);
      }
    }
  };

  /**
   * Helper function to handle upvoting or downvoting a question.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of vote to perform (upvote or downvote).
   *
   * @returns A Promise that resolves to void.
   */
  const voteQuestion = async (
    req: VoteRequest,
    res: Response,
    type: 'upvote' | 'downvote',
  ): Promise<void> => {
    if (!req.body.qid || !req.body.username) {
      res.status(400).send('Invalid request');
      return;
    }

    const { qid, username } = req.body;

    try {
      let status;
      if (type === 'upvote') {
        status = await addVoteToQuestion(qid, username, type);
      } else {
        status = await addVoteToQuestion(qid, username, type);
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', { qid, upVotes: status.upVotes, downVotes: status.downVotes });
      res.json({ msg: status.msg, upVotes: status.upVotes, downVotes: status.downVotes });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  /**
   * Handles upvoting a question. The request must contain the question ID (qid) and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const upvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'upvote');
  };

  /**
   * Handles downvoting a question. The request must contain the question ID (qid) and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const downvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'downvote');
  };

  /**
   * Handles updating tag leaderboard data when a quesetion is answered.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The UpdateTagsRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateTagProgress = async (req: UpdateTagsRequest, res: Response): Promise<void> => {
    const { user } = req.query;
    const { qid } = req.query;
    try {
      const updatedQuestion = await updateTagAnswers(user, qid, socket);
      res.json(updatedQuestion);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating question tags: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating question tags`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getQuestion', getQuestionsByFilter);
  router.get('/getQuestionById/:qid', getQuestionById);
  router.get('/getQuestionByAnswerer/:answeredBy', getQuestionsByAnswerer);
  router.get('/getQuestionByCommenter/:commentBy', getQuestionsByCommenter);
  router.post('/addQuestion', addQuestion);
  router.post('/upvoteQuestion', upvoteQuestion);
  router.post('/downvoteQuestion', downvoteQuestion);
  router.post('/updateTagProgress', updateTagProgress);

  return router;
};

export default questionController;
