import { Schema } from 'mongoose';
/**
 * Mongoose schema for the UploadedFile collection.
 *
 * This schema defines the structure for storing uploaded files in the database.
 * Each uploaded file includes the following fields:
 *
 * - _id - The id of the UploadedFile object
 * - fileName - the name of the file
 * - data - The binary data of the file
 */
const uploadedFileSchema: Schema = new Schema(
  {
    fileName: { type: String },
    data: { type: Buffer },
  },
);

export default uploadedFileSchema;
