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
  UserReport,
  UserReportResponse,
  UserReportResponses,
  UserResponse,
  Message,
  Correspondence,
  MessageResponse,
  CorrespondenceResponse,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import MessageModel from './message';
import CorrespondenceModel from './correspondence';
import TagModel from './tags';
import CommentModel from './comments';
import BadgeModel from './badges';
import UserModel from './users';
import ModApplicationModel from './modApplication';
import BadgeProgressModel from './badgeProgresses';
import TagAnswerCountModel from './tagAnswerCounts';
import UserReportModel from './userReport';

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
    // username must be unique
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
 * @returns {Promise<User | null>} - The existing user, or `null` if an error occurred
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
 * @returns {Promise<ModApplicationReponse>} - The added or existing mod application, or error if an error occurred
 */
export const addModApplication = async (
  username: string,
  applicationText: string,
): Promise<ModApplicationResponse> => {
  try {
    const acceptedApplication = await ModApplicationModel.findOne({
      username,
      status: 'accepted',
    });
    if (acceptedApplication && acceptedApplication.status === 'accepted') {
      return { error: 'User is already a moderator' };
    }

    const existingApplication = await ModApplicationModel.findOne({
      username,
      status: 'unresolved',
    });
    if (existingApplication && existingApplication.status === 'unresolved') {
      return { error: 'User already created an application request' };
    }

    const newApplication = await ModApplicationModel.create({
      username,
      applicationText,
    });
    return newApplication as ModApplication;
  } catch (error) {
    return { error: 'Error when saving the mod application' };
  }
};

/**
 * Retrieves all of the moderator applications in the database.
 *
 * @returns {ModApplicationResponses} - A list of the current active ModApplications.
 */
export const fetchModApplications = async (): Promise<ModApplicationResponses> => {
  try {
    const applications = await ModApplicationModel.find({ status: 'unresolved' });
    return applications;
  } catch (error) {
    return { error: 'Error when fetching the mod application' };
  }
};

/**
 * Updates a user to make their isModerator value equal to true.
 *
 * @param username - The username of the user being updated in the db.
 * @returns {UserResponse} - The updated user object or error if an error occurred.
 */
export const updateUserModStatus = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $set: { isModerator: true } },
      { new: true },
    );
    if (!result) {
      throw new Error(`Failed to fetch and populate a user`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Updates a user's profile picture.
 *
 * @param username - The username of the user being updated in the db.
 * @param badgeName - The badge icon for their profile picture.
 * @returns {User} - The updated user object.
 */
export const updateUserProfilePicture = async (
  username: string,
  badgeName: string,
): Promise<UserResponse> => {
  try {
    // find the badge
    const badge = await BadgeModel.findOne({ name: badgeName });
    if (!badge) {
      return { error: 'Badge not found' };
    }

    // find the user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return { error: 'User not found' };
    }

    // update and save
    user.profileIcon = badge.name;
    await user.save();
    return user;
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
    return { error: 'Failed to update user profile picture' };
  }
};

/**
 * Gets a badge's category and tier based off of its name.
 * @param badgeName - The badge name.
 */
export const getBadgeCategoryAndTierByUsername = async (
  username: string,
): Promise<{ category?: string; tier?: string; error?: string }> => {
  try {
    // find the user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return { error: 'User not found' };
    }

    // extract the profile icon
    const badgeName = user.profileIcon;
    if (!badgeName) {
      return { error: 'Profile icon not set for the user' };
    }

    // find the badge
    const badge = await BadgeModel.findOne({ name: badgeName });
    if (!badge) {
      return { error: 'Badge not found' };
    }

    return { category: badge.category, tier: badge.tier };
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
    return { error: 'Failed to retrieve badge category and tier' };
  }
};

/**
 * Updates a specificed moderator application from the db's status.
 *
 * @param username - the username of the user's application being deleted
 * @param accepted - true if application was accepted, false otherwise.
 * @returns {ModApplicationResponse} - the updated application object or error if an error occurred.
 */
export const updateAppStatus = async (
  id: string,
  username: string,
  accepted: boolean,
): Promise<ModApplicationResponse> => {
  try {
    const status = accepted ? 'accepted' : 'rejected';
    const result = await ModApplicationModel.findOneAndUpdate(
      { _id: id, username },
      { $set: { status } },
      { new: true },
    );
    if (!result) {
      throw new Error(`No application found`);
    }
    return result;
  } catch (error) {
    return { error: `Error when updating application status: ${(error as Error).message}` };
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
      qlist = await QuestionModel.find({ isRemoved: false }).populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel, match: { isRemoved: false } },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find({ isRemoved: false }).populate([
      { path: 'tags', model: TagModel },
      { path: 'answers', model: AnswerModel, match: { isRemoved: false } },
    ]);
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
export const getMessagesByOrder = async (): Promise<Message[]> => {
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
  const ulist = await UserModel.find();
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
          populate: [
            { path: 'comments', model: CommentModel },
            { path: 'reports', model: UserReportModel },
          ],
        },
        { path: 'comments', model: CommentModel },
        { path: 'reports', model: UserReportModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
        { path: 'reports', model: UserReportModel },
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
        populate: [
          { path: 'comments', model: CommentModel },
          { path: 'reports', model: UserReportModel },
        ],
      },
      { path: 'comments', model: CommentModel },
      { path: 'reports', model: UserReportModel },
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
    const c = await CorrespondenceModel.findOne(
      { _id: new ObjectId(cid) },
    );
    return c;
  } catch (error) {
    return { error: 'Error when fetching a correspondence' };
  }
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
    const result = await MessageModel.create(message);
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
 * Saves a new report to the database.
 *
 * @param {UserReport} report - The report to save
 *
 * @returns {Promise<UserReportResponse>} - The saved comment, or an error message if the save failed
 */
export const saveUserReport = async (report: UserReport): Promise<UserReportResponse> => {
  try {
    if (!report || !report.text || !report.reportBy || !report.reportDateTime) {
      throw new Error('Invalid report');
    }
    const result = await UserReportModel.create(report);
    return result;
  } catch (error) {
    return { error: `Error when saving a comment: ${(error as Error).message}` };
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
 * @returns {Promise<QuestionResponse>} - The updated question or an error message
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
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $set: { emojiTracker: {...emojis} } },
      { new: true }
    );
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
 * Adds a report to a question or answer.
 *
 * @param id - The ID of the question or answer to add a report to
 * @param type - The type of the report, either 'question' or 'answer'
 * @param report - The report to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addReport = async (
  id: string,
  type: 'question' | 'answer',
  report: UserReport,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!report || !report.text || !report.reportBy || !report.reportDateTime) {
      throw new Error('Invalid report');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { reports: { $each: [report._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { reports: { $each: [report._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add report');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding report: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all of the Questions and Answers in the database with unresolved reports that are not removed.
 * @param type - The type of the object, either question or answer.
 *
 * @returns {UserReportResponses} - A list of Questions containing the reported Questions and Answers.
 */
export const fetchUnresolvedReports = async (
  type: 'question' | 'answer',
): Promise<UserReportResponses> => {
  try {
    if (type === 'question') {
      const reportedQuestions = await QuestionModel.find({
        reports: { $exists: true, $not: { $size: 0 } },
      }).populate([{ path: 'reports', model: UserReportModel, match: { status: 'unresolved' } }]);
      return reportedQuestions;
    }
    if (type === 'answer') {
      const qWithReportedAns = await QuestionModel.find({
        answers: { $exists: true, $not: { $size: 0 } },
      }).populate([
        {
          path: 'answers',
          model: AnswerModel,
          populate: [{ path: 'reports', model: UserReportModel, match: { status: 'unresolved' } }],
        },
      ]);
      const filteredQ = qWithReportedAns.map(question => {
        question.answers = (question.answers as Answer[]).filter(
          answer => answer.reports && answer.reports.length > 0,
        );
        return question;
      });
      return filteredQ;
    }
    return [];
  } catch (error) {
    return { error: 'Error when fetching the reported objects' };
  }
};

/**
 * Adds the id of the removed reportedPost to the User's infractions list.
 *
 * @param reportedPost - The Question/Answer that was reported.
 * @param postId - The id of the post to query in the database.
 *
 * @returns {UserResponse} - Returns the updated user or an error if an error occurred.
 */
export const addUserInfraction = async (
  reportedPost: Question | Answer,
  postId: string,
): Promise<UserResponse> => {
  try {
    const username = 'askedBy' in reportedPost ? reportedPost.askedBy : reportedPost.ansBy;
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $push: { infractions: postId } },
      { new: true },
    );
    if (!result) {
      throw new Error(`No answer found`);
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding user infraction' };
  }
};

/**
 * Updates the post's removal status.
 *
 * @param post - The Question/Answer to be updated.
 * @param postId - The id of the post to query in the database.
 * @param type - The type of the post, either question or answer.
 * @param isRemoved - True if the moderator removed the question or answer, true otherwise.
 *
 * @returns {boolean} - True if the status was successfully changed, false otherwise.
 */
export const updatePostRemovalStatus = async (
  post: Question | Answer,
  postId: string,
  type: 'question' | 'answer',
  isRemoved: boolean,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question' && isRemoved === true) {
      result = await QuestionModel.findOneAndUpdate(
        { _id: postId },
        { $set: { isRemoved: true } },
        { new: true },
      );
    } else if (type === 'answer' && isRemoved === true) {
      result = await AnswerModel.findOneAndUpdate(
        { _id: postId },
        { $set: { isRemoved: true } },
        { new: true },
      );
    } else {
      result = post;
    }

    if (result === null) {
      throw new Error(`Failed to remove post`);
    }

    return result;
  } catch (error) {
    return { error: `Error when removing the post: ${(error as Error).message}` };
  }
};

/**
 * Updates the status of a report based on moderator decision.
 *
 * @param reportedPost - The Question/Answer that was reported.
 * @param postId - The id of the post to query in the database.
 * @param type - The type of the object, either question or answer.
 * @param isRemoved - True if the moderator removed the question or answer, true otherwise.
 *
 * @returns {QuestionResponse | AnswerResponse} - Returns the updated question/answer, or an error if an error occurred.
 */
export const updateReportStatus = async (
  reportedPost: Question | Answer,
  postId: string,
  type: 'question' | 'answer',
  isRemoved: boolean,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    const status = isRemoved ? 'removed' : 'dismissed';

    if (reportedPost.reports.length > 0) {
      const reportPromises = reportedPost.reports.map(async (report: UserReport) => {
        const reportId = report._id;
        return UserReportModel.findOneAndUpdate({ _id: reportId }, { status }, { new: true });
      });

      await Promise.all(reportPromises);
    }

    // if the report is accepted and the post is removed, add that post to the user who posted's infractions list
    if (status === 'removed') {
      await addUserInfraction(reportedPost, postId);
    }

    // Remove the associated reported post if removed, otherwise retain original post
    const result = await updatePostRemovalStatus(reportedPost, postId, type, isRemoved);
    return result;
  } catch (error) {
    return { error: `Error when resolving the reported object: ${(error as Error).message}` };
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
      qlist
        .filter(q => !q.isRemoved)
        .forEach(q => {
          q.tags.forEach(t => {
            tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
          });
        });
    }

    for (const [key, value] of tmap) {
      if (value === 0) {
        tmap.delete(key);
      }
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
