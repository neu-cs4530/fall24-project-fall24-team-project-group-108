import React from 'react';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='logo-section'>
        <img src='/codescout.png' alt='Logo' style={{ width: '60px', height: '60px' }}></img>
        <div className='title'>Code Scout</div>
      </div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Header;
