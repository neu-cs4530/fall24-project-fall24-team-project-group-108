import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import useUserContext from './useUserContext';
import { Correspondence, Message } from '../types';
import {
  getCorrespondences,
  updateCorrespondenceUserTypingByIdNames,
  updateCorrespondenceViewsById,
} from '../services/correspondenceService';
import { addMessage, updateMessageViewsById } from '../services/messageService';

/**
 * Custom hook for managing the message page state, filtering, and real-time updates.
 *
 * @returns  user - A user object containing the current user's username
  @returns correspondenceList - A list of all the correspondences the user is involved with
  @returns titleText - The title of the page
  @returns selectedCorrespondence - The currently selected correspondence (includes which messages we should display)
  @returns setSelectedCorrespondence - Function to set selected correspondence
  @returns handleSetSelectedCorrespondence - Function to handle what to do when the user selects a correspondence
  @returns messageText - The message text the user can send
  @returns setMessageText - Function to set the message text the user can send
  @returns handleSendMessage - Function to handle details of sending message
  @returns selectedCorrespondenceMessages - A list of messages in the currently selected correspondence
  @returns handleUpdateCorrespondence - Function that handles when a user wants to add more mebers to a correspondence
  @returns isCodeStyle - A boolean indicating whether the user is entering a code cell
  @returns setIsCodeStyle - A function to set whether the user is entering a code cell
  @returns uploadedFile - A file object that is either null or contains the file the user is trying to send
  @returns setUploadedFile - A function to set the file object that is either null or contains the file the user is trying to send
  @returns setUploadedFile - A function to handle when the user uploads a file
  @returns uploadedFileErr - An error mesage if there is a problem uploading the file.
  @returns setIsSelectedCorrespondence - A function to set if a correspondence has been selected
 */
const useMessagePage = () => {
  const { socket, user } = useUserContext();
  const navigate = useNavigate();

  const [titleText, setTitleText] = useState<string>('All Messages');
  const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>([]);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [selectedCorrespondenceId, setSelectedCorrespondenceId] = useState<string>('');
  const [selectedCorrespondenceMessages, setSelectedCorrespondenceMessages] = useState<Message[]>(
    [],
  );
  const [messageText, setMessageText] = useState<string>('');
  const [isCodeStyle, setIsCodeStyle] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileErr, setUploadedFileErr] = useState<string>('');
  const [currentUserTyping, setCurrentUserTyping] = useState<string[]>([]);
  const [pendingMessageSend, setPendingMessageSend] = useState<boolean>(false);

  const handleUpdateCorrespondence = () => {
    navigate(`/update/correspondence/${selectedCorrespondence?._id}`);
  };

  useEffect(() => {
    const pageTitle = 'All Messages';

    setTitleText(pageTitle);
  }, []);

  useEffect(() => {
    /**
     * Function to fetch correspondences based on the order and update the correspondence list.
     */
    const fetchData = async () => {
      try {
        const res = await getCorrespondences();
        const userCorrespondences = res.filter(
          correspondence => correspondence.messageMembers.indexOf(user.username) > -1,
        );
        setCorrespondenceList([...userCorrespondences]);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();

    /**
     * Function to handle message/corresponcence updates from the socket.
     *
     * @param correspondence - The updated correspondence object.
     */
    const handleCorrespondenceUpdate = async (correspondence: Correspondence) => {
      if (selectedCorrespondence?._id && selectedCorrespondence._id === correspondence._id) {
        setSelectedCorrespondence({ ...correspondence });
        setCurrentUserTyping([...correspondence.userTyping]);
        setSelectedCorrespondenceMessages([...correspondence.messages]);
      } else if (correspondence.messageMembers.includes(user.username)) {
        setCorrespondenceList(previousList => [{ ...correspondence }, ...previousList]);
      }
    };

    socket.on('correspondenceUpdate', handleCorrespondenceUpdate);

    return () => {
      socket.off('correspondenceUpdate', handleCorrespondenceUpdate);
    };
  }, [socket, selectedCorrespondence, user]);

  const handleMessageViewsUpdate = async (): Promise<void> => {
    if (selectedCorrespondence) {
      const unreadMessages = selectedCorrespondence.messages.filter(
        message => !message.views?.includes(user.username),
      );
      const viewsUpdateHelper = async (m: Message): Promise<void> => {
        await updateMessageViewsById(m._id || '', user.username);
      };
      unreadMessages.forEach(message => viewsUpdateHelper(message));
    }
  };

  const handleSelectCorrespondence = async (correspondence: Correspondence): Promise<void> => {
    if (selectedCorrespondence) {
      // Update views for currently selected correspondence and all messages within
      if (!selectedCorrespondence.views?.includes(user.username)) {
        await updateCorrespondenceViewsById(selectedCorrespondence._id || '', user.username);
      }

      // for message, push user.username onto views
      handleMessageViewsUpdate();
    }
    setSelectedCorrespondence(correspondence);
    setSelectedCorrespondenceId(correspondence._id || '');
    setCurrentUserTyping([...correspondence.userTyping]);
    setSelectedCorrespondenceMessages([...correspondence.messages]);
  };

  const getUpdatedCorrespondence = async (newMessageText: string) => {
    if (newMessageText.length > 1) {
      return;
    }
    if (selectedCorrespondence) {
      await updateCorrespondenceUserTypingByIdNames(
        selectedCorrespondenceId || '',
        user.username,
        newMessageText !== '',
      );
    }
  };

  const convertUploadedFileToBuffer = async (file: File): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          const buffer = Buffer.from(arrayBuffer);
          resolve(buffer);
        }
      };

      reader.readAsArrayBuffer(file);
    });

  const handleSendMessage = async (): Promise<void> => {
    if (messageText !== '') {
      const cid = selectedCorrespondence?._id;
      const messageTo = selectedCorrespondence?.messageMembers.filter(
        member => member !== user.username,
      );
      let message = {
        messageText,
        messageDateTime: new Date(),
        messageTo: messageTo || [],
        messageBy: user.username,
        isCodeStyle,
        views: [user.username],
        isDeleted: false,
      } as Message;

      if (uploadedFile) {
        const fileName = uploadedFile.name;
        const fileData = await convertUploadedFileToBuffer(uploadedFile);
        const fileDataArray = Array.from(fileData);
        message = { ...message, fileName, fileData: fileDataArray };
      }
      setPendingMessageSend(true);
      setUploadedFileErr('Pending Message Send');
      const updatedCorrespondence = await addMessage(cid || '', message);

      const updatedCorrespondenceList = correspondenceList.filter(
        correspondence => correspondence._id !== cid,
      );

      setCorrespondenceList([...updatedCorrespondenceList, updatedCorrespondence]);
      setSelectedCorrespondence({ ...updatedCorrespondence });
      setSelectedCorrespondenceId(updatedCorrespondence._id || '');
      setSelectedCorrespondenceMessages([...updatedCorrespondence.messages]);
      setMessageText('');
      handleMessageViewsUpdate();
      setUploadedFile(null);
      setPendingMessageSend(false);
      setUploadedFileErr('');
      await updateCorrespondenceUserTypingByIdNames(cid || '', user.username, false);
    } else {
      setUploadedFileErr("Error: Can't send message with empty text");
    }
  };

  const handleUploadedFile = (eventTarget: HTMLInputElement) => {
    if (!eventTarget.files || eventTarget.files.length === 0) {
      return;
    }

    const userUploadedFile = eventTarget.files[0];

    if (userUploadedFile.size / 1024 > 25) {
      eventTarget.value = '';
      setUploadedFileErr('Error: File Size Too Large');
      setUploadedFile(null);
    } else {
      setUploadedFileErr('');
      setUploadedFile(userUploadedFile);
    }
  };

  return {
    user,
    correspondenceList,
    titleText,
    selectedCorrespondence,
    setSelectedCorrespondence,
    handleSelectCorrespondence,
    messageText,
    setMessageText,
    handleSendMessage,
    selectedCorrespondenceMessages,
    handleUpdateCorrespondence,
    isCodeStyle,
    setIsCodeStyle,
    uploadedFile,
    setUploadedFile,
    handleUploadedFile,
    uploadedFileErr,
    pendingMessageSend,
    currentUserTyping,
    getUpdatedCorrespondence,
  };
};

export default useMessagePage;
