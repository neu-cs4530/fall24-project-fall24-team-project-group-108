import './index.css';
import EmojiPicker from 'emoji-picker-react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
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
    setIsEditing,
    editingText,
    setEditingText,
    isCodeStyle,
    setIsCodeStyle,
    saveClicked,
    setSaveClicked,
    isDeleted,
    setIsDeleted,
    user,
    showReadReceipts,
    setShowReadReceipts,
    currentMessage,
    currentEmojis,
    handleEmojiSelection,
    viewEmojiPicker,
    setViewEmojiPicker,
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

  return (
    // <div className='messageText'>
    <div className='messageContainer'>
      <div className='message right_padding'>
        <div className={message.messageBy === user.username ? 'messageBySelf' : 'messageByOther'}>
          {message.messageBy}
          <br></br>
          {Object.values(currentEmojis).join('  ')}
        </div>
        {/* <button className='readReceipts' onClick={() => setShowReadReceipts(!showReadReceipts)}>
          Read Receipts
        </button> */}
        {!isEditing ? (
          <div className={isCodeStyle ? 'messageTextCodeStyle' : 'messageText'}>{editingText}</div>
        ) : (
          <div className='messageTextEdit'>
            <textarea
              className={isCodeStyle ? 'messageTextEditBoxCodeStyle' : 'messageTextEditBox'}
              placeholder='New Message...'
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
            />
            <button
              className='messageTextEditCodeStyleButton'
              onClick={() => setIsCodeStyle(!isCodeStyle)}>
              {'<Code> Style 📎'}
            </button>
            <button
              className='messageTextEditSaveButton'
              onClick={() => setSaveClicked(!saveClicked)}>
              Save
            </button>
          </div>
        )}
        {/* {user.username === message.messageBy ? (
          <button
            className='editMessageButton'
            disabled={isEditing}
            onClick={() => setIsEditing(!isEditing)}>
            Edit
          </button>
        ) : (
          <div className='editMessageButton'></div>
        )} */}
        {/* {user.username === message.messageBy ? (
          <button
            className='deleteMessageButton'
            disabled={isDeleted}
            onClick={() => setIsDeleted(true)}>
            Delete
          </button>
        ) : (
          <div className='deleteMessageButton'></div>
        )} */}
        <div className='dropDownEmoji'>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Dropdown Button */}
            <button
              onClick={() => {
                setDropDownEmojiSelected(!dropDownEmojiSelected);
                setDropDownSelected(false);
              }}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                background: '#fff',
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
                  top: '40px',
                  left: '0',
                  listStyle: 'none',
                  margin: '0',
                  padding: '10px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                {['👍', '👎 ', '❤️', '😃', '😢', '🙏'].map((option, index) => (
                  <li
                    key={index}
                    // onClick={() => handleOptionClick(option)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handleEmojiOptionSelection(option)}>
                    {option}
                    {/* {selectedMessageOptions.includes(option) && (
                        <span style={{ color: 'green', marginLeft: '10px' }}>✔️</span>
                      )} */}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className='dropDown'>
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
                background: '#fff',
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
                  top: '40px',
                  left: '0',
                  listStyle: 'none',
                  margin: '0',
                  padding: '10px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                {['Edit', 'Delete', 'Show Read Receipts'].map((option, index) => (
                  <li
                    key={index}
                    // onClick={() => handleOptionClick(option)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
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
        </div>
        {/* <button onClick={() => setViewEmojiPicker(!viewEmojiPicker)}>Select an Emoji</button> */}
        <div
          className={message.views.includes(user.username) ? 'messageDate' : 'messageDateUnread'}>
          {getMetaData(new Date(message.messageDateTime))}
        </div>
      </div>
      <div className='message right_padding'>
        <div className='messageBy'>
          {showReadReceipts && currentMessage.views?.length > 0 ? (
            <div>
              {' '}
              Read:<br></br>
              {currentMessage.views
                ?.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .join(', ')}{' '}
            </div>
          ) : null}
          {showReadReceipts &&
          currentMessage.views?.length !== currentMessage.messageTo.length + 1 ? (
            <div>
              {' '}
              Not Read:<br></br>
              {currentMessage.messageTo
                .filter(username => !currentMessage.views?.includes(username))
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))//use .map
                .join(', ')}{' '}
            </div>
          ) : null}
          {/* <div> {Object.values(currentEmojis).join(', ')} </div> */}

          {/* {hasFile ? (
            <div>
              {' '}
              <button
                onClick={handleDownloadFile}>{`Download ${currentMessage.fileName}`}</button>{' '}
            </div>
          ) : null} */}
        </div>
        <div className='messageText'>
          {hasFile ? (
            <div>
              {' '}
              <button
                onClick={handleDownloadFile}>{`Download ${currentMessage.fileName}`}</button>{' '}
            </div>
          ) : null}
        </div>
        <div className='emojiPickerDiv' style={{ width: '10px', height: '10px' }}>
          <EmojiPicker
            open={viewEmojiPicker}
            reactionsDefaultOpen={true}
            allowExpandReactions={false}
            width={20}
            height={20}
            onReactionClick={(selectedEmoji, event) => handleEmojiSelection(selectedEmoji)}
          />
        </div>
        {/* <div> {Object.values(currentEmojis).join(', ')} </div> */}
        {/* {hasFile ? (
          <div>
            {' '}
            <button
              onClick={handleDownloadFile}>{`Download ${currentMessage.fileName}`}</button>{' '}
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default MessageView;
