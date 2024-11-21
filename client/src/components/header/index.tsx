import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import NotificationsOffTwoToneIcon from '@mui/icons-material/NotificationsOffTwoTone';
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
  const { val, handleInputChange, handleKeyDown } = useHeader();

  let notificationIcon;

  if (dndStatus) {
    // If dnd, show dnd icon
    notificationIcon = (
      <NotificationsOffTwoToneIcon
        onClick={toggleNotifications}
        sx={{
          height: '12%',
          width: '12%',
          color: 'red',
        }}
      />
    );
  } else if (newNotification) {
    // If there are new notifications, show active icon
    notificationIcon = (
      <NotificationsActiveTwoToneIcon
        onClick={toggleNotifications}
        sx={{
          'height': '12%',
          'width': '12%',
          'color': 'blue',
          '& .MuiSvgIcon-secondary': {
            fill: 'gray',
          },
        }}
      />
    );
  } else {
    // Show regular icon
    notificationIcon = (
      <NotificationsNoneTwoToneIcon
        onClick={toggleNotifications}
        sx={{
          'height': '12%',
          'width': '12%',
          'color': 'black',
          '& .MuiSvgIcon-secondary': {
            fill: 'gray',
          },
        }}
      />
    );
  }

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className='notifications-wrapper'>{notificationIcon}</div>
    </div>
  );
};

export default Header;
