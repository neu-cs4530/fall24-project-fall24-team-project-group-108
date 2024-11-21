import { useNavigate } from 'react-router-dom';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Answer, Comment, Question } from '../../../../types';
import AnswerEndorsement from '../../AnswerEndorsement';

import useModStatus from '../../../../hooks/useModStatus';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 * - answer An answer to a question
 * - handleReport Callback function to handle adding a new report.
 * - isReported True if user already reported answer.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
  answer: Answer;
  question: Question;
  handleReport: () => void;
  handleRemove: () => void;
  isReported: boolean;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 * @param answer An answer to a question
 * @param handleReport Function to handle adding a new report.
 * @param handleRemove Function to remove an answer.
 * @param isReported True if user already reported answer.
 */
const AnswerView = ({
  text,
  ansBy,
  meta,
  comments,
  handleAddComment,
  answer,
  question,
  handleReport,
  handleRemove,
  isReported,
}: AnswerProps) => {
  const { moderatorStatus } = useModStatus();
  const navigate = useNavigate();

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = () => {
    navigate(`/account/${ansBy}`); // Assuming you have an ID for the author
  };

  return (
    <div className='answer right_padding'>
      <div id='answerText' className='answerText'>
        {handleHyperlink(text)}
      </div>
      <div className='answerAuthor'>
        <div className='answer_author'>{ansBy}</div>
        <div
          className='answer_author'
          onClick={e => {
            e.stopPropagation(); // prevent triggering the parent div's click event
            handleAuthorClick();
          }}>
          {ansBy}
        </div>
        <div className='answer_question_meta'>{meta}</div>
        <AnswerEndorsement answer={answer} questionID={question._id || ''} />
      </div>
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
      {isReported ? (
        <button className='reported-button'>Reported</button>
      ) : (
        <button onClick={handleReport} className='report-button'>
          Report
        </button>
      )}
      {moderatorStatus && (
        <button className='remove-button' onClick={() => handleRemove()}>
          Remove
        </button>
      )}
    </div>
  );
};

export default AnswerView;
