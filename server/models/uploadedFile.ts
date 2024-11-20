import mongoose, { Model } from 'mongoose';
import uploadedFileSchema from './schema/uploadedFile';
import { UploadedFile } from '../types';

/**
 * Mongoose model for the `UploadedFile` collection.
 *
 * This model is created using the `UploadedFile` interface and the `uploadedFileSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<UploadedFile>}
 */
const UploadedFileModel: Model<UploadedFile> = mongoose.model<UploadedFile>('UploadedFile', uploadedFileSchema);

export default UploadedFileModel;
