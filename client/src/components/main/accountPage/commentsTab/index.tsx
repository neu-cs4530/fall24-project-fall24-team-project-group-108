import { Question } from '../../../../types';
import QuestionView from '../../questionPage/question';
import './index.css';

/**
 * CommentsTab component that displays all questions that
 * a given user has added a comment on.
 */
const CommentsTab = (user: string, clist: Question[]) => (
  <div className='page-container'>
    <div className='tab-title'>Questions including comments by {user}:</div>
    <div id='comment_list' className='comment_list'>
      {clist.length === 0 ? (
        <p className='no-comments-message'>No comments posted.</p>
      ) : (
        clist.map((q, idx) => <QuestionView q={q} key={idx} />)
      )}
    </div>
  </div>
);

export default CommentsTab;
