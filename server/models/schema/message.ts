import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Message collection.
 *
 * This schema defines the structure for storing messages in the database.
 * Each message includes the following fields:
 *
 * - messageText - The content of the message
 * - messageDateTime - The date and time the message was sent
 * - messageBy - The username of the user who sent the message
 * - messageTo - A list of usernames of users who the message was sent to
 */
const messageSchema: Schema = new Schema(
  {
    messageBy: {
      type: String,
    },
    messageText: {
      type: String,
    },
    messageDateTime: {
      type: Date,
    },
    messageTo: [{ type: String }],
    views: [{ type: String }],
    isCodeStyle: {
      type: Boolean,
    },
    fileName: { type: String },
    fileData: [{ type: Number }],
    emojiTracker: {
      type: Map,
      of: String,
    },
    isDeleted: { type: Boolean },
  },
  { collection: 'Message' },
);

export default messageSchema;
