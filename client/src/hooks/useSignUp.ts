import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { createUser } from '../services/userService';

/**
 * Custom hook to handle sign up input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns password - The current value of the password input.
 * @returns signUpErr - The current error text.
 * @returns handleSubmit - Function to handle username and password submission.
 * @returns handleUsernameCreate - Function to create a username from input.
 * @returns handlePasswordCreate - Function to create a password from input.
 */
const useSignUp = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signUpErr, setSignUpErr] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Function to handle the username creation event.
   *
   * @param e - the event object.
   */
  const handleUsernameCreate = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the password creation event.
   *
   * @param e - the event object.
   */
  const handlePasswordCreate = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await createUser(username, password);
      if (user) {
        navigate('/');
      }
    } catch {
      setSignUpErr('Username already in use');
      setUsername('');
      setPassword('');
    }
  };

  return {
    username,
    password,
    signUpErr,
    handleSubmit,
    handleUsernameCreate,
    handlePasswordCreate,
  };
};

export default useSignUp;
