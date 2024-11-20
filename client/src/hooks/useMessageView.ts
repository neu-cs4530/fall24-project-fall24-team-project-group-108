import { useEffect, useState } from 'react';
import { EmojiClickData } from 'emoji-picker-react';
import useUserContext from './useUserContext';
import { Message } from '../types';
import { updateMessageById, updateMessageEmojisById } from '../services/messageService';

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
  const [messageId] = useState<string>(message._id || '');
  const [showReadReceipts, setShowReadReceipts] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<Message>({ ...message });
  const [currentEmojis, setCurrentEmojis] = useState<{ [key: string]: string }>({});
  const [viewEmojiPicker, setViewEmojiPicker] = useState<boolean>(false);
  const [hasFile, setHasFile] = useState<boolean>(
    !!currentMessage.fileData && !!currentMessage.fileName,
  );

  useEffect(() => {
    if (message.emojiTracker) {
      setCurrentEmojis({ ...message.emojiTracker });
    }
  }, []);

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
        setCurrentMessage({ ...updatedMessage });
        setCurrentEmojis({ ...currentEmojis, ...updatedMessage.emojiTracker });
      }
    };

    socket.on('messageUpdate', handleMessageUpdate);

    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [socket, messageId]);

  const handleEmojiSelection = (selectedEmoji: EmojiClickData) => {
    setViewEmojiPicker(false);
    const updatedCurrentEmojis = { ...currentEmojis };
    if (!(user.username in currentEmojis)) {
      updatedCurrentEmojis[user.username] = selectedEmoji.emoji;
      setCurrentEmojis({ ...updatedCurrentEmojis });
    } else if (currentEmojis[user.username] === selectedEmoji.emoji) {
      delete updatedCurrentEmojis[user.username];
      setCurrentEmojis({ ...updatedCurrentEmojis });
    } else {
      updatedCurrentEmojis[user.username] = selectedEmoji.emoji;
      setCurrentEmojis({ ...updatedCurrentEmojis });
    }
    const updateEmojisDb = async (mid: string, updatedEmojis: { [key: string]: string }) => {
      const updatedMessage = await updateMessageEmojisById(mid, { ...updatedEmojis });
      setCurrentMessage({ ...updatedMessage });
    };
    updateEmojisDb(currentMessage._id || '', updatedCurrentEmojis);
  };

  const handleDownloadFile = () => {
    if (currentMessage.fileData) {
      const x = true;
      const bufferData = new Uint8Array(currentMessage.fileData);
      const dataType = new TextDecoder().decode(bufferData.slice(1, 4)).toLowerCase();
      console.log('handleDownloadFile');
      console.log(new TextDecoder().decode(bufferData.slice(1, 4)));
      console.log(bufferData);
      console.log(new TextDecoder().decode(bufferData));
      console.log(currentMessage.fileData);
      const mimePath = dataType === 'pdf' ? 'application/pdf' : 'image/jpg';
      const blobObject = new Blob([bufferData], { type: mimePath });
      const url = window.URL.createObjectURL(blobObject);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentMessage.fileName || 'file'; // The filename that will be used for the downloaded file
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

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
    showReadReceipts,
    setShowReadReceipts,
    currentMessage,
    setCurrentMessage,
    currentEmojis,
    handleEmojiSelection,
    viewEmojiPicker,
    setViewEmojiPicker,
    hasFile,
    handleDownloadFile,
  };
};

export default useMessageView;
