import mongoose, { Model } from 'mongoose';
import { UserReport } from '../types';
import userReportSchema from './schema/userReport';

/**
 * Mongoose model for the `Comment` collection.
 *
 * This model is created using the `Comment` interface and the `commentSchema`, representing the
 * `Comment` collection in the MongoDB database, and provides an interface for interacting with
 * the stored comments.
 *
 * @type {Model<UserReport>}
 */
const UserReportModel: Model<UserReport> = mongoose.model<UserReport>(
  'UserReport',
  userReportSchema,
);

export default UserReportModel;
