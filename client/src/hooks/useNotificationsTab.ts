import { useState } from 'react';
import { Notification } from '../types';
import { markNotificationAsRead } from '../services/notificationService';

interface UseNotificationsTabProps {
  handleUpdate: (notification: Notification) => void;
  initialUnreadNotifications: Notification[];
  initialReadNotifications: Notification[];
  handleClick: (url: string) => void;
}

/**
 * Custom hook to handle logic for notifications tab
 *
 * @returns activeTab - The state holding the tab being viewed.
 * @returns handleTabChange - Handler to toggle between tags.
 * @returns unreadNotifications - The current unread notifs.
 * @returns readNotifications - The current read notifs.
 * @returns handleNotificationClick - Handler to deal with reading a new notif.
 */
const useNotificationsTab = ({
  handleUpdate,
  initialUnreadNotifications,
  initialReadNotifications,
  handleClick,
}: UseNotificationsTabProps) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const [unreadNotifications, setUnreadNotifications] = useState(initialUnreadNotifications);
  const [readNotifications, setReadNotifications] = useState(initialReadNotifications);

  /**
   * handles toggling between unread and read notification tabs
   *
   * @param tab the tab to switch to
   */
  const handleTabChange = (tab: 'unread' | 'read') => {
    setActiveTab(tab);
  };

  /**
   * handles actions after clicking on an unread notification
   *
   * @param notification the notification being read
   */
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
    } catch (e) {
      throw new Error('Error fetching data');
    }
  };

  return {
    activeTab,
    handleTabChange,
    unreadNotifications,
    readNotifications,
    handleNotificationClick,
  };
};

export default useNotificationsTab;
