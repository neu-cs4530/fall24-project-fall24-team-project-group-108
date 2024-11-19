import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';

/**
 * React custom hook that navigates a user to the homepage if they try to access a page only accessibly for moderators.
 */
const useModNavigationPrivileges = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const modStatus = user.isModerator;

  if (!modStatus) {
    navigate('/home');
  }
};

export default useModNavigationPrivileges;
