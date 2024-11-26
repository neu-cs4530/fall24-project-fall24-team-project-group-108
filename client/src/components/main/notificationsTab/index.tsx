import Switch from '@mui/material/Switch';
import './index.css';
import { Notification } from '../../../types';
import { getMetaData } from '../../../tool';
import useNotificationsTab from '../../../hooks/useNotificationsTab';

interface NotificationsTabProps {
  initialUnreadNotifications: Notification[];
  initialReadNotifications: Notification[];
  handleClick: (url: string) => void;
  onClose: () => void;
  handleUpdate: (notification: Notification) => void;
  toggleDnd: () => void;
  dnd: boolean;
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
  toggleDnd,
  dnd,
}: NotificationsTabProps) => {
  const {
    activeTab,
    handleTabChange,
    unreadNotifications,
    readNotifications,
    handleNotificationClick,
  } = useNotificationsTab({
    handleUpdate,
    initialReadNotifications,
    initialUnreadNotifications,
    handleClick,
  });

  return (
    <div className='notifications-dropdown'>
      <button className='close-button' onClick={onClose} aria-label='Close'>
        &times;
      </button>
      <div className='notifications-title'>Notifications</div>

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
                {['answer', 'comment'].includes(notification.type) ? (
                  <span>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault();
                        handleNotificationClick(
                          notification,
                          `account/${notification.caption.split(' ')[0]}`,
                        );
                      }}
                      className='notification-link username-link'>
                      {notification.caption.split(' ')[0]}{' '}
                    </a>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault();
                        handleNotificationClick(notification, notification.redirectUrl);
                      }}
                      className='notification-link content-link'>
                      {notification.caption.split(' ').slice(1).join(' ')}
                    </a>
                  </span>
                ) : (
                  <a
                    href='#'
                    onClick={e => {
                      e.preventDefault();
                      handleNotificationClick(notification, notification.redirectUrl);
                    }}
                    className='notification-link'>
                    {notification.caption}
                  </a>
                )}
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
                {['answer', 'comment'].includes(notification.type) ? (
                  <span>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault();
                        handleClick(`account/${notification.caption.split(' ')[0]}`);
                      }}
                      className='notification-link username-link'>
                      {notification.caption.split(' ')[0]}{' '}
                    </a>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault();
                        handleClick(notification.redirectUrl);
                      }}
                      className='notification-link content-link'>
                      {notification.caption.split(' ').slice(1).join(' ')}
                    </a>
                  </span>
                ) : (
                  <a
                    href='#'
                    onClick={e => {
                      e.preventDefault();
                      handleClick(notification.redirectUrl);
                    }}
                    className='notification-link'>
                    {notification.caption}
                  </a>
                )}
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

      <div className='dnd-header'>
        <div className='dnd-title'>
          <Switch checked={dnd} onChange={toggleDnd} />
          Do Not Disturb
        </div>
        <div className='dnd-switch'>
          {dnd ? <p>You are on do not disturb</p> : <p>You are receiving notifications</p>}
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
