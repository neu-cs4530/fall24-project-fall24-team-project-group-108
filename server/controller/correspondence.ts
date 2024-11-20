import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Correspondence,
  FindCorrespondenceRequest,
  FindCorrespondenceByIdRequest,
  AddCorrespondenceRequest,
  UpdateCorrespondenceRequest,
  FakeSOSocket,
} from '../types';
import {
  fetchAndIncrementCorrespondenceViewsById,
  getCorrespondencesByOrder,
  saveCorrespondence,
  updateCorrespondenceById,
} from '../models/application';

const correspondenceController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of correspondence ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCorrespondenceRequest object containing the query parameter `order`
   * @param res The HTTP response object used to send back the ordered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getCorrespondencesByFilter = async (
    req: FindCorrespondenceRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const clist: Correspondence[] = await getCorrespondencesByOrder();
      res.json(clist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching correspondences by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching correspondences by filter`);
      }
    }
  };

  /**
   * Retrieves a correspondence by its unique ID, and increments the view count for that correspondence.
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
        // socket.emit('viewsUpdate', c);
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
    correspondence.messageMembers.length > 0;

  /**
   * Adds a new correspondence to the database. The correspondence is first validated and then saved.
   * If saving the correspondence fails, the HTTP response status is updated.
   *
   * @param req The AddCorrespondenceRequest object containing the question data.
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
   * Adds a new correspondence to the database. The correspondence is first validated and then saved.
   * If saving the correspondence fails, the HTTP response status is updated.
   *
   * @param req The AddCorrespondenceRequest object containing the question data.
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

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getCorrespondence', getCorrespondencesByFilter);
  router.get('/getCorrespondenceById/:qid', getCorrespondenceById);
  router.post('/addCorrespondence', addCorrespondence);
  router.post('/updateCorrespondence', updateCorrespondence);

  return router;
};

export default correspondenceController;
