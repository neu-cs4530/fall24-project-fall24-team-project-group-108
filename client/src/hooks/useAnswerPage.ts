import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Comment, Answer, Question, VoteData } from '../types';
import useUserContext from './useUserContext';
import addComment from '../services/commentService';
import { getQuestionById } from '../services/questionService';
import updateBadgeProgress from '../services/badgeProgressService';
import { resolveReport } from '../services/reportService';

/**
 * Custom hook for managing the answer page's state, navigation, and real-time updates.
 *
 * @returns questionID - The current question ID retrieved from the URL parameters.
 * @returns question - The current question object with its answers, comments, and votes.
 * @returns handleNewComment - Function to handle the submission of a new comment to a question or answer.
 * @returns handleNewAnswer - Function to navigate to the "New Answer" page
 */
const useAnswerPage = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user, socket } = useUserContext();
  const [numAnswers, setNumAnswers] = useState<number>(0);
  const [questionID, setQuestionID] = useState<string>(qid || '');
  const [question, setQuestion] = useState<Question | null>(null);

  /**
   * Function to handle navigation to the "New Answer" page.
   */
  const handleNewAnswer = () => {
    navigate(`/new/answer/${questionID}`);
  };

  useEffect(() => {
    if (!qid) {
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Function to handle the submission of a new comment to a question or answer.
   *
   * @param comment - The comment object to be added.
   * @param targetType - The type of target being commented on, either 'question' or 'answer'.
   * @param targetId - The ID of the target being commented on.
   */
  const handleNewComment = async (
    comment: Comment,
    targetType: 'question' | 'answer',
    targetId: string | undefined,
  ) => {
    try {
      if (targetId === undefined) {
        throw new Error('No target ID provided.');
      }

      await addComment(targetId, targetType, comment);

      // update the user's progress towards comment related badges
      await updateBadgeProgress(user.username, 'comments');
    } catch (e) {
      throw new Error('Error fetching data');
    }
  };

  const handleReportDecision = async (
    reportedPost: Question | Answer,
    reportType: 'question' | 'answer',
  ) => {
    try {
      const { _id: postId } = reportedPost;
      if (postId !== undefined) {
        await resolveReport(reportedPost, questionID, postId, reportType, true);

        if (reportType === 'question') {
          navigate('/home');
        }
      } else {
        throw new Error('Invalid post id');
      }
    } catch (error) {
      throw new Error('Error deleting post');
    }
  };

  const wasQReported = (q: Question) => {
    const wasReport = q.reports.some(r => r.reportBy === user.username && r.status !== 'dismissed');
    return wasReport;
  };

  const wasAnsReported = (ans: Answer) => {
    const wasReport = ans.reports.some(
      r => r.reportBy === user.username && r.status !== 'dismissed',
    );
    return wasReport;
  };

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getQuestionById(questionID, user.username);
        setQuestion(res || null);
        if (res && res.answers) {
          setNumAnswers(res.answers.filter(ans => !ans.isRemoved).length);
        }
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    fetchData().catch();
  }, [questionID, user.username]);

  useEffect(() => {
    /**
     * Function to handle updates to the answers of a question.
     *
     * @param answer - The updated answer object.
     */
    const handleAnswerUpdate = ({ qid: id, answer }: { qid: string; answer: Answer }) => {
      if (id === questionID) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Creates a new Question object with the new answer appended to the end
              { ...prevQuestion, answers: [...prevQuestion.answers, answer] }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the comments of a question or answer.
     *
     * @param result - The updated question or answer object.
     * @param type - The type of the object being updated, either 'question' or 'answer'.
     */
    const handleCommentUpdate = ({
      result,
      type,
    }: {
      result: Question | Answer;
      type: 'question' | 'answer';
    }) => {
      if (type === 'question') {
        const questionResult = result as Question;

        if (questionResult._id === questionID) {
          setQuestion(questionResult);
        }
      } else if (type === 'answer') {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answers with a matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers.map(a =>
                  a._id === result._id ? (result as Answer) : a,
                ),
              }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the views of a question.
     *
     * @param q The updated question object.
     */
    const handleViewsUpdate = (q: Question) => {
      if (q._id === questionID) {
        setQuestion(q);
      }
    };

    /**
     * Function to handle vote updates for a question.
     *
     * @param voteData - The updated vote data for a question
     */
    const handleVoteUpdate = (voteData: VoteData) => {
      if (voteData.qid === questionID) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? {
                ...prevQuestion,
                upVotes: [...voteData.upVotes],
                downVotes: [...voteData.downVotes],
              }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle removing a post.
     *
     * @param qid - The unique id of the question.
     * @param updatedPost - The updated post.
     */
    const handleRemovePostUpdate = ({
      qid: id,
      updatedPost,
    }: {
      qid: string;
      updatedPost: Question | Answer;
    }) => {
      if (id === questionID && 'ansBy' in updatedPost) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? {
                ...prevQuestion,
                answers: prevQuestion.answers.filter(ans => ans._id !== updatedPost._id),
              }
            : prevQuestion,
        );
      } else if (id === questionID && 'askedBy' in updatedPost) {
        navigate('/home');
      }
    };

    /**
     * Function to handle removing a post.
     *
     * @param qid - The unique id of the question.
     * @param updatedPost - The updated post.
     */
    const handleReportDismissedUpdate = ({
      qid: id,
      updatedPost,
    }: {
      qid: string;
      updatedPost: Question | Answer;
    }) => {
      if (id === questionID && 'ansBy' in updatedPost) {
        setQuestion(prev =>
          prev
            ? {
                ...prev,
                answers: prev.answers.map(ans =>
                  ans._id === updatedPost._id
                    ? {
                        ...ans,
                        reports: ans.reports.map(r =>
                          r.status !== 'dismissed' ? { ...r, status: 'dismissed' } : r,
                        ),
                      }
                    : ans,
                ),
              }
            : prev,
        );
      } else if (id === questionID && 'askedBy' in updatedPost) {
        setQuestion(prev =>
          prev
            ? {
                ...prev,
                reports: prev.reports.map(r =>
                  r.status !== 'dismissed' ? { ...r, status: 'dismissed' } : r,
                ),
              }
            : prev,
        );
      }
    };

    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);
    socket.on('commentUpdate', handleCommentUpdate);
    socket.on('voteUpdate', handleVoteUpdate);
    socket.on('removePostUpdate', handleRemovePostUpdate);
    socket.on('reportDismissedUpdate', handleReportDismissedUpdate);

    return () => {
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
      socket.off('commentUpdate', handleCommentUpdate);
      socket.off('voteUpdate', handleVoteUpdate);
      socket.off('removePostUpdate', handleRemovePostUpdate);
      socket.off('reportDismissedUpdate', handleReportDismissedUpdate);
    };
  }, [questionID, socket, navigate]);

  return {
    questionID,
    question,
    numAnswers,
    handleNewComment,
    handleNewAnswer,
    handleReportDecision,
    wasQReported,
    wasAnsReported,
  };
};

export default useAnswerPage;
