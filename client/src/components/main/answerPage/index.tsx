import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import useBan from '../../../hooks/useBan';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  useBan();
  const {
    questionID,
    question,
    numAnswers,
    handleNewComment,
    handleNewAnswer,
    handleReportDecision,
    wasQReported,
    wasAnsReported,
  } = useAnswerPage();
  const navigate = useNavigate();

  if (!question) {
    return null;
  }

  if (question.isRemoved === true) {
    navigate('/home');
  }

  /**
   * Function to handle navigation to the "Report" page.
   */
  const handleReport = (
    targetId: string | undefined,
    targetType: 'question' | 'answer',
    targetText: string,
    targetBy: string,
    targetLink: string | undefined,
  ) => {
    navigate('/report', { state: { targetId, targetType, targetText, targetBy, targetLink } });
  };

  return (
    <div className='page-background'>
      <div className='answer-bubble'>
        <VoteComponent question={question} />
        <AnswerHeader ansCount={numAnswers} title={question.title} />
        <QuestionBody
          views={question.views.length}
          text={question.text}
          askby={question.askedBy}
          meta={getMetaData(new Date(question.askDateTime))}
          handleReport={() =>
            handleReport(question._id, 'question', question.text, question.askedBy, questionID)
          }
          handleRemove={() => handleReportDecision(question, 'question')}
          isReported={wasQReported(question)}
        />
        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
        />
        {question.answers
          .filter(ans => !ans.isRemoved)
          .map((a, idx) => (
            <AnswerView
              key={idx}
              text={a.text}
              ansBy={a.ansBy}
              meta={getMetaData(new Date(a.ansDateTime))}
              comments={a.comments}
              handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
              handleReport={() => handleReport(a._id, 'answer', a.text, a.ansBy, question._id)}
              handleRemove={() => handleReportDecision(a, 'answer')}
              isReported={wasAnsReported(a)}
            />
          ))}
        <button
          className='bluebtn ansButton'
          onClick={() => {
            handleNewAnswer();
          }}>
          Answer Question
        </button>
      </div>
    </div>
  );
};

export default AnswerPage;
