import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { createUser } from '../services/userService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle sign up input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns password - The current value of the password input.
 * @returns reenterPassword - The current value of the reenterPassword input.
 * @returns showPassword - Determines if the password inputs are visible or not.
 * @returns signUpErr - The current error text.
 * @returns handleSubmit - Function to handle username and password submission.
 * @returns handleUsernameCreate - Function to create a username from input.
 * @returns handlePasswordCreate - Function to create a password from input.
 * @returns handlePasswordReenter - Function to handle validating a user's password by reentering.
 * @returns handleShowPassword - Function to handle when to show the password text.
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
   * Determines if the input username is valid.
   *
   * @returns boolean - true if valid, false otherwise.
   */
  const validateUsername = (): boolean => {
    const minUsernameLength = 3;
    if (username.length < minUsernameLength) {
      setSignUpErr('Username must be at least 3 characters long');
      return false;
    }

    if (username.includes(' ')) {
      setSignUpErr('Username cannot contain spaces');
      return false;
    }
    return true;
  };

  /**
   * Determines if the input password is valid.
   *
   * @returns boolean - true if valid, false otherwise.
   */
  const validatePassword = () => {
    if (password !== reenterPassword) {
      setSignUpErr('Passwords must match');
      return false;
    }
    const minPasswordLength = 6;
    if (password.length < minPasswordLength) {
      setSignUpErr('Password must be at least 6 characters long');
      return false;
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
      return false;
    }

    if (password.includes(' ')) {
      setSignUpErr('Password cannot contain spaces');
      return false;
    }

    return true;
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) {
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
