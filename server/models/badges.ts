import mongoose, { Model } from 'mongoose';
import badgeSchema from './schema/badge';
import { Badge } from '../types';

/**
 * Mongoose model for the `Badge` collection.
 *
 * This model is created using the `Badge` interface and the `badgeSchema`, representing the
 * `Badge` collection in the MongoDB database, and provides an interface for interacting with
 * the stored badges.
 *
 * @type {Model<Badge>}
 */
const BadgeModel: Model<Badge> = mongoose.model<Badge>('Badge', badgeSchema);

export default BadgeModel;
