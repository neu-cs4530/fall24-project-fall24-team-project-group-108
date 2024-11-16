import { useEffect, useState } from 'react';
import { Answer } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle
 *
 * @param
 *
 * @returns
 */

const useAnswerEndorsement = ({ answer }: { answer: Answer }) => {
  const { user, socket } = useUserContext();
  const [endorse, setEndorsed] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Function to get
     *
     * @returns
     */
    const getEndorsedValue = () => {
      if (answer.endorsed) {
        return true;
      }
      return false;
    };

    setEndorsed(getEndorsedValue());
  }, [answer, socket]);

  return {
    endorse,
    setEndorsed,
  };
};

export default useAnswerEndorsement;
