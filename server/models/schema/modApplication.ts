import { Schema } from 'mongoose';

/**
 * Mongoose schema for the ModApplication collection.
 *
 * This schema defines the structure of moderator applications in the database.
 * Each application includes the following fields:
 * - `user`: The user who applied.
 * - `applicationText`: the information the user provided in their application.
 */
const modApplicationSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    applicationText: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'ModApplication' },
);

export default modApplicationSchema;
