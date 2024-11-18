import express, { Request, Response, Router } from 'express';
import { getTagCountMap } from '../models/application';
import TagModel from '../models/tags';
import TagAnswerCountModel from '../models/tagAnswerCounts';

const tagController = () => {
  const router: Router = express.Router();

  /**
   * Retrieves a list of tags along with the number of questions associated with each tag.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param _ The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the tag count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  const getTagsWithQuestionNumber = async (_: Request, res: Response): Promise<void> => {
    try {
      const tagcountmap = await getTagCountMap();
      if (!(tagcountmap instanceof Map)) {
        throw new Error('Error while fetching tag count map');
      } else {
        res.json(
          Array.from(tagcountmap, ([name, qcnt]: [string, number]) => ({
            name,
            qcnt,
          })),
        );
      }
    } catch (err) {
      res.status(500).send(`Error when fetching tag count map: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a tag from the database by its name, provided in the request parameters.
   * If the tag is not found or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The Request object containing the tag name in the URL parameters.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getTagByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params; // Get the tag name from the request parameters
      const tag = await TagModel.findOne({ name }); // Use the model's method to find the tag

      if (!tag) {
        res.status(404).send(`Tag with name "${name}" not found`);
      } else {
        res.json(tag); // Return the tag as JSON
      }
    } catch (err) {
      res.status(500).send(`Error when fetching tag: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a tag leaderboard from the database by its name, provided in the request parameters.
   * If the tag is not found or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The Request object containing the tag name in the URL parameters.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tagName } = req.params;

      // find the tagid of the tag with the given name
      const tag = await TagModel.findOne({ name: tagName }).exec();
      if (!tag) {
        res.status(404).send(`Tag not found for name: ${tagName}`);
        return;
      }

      // find all TagAnswerCounts
      const tagAnswerCounts = await TagAnswerCountModel.find({ tag: tag._id })
        .sort({ count: -1 }) //  descending order
        .populate('user', 'username')
        .exec();

      res.status(200).json(tagAnswerCounts);
    } catch (err) {
      res.status(500).send(`Error when fetching tag leaderboard: ${(err as Error).message}`);
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router.
  router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);
  router.get('/getTagByName/:name', getTagByName);
  router.get('/getLeaderboard/:tagName', getLeaderboard);

  return router;
};

export default tagController;
