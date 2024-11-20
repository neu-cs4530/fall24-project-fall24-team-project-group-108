import { useState } from 'react';
import Switch from '@mui/material/Switch';
import './index.css';
import { Notification } from '../../../types';
import { getMetaData } from '../../../tool';
import { markNotificationAsRead } from '../../../services/notificationService';

interface NotificationsTabProps {
  initialUnreadNotifications: Notification[];
  initialReadNotifications: Notification[];
  handleClick: (url: string) => void;
  onClose: () => void;
  handleUpdate: (notification: Notification) => void;
}

/**
 * Component to represent the notifications tab.
 */
const NotificationsTab = ({
  initialUnreadNotifications,
  initialReadNotifications,
  handleClick,
  onClose,
  handleUpdate,
}: NotificationsTabProps) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const [unreadNotifications, setUnreadNotifications] = useState(initialUnreadNotifications);
  const [readNotifications, setReadNotifications] = useState(initialReadNotifications);

  const handleTabChange = (tab: 'unread' | 'read') => {
    setActiveTab(tab);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark the notification as read
      await markNotificationAsRead(notification._id as string);

      // Update local state to move the notification from unread to read
      setUnreadNotifications(prevUnread => prevUnread.filter(n => n._id !== notification._id));
      setReadNotifications(prevRead => [notification, ...prevRead]);
      handleUpdate(notification);

      // Navigate to the notification URL
      handleClick(notification.redirectUrl);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className='notifications-dropdown'>
      <button className='close-button' onClick={onClose} aria-label='Close'>
        &times;
      </button>
      <h2>Notifications</h2>

      <div className='tabs'>
        <button
          className={activeTab === 'unread' ? 'active' : ''}
          onClick={() => handleTabChange('unread')}>
          Unread
        </button>
        <button
          className={activeTab === 'read' ? 'active' : ''}
          onClick={() => handleTabChange('read')}>
          Read
        </button>
      </div>

      {activeTab === 'unread' && unreadNotifications.length > 0 && (
        <div className='notifications'>
          {unreadNotifications.map(notification => (
            <div className='notification-view' key={notification._id}>
              <li className={notification.read ? 'read' : 'unread'}>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    handleNotificationClick(notification);
                  }}
                  className='notification-link'>
                  {notification.caption}
                </a>
              </li>
              <p className='notification-metadata'>
                {getMetaData(new Date(notification.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'unread' && unreadNotifications.length === 0 && (
        <p>You&apos;re all caught up!</p>
      )}

      {activeTab === 'read' && readNotifications.length > 0 && (
        <div className='notifications'>
          {readNotifications.map(notification => (
            <div className='notification-view' key={notification._id}>
              <li className={notification.read ? 'read' : 'unread'}>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    handleClick(notification.redirectUrl);
                  }}
                  className='notification-link'>
                  {notification.caption}
                </a>
              </li>
              <p className='notification-metadata'>
                {getMetaData(new Date(notification.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'read' && readNotifications.length === 0 && (
        <p>No read notifications. Check your inbox!</p>
      )}

      <div className='dnd-switch'>
        <p>Do Not Disturb</p>
        <Switch />
      </div>
    </div>
  );
};

export default NotificationsTab;
