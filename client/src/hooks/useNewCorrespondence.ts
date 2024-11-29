import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Correspondence, User } from '../types';
import { addCorrespondence } from '../services/correspondenceService';
import { addMessage } from '../services/messageService';
import { getUsers } from '../services/userService';

/**
 * Custom hook to handle new correspondence creation
 * @returns createCorrespondence - A function to handle when the user is creating a correspondence
 * @returns selectedUsers - A list of
 * @returns selectedUsers - A list of names the user is considering creating the correspondence with
 * @returns unselectedUsers - A list of names the user is currently not considering creating the correspondence with
 * @returns handleUserSelection - A function to handle when a user is chosen for consideration
 * @returns handleUnselectUser - A function to handle when a user is no longer being chosen for consideration
 * @returns searchInput - The current user's typed search entry when searching for users
 * @returns handleSearchInputChange - A function that handles when the user updates the search entry
 * @returns errorMessage - An error message detailing if something went wrong creating the correspondence
 */
const useNewCorrespondence = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
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

  /**
   * Handles when the user decides to unselect someone they were considering for the correspondence
   * @param username - The username they are no longer considering
   */
  const handleUnselectUser = (username: string): void => {
    setSelectedUsers([...selectedUsers.filter(selectedUsername => selectedUsername !== username)]);
    const newUnselectedUsers = [...unselectedUsers, username].sort((name1, name2) =>
      name1 > name2 ? -1 : 1,
    );
    setUnselectedUsers(newUnselectedUsers);
    setFilteredUnselectedUsers(newUnselectedUsers.filter(name => name.includes(searchInput)));
  };

  /**
   * Handles when the user decides to select someone they are considering for the correspondence
   * @param username - The username they are considering
   */
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

  /**
   * Handles when there is a search bar update to find a list of potential users
   * @param currentInput The current text in the search bar
   */
  const handleSearchInputChange = (currentInput: string) => {
    setSearchInput(currentInput);
    setFilteredUnselectedUsers(
      unselectedUsers.filter(possibleUser => possibleUser.includes(currentInput)),
    );
  };

  return {
    createCorrespondence,
    handleUserSelection,
    selectedUsers,
    unselectedUsers,
    handleUnselectUser,
    searchInput,
    handleSearchInputChange,
    filteredUnselectedUsers,
    errorMessage,
  };
};

export default useNewCorrespondence;
