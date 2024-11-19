import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ansBy`: The username of the user who provided the answer.
 * - `ansDateTime`: The date and time when the answer was given.
 * - `comments`: Comments that have been added to the answer by users.
 * - `reports`: List of reports made on the answer.
 * - `isRemoved`: Determines the removal state of the answer, true if removed by mod, otherwise false.
 */
const answerSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    ansBy: {
      type: String,
    },
    ansDateTime: {
      type: Date,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    reports: [{ type: Schema.Types.ObjectId, ref: 'UserReport' }],
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'Answer' },
);

export default answerSchema;
