import React from 'react';
import './index.css';
import MessageView from './correspondence';
import useMessagePage from '../../../hooks/useMessagePage';
import useBan from '../../../hooks/useBan';

/**
 * MessagePage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const MessagePage = () => {
  useBan();
  const { correspondenceList } = useMessagePage();

  return (
    <>
      {/* <MessageHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      /> */}
      <div id='horizontal-div'>
        <div id='correspondence_list' className='correspondence_list'>
          {correspondenceList.map((correspondence, idx) => (
            <MessageView correspondence={correspondence} key={idx} />
          ))}
        </div>
        <div id='selected_correspondence' className='selected_correspondence'>
          {'Selected Correspondence'}
        </div>
      </div>
      {/* {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )} */}
    </>
  );
};

export default MessagePage;
