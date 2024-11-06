import { Schema } from 'mongoose';

/**
 * Mongoose schema for the BadgeProgress collection.
 *
 * This schema defines the structure for tracking one user's progress towards one badge.
 * 
 * Each answer includes the following fields:
 * - `user`: The username of the user whose progress is being tracked.
 * - `badge`: The badge being tracked.
 * - `category`: The category of action that must be performed to obtain the badge.
 * - `targetValue`: The amount of times the category of action must be performed to obtain the badge.
 * - `currentValue`: The amount of times the category of action has been performed by the user
 */
const badgeProgressSchema: Schema = new Schema(
  {
    user: {
      type: String,
    },
    badge: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    category: {
      type: String,
    },
    targetValue: {
        type: Number,
    },
    currentValue: {
        type: Number,
    },   
  },
  { collection: 'BadgeProgress' },
);

export default badgeProgressSchema;
