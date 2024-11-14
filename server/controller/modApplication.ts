import express, { Response } from 'express';
import {
  AddModApplicationRequest,
  FakeSOSocket,
  ModApplication,
  UpdateModApplicationStatusRequest,
} from '../types';
import { addModApplication, fetchModApplications, updateStatus } from '../models/application';

export const modApplicationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the mod application to ensure it contains all the necessary fields and that they are valid.
   *
   * @param user - The user who submitted the application.
   * @param applicationText - The additional information the user provided in the application.
   *
   * @returns `true` if the user and applicationText are valid, otherwise `false`.
   */
  const isModApplicationBodyValid = (
    username: string,
    password: string,
    isModerator: boolean,
    applicationText: string,
  ): boolean =>
    username !== undefined &&
    username !== '' &&
    password !== undefined &&
    password !== '' &&
    isModerator === false &&
    applicationText !== undefined &&
    applicationText !== '';

  /**
   * Adds a new ModApplication to the database. The application is first validated and then saved.
   * If saving the application fails, the HTTP response status is updated.
   *
   * @param req - The AddModApplicationRequest object containing the application data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const createModApplication = async (
    req: AddModApplicationRequest,
    res: Response,
  ): Promise<void> => {
    const { modApplication } = req.body;
    const { user, applicationText } = modApplication;
    const { username, password, isModerator } = user;
    if (!isModApplicationBodyValid(username, password, isModerator, applicationText)) {
      res.status(400).send('Invalid application body');
      return;
    }

    try {
      const modAppFromDb = await addModApplication(username, applicationText);
      if ('error' in modAppFromDb) {
        if (modAppFromDb.error === 'User already created an application request') {
          res.status(409).send(modAppFromDb.error);
          return;
        }
        throw new Error(modAppFromDb.error);
      }

      socket.emit('modApplicationUpdate', modAppFromDb as ModApplication);
      res.json(modAppFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding application: ${err.message}`);
      } else {
        res.status(500).send(`Error when adding application`);
      }
    }
  };

  /**
   * Retrieves all ModApplications in the database. If fetching the applications fails, the HTTP response status is updated.
   *
   * @param _ - Placeholder value.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getModApplications = async (_: AddModApplicationRequest, res: Response): Promise<void> => {
    try {
      const applications = await fetchModApplications();
      res.json(applications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching applications: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching applications`);
      }
    }
  };

  /**
   * Updates a specified ModApplication' status in the database. If updating the application fails, the HTTP response status is updated.
   *
   * @param req - The UpdateModApplicationStatusRequest object containing the application update data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateModApplicationStatus = async (
    req: UpdateModApplicationStatusRequest,
    res: Response,
  ): Promise<void> => {
    const { id, username, accepted } = req.body;
    try {
      const updated = await updateStatus(id, username, accepted);
      res.json(updated);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when upating application: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating application`);
      }
    }
  };

  router.post('/createModApplication', createModApplication);
  router.get('/getModApplications', getModApplications);
  router.post('/updateModApplicationStatus', updateModApplicationStatus);

  return router;
};

export default modApplicationController;
