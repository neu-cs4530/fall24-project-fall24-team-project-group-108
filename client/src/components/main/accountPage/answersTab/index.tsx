import { Question } from '../../../../types';
import QuestionView from '../../questionPage/question';
import './index.css';

/**
 * AnswersTab component that displays all questions that
 * a given user has answered.
 */
const AnswersTab = (user: string, alist: Question[]) => (
  <div className='page-container'>
    <div className='tab-title'>Questions answered by {user}:</div>
    <div id='question_list' className='question_list'>
      {alist.length === 0 ? (
        <p className='no-answers-message'>No answers posted.</p>
      ) : (
        alist.map((q, idx) => <QuestionView q={q} key={idx} />)
      )}
    </div>
  </div>
);

export default AnswersTab;
