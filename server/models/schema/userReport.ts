import { Schema } from 'mongoose';

/**
 * Mongoose schema for the UserReport collection.
 *
 * This schema defines the structure of report used in questions and answers in the database.
 * Each comment includes the following fields:
 * - `text`: The content of the comment.
 * - `reportBy`: The username of the user who submitted the report.
 * - `reportDateTime`: The date and time when the report was posted.
 * - `status`: The status of the report, false if not reviewed
 */
const userReportSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    reportBy: {
      type: String,
    },
    reportDateTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['unresolved', 'dismissed', 'removed'],
      default: 'unresolved',
    },
  },
  { collection: 'UserReport' },
);

export default userReportSchema;
