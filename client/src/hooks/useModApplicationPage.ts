import { useEffect, useState } from 'react';
import { ModApplication } from '../types';
import useUserContext from './useUserContext';
import { getModApplications, updateModApplicationStatus } from '../services/modApplicationService';
import { makeUserModerator } from '../services/userService';

/**
 * Custom hook for managing the answer page's state, navigation, and real-time updates.
 *
 * @returns questionID - The current question ID retrieved from the URL parameters.
 * @returns question - The current question object with its answers, comments, and votes.
 * @returns handleNewComment - Function to handle the submission of a new comment to a question or answer.
 * @returns handleNewAnswer - Function to navigate to the "New Answer" page
 */
const useModApplicationPage = () => {
  const [applications, setApplications] = useState<ModApplication[]>([]);
  const [err, setErr] = useState<string>('');
  const { socket } = useUserContext();

  // Fetches applications from the database.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getModApplications();
        setApplications(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching applications:', error);
        setErr('Error Fetching Applications');
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, []);

  const handleApplicationDecision = async (application: ModApplication, isAccepted: boolean) => {
    try {
      const { username } = application;
      const updatedApplication = await updateModApplicationStatus(username, isAccepted);
      if (updatedApplication === false) {
        setErr('Error updating application');
      }
      if (isAccepted === true) {
        const updatedUser = await makeUserModerator(username);
        if (!updatedUser) {
          setErr('Error accepting application');
        }
      }
      setApplications(prev => prev.filter(modApp => modApp._id !== application._id));
    } catch (error) {
      setErr('Error processing application');
    }
  };

  //   useEffect(() => {
  //     /**
  //      * Function to handle updates to the answers of a question.
  //      *
  //      * @param answer - The updated answer object.
  //      */
  //     const handleNewApplication = (newApplication: ModApplication) => {
  //       setApplications(prevApplications => [...prevApplications, newApplication]);
  //     };

  //     socket.on('newApplication', handleNewApplication);

  //     return () => {
  //       socket.off('newApplication', handleNewApplication);
  //     };
  //   }, []);

  return {
    applications,
    err,
    handleApplicationDecision,
  };
};

export default useModApplicationPage;
