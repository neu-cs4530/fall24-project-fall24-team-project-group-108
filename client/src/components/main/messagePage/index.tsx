import './index.css';
import EmojiPicker from 'emoji-picker-react';
import { Dropdown } from 'react-bootstrap';
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
    uploadedFile,
    setUploadedFile,
    user,
    handleUploadedFile,
    uploadedFileErr,
  } = useMessagePage();

  return (
    <>
      <MessageHeader titleText={titleText} ccnt={correspondenceList.length} />
      <div id='horizontal-div'>
        <div id='correspondence_list' className='correspondence_list'>
          {correspondenceList.map((correspondence, idx) => (
            <CorrespondenceView
              correspondence={correspondence}
              username={user.username}
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
              Add Members to Correspondence
            </button>
          ) : null}
          <div id='message_list'>
            {selectedCorrespondenceMessages.length > 0
              ? selectedCorrespondenceMessages.map((message, idx) => (
                  <MessageView message={message} key={idx} />
                ))
              : 'No Messages Yet'}
          </div>
          {selectedCorrespondence && selectedCorrespondence.userTyping.length > 0 ? (
            // <pre>
            <div id='user-typing' className='user-typing'>
              {selectedCorrespondence.userTyping.join(',')} is typing...
            </div>
          ) : // </pre>
          null}
          <div id='selected_correspondence_bottom' className='selected_correspondence_bottom'>
            {selectedCorrespondence ? (
              <textarea
                placeholder='New Message...'
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className={isCodeStyle ? 'message-textarea-code' : 'message-textarea'}
              />
            ) : null}
            {selectedCorrespondence ? (
              <button className='code-style-button' onClick={() => setIsCodeStyle(!isCodeStyle)}>
                {'<Code> Style'}
              </button>
            ) : null}
            {selectedCorrespondence ? (
              <button className='send-message-button' onClick={handleSendMessage}>
                Send Message
              </button>
            ) : null}
          </div>
          {/* {selectedCorrespondence && selectedCorrespondence.userTyping.length > 0 ? (
            <pre>
              <code id='user-typing' className='user-typing'>
                {selectedCorrespondence.userTyping.join(',')} is typing...
              </code>
            </pre>
          ) : null} */}
        </div>
      </div>
      <div id='file_uploader' className='file_uploader'>
        {selectedCorrespondence ? (
          <div>
            <input
              type='file'
              accept='.pdf,.jpg,.jpeg'
              // value={uploadedFile ? uploadedFile.name : 'No file chosen'}
              onChange={event => (event.target.files ? handleUploadedFile(event.target) : null)}
            />
            {/* <span id='errorMessage'>pdfs, jpgs, jpegs -- (25 KB Max)</span> */}
          </div>
        ) : null}
      </div>
      <div id='file_uploader_text' className='file_uploader_text'>
        {selectedCorrespondence ? (
          <div>
            <span id='errorMessage'>pdfs, jpgs, jpegs -- (25 KB Max)</span>
            {/* <span id='errorMessage' style={{ color: 'red' }}>
              {uploadedFileErr}
            </span> */}
          </div>
        ) : null}
      </div>
      <div id='file_uploader_text' className='file_uploader_text'>
        {selectedCorrespondence ? (
          <div>
            {/* <span id='errorMessage'>pdfs, jpgs, jpegs -- (25 KB Max)</span> */}
            <span id='errorMessage' style={{ color: 'red' }}>
              Error: {uploadedFileErr}
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MessagePage;
