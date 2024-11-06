import express, { Request, Response } from 'express';
import { FakeSOSocket, AddBadgeRequest, Badge, UpdateBadgeProgressRequest } from '../types';
import { getAllBadges, saveBadge, updateBadgeProgress } from '../models/application';

const badgeProgressController = (socket: FakeSOSocket) => {
  const router = express.Router();

    /**
   * Checks if the provided update progress request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isUpdateRequestValid = (req: UpdateBadgeProgressRequest): boolean =>
    !!req.body.username &&
    (req.body.category === 'questions' || req.body.category === 'answers' || req.body.category === 'leaderboard' || req.body.category === 'comments' || req.body.category === 'votes');


  /**
   * Handles adding a new badge. The badge is first validated and then saved.
   * If the badge is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddBadgeRequest object containing the badge data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateProgress = async(req: UpdateBadgeProgressRequest, res: Response): Promise<void> => {
    if (!isUpdateRequestValid(req)) {
        res.status(400).send('Invalid request');
        return;
    }

    const { username } = req.body;
    const { category } = req.body;

    try {
        const updatedBadgeProgress = await updateBadgeProgress(username, category);

        if ('error' in updatedBadgeProgress) {
            throw new Error(updatedBadgeProgress.error);
        }

        res.json(updatedBadgeProgress);
    } catch (err: unknown) {
        res.status(500).send(`Error when update badge progress: ${(err as Error).message}`);
    }

  }

  router.post('/update', updateProgress);

  return router;
};

export default badgeProgressController;
