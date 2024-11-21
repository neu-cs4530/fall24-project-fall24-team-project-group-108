import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Correspondence, Message } from '../types';
import { getCorrespondencesByOrder } from '../services/correspondenceService';
import { addMessage } from '../services/messageService';

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
        const res = await getCorrespondencesByOrder();

        setCorrespondenceList(
          res.filter(correspondence => correspondence.messageMembers.indexOf(user.username) > -1),
        );
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
        setSelectedCorrespondenceMessages([...correspondence.messages]);
      }
    };

    fetchData();

    socket.on('correspondenceUpdate', handleCorrespondenceUpdate);

    return () => {
      socket.off('correspondenceUpdate', handleCorrespondenceUpdate);
    };
  }, [socket, selectedCorrespondence, user]);

  const handleSelectCorrespondence = (correspondence: Correspondence): void => {
    setSelectedCorrespondence(correspondence);
    setSelectedCorrespondenceMessages([...correspondence.messages]);
  };

  const handleSendMessage = async (): Promise<void> => {
    if (messageText !== '') {
      const cid = selectedCorrespondence?._id;
      const messageTo = selectedCorrespondence?.messageMembers.filter(
        member => member !== user.username,
      );
      const message = {
        messageText,
        messageDateTime: new Date(),
        messageTo: messageTo || [],
        messageBy: user.username,
        isCodeStyle,
      };

      const updatedCorrespondence = await addMessage(cid || '', message);
      const updatedCorrespondenceList = correspondenceList.filter(
        correspondence => correspondence._id !== cid,
      );

      setCorrespondenceList([...updatedCorrespondenceList, updatedCorrespondence]);
      setSelectedCorrespondence({ ...updatedCorrespondence });
      setSelectedCorrespondenceMessages([...updatedCorrespondence.messages, message]);
      setMessageText('');
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
  };
};

export default useMessagePage;
