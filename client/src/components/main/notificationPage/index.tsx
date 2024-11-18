import React from 'react';
import './index.css';
import NotificationView from './notification';
import useNotificationPage from '../../../hooks/useNotificationPage';

/**
 * NotificationPage component renders a page displaying a list of notifications
 */
const NotificationPage = () => {
  const { } = useNotificationPage();

  return (
      <div className='notificationContainer'>
          Notification Page
      </div>
  );
};

export default NotificationPage;
