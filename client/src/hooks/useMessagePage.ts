import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import useUserContext from './useUserContext';
import { Correspondence, Message } from '../types';
import {
  getCorrespondencesByOrder,
  updateCorrespondenceUserTypingById,
  updateCorrespondenceViewsById,
} from '../services/correspondenceService';
import { addMessage, updateMessageViewsById } from '../services/messageService';

/**
 * Custom hook for managing the message page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useMessagePage = () => {
  const { socket, user } = useUserContext();
  const navigate = useNavigate();

  const [titleText, setTitleText] = useState<string>('All Messages');
  const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>([]);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [selectedCorrespondenceMessages, setSelectedCorrespondenceMessages] = useState<Message[]>(
    [],
  );
  const [toAddText, setToAddText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isCodeStyle, setIsCodeStyle] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileErr, setUploadedFileErr] = useState<string>('');
  const [currentUserTyping, setCurrentUserTyping] = useState<string[]>([]);

  const handleUpdateCorrespondence = () => {
    navigate(`/update/correspondence/${selectedCorrespondence?._id}`);
  };

  useEffect(() => {
    const pageTitle = 'All Messages';

    setTitleText(pageTitle);
  }, []);

  useEffect(() => {
    if (!selectedCorrespondence) {
      return;
    }

    const getUpdatedCorrespondence = async () => {
      if (selectedCorrespondence) {
        if (messageText === '' && currentUserTyping.includes(user.username)) {
          const updatedUserTyping = currentUserTyping.filter(name => name !== user.username);
          const updatedCorrespondence = await updateCorrespondenceUserTypingById(
            selectedCorrespondence._id || '',
            [...updatedUserTyping],
          );
          setSelectedCorrespondence({ ...updatedCorrespondence });
        } else if (messageText !== '') {
          const updatedUserTyping = [...new Set([...currentUserTyping, user.username])];
          const updatedCorrespondence = await updateCorrespondenceUserTypingById(
            selectedCorrespondence._id || '',
            [...updatedUserTyping],
          );
          setSelectedCorrespondence({ ...updatedCorrespondence });
        }
      }
    };

    getUpdatedCorrespondence();
  }, [messageText]);

  useEffect(() => {
    /**
     * Function to fetch correspondences based on the order and update the correspondence list.
     */
    const fetchData = async () => {
      try {
        const res = await getCorrespondencesByOrder();
        const userCorrespondences = res.filter(
          correspondence => correspondence.messageMembers.indexOf(user.username) > -1,
        );
        // console.log(
        //   userCorrespondences[0].messages[
        //     userCorrespondences[0].messages.length - 1
        //   ].messageDateTime.getTime(),
        // );
        // userCorrespondences.sort(
        //   (a, b) =>
        //     a.messages[a.messages.length - 1].messageDateTime.getTime() -
        //     b.messages[b.messages.length - 1].messageDateTime.getTime(),
        // );
        setCorrespondenceList([...userCorrespondences]);
      } catch (error) {
        // Handle error
      }
    };

    /**
     * Function to handle message/corresponcence updates from the socket.
     *
     * @param correspondence - The updated correspondence object.
     */
    const handleCorrespondenceUpdate = async (correspondence: Correspondence) => {
      await fetchData();
      if (selectedCorrespondence && selectedCorrespondence._id === correspondence._id) {
        setSelectedCorrespondence({ ...correspondence });
        setCurrentUserTyping([...correspondence.userTyping]);
        setSelectedCorrespondenceMessages([...correspondence.messages]);
      }
    };

    fetchData();

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
    setCurrentUserTyping([...correspondence.userTyping]);
    setSelectedCorrespondenceMessages([...correspondence.messages]);
  };

  const convertUploadedFileToBuffer = async (file: File): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Onload event to handle the reading of the file
      reader.onload = event => {
        // The result is an ArrayBuffer
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          // Convert ArrayBuffer to Buffer (in a Node.js environment, you can use Buffer.from)
          const buffer = Buffer.from(arrayBuffer); // This will work in Node.js
          resolve(buffer);
        }
      };

      // On error event to handle read errors
      // reader.onerror = error => {
      //   reject('Error reading file');
      // };

      // Read file as ArrayBuffer
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
      } as Message;

      if (uploadedFile) {
        const fileName = uploadedFile.name;
        const fileData = await convertUploadedFileToBuffer(uploadedFile);
        const fileDataArray = Array.from(fileData);
        message = { ...message, fileName, fileData: fileDataArray };
      }
      const updatedCorrespondence = await addMessage(cid || '', message);

      const updatedCorrespondenceList = correspondenceList.filter(
        correspondence => correspondence._id !== cid,
      );

      setCorrespondenceList([...updatedCorrespondenceList, updatedCorrespondence]);
      setSelectedCorrespondence({ ...updatedCorrespondence });
      setSelectedCorrespondenceMessages([...updatedCorrespondence.messages, message]);
      setMessageText('');
      handleMessageViewsUpdate();
      setUploadedFile(null);
      setUploadedFileErr('');
    } else {
      setUploadedFileErr("Error: Can't send message with empty text");
    }
  };

  const handleUploadedFile = (eventTarget: HTMLInputElement) => {
    if (!eventTarget.files || eventTarget.files.length === 0) {
      return;
    }

    const userUploadedFile = eventTarget.files[0];

    console.log(userUploadedFile.size / 1024);

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
    toAddText,
    setToAddText,
    handleUpdateCorrespondence,
    isCodeStyle,
    setIsCodeStyle,
    uploadedFile,
    setUploadedFile,
    handleUploadedFile,
    uploadedFileErr,
  };
};

export default useMessagePage;
