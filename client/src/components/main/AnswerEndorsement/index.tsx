import { useState } from 'react';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import useAnswerEndorsement from '../../../hooks/useAnswerEndorsement';
import { Answer } from '../../../types';
import { endorseAnswer } from '../../../services/answerService';

/**
 * Interface representing the props for the AnswerEndorsement component.
 * - endorse: Whether the answer is currently endorsed
 * - handleEndorseQuestion: A function that handles the endorsement toggle
 */
interface AnswerEndorsementProps {
  answer: Answer;
}

/**
 * AnswerEndorsement component allows the user to endorse or unendorse an answer.
 *
 * @param endorse - Initial endorsement status of the answer
 * @param handleEndorseQuestion - Callback function to handle endorsement state change
 */
const AnswerEndorsement = ({ answer }: AnswerEndorsementProps) => {
  const { user } = useUserContext();
  const { endorse } = useAnswerEndorsement({ answer });

  // Toggles endorsement and updates parent state
  const handleEndorsementClick = async () => {
    try {
      if (answer._id) {
        await endorseAnswer(answer._id, !answer.endorsed);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='endorsement'>
      <button className='toggle-button' onClick={handleEndorsementClick}>
        {endorse ? 'Unendorse Answer' : 'Endorse Answer'}
      </button>
      {endorse && (
        <div className='endorsed-marker'>
          <p>This answer is endorsed by {user.username}.</p>
        </div>
      )}
    </div>
  );
};

export default AnswerEndorsement;
