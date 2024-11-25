import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Correspondence, User } from '../types';
import { addCorrespondence } from '../services/correspondenceService';
import { addMessage } from '../services/messageService';
import { getUsers } from '../services/userService';

/**
 * Custom hook to handle new correspondence creation and form validation
 *
 * @returns title - The current value of the title input.
 * @returns text - The current value of the text input.
 * @returns tagNames - The current value of the tags input.
 * @returns titleErr - Error message for the title field, if any.
 * @returns textErr - Error message for the text field, if any.
 * @returns tagErr - Error message for the tag field, if any.
 * @returns postQuestion - Function to validate the form and submit a new question.
 */
const useNewCorrespondence = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [toNames, setToNames] = useState<string>('');
  const [toNamesErr, setToNamesErr] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [unselectedUsers, setUnselectedUsers] = useState<string[]>([]);
  const [filteredUnselectedUsers, setFilteredUnselectedUsers] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const getAllUsers = async () => {
      const dbUsers = await getUsers();
      const dbUsersAvailable = dbUsers.filter(dbUser => dbUser.username !== user.username);
      setAllUsers([...dbUsersAvailable]);
      const dbUnselectedUsers = [...dbUsersAvailable.map(dbUser => dbUser.username)];
      setUnselectedUsers(dbUnselectedUsers);
      setFilteredUnselectedUsers(dbUnselectedUsers);
    };
    getAllUsers();
  }, [user.username]);

  const handleUnselectUser = (username: string): void => {
    setSelectedUsers([...selectedUsers.filter(selectedUsername => selectedUsername !== username)]);
    const newUnselectedUsers = [...unselectedUsers, username].sort((name1, name2) =>
      name1 > name2 ? -1 : 1,
    );
    setUnselectedUsers(newUnselectedUsers);
    setFilteredUnselectedUsers(newUnselectedUsers.filter(name => name.includes(searchInput)));
  };

  const handleUserSelection = (username: string) => {
    setSelectedUsers([...selectedUsers, username]);
    const newUnselectedUsers = [
      ...unselectedUsers.filter(unselectedUsername => unselectedUsername !== username),
    ];
    setUnselectedUsers(newUnselectedUsers);
    setSearchInput('');
    setFilteredUnselectedUsers(newUnselectedUsers);
  };

  /**
   * Function to post a correspondence to the server.
   *
   * @returns title - The current value of the title input.
   */
  const createCorrespondence = async () => {
    if (selectedUsers.length === 0) {
      setErrorMessage('You need at least one person in order to create a correspondence');
    } else {
      const correspondence: Correspondence = {
        messages: [],
        messageMembers: [...selectedUsers, user.username],
        userTyping: [],
        views: [user.username],
      };

      const res = await addCorrespondence(correspondence);
      const initialMessage = {
        messageText: `${user.username} has created this correspondence`,
        messageDateTime: new Date(),
        messageBy: user.username,
        messageTo: [...selectedUsers],
        isCodeStyle: false,
        views: [user.username],
        isDeleted: false,
      };
      const messageRes = await addMessage(res._id ? res._id : '', initialMessage);

      setSelectedUsers([]);
      setUnselectedUsers([...allUsers.map(dbUser => dbUser.username)]);

      if (messageRes && messageRes._id) {
        navigate('/messagePage');
      }
    }
  };

  const handleSearchInputChange = (currentInput: string) => {
    setSearchInput(currentInput);
    setFilteredUnselectedUsers(
      unselectedUsers.filter(possibleUser => possibleUser.includes(currentInput)),
    );
  };

  return {
    toNames,
    setToNames,
    toNamesErr,
    setToNamesErr,
    createCorrespondence,
    handleUserSelection,
    selectedUsers,
    unselectedUsers,
    handleUnselectUser,
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    filteredUnselectedUsers,
    errorMessage,
  };
};

export default useNewCorrespondence;
