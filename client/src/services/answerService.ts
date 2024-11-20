import { Answer, User } from '../types';
import api from './config';
import useUserContext from '../hooks/useUserContext';

const ANSWER_API_URL = `${process.env.REACT_APP_SERVER_URL}/answer`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addAnswer = async (qid: string, ans: Answer): Promise<Answer> => {
  const data = { qid, ans };

  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new answer');
  }
  return res.data;
};

/**
 * Function to endorse an answer.
 *
 * @param qid - The ID of the question to which the answer belongs.
 * @param aid - The ID of the answer to endorse.
 * @param endorsed - Whether that question is endorsed or not.
 * @param user - The user making the endorsement request.
 * @throws Error if there is an issue endorsing the answer.
 */
const endorseAnswer = async (qid: string, aid: string, endorsed: boolean, user: User) => {
  const data = { qid, aid, endorsed, user };
  const res = await api.patch(`${ANSWER_API_URL}/endorseAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while endorsing the answer');
  }
  return res.data;
};

export { addAnswer, endorseAnswer };
