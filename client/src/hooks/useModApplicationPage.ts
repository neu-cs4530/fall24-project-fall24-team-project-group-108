import { useEffect, useState } from 'react';
import { ModApplication } from '../types';
import useUserContext from './useUserContext';
import { deleteModApplication, getModApplications } from '../services/modApplicationService';
import { makeUserModerator } from '../services/userService';

/**
 * Custom hook for managing the modApplicationPage, navigation, and real-time updates.
 *
 * @returns applications - The current list of applications in the database.
 * @returns err - The current error statement value.
 * @returns handleApplicationDecision - Function to handle the acceptance or rejection of an application.
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
      if (isAccepted === true) {
        const updatedUser = await makeUserModerator(username);
        if (!updatedUser) {
          setErr('Error accepting application');
        }
      }
      const removedApplication = await deleteModApplication(username);
      if (removedApplication === false) {
        setErr('Error accepting application');
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
