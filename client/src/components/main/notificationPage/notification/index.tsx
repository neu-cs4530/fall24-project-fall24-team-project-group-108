import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Notification } from '../../../../types';
import useNotificationView from '../../../../hooks/useNotificationView';

/**
 * Interface representing the props for the Notification component.
 *
 * notification - The notification object containing details about the notification.
 */
interface NotificationProps {
  notification: Notification;
}

/**
 * Notification component renders the contents of a notification including its text and date sent
 *
 * @param notification - The notification object containing notification details.
 */
const NotificationView = ({ notification }: NotificationProps) => {
  const navigate = useNavigate();
  const {} = useNotificationView(notification);

  return <div className='notificationContainer'>Notification Item</div>;
};

export default NotificationView;
