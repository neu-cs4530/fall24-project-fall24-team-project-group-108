import React from 'react';
import './index.css';
import MessageHeader from './header';
import useMessagePage from '../../../hooks/useMessagePage';
import CorrespondenceView from './correspondence';
import MessageView from './message';
import Input from '../baseComponents/input';
import NewCorrespondenceButton from '../newCorrespondenceButton';
// import UpdateCorrespondenceButton from '../updateCorrespondenceButton';

/**
 * MessagePage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const MessagePage = () => {
  const {
    user,
    correspondenceList,
    titleText,
    selectedCorrespondence,
    setSelectedCorrespondence,
    handleSelectCorrespondence,
    messageText,
    setMessageText,
    handleSendMessage,
    selectedCorrespondenceMessages,
    toAddText,
    setToAddText,
    handleUpdateCorrespondence,
  } = useMessagePage();

  return (
    <>
      <MessageHeader titleText={titleText} ccnt={correspondenceList.length} />
      <div id='horizontal-div'>
        <div id='correspondence_list' className='correspondence_list'>
          {correspondenceList.map((correspondence, idx) => (
            <CorrespondenceView
              correspondence={correspondence}
              onClickHandler={handleSelectCorrespondence}
              key={idx}
            />
          ))}
        </div>
        <div id='selected_correspondence' className='selected_correspondence'>
          {selectedCorrespondence ? null : 'Please Select a Correspondence'}
          {selectedCorrespondence ? (
            <button
              className='bluebtn updateMembersButton'
              onClick={() => {
                handleUpdateCorrespondence();
              }}>
              Add/Delete Correspondence Members
            </button>
          ) : null}
          <div id='message_list'>
            {selectedCorrespondenceMessages.length > 0
              ? selectedCorrespondenceMessages.map((message, idx) => (
                  <MessageView message={message} key={idx} />
                ))
              : 'No Messages Yet'}
          </div>
          <div id='selected_correspondence_bottom' className='selected_correspondence_bottom'>
            {selectedCorrespondence ? (
              <textarea
                placeholder='New Message...'
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className='message-textarea'
              />
            ) : null}
            {selectedCorrespondence ? (
              <button className='send-message-button' onClick={handleSendMessage}>
                Send Message
              </button>
            ) : null}
          </div>
          {messageText !== '' ? (
            <pre>
              <code id='user-typing' className='user-typing'>
                {user.username} is typing...
              </code>
            </pre>
          ) : null}
        </div>
      </div>
      {/* {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )} */}
    </>
  );
};

export default MessagePage;
