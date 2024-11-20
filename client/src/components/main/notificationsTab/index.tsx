import './index.css';
import { Notification } from '../../../types';

interface NotificationsTabProps {
  notifications: Notification[];
  handleClick: (url: string) => void;
}

/**
 * Component to represent the notifications tab.
 */
const NotificationsTab = ({ notifications, handleClick }: NotificationsTabProps) => (
  <div className='notifications-dropdown'>
    <h2>Notifications</h2>
    {notifications.length === 0 ? (
      <p>No new notifications.</p>
    ) : (
      <ul>
        {notifications.map(notification => (
          <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
            <a href='#' onClick={() => handleClick(notification.redirectUrl)}>
              {notification.caption}
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NotificationsTab;
