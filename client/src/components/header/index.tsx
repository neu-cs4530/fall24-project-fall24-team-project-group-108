import { Button } from '@mui/material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOffTwoTone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useHeader from '../../hooks/useHeader';
import './index.css';

interface HeaderProps {
  toggleNotifications: () => void;
  newNotification: boolean;
  dndStatus: boolean;
}

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = ({ toggleNotifications, newNotification, dndStatus }: HeaderProps) => {
  const { val, handleInputChange, handleKeyDown, user, goToProfile, logOut } = useHeader();

  let notificationIcon;

  if (dndStatus) {
    // If dnd, show dnd icon
    notificationIcon = (
      <NotificationsOffIcon
        onClick={toggleNotifications}
        sx={{
          fontSize: 40,
          color: 'red',
        }}
      />
    );
  } else if (newNotification) {
    // If there are new notifications, show active icon
    notificationIcon = (
      <NotificationsActiveIcon
        onClick={toggleNotifications}
        sx={{
          fontSize: 40,
          color: '#64ade1',
        }}
      />
    );
  } else {
    // Show regular icon
    notificationIcon = (
      <NotificationsIcon
        onClick={toggleNotifications}
        sx={{
          'fontSize': 40,
          'color': '#363845',
          '&:hover': {
            color: '#64ade1',
          },
        }}
      />
    );
  }

  return (
    <div id='header' className='header'>
      <div className='user-greeting'>Hi, {user.username}!</div>
      <div className='left-header'>
        <input
          id='searchBar'
          placeholder='Search ...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ height: '40%', width: '80%' }}
        />
        <div className='notifications-wrapper'>{notificationIcon}</div>
        <AccountBoxIcon
          onClick={goToProfile}
          sx={{
            'fontSize': 40,
            'color': '#363845',
            '&:hover': {
              color: '#64ade1', // Color change on hover
            },
          }}
        />
        <Button onClick={logOut} sx={{ whiteSpace: 'nowrap' }}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Header;
