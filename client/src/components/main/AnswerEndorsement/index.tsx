import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FaCheck } from 'react-icons/fa';
import useAnswerEndorsement from '../../../hooks/useAnswerEndorsement';
import { Answer } from '../../../types';

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
  const { endorse, handleEndorsementClick, isQuestionAuthor } = useAnswerEndorsement({
    answer,
    questionID,
  });

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
