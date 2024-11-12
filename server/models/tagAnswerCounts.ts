// TagAnswerCount Document Schema
import mongoose, { Model } from 'mongoose';
import questionSchema from './schema/question';
import { TagAnswerCount } from '../types';
import tagAnswerCountSchema from './schema/tagAnswerCount';

/**
 * Mongoose model for the `TagAnswerCount` collection.
 *
 * This model is created using the `TagAnswerCount` interface and the `TagAnswerCountSchema`, representing the
 * `TagAnswerCount` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<TagAnswerCount>}
 */
const TagAnswerCountModel: Model<TagAnswerCount> = mongoose.model<TagAnswerCount>('TagAnswerCount', tagAnswerCountSchema);

export default TagAnswerCountModel;
