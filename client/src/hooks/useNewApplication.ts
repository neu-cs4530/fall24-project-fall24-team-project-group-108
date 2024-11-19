import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { validateHyperlink } from '../tool';
import useUserContext from './useUserContext';
import { submitModApplication } from '../services/modApplicationService';

/**
 * Custom hook to handle submitting mod applications to the database.
 *
 * @returns text - The text the user input.
 * @returns textErr - Returns an error to the user if text is incorrect.
 * @returns handleTextChange - Handles behavior when text in the input box is changed.
 * @returns handleApplicationSubmit - Handles submitting and cleaning up form when the submit button is pressed.
 */
const useModApplication = () => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Determines if the input text in the text is valid or not.
   *
   * @returns boolean - true if valid, false if not.
   */
  const validateText = (): boolean => {
    let isValid = true;
    if (!text) {
      setTextErr('You must tell us more about yourself before submitting!');
      isValid = false;
    } else if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    } else {
      setTextErr('');
    }

    return isValid;
  };

  /**
   * Handles submitting the application to the database for moderators to review.
   *
   * @returns event - the form event object.
   */
  const handleApplicationSubmit = async () => {
    if (!validateText()) return;

    try {
      await submitModApplication(user, text);
      setText('');
      navigate('/home');
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response) {
        if (axiosErr.response.status === 409) {
          setTextErr('Cannot create another application right now!');
        } else {
          setTextErr('Failed to submit application');
        }
      }
    }
  };

  return {
    text,
    setText,
    textErr,
    handleApplicationSubmit,
  };
};

export default useModApplication;
