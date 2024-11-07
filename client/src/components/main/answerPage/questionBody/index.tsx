import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 * - handleAddReport - Callback function to handle adding a new report.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  handleReport: () => void;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 * @param handleReport Function to handle adding a new report.
 */
const QuestionBody = ({ views, text, askby, meta, handleReport }: QuestionBodyProps) => (
  <div id='questionBody' className='questionBody right_padding'>
    <div className='bold_title answer_question_view'>{views} views</div>
    <div className='answer_question_text'>{handleHyperlink(text)}</div>
    <div className='answer_question_right'>
      <div className='question_author'>{askby}</div>
      <div className='answer_question_meta'>asked {meta}</div>
    </div>
    <button onClick={handleReport} className='report-button'>
      Report
    </button>
  </div>
);

export default QuestionBody;
