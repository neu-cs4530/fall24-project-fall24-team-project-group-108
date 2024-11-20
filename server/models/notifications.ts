import mongoose, { Model } from 'mongoose';
import { Notification } from '../types';
import notificationSchema from './schema/notification';

/**
 * Mongoose model for the `Notification` collection.
 *
 * This model is created using the `Notification` interface and the `notificationSchema`, representing the
 * `Notification` collection in the MongoDB database, and provides an interface for interacting with
 * the stored notifs.
 *
 * @type {Model<Notification>}
 */
const NotificationModel: Model<Notification> = mongoose.model<Notification>(
  'Notification',
  notificationSchema,
);

export default NotificationModel;
