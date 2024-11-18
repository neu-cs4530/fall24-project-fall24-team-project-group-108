import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Message } from '../types';
import { updateMessageById } from '../services/messageService';

/**
 * Custom hook for managing the message page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useMessageView = (message: Message) => {
  const { socket, user } = useUserContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<string>(message.messageText);
  const [isCodeStyle, setIsCodeStyle] = useState<boolean>(message.isCodeStyle);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>(message._id || '');

  useEffect(() => {
    const updateMessage = async () => {
      await updateMessageById(messageId || '', editingText, isCodeStyle);
    };

    // Need to update message by id, passing in new text
    if (saveClicked) {
      updateMessage();
      setIsEditing(false);
    }
    setSaveClicked(false);
  }, [saveClicked, editingText, isCodeStyle, messageId]);

  useEffect(() => {
    const updateMessage = async () => {
      await updateMessageById(messageId || '', 'Message was Deleted', false);
    };

    // Need to update message by id, passing in new text
    if (isDeleted) {
      updateMessage();
      setIsEditing(false);
    }
    setIsEditing(false);
    setSaveClicked(false);
  }, [isDeleted, messageId]);

  useEffect(() => {
    const handleMessageUpdate = (updatedMessage: Message) => {
      if (updatedMessage._id === messageId) {
        setEditingText(updatedMessage.messageText);
      }
    };

    socket.on('messageUpdate', handleMessageUpdate);

    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [socket, messageId]);

  return {
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
  };
};

export default useMessageView;
