import NotificationsIcon from '@mui/icons-material/Notifications';
import useHeader from '../../hooks/useHeader';
import './index.css';

interface HeaderProps {
  toggleNotifications: () => void;
}

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = ({ toggleNotifications }: HeaderProps) => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

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
      <div className='notifications-wrapper'>
        <NotificationsIcon onClick={toggleNotifications} style={{ color: 'gray' }} />
      </div>
    </div>
  );
};

export default Header;
