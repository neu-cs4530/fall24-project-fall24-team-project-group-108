// Question Document Schema
import mongoose, { Model } from 'mongoose';
import correspondenceSchema from './schema/correspondence';
import { Correspondence } from '../types';

/**
 * Mongoose model for the `Correspondence` collection.
 *
 * This model is created using the `Correspondence` interface and the `correspondenceSchema`, representing the
 * `Correspondence` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<Correspondence>}
 */
const CorrespondenceModel: Model<Correspondence> = mongoose.model<Correspondence>(
  'Correspondence',
  correspondenceSchema,
);

export default CorrespondenceModel;
