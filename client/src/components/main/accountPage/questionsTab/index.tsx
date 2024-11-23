import { Question } from '../../../../types';
import QuestionView from '../../questionPage/question';
import './index.css';

/**
 * QuestionsTab component that displays all the questions asked by a given user.
 */
const QuestionsTab = (user: string, qlist: Question[]) => (
  <div className='page-container'>
    <div className='tab-title'>Questions asked by {user}:</div>
    <div id='question_list' className='question_list'>
      {qlist.length === 0 ? (
        <p className='no-questions-message'>No questions asked.</p>
      ) : (
        qlist.map((q, idx) => <QuestionView q={q} key={idx} />)
      )}
    </div>
  </div>
);

export default QuestionsTab;
