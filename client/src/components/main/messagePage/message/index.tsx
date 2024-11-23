import './index.css';
import EmojiPicker from 'emoji-picker-react';
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
  } = useMessageView(message);

  return (
    <div className='messageContainer'>
      <div className='message right_padding'>
        <div className='messageBy'>{message.messageBy}</div>
        <button className='readReceipts' onClick={() => setShowReadReceipts(!showReadReceipts)}>
          Read Receipts
        </button>
        {!isEditing ? (
          <div className={isCodeStyle ? 'messageTextCodeStyle' : 'messageText'}>{editingText}</div>
        ) : (
          <div className='messageTextEdit'>
            <button
              className='messageTextEditCodeStyleButton'
              onClick={() => setIsCodeStyle(!isCodeStyle)}>
              {'<Code> Style'}
            </button>
            <textarea
              className={isCodeStyle ? 'messageTextEditBoxCodeStyle' : 'messageTextEditBox'}
              placeholder='New Message...'
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
            />
            <button
              className='messageTextEditSaveButton'
              onClick={() => setSaveClicked(!saveClicked)}>
              Save
            </button>
          </div>
        )}
        {user.username === message.messageBy ? (
          <button
            className='editMessageButton'
            disabled={isEditing}
            onClick={() => setIsEditing(!isEditing)}>
            Edit
          </button>
        ) : (
          <div className='editMessageButton'></div>
        )}
        {user.username === message.messageBy ? (
          <button
            className='deleteMessageButton'
            disabled={isDeleted}
            onClick={() => setIsDeleted(true)}>
            Delete
          </button>
        ) : (
          <div className='deleteMessageButton'></div>
        )}
        <button onClick={() => setViewEmojiPicker(!viewEmojiPicker)}>Select an Emoji</button>
        <div className='messageDate'>{getMetaData(new Date(message.messageDateTime))}</div>
      </div>
      {showReadReceipts ? <div> Read: {currentMessage.views?.join(', ')} </div> : null}
      {showReadReceipts ? (
        <div>
          {' '}
          Not Read:{' '}
          {currentMessage.messageTo
            .filter(username => !currentMessage.views?.includes(username))
            .join(', ')}{' '}
        </div>
      ) : null}
      <div style={{ width: '50px', height: '50px' }}>
        <EmojiPicker
          open={viewEmojiPicker}
          reactionsDefaultOpen={true}
          allowExpandReactions={false}
          onReactionClick={(selectedEmoji, event) => handleEmojiSelection(selectedEmoji)}
        />
      </div>
      <div> {Object.values(currentEmojis).join(', ')} </div>
      {hasFile ? (
        <div>
          {' '}
          <button onClick={handleDownloadFile}>{`Download ${currentMessage.fileName}`}</button>{' '}
        </div>
      ) : null}
    </div>
  );
};

export default MessageView;
