import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import bcrypt from 'bcrypt';
import { Answer, Badge, Comment, Question, Tag, User, UserReport } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
  C1_TEXT,
  C2_TEXT,
  C3_TEXT,
  C4_TEXT,
  C5_TEXT,
  C6_TEXT,
  C7_TEXT,
  C8_TEXT,
  C9_TEXT,
  C10_TEXT,
  C11_TEXT,
  C12_TEXT,
  R1_TEXT,
  R2_TEXT,
  R3_TEXT,
  R4_TEXT,
  R5_TEXT,
  R6_TEXT,
} from './data/posts_strings';
import CommentModel from './models/comments';
import UserReportModel from './models/userReport';
import UserModel from './models/users';
import BadgeModel from './models/badges';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates badge data.
 */
const badgesData = [
  {
    name: "Helper",
    description: "Answer 5 questions.",
    category: "answers",
    targetValue: 5,
    tier: "bronze",
    users: []
  },
  {
    name: "Guide",
    description: "Answer 15 questions.",
    category: "answers",
    targetValue: 15,
    tier: "silver",
    users: []
  },
  {
    name: "Sage",
    description: "Answer 25 questions.",
    category: "answers",
    targetValue: 25,
    tier: "gold",
    users: []
  },
  {
    name: "Curious",
    description: "Ask 5 questions.",
    category: "questions",
    targetValue: 5,
    tier: "bronze",
    users: []
  },
  {
    name: "Inquirer",
    description: "Ask 10 questions.",
    category: "questions",
    targetValue: 15,
    tier: "silver",
    users: []
  },
  {
    name: "Investigator",
    description: "Ask 25 questions.",
    category: "questions",
    targetValue: 25,
    tier: "gold",
    users: []
  },
  {
    name: "Observer",
    description: "Leave 5 comments.",
    category: "comments",
    targetValue: 5,
    tier: "bronze",
    users: []
  },
  {
    name: "Commentator",
    description: "Leave 10 comments.",
    category: "comments",
    targetValue: 10,
    tier: "silver",
    users: []
  },
  {
    name: "Debater",
    description: "Leave 20 comments.",
    category: "comments",
    targetValue: 20,
    tier: "gold",
    users: []
  },
  {
    name: "Voter",
    description: "Cast 5 votes",
    category: "votes",
    targetValue: 5,
    tier: "bronze",
    users: []
  },
  {
    name: "Critic",
    description: "Cast 10 votes",
    category: "votes",
    targetValue: 10,
    tier: "silver",
    users: []
  },
  {
    name: "Curator",
    description: "Cast 25 votes",
    category: "votes",
    targetValue: 25,
    tier: "gold",
    users: []
  }
];

/**
 * Creates new Badge documents in the database.
 *
 * @param badges An array of badge data to be inserted.
 * @returns A Promise that resolves once all badges have been created.
 * @throws An error if the badge creation fails.
 */
async function badgeCreate(badges: { name: string, description: string, category: string, targetValue: number, tier: string }[]): Promise<void> {
  for (const badge of badges) {
    if (badge.name === '' || badge.description === '' || badge.category === '' || badge.targetValue < 1 || !badge.tier) {
      throw new Error('Invalid Badge Format');
    }
    await BadgeModel.create(badge);
  }
}

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description };
  return await TagModel.create(tag);
}

/**
 * Creates a new Comment document in the database.
 *
 * @param text The content of the comment.
 * @param commentBy The username of the user who commented.
 * @param commentDateTime The date and time when the comment was posted.
 * @returns A Promise that resolves to the created Comment document.
 * @throws An error if any of the parameters are invalid.
 */
async function commentCreate(
  text: string,
  commentBy: string,
  commentDateTime: Date,
): Promise<Comment> {
  if (text === '' || commentBy === '' || commentDateTime == null)
    throw new Error('Invalid Comment Format');
  const commentDetail: Comment = {
    text: text,
    commentBy: commentBy,
    commentDateTime: commentDateTime,
  };
  return await CommentModel.create(commentDetail);
}

/**
 * Creates a new UserReport document in the database.
 *
 * @param text The content of the report.
 * @param reportBy The username of the user who reported.
 * @param reportDateTime The date and time when the report was posted.
 * @returns A Promise that resolves to the created UserReport document.
 * @throws An error if any of the parameters are invalid.
 */
async function reportCreate(
  text: string,
  reportBy: string,
  reportDateTime: Date,
  status: 'unresolved' | 'dismissed' | 'removed',
): Promise<UserReport> {
  if (text === '' || reportBy === '' || reportDateTime == null)
    throw new Error('Invalid Report Format');
  const reportDetail: UserReport = {
    text: text,
    reportBy: reportBy,
    reportDateTime: reportDateTime,
    status: status,
  };
  return await UserReportModel.create(reportDetail);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the user who wrote the answer.
 * @param ansDateTime The date and time when the answer was created.
 * @param comments The comments that have been added to the answer.
 * @param reports The reports that have been added to the answer.
 * @param isRemoved Current visibility state, true if moderator removes answer.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(
  text: string,
  ansBy: string,
  ansDateTime: Date,
  comments: Comment[],
  reports: UserReport[],
  isRemoved: boolean,
): Promise<Answer> {
  if (
    text === '' ||
    ansBy === '' ||
    ansDateTime == null ||
    comments == null ||
    reports == null ||
    isRemoved == null
  )
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ansBy: ansBy,
    ansDateTime: ansDateTime,
    comments: comments,
    reports: reports,
    isRemoved: isRemoved,
    endorsed: false,
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param askedBy The username of the user who asked the question.
 * @param askDateTime The date and time when the question was asked.
 * @param views An array of usernames who have viewed the question.
 * @param comments An array of comments associated with the question.
 * @param reports The reports that have been added to the question.
 * @param isRemoved Current visibility state, true if moderator removes question.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  askedBy: string,
  askDateTime: Date,
  views: string[],
  comments: Comment[],
  reports: UserReport[],
  isRemoved: boolean,
): Promise<Question> {
  if (
    title === '' ||
    text === '' ||
    tags.length === 0 ||
    askedBy === '' ||
    askDateTime == null ||
    comments == null ||
    reports == null ||
    isRemoved == null
  )
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    askedBy: askedBy,
    answers: answers,
    views: views,
    askDateTime: askDateTime,
    upVotes: [],
    downVotes: [],
    comments: comments,
    reports: reports,
    isRemoved: isRemoved,
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Creates an original User document in the database.
 *
 * @param username Name of the user.
 * @param password Password to login created by the user.
 * @param isModerator The current state of the user's moderator status.
 * @param badges The badges obtained by the user.
 * @param infractions A list of answer/question id's that were removed by moderators
 * @param doNotDisturb Whether or not the user is on dnd.
 * @returns A Promise that resolves to the created User document.
 * @throws An error if any of the parameters are invalid.
 */
async function userCreate(
  username: string,
  password: string,
  isModerator: boolean,
  badges: Badge[],
  infractions: string[],
  profileIcon?: string,
  doNotDisturb?: false,
): Promise<User> {
  if (
    username === '' ||
    password === '' ||
    isModerator === null ||
    badges == null ||
    infractions == null
  )
    throw new Error('Invalid User Format');

  const hashedPassword = await bcrypt.hash(password, 5);
  const userDetail: User = {
    username: username,
    password: hashedPassword,
    isModerator: isModerator,
    badges: badges,
    infractions: infractions,
    profileIcon: profileIcon,
    doNotDisturb: doNotDisturb,
  };
  return await UserModel.create(userDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    const t1 = await tagCreate(T1_NAME, T1_DESC);
    const t2 = await tagCreate(T2_NAME, T2_DESC);
    const t3 = await tagCreate(T3_NAME, T3_DESC);
    const t4 = await tagCreate(T4_NAME, T4_DESC);
    const t5 = await tagCreate(T5_NAME, T5_DESC);
    const t6 = await tagCreate(T6_NAME, T6_DESC);

    const r1 = await reportCreate(R1_TEXT, 'sana', new Date('2023-12-12T03:30:00'), 'unresolved');
    const r2 = await reportCreate(
      R2_TEXT,
      'ihba001',
      new Date('2023-12-01T15:24:19'),
      'unresolved',
    );
    const r3 = await reportCreate(
      R3_TEXT,
      'saltyPeter',
      new Date('2023-12-18T09:24:00'),
      'unresolved',
    );
    const r4 = await reportCreate(
      R4_TEXT,
      'monkeyABC',
      new Date('2023-12-20T03:24:42'),
      'unresolved',
    );
    const r5 = await reportCreate(
      R5_TEXT,
      'hamkalo',
      new Date('2023-12-23T08:24:00'),
      'unresolved',
    );
    const r6 = await reportCreate(R6_TEXT, 'azad', new Date('2023-12-22T17:19:00'), 'unresolved');

    const c1 = await commentCreate(C1_TEXT, 'sana', new Date('2023-12-12T03:30:00'));
    const c2 = await commentCreate(C2_TEXT, 'ihba001', new Date('2023-12-01T15:24:19'));
    const c3 = await commentCreate(C3_TEXT, 'saltyPeter', new Date('2023-12-18T09:24:00'));
    const c4 = await commentCreate(C4_TEXT, 'monkeyABC', new Date('2023-12-20T03:24:42'));
    const c5 = await commentCreate(C5_TEXT, 'hamkalo', new Date('2023-12-23T08:24:00'));
    const c6 = await commentCreate(C6_TEXT, 'azad', new Date('2023-12-22T17:19:00'));
    const c7 = await commentCreate(C7_TEXT, 'hamkalo', new Date('2023-12-22T21:17:53'));
    const c8 = await commentCreate(C8_TEXT, 'alia', new Date('2023-12-19T18:20:59'));
    const c9 = await commentCreate(C9_TEXT, 'ihba001', new Date('2022-02-20T03:00:00'));
    const c10 = await commentCreate(C10_TEXT, 'abhi3241', new Date('2023-02-10T11:24:30'));
    const c11 = await commentCreate(C11_TEXT, 'Joji John', new Date('2023-03-18T01:02:15'));
    const c12 = await commentCreate(C12_TEXT, 'abaya', new Date('2023-04-10T14:28:01'));

    await userCreate('hamkalo', 'Password1!', false, [], []);
    await userCreate('azad', 'Password1!', false, [], []);
    await userCreate('abaya', 'Password1!', false, [], []);
    await userCreate('alia', 'Password1!', false, [], []);
    await userCreate('sana', 'Password1!', false, [], []);
    await userCreate('abhi3241', 'Password1!', false, [], []);
    await userCreate('mackson3332', 'Password1!', false, [], []);
    await userCreate('ihba001', 'Password1!', false, [], []);
    await userCreate('Joji John', 'Password1!', false, [], []);
    await userCreate('saltyPeter', 'Password1!', false, [], []);
    await userCreate('monkeyABC', 'Password1!', false, [], []);
    await userCreate('elephantCDE', 'Password1!', false, [], []);
    await userCreate('Moderator', 'Password1!', true, [], []);

    const a1 = await answerCreate(
      A1_TXT,
      'hamkalo',
      new Date('2023-11-20T03:24:42'),
      [c1],
      [r1, r2, r3, r4],
      false,
    );
    const a2 = await answerCreate(A2_TXT, 'azad', new Date('2023-11-23T08:24:00'), [c2], [], false);
    const a3 = await answerCreate(
      A3_TXT,
      'abaya',
      new Date('2023-11-18T09:24:00'),
      [c3],
      [r3, r2],
      false,
    );
    const a4 = await answerCreate(
      A4_TXT,
      'alia',
      new Date('2023-11-12T03:30:00'),
      [c4],
      [r4],
      false,
    );
    const a5 = await answerCreate(A5_TXT, 'sana', new Date('2023-11-01T15:24:19'), [c5], [], false);
    const a6 = await answerCreate(
      A6_TXT,
      'abhi3241',
      new Date('2023-02-19T18:20:59'),
      [c6],
      [],
      false,
    );
    const a7 = await answerCreate(
      A7_TXT,
      'mackson3332',
      new Date('2023-02-22T17:19:00'),
      [c7],
      [],
      false,
    );
    const a8 = await answerCreate(
      A8_TXT,
      'ihba001',
      new Date('2023-03-22T21:17:53'),
      [c8],
      [],
      false,
    );

    await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      'Joji John',
      new Date('2022-01-20T03:00:00'),
      ['sana', 'abaya', 'alia'],
      [c9],
      [],
      false,
    );
    await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      'saltyPeter',
      new Date('2023-01-10T11:24:30'),
      ['mackson3332'],
      [c10],
      [r5, r2, r1],
      false,
    );
    await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      'monkeyABC',
      new Date('2023-02-18T01:02:15'),
      ['monkeyABC', 'elephantCDE'],
      [c11],
      [],
      false,
    );
    await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      'elephantCDE',
      new Date('2023-03-10T14:28:01'),
      [],
      [c12],
      [r6],
      false,
    );

    await badgeCreate(badgesData);

    console.log('Database populated');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) db.close();
    console.log('done');
  }
};

populate();

console.log('Processing ...');
