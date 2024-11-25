import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Correspondence,
  FindCorrespondenceRequest,
  FindCorrespondenceByIdRequest,
  FindCorrespondenceByIdWithViewsRequest,
  AddCorrespondenceRequest,
  UpdateCorrespondenceRequest,
  FakeSOSocket,
  UpdateCorrespondenceUserTypingRequest,
  UpdateCorrespondenceViewsRequest,
} from '../types';
import {
  fetchAndIncrementCorrespondenceViewsById,
  getAllCorrespondences,
  saveCorrespondence,
  updateCorrespondenceById,
  updateCorrespondenceUserTypingById,
  updateCorrespondenceViewsById,
  fetchCorrespondenceById,
} from '../models/application';

const correspondenceController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of all correspondences in the db
   * If there is an error, the HTTP response's status is updated.
   *
   * @param res The HTTP response object used to send back list of correspondences
   *
   * @returns A Promise that resolves to void.
   */
  const getCorrespondences = async (_: FindCorrespondenceRequest, res: Response): Promise<void> => {
    try {
      const clist: Correspondence[] = await getAllCorrespondences();
      if (clist) {
        res.json(clist);
      } else {
        res.status(500).send(`Error when fetching correspondences by filter`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching correspondences: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching correspondences`);
      }
    }
  };

  /**
   * Retrieves a correspondence by its unique ID
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCorrespondenceByIdRequest object containing the correspondence ID as a parameter.
   * @param res The HTTP response object used to send back the correspondences details.
   *
   * @returns A Promise that resolves to void.
   */
  const getCorrespondenceById = async (
    req: FindCorrespondenceByIdRequest,
    res: Response,
  ): Promise<void> => {
    const { cid } = req.params;

    if (!ObjectId.isValid(new ObjectId(cid))) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const c = await fetchCorrespondenceById(cid);

      if (c) {
        res.json(c);
      } else {
        res.status(500).send(`Error when fetching correspondence by id`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching correspondence by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching correspondence by id`);
      }
    }
  };

  /**
   * Retrieves a correspondence by its unique ID, and increments the view count for that correspondence.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCorrespondenceByIdWithViewsRequest object containing the correspondence ID as a parameter and username to add to views.
   * @param res The HTTP response object used to send back the correspondences details.
   *
   * @returns A Promise that resolves to void.
   */
  const getCorrespondenceByIdWithViews = async (
    req: FindCorrespondenceByIdWithViewsRequest,
    res: Response,
  ): Promise<void> => {
    const { cid } = req.params;
    const { username } = req.query;

    if (!ObjectId.isValid(cid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (username === undefined) {
      res.status(400).send('Invalid username requesting correspondence.');
      return;
    }

    try {
      const c = await fetchAndIncrementCorrespondenceViewsById(cid, username);

      if (c && !('error' in c)) {
        res.json(c);
        return;
      }

      throw new Error('Error while fetching correspondence by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching correspondence by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching correspondence by id`);
      }
    }
  };

  /**
   * Validates the correspondence object to ensure it contains all the necessary fields.
   *
   * @param correspondence The correspondence object to validate.
   *
   * @returns `true` if the correspondence is valid, otherwise `false`.
   */
  const isCorrespondenceBodyValid = (correspondence: Correspondence): boolean =>
    correspondence.messages !== undefined &&
    correspondence.messageMembers !== undefined &&
    correspondence.messageMembers.length > 0 &&
    correspondence.views !== undefined &&
    correspondence.userTyping !== undefined &&
    correspondence.messageMembers.length > 2 &&
    correspondence.views.every(element => correspondence.messageMembers.includes(element)) &&
    correspondence.userTyping.every(element => correspondence.messageMembers.includes(element));

  /**
   * Adds a new correspondence to the database. The correspondence is first validated and then saved.
   * If saving the correspondence fails, the HTTP response status is updated.
   *
   * @param req The AddCorrespondenceRequest object containing the new correspondence data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addCorrespondence = async (req: AddCorrespondenceRequest, res: Response): Promise<void> => {
    if (!isCorrespondenceBodyValid(req.body)) {
      res.status(400).send('Invalid correspondence body');
      return;
    }
    const correspondence: Correspondence = req.body;
    try {
      const result = await saveCorrespondence(correspondence);
      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('correspondenceUpdate', result);
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
   * Updates the members associated with a given correspondence
   * If saving the correspondence fails, the HTTP response status is updated.
   *
   * @param req The AddCorrespondenceRequest object containing the correspondence id and updated message members
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateCorrespondence = async (
    req: UpdateCorrespondenceRequest,
    res: Response,
  ): Promise<void> => {
    const { cid, updatedMessageMembers } = req.body;
    try {
      const result = await updateCorrespondenceById(cid, updatedMessageMembers);

      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('correspondenceUpdate', result);
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
   * Updates a correspondence's userTyping value with a list of users who are currently typing
   *
   * @param req The AddCorrespondenceRequest object containing the typing data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateCorrespondenceUserTyping = async (
    req: UpdateCorrespondenceUserTypingRequest,
    res: Response,
  ): Promise<void> => {
    const { cid, userTyping } = req.body;
    try {
      const result = await updateCorrespondenceUserTypingById(cid, userTyping);
      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('correspondenceUpdate', result);
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
   * Adds a user to the list of people who have viewed the correspondence
   *
   * @param req The AddCorrespondenceRequest object containing the correspondence and newly viewed data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateCorrespondenceViews = async (
    req: UpdateCorrespondenceViewsRequest,
    res: Response,
  ): Promise<void> => {
    const { cid, username } = req.body;
    try {
      const result = await updateCorrespondenceViewsById(cid, username);
      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('correspondenceUpdate', result);
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
  router.get('/getCorrespondence', getCorrespondences);
  router.get('/getCorrespondenceById/:cid', getCorrespondenceById);
  router.get('/getCorrespondenceByIdWithViews/:cid', getCorrespondenceByIdWithViews);
  router.post('/addCorrespondence', addCorrespondence);
  router.post('/updateCorrespondence', updateCorrespondence);
  router.post('/updateCorrespondenceUserTyping', updateCorrespondenceUserTyping);
  router.post('/updateCorrespondenceViews', updateCorrespondenceViews);

  return router;
};

export default correspondenceController;
