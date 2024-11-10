import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Message, Correspondence } from '../../../../types';
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
  const navigate = useNavigate();
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
  } = useMessageView(message);

  return (
    <div className='message right_padding'>
      <div className='messageBy'>{message.messageBy}</div>
      {!isEditing ? (
        <div className='messageText'>{editingText}</div>
      ) : (
        <div className='messageTextEdit'>
          <textarea
            className='messageTextEditBox'
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
      {/* <div className='codeStyle'>{message.messageText}</div> */}
      {/* <textarea
        className='messageText'
        placeholder='New Message...'
        value={message.messageText}
        // onChange={e => setMessageText(e.target.value)}
      /> */}
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
      <div className='messageDate'>{getMetaData(new Date(message.messageDateTime))}</div>
    </div>
  );
};

export default MessageView;
