import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Badge collection.
 *
 * This schema defines the structure for storing badges in the database.
 * Each answer includes the following fields:
 * - `name`: The name of the badge.
 * - `description`: The description of how the badge can be obtained.
 * - `category`: The category of action that must be performed to obtain the badge.
 * - `targetValue`: The amount of times the category of action must be performed to obtain the badge.
 * - `users`: The first 10 users to have obtained this badge. -- HAVE NOT ADDED THIS FIELD YET
 */
const badgeSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    targetValue: {
        type: Number,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'Badge' },
);

export default badgeSchema;
