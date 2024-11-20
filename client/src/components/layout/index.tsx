import React, { useEffect, useState } from 'react';
import './index.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';
import NotificationsTab from '../main/notificationsTab';
import useUserContext from '../../hooks/useUserContext';
import { Notification } from '../../types';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let isBanPage = false;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, socket } = useUserContext();

  const handleNotificationClick = (url: string) => {
    navigate(url);
  };

  useEffect(() => {
    // Listen for 'notificationUpdate' from the server
    socket.on('notificationUpdate', (notification: Notification) => {
      if (notification.user.toString() === user.username) {
        setNotifications(prevNotifications => [...prevNotifications, notification]);
      }
    });

    return () => {
      socket.off('notificationUpdate');
    };
  }, [socket]);

  // Toggle the notification dropdown and icon color
  const toggleNotifications = () => {
    setIsNotificationsOpen(prevState => !prevState);
  };

  if (location.pathname === '/ban') {
    isBanPage = true;
  }

  return (
    <>
      <Header toggleNotifications={toggleNotifications} />
      {isNotificationsOpen && (
        <NotificationsTab notifications={notifications} handleClick={handleNotificationClick} />
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
