import './index.css';
import MessageHeader from './header';
import useMessagePage from '../../../hooks/useMessagePage';
import useBan from '../../../hooks/useBan';
import CorrespondenceView from './correspondence';
import MessageView from './message';

/**
 * MessagePage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const MessagePage = () => {
  useBan();
  const {
    user,
    correspondenceList,
    titleText,
    selectedCorrespondence,
    handleSelectCorrespondence,
    messageText,
    setMessageText,
    handleSendMessage,
    selectedCorrespondenceMessages,
    handleUpdateCorrespondence,
    isCodeStyle,
    setIsCodeStyle,
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
              <button className='code-style-button' onClick={() => setIsCodeStyle(!isCodeStyle)}>
                {'<Code> Style'}
              </button>
            ) : null}
            {selectedCorrespondence ? (
              <textarea
                placeholder='New Message...'
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className={isCodeStyle ? 'message-textarea-code' : 'message-textarea'}
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
    </>
  );
};

export default MessagePage;
