import express, { Request, Response } from 'express';
import {
  FakeSOSocket,
  AddBadgeRequest,
  Badge,
  UserBadgeRequest,
  EarnedUserRequest,
} from '../types';
import {
  getAllBadges,
  getBadgeCategoryAndTierByUsername,
  getBadgesByUser,
  getBadgeUsers,
  saveBadge,
} from '../models/application';

const badgeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddBadgeRequest): boolean =>
    !!req.body.name &&
    !!req.body.description &&
    (req.body.category === 'questions' ||
      req.body.category === 'answers' ||
      req.body.category === 'leaderboard' ||
      req.body.category === 'comments' ||
      req.body.category === 'votes') &&
    !!req.body.targetValue &&
    (req.body.tier === 'bronze' || req.body.tier === 'silver' || req.body.tier === 'gold');

  /**
   * Handles adding a new badge. The badge is first validated and then saved.
   * If the badge is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddBadgeRequest object containing the badge data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addBadgeRoute = async (req: AddBadgeRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const badge: Badge = req.body;

    try {
      const badgeFromDb = await saveBadge(badge);

      if ('error' in badgeFromDb) {
        throw new Error(badgeFromDb.error);
      }
      res.json(badgeFromDb);
    } catch (err: unknown) {
      res.status(500).send(`Error when adding badge: ${(err as Error).message}`);
    }
  };

  /**
   * Handles grabbing all existing badges from the db.
   *
   * @param req The Request object.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getBadges = async (req: Request, res: Response): Promise<void> => {
    try {
      const badges: Badge[] = await getAllBadges();
      res.status(200).json(badges);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching badges:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Handles grabbing all existing badges from the db.
   *
   * @param req The Request object.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserBadges = async (req: UserBadgeRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const badges: Badge[] = await getBadgesByUser(username);
      res.status(200).json(badges);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching badges:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Handles grabbing all existing badges from the db.
   *
   * @param req The Request object.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getEarnedUsers = async (req: EarnedUserRequest, res: Response): Promise<void> => {
    try {
      const { badgeName } = req.params;
      const users: string[] = await getBadgeUsers(badgeName);
      res.status(200).json(users);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Retrieves the category and tier of a badge by its name.
   *
   * @param req - The HTTP request object containing the badge name in the query parameters.
   * @param res - The HTTP response object used to send back the badge details or an error message.
   *
   * @returns A Promise that resolves to void.
   */
  const getBadgeDetails = async (
    req: { query: { username: string } },
    res: Response,
  ): Promise<void> => {
    const { username } = req.query;

    if (!username) {
      res.status(400).send('Username is required');
      return;
    }

    try {
      const badgeDetails = await getBadgeCategoryAndTierByUsername(username);
      if (badgeDetails.error) {
        res.status(404).send(badgeDetails.error);
        return;
      }

      res.json({ category: badgeDetails.category, tier: badgeDetails.tier });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error retrieving badge details: ${err.message}`);
      } else {
        res.status(500).send(`Error retrieving badge details`);
      }
    }
  };

  router.get('/allBadges', getBadges);
  router.get('/byUser/:username', getUserBadges);
  router.get('/getEarnedUsers/:badgeName', getEarnedUsers);
  router.get('/getBadgeDetails', getBadgeDetails);
  router.post('/addBadge', addBadgeRoute);

  return router;
};

export default badgeController;
