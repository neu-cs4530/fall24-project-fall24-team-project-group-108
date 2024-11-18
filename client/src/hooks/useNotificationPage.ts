import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Question, Answer, Comment, Message, Correspondence, Notification } from '../types';

/**
 * Custom hook for managing the question page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useNotificationPage = () => {
  const { socket } = useUserContext();


  const [searchParams] = useSearchParams();

  //For the below states, this would keep a tracking list of questions, answers, etc. the user has participated in
  //When handling the socket, we will cross-check the socket update payload with these states to see if an update has been made to a post the user is involved in

  const [questions, setQuestions] = useState<Question[]>();
  const [answers, setAnswers] = useState<Answer[]>();
  const [comments, setComments] = useState<Comment[]>();
  const [correspondences, setCorrespondences] = useState<Correspondence[]>();
  const [notifications, setNotificaions] = useState<Notification[]>();

  useEffect(() => {
      //Need to get a list of all questions, answers, etc. user is involved in
  }, [])

  return { };
};

export default useNotificationPage;
