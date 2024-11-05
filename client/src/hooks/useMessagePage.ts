import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, Correspondence, OrderType, Question, Message } from '../types';
import { getQuestionsByFilter } from '../services/questionService';
import { addCorrespondence, getCorrespondencesByOrder } from '../services/correspondenceService';
import { addMessage } from '../services/messageService';

/**
 * Custom hook for managing the question page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useMessagePage = () => {
  const { socket } = useUserContext();

  const [searchParams] = useSearchParams();
  const [titleText, setTitleText] = useState<string>('All Questions');
  const [search, setSearch] = useState<string>('');
  const [correspondenceOrder, setCorrespondenceOrder] = useState<OrderType>('newest');
  const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>([]);

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
        // const message1 = {
        //   messageText: 'I just had a great era',
        //   messageDateTime: new Date(),
        //   messageBy: 'bgibson',
        //   messageTo: ['rjackson', 'siqbal'],
        // } as Message;
        // const message2 = {
        //   messageText: 'I just hit 3hr in the WS!',
        //   messageDateTime: new Date(),
        //   messageBy: 'rjackson',
        //   messageTo: ['bgibson', 'siqbal'],
        // } as Message;
        // await addMessage(message1);
        // await addMessage(message2);
        // const correspondence1 = {
        //   // _id: '1970',
        //   views: [],
        //   messageMembers: ['siqbal', 'rjackson', 'bgibson'],
        //   messages: [],
        // };
        // await addCorrespondence(correspondence1);
        // const message3 = {
        //   messageText: 'I just called my shot!',
        //   messageDateTime: new Date(),
        //   messageBy: 'bruth',
        //   messageTo: ['lgehrig', 'siqbal'],
        // };
        // const message4 = {
        //   messageText: 'I just gave an inspirational speech :(',
        //   messageDateTime: new Date(),
        //   messageBy: 'lgehrig',
        //   messageTo: ['bruth', 'siqbal'],
        // };
        // // await addMessage(message3);
        // // await addMessage(message4);
        // const correspondence2 = {
        //   // _id: '1930',
        //   views: [],
        //   messageMembers: ['siqbal', 'bruth', 'lgehrig'],
        //   messages: [],
        // };
        // await addCorrespondence(correspondence2);
        // console.log('fetchingData');
        const res = await getCorrespondencesByOrder(correspondenceOrder);
        // const sampleCorrespondenceList = [correspondence1, correspondence2];
        console.log('res');
        console.log(res);
        setCorrespondenceList(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to handle question updates from the socket.
     *
     * @param question - the updated question object.
     */
    // const handleQuestionUpdate = (question: Question) => {
    //   setQlist(prevQlist => {
    //     const questionExists = prevQlist.some(q => q._id === question._id);

    //     if (questionExists) {
    //       // Update the existing question
    //       return prevQlist.map(q => (q._id === question._id ? question : q));
    //     }

    //     return [question, ...prevQlist];
    //   });
    // };

    /**
     * Function to handle answer updates from the socket.
     *
     * @param qid - The question ID.
     * @param answer - The answer object.
     */
    // const handleAnswerUpdate = ({ qid, answer }: { qid: string; answer: Answer }) => {
    //   setQlist(prevQlist =>
    //     prevQlist.map(q => (q._id === qid ? { ...q, answers: [...q.answers, answer] } : q)),
    //   );
    // };

    /**
     * Function to handle views updates from the socket.
     *
     * @param question - The updated question object.
     */
    // const handleViewsUpdate = (question: Question) => {
    //   setQlist(prevQlist => prevQlist.map(q => (q._id === question._id ? question : q)));
    // };

    fetchData();

    // socket.on('questionUpdate', handleQuestionUpdate);
    // socket.on('answerUpdate', handleAnswerUpdate);
    // socket.on('viewsUpdate', handleViewsUpdate);

    return () => {
      //   socket.off('questionUpdate', handleQuestionUpdate);
      //   socket.off('answerUpdate', handleAnswerUpdate);
      //   socket.off('viewsUpdate', handleViewsUpdate);
    };
  }, [correspondenceOrder, search, socket]);

  return { correspondenceList };
};

export default useMessagePage;
