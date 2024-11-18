import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { authenticateUser } from '../services/userService';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns password - The current value of the password input.
 * @returns isBanned - The current value of the isBanned value.
 * @returns loginErr - The current value of the loginErr value.
 * @returns handleSubmit - Function to handle login submission
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handlePasswordChange - Function to handle changes in the password field.
 * @returns handleShowPassword - Function to handle when to show the password text.
 */
const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [loginErr, setLoginErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to toggle visibility of the password to user.
   */
  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the password change event.
   *
   * @param e - the event object.
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBanned) {
      setLoginErr('You have been temporarily banned.');
      return;
    }

    try {
      // Checks if the username and password provided is a valid user already in the database.
      const user = await authenticateUser(username, password);
      if (user) {
        setUser({ username, password, isModerator: user.isModerator, badges: [] });
        setLoginAttempts(0);
        if (user.isModerator === false) {
          // Navigates to normal home screen if not a moderator.
          navigate('/home');
        } else {
          // Navigates to moderator screen if a moderator. (to implement!)
          navigate('/home');
        }
      } else {
        throw new Error('Authentication failed');
      }
    } catch {
      setLoginAttempts(prev => prev + 1);

      // If user reaches the limit of incorrect guesses, handle the logic
      if (loginAttempts >= 5) {
        setIsBanned(true);
        setLoginAttempts(0);
        setLoginErr(`You have been temporarily banned`);
      } else {
        setLoginErr(`Incorrect credentials. Attempt ${loginAttempts + 1} of 5.`);
      }
      setUsername('');
      setPassword('');
    }
  };

  return {
    username,
    password,
    showPassword,
    isBanned,
    loginErr,
    handleSubmit,
    handleInputChange,
    handlePasswordChange,
    handleShowPassword,
  };
};

export default useLogin;
