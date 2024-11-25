import { useEffect, useState } from 'react';
import { EmojiClickData } from 'emoji-picker-react';
import useUserContext from './useUserContext';
import { Message } from '../types';
import {
  updateMessageById,
  updateMessageEmojisById,
  updateMessageIsDeletedById,
} from '../services/messageService';

/**
 * Custom hook for managing the message page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */

/**
 * Custom hook for managing the message view state, ui interactions, and real-time updates
 * @param message - The original contents of the message to start with
 * @returns isEditing - A boolean determing if the message is currently being edited
 * @returns setIsEditing - A function to set the isEditing value
 * @returns editingText - A boolean describing the current contents of the message text
 * @returns setEditingText - A function to set the current contents of the message text
 * @returns isCodeStyle - A boolean describing if the message is a code cell
 * @returns setIsCodeStyle - A function to set if the message is a code cell
 * @returns saveClicked - A boolean describing if the edited message has been saved
 * @returns setIsCodeStyle - A function to set if the edited message has been saved
 * @returns isDeleted - A boolean describing if the message has been deleted
 * @returns setIsDeleted - A function to set if the message has been deleted
 * @returns user - A user object detailing the current user
 * @returns currentMessage - A Message object detailing the current contents of the message
 * @returns setCurrentMessage - A function to set the current contents of the message
 * @returns currentEmojis - A Map object detailing the each user's emoji reaction the message
 * @returns handleEmojiSelection - A function to handle a user's emoji reaction
 * @returns hasFile - A boolean detailing if the message has a file attachment
 * @returns handleDownloadFile - A function to handle a user's file upload
 * @returns dropDownSelected - A boolean describing if the message options dropdown has been selected
 * @returns setDropDownSelected - A function to set if the message options dropdown has been selected
 * @returns selectedMessageOptions - A list of strings detailing which message options have been selected
 * @returns handleMessageOptionSelection - A function to handle a message option selection
 * @returns handleEmojiOptionSelection - A function to handle an emoji option selection
 * @returns dropDownEmojiSelected - A boolean describing if the emoji options dropdown has been selected
 * @returns setDropDownEmojiSelected - A function to set if the emoji options dropdown has been selected
 */
const useMessageView = (message: Message) => {
  const { socket, user } = useUserContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<string>(message.messageText);
  const [isCodeStyle, setIsCodeStyle] = useState<boolean>(message.isCodeStyle);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [messageId] = useState<string>(message._id || '');
  const [currentMessage, setCurrentMessage] = useState<Message>({ ...message });
  const [currentEmojis, setCurrentEmojis] = useState<{ [key: string]: string }>(
    message.emojiTracker ? { ...message.emojiTracker } : {},
  );
  const [hasFile] = useState<boolean>(!!currentMessage.fileData && !!currentMessage.fileName);
  const [dropDownSelected, setDropDownSelected] = useState<boolean>(false);
  const [dropDownEmojiSelected, setDropDownEmojiSelected] = useState<boolean>(false);
  const [selectedMessageOptions, setSelectedMessageOptions] = useState<string[]>([]);

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
      await updateMessageIsDeletedById(messageId || '', true);
    };

    // Need to update message by id, passing in new text
    if (isDeleted) {
      updateMessage();
      setIsCodeStyle(false);
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
        if (updatedMessage.isDeleted) {
          setIsDeleted(true);
          setIsEditing(false);
        }
      }
    };

    socket.on('messageUpdate', handleMessageUpdate);

    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [socket, messageId, currentEmojis]);

  const handleEmojiSelection = (selectedEmoji: EmojiClickData) => {
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
      const bufferData = new Uint8Array(currentMessage.fileData);
      const dataType = new TextDecoder().decode(bufferData.slice(1, 4)).toLowerCase();
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

  const handleMessageOptions = (messageOptions: string[]) => {
    if (isDeleted || messageOptions.includes('Delete')) {
      setIsDeleted(true);
      setIsEditing(false);
    } else {
      setIsEditing(messageOptions.includes('Edit'));
    }
    setDropDownSelected(false);
  };

  const handleMessageOptionSelection = (messageSelection: string) => {
    if (selectedMessageOptions.includes(messageSelection)) {
      const updatedSelectionList = selectedMessageOptions.filter(
        selection => selection !== messageSelection,
      );
      handleMessageOptions(updatedSelectionList);
      setSelectedMessageOptions(updatedSelectionList);
    } else {
      const updatedSelectionList = [...selectedMessageOptions, messageSelection];
      handleMessageOptions(updatedSelectionList);
      setSelectedMessageOptions(updatedSelectionList);
    }
  };

  const handleEmojiOptionSelection = (emojiSelection: string) => {
    const updatedCurrentEmojis = { ...currentEmojis };
    if (!(user.username in currentEmojis)) {
      updatedCurrentEmojis[user.username] = emojiSelection;
      setCurrentEmojis({ ...updatedCurrentEmojis });
    } else if (currentEmojis[user.username] === emojiSelection) {
      delete updatedCurrentEmojis[user.username];
      setCurrentEmojis({ ...updatedCurrentEmojis });
    } else {
      updatedCurrentEmojis[user.username] = emojiSelection;
      setCurrentEmojis({ ...updatedCurrentEmojis });
    }
    const updateEmojisDb = async (mid: string, updatedEmojis: { [key: string]: string }) => {
      const updatedMessage = await updateMessageEmojisById(mid, { ...updatedEmojis });
      setCurrentMessage({ ...updatedMessage });
    };
    updateEmojisDb(currentMessage._id || '', updatedCurrentEmojis);
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
    currentMessage,
    setCurrentMessage,
    currentEmojis,
    handleEmojiSelection,
    hasFile,
    handleDownloadFile,
    dropDownSelected,
    setDropDownSelected,
    selectedMessageOptions,
    handleMessageOptionSelection,
    handleEmojiOptionSelection,
    setDropDownEmojiSelected,
    dropDownEmojiSelected,
  };
};

export default useMessageView;
