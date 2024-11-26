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
    user,
    handleUploadedFile,
    uploadedFileErr,
    setSelectedCorrespondence,
    pendingMessageSend,
    getUpdatedCorrespondence,
  } = useMessagePage();

  return (
    <div className='page-background'>
      <div className='message-bubble'>
        <MessageHeader titleText={titleText} ccnt={correspondenceList.length} />
        <div id='horizontal-div'>
          {!selectedCorrespondence ? (
            <div id='correspondence_list' className='correspondence_list'>
              {correspondenceList.length >= 1 &&
                correspondenceList
                  .sort(
                    (a, b) =>
                      (b.messages.length > 0
                        ? new Date(b.messages[b.messages.length - 1].messageDateTime).getTime()
                        : new Date().getTime()) -
                      (a.messages.length > 0
                        ? new Date(a.messages[a.messages.length - 1].messageDateTime).getTime()
                        : new Date().getTime()),
                  )
                  .map((correspondence, idx) => (
                    <CorrespondenceView
                      correspondence={correspondence}
                      username={user.username}
                      onClickHandler={handleSelectCorrespondence}
                      key={idx}
                    />
                  ))}
            </div>
          ) : null}

          {selectedCorrespondence ? (
            <div className='selected_correspondence_top'>
              {
                <button
                  className='backToCorrespondences'
                  onClick={() => {
                    setSelectedCorrespondence(null);
                    setMessageText('');
                  }}>
                  &larr; Back
                </button>
              }
              {
                <button
                  className='bluebtn updateMembersButton'
                  onClick={() => {
                    handleUpdateCorrespondence();
                  }}>
                  Add Members
                </button>
              }
            </div>
          ) : null}
          {selectedCorrespondence ? (
            <div id='selected_correspondence' className='selected_correspondence'>
              <div id='message_list'>
                {selectedCorrespondenceMessages.map((message, idx) => (
                  <MessageView message={message} key={idx} />
                ))}
              </div>
              {selectedCorrespondence.userTyping.length > 0 ? (
                // <pre>
                <div id='user-typing' className='user-typing'>
                  Typing: {selectedCorrespondence.userTyping.join(', ')}
                </div>
              ) : (
                <div id='user-typing' className='user-typing' style={{ color: 'white' }}>
                  {' _ '}
                </div>
              )}
              <div id='selected_correspondence_bottom' className='selected_correspondence_bottom'>
                {
                  <textarea
                    placeholder='New Message...'
                    value={messageText}
                    onChange={e => {
                      setMessageText(e.target.value);
                      getUpdatedCorrespondence(e.target.value);
                    }}
                    className={isCodeStyle ? 'message-textarea-code' : 'message-textarea'}
                  />
                }
                {
                  <button
                    className='code-style-button'
                    onClick={() => setIsCodeStyle(!isCodeStyle)}>
                    {'<Code> Style'}
                    {isCodeStyle}
                  </button>
                }
                {
                  <button
                    className='send-message-button'
                    onClick={handleSendMessage}
                    disabled={pendingMessageSend}>
                    Send Message
                  </button>
                }
              </div>
            </div>
          ) : null}
        </div>
        {selectedCorrespondence ? (
          <div id='file_uploader' className='file_uploader'>
            {
              <div>
                <input
                  type='file'
                  accept='.pdf,.jpg,.jpeg'
                  // value={uploadedFile ? uploadedFile.name : 'No file chosen'}
                  onChange={event => (event.target.files ? handleUploadedFile(event.target) : null)}
                />
              </div>
            }
          </div>
        ) : null}
        {selectedCorrespondence ? (
          <div id='file_uploader_text' className='file_uploader_text'>
            {
              <div>
                <span id='errorMessage'>pdfs, jpgs, jpegs -- (25 KB Max)</span>
              </div>
            }
          </div>
        ) : null}
        {selectedCorrespondence ? (
          <div id='file_uploader_text' className='file_uploader_text'>
            {
              <div>
                <span id='errorMessage' style={{ color: 'red' }}>
                  {uploadedFileErr}
                </span>
              </div>
            }
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MessagePage;
