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
    doNotDisturb,
    toggleDndStatus,
  } = useLayout();

  return (
    <div className='layout-container'>
      <div className='side-bar'>{!isBanPage && <SideBarNav />}</div>
      <div className='main-app'>
        <Header
          toggleNotifications={toggleNotifications}
          newNotification={unreadNotifications.length !== 0}
          dndStatus={doNotDisturb || false}
        />
        {isNotificationsOpen && (
          <NotificationsTab
            key={unreadNotifications.length}
            initialUnreadNotifications={unreadNotifications}
            initialReadNotifications={readNotifications}
            handleClick={handleNotificationClick}
            onClose={toggleNotifications}
            handleUpdate={handleNotificationUpdate}
            toggleDnd={toggleDndStatus}
            dnd={doNotDisturb || false}
          />
        )}
        <div id='main' className='main'>
          <div id='right_main' className='right_main'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
