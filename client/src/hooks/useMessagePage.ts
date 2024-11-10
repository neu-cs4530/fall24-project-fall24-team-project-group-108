import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, Correspondence, OrderType, Question, Message } from '../types';
import { getQuestionsByFilter } from '../services/questionService';
import { addCorrespondence, getCorrespondencesByOrder } from '../services/correspondenceService';
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

  const [searchParams] = useSearchParams();
  const [titleText, setTitleText] = useState<string>('All Messages');
  const [search, setSearch] = useState<string>('');
  const [correspondenceOrder, setCorrespondenceOrder] = useState<OrderType>('newest');
  const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>([]);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [selectedCorrespondenceMessages, setSelectedCorrespondenceMessages] = useState<Message[]>(
    [],
  );
  const [toAddText, setToAddText] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');

  const handleUpdateCorrespondence = () => {
    navigate(
      `/update/correspondence/${selectedCorrespondence?._id}`,
    );
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

        console.log('res');
        console.log(res);
        setCorrespondenceList(
          res.filter(correspondence => correspondence.messageMembers.indexOf(user.username) > -1),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to handle message/corresponcence updates from the socket.
     *
     * @param correspondence - The updated correspondence object.
     */
    const handleCorrespondenceUpdate = async (correspondence: Correspondence) => {
      // setCorrespondenceList(
      //   [...correspondenceList].map(c =>
      //     c._id === correspondence._id ? { ...correspondence } : { ...c },
      //   ),
      // );
      await fetchData();
      if (selectedCorrespondence && selectedCorrespondence._id === correspondence._id) {
        console.log('changing selected correspondence');
        console.log({ ...correspondence });
        setSelectedCorrespondence({ ...correspondence });
        setSelectedCorrespondenceMessages([...correspondence.messages]);
      }
    };

    fetchData();

    // socket.on('questionUpdate', handleQuestionUpdate);
    // socket.on('answerUpdate', handleAnswerUpdate);
    // socket.on('viewsUpdate', handleViewsUpdate);
    socket.on('correspondenceUpdate', handleCorrespondenceUpdate);

    return () => {
      //   socket.off('questionUpdate', handleQuestionUpdate);
      //   socket.off('answerUpdate', handleAnswerUpdate);
      // socket.off('viewsUpdate', handleViewsUpdate);
      socket.off('correspondenceUpdate', handleCorrespondenceUpdate);
    };
  }, [socket]);

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
      };

      console.log('handleSendMessage');
      console.log(selectedCorrespondence);
      const updatedCorrespondence = await addMessage(cid || '', message);
      console.log('addedMessage after');
      console.log(updatedCorrespondence);
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
  };
};

export default useMessagePage;
