import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure of users in the database.
 * Each user includes the following fields:
 * - `username`: The name of the user.
 * - `password`: The password of the user.
 * - `isModerator`: If the user has moderator privileges.
 * - `badges`: Badges obtained by the user.
 * - 'profileIcon' : The badge for the user's profile picture.
 * - `infractions`: List of removed Answers/Questions by the user.
 * - `doNotDisturb`: Whether or not the user is on do not disturb.
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
    profileIcon: { type: String, required: false },
    infractions: [{ type: String }],
    doNotDisturb: { type: Boolean, default: false },
    isBanned: { type: Boolean },
  },
  { collection: 'User' },
);

export default userSchema;
