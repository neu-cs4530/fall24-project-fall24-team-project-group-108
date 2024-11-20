import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  Answer,
  AnswerResponse,
  Badge,
  BadgeProgressResponse,
  BadgeResponse,
  Comment,
  CommentResponse,
  ModApplication,
  ModApplicationResponse,
  ModApplicationResponses,
  OrderType,
  Question,
  QuestionResponse,
  Tag,
  TagAnswerCountResponse,
  User,
  UserResponse,
  Message,
  Correspondence,
  MessageResponse,
  CorrespondenceResponse,
  UploadedFile,
  UploadedFileResponse,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import MessageModel from './message';
import CorrespondenceModel from './correspondence';
import TagModel from './tags';
import CommentModel from './comments';
import BadgeModel from './badges';
import UserModel from './users';
import UploadedFileModel from './uploadedFile';
import ModApplicationModel from './modApplication';
import BadgeProgressModel from './badgeProgresses';
import TagAnswerCountModel from './tagAnswerCounts';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Adds a user to the database if they do not already exist.
 *
 * @param user - the user to add
 *
 * @returns {Promise<User | null>} - The added or existing user, or `null` if an error occurred
 */
export const addUser = async (user: User): Promise<User | null> => {
  try {
    // Check if a user with the given id already exists
    const existingUser = await UserModel.findOne({ username: user.username });

    if (existingUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(user.password, 5);
    // If the user does not exist, create a new one
    const newUser = new UserModel({ ...user, password: hashedPassword });
    const savedUser = await newUser.save();

    return savedUser as User;
  } catch (error) {
    return null;
  }
};

/**
 * Authenticates a user by checking their input username and password and checking the database for it.
 *
 * @param username - The input username.
 * @param password - The input password.
 *
 * @returns {Promise<boolean>} - Return true if the username and password are in the database, otherwise false.
 */
export const findUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return null;
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
};

/**
 * Adds a mod application to the database using the information of the application provided by a user.
 *
 * @param user - the user who created the application.
 * @param applicationText - the additional information given in the application.
 *
 * @returns {Promise<ModApplication | null>} - The added or existing mod application, or `null` if an error occurred
 */
export const addModApplication = async (
  username: string,
  applicationText: string,
): Promise<ModApplicationResponse> => {
  try {
    const existingApplication = await ModApplicationModel.findOne({
      username,
      status: { $ne: true },
    });
    if (existingApplication) {
      return { error: 'User already created an application request' };
    }

    const savedApplication = await ModApplicationModel.create({ username, applicationText });
    return savedApplication as ModApplication;
  } catch (error) {
    return { error: 'Error when saving the mod application' };
  }
};

/**
 * Retrieves all of the moderator applications in the database.
 *
 * @returns {ModApplication[]} - A list of the current active ModApplications.
 */
export const fetchModApplications = async (): Promise<ModApplicationResponses> => {
  try {
    const applications = await ModApplicationModel.find();
    return applications;
  } catch (error) {
    return { error: 'Error when saving the mod application' };
  }
};

/**
 * Updates a user to make their isModerator value equal to true.
 *
 * @param username - The username of the user being updated in the db.
 * @returns {User} - The updated user object.
 */
export const updatePassword = async (username: string, password: string): Promise<UserResponse> => {
  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $set: { password: hashedPassword } },
      { new: true },
    );
    if (result === null) {
      throw new Error(`Failed to reset password`);
    }
    return result;
  } catch (error) {
    return { error: `Error when reseting password: ${(error as Error).message}` };
  }
};

/**
 * Updates a user to make their isModerator value equal to true.
 *
 * @param username - The username of the user being updated in the db.
 * @returns {User} - The updated user object.
 */
export const populateUser = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $set: { isModerator: true } },
      { new: true },
    );
    if (result === null) {
      throw new Error(`Failed to fetch and populate a user`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Removes a specificed moderator application from the db.
 *
 * @param username - the username of the user's application being deleted
 * @returns {ModApplication} - the application object being deleted.
 */
export const removeModApplication = async (username: string): Promise<boolean> => {
  try {
    const result = await ModApplicationModel.findOneAndDelete({ username });
    if (!result) {
      throw new Error(`No application found`);
    }
    return true;
  } catch (error) {
    throw new Error(`Error when deleting the application: ${(error as Error).message}`);
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

//  * Retrieves messages from the database, ordered by the specified criteria.
//  *
//  * @param {OrderType} order - The order type to filter the messages
//  *
//  * @returns {Promise<Message[]>} - Promise that resolves to a list of ordered messages
//  */
export const getMessagesByOrder = async (order: OrderType): Promise<Message[]> => {
  const mlist = await MessageModel.find();
  return mlist;
};
/**
 * Retrieves correspondences from the database, ordered by the specified criteria.
 *
 *
 * @returns {Promise<Correspondence[]>} - Promise that resolves to a list of ordered correspondences
 */
export const getCorrespondencesByOrder = async (): Promise<Correspondence[]> => {
  const clist = await CorrespondenceModel.find().populate([
    { path: 'messages', model: MessageModel },
  ]);
  return clist;
};
/**
 * Retrieves a list of all users in the db in alphabetical order
 *
 *
 * @returns {Promise<User[]>} - Promise that resolves to a list of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  console.log('Start UserModel.find()');
  const ulist = await UserModel.find();
  console.log('End UserModel.find()');
  console.log(ulist);
  ulist.sort((user1, user2) => user1.username.toLowerCase().localeCompare(user2.username.toLowerCase()))
  return ulist;
};
/**
 * Retrieves questions from the database that were answered by the given user.
 *
 * @param string answerer - The answerer to filter the questions by
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const filterQuestionsByAnswerer = async (answerer: string): Promise<Question[]> => {
  try {
    // find all answers from the given user
    const alist = await AnswerModel.find({ ansBy: answerer });

    // find all questions that are linked to the answers
    const answerIds = alist.map(answer => answer._id);
    const qlist = await QuestionModel.find({ answers: { $in: answerIds } });

    return qlist;
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a question, answer, message, or correspondence document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question, answer, message, or correspondence
 *
 * @returns {Promise<QuestionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated resposne, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer', // | 'message' | 'correspondence',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error('Provided ID is undefined.');
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } },
      { new: true },
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Fetches a message by its ID and increments its view count.
 *
 * @param {string} mid - The ID of the message to fetch.
 * @param {string} username - The username of the user requesting the message.
 *
 * @returns {Promise<MessageResponse | null>} - Promise that resolves to the fetched message
 *          with incremented views, null if the message is not found, or an error message.
 */
export const fetchAndIncrementMessageViewsById = async (
  mid: string,
  username: string,
): Promise<MessageResponse | null> => {
  try {
    const m = await MessageModel.findOneAndUpdate(
      { _id: new ObjectId(mid) },
      { $addToSet: { views: username } },
      { new: true },
    );
    return m;
  } catch (error) {
    return { error: 'Error when fetching and updating a message' };
  }
};

/**
 * Fetches a correspondence by its ID and increments its view count.
 *
 * @param {string} cid - The ID of the correspondence to fetch.
 * @param {string} username - The username of the user requesting the correspondence.
 *
 * @returns {Promise<CorrespondenceResponse | null>} - Promise that resolves to the fetched correspondence
 *          with incremented views, null if the correspondence is not found, or an error message.
 */
export const fetchAndIncrementCorrespondenceViewsById = async (
  cid: string,
  username: string,
): Promise<CorrespondenceResponse | null> => {
  try {
    const c = await CorrespondenceModel.findOneAndUpdate(
      { _id: new ObjectId(cid) },
      { $addToSet: { views: username } },
      { new: true },
    );
    return c;
  } catch (error) {
    return { error: 'Error when fetching and updating a message' };
  }
};

/**
 * Fetches a correspondence by its ID
 *
 * @param {string} cid - The ID of the correspondence to fetch.
 *
 * @returns {Promise<CorrespondenceResponse | null>} - Promise that resolves to the fetched correspondence,
 *                                           null if the correspondence is not found, or an error message.
 */
export const fetchCorrespondenceById = async (
  cid: string,
): Promise<CorrespondenceResponse | null> => {
  try {
    console.log('Start fetchCorerspondenceById');
    console.log(cid);
    console.log(new ObjectId(cid));
    const c = await CorrespondenceModel.findOne(
      { _id: new ObjectId(cid) },
    );
    console.log('End fetchCorerspondenceById');
    console.log(c);
    return c;
  } catch (error) {
    return { error: 'Error when fetching a correspondence' };
  }
};

/**
 * Fetches an uploaded file by its ID
 *
 * @param {string} ufid - The ID of the uploaded file to fetch.
 *
 * @returns {Promise<UploadedFileResponse | null>} - Promise that resolves to the fetched uploaded file,
 *                                           null if the uploaded file is not found, or an error message.
 */
export const fetchUploadedFileById = async (
  ufid: string,
): Promise<UploadedFileResponse | null> => {
  try {
    const uf = await UploadedFileModel.findOne(
      { _id: new ObjectId(ufid) },
    );
    return uf;
  } catch (error) {
    return { error: 'Error when fetching an uploaded file' };
  }
};

/**
 * Fetches a list of all the uploaded files
 *
 *
 * @returns {Promise<UploadedFileResponse | null>} - Promise that resolves to the fetched uploaded files,
 *                                           null if the uploaded files are not found, or an error message.
 */
export const fetchUploadedFiles = async (
): Promise<UploadedFileResponse[]> => {
  const uflist = await UploadedFileModel.find();
  return uflist;
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message, or error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    // if (message.file) {
    //   const uploadedFileResult = await saveUploadedFile(message.file);
    // }
    console.log('At saveMessage MessageModel');
    console.log(message);
    const result = await MessageModel.create(message);
    console.log('End saveMessage MessageModel');
    console.log(result);
    return result;
  } catch (error) {
    return { error: 'Error when saving a message' };
  }
};

/**
 * Saves a new correspondence to the database.
 *
 * @param {Correspondence} correspondence - The correspondence to save
 *
 * @returns {Promise<CorrespondenceResponse>} - The saved correspondence, or error message
 */
export const saveCorrespondence = async (
  correspondence: Correspondence,
): Promise<CorrespondenceResponse> => {
  try {
    const result = await CorrespondenceModel.create(correspondence);
    return result;
  } catch (error) {
    return { error: 'Error when saving a correspondence' };
  }
};

/**
 * Saves a new uploaded file to the database.
 *
 * @param {UploadedFile} uploadedFile - The uploaded file to save
 *
 * @returns {Promise<UploadedFileResponse>} - The saved uploaded file, or error message
 */
export const saveUploadedFile = async (
  uploadedFile: UploadedFile,
): Promise<UploadedFileResponse> => {
  try {
    console.log('At saveUploadedFile UploadedFileModel');
    console.log(uploadedFile);
    const result = await UploadedFileModel.create(uploadedFile);
    console.log('At saveUploadedFile UploadedFileModel');
    console.log(result);
    return result;
  } catch (error) {
    return { error: 'Error when saving a correspondence' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Saves a new badge to the database.
 *
 * @param {Badge} badge - The badge to save
 *
 * @returns {Promise<BadgeResponse>} - The saved badge, or error message
 */
export const saveBadge = async (badge: Badge): Promise<BadgeResponse> => {
  try {
    const result = await BadgeModel.create(badge);
    return result;
  } catch (error) {
    return { error: 'Error when saving a badge' };
  }
};

/**
 * Retrieves all badges from the database.
 *
 * @returns {Promise<Badge[]>} - Promise that resolves to a list of badges
 */
export const getAllBadges = async (): Promise<Badge[]> => {
  try {
    const badges = await BadgeModel.find().exec();
    return badges;
  } catch (error) {
    return [];
  }
};

/**
 * Retrieves all badges earned from a user from the database.
 *
 * @returns {Promise<Badge[]>} - Promise that resolves to a list of badges
 */
export const getBadgesByUser = async (username: string): Promise<Badge[]> => {
  try {
    // find all badgeProgresses where the user has hit the targetValue
    const badgeProgresses = await BadgeProgressModel.aggregate([
      {
        $match: {
          user: username,
          $expr: { $gte: ['$currentValue', '$targetValue'] },
        },
      },
    ]);

    // find the badges that correspond to this badgeprogress
    const badgeIds = badgeProgresses.map(progress => progress.badge);
    const badges = await BadgeModel.find({
      _id: { $in: badgeIds },
    });

    return badges;
  } catch (error) {
    return [];
  }
};

/**
 * Retrieves all users who have earned a given badge.
 *
 * @returns {Promise<String[]>} - Promise that resolves to a list of usernames
 */
export const getBadgeUsers = async (badgeName: string): Promise<string[]> => {
  try {
    const badge = await BadgeModel.findOne({ name: badgeName });

    // return empty array if error
    if (!badge || !badge.users || badge.users.length === 0) {
      return [];
    }

    // map users to usernames
    const userIds = badge.users;
    const users = await UserModel.find({ _id: { $in: userIds } }).select('username');
    const usernames = users.map(user => user.username);
    return usernames;
  } catch (error) {
    return [];
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param username The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  username: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(username)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(username)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a message to a correspondence.
 *
 * @param {string} cid - The ID of the correspondence to add a message to
 * @param {Message} message - The message to add
 *
 * @returns Promise<CorrespondenceResponse> - The updated correspondence or an error message
 */
export const addMessageToCorrespondence = async (
  cid: string,
  message: Message,
): Promise<CorrespondenceResponse> => {
  try {
    if (
      !message ||
      !message.messageText ||
      !message.messageBy ||
      !message.messageTo ||
      !message.messageDateTime
    ) {
      throw new Error('Invalid message');
    }
    const result = await CorrespondenceModel.findOneAndUpdate(
      { _id: cid },
      { $push: { messages: { $each: [message._id] } } , $set: {views: message.views}},
      { new: true },
    ).populate([{ path: 'messages', model: MessageModel }]);
    if (result === null) {
      throw new Error('Error when adding message to correspondence');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding message to correspondence' };
  }
};

/**
 * Adds an uploaded file to a message.
 *
 * @param {string} mid - The ID of the message to add a uploaded file to
 * @param {UploadedFile} uploadedFile - The uploaded file to add
 *
 * @returns Promise<MessageResponse> - The updated message or an error message
 */
export const addUploadedFileToMessage = async (
  mid: string,
  uploadedFile: UploadedFile,
): Promise<MessageResponse> => {
  try {
    if (
      !uploadedFile ||
      !uploadedFile.fileName ||
      !uploadedFile.size ||
      !uploadedFile.data
    ) {
      throw new Error('Invalid uploaded file');
    }
    console.log('Start MessageModel');
    console.log(mid);
    console.log(uploadedFile);
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $set: { file: uploadedFile._id } },
      { new: true },
    ).populate([{ path: 'uploadedFiles', model: UploadedFileModel }]);
    if (result === null) {
      throw new Error('Error when adding uploaded file to message');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding uploaded file to message' };
  }
};


/**
 * Updates a correspondence for the given id.
 *
 * @param {string} cid - The ID of the correspondence to update
 * @param {string[]} updatedMessageMembers - The updated list of members in the correspondence
 *
 * @returns Promise<CorrespondenceResponse> - The updated correspondence or an error message
 */
export const updateCorrespondenceById = async (
  cid: string,
  updatedMessageMembers: string[],
): Promise<CorrespondenceResponse> => {
  try {
    const result = await CorrespondenceModel.findOneAndUpdate(
      { _id: cid },
      { $set: { messageMembers: [...updatedMessageMembers] } },
    ).populate([{ path: 'messages', model: MessageModel }]);
    if (result === null) {
      throw new Error('Error when updating correspondence');
    }
    return result;
  } catch (error) {
    return { error: 'Error when updating correspondence' };
  }
};


/**
 * Updates a correspondence for the given id.
 *
 * @param {string} cid - The ID of the correspondence to update
 * @param {string[]} userTyping - A list of usernames who are typing
 *
 * @returns Promise<CorrespondenceResponse> - The updated correspondence or an error message
 */
 export const updateCorrespondenceUserTypingById = async (cid: string, userTyping: string[]): Promise<CorrespondenceResponse> => {
  try {
    const result = await CorrespondenceModel.findOneAndUpdate(
      { _id: cid },
      { $set: { userTyping: userTyping } },
      { new: true }
    ).populate([
      { path: 'messages', model: MessageModel },
    ]);
    console.log('End Correspondence Model');
    console.log(result);
    if (result === null) {
      throw new Error('Error when updating correspondence');
    }
    return result;
  } catch (error) {
    return { error: 'Error when updating correspondence' };
  }
};

/**
 * Updates a correspondence for the given id.
 *
 * @param {string} cid - The ID of the correspondence to update
 * @param {string} username - The username to add to the people who have viewed the competition
 *
 * @returns Promise<CorrespondenceResponse> - The updated correspondence or an error message
 */
 export const updateCorrespondenceViewsById = async (cid: string, username: string): Promise<CorrespondenceResponse> => {
  try {
    const result = await CorrespondenceModel.findOneAndUpdate(
      { _id: cid },
      { $push: { views: username } },
      { new: true }
    ).populate([
      { path: 'messages', model: MessageModel },
    ]);
    console.log('End Correspondence Model');
    console.log(result);
    if (result === null) {
      throw new Error('Error when updating correspondence');
    }
    return result;
  } catch (error) {
    return { error: 'Error when updating correspondence' };
  }
};

/**
 * Updates a message for the given id.
 *
 * @param {string} mid - The ID of the message to update
 * @param {string} username - The username to add to the people who have viewed the message
 *
 * @returns Promise<MessageResponse> - The updated message or an error message
 */
 export const updateMessageViewsById = async (mid: string, username: string): Promise<MessageResponse> => {
  try {
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $addToSet: { views: username } },
      { new: true }
    );
    if (result === null) {
      throw new Error('Error when updating message');
    }
    return result;
  } catch (error) {
    return { error: 'Error when updating message' };
  }
};

/**
 * Updates a message with the updated emojis for the given id.
 *
 * @param {string} mid - The ID of the message to update
 * @param {string} emojis - The username to add to the people who have viewed the message
 *
 * @returns Promise<MessageResponse> - The updated message or an error message
 */
 export const updateMessageEmojisById = async (mid: string, emojis: { [key: string]: string }): Promise<MessageResponse> => {
  try {
    console.log('Start Message Emojis Model');
    console.log(mid);
    console.log(emojis);
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $set: { emojiTracker: {...emojis} } },
      { new: true }
    );
    console.log(result);
    console.log('End Message Emojis Model');
    if (result === null) {
      throw new Error('Error when updating messages emojis');
    }
    return result;
  } catch (error) {
    return { error: 'Error when updating messages emojis' };
  }
};



/**
 * Updates a message for the given id.
 *
 * @param {string} mid - The ID of the message to update
 * @param {string} updatedMessageText - The updated message text for the message
 *
 * @returns Promise<CorrespondenceResponse> - The correspondence with the update message or an error message
 */
export const updateMessageById = async (
  mid: string,
  updatedMessageText: string,
  isCodeStyle: boolean,
): Promise<CorrespondenceResponse> => {
  try {
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $set: { messageText: updatedMessageText, isCodeStyle } },
      { returnDocument: 'after' },
    );
    if (result === null) {
      throw new Error('Error when updating message');
    }

    const updatedCorrespondenceWithMessage = (await CorrespondenceModel.findOne({
      messages: { _id: mid },
    }).populate([{ path: 'messages', model: MessageModel }])) as Correspondence;

    if (!updatedCorrespondenceWithMessage) {
      return { error: 'Error when retrieving updated correspondence' };
    }

    // console.log(updatedCorrespondenceWithMessage);

    return updatedCorrespondenceWithMessage;
  } catch (error) {
    return { error: 'Error when updating message' };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

/**
 * Updates the badgeProgress for a user and a given category.
 *
 * @param {string} username - The username to update
 * @param {category} ans - The category of badge to update
 *
 * @returns Promise<BadgeProgressResponse> - The updated badgeProgress or an error message
 */
export const updateBadgeProgress = async (
  username: string,
  category: string,
): Promise<BadgeProgressResponse> => {
  try {
    const badgeProgresses = await BadgeProgressModel.find({ user: username, category });

    if (badgeProgresses.length === 0) {
      // if no existing badgeProgresses, create new ones for all badges in the given category
      const badges = await BadgeModel.find({ category });

      // create a badgeprogress for all badges
      await Promise.all(
        badges.map(async badge => {
          await BadgeProgressModel.create({
            user: username,
            badge: badge._id,
            category,
            targetValue: badge.targetValue,
            currentValue: 1,
          });
        }),
      );
    } else {
      // loop through all badgeProgresses and increment their values by one
      await Promise.all(
        badgeProgresses.map(async badgeProgress => {
          badgeProgress.currentValue += 1;
          await badgeProgress.save();

          // if the user just acquired the badge,
          // add them to the badge's list
          if (badgeProgress.currentValue === badgeProgress.targetValue) {
            const user = await UserModel.findOne({ username });
            if (user) {
              await BadgeModel.findOneAndUpdate(
                { _id: badgeProgress.badge },
                { $addToSet: { users: user._id } },
                { new: true },
              );
            }
          }
          return badgeProgress;
        }),
      );
    }

    return badgeProgresses;
  } catch (error) {
    return { error: 'Error when updating badge progress' };
  }
};

/**
 * Updates the tagAnswerCounts for a user and a given question.
 *
 * @param {string} user - The username to update
 * @param {string} qid - The id of question to update
 *
 * @returns Promise<void> - The updated badgeProgress or an error message
 */
export const updateTagAnswers = async (
  username: string,
  qid: string,
): Promise<TagAnswerCountResponse> => {
  try {
    // all tags associated with the question
    const question = await QuestionModel.findById(qid).exec();
    if (!question) {
      return { error: 'Question not found' };
    }

    const updatePromises = question.tags.map(async tagId => {
      const tagAnswerCount = await TagAnswerCountModel.findOne({
        user: username,
        tag: tagId,
      }).exec();

      if (tagAnswerCount) {
        // if it exists, update the count
        tagAnswerCount.count += 1;
        return tagAnswerCount.save();
      }
      // create a new TagAnswerCount
      return TagAnswerCountModel.create({
        tag: tagId,
        user: username,
        count: 1,
      });
    });

    await Promise.all(updatePromises);
    return question;
  } catch (error) {
    return { error: 'Error when updating tag progress' };
  }
};
