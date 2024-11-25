import './index.css';
import { useNavigate } from 'react-router-dom';
import { getMetaData } from '../../../../tool';
import { Message } from '../../../../types';
import useMessageView from '../../../../hooks/useMessageView';

/**
 * Interface representing the props for the Message component.
 *
 * message - The message object containing details about the message.
 */
interface MessageProps {
  message: Message;
}

/**
 * Message component renders the contents of a message including its text and date sent
 *
 * @param message - The message object containing message details.
 */
const MessageView = ({ message }: MessageProps) => {
  const {
    isEditing,
    editingText,
    setEditingText,
    saveClicked,
    setSaveClicked,
    isDeleted,
    user,
    currentMessage,
    currentEmojis,
    hasFile,
    handleDownloadFile,
    dropDownSelected,
    setDropDownSelected,
    selectedMessageOptions,
    handleMessageOptionSelection,
    handleEmojiOptionSelection,
    setDropDownEmojiSelected,
    dropDownEmojiSelected,
  } = useMessageView(message);
  const navigate = useNavigate();

  return (
    <div className='messageContainer'>
      <div className='message right_padding'>
        <div className='messageByContents'>
          <div
            className={message.messageBy === user.username ? 'messageBySelf' : 'messageByOther'}
            onClick={e => {
              e.stopPropagation();
              navigate(`/account/${message.messageBy}`);
            }}>
            {message.messageBy}
            {message.isCodeStyle ? 'isCodeStyle=true' : 'isCodeStyle=false'}
          </div>
          <div>{!isDeleted && Object.values(currentEmojis).join('  ')}</div>
        </div>
        {!isEditing ? (
          <div className={message.isCodeStyle ? 'messageTextCodeStyle' : 'messageText'}>
            {editingText}
          </div>
        ) : (
          <div className='messageTextEdit'>
            <textarea
              className={message.isCodeStyle ? 'messageTextEditBoxCodeStyle' : 'messageTextEditBox'}
              placeholder='New Message...'
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
            />
            <button
              className='messageTextEditSaveButton'
              onClick={() => {
                setSaveClicked(!saveClicked);
                handleMessageOptionSelection('Edit');
              }}>
              Save
            </button>
          </div>
        )}
        <div className='downloadableFile'>
          {hasFile && !isDeleted ? (
            <div>
              {' '}
              <button onClick={handleDownloadFile}>{`Download 📎`}</button>{' '}
            </div>
          ) : null}
        </div>
        <div className='dropDownEmoji'>
          {!isDeleted && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => {
                  setDropDownEmojiSelected(!dropDownEmojiSelected);
                  setDropDownSelected(false);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  background: 'yellow',
                  cursor: 'pointer',
                }}
                disabled={isDeleted}>
                Emoji
              </button>

              {/* Dropdown Menu */}
              {dropDownEmojiSelected ? (
                <ul
                  className='dropDownContents'
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    padding: '10px',
                    background: '#fff',
                  }}>
                  {['👍', '👎 ', '❤️', '😃', '😢', '🙏'].map((option, index) => (
                    <li
                      key={index}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onClick={() => handleEmojiOptionSelection(option)}>
                      {option}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
        <div className='dropDown'>
          {!isDeleted && message.messageBy === user.username ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Dropdown Button */}
              <button
                onClick={() => {
                  setDropDownSelected(!dropDownSelected);
                  setDropDownEmojiSelected(false);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  background: 'orange',
                  cursor: 'pointer',
                }}
                disabled={isDeleted}>
                &#x22EE;
              </button>

              {/* Dropdown Menu */}
              {dropDownSelected ? (
                <ul
                  className='dropDownContents'
                  style={{
                    position: 'absolute',
                    padding: '10px',
                    background: '#fff',
                  }}>
                  {['Edit', 'Delete'].map((option, index) => (
                    <li
                      key={index}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() => handleMessageOptionSelection(option)}>
                      {option}
                      {selectedMessageOptions.includes(option) && (
                        <span style={{ color: 'green', marginLeft: '10px' }}>✔️</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
        <div
          className='messageDate'
          style={{ color: message.views.includes(user.username) ? 'black' : 'red' }}>
          {getMetaData(new Date(message.messageDateTime))}
          <div className='messageDate-data-above'>
            Read:{' '}
            {currentMessage.views
              ?.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
              .join(', ')}
          </div>
          <div className='messageDate-data-below'>
            Not Read:{' '}
            {currentMessage.messageTo
              .filter(username => !currentMessage.views?.includes(username))
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
              .join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageView;
