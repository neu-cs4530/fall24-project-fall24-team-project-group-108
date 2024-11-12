import { useEffect, useState } from 'react';
import { Answer, Question } from '../types';
import useUserContext from './useUserContext';
import { getUnresolvedReport, resolveReport } from '../services/reportService';

/**
 * Custom hook for managing the reportReviewPage, navigation, and real-time updates.
 *
 * @returns allReports - All Questions/Answers that have a report on them, sorted by number of reports.
 * @returns numReports - The total number of unresolved Questions/Answers with reports.
 * @returns err - Error message to display to mod.
 * @returns reportsVisible - Current value of report visibility, true renders reports list, false does not.
 * @returns handleApplicationDecision - Function to handle the acceptance or rejection of an application.
 * @returns handleReportVisible - Function to handle changing the report visibility value.
 *
 */
const useReportReviewPage = () => {
  const [numReports, setNumReports] = useState<number>(0);
  const [qReports, setQReports] = useState<Question[]>([]);
  const [ansReports, setAnsReports] = useState<{ answer: Answer; qid: string }[]>([]);
  const [allReports, setAllReports] = useState<(Question | { answer: Answer; qid: string })[]>([]);
  const [err, setErr] = useState<string>('');
  const [reportsVisible, setReportsVisibile] = useState<boolean>(false);
  const { socket } = useUserContext();

  // Fetches applications from the database.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // reported questions
        const resQ = await getUnresolvedReport('question');
        // questions with reported answers
        const resAns = await getUnresolvedReport('answer');
        // Questions
        const reportedQuestions = (resQ as Question[]).filter(
          question => question.reports && question.reports.length > 0,
        );
        setQReports(reportedQuestions as Question[]);
        // Questions with reported answers
        const reportedAnswers = (resAns as Question[]).flatMap(question =>
          question.answers
            .filter(
              (answer: Answer) =>
                answer.reports && Array.isArray(answer.reports) && answer.reports.length > 0,
            )
            .map(answer => {
              if (question._id) {
                return { answer, qid: question._id };
              }
              return null;
            })
            .filter(ans => ans !== null),
        );
        setAnsReports(reportedAnswers);

        const mergedReports = [...qReports, ...ansReports].sort((a, b) => {
          const lenReportA = 'reports' in a ? a.reports.length : a.answer.reports.length;
          const lenReportB = 'reports' in b ? b.reports.length : b.answer.reports.length;
          return lenReportB - lenReportA;
        });
        setAllReports(mergedReports);
        const reportedQAns = mergedReports.length;
        setNumReports(reportedQAns);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching reports:', error);
        setErr('Error Fetching Reports');
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [ansReports, qReports]);

  const handleReportDecision = async (
    reportedPost: Question | Answer,
    reportType: 'question' | 'answer',
    isPostRemoved: boolean,
  ) => {
    try {
      const { _id: postId } = reportedPost;
      if (postId !== undefined) {
        if (isPostRemoved === true) {
          const postRemoved = await resolveReport(reportedPost, postId, reportType, true);

          if (postRemoved === false) {
            setErr('Error dismissing report');
          }
        } else if (isPostRemoved === false) {
          const postDismissed = await resolveReport(reportedPost, postId, reportType, false);

          if (postDismissed === false) {
            setErr('Error dismissing report');
          }
        }
        if (reportType === 'question') {
          setQReports(prev => prev.filter(r => r._id !== postId));
        } else if (reportType === 'answer') {
          setAnsReports(prev => prev.filter(r => r.answer._id !== postId));
        }
        setNumReports(prev => prev - 1);
      } else {
        setErr('Invalid post id');
      }
    } catch (error) {
      setErr('Error processing application');
    }
  };

  const handleReportVisible = () => {
    setReportsVisibile(!reportsVisible);
  };

  return {
    allReports,
    numReports,
    err,
    reportsVisible,
    handleReportDecision,
    handleReportVisible,
  };
};

export default useReportReviewPage;
