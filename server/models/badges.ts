import mongoose, { Model } from 'mongoose';
import badgeSchema from './schema/badge';
import { Badge } from '../types';

/**
 * Mongoose model for the `Comment` collection.
 *
 * This model is created using the `Comment` interface and the `commentSchema`, representing the
 * `Comment` collection in the MongoDB database, and provides an interface for interacting with
 * the stored comments.
 *
 * @type {Model<Comment>}
 */
const BadgeModel: Model<Badge> = mongoose.model<Badge>('Badge', badgeSchema);

export default BadgeModel;
