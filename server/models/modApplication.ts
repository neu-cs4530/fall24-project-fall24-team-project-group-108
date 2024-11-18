import mongoose, { Model } from 'mongoose';
import modApplicationSchema from './schema/modApplication';
import { ModApplication } from '../types';

/**
 * Mongoose model for the `ModApplication` collection.
 *
 * This model is created using the `ModApplication` interface and the `modApplicationSchema`, representing the
 * `ModApplication` collection in the MongoDB database, and provides an interface for interacting with
 * the stored applications.
 *
 * @type {Model<ModApplication>}
 */
const ModApplicationModel: Model<ModApplication> = mongoose.model<ModApplication>(
  'ModApplication',
  modApplicationSchema,
);

export default ModApplicationModel;
