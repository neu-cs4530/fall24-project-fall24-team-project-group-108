import { useEffect, useState } from 'react';
import { ModApplication } from '../types';
import useUserContext from './useUserContext';
import { getModApplications } from '../services/modApplicationService';
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

  const handleAccept = async (application: ModApplication) => {
    try {
      // make user moderator
      const { username } = application.user;
      const id = application._id;
      if (!id) {
        setErr('Error finding application');
        return;
      }
      await makeUserModerator(id, username);
      // delete from database
      setApplications(prev => prev.filter(modApp => modApp._id !== application._id));
    } catch (error) {
      setErr('Error accepting application');
    }
  };

  const handleReject = async (application: ModApplication) => {
    try {
      // delete from database
      setApplications(prev => prev.filter(modApp => modApp._id !== application._id));
    } catch (error) {
      setErr('Error rejecting application');
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
    handleAccept,
    handleReject,
  };
};

export default useModApplicationPage;
