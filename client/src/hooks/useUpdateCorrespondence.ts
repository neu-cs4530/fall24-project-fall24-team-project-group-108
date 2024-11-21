import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import {
  getCorrespondenceById,
  updateCorrespondenceMembersById,
} from '../services/correspondenceService';
import { getUsers } from '../services/userService';

/**
 * Custom hook to handle correspondence updates and form validation
 *
 * @returns title - The current value of the title input.
 * @returns text - The current value of the text input.
 * @returns tagNames - The current value of the tags input.
 * @returns titleErr - Error message for the title field, if any.
 * @returns textErr - Error message for the text field, if any.
 * @returns tagErr - Error message for the tag field, if any.
 * @returns postQuestion - Function to validate the form and submit a new question.
 */
const useUpdateCorrespondence = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [toNames, setToNames] = useState<string>('');
  const [toNamesErr, setToNamesErr] = useState<string>('');
  const [originalSelectedUsers, setOriginalSelectedUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [unselectedUsers, setUnselectedUsers] = useState<string[]>([]);
  const [filteredUnselectedUsers, setFilteredUnselectedUsers] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  //   const [titleErr, setTitleErr] = useState<string>('');
  //   const [textErr, setTextErr] = useState<string>('');
  //   const [tagErr, setTagErr] = useState<string>('');

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
  }, []);

  /**
   * Function to validate the form before submitting the question.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  // const validateForm = (): boolean => {
  //   let isValid = true;

  //   const toNamesArray = toNames.split(',').filter(toName => toName.trim() !== '');
  //   if (toNamesArray.length === 0) {
  //     setToNamesErr('Need to list at least 1 user to create a correspondence with');
  //     isValid = false;
  //   } else if (toNamesArray.length > 9) {
  //     setToNamesErr('Cannot create correspondence between more than 10 people');
  //     isValid = false;
  //   } else {
  //     setToNamesErr('');
  //   }

  //   return isValid;
  // };

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

  const handleUserSelection = (username: string) => {
    setSelectedUsers([...selectedUsers, username]);
    const newUnselectedUsers = [
      ...unselectedUsers.filter(unselectedUsername => unselectedUsername !== username),
    ];
    setUnselectedUsers(newUnselectedUsers);
    setSearchInput('');
    setFilteredUnselectedUsers(newUnselectedUsers);
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
