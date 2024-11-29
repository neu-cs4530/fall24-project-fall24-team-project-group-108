import { useEffect, useState } from 'react';
import { Answer, Question } from '../types';
import useUserContext from './useUserContext';
import { getUnresolvedReport, resolveReport } from '../services/reportService';

/**
 * Custom hook for managing the reportReviewPage, navigation, and real-time updates.
 *
 * @returns allReports - All Questions/Answers that have a report on them, sorted by number of reports.
 * @returns err - Error message to display to mod.
 * @returns reportsVisible - Current value of report visibility, true renders reports list, false does not.
 * @returns handleApplicationDecision - Function to handle the acceptance or rejection of an application.
 * @returns handleReportVisible - Function to handle changing the report visibility value.
 *
 */
const useReportReviewPage = () => {
  const [qReports, setQReports] = useState<Question[]>([]);
  const [ansReports, setAnsReports] = useState<{ answer: Answer; qid: string }[]>([]);
  const [allReports, setAllReports] = useState<(Question | { answer: Answer; qid: string })[]>([]);
  const [err, setErr] = useState<{ [key: string]: string }>({});
  const [reportsVisible, setReportsVisibile] = useState<{ [key: string]: boolean }>({});
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
      } catch (error) {
        throw new Error('Error fetching data');
      }
    };

    fetchData().catch();
  }, [ansReports, qReports]);

  const handleReportDecision = async (
    reportedPost: Question | Answer,
    qid: string,
    reportType: 'question' | 'answer',
    isPostRemoved: boolean,
  ) => {
    try {
      const { _id: postId } = reportedPost;
      if (postId !== undefined) {
        if (isPostRemoved === true) {
          await resolveReport(reportedPost, qid, postId, reportType, true);
        } else if (isPostRemoved === false) {
          await resolveReport(reportedPost, qid, postId, reportType, false);
        }
        if (reportType === 'question') {
          setQReports(prev => prev.filter(r => r._id !== postId));
        } else if (reportType === 'answer') {
          setAnsReports(prev => prev.filter(r => r.answer._id !== postId));
        }
      }
    } catch (error) {
      const { _id: postId } = reportedPost;
      if (postId !== undefined) {
        setErr(prev => ({ ...prev, [postId]: 'Error resolving report' }));
      }
    }
  };

  const handleReportVisible = (objId: string) => {
    setReportsVisibile(prev => ({
      ...prev,
      [objId]: !prev[objId],
    }));
  };

  useEffect(() => {
    const handleReportsUpdate = ({
      result,
      type,
    }: {
      result: Question | Answer;
      type: 'question' | 'answer';
    }) => {
      if (type === 'question') {
        const questionResult = result as Question;

        setQReports(prev => {
          const updatedReports = prev.filter(q => q._id !== questionResult._id);
          return [...updatedReports, questionResult];
        });
      } else if (type === 'answer') {
        const answerResult = result as Answer;
        setAnsReports(prev =>
          prev.map(report =>
            report.answer._id === answerResult._id
              ? {
                  answer: {
                    ...answerResult,
                    qid: report.qid,
                  },
                  qid: report.qid,
                }
              : report,
          ),
        );
      }
    };

    socket.on('userReportsUpdate', handleReportsUpdate);

    return () => {
      socket.off('userReportsUpdate', handleReportsUpdate);
    };
  }, [socket]);

  return {
    allReports,
    err,
    reportsVisible,
    handleReportDecision,
    handleReportVisible,
  };
};

export default useReportReviewPage;
