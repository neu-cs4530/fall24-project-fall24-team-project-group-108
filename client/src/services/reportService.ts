import api from './config';
import { Answer, Question, UserReport } from '../types';

const USERREPORT_API_URL = `${process.env.REACT_APP_SERVER_URL}/userReport`;

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
interface AddReportRequestBody {
  id?: string;
  type: 'question' | 'answer';
  report: UserReport;
}

interface ResolveReportedRequest {
  reportedPost: Question | Answer;
  qid: string;
  postId: string;
  type: 'question' | 'answer';
  isRemoved: boolean;
}

/**
 * Adds a new report to a specific question or answer.
 *
 * @param id - The ID of the question/answer to which the report is being added.
 * @param type - The type of the report, either 'question' or 'answer'.
 * @param report - The report object containing the report details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addReport = async (
  id: string,
  type: 'question' | 'answer',
  report: UserReport,
): Promise<UserReport> => {
  const reqBody: AddReportRequestBody = {
    id,
    type,
    report,
  };
  const res = await api.post(`${USERREPORT_API_URL}/addReport`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while adding the report');
  }
  return res.data;
};

/**
 * Gets unresolved reports in the database.
 *
 * @returns A list of all the unresolved reported Question or Answer documents in the database.
 */
const getUnresolvedReport = async (type: 'question' | 'answer'): Promise<Question[]> => {
  const res = await api.get(`${USERREPORT_API_URL}/getUnresolvedReport`, {
    params: { type },
  });
  if (res.status !== 200) {
    throw new Error('Error while retrieving mod applications');
  }
  return res.data;
};

/**
 * Resolves a reported question or answer in the database.
 *
 * @param reportedPost - The id of the question or answer that will be deleted.
 * @param postId - The ID of the question/answer to which the report is being added.
 * @param type - The type of the report, either 'question' or 'answer'.
 * @param isRemoved - The id of the question or answer that will be deleted.
 *
 * @returns A boolean which evaluates to true if an object was resolved, and false if there was an error.
 */
const resolveReport = async (
  reportedPost: Question | Answer,
  qid: string,
  postId: string,
  type: 'question' | 'answer',
  isRemoved: boolean,
): Promise<boolean> => {
  const reqBody: ResolveReportedRequest = {
    reportedPost,
    qid,
    postId,
    type,
    isRemoved,
  };
  const res = await api.post(`${USERREPORT_API_URL}/resolveReport`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while resolving report');
  }
  return res.data;
};

export { addReport, getUnresolvedReport, resolveReport };
