import React, { useEffect, useState } from 'react';
import './index.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';
import NotificationsTab from '../main/notificationsTab';
import useUserContext from '../../hooks/useUserContext';
import { Notification } from '../../types';
import getNotifications from '../../services/notificationService';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let isBanPage = false;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const { user, socket } = useUserContext();

  const handleNotificationClick = (url: string) => {
    navigate(url);
  };

  useEffect(() => {
    const fetchReadNotifications = async () => {
      const initialNotifications = await getNotifications(user.username, 'read');
      setReadNotifications(initialNotifications); // Ensure new array reference
    };

    const fetchUnreadNotifications = async () => {
      const initialNotifications = await getNotifications(user.username, 'unread');
      setUnreadNotifications(initialNotifications); // Ensure new array reference
    };

    fetchReadNotifications();
    fetchUnreadNotifications();

    // Listen for 'notificationUpdate' from the server
    socket.on('notificationUpdate', (notification: Notification) => {
      if (notification.user.toString() === user.username) {
        // Add the new notification while ensuring a new reference
        setUnreadNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, notification];
          return updatedNotifications;
        });
        console.log(notification);
      }
    });

    return () => {
      socket.off('notificationUpdate');
    };
  }, [socket, user.username]);

  const handleNotificationUpdate = (notification: Notification) => {
    setUnreadNotifications(prevUnread => prevUnread.filter(n => n._id !== notification._id));
    console.log(notification);

    setReadNotifications(prevRead => {
      const updatedReadNotifications = [notification, ...prevRead];
      return updatedReadNotifications;
    });
  };

  // Toggle the notification dropdown and icon color
  const toggleNotifications = () => {
    setIsNotificationsOpen(prevState => !prevState);
  };

  if (location.pathname === '/ban') {
    isBanPage = true;
  }

  return (
    <>
      <Header
        toggleNotifications={toggleNotifications}
        newNotification={unreadNotifications.length !== 0}
      />
      {isNotificationsOpen && (
        <NotificationsTab
          key={unreadNotifications.length}
          initialUnreadNotifications={unreadNotifications}
          initialReadNotifications={readNotifications}
          handleClick={handleNotificationClick}
          onClose={toggleNotifications}
          handleUpdate={handleNotificationUpdate}
        />
      )}
      <div id='main' className='main'>
        {!isBanPage && <SideBarNav />}
        <div id='right_main' className='right_main'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
