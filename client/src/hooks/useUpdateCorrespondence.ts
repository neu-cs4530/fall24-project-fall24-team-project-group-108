import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { updateCorrespondenceById } from '../services/correspondenceService';

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
  const [correspondenceId, setCorrespondenceId] = useState<string>(cid || '');
  //   const [titleErr, setTitleErr] = useState<string>('');
  //   const [textErr, setTextErr] = useState<string>('');
  //   const [tagErr, setTagErr] = useState<string>('');

  useEffect(() => {
    if (!cid) {
      navigate('/messagePage');
      return;
    }

    setCorrespondenceId(cid);
  }, [cid, navigate]);

  /**
   * Function to validate the form before submitting the question.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    const toNamesArray = toNames.split(',').filter(toName => toName.trim() !== '');
    if (toNamesArray.length === 0) {
      setToNamesErr('Need to list at least 1 user to create a correspondence with');
      isValid = false;
    } else if (toNamesArray.length > 9) {
      setToNamesErr('Cannot create correspondence between more than 10 people');
      isValid = false;
    } else {
      setToNamesErr('');
    }

    return isValid;
  };

  /**
   * Function to update a correspondence to the server.
   *
   * @returns title - The current value of the title input.
   */
  const updateCorrespondence = async () => {
    if (!validateForm()) return;

    const toNamesArray = toNames.split(',').filter(toName => toName.trim() !== '');

    const updatedMessageMembers: string[] = [...new Set([...toNamesArray, user.username])];

    const res = await updateCorrespondenceById(correspondenceId, updatedMessageMembers);

    if (res && res._id) {
      navigate('/messagePage');
    }
  };

  return {
    toNames,
    setToNames,
    toNamesErr,
    setToNamesErr,
    updateCorrespondence,
  };
};

export default useUpdateCorrespondence;
