import { useEffect, useState } from 'react';
import { Answer } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle endorsing an answer.
 *
 * @returns endorse - Whether the answer is currently endorsed
 * @returns setEndorsed - Function to update the endorsement status
 */

const useAnswerEndorsement = ({ answer }: { answer: Answer }) => {
  const { socket } = useUserContext();
  const [endorse, setEndorsed] = useState<boolean>(false);

  useEffect(() => {
    const getEndorsedValue = () => answer.endorsed;

    setEndorsed(getEndorsedValue());
  }, [answer, socket]);

  return {
    endorse,
    setEndorsed,
  };
};

export default useAnswerEndorsement;
