import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, Correspondence, OrderType, Question, Message } from '../types';
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
  const [isCodeStyle, setIsCodeStyle] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  //   const handleUpdateCorrespondence = () => {
  //     navigate(`/update/correspondence/${selectedCorrespondence?._id}`);
  //   };

  //   useEffect(() => {
  //   }, []);

  //   useEffect(() => {

  //     // socket.on('questionUpdate', handleQuestionUpdate);
  //     // socket.on('answerUpdate', handleAnswerUpdate);
  //     // socket.on('viewsUpdate', handleViewsUpdate);
  //     socket.on('correspondenceUpdate', handleCorrespondenceUpdate);

  //     return () => {
  //       //   socket.off('questionUpdate', handleQuestionUpdate);
  //       //   socket.off('answerUpdate', handleAnswerUpdate);
  //       // socket.off('viewsUpdate', handleViewsUpdate);
  //       socket.off('correspondenceUpdate', handleCorrespondenceUpdate);
  //     };
  //   }, [socket]);

  useEffect(() => {
    const updateMessage = async () => {
      const result = await updateMessageById(message._id || '', editingText);
    };

    // Need to update message by id, passing in new text
    if (saveClicked) {
      updateMessage();
      setIsEditing(false);
    }
    setIsEditing(false);
    setSaveClicked(false);
  }, [saveClicked]);

  useEffect(() => {
    const updateMessage = async () => {
      const result = await updateMessageById(message._id || '', 'Message was Deleted');
    };

    // Need to update message by id, passing in new text
    if (isDeleted) {
      updateMessage();
      setIsEditing(false);
    }
    setIsEditing(false);
    setSaveClicked(false);
  }, [isDeleted]);

  useEffect(() => {
    const handleMessageUpdate = (updatedMessage: Message) => {
      if (updatedMessage._id === message._id) {
        setEditingText(updatedMessage.messageText);
      }
    };

    socket.on('messageUpdate', handleMessageUpdate);

    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [socket]);

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
