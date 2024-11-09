import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import { addQuestion } from '../services/questionService';
import useUserContext from './useUserContext';
import { Correspondence, Question, Message } from '../types';
import { addCorrespondence } from '../services/correspondenceService';
import { addMessage } from '../services/messageService';

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
  //   const [titleErr, setTitleErr] = useState<string>('');
  //   const [textErr, setTextErr] = useState<string>('');
  //   const [tagErr, setTagErr] = useState<string>('');

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

    // if (!text) {
    //   setTextErr('Question text cannot be empty');
    //   isValid = false;
    // } else if (!validateHyperlink(text)) {
    //   setTextErr('Invalid hyperlink format.');
    //   isValid = false;
    // } else {
    //   setTextErr('');
    // }

    // const tagnames = tagNames.split(' ').filter(tagName => tagName.trim() !== '');
    // if (tagnames.length === 0) {
    //   setTagErr('Should have at least 1 tag');
    //   isValid = false;
    // } else if (tagnames.length > 5) {
    //   setTagErr('Cannot have more than 5 tags');
    //   isValid = false;
    // } else {
    //   setTagErr('');
    // }

    // for (const tagName of tagnames) {
    //   if (tagName.length > 20) {
    //     setTagErr('New tag length cannot be more than 20');
    //     isValid = false;
    //     break;
    //   }
    // }

    return isValid;
  };

  /**
   * Function to post a correspondence to the server.
   *
   * @returns title - The current value of the title input.
   */
  const createCorrespondence = async () => {
    if (!validateForm()) return;

    const toNamesArray = toNames.split(',').filter(toName => toName.trim() !== '');

    const correspondence: Correspondence = {
      messages: [],
      messageMembers: [...toNamesArray, user.username],
    };

    console.log('createCorrespondence correspondence');
    console.log(correspondence);

    const res = await addCorrespondence(correspondence);
    const initialMessage = {
      messageText: `${user.username} has created this correspondence`,
      messageDateTime: new Date(),
      messageBy: user.username,
      messageTo: [...toNamesArray],
    };
    console.log('addCorrespondence !!!!!!!');
    console.log(res);
    const messageRes = await addMessage(res._id ? res._id : '', initialMessage);

    if (messageRes && messageRes._id) {
      navigate('/messagePage');
    }
  };

  return {
    toNames,
    setToNames,
    toNamesErr,
    setToNamesErr,
    createCorrespondence,
  };
};

export default useNewCorrespondence;
