import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure of users in the database.
 * Each user includes the following fields:
 * - `username`: The name of the user.
 * - `password`: The password of the user.
 * - `isModerator`: If the user has moderator privileges.
 * - `infractions`: List of removed Answers/Questions by the user.
 * - `badges`: Badges obtained by the user.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    isModerator: {
      type: Boolean,
    },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    infractions: [{ type: String }],
  },
  { collection: 'User' },
);

export default userSchema;
