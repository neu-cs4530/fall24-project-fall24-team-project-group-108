import useUserContext from './useUserContext';

const useModStatus = () => {
  const { user } = useUserContext();

  const moderatorStatus = user.isModerator;

  return {
    moderatorStatus,
  };
};

export default useModStatus;
