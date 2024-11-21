import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';
import NotificationsTab from '../main/notificationsTab';
import useLayout from '../../hooks/useLayout';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => {
  const {
    toggleNotifications,
    unreadNotifications,
    isNotificationsOpen,
    readNotifications,
    handleNotificationClick,
    handleNotificationUpdate,
    isBanPage,
  } = useLayout();

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
