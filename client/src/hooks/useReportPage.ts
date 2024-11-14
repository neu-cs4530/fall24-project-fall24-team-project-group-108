import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { UserReport } from '../types';
import { addReport } from '../services/reportService';

/**
 * Custom hook for managing the report page's state, navigation, and real-time updates.
 *
 * @returns text - The supplemental text provided by the user about their report.
 * @returns setText - Function to handle setting the text from the input.
 * @returns reportErr - Value of the error.
 * @returns handleNewReport - Function to handle the submission of a new report to a question or answer.
 *
 */
const useReportPage = () => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [reportErr, setReportErr] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Function to handle the submission of a new report to a question or answer.
   *
   * @param targetType - The type of target being commented on, either 'question' or 'answer'.
   * @param targetId - The ID of the target being commented on.
   * @param targetLink - the link that can be used for navigating to the Question/Answer by clicking on it's text.
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
        status: 'unresolved',
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
