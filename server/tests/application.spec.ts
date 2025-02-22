import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  addUser,
  findUser,
  addModApplication,
  fetchModApplications,
  updateUserModStatus,
  updateAppStatus,
  addUserInfraction,
  updatePostRemovalStatus,
  updateReportStatus,
  saveUserReport,
  fetchUnresolvedReports,
  addReport,
  saveBadge,
  getAllBadges,
  getBadgeUsers,
  getAllMessages,
  getAllCorrespondences,
  getAllUsers,
  fetchAndIncrementCorrespondenceViewsById,
  fetchAndIncrementMessageViewsById,
  fetchCorrespondenceById,
  saveMessage,
  saveCorrespondence,
  addMessageToCorrespondence,
  updateCorrespondenceById,
  updateCorrespondenceUserTypingByIdNames,
  updateCorrespondenceViewsById,
  updateMessageViewsById,
  updateMessageEmojisById,
  updateMessageById,
  updateMessageIsDeletedById,
  filterQuestionsByAnswerer,
  filterQuestionsByCommenter,
  saveAnswerCommentNotification,
  saveQuestionCommentNotification,
  saveAnswerNotification,
  reportResolvedNotification,
  saveModApplicationNotification,
  updateUserIsBannedByUsername,
} from '../models/application';
import {
  Answer,
  Question,
  Tag,
  Comment,
  User,
  Badge,
  Message,
  Correspondence,
  UserReport,
  ModApplication,
} from '../types';
import { T1_DESC, T2_DESC, T3_DESC, R1_TEXT, R2_TEXT, R3_TEXT } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import BadgeModel from '../models/badges';
import MessageModel from '../models/message';
import CorrespondenceModel from '../models/correspondence';
import ModApplicationModel from '../models/modApplication';
import UserReportModel from '../models/userReport';
import CommentModel from '../models/comments';
import NotificationModel from '../models/notifications';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const ans5: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans5',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [],
    isRemoved: false,
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [],
    isRemoved: false,
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [],
    isRemoved: false,
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [tag1],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [],
    isRemoved: true,
  },
];

const badge1: Badge = {
  _id: new ObjectId(),
  name: 'Sage',
  description: 'Answer 15 questions.',
  category: 'answers',
  targetValue: 15,
  tier: 'silver',
  users: [],
};

const message1: Message = {
  _id: '65e9b58910afe6e94fc6e6aa',
  messageText: 'What is your favorite smartphone?',
  messageDateTime: new Date('2023-11-19T09:24:00'),
  messageBy: 'isuzuki',
  messageTo: ['tgwynn'],
  views: ['isuzuki'],
  isCodeStyle: false,
  isDeleted: false,
};

const message2: Message = {
  _id: '65e9b58910afe6e94fc6e6ab',
  messageText: 'Python is my favorite programming language',
  messageDateTime: new Date('2023-11-19T09:24:00'),
  messageBy: 'isuzuki',
  messageTo: ['tgwynn', 'tcobb'],
  views: ['isuzuki'],
  isCodeStyle: false,
  isDeleted: false,
};

const message3: Message = {
  _id: '65e9b58910afe6e94fc6e6ac',
  messageText: 'What language is easiest to learn?',
  messageDateTime: new Date('2023-11-19T09:24:00'),
  messageBy: 'isuzuki',
  messageTo: ['tgwynn', 'tcobb'],
  views: ['isuzuki'],
  isCodeStyle: true,
  isDeleted: false,
};

const MESSAGES: Message[] = [message1, message2, message3];

const correspondence1 = {
  _id: '65e9b58910afe6e94fc6e6ba',
  messages: [message2, message3],
  messageMembers: ['isuzuki', 'tgwynn', 'tcobb'],
  views: [],
  userTyping: [],
};

const correspondence2 = {
  _id: '65e9b58910afe6e94fc6e6bb',
  messages: [message1],
  messageMembers: ['isuzuki', 'tgwynn'],
  views: ['isuzuki'],
  userTyping: [],
};

const CORRESPONDENCES: Correspondence[] = [correspondence1, correspondence2];

const user1: User = {
  _id: new ObjectId('65e9b786ff0e893116b2af69'),
  username: 'user1',
  password: 'Password1!',
  isModerator: false,
  badges: [badge1],
  infractions: [],
};

const user2: User = {
  _id: new ObjectId('65e9b786ff0e893116b2af70'),
  username: 'user2',
  password: 'Password1!',
  isModerator: false,
  badges: [],
  infractions: [],
};

const user3: User = {
  _id: new ObjectId('65e9b716ff0e892116b2de09'),
  username: 'startuser',
  password: 'password123',
  isModerator: false,
  badges: [],
  infractions: [],
};

const USERS = [user1, user2, user3];

const mockApplication1 = {
  _id: new ObjectId('65e9b786ff0e893116b2af71'),
  username: 'testuser1',
  applicationText: 'Please!',
  status: 'unresolved',
};

const mockApplication2 = {
  _id: new ObjectId('65e9b786ff0e893116b2af72'),
  username: 'testuser2',
  applicationText:
    'I want to become a moderator so like I think it would be great if you accepted me and what not, ummmmmmm, anyway yeah please accept me!',
  status: 'unresolved',
};

const r1: UserReport = {
  _id: new ObjectId('65e9b786ff0e893116b2af73'),
  text: R1_TEXT,
  reportBy: 'user1',
  reportDateTime: new Date(),
  status: 'unresolved',
};

const r2: UserReport = {
  _id: new ObjectId('65e9b786ff0e893116b2af74'),
  text: R2_TEXT,
  reportBy: 'user2',
  reportDateTime: new Date(),
  status: 'unresolved',
};

const r3: UserReport = {
  _id: new ObjectId('65e9b786ff0e893116b2af75'),
  text: R3_TEXT,
  reportBy: 'user1',
  reportDateTime: new Date(),
  status: 'unresolved',
};

const reportedAns1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
  reports: [r1, r2],
  isRemoved: false,
  endorsed: false,
};

const reportedAns2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
  reports: [],
  isRemoved: false,
  endorsed: false,
};

const QUESTIONSREPORTED: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [reportedAns1, reportedAns2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [],
    isRemoved: false,
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    reports: [r2],
    isRemoved: false,
  },
];

const MOCK_APPLICATIONS = [mockApplication1, mockApplication2];

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('Mod Application model', () => {
    describe('addModApplication', () => {
      test('Should add a mod application to the database if none already exists', async () => {
        mockingoose(ModApplicationModel).toReturn(null, 'findOne');
        mockingoose(ModApplicationModel).toReturn(mockApplication1, 'create');

        const result = await addModApplication(
          mockApplication1.username,
          mockApplication1.applicationText,
        );
        expect(result).toBeTruthy();
      });

      test('Should return an error if the user has an unresolved application in the database', async () => {
        mockingoose(ModApplicationModel).toReturn(mockApplication2, 'findOne');

        const result = await addModApplication(
          mockApplication1.username,
          mockApplication1.applicationText,
        );
        expect(result).toEqual({ error: 'User already created an application request' });
      });

      test('Should return an error if saving the application to the database fails', async () => {
        jest.spyOn(ModApplicationModel, 'create').mockImplementationOnce(() => {
          throw new Error('Error');
        });

        const result = await addModApplication(
          mockApplication2.username,
          mockApplication2.applicationText,
        );
        expect(result).toEqual({ error: 'Error when saving the mod application' });
      });

      test('Should return an error if saving the application to the database fails', async () => {
        const mockModUser: User = {
          _id: new ObjectId('65e9b786ff0e893116b2af69'),
          username: 'user4',
          password: 'Password1!',
          isModerator: true,
          infractions: [],
          badges: [],
        };
        const mockAcceptedApp = {
          username: mockModUser.username,
          applicationText:
            'I want to become a moderator so like I think it would be great if you accepted me and what not, ummmmmmm, anyway yeah please accept me!',
          status: 'accepted',
        };

        mockingoose(ModApplicationModel).toReturn(mockAcceptedApp, 'findOne');

        const result = await addModApplication(mockModUser.username, 'test');
        expect(result).toEqual({ error: 'User is already a moderator' });
      });
    });

    describe('fetchModApplication', () => {
      test('Should return all mod applications', async () => {
        mockingoose(ModApplicationModel).toReturn(MOCK_APPLICATIONS, 'find');

        const result = await fetchModApplications();
        expect(result).toBeTruthy();
      });

      test('Should return an error if the get from the database fails', async () => {
        mockingoose(ModApplicationModel).toReturn(new Error('Error'), 'find');

        const result = await fetchModApplications();
        expect(result).toEqual({ error: 'Error when fetching the mod application' });
      });
    });
    describe('updateAppStatus', () => {
      test('Should update the mod status to accepted', async () => {
        const updatedApp = { ...mockApplication1, status: 'accepted' };
        const updateSpy = jest.spyOn(ModApplicationModel, 'findOneAndUpdate');
        const appId = mockApplication1._id?.toString() as string;
        mockingoose(ModApplicationModel).toReturn(updatedApp, 'findOneAndUpdate');

        const result = (await updateAppStatus(
          appId,
          mockApplication1.username,
          true,
        )) as ModApplication;

        expect(result.status).toBe('accepted');
        expect(updateSpy).toHaveBeenCalledWith(
          { _id: appId, username: mockApplication1.username },
          { $set: { status: 'accepted' } },
          { new: true },
        );
      });

      test('Should update the mod status to rejected', async () => {
        const updatedApp = { ...mockApplication2, status: 'rejected' };
        const updateSpy = jest.spyOn(ModApplicationModel, 'findOneAndUpdate');
        const appId = mockApplication2._id?.toString() as string;
        mockingoose(ModApplicationModel).toReturn(updatedApp, 'findOneAndUpdate');

        const result = (await updateAppStatus(
          appId,
          mockApplication2.username,
          false,
        )) as ModApplication;

        expect(result.status).toBe('rejected');
        expect(updateSpy).toHaveBeenCalledWith(
          { _id: appId, username: mockApplication2.username },
          { $set: { status: 'rejected' } },
          { new: true },
        );
      });

      test('Should throw an error if the ModApplication is not in the db', async () => {
        mockingoose(ModApplicationModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateAppStatus('bad_id', user2.username, true);

        expect(result).toEqual({
          error: 'Error when updating application status: No application found',
        });
      });

      test('Should throw an error if findOneAndUpdate fails', async () => {
        mockingoose(ModApplicationModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = await updateAppStatus(
          mockApplication2._id?.toString() as string,
          user2.username,
          true,
        );

        expect(result).toEqual({ error: 'Error when updating application status: err' });
      });
    });

    describe('updateUserModStatus', () => {
      test('Should make a user a moderator', async () => {
        const updatedUser: User = {
          _id: new ObjectId('65e9b786ff0e893116b2af69'),
          username: 'user1',
          password: 'Password1!',
          isModerator: true,
          infractions: [],
          badges: [badge1],
        };
        mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

        const result = await updateUserModStatus(user1.username);
        const fixed = { ...updatedUser, badges: [badge1._id] };
        // used toMatchObject instead of toEqual because the order of the values in the object slightly changes
        expect(result).toMatchObject(fixed);
      });

      test('Should return an error if username is bad', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateUserModStatus('_');
        // used toMatchObject instead of toEqual because the order of the values in the object slightly changes
        expect(result).toEqual({
          error:
            'Error when fetching and populating a document: Failed to fetch and populate a user',
        });
      });

      test('Should return an error if error occurs while updating database', async () => {
        mockingoose(UserModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = await updateUserModStatus('user1');
        expect(result).toEqual({
          error: 'Error when fetching and populating a document: err',
        });
      });
    });

    describe('updateUserIsBannedByUsername', () => {
      test('Should ban a user when a moderator bans them', async () => {
        const updatedUser: User = {
          _id: new ObjectId('65e9b786ff0e893116b2af69'),
          username: 'user1',
          password: 'Password1!',
          isModerator: true,
          infractions: [],
          badges: [badge1],
          isBanned: true,
        };
        mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

        // const result = await updateUserIsBannedByUsername(user1.username);
        expect(updatedUser.isBanned).toEqual(true);
      });

      test('Should return an error if error occurs while updating database', async () => {
        mockingoose(UserModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = await updateUserIsBannedByUsername(user1.username);
        expect(result).toEqual({
          error: 'Error when updating user',
        });
      });

      test('Should return an error if UserModel returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateUserIsBannedByUsername(user1.username);
        expect(result).toEqual({
          error: 'Error when updating user',
        });
      });
    });

    describe('saveModApplicationNotification', () => {
      beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
      });

      it('should create and save a notification when a new application is accepted', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption:
            'Your application to become a moderator was accepted! Please log out and log back in to unlock moderator privileges!',
          read: false,
          redirectUrl: `/`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', true);

        // Verify the result
        expect(result).toMatchObject({
          user: expectedNotification.user,
          type: expectedNotification.type,
          caption: expectedNotification.caption,
          read: expectedNotification.read,
          redirectUrl: expectedNotification.redirectUrl,
        });

        // Verify createdAt is a recent date
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Date.now() - result.createdAt.getTime()).toBeLessThan(1000);
      });

      it('should create and save a notification when a new application is rejected', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption: 'Your application to become a moderator was rejected, you can always reapply!',
          read: false,
          redirectUrl: `modApplication`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', false);

        // Verify the result
        expect(result).toMatchObject({
          user: expectedNotification.user,
          type: expectedNotification.type,
          caption: expectedNotification.caption,
          read: expectedNotification.read,
          redirectUrl: expectedNotification.redirectUrl,
        });

        // Verify createdAt is a recent date
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Date.now() - result.createdAt.getTime()).toBeLessThan(1000);
      });

      it('should create notification with correct redirect URL when accepted', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption:
            'Your application to become a moderator was accepted! Please log out and log back in to unlock moderator privileges!',
          read: false,
          redirectUrl: `/`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', true);

        // Verify the redirect URL format
        expect(result.redirectUrl).toBe('/');
      });

      it('should create notification with correct redirect URL when rejected', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption: 'Your application to become a moderator was rejected, you can always reapply!',
          read: false,
          redirectUrl: `modApplication`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', false);

        // Verify the redirect URL format
        expect(result.redirectUrl).toBe('modApplication');
      });

      it('should create notification with correct caption format when accepted', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption:
            'Your application to become a moderator was accepted! Please log out and log back in to unlock moderator privileges!',
          read: false,
          redirectUrl: `/`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', true);

        // Verify the caption format
        expect(result.caption).toBe(
          'Your application to become a moderator was accepted! Please log out and log back in to unlock moderator privileges!',
        );
      });

      it('should create notification with correct caption format when rejected', async () => {
        const expectedNotification = {
          user: 'user1',
          type: 'application',
          caption: 'Your application to become a moderator was rejected, you can always reapply!',
          read: false,
          redirectUrl: `modApplication`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveModApplicationNotification('user1', false);

        // Verify the caption format
        expect(result.caption).toBe(
          'Your application to become a moderator was rejected, you can always reapply!',
        );
      });
    });
  });

  describe('User model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('addUser', () => {
      test('should add a new user to the database if not already present', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');
        mockingoose(UserModel).toReturn(user2, 'save');

        const result = await addUser(user2);

        expect(result).not.toBeNull();
        expect(result?.username).toEqual('user2');
        expect(result?.isModerator).toBe(false);
      });

      test('should be null if the user is already in the database', async () => {
        mockingoose(UserModel).toReturn(user1, 'findOne');

        const result = await addUser(user1);

        expect(result).toBeNull();
      });

      test('should return null if an error occurs', async () => {
        mockingoose(UserModel).toReturn(new Error('Error'), 'findOne');

        const result = await addUser(user1);

        expect(result).toBeNull();
      });
    });

    describe('findUser', () => {
      test('should return user if username and password are correct', async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        mockingoose(UserModel).toReturn({ ...user1, password: 'mock-hash' }, 'findOne');

        const result = await findUser(user1.username, user1.password);

        expect(result).toBeTruthy();
        expect(result?.username).toBe(user1.username);
      });

      test('should return null if username is not in the database', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await findUser(user1.username, user1.password);

        expect(result).toBeNull();
      });

      test('should return null if password is incorrect', async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        mockingoose(UserModel).toReturn({ ...user1, password: 'mock-hash' }, 'findOne');

        const result = await findUser(user1.username, user1.password);

        expect(result).toBeNull();
      });

      test('should return null if an error occurs', async () => {
        mockingoose(UserModel).toReturn(new Error('Error'), 'findOne');

        const result = await findUser(user1.username, user1.password);

        expect(result).toBeNull();
      });
    });

    describe('addUserInfraction', () => {
      test('should add an infraction to a user', async () => {
        const ansInfraction: Answer = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          text: 'ans1',
          ansBy: 'user1',
          ansDateTime: new Date('2023-11-18T09:24:00'),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };
        const ansID = ansInfraction._id?.toString() as string;
        mockingoose(UserModel).toReturn({ ...user1, infractions: [ansID] }, 'findOneAndUpdate');

        expect(user1.infractions.length).toEqual(0);
        const result = (await addUserInfraction(ansInfraction, ansID)) as User;

        expect(result.infractions.length).toEqual(1);
      });

      test('should return an error if ansBy does not find a user', async () => {
        const ansID = ans2._id?.toString() as string;
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await addUserInfraction(ans1, ansID);

        expect(result).toEqual({ error: 'Error when adding user infraction' });
      });

      test('should return an error if an error occurs in findOneAndUpdate', async () => {
        const ansID = ans2._id?.toString() as string;
        mockingoose(UserModel).toReturn(new Error('Error'), 'findOneAndUpdate');

        const result = (await addUserInfraction(ans1, ansID)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when adding user infraction');
      });
    });
  });

  describe('UserReport model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('addReport', () => {
      test('should add a report to a question', async () => {
        const question = { ...QUESTIONS[0], reports: [r1._id] };
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addReport(qid, 'question', r1)) as Question;

        expect(result.reports.length).toEqual(1);
      });

      test('should add a report to an answer', async () => {
        const answer = { ...ans1, reports: [r1._id] };
        const aid = ans1._id?.toString() as string;
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addReport(aid, 'answer', r1)) as Answer;

        expect(result.reports.length).toEqual(1);
      });

      test('should return an error if the mongoDB operation fails', async () => {
        const aid = ans1._id as unknown as string;
        mockingoose(AnswerModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = await addReport(aid, 'answer', r1);

        expect(result).toEqual({ error: 'Error when adding report: err' });
      });

      test('should return an error if the report is invalid', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addReport(answer._id?.toString() as string, 'answer', r1);
        expect(result).toEqual({ error: 'Error when adding report: Failed to add report' });
      });

      test('should throw an error if a required field is missing in the report', async () => {
        const invalidReport: Partial<UserReport> = {
          text: 'This is an answer text',
          reportBy: 'user123',
        };
        const question = { ...QUESTIONS[0], reports: [r1._id] };
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        try {
          await addReport(qid, 'question', invalidReport as UserReport);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid report');
        }
      });
    });

    describe('updatePostRemovalStatus', () => {
      test('should remove a question post', async () => {
        const question = QUESTIONS[0];
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn({ question, isRemoved: true }, 'findOneAndUpdate');

        expect(question.isRemoved).toBe(false);
        const result = (await updatePostRemovalStatus(question, qid, 'question', true)) as Question;

        expect(result.isRemoved).toBe(true);
      });

      test('should remove an answer post', async () => {
        const ansId = ans1._id?.toString() as string;
        mockingoose(AnswerModel).toReturn({ ans1, isRemoved: true }, 'findOneAndUpdate');

        expect(ans1.isRemoved).toBe(false);
        const result = (await updatePostRemovalStatus(ans1, ansId, 'answer', true)) as Answer;

        expect(result.isRemoved).toBe(true);
      });

      test('should NOT remove a question post', async () => {
        const question = QUESTIONS[0];
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn({ question, isRemoved: true }, 'findOneAndUpdate');

        expect(question.isRemoved).toBe(false);
        const result = (await updatePostRemovalStatus(
          question,
          qid,
          'question',
          false,
        )) as Question;

        expect(result.isRemoved).toBe(false);
      });

      test('should NOT remove an answer post', async () => {
        const ansId = ans1._id?.toString() as string;
        mockingoose(AnswerModel).toReturn({ ans1, isRemoved: true }, 'findOneAndUpdate');

        expect(ans1.isRemoved).toBe(false);
        const result = (await updatePostRemovalStatus(ans1, ansId, 'answer', false)) as Answer;

        expect(result.isRemoved).toBe(false);
      });

      test('should throw an error if question is invalid', async () => {
        const question = QUESTIONS[0];
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = (await updatePostRemovalStatus(question, qid, 'question', true)) as Question;

        expect(result).toEqual({ error: 'Error when removing the post: Failed to remove post' });
      });

      test('should throw an error if an error occurs while updating the database', async () => {
        const question = QUESTIONS[0];
        const qid = question._id?.toString() as string;
        mockingoose(QuestionModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = (await updatePostRemovalStatus(question, qid, 'question', true)) as Question;

        expect(result).toEqual({ error: 'Error when removing the post: err' });
      });
    });

    describe('updateReportStatus', () => {
      const mockQuestion: Question = {
        _id: new ObjectId('65e9b716ff0e892116b2de6c'),
        title: 'Test Q',
        text: 'Test',
        tags: [],
        answers: [],
        askedBy: 'q_by4',
        askDateTime: new Date('2023-11-20T09:24:00'),
        views: [],
        upVotes: [],
        downVotes: [],
        comments: [],
        reports: [r1, r2],
        isRemoved: false,
      };

      const mockAns: Answer = {
        _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
        text: 'ans4',
        ansBy: 'ansBy4',
        ansDateTime: new Date('2023-11-19T09:24:00'),
        comments: [],
        reports: [r3],
        isRemoved: false,
        endorsed: false,
      };

      test('should update report on removed question', async () => {
        const qid = mockQuestion._id?.toString() as string;
        const reportUpdateSpy = jest.spyOn(UserReportModel, 'findOneAndUpdate');
        mockingoose(UserReportModel).toReturn(
          { ...mockQuestion.reports[0], status: 'removed' },
          'findOneAndUpdate',
        );
        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, isRemoved: true },
          'findOneAndUpdate',
        );
        mockingoose(AnswerModel).toReturn(mockAns, 'findOneAndUpdate');

        expect(mockQuestion.isRemoved).toBe(false);
        expect(mockQuestion.reports[0].status).toBe('unresolved');
        const result = (await updateReportStatus(mockQuestion, qid, 'question', true)) as Question;

        expect(result.isRemoved).toBe(true);
        expect(reportUpdateSpy).toHaveBeenCalledWith(
          { _id: new ObjectId('65e9b786ff0e893116b2af74') },
          { status: 'removed' },
          { new: true },
        );
      });

      test('should update report on removed answer', async () => {
        const aid = mockAns._id?.toString() as string;
        const reportUpdateSpy = jest.spyOn(UserReportModel, 'findOneAndUpdate');
        mockingoose(UserReportModel).toReturn(
          { ...mockAns.reports[0], status: 'removed' },
          'findOneAndUpdate',
        );
        mockingoose(AnswerModel).toReturn({ ...mockAns, isRemoved: true }, 'findOneAndUpdate');

        expect(mockAns.isRemoved).toBe(false);
        expect(mockAns.reports[0].status).toBe('unresolved');
        const result = (await updateReportStatus(mockAns, aid, 'answer', true)) as Answer;

        expect(result.isRemoved).toBe(true);
        expect(reportUpdateSpy).toHaveBeenCalledWith(
          { _id: new ObjectId('65e9b786ff0e893116b2af75') },
          { status: 'removed' },
          { new: true },
        );
      });

      test('should update report on dismissed question', async () => {
        const qid = mockQuestion._id?.toString() as string;
        const reportUpdateSpy = jest.spyOn(UserReportModel, 'findOneAndUpdate');
        mockingoose(UserReportModel).toReturn(
          { ...mockQuestion.reports[0], status: 'dismissed' },
          'findOneAndUpdate',
        );
        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, isRemoved: false },
          'findOneAndUpdate',
        );
        mockingoose(AnswerModel).toReturn(mockAns, 'findOneAndUpdate');

        expect(mockQuestion.isRemoved).toBe(false);
        expect(mockQuestion.reports[0].status).toBe('unresolved');
        const result = (await updateReportStatus(mockQuestion, qid, 'question', false)) as Question;

        expect(result.isRemoved).toBe(false);
        expect(reportUpdateSpy).toHaveBeenCalledWith(
          { _id: new ObjectId('65e9b786ff0e893116b2af74') },
          { status: 'dismissed' },
          { new: true },
        );
      });

      test('should update report on dismissed answer', async () => {
        const aid = mockAns._id?.toString() as string;
        const reportUpdateSpy = jest.spyOn(UserReportModel, 'findOneAndUpdate');
        mockingoose(UserReportModel).toReturn(
          { ...mockAns.reports[0], status: 'dismissed' },
          'findOneAndUpdate',
        );
        mockingoose(AnswerModel).toReturn({ ...mockAns, isRemoved: false }, 'findOneAndUpdate');

        expect(mockAns.isRemoved).toBe(false);
        expect(mockAns.reports[0].status).toBe('unresolved');
        const result = (await updateReportStatus(mockAns, aid, 'answer', false)) as Answer;

        expect(result.isRemoved).toBe(false);
        expect(reportUpdateSpy).toHaveBeenCalledWith(
          { _id: new ObjectId('65e9b786ff0e893116b2af75') },
          { status: 'dismissed' },
          { new: true },
        );
      });

      test('should throw an error if an error occurs in the database operations', async () => {
        const qid = mockQuestion._id?.toString() as string;
        mockingoose(UserReportModel).toReturn(new Error('err'), 'findOneAndUpdate');

        const result = await updateReportStatus(mockQuestion, qid, 'question', true);

        expect(result).toEqual({ error: 'Error when resolving the reported object: err' });
      });
    });

    describe('saveUserReport', () => {
      test('should save a report', async () => {
        mockingoose(UserReportModel).toReturn(r1, 'create');

        const result = await saveUserReport(r1);

        expect(result).toMatchObject(r1);
      });

      test('should save a report', async () => {
        jest.spyOn(UserReportModel, 'create').mockRejectedValue(new Error('err'));

        const result = await saveUserReport(r1);

        expect(result).toEqual({ error: 'Error when saving a comment: err' });
      });

      test('should save a report', async () => {
        const badReport = { ...r1, text: undefined as unknown as string };
        mockingoose(UserReportModel).toReturn(badReport, 'create');

        const result = await saveUserReport(badReport);

        expect(result).toEqual({ error: 'Error when saving a comment: Invalid report' });
      });
    });
    describe('fetchUnresolvedReports', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });

      test('should return nothing if there are no reported questions', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');

        const result = (await fetchUnresolvedReports('question')) as unknown as UserReport[];

        expect(result.length).toEqual(0);
      });

      test('should return nothing if there are no reported answers', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');

        const result = (await fetchUnresolvedReports('answer')) as unknown as UserReport[];

        expect(result.length).toEqual(0);
      });

      test('should return an error if a mongoDB operation fails', async () => {
        mockingoose(QuestionModel).toReturn(new Error('err'), 'find');

        const result = await fetchUnresolvedReports('answer');

        expect(result).toEqual({ error: 'Error when fetching the reported objects' });
      });

      test('should receive empty array if type is incorrect', async () => {
        const result = await fetchUnresolvedReports('answerz' as 'answer');

        expect(result).toEqual([]);
      });

      test('should return reports on questions in a list of questions ', async () => {
        mockingoose(QuestionModel).toReturn(
          QUESTIONSREPORTED.filter(q => q.reports.length > 0).map(q => ({ ...q, reports: [r2] })),
          'find',
        );

        const result = (await fetchUnresolvedReports('question')) as unknown as UserReport[];

        expect(result.length).toEqual(1);
      });
    });

    test('should return reports on answers in a list of questions', async () => {
      mockingoose(QuestionModel).toReturn(
        QUESTIONSREPORTED.map(question => {
          question.answers = (question.answers as Answer[]).filter(
            answer => answer.reports && answer.reports.length > 0,
          );
          return question;
        }),
        'find',
      );

      const result = (await fetchUnresolvedReports('answer')) as unknown as UserReport[];

      expect(result.length).toEqual(2);
    });

    describe('reportResolvedNotification', () => {
      beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
      });

      it('should create and save a notification when a new report is dismissed', async () => {
        const r4: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af79'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'dismissed',
        };

        const mockQuestionId = new Types.ObjectId();

        const expectedNotification = {
          user: 'user1',
          type: 'report',
          caption:
            'Your report was dismissed by a moderator, the reported post was not taken down.',
          read: false,
          redirectUrl: `/question/${mockQuestionId}`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await reportResolvedNotification(r4, mockQuestionId.toString(), false);

        // Verify the result
        expect(result).toMatchObject({
          user: expectedNotification.user,
          type: expectedNotification.type,
          caption: expectedNotification.caption,
          read: expectedNotification.read,
          redirectUrl: expectedNotification.redirectUrl,
        });

        // Verify createdAt is a recent date
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Date.now() - result.createdAt.getTime()).toBeLessThan(1000);
      });

      it('should create and save a notification when a new report is removed', async () => {
        const r4: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af79'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'removed',
        };

        const mockQuestionId = new Types.ObjectId();

        const expectedNotification = {
          user: 'user1',
          type: 'report',
          caption: 'Your report was accepted by a moderator, and the post is now removed!',
          read: false,
          redirectUrl: `home`,
        };

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await reportResolvedNotification(r4, mockQuestionId.toString(), true);

        // Verify the result
        expect(result).toMatchObject({
          user: expectedNotification.user,
          type: expectedNotification.type,
          caption: expectedNotification.caption,
          read: expectedNotification.read,
          redirectUrl: expectedNotification.redirectUrl,
        });

        // Verify createdAt is a recent date
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Date.now() - result.createdAt.getTime()).toBeLessThan(1000);
      });

      it('should create notification with correct redirect URL on dismiss', async () => {
        const r4: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af79'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'dismissed',
        };
        const mockQuestionId = new Types.ObjectId('507f1f77bcf86cd799439011');

        const result = await reportResolvedNotification(r4, mockQuestionId.toString(), false);

        // Verify the redirect URL format
        expect(result.redirectUrl).toBe('/question/507f1f77bcf86cd799439011');
      });

      it('should create notification with correct redirect URL on removed', async () => {
        const r4: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af79'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'removed',
        };
        const mockQuestionId = new Types.ObjectId('507f1f77bcf86cd799439011');

        const result = await reportResolvedNotification(r4, mockQuestionId.toString(), true);

        // Verify the redirect URL format
        expect(result.redirectUrl).toBe('home');
      });

      it('should create notification with correct caption format when dismissed', async () => {
        const r4: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af79'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'dismissed',
        };
        const mockQuestionId = new Types.ObjectId('507f1f77bcf86cd799439011');

        const result = await reportResolvedNotification(r4, mockQuestionId.toString(), false);

        // Verify the caption format
        expect(result.caption).toBe(
          'Your report was dismissed by a moderator, the reported post was not taken down.',
        );
      });

      it('should create notification with correct caption format when removed', async () => {
        const r5: UserReport = {
          _id: new ObjectId('65e9b786ff0e893116b2af78'),
          text: R3_TEXT,
          reportBy: 'user1',
          reportDateTime: new Date(),
          status: 'dismissed',
        };
        const mockQuestionId = new Types.ObjectId('507f1f77bcf86cd799439011');

        const result = await reportResolvedNotification(r5, mockQuestionId.toString(), true);

        // Verify the caption format
        expect(result.caption).toBe(
          'Your report was accepted by a moderator, and the post is now removed!',
        );
      });
    });
  });

  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getAllMessages', () => {
      test('get a list of all the messages in MessageModel', async () => {
        mockingoose(MessageModel).toReturn(MESSAGES, 'find');

        const result = await getAllMessages();

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual(MESSAGES[0]._id);
        expect(result[1]._id?.toString()).toEqual(MESSAGES[1]._id);
        expect(result[2]._id?.toString()).toEqual(MESSAGES[2]._id);
      });
      test('returns an empty list if there are no messages in the model', async () => {
        mockingoose(MessageModel).toReturn([] as Message[], 'find');

        const result = await getAllMessages();

        expect(result.length).toEqual(0);
      });
    });

    describe('getAllCorrespondences', () => {
      test('get a list of all the correspondences in CorrespondenceModel', async () => {
        mockingoose(CorrespondenceModel).toReturn(CORRESPONDENCES, 'find');

        const result = await getAllCorrespondences();

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual(CORRESPONDENCES[0]._id);
        expect(result[1]._id?.toString()).toEqual(CORRESPONDENCES[1]._id);
      });
      test('returns an empty list if there are no corerspondences in the model', async () => {
        mockingoose(CorrespondenceModel).toReturn([] as Correspondence[], 'find');

        const result = await getAllCorrespondences();

        expect(result.length).toEqual(0);
      });
    });

    describe('filterQuestionsByCommenter', () => {
      const sampleComment1 = {
        _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
        text: 'comment1',
        commentBy: 'ansBy4',
        commentDateTime: new Date('2023-11-16T09:24:00'),
      } as Comment;

      const sampleComment2 = {
        _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
        text: 'comment2',
        commentBy: 'ansBy4',
        commentDateTime: new Date('2023-11-16T09:24:00'),
      } as Comment;

      const sampleQuestion1 = {
        _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
        title: 'Quick question about storage on android',
        text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
        tags: [tag3, tag2],
        answers: [ans4, { ...ans2, comments: [sampleComment1] }],
        askedBy: 'q_by1',
        askDateTime: new Date('2023-11-16T09:24:00'),
        views: ['question1_user', 'question2_user'],
        upVotes: [],
        downVotes: [],
        comments: [],
        reports: [],
        isRemoved: false,
      };
      const sampleQuestion3 = {
        _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
        title: 'Is there a language to write programmes by pictures?',
        text: 'Does something like that exist?',
        tags: [],
        answers: [ans5],
        askedBy: 'q_by3',
        askDateTime: new Date('2023-11-19T09:24:00'),
        views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
        upVotes: [],
        downVotes: [],
        comments: [sampleComment2],
        reports: [],
        isRemoved: false,
      };

      test('Gets a list of questions that contain a users comments', async () => {
        mockingoose(CommentModel).toReturn([sampleComment1, sampleComment2], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion3], 'find', 1);
        mockingoose(AnswerModel).toReturn([{ ...ans2, comments: [sampleComment1] }], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion3, sampleQuestion1], 'find', 2);

        const result = await filterQuestionsByCommenter('ansBy4');

        expect(result.length).toEqual(2);
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });
      test('Should only return question comments if that is the only place theyve commented', async () => {
        mockingoose(CommentModel).toReturn([sampleComment1, sampleComment2], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion3], 'find', 1);
        mockingoose(AnswerModel).toReturn([], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion3], 'find', 2);

        const result = await filterQuestionsByCommenter('ansBy4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('Should only return answer comments if that is the only place theyve commented', async () => {
        mockingoose(CommentModel).toReturn([], 'find');
        mockingoose(QuestionModel).toReturn([], 'find', 1);
        mockingoose(AnswerModel).toReturn([{ ...ans2, comments: [sampleComment1] }], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion1], 'find', 2);

        const result = await filterQuestionsByCommenter('ansBy4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('returns an empty list if the user has not commented anywhere', async () => {
        mockingoose(CommentModel).toReturn([], 'find');
        mockingoose(QuestionModel).toReturn([], 'find', 1);
        mockingoose(AnswerModel).toReturn([], 'find');
        mockingoose(QuestionModel).toReturn([], 'find', 2);

        const result = await filterQuestionsByCommenter('ansBy4');

        expect(result.length).toEqual(0);
      });

      test('returns an empty list if the AnswerModel call returns an error', async () => {
        mockingoose(CommentModel).toReturn([sampleComment1, sampleComment2], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion3], 'find', 1);
        mockingoose(AnswerModel).toReturn({ error: 'Error retrieving answer' }, 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion1], 'find', 2);

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });

      test('returns an empty list if the Comment Model call returns an error', async () => {
        mockingoose(CommentModel).toReturn({ error: 'Error retrieving answer' }, 'find');
        mockingoose(QuestionModel).toReturn([], 'find', 1);
        mockingoose(AnswerModel).toReturn([{ ...ans2, comments: [sampleComment1] }], 'find');
        mockingoose(QuestionModel).toReturn([], 'find', 2);

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });

      test('returns an empty list if the Question Model call returns an error', async () => {
        mockingoose(CommentModel).toReturn([sampleComment1, sampleComment2], 'find');
        mockingoose(QuestionModel).toReturn(new Error(''), 'find', 1);
        mockingoose(AnswerModel).toReturn([{ ...ans2, comments: [sampleComment1] }], 'find');
        mockingoose(QuestionModel).toReturn(new Error(''), 'find', 2);

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });
    });

    describe('filterQuestionsByAnswerer', () => {
      test('Gets a list of questions that are answered by the given user', async () => {
        const sampleQuestion1 = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans4, ans2],
          askedBy: 'q_by1',
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          reports: [],
          isRemoved: false,
        };
        const sampleQuestion3 = {
          _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
          title: 'Is there a language to write programmes by pictures?',
          text: 'Does something like that exist?',
          tags: [],
          answers: [ans5],
          askedBy: 'q_by3',
          askDateTime: new Date('2023-11-19T09:24:00'),
          views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          reports: [],
          isRemoved: false,
        };

        mockingoose(AnswerModel).toReturn([ans4, ans5], 'find');
        mockingoose(QuestionModel).toReturn([sampleQuestion1, sampleQuestion3], 'find');

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('returns an empty list if the user has not answered any questions', async () => {
        mockingoose(AnswerModel).toReturn([], 'find');
        mockingoose(QuestionModel).toReturn([], 'find');

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });

      test('returns an empty list if the AnswerModel call returns an error', async () => {
        mockingoose(AnswerModel).toReturn({ error: 'Error retrieving answers' }, 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });

      test('returns an empty list if the QuestionModel call returns an error', async () => {
        mockingoose(AnswerModel).toReturn([ans4, ans5], 'find');
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await filterQuestionsByAnswerer('ansBy4');

        expect(result.length).toEqual(0);
      });
    });

    describe('getAllUsers', () => {
      test('get a list of all the users in UserModel, sorted by username alphabetically', async () => {
        mockingoose(UserModel).toReturn(USERS, 'find');

        const result = await getAllUsers();

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b786ff0e893116b2af69');
        expect(result[2]._id?.toString()).toEqual('65e9b786ff0e893116b2af70');
      });

      test('returns an empty list if there are no users in the model', async () => {
        mockingoose(UserModel).toReturn([] as User[], 'find');

        const result = await getAllUsers();

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchCorrespondenceById', () => {
      test('fetchCorrespondenceById should return correspondence', async () => {
        mockingoose(CorrespondenceModel).toReturn(correspondence1, 'findOne');
        QuestionModel.schema.path('messages', Object);

        const result = (await fetchCorrespondenceById(correspondence1._id || '')) as Correspondence;

        expect(result.views.length).toEqual(0);
        expect(result.views).toEqual(correspondence1.views);
        expect(result._id?.toString()).toEqual(correspondence1._id);
        expect(result.messageMembers).toEqual(correspondence1.messageMembers);
        expect(result.userTyping).toEqual(correspondence1.userTyping);
      });

      test('fetchCorrespondenceById should return null if id does not exist', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOne');

        const result = (await fetchCorrespondenceById('incorrect_cid')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching a correspondence');
      });

      test('fetchCorrespondenceById should return an object with error if findOne throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOne');

        const result = (await fetchCorrespondenceById(correspondence1._id || '')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching a correspondence');
      });
    });

    describe('fetchAndIncrementMessageViewsById', () => {
      test('fetchAndIncrementMessageViewsById should return message and add the user to the list of views if new', async () => {
        mockingoose(MessageModel).toReturn(
          { ...message1, views: ['tgwynn', ...message1.views] },
          'findOneAndUpdate',
        );

        const result = (await fetchAndIncrementMessageViewsById(
          message1._id || '',
          'tgwynn',
        )) as Message;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['tgwynn', ...message1.views]);
        expect(result._id?.toString()).toEqual(message1._id);
        expect(result.messageText).toEqual(message1.messageText);
        expect(result.messageDateTime).toEqual(message1.messageDateTime);
        expect(result.messageBy).toEqual(message1.messageBy);
        expect(result.messageTo).toEqual(message1.messageTo);
      });

      test('fetchAndIncrementMessageViewsById should return message and not add the user to the list of views if already viewed by them', async () => {
        mockingoose(MessageModel).toReturn({ ...message1 }, 'findOneAndUpdate');

        const result = (await fetchAndIncrementMessageViewsById(
          message1._id || '',
          'isuzuki',
        )) as Message;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(message1.views);
        expect(result._id?.toString()).toEqual(message1._id);
        expect(result.messageText).toEqual(message1.messageText);
        expect(result.messageDateTime).toEqual(message1.messageDateTime);
        expect(result.messageBy).toEqual(message1.messageBy);
        expect(result.messageTo).toEqual(message1.messageTo);
      });

      test('fetchAndIncrementMessageViewsById should return null if id does not exist', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementMessageViewsById('incorrect_cid', 'isuzuki')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a message');
      });

      test('fetchAndIncrementMessageViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementMessageViewsById(message2._id || '', 'isuzuki')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a message');
      });
    });

    describe('fetchAndIncrementCorrespondenceViewsById', () => {
      test('fetchAndIncrementCorrespondenceViewsById should return correspondence and add the user to the list of views if new', async () => {
        mockingoose(CorrespondenceModel).toReturn(
          { ...correspondence1, views: ['isuzuki', ...correspondence1.views] },
          'findOneAndUpdate',
        );
        CorrespondenceModel.schema.path('messages', Object);

        const result = (await fetchAndIncrementCorrespondenceViewsById(
          correspondence1._id,
          'isuzuki',
        )) as Correspondence;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['isuzuki']);
        expect(result._id?.toString()).toEqual(correspondence1._id);
        expect(result.messages).toEqual(correspondence1.messages);
        expect(result.messageMembers).toEqual(correspondence1.messageMembers);
        expect(result.userTyping).toEqual(correspondence1.userTyping);
      });

      test('fetchAndIncrementCorrespondenceViewsById should return correspondence and not add the user to the list of views if already viewed by them', async () => {
        mockingoose(CorrespondenceModel).toReturn({ ...correspondence2 }, 'findOneAndUpdate');
        CorrespondenceModel.schema.path('messages', Object);

        const result = (await fetchAndIncrementCorrespondenceViewsById(
          correspondence2._id,
          'isuzuki',
        )) as Correspondence;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['isuzuki']);
        expect(result._id?.toString()).toEqual(correspondence2._id);
        expect(result.messages).toEqual(correspondence2.messages);
        expect(result.messageMembers).toEqual(correspondence2.messageMembers);
        expect(result.userTyping).toEqual(correspondence2.userTyping);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementCorrespondenceViewsById(
          'incorrect_cid',
          'isuzuki',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a correspondence');
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementCorrespondenceViewsById(
          correspondence2._id,
          'isuzuki',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a correspondence');
      });
    });

    describe('updateCorrespondenceById', () => {
      test('updateCorrespondenceById should return the updated correspondence with the given list of messageMembers', async () => {
        mockingoose(CorrespondenceModel).toReturn(
          { ...correspondence2, messageMembers: ['isuzuki', 'tgwynn', 'hwagner', 'bruth'] },
          'findOneAndUpdate',
        );
        CorrespondenceModel.schema.path('messages', Object);

        const result = (await updateCorrespondenceById(correspondence2._id, [
          'isuzuki',
          'tgwynn',
          'hwagner',
          'bruth',
        ])) as Correspondence;

        expect(result.views).toEqual(correspondence2.views);
        expect(result._id?.toString()).toEqual(correspondence2._id);
        expect(result.messages).toEqual(correspondence2.messages);
        expect(result.messageMembers).toEqual(['isuzuki', 'tgwynn', 'hwagner', 'bruth']);
        expect(result.userTyping).toEqual(correspondence2.userTyping);
      });

      test('updateCorrespondenceById should return null if id does not exist', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceById('incorrect_cid', ['isuzuki'])) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });

      test('updateCorrespondenceById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceById(correspondence2._id, ['isuzuki'])) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });
    });

    describe('updateCorrespondenceUserTypingByIdNames', () => {
      test('updateCorrespondenceUserTypingByIdNames should return the updated correspondence with the given username to push', async () => {
        mockingoose(CorrespondenceModel).toReturn(
          { ...correspondence2, userTyping: ['isuzuki'] },
          'findOneAndUpdate',
        );
        CorrespondenceModel.schema.path('messages', Object);

        const result = (await updateCorrespondenceUserTypingByIdNames(
          correspondence2._id,
          'isuzuki',
          true,
        )) as Correspondence;

        expect(result.views).toEqual(correspondence2.views);
        expect(result._id?.toString()).toEqual(correspondence2._id);
        expect(result.messages).toEqual(correspondence2.messages);
        expect(result.messageMembers).toEqual(correspondence2.messageMembers);
        expect(result.userTyping).toEqual(['isuzuki']);
      });

      test('updateCorrespondenceById should return null if id does not exist', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceUserTypingByIdNames(
          'incorrect_cid',
          'isuzuki',
          true,
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });

      test('updateCorrespondenceById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceUserTypingByIdNames(
          correspondence2._id,
          'isuzuki',
          true,
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });
    });

    describe('updateCorrespondenceViewsById', () => {
      test('updateCorrespondenceViewsById should return the updated correspondence with the additional given viewer', async () => {
        mockingoose(CorrespondenceModel).toReturn(
          { ...correspondence2, views: [...correspondence2.views, 'bruth'] },
          'findOneAndUpdate',
        );
        CorrespondenceModel.schema.path('messages', Object);

        const result = (await updateCorrespondenceViewsById(
          correspondence2._id,
          'bruth',
        )) as Correspondence;

        expect(result.views).toEqual([...correspondence2.views, 'bruth']);
        expect(result._id?.toString()).toEqual(correspondence2._id);
        expect(result.messages).toEqual(correspondence2.messages);
        expect(result.messageMembers).toEqual(correspondence2.messageMembers);
        expect(result.userTyping).toEqual(correspondence2.userTyping);
      });

      test('updateCorrespondenceViewsById should return null if id does not exist', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceViewsById('incorrect_cid', 'isuzuki')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });

      test('updateCorrespondenceViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateCorrespondenceViewsById(correspondence2._id, 'isuzuki')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating correspondence');
      });
    });

    describe('updateMessageViewsById', () => {
      test('updateMessageViewsById should return the updated message with the additional given viewer', async () => {
        mockingoose(MessageModel).toReturn(
          { ...message1, views: [...message1.views, 'tgwynn'] },
          'findOneAndUpdate',
        );

        const result = (await updateMessageViewsById(message1._id || '', 'tgwynn')) as Message;

        expect(result.views).toEqual([...message1.views, 'tgwynn']);
        expect(result._id?.toString()).toEqual(message1._id);
        expect(result.messageText).toEqual(message1.messageText);
        expect(result.messageBy).toEqual(message1.messageBy);
        expect(result.messageTo).toEqual(message1.messageTo);
        expect(result.messageDateTime).toEqual(message1.messageDateTime);
      });

      test('updateMessageViewsById should return null if id does not exist', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageViewsById('incorrect_cid', 'tgwynn')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating message');
      });

      test('updateMessageViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageViewsById(message1._id || '', 'tgwynn')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating message');
      });
    });

    describe('updateMessageEmojisById', () => {
      test('updateMessageEmojisById should return the updated message with the additional emojis', async () => {
        mockingoose(MessageModel).toReturn(
          { ...message1, emojiTracker: { ichiro: 'happy', tgwynn: 'sad' } },
          'findOneAndUpdate',
        );

        const result = (await updateMessageEmojisById(message1._id || '', {
          ichiro: 'happy',
          tgwynn: 'sad',
        })) as Message;

        expect(result.views).toEqual(message1.views);
        expect(result._id?.toString()).toEqual(message1._id);
        expect(result.messageText).toEqual(message1.messageText);
        expect(result.messageBy).toEqual(message1.messageBy);
        expect(result.messageTo).toEqual(message1.messageTo);
        expect(result.messageDateTime).toEqual(message1.messageDateTime);
        // expect(result.emojiTracker?new Map(result.emojiTracker.toObject()):'').toEqual(expect.objectContaining({'ichiro': 'happy', 'tgwynn': 'sad'}));
      });

      test('updateMessageEmojisById should return null if id does not exist', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageEmojisById('incorrect_cid', {
          ichiro: 'happy',
          tgwynn: 'sad',
        })) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating messages emojis');
      });

      test('updateMessageEmojisById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageEmojisById(message1._id || '', {
          ichiro: 'happy',
          tgwynn: 'sad',
        })) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating messages emojis');
      });
    });

    describe('updateMessageIsDeletedById', () => {
      test('updateMessageIsDeletedById should return the updated message with the updated isDeleted value', async () => {
        mockingoose(MessageModel).toReturn(
          { ...message1, emojiTracker: { ichiro: 'happy', tgwynn: 'sad' } },
          'findOneAndUpdate',
        );

        const result = (await updateMessageIsDeletedById(message1._id || '', true)) as Message;

        expect(result.views).toEqual(message1.views);
        expect(result._id?.toString()).toEqual(message1._id);
        expect(result.messageText).toEqual(message1.messageText);
        expect(result.messageBy).toEqual(message1.messageBy);
        expect(result.messageTo).toEqual(message1.messageTo);
        expect(result.messageDateTime).toEqual(message1.messageDateTime);
      });

      test('updateMessageIsDeletedById should return null if id does not exist', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageIsDeletedById('incorrect_cid', true)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating messages isDeleted');
      });

      test('updateMessageIsDeletedById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageIsDeletedById(message1._id || '', true)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating messages isDeleted');
      });
    });

    describe('updateMessageById', () => {
      test('updateMessageById should return the updated messages correspondence with the updated text and isCodeStyle value', async () => {
        const expectedMessage = {
          ...message1,
          messageText: 'updated Message txt',
          isCodeStyle: true,
        };
        mockingoose(MessageModel).toReturn(expectedMessage, 'findOneAndUpdate');
        const expectedCorrespondence = {
          messages: [expectedMessage],
          messageMembers: ['isuzuki', 'tgwynn'],
          views: [],
          userTyping: [],
        } as Correspondence;
        mockingoose(CorrespondenceModel).toReturn(expectedCorrespondence, 'findOne');

        const result = (await updateMessageById(
          message1._id || '',
          'updated Message txt',
          true,
        )) as Correspondence;

        expect(result.views).toEqual([...expectedCorrespondence.views]);
        expect(result.messages).toEqual([expectedMessage]);
        expect(result.messageMembers).toEqual(['isuzuki', 'tgwynn']);
        expect(result.views).toEqual([]);
        expect(result.userTyping).toEqual([]);
        expect(result.messages[0].messageText).toEqual('updated Message txt');
        expect(result.messages[0].isCodeStyle).toEqual(true);
        expect(result.messages[0]._id).toEqual(message1._id);
      });

      test('updateMessageById should return null if id does not exist', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageById('incorrect_cid', 'updated Message txt', true)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating message');
      });

      test('updateMessageById should return an object with error if findOneAndUpdate throws an error for MessageModel', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageById(
          message1._id || '',
          'updated Message txt',
          true,
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when updating message');
      });

      test('updateMessageById should return an object with error if findOneAndUpdate throws an error for CorrespondenceModel', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await updateMessageById(
          message1._id || '',
          'updated Message txt',
          true,
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when retrieving updated correspondence');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveMessage', () => {
      test('saveMessage should return the saved message', async () => {
        const mockMessage = {
          _id: '65e9b5a995b6c7045a30d823',
          messageText: 'fake message',
          messageDateTime: new Date(),
          messageBy: 'ichiro',
          messageTo: ['osmith', 'laparicio'],
          isCodeStyle: false,
          views: [],
          isDeleted: false,
        };

        const result = (await saveMessage(mockMessage)) as Message;

        expect(result._id).toBeDefined();
        expect(result.messageText).toEqual(mockMessage.messageText);
        expect(result.messageDateTime).toEqual(mockMessage.messageDateTime);
        expect(result.messageBy).toEqual(mockMessage.messageBy);
        expect(result.messageTo).toEqual(mockMessage.messageTo);
        expect(result.isCodeStyle).toEqual(mockMessage.isCodeStyle);
        expect(result.views).toEqual(mockMessage.views);
      });
    });

    describe('saveCorrespondence', () => {
      test('saveCorrespondence should return the saved correspondence', async () => {
        const mockCorrespondence = {
          _id: '65e9b5a995b6c7045a30d823',
          messages: [],
          messageMembers: ['osmith', 'laparicio', 'ichiro'],
          views: [],
          userTyping: [],
        };

        const result = (await saveCorrespondence(mockCorrespondence)) as Correspondence;

        expect(result._id).toBeDefined();
        expect(result.messages).toEqual(mockCorrespondence.messages);
        expect(result.messageMembers).toEqual(mockCorrespondence.messageMembers);
        expect(result.views).toEqual(mockCorrespondence.views);
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
          reports: [],
          isRemoved: false,
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });

    describe('saveQuestionCommentNotification', () => {
      test('should create and save a notification for a valid question and comment', async () => {
        const mockQuestionId = new ObjectId('64b3b8a59c9055c8db6e8823');
        const mockQuestion = {
          _id: mockQuestionId,
          askedBy: 'questionAuthor',
        };

        const mockComment = {
          commentBy: 'dummyUser',
          text: 'This is a test comment',
          commentDateTime: new Date(),
        };

        const expectedNotification = {
          user: 'questionAuthor',
          type: 'comment',
          caption: 'dummyUser commented on your question',
          read: false,
          createdAt: new Date(),
          redirectUrl: `/question/64b3b8a59c9055c8db6e8823`,
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(NotificationModel).toReturn(expectedNotification, 'create');

        const result = await saveQuestionCommentNotification(
          mockQuestionId.toString(),
          mockComment,
        );

        expect(result.caption).toEqual(expectedNotification.caption);
        expect(result.read).toEqual(expectedNotification.read);
        expect(result.redirectUrl).toEqual(expectedNotification.redirectUrl);
        expect(result.type).toEqual(expectedNotification.type);
        expect(result.user).toEqual(expectedNotification.user);
      });

      test('should throw an error if the question is not found', async () => {
        const invalidQuestionId = new ObjectId('64b3b8a59c9055c8db6e9999'); // Invalid question ID
        const mockComment = {
          commentBy: 'dummyUser',
          text: 'This is a test comment',
          commentDateTime: new Date(),
        };

        // Mocking database call to return null (question not found)
        mockingoose(QuestionModel).toReturn(null, 'findById');

        try {
          await saveQuestionCommentNotification(invalidQuestionId.toString(), mockComment);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });

      test('should throw an error if there is an issue creating the notification', async () => {
        const mockQuestionId = new ObjectId('64b3b8a59c9055c8db6e8823');
        const mockQuestion = {
          _id: mockQuestionId,
          askedBy: 'questionAuthor',
        };

        const mockComment = {
          commentBy: 'dummyUser',
          text: 'This is a test comment',
          commentDateTime: new Date(),
        };

        // Mocking database call to return the question
        mockingoose(QuestionModel).toReturn(mockQuestion, 'findById');

        // Mocking NotificationModel.create to simulate an error
        mockingoose(NotificationModel).toReturn(
          { error: 'Notification creation failed' },
          'create',
        );

        try {
          await saveQuestionCommentNotification(mockQuestionId.toString(), mockComment);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('Message model', () => {
    describe('addMessageToCorrespondence', () => {
      test('addMessageToCorrespondence should return the updated correspondence, with one more message and the same views as the message', async () => {
        const expectedCorrespondence = {
          ...correspondence1,
          messages: [...correspondence1.messages, message2],
          views: message2.views,
        };

        mockingoose(CorrespondenceModel).toReturn(expectedCorrespondence, 'findOneAndUpdate');

        const result = (await addMessageToCorrespondence(
          correspondence1._id,
          message2,
        )) as Correspondence;

        expect(result._id ? result._id.toString() : '').toEqual(correspondence1._id);
        expect(result.messages.length).toEqual(correspondence1.messages.length + 1);
        expect(result.messages).toContain(message2);
        expect(result.views).toEqual(message2.views);
      });

      test('addMessageToCorrespondence should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(CorrespondenceModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await addMessageToCorrespondence(correspondence1._id, message2)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when adding message to correspondence');
      });

      test('addMessageToCorrespondence should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(CorrespondenceModel).toReturn(null, 'findOneAndUpdate');

        const result = (await addMessageToCorrespondence(correspondence1._id, message2)) as {
          error: string;
        };

        expect(result.error).toEqual('Error when adding message to correspondence');
      });

      test('addMessageToCorrespondence should throw an error if a required field is missing in the message', async () => {
        const invalidMessage: Partial<Message> = {
          messageText: 'This is an answer text',
          messageBy: 'user123',
          messageTo: ['ichiro', 'tgwynn'], // Missing messageDateTime
        };

        const cid = 'validCorrespondenceId';

        try {
          await addMessageToCorrespondence(cid, invalidMessage as Message);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid message');
        }
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });

    describe('saveAnswerCommentNotification', () => {
      const mockAnswerId = '64b3b8a59c9055c8db6e8823';
      const mockComment = {
        commentBy: 'dummyUser',
        text: 'This is a test comment',
        commentDateTime: new Date(),
      };

      beforeEach(() => {
        jest.clearAllMocks();
      });

      test('should create and save a notification for a valid answer and comment', async () => {
        const mockAnswer = {
          _id: new ObjectId(mockAnswerId),
          ansBy: 'answerAuthor',
        };
        const mockQuestion = {
          _id: new ObjectId('64b3b8a59c9055c8db6e8823'),
          answers: [new ObjectId(mockAnswerId)],
        };
        const mockNotification = {
          user: 'answerAuthor',
          type: 'comment',
          caption: 'dummyUser commented on your answer',
          read: false,
          createdAt: new Date(),
          redirectUrl: '/question/64b3b8a59c9055c8db6e8823',
        };

        mockingoose(AnswerModel).toReturn(mockAnswer, 'findOne');
        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(NotificationModel).toReturn(mockNotification, 'create');

        const result = await saveAnswerCommentNotification(mockAnswerId, mockComment);

        expect(result).toMatchObject({
          user: mockNotification.user,
          type: mockNotification.type,
          caption: mockNotification.caption,
          read: mockNotification.read,
          redirectUrl: mockNotification.redirectUrl,
        });
      });

      test('should throw an error if answer is not found', async () => {
        mockingoose(AnswerModel).toReturn(null, 'findById');

        try {
          await saveAnswerCommentNotification(mockAnswerId, mockComment);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });

      test('should throw an error if question is not found for the answer', async () => {
        const mockAnswer = {
          _id: mockAnswerId,
          ansBy: 'answerAuthor',
        };

        mockingoose(AnswerModel).toReturn(mockAnswer, 'findById');
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        try {
          await saveAnswerCommentNotification(mockAnswerId, mockComment);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });

      test('should throw an error if notification creation fails', async () => {
        const mockAnswer = {
          _id: mockAnswerId,
          ansBy: 'answerAuthor',
        };
        const mockQuestion = {
          _id: new ObjectId('64b3b8a59c9055c8db6e8823'),
          answers: [new ObjectId(mockAnswerId)],
        };

        mockingoose(AnswerModel).toReturn(mockAnswer, 'findById');
        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(NotificationModel).toReturn(
          { error: 'Notification creation failed' },
          'create',
        );

        try {
          await saveAnswerCommentNotification(mockAnswerId, mockComment);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
        }
      });
    });

    describe('saveAnswerNotification', () => {
      beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
      });

      it('should create and save a notification when a new answer is posted', async () => {
        // Setup mock data
        const mockQuestionId = new Types.ObjectId();
        const mockQuestion = {
          _id: mockQuestionId,
          askedBy: 'questionAuthor',
          title: 'Test Question',
        };

        const mockAnswer: Answer = {
          ansBy: 'answerAuthor',
          text: 'This is a test answer',
          ansDateTime: new Date(),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };

        const expectedNotification = {
          user: 'questionAuthor',
          type: 'answer',
          caption: 'answerAuthor answered your question',
          read: false,
          redirectUrl: `/question/${mockQuestionId.toString()}`,
        };

        // Mock QuestionModel.findById().exec()
        mockingoose(QuestionModel).toReturn(
          (query: { op: string; _conditions: { _id: { toString: () => string } } }) => {
            if (
              query.op === 'findOne' &&
              query._conditions._id.toString() === mockQuestionId.toString()
            ) {
              return mockQuestion;
            }
            return null;
          },
          'findOne',
        );

        // Mock NotificationModel.create()
        mockingoose(NotificationModel).toReturn(
          () => ({
            ...expectedNotification,
            _id: new Types.ObjectId(),
            createdAt: new Date(),
            __v: 0,
          }),
          'save',
        );

        // Execute the function
        const result = await saveAnswerNotification(mockQuestionId.toString(), mockAnswer);

        // Verify the result
        expect(result).toMatchObject({
          user: expectedNotification.user,
          type: expectedNotification.type,
          caption: expectedNotification.caption,
          read: expectedNotification.read,
          redirectUrl: expectedNotification.redirectUrl,
        });

        // Verify createdAt is a recent date
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Date.now() - result.createdAt.getTime()).toBeLessThan(1000);
      });

      it('should throw an error when question is not found', async () => {
        const nonExistentId = new Types.ObjectId();
        const mockAnswer: Answer = {
          ansBy: 'answerAuthor',
          text: 'This is a test answer',
          ansDateTime: new Date(),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };

        // Mock QuestionModel to return null
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        // Verify error is thrown
        await expect(saveAnswerNotification(nonExistentId.toString(), mockAnswer)).rejects.toThrow(
          'Question not found',
        );
      });

      it('should create notification with correct redirect URL', async () => {
        const mockQuestionId = new Types.ObjectId('507f1f77bcf86cd799439011');
        const mockQuestion = {
          _id: mockQuestionId,
          askedBy: 'questionAuthor',
          title: 'Test Question',
        };

        const mockAnswer: Answer = {
          ansBy: 'answerAuthor',
          text: 'This is a test answer',
          ansDateTime: new Date(),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };

        // Mock the database calls
        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');

        const result = await saveAnswerNotification(mockQuestionId.toString(), mockAnswer);

        // Verify the redirect URL format
        expect(result.redirectUrl).toBe('/question/507f1f77bcf86cd799439011');
      });

      it('should create notification with correct caption format', async () => {
        const mockQuestionId = new Types.ObjectId();
        const mockQuestion = {
          _id: mockQuestionId,
          askedBy: 'questionAuthor',
          title: 'Test Question',
        };

        const mockAnswer: Answer = {
          ansBy: 'testUser123',
          text: 'This is a test answer',
          ansDateTime: new Date(),
          comments: [],
          reports: [],
          isRemoved: false,
          endorsed: false,
        };

        // Mock the database calls
        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');

        const result = await saveAnswerNotification(mockQuestionId.toString(), mockAnswer);

        // Verify the caption format
        expect(result.caption).toBe('testUser123 answered your question');
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should not return the tag if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBeUndefined();
      });

      test('getTagCountMap should not return tags if a question is removed', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1, tag2], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBeUndefined();
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
  });

  describe('Badge model', () => {
    describe('saveBadge', () => {
      test('saveBadge should return the saved badge', async () => {
        const result = (await saveBadge(badge1)) as Badge;

        expect(result._id).toBeDefined();
        expect(result.name).toEqual(badge1.name);
        expect(result.description).toEqual(badge1.description);
        expect(result.category).toEqual(badge1.category);
      });
    });

    describe('getAllBadges', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      test('should return an empty array if an error occurs', async () => {
        jest.spyOn(BadgeModel, 'find').mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        } as unknown as ReturnType<typeof BadgeModel.find>);

        const result = await getAllBadges();
        expect(result).toEqual([]);
      });
    });

    describe('getBadgeUsers', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      test('should return usernames when badge is found and users exist', async () => {
        const badgeName = 'Badge 1';
        const badge = {
          name: badgeName,
          users: ['userId1', 'userId2'],
        };
        const users = [
          { _id: 'userId1', username: 'user1' },
          { _id: 'userId2', username: 'user2' },
        ];

        // Mock BadgeModel.findOne
        jest.spyOn(BadgeModel, 'findOne').mockResolvedValue(badge);

        // Mock UserModel.find with chainable select
        const mockFind = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(users),
        });
        jest.spyOn(UserModel, 'find').mockImplementation(mockFind);

        const result = await getBadgeUsers(badgeName);

        expect(result).toEqual(['user1', 'user2']);
        expect(BadgeModel.findOne).toHaveBeenCalledWith({ name: badgeName });
        expect(UserModel.find).toHaveBeenCalledWith({ _id: { $in: badge.users } });
      });

      test('should return an empty array if badge is not found', async () => {
        const badgeName = 'Nonexistent Badge';

        // Mock BadgeModel.findOne to return null
        jest.spyOn(BadgeModel, 'findOne').mockResolvedValue(null);

        const result = await getBadgeUsers(badgeName);

        expect(result).toEqual([]);
        expect(BadgeModel.findOne).toHaveBeenCalledWith({ name: badgeName });
      });

      test('should return an empty array if badge has no users', async () => {
        const badgeName = 'Badge with No Users';
        const badge = {
          name: badgeName,
          users: [],
        };

        // Mock BadgeModel.findOne
        jest.spyOn(BadgeModel, 'findOne').mockResolvedValue(badge);

        const result = await getBadgeUsers(badgeName);

        expect(result).toEqual([]);
        expect(BadgeModel.findOne).toHaveBeenCalledWith({ name: badgeName });
      });

      test('should return an empty array if an error occurs', async () => {
        const badgeName = 'Badge 1';

        // Mock BadgeModel.findOne to throw an error
        jest.spyOn(BadgeModel, 'findOne').mockRejectedValue(new Error('Database error'));

        const result = await getBadgeUsers(badgeName);

        expect(result).toEqual([]);
        expect(BadgeModel.findOne).toHaveBeenCalledWith({ name: badgeName });
      });
    });
  });
});
