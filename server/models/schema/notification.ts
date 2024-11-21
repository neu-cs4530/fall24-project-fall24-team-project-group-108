import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each answer includes the following fields:
 * - `user`: The user receiving the notification.
 * - `type`: The type of notification it is.
 * - `caption`: The caption of the notification.
 * - `read`: Whether or not the notification was read.
 * - `createdAt`: When the notification was made.
 * - `redirectUrl`: The url to go to when the notification is clicked.
 */
const notificationSchema: Schema = new Schema(
  {
    user: { type: String },
    type: {
      type: String,
    },
    caption: {
      type: String,
    },
    read: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
    },
    redirectUrl: {
      type: String,
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
