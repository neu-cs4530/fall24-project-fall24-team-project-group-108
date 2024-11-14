import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';

/**
 * Custom hook to send a user to the ban page if they try to access any other page while they have
 * more than three infractions on their account.
 */
const useBan = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const numInfractions = user.infractions.length;

  if (numInfractions >= 3) {
    console.log(numInfractions);
    navigate('/ban');
  }
};

export default useBan;
