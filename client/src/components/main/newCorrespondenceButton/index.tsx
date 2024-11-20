import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 *  NewCorrespondenceButton component that renders a button for navigating to the
 * "New Correspondence" page. When clicked, it redirects the user to the page
 * where they can start a new correspondence.
 */
const NewCorrespondenceButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Correspondence" page.
   */
  const handleNewCorrespondence = () => {
    navigate('/new/correspondence');
  };

  return (
    <button
      className='bluebtn'
      onClick={() => {
        handleNewCorrespondence();
      }}>
      New Correspondence
    </button>
  );
};

export default NewCorrespondenceButton;
