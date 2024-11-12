import { useEffect, useState } from 'react';
import { Answer, Question } from '../types';
import useUserContext from './useUserContext';
import { deleteReported, getUnresolvedReport } from '../services/reportService';

/**
 * Custom hook for managing the modApplicationPage, navigation, and real-time updates.
 *
 * @returns applications - The current list of applications in the database.
 * @returns err - The current error statement value.
 * @returns handleApplicationDecision - Function to handle the acceptance or rejection of an application.
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
        setQReports(resQ as Question[]);
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
          const aReports = 'reports' in a ? a.reports.length : 0;
          const bReports = 'reports' in b ? b.reports.length : 0;
          return bReports - aReports;
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
    isAccepted: boolean,
  ) => {
    try {
      const { _id: postId } = reportedPost;
      console.log(postId, reportType);
      if (isAccepted === true) {
        if (postId !== undefined) {
          if (reportType === 'question' && 'askedBy' in reportedPost) {
            const removedQ = await deleteReported(postId, reportType);
            if (!removedQ) {
              setErr('Error removing question');
            }
            const { askedBy } = reportedPost;
            console.log(askedBy);
            // give user +1 warnings
            setQReports(prev => prev.filter(r => r._id !== postId));
          } else if (reportType === 'answer' && 'ansBy' in reportedPost) {
            const removedAns = await deleteReported(postId, reportType);
            if (!removedAns) {
              setErr('Error removing answer');
            }
            const { ansBy } = reportedPost;
            // give user +1 warnings
            setAnsReports(prev => prev.filter(r => r.answer._id !== postId));
          }
        } else {
          setErr('Invalid post id');
        }
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
