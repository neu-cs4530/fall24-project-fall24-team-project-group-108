import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure of users in the database.
 * Each user includes the following fields:
 * - `username`: The name of the user.
 * - `password`: The password of the user.
 * - `isModerator`: If the user has moderator privileges.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    isModerator: {
      required: true,
      type: Boolean,
    },
  },
  { collection: 'User' },
);

export default userSchema;
