import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { authenticateUser, createUser } from '../services/userService';
import useLoginContext from './useLoginContext';

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
  const [reenterPassword, setReenterPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signUpErr, setSignUpErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

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
   * Function to handle the password re-enter event.
   *
   * @param e - the event object.
   */
  const handlePasswordReenter = (e: ChangeEvent<HTMLInputElement>) => {
    setReenterPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== reenterPassword) {
      setSignUpErr('Passwords must match');
      return;
    }

    const minUsernameLength = 3;
    if (username.length < minUsernameLength) {
      setSignUpErr('Username must be at least 3 characters long');
      return;
    }

    if (username.includes(' ')) {
      setSignUpErr('Username cannot contain spaces');
      return;
    }

    const minPasswordLength = 6;
    if (password.length < minPasswordLength) {
      setSignUpErr('Password must be at least 6 characters long');
      return;
    }

    const specialChars = '!@#$%^&*()-_=+[]{};:\'"\\|,.<>/?`~';
    const specialCharsArr = Array.from(specialChars);
    let containsSpecialChar = false;
    specialCharsArr.forEach(char => {
      if (password.includes(char)) {
        containsSpecialChar = true;
      }
    });
    if (!containsSpecialChar) {
      setSignUpErr('Password must contain a special character');
      return;
    }

    if (password.includes(' ')) {
      setSignUpErr('Password cannot contain spaces');
      return;
    }

    try {
      const user = await createUser(username, password);
      setUser({ username, password, isModerator: user.isModerator });
      navigate('/home');
    } catch {
      setSignUpErr('Username already in use');
      setUsername('');
      setPassword('');
    }
  };

  return {
    username,
    password,
    reenterPassword,
    showPassword,
    signUpErr,
    handleSubmit,
    handleUsernameCreate,
    handlePasswordCreate,
    handlePasswordReenter,
    handleShowPassword,
  };
};

export default useSignUp;
