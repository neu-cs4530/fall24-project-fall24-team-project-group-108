import useUserContext from './useUserContext';

/**
 * React custom hook that returns the moderator status of the current user.
 */
const useModStatus = () => {
  const { user } = useUserContext();

  const moderatorStatus = user.isModerator;

  return {
    moderatorStatus,
  };
};

export default useModStatus;
