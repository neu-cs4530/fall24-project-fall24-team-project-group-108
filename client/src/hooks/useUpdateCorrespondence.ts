import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import {
  getCorrespondenceById,
  updateCorrespondenceMembersById,
} from '../services/correspondenceService';
import { getUsers } from '../services/userService';

/**
 * Custom hook to handle adding correspondence members
 * @returns updateCorrespondence - A function to handle when the user is updating a correspondence
 * @returns handleUserSelection - A function to handle when a user is chosen for consideration
 * @returns unselectedUsers - A list of names the user is currently not considering adding to a correspondence
 * @returns selectedUsers - A list of names the user is considering adding to a correspondence
 * @returns handleSearchInputChange - A function that handles when the user updates the search entry
 * @returns searchInput - The current user's typed search entry when searching for users
 * @returns filteredUnselectedUsers - A filtered list of unselected users
 * @returns originalSelectedUsers - A list of users who were originally a part of the correspondence
 * @returns handleUnselectUser - A function to handle when a user is no longer being chosen for consideration
 */
const useUpdateCorrespondence = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [originalSelectedUsers, setOriginalSelectedUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [unselectedUsers, setUnselectedUsers] = useState<string[]>([]);
  const [filteredUnselectedUsers, setFilteredUnselectedUsers] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    if (!cid) {
      navigate('/messagePage');
    }
  }, [cid, navigate]);

  useEffect(() => {
    const getCurrentCorrespondence = async () => {
      const correspondence = await getCorrespondenceById(cid || '');
      const dbUsers = await getUsers();
      const initSelectedUsers = correspondence.messageMembers.filter(
        member => member !== user.username,
      );
      setOriginalSelectedUsers(initSelectedUsers);
      setSelectedUsers(initSelectedUsers);
      const initUnselectedUsers = dbUsers
        .filter(dbUser => !correspondence.messageMembers.includes(dbUser.username))
        .map(dbUser => dbUser.username);
      setUnselectedUsers(initUnselectedUsers);
      setFilteredUnselectedUsers(initUnselectedUsers);
    };
    getCurrentCorrespondence();
  }, [cid, user.username]);

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
   * Function to update a correspondence to the server.
   *
   * @returns title - The current value of the title input.
   */
  const updateCorrespondence = async () => {
    const res = await updateCorrespondenceMembersById(cid || '', [...selectedUsers, user.username]);

    if (res && res._id) {
      navigate('/messagePage');
    }
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
    updateCorrespondence,
    handleUserSelection,
    unselectedUsers,
    selectedUsers,
    handleSearchInputChange,
    searchInput,
    filteredUnselectedUsers,
    originalSelectedUsers,
    handleUnselectUser,
  };
};

export default useUpdateCorrespondence;
