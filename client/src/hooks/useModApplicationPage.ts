import { useEffect, useState } from 'react';
import { FakeSOSocket, ModApplication } from '../types';
import { getModApplications, updateModApplicationStatus } from '../services/modApplicationService';
import { makeUserModerator } from '../services/userService';

/**
 * Custom hook for managing the Review Application page's state, navigation, and real-time updates.
 *
 * @returns applications - The current list of mod applications.
 * @returns numApps - The current number of unresolved applications.
 * @returns err - The current error message.
 * @returns handleApplicationDecision - Function to handle the acceptance or rejection of a mod application.
 */
const useModApplicationPage = (socket: FakeSOSocket) => {
  const [applications, setApplications] = useState<ModApplication[]>([]);
  const [numApps, setNumApps] = useState<number>(0);
  const [err, setErr] = useState<string>('');

  // Fetches applications from the database.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getModApplications();
        setApplications(res || []);
        const apps = res.length;
        setNumApps(apps);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching applications:', error);
        setErr('Error Fetching Applications');
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, []);

  /**
   * Handles the application decision event.
   *
   * @param application - The application whose status was decided
   * @param isAccepted - True if the applicationw is accepted, false otherwise
   */
  const handleApplicationDecision = async (application: ModApplication, isAccepted: boolean) => {
    try {
      const { username } = application;
      const id = application._id;
      if (id === undefined) {
        setErr('Application id not found');
        return;
      }
      const updatedApplication = await updateModApplicationStatus(id, username, isAccepted);
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
      setNumApps(prev => prev - 1);
    } catch (error) {
      setErr('Error processing application');
    }
  };

  useEffect(() => {
    const handleApplicationUpdate = (app: ModApplication) => {
      setApplications(prev => [app, ...prev]);
      setNumApps(prev => prev + 1);
    };

    socket.on('modApplicationUpdate', handleApplicationUpdate);

    return () => {
      socket.off('modApplicationUpdate', handleApplicationUpdate);
    };
  }, [socket]);

  return {
    applications,
    numApps,
    err,
    handleApplicationDecision,
  };
};

export default useModApplicationPage;
