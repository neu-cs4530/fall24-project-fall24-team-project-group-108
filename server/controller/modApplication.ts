import express, { Response } from 'express';
import { AddModApplicationRequest } from '../types';
import { addModApplication, fetchModApplications } from '../models/application';

export const modApplicationController = () => {
  const router = express.Router();

  /**
   * Validates the mod application to ensure it contains all the necessary fields.
   *
   * @param user - The user who submitted the application.
   * @param applicationText - The additional information the user provided in the application.
   *
   * @returns `true` if the user and applicationText are valid, otherwise `false`.
   */
  const isModApplicationBodyValid = (
    username: string,
    isModerator: boolean,
    applicationText: string,
  ): boolean =>
    username !== undefined &&
    username !== '' &&
    isModerator === false &&
    applicationText !== undefined &&
    applicationText !== '';

  /**
   * Adds a new user to the database. The user is first validated and then saved.
   * If saving the user fails, the HTTP response status is updated.
   *
   * @param req The AddUserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const createModApplication = async (
    req: AddModApplicationRequest,
    res: Response,
  ): Promise<void> => {
    const { modApplication } = req.body;
    const { user, applicationText } = modApplication;
    if (!isModApplicationBodyValid(user.username, user.isModerator, applicationText)) {
      res.status(400).send('Invalid application body');
      return;
    }

    try {
      const modAppFromDb = await addModApplication(modApplication);
      if ('error' in modAppFromDb) {
        if (modAppFromDb.error === 'User already created an application request') {
          res.status(409).send(modAppFromDb.error);
          return;
        }
        throw new Error(modAppFromDb.error);
      }

      res.json(modAppFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding application: ${err.message}`);
      } else {
        res.status(500).send(`Error when adding application`);
      }
    }
  };

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

  router.post('/createModApplication', createModApplication);
  router.get('/getModApplications', getModApplications);

  return router;
};

export default modApplicationController;
