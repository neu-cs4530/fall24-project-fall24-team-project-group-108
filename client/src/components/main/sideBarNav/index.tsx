import './index.css';
import { NavLink } from 'react-router-dom';
import useUserContext from '../../../hooks/useUserContext';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const { user } = useUserContext();

  return (
    <div id='sideBarNav' className='sideBarNav'>
      <NavLink
        to={`/account/${user.username}`}
        id='menu_profile'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        My Profile
      </NavLink>
      <NavLink
        to='/home'
        id='menu_questions'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Questions
      </NavLink>
      <NavLink
        to='/tags'
        id='menu_tag'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Tags
      </NavLink>
      <NavLink
        to='/badges'
        id='menu_badges'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Badges
      </NavLink>
    </div>
  );
};

export default SideBarNav;
