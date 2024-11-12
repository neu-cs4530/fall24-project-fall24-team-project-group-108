import mongoose, { Model } from 'mongoose';
import { BadgeProgress } from '../types';
import badgeProgressSchema from './schema/badgeProgress';

/**
 * Mongoose model for the `BadgeProgress` collection.
 *
 * This model is created using the `BadgeProgress` interface and the `badgeProgressSchema`, representing the
 * `badgeProgress` collection in the MongoDB database, and provides an interface for interacting with
 * the stored badge progresses.
 *
 * @type {Model<BadgeProgress>}
 */
const BadgeProgressModel: Model<BadgeProgress> = mongoose.model<BadgeProgress>(
  'BadgeProgress',
  badgeProgressSchema,
);

export default BadgeProgressModel;
