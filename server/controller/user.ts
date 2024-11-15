import express, { Response } from 'express';
import {
  AddUserRequest,
  FindUserRequest,
  MakeUserModeratorRequest,
  ResetPasswordRequest,
} from '../types';
import { addUser, findUser, populateUser, updatePassword } from '../models/application';

export const userController = () => {
  const router = express.Router();

  /**
   * Validates the user to ensure it contains all the necessary fields.
   *
   * @param username - The input username to validate.
   * @param password - The input password to validate.
   *
   * @returns `true` if the username and password are valid, otherwise `false`.
   */
  const isUserBodyValid = (username: string, password: string): boolean =>
    username !== undefined && username !== '' && password !== undefined && password !== '';

  /**
   * Determines if a user is in the database and then finds their information.
   *
   * @param req The FindUserRequest object containing the input user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const authenticateUser = async (req: FindUserRequest, res: Response): Promise<void> => {
    const { username, password } = req.query;
    if (!isUserBodyValid(username, password)) {
      res.status(400).send('Invalid user body');
      return;
    }

    try {
      const user = await findUser(username, password);
      res.json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when authenticating user: ${err.message}`);
      } else {
        res.status(500).send(`Error when authenticating user`);
      }
    }
  };

  /**
   * Adds a new user to the database. The user is first validated and then saved.
   * If saving the user fails, the HTTP response status is updated.
   *
   * @param req - The AddUserRequest object containing the user data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const createUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!isUserBodyValid(username, password)) {
      res.status(400).send('Invalid user body');
      return;
    }
    try {
      const user = await addUser({ username, password, isModerator: false, badges: [] });
      if (!user) {
        res.status(400).send('Username already taken');
        return;
      }

      res.json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when authenticating user: ${err.message}`);
      } else {
        res.status(500).send(`Error when authenticating user`);
      }
    }
  };

  /**
   * Resets a password in the database. The user is first validated, and then the password
   * is updated. If updating the password fails, the HTTP response status is updated.
   *
   * @param req - The ResetPasswordRequest object containing the user and new password data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const resetPassword = async (req: ResetPasswordRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!isUserBodyValid(username, password)) {
      res.status(400).send('Invalid user body');
      return;
    }
    try {
      const user = await updatePassword(username, password);
      if (!user) {
        res.status(400).send('New password required for reset');
        return;
      }

      res.json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when reseting password: ${err.message}`);
      } else {
        res.status(500).send(`Error when reseting password`);
      }
    }
  };

  /**
   * Makes an existing user in the database a moderator. If updating the isModerator field fails, the HTTP response status is updated.
   *
   * @param req - the MakeUserModeratorRequest containing the user data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const makeUserModerator = async (req: MakeUserModeratorRequest, res: Response): Promise<void> => {
    const { username } = req.body;
    // if (!isUserBodyValid(username, password)) {
    //   res.status(400).send('Invalid user body');
    //   return;
    // }
    try {
      // const authenticatedUser = await findUser(id, username);
      // if (!authenticatedUser) {
      //   res.status(400).send('User cannot be found in the database');
      //   return;
      // }
      // const authetnicatedUsername = authenticatedUser.username;
      // New users are automatically not a moderator, need to be approved to become a moderator.
      const populatedUser = await populateUser(username);
      if (populatedUser && 'error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      res.json(populatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating user moderator status: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating user moderator status`);
      }
    }
  };

  router.get('/authenticateUser', authenticateUser);
  router.post('/createUser', createUser);
  router.post('/resetPassword', resetPassword);
  router.post('/makeUserModerator', makeUserModerator);

  return router;
};

export default userController;
