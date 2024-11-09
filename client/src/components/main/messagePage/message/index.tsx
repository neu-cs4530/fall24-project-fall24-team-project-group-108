import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Message, Correspondence } from '../../../../types';

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

  return (
    <div className='message right_padding'>
      <div className='messageBy'>{message.messageBy}</div>
      <div className='messageText'>{message.messageText}</div>
      <div className='messageDate'>{getMetaData(new Date(message.messageDateTime))}</div>
    </div>
  );
};

export default MessageView;
