import { Schema } from 'mongoose';

/**
 * Mongoose schema for the ModApplication collection.
 *
 * This schema defines the structure of moderator applications in the database.
 * Each application includes the following fields:
 * - `user`: The user who applied.
 * - `applicationText`: the information the user provided in their application.
 * - `status`: The curretn status of the mod application.
 */
const modApplicationSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    applicationText: {
      type: String,
    },
    status: {
      type: String,
      enum: ['unresolved', 'accepted', 'rejected'],
      default: 'unresolved',
    },
  },
  { collection: 'ModApplication' },
);

export default modApplicationSchema;
