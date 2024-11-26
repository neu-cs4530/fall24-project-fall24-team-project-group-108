import { useState, useEffect } from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FaCheck } from 'react-icons/fa';
import useUserContext from '../../../hooks/useUserContext';
import useAnswerEndorsement from '../../../hooks/useAnswerEndorsement';
import { Answer } from '../../../types';
import { endorseAnswer } from '../../../services/answerService';
import { getQuestionById } from '../../../services/questionService';

/**
 * Interface representing the props for the AnswerEndorsement component.
 * - endorse: Whether the answer is currently endorsed
 * - handleEndorseQuestion: A function that handles the endorsement toggle
 */
interface AnswerEndorsementProps {
  answer: Answer;
  questionID: string;
}

/**
 * AnswerEndorsement component allows the user to endorse or unendorse an answer.
 *
 * @param endorse - Initial endorsement status of the answer
 * @param handleEndorseQuestion - Callback function to handle endorsement state change
 */
const AnswerEndorsement = ({ answer, questionID }: AnswerEndorsementProps) => {
  const { user } = useUserContext();
  const { endorse, setEndorsed } = useAnswerEndorsement({ answer });
  const [isQuestionAuthor, setIsQuestionAuthor] = useState<boolean>(false);

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
      }
    } catch (error) {
      setEndorsed(endorse);
    }
  };

  return (
    <div className='endorsement'>
      {isQuestionAuthor && (
        <button className='bluebtn' onClick={handleEndorsementClick}>
          {endorse ? 'Unendorse Answer' : 'Endorse Answer'}
        </button>
      )}
      {endorse && (
        <div className='endorsed-marker'>
          <FaCheck className='checkmark-icon' /> {}
        </div>
      )}
    </div>
  );
};

export default AnswerEndorsement;
