import { Question } from '../types';
import api from './config';

const QUESTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/question`;

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @param askedBy - The user to filter questions by. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
  askedBy: string = '',
): Promise<Question[]> => {
  const res = await api.get(
    `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}&askedBy=${askedBy}`,
  );
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering questions');
  }
  return res.data;
};

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @param askedBy - The user to filter questions by. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionByAnswerer = async (answeredBy: string = ''): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionByAnswerer/${answeredBy}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering questions');
  }
  return res.data;
};

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @param askedBy - The user to filter questions by. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionByCommenter = async (commentBy: string = ''): Promise<Question[]> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionByCommenter/${commentBy}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching questions including commenter');
  }
  return res.data;
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @param username - The username of the user requesting the question.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getQuestionById = async (qid: string, username: string): Promise<Question> => {
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addQuestion = async (q: Question): Promise<Question> => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new question');
  }

  return res.data;
};

/**
 * Function to upvote a question.
 *
 * @param qid - The ID of the question to upvote.
 * @param username - The username of the person upvoting the question.
 * @throws Error if there is an issue upvoting the question.
 */
const upvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while upvoting the question');
  }
  return res.data;
};

/**
 * Function to downvote a question.
 *
 * @param qid - The ID of the question to downvote.
 * @param username - The username of the person downvoting the question.
 * @throws Error if there is an issue downvoting the question.
 */
const downvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);
  if (res.status !== 200) {
    throw new Error('Error while downvoting the question');
  }
  return res.data;
};

/**
 * Function to update tag leaderboard progress when a user answers a question.
 *
 * @param user - The name of the user who answered the question.
 * @param qid - The id of the question being answered.
 * @throws Error if there is an issue posting the updated data.
 */
const updateTagProgress = async (user: string, qid: string): Promise<void> => {
  const res = await api.post(`${QUESTION_API_URL}/updateTagProgress?user=${user}&qid=${qid}`);
  if (res.status !== 200) {
    throw new Error(`Error when updating tag data.`);
  }
  return res.data;
};

export {
  getQuestionsByFilter,
  getQuestionById,
  addQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getQuestionByAnswerer,
  getQuestionByCommenter,
  updateTagProgress,
};
