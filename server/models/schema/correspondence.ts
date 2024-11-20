import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Correspondence collection.
 *
 * This schema defines the structure for storing correspondences in the database.
 * Each correspondence includes the following fields:
 *
 * - messageText - The content of the message
 * - messageDateTime - The date and time the message was sent
 * - messageBy - The username of the user who sent the message
 * - messageTo - A list of usernames of users who the message was sent to
 */
const correspondenceSchema: Schema = new Schema(
  {
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    messageMembers: [{ type: String }],
    views: [{ type: String }],
    userTyping: [{ type: String }],
  },
  { collection: 'Correspondence' },
);

export default correspondenceSchema;
