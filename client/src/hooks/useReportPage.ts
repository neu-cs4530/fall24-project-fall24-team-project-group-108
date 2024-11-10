import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { UserReport } from '../types';
import { addReport } from '../services/reportService';

/**
 * Custom hook for managing the answer page's state, navigation, and real-time updates.
 *
 * @returns questionID - The current question ID retrieved from the URL parameters.
 * @returns question - The current question object with its answers, comments, and votes.
 * @returns handleNewComment - Function to handle the submission of a new comment to a question or answer.
 * @returns handleNewReport - Function to handle the submission of a new report to a question or answer.
 * @returns handleNewAnswer - Function to navigate to the "New Answer" page
 */
const useReportPage = () => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [reportErr, setReportErr] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Function to handle the submission of a new report to a question or answer.
   *
   * @param report - The report object to be added.
   * @param targetType - The type of target being commented on, either 'question' or 'answer'.
   * @param targetId - The ID of the target being commented on.
   */
  const handleNewReport = async (
    targetType: 'question' | 'answer',
    targetId: string | undefined,
    targetLink: string | undefined,
  ) => {
    try {
      if (targetId === undefined) {
        setReportErr('No target ID found');
        return;
      }

      if (targetLink === undefined) {
        setReportErr('No return address found');
        return;
      }

      if (text.trim() === '') {
        setReportErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
        return;
      }

      const newReport: UserReport = {
        text,
        reportBy: user.username,
        reportDateTime: new Date(),
      };

      await addReport(targetId, targetType, newReport);
      setText('');
      setReportErr('');
      navigate(`/question/${targetLink}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding report:', error);
    }
  };

  return {
    text,
    setText,
    reportErr,
    handleNewReport,
  };
};

export default useReportPage;
