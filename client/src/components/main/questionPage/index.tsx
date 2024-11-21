import React from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import useBan from '../../../hooks/useBan';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  useBan();
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <div className='page-background'>
      <div className='question-bubble'>
        <QuestionHeader
          titleText={titleText}
          qcnt={qlist.length}
          setQuestionOrder={setQuestionOrder}
        />
        <div id='question_list' className='question_list'>
          {qlist.map((q, idx) => (
            <QuestionView q={q} key={idx} />
          ))}
        </div>
        {titleText === 'Search Results' && !qlist.length && (
          <div className='bold_title right_padding'>No Questions Found</div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
