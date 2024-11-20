import { useState, useEffect } from 'react';
import './index.css';
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
        // Handle error
      }
    };

    checkIfQuestionAuthor();
  }, [questionID, user.username]);

  // Toggles endorsement and updates parent state
  const handleEndorsementClick = async () => {
    try {
      if (answer._id) {
        await endorseAnswer(questionID, answer._id, !endorse, user);
        setEndorsed(!endorse);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='endorsement'>
      {isQuestionAuthor && (
        <button className='toggle-button' onClick={handleEndorsementClick}>
          {endorse ? 'Unendorse Answer' : 'Endorse Answer'}
        </button>
      )}
      {endorse && (
        <div className='endorsed-marker'>
          <p>This answer is endorsed.</p>
        </div>
      )}
    </div>
  );
};

export default AnswerEndorsement;
