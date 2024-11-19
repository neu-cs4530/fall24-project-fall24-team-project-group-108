import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 *  NewMessageButton component that renders a button for navigating to the
 * "New Message" page. When clicked, it redirects the user to the page
 * where they can start a new message correspondence.
 */
const NewMessageButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Message" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/message');
  };

  return (
    <button
      className='bluebtn'
      onClick={() => {
        handleNewQuestion();
      }}>
      New Message
    </button>
  );
};

export default NewMessageButton;
