import { Question } from '../../../../types';
import QuestionView from '../../questionPage/question';

/**
 * AnswersTab component that displays all questions that
 * a given user has answered.
 */
const AnswersTab = (user: string, alist: Question[]) => (
  <div>
    <h2>Questions answered by {user}:</h2>
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
