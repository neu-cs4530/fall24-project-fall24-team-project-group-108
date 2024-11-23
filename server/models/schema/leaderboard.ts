import { Schema } from 'mongoose';

/**
 * Mongoose schema for storing leaderboard positions of users for a given tag.
 * This schema tracks the ranking of users who answer questions for a specific tag.
 * Each leaderboard entry stores:
 * - user: The id of the user
 * - tag: The id of the tag being ranked
 * - position: The position of the user in the leaderboard for the given tag
 * - count: The number of answers the user has for this tag (used for ranking)
 */
const leaderboardSchema: Schema = new Schema(
  {
    user: [{ type: String }],
    tag: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
    position: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  { collection: 'Leaderboard' },
);

export default leaderboardSchema;
