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
 * Deletes a reported question or answer in the database.
 *
 * @param id - The id of the question or answer that will be deleted.
 *
 * @returns A boolean which evaluates to true if an object was deleted, and false if there was an error.
 */
const deleteReported = async (postId: string, type: 'question' | 'answer'): Promise<boolean> => {
  console.log(postId, type);
  const res = await api.delete(`${USERREPORT_API_URL}/deleteReport`, {
    data: { postId, type },
  });
  if (res.status !== 200) {
    throw new Error('Error while deleting report');
  }
  return res.data;
};

export { addReport, getUnresolvedReport, deleteReported };
