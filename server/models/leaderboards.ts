// Leaderboard Document Schema
import mongoose, { Model } from 'mongoose';
import { Leaderboard } from '../types';
import leaderboardSchema from './schema/leaderboard';

/**
 * Mongoose model for the `Leaderboard` collection.
 *
 * This model is created using the `Leaderboard` interface and the `LeaderboardSchema`, representing the
 * `Leaderboard` collection in the MongoDB database, and provides an interface for interacting with
 * the stored leaderboards.
 *
 * @type {Model<Leaderboard>}
 */
const LeaderboardModel: Model<Leaderboard> = mongoose.model<Leaderboard>(
  'Leaderboard',
  leaderboardSchema,
);

export default LeaderboardModel;
