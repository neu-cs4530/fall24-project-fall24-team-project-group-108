import './index.css';
import { NavLink } from 'react-router-dom';
import useModStatus from '../../../hooks/useModStatus';

/**
 * The SideBarNav component has three menu items: "Questions", "Tags", and "Messages"
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const { moderatorStatus } = useModStatus();

  return (
    <>
      <div id='sideBarNav' className='sideBarNav'>
        <div className='site-title'>codescout</div>
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
        <NavLink
          to='/messagePage'
          id='user_messages'
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
          Messages
        </NavLink>
        {moderatorStatus ? (
          <>
            <NavLink
              to='/reviewReports'
              id='menu_reports'
              className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
              Reports
            </NavLink>
            <NavLink
              to='/reviewApplication'
              id='menu_review_application'
              className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
              Applications
            </NavLink>
          </>
        ) : (
          <NavLink
            to='/modApplication'
            id='menu_mod_application'
            className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
            Mod Application
          </NavLink>
        )}
      </div>
    </>
  );
};

export default SideBarNav;
