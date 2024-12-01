import { useEffect, useState } from 'react';
import { Answer } from '../types';
import useUserContext from './useUserContext';
import { endorseAnswer } from '../services/answerService';
import { getQuestionById } from '../services/questionService';

/**
 * Custom hook to handle endorsing an answer.
 *
 * @returns endorse - Whether the answer is currently endorsed
 * @returns setEndorsed - Function to update the endorsement status
 * @returns handleEndorsementClick - Function to handle endorsement click
 * @returns isQuestionAuthor - Whether the user is the author of the question
 */

const useAnswerEndorsement = ({ answer, questionID }: { answer: Answer; questionID: string }) => {
  const { user, socket } = useUserContext();
  const [endorse, setEndorsed] = useState<boolean>(false);
  const [isQuestionAuthor, setIsQuestionAuthor] = useState<boolean>(false);

  useEffect(() => {
    const getEndorsedValue = () => answer.endorsed;

    setEndorsed(getEndorsedValue());
  }, [answer, socket]);

  useEffect(() => {
    const checkIfQuestionAuthor = async () => {
      try {
        const question = await getQuestionById(questionID, user.username);
        if (question.askedBy === user.username) {
          setIsQuestionAuthor(true);
        }
      } catch (error) {
        setIsQuestionAuthor(false);
      }
    };

    checkIfQuestionAuthor();
  }, [questionID, user.username]);

  const handleEndorsementClick = async () => {
    try {
      if (answer._id) {
        await endorseAnswer(answer._id, !endorse);
        setEndorsed(!endorse);
        socket.emit('endorsementUpdate', { aid: answer._id, endorsed: !endorse });
      }
    } catch (error) {
      setEndorsed(endorse);
    }
  };

  return {
    endorse,
    setEndorsed,
    handleEndorsementClick,
    isQuestionAuthor,
  };
};

export default useAnswerEndorsement;
