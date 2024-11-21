import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Notification } from '../types';
import getNotifications from '../services/notificationService';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle logic for layout component
 *
 * @returns title - The current value of the title input.
 * @returns text - The current value of the text input.
 * @returns tagNames - The current value of the tags input.
 * @returns titleErr - Error message for the title field, if any.
 * @returns textErr - Error message for the text field, if any.
 * @returns tagErr - Error message for the tag field, if any.
 * @returns postQuestion - Function to validate the form and submit a new question.
 */
const useLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let isBanPage = false;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const { user, socket } = useUserContext();

  /**
   * Handles redirecting to view a notification
   *
   * @param url the url to redirect to
   */
  const handleNotificationClick = (url: string) => {
    navigate(url);
  };

  useEffect(() => {
    /**
     * Fetches newest read notifs
     */
    const fetchReadNotifications = async () => {
      const initialNotifications = await getNotifications(user.username, 'read');
      setReadNotifications(initialNotifications); // Ensure new array reference
    };

    /**
     * Fetches newest unread notifs
     */
    const fetchUnreadNotifications = async () => {
      const initialNotifications = await getNotifications(user.username, 'unread');
      setUnreadNotifications(initialNotifications); // Ensure new array reference
    };

    fetchReadNotifications();
    fetchUnreadNotifications();

    // Listen for 'notificationUpdate' emit from the server and add to the list
    socket.on('notificationUpdate', (notification: Notification) => {
      if (notification.user.toString() === user.username) {
        setUnreadNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, notification];
          return updatedNotifications;
        });
      }
    });

    return () => {
      socket.off('notificationUpdate');
    };
  }, [socket, user.username]);

  /**
   * Handle a new notification by updating states
   *
   * @param notification new notification
   */
  const handleNotificationUpdate = (notification: Notification) => {
    setUnreadNotifications(prevUnread => prevUnread.filter(n => n._id !== notification._id));

    setReadNotifications(prevRead => {
      const updatedReadNotifications = [notification, ...prevRead];
      return updatedReadNotifications;
    });
  };

  /**
   * Toggle whether or not the notifs tab is open
   */
  const toggleNotifications = () => {
    setIsNotificationsOpen(prevState => !prevState);
  };

  if (location.pathname === '/ban') {
    isBanPage = true;
  }

  return {
    toggleNotifications,
    unreadNotifications,
    isNotificationsOpen,
    readNotifications,
    handleNotificationClick,
    handleNotificationUpdate,
    isBanPage,
  };
};

export default useLayout;
