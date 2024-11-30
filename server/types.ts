import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Type representing the possible category options for badges and badgeProgress.
 */
export type BadgeCategory = 'questions' | 'answers' | 'leaderboard' | 'votes' | 'comments';

/**
 * Type representing the possible tiers for a badge.
 */
export type BadgeTier = 'bronze' | 'silver' | 'gold';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 * - endorsed - Boolean for if an answer is endorsed or not
 * - reports - An array of reports associated with the answer.
 * - isRemoved - True if a mod removed answer, otherwise false.
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
  endorsed: boolean
  reports: UserReport[];
  isRemoved: boolean;
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Interface extending the request body when endorsing an answer, which contains
 * - qid - The unique identifier of the question being endorsed
 * - aid - The unique identifier of the answer being endorsed
 * - endorsed - Whether the question is being endorsed or unendorsed
 * - user - The user making the endorsement request
 */
export interface EndorseRequest extends Request {
  body: {
    qid: string;
    aid: string;
    endorsed: boolean;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 * - description - A description of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a User document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - username - Name of the user.
 * - password - Password to login created by the user.
 * - isModerator - the current state of the user's moderator status.
 * - badges - The badges obtained by the user.
 * - infractions - A list of answer/question id's that were removed by moderators
 * - doNotDisturb - Whether or not the user is on dnd.
 */
export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  isModerator: boolean;
  badges: Badge[];
  profileIcon?: string;
  infractions: string[];
  doNotDisturb?: false;
}

/**
 * Interface extending the request body when adding a user to the database which contains:
 * - username - The new user's username.
 * - password - The new user's password.
 */
export interface AddUserRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

/**
 * Interface extending the request body when making a user a moderator in the db:
 * - username - The user being made a moderator.
 */
export interface MakeUserModeratorRequest extends Request {
  body: {
    username: string;
  };
}

/**
 * Interface extending the request body when getting a user's dnd status:
 * - username - The user.
 */
export interface GetUserStatusRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Interface extending the request body when updating a profile icon in the db:
 * - username - The user being updated.
 * - badgeName - The badge being used as a profile icon.
 */
export interface UpdateProfileIconRequest extends Request {
  body: {
    username: string;
    badgeName: string;
  }
}

/**
 * Interface for the request query to find a user using a search string, which contains:
 * - username - The username of the user
 * - password - The password of the user
 */
export interface FindUserRequest extends Request {
  query: {
    username: string;
    password: string;
  };
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface representing a ModApplication document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - user - The user who created the application.
 * - applicationText - The additional imformation provided by the applicant.
 * - status - The current status of the moderator application.
 */
export interface ModApplication {
  _id?: ObjectId;
  user: User;
  applicationText: string;
  status: 'unresolved' | 'accepted' | 'rejected';
}

/**
 * Interface extending the request body when adding a ModApplication to the database which contains:
 * - modApplication - contains the information about the ModAplication being added to the database.
 */
export interface AddModApplicationRequest extends Request {
  body: {
    modApplication: ModApplication;
  };
}

/**
 * Interface extending the request body when deleting a ModApplication to the database which contains:
 * - id - The id of the moderator application in the database
 * - username - The user whose application is being deleted.
 * - accepted - True if the moderator application was accepted, false otherwise.
 */
export interface UpdateModApplicationStatusRequest extends Request {
  body: {
    id: string;
    username: string;
    accepted: boolean;
  };
}

/**
 * Interface extending the request body when finding a ModApplication in the database which contains:
 * - username - the user whose application is being found.
 */
export interface FindModApplicationRequest extends Request {
  query: {
    username: string;
  };
}

/**
 * Type representing the possible responses for a ModApplication related operation.
 */
export type ModApplicationResponse = ModApplication | { error: string };

/**
 * Type representing the possible responses for a ModApplication[] related operation.
 */
export type ModApplicationResponses = ModApplication[] | { error: string };

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 * - reports - An array of reports associated with the question.
 * - isRemoved - True if a mod removed question, otherwise false.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
  reports: UserReport[];
  isRemoved: boolean;
}


/**
 * Interface for the request body when updating a correspondence's userTyping value.
 * - body - The correspondence ID and the new contents of the correspondence
 *  - cid - the unique identifier of the correspondence
 *  - username - The name of the user who will be added or removed to the userTyping array of the correspondence
 *  - push - A boolean determining if the user should be added (pushed) to the userTyping array or not
 */
 export interface UpdateCorrespondenceUserTypingRequestNames extends Request {
  body: {
    cid: string;
    username: string;
    push: boolean
  };
}

/**
 * Interface for the request body when updating a correspondence's userTyping value.
 * - body - The correspondence ID and the new contents of the correspondence
 *  - cid - the unique identifier of the correspondence
 *  - username - the username who is typing or null if no one is typing
 */
 export interface UpdateCorrespondenceViewsRequest extends Request {
  body: {
    cid: string;
    username: string;
  };
}

/**
 * Interface for the request body when updating a message's views value.
 * - body - The correspondence ID and the new contents of the message
 *  - mid - the unique identifier of the message
 *  - username - the username who has just viewed the message
 */
 export interface UpdateMessageViewsRequest extends Request {
  body: {
    mid: string;
    username: string;
  };
}

/**
 * Interface for the request body when updating a message's views value.
 * - body - The correspondence ID and the new contents of the message
 *  - mid - the unique identifier of the message
 *  - emojis - a dictionary where each key is a username, and each value is their chosen emoji
 */
 export interface UpdateMessageEmojisRequest extends Request {
  body: {
    mid: string;
    emojis: {[key: string]: string};
  };
}

/**
 * Interface for the request body when updating a message's views value.
 * - body - The correspondence ID and the new contents of the message
 *  - mid - the unique identifier of the message
 *  - isDeleted - a boolean describing whether or not the current message is deleted
 */
 export interface UpdateMessageIsDeletedRequest extends Request {
  body: {
    mid: string;
    isDeleted: boolean;
  };
}

/**
 * Interface representing the structure of a Message object.
 *
 * - _id - The unique identifier for the message. Optional field.
 * - messageText - The content of the message
 * - messageDateTime - The date and time the message was sent
 * - messageBy - The username of the user who sent the message
 * - messageTo - A list of usernames of users who the message was sent to
 * - views - A list of usernames of users who have viewed the message
 * - isCodeStyle - A boolean describing whether or not the message contains a code cell
 * - fileName - The name of the file given. Optional field.
 * - fileData - A Unit8Array describing the contents of the file. Optional field
 * - emojiTracker - A map where each key is a user, and each value is their corresponding emoji reaction for the message. Optional Field
 * - isDeleted - A boolean describing whether or not the message has been deleted
 */
 export interface Message {
  _id?: string,
  messageText: string,
  messageDateTime: Date,
  messageBy: string,
  messageTo: string[],
  views: string[],
  isCodeStyle: boolean,
  fileName?: string,
  fileData?: number[],
  emojiTracker?: { [key: string]: string },
  isDeleted: boolean,
}

/**
 * Interface representing the structure of a Correspondence object.
 *
 * - messages - A list of all Messages sent between the users in messsageMembers
 * - messageMembers - A list of usernames of users involved in the messages
 * - views - A list of people who have viewed the correspondence at its most recent update
 * - userTyping - A list of users who are currently writing a message on the correspondence
 */
export interface Correspondence {
  _id?: string,
  messages: Message[],
  messageMembers: string[],
  views: string[],
  userTyping: string[]
}


/**
 * Interface representing the structure of a Notification object.
 *
 * - user - The user receiving the notification.
 * - type - The type of notification it is.
 * - caption - The caption of the notification.
 * - read - Whether or not the notification was read.
 * - createdAt - When the notification was made.
 * - redirectUrl - The url to go to when the notification is clicked.
 */
export interface Notification {
  user: string,
  type: string,
  caption: string,
  read: boolean,
  createdAt: Date,
  redirectUrl: string
}

/**
 * Type representing the possible responses for an Notification-related operation.
 */
export type NotificationResponse = Notification | { error: string };

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Type representing the possible responses for a Message-related operation.
 */
export type MessageResponse = Message | { error: string };

/**
 * Type representing the possible responses for a Correspondence-related operation.
 */
export type CorrespondenceResponse = Correspondence | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionByAswerer extends Request {
  params: {
    answeredBy: string;
  };
}

/**
 * Interface for the request query to find questions with a comment by the given user
 * - commentBy - The username of the user whose comments we are looking for
 */
export interface FindQuestionByCommenter extends Request {
  params: {
    commentBy: string;
  };
}


/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when adding a new message.
 * - body - The message being added.
 */
export interface AddMessageRequest extends Request {
  body: {
    cid: string;
    message: Message
  };
}

/**
 * Interface for the request body when adding a new correspondence.
 * - body - The correspondence being added.
 */
export interface AddCorrespondenceRequest extends Request {
  body: Correspondence;
}

/**
 * Interface for the request body when updating a correspondence.
 * - body - The correspondence ID and the new contents of the correspondence
 *  - cid - the unique identifier of the correspondence
 *  - updatedMessageMembers - an updated list of the correspondence members
 */
 export interface UpdateCorrespondenceRequest extends Request {
  body: {
    cid: string;
    updatedMessageMembers: string[];
  };
}

/**
 * Interface for the request body when updating a message.
 * - body - The message ID and the new contents of the message
 *  - mid - the unique identifier of the message
 *  - updatedMessageText - an updated message text for the message
 */
 export interface UpdateMessageRequest extends Request {
  body: {
    mid: string;
    updatedMessageText: string;
    isCodeStyle: boolean;
  };
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface UpdateTagsRequest extends Request {
  query: {
    user: string;
    qid: string;
  };
}


/**
 * Interface representing a UserReport, which contains:
 * - _id - The unique identifier for the report. Optional field.
 * - text - The content of the report.
 * - reportBy - The username of the user who reported.
 * - reportDateTime - The date and time when the report was created.
 * - status - The current status of the user report.
 */
export interface UserReport {
  _id?: ObjectId;
  text: string;
  reportBy: string;
  reportDateTime: Date;
  status: 'unresolved' | 'dismissed' | 'removed';
}

/**
 * Interface for the request body when reporting.
 * - targetId - The unique identifier of the question or answer being reported.
 * - targetType - The type of the report, either 'question' or 'answer'.
 * - report - The report being added.
 */
export interface AddUserReportRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    report: UserReport;
  };
}

/**
 * Interface for the request body when fetching reports.
 * - type - The type of the reports being fetched, either question or answer.
 */
export interface GetUserReportRequest extends Request {
  query: {
    type: 'question' | 'answer';
  };
}

/**
 * Interface extending the request body when resolving a question/answer from the database which contains:
 * - reportedPost - The post, Question/Answer that was reported.
 * - qid - The question id of the answer/question that was reported.
 * - postId - The id of the Question/Answer that was reported.
 * - type - The type of the report, either 'question' or 'answer'.
 * - isRemoved - True if the moderator decision on the report was removal, otherwise false.
 */
export interface ResolveReportedRequest extends Request {
  body: {
    reportedPost: Question | Answer;
    qid: string;
    postId: string;
    type: 'question' | 'answer';
    isRemoved: boolean;
  };
}

/**
 * Type representing the possible responses for a UserReport-related operation.
 */
export type UserReportResponse = UserReport | { error: string };

/**
 * Type representing the possible responses for a ModApplication[] related operation.
 */
export type UserReportResponses = Question[] | { error: string };

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };


/**
 * Interface representing a Badge, which contains:
 * - _id - The unique identifier for the badge. Optional field.
 * - name - The name of the badge.
 * - description - The description of how to obtain the badge.
 * - category - The category of the badge, based on the action that needs to be performed to get it.
 * - targetValue - The amount of times the category action must be performed to get the badge.
 * - tier - The tier of this badge relative to its cateory.
 *
 */
export interface Badge {
  _id?: ObjectId;
  name: string;
  description: string;
  category: BadgeCategory;
  targetValue: number;
  tier: BadgeTier;
  users: User[] | ObjectId[];
}


/**
 * Interface representing a TagAnswerCount, which contains:
 * - `user`: The user id who answers
 * - `tag`: The id of the tag being answered.
 * - `count`: The amount of times the user has answered questions about the given tag.
 */
export interface TagAnswerCount {
  _id?: ObjectId;
  user: string;
  tag: Tag;
  count: number;
}

/**
 * Interface representing a Leaderboard, which contains:
 * - `user`: The id of the user
 * - `tag`: The id of the tag being ranked
 * - `position`: The position of the user in the leaderboard for the given tag
 * - `count`: The number of answers the user has for this tag (used for ranking)
 */
export interface Leaderboard {
  _id?: ObjectId;
  user: string;
  tag: Tag;
  position: number;
  count: number;
}



/**
 * Interface extending the request body when adding a badge, which contains:
 * - name - The the name of the badge.
 * - description - How to obtain the badge.
 * - category - The category of action that the badge measures.
 * - targetValue - The amount of times the action must be done to obtain the badge.
 * - tier - The tier of the badge.
 */
export interface AddBadgeRequest extends Request {
  body: {
    name: string;
    description: string;
    category: BadgeCategory;
    targetValue: number;
    tier: BadgeTier;
    users: User[];
  };
}

/**
 * Interface extending the request body when adding a badge, which contains:
 * - name - The the name of the badge.
 * - description - How to obtain the badge.
 * - category - The category of action that the badge measures.
 * - targetValue - The amount of times the action must be done to obtain the badge.
 * - tier - The tier of the badge.
 */
export interface UserBadgeRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Interface extending the request body when adding a badge, which contains:
 * - name - The the name of the badge.
 * - description - How to obtain the badge.
 * - category - The category of action that the badge measures.
 * - targetValue - The amount of times the action must be done to obtain the badge.
 * - tier - The tier of the badge.
 */
export interface EarnedUserRequest extends Request {
  params: {
    badgeName: string;
  };
}

/**
 * Type representing the possible responses for a Badge-related operation.
 */
export type BadgeResponse = Badge | { error: string };

/**
 * Interface representing a BadgeProgress, which contains:
 * - _id - The unique identifier for the badgeProgress. Optional field.
 * - user - The username of the user whose progress is being tracked.
 * - badge - The badge being tracked.
 * - category - The category of the badge, based on the action that needs to be performed to get it.
 * - targetValue - The amount of times the category action must be performed to get the badge.
 * - currentValue - The amount of times the category action has been performed by the user.
 */
export interface BadgeProgress {
  _id?: ObjectId;
  user: string;
  badge: ObjectId;
  category: BadgeCategory;
  targetValue: number;
  currentValue: number;
}

/**
 * Interface extending the request body when updating badge progress, which contains:
 * - name - The username of the user.
 * - category - How to obtain the badge.
 * - category - The category of action that the badge measures.
 */
export interface UpdateBadgeProgressRequest extends Request {
  body: {
    username: string;
    category: BadgeCategory;
  };
}

/**
 * Type representing the possible responses for a badgeProgress-related operation.
 */
export type BadgeProgressResponse = BadgeProgress[] | { error: string };

/**
 * Type representing the possible responses for a tagAnswerCount-related operation.
 */
export type TagAnswerCountResponse = Question | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface for the request query to find messages using a search string, which contains:
 * - order - The order in which to sort the messages
 * - askedBy - The username of the user who asked the message
 */
 export interface FindMessageRequest extends Request {
  query: {
    askedBy: string;
  };
}

/**
 * Interface for the request query to find correspondences, which contains no arguments
 */
 export interface FindCorrespondenceRequest extends Request {
  query: {
  };
}

/**
 * Interface for the request query to find all users in the db, which contains no arguments
 */
 export interface GetUserRequest extends Request {
  query: {
  };
}


/**
 * Interface for the request parameters when finding a message by its ID.
 * - mid - The unique identifier of the message.
 * - username - The name of the user who has just viewed the message
 */
export interface FindMessageByIdRequest extends Request {
  params: {
    mid: string;
  };
  query: {
    username: string;
  };
}


/**
 * Interface for the request parameters when finding a correspondence by its ID.
 * - cid - The unique identifier of the correspondence.
 */
export interface FindCorrespondenceByIdRequest extends Request {
  params: {
    cid: string;
  };
}

/**
 * Interface for the request parameters when finding a correspondence by its ID.
 * - cid - The unique identifier of the correspondence.
 * - username - The name of the user to add to the views
 */
export interface FindCorrespondenceByIdWithViewsRequest extends Request {
  params: {
    cid: string;
  };
  query: {
    username: string;
  };
}


/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface UserReportUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a remove post update event, which contains:
 * - qid - The unique identifier of the question.
 * - updatedPost - The updated question or answer response to be removed.
 */
export interface RemovePostUpdatePayload {
  qid: string;
  updatedPost: QuestionResponse | AnswerResponse;
}

/**
 * Interface representing the payload for a report dismissed update event, which contains:
 * - qid - The unique identifier of the question.
 * - updatedPost - The updated question or answer response to be dismissed.
 */
export interface ReportDismissedUpdatePayload {
  qid: string;
  updatedPost: QuestionResponse | AnswerResponse;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  messageUpdate: (message: MessageResponse) => void;
  correspondenceUpdate: (correspondence: CorrespondenceResponse) => void;
  modApplicationUpdate: (update: ModApplicationResponse) => void;
  userReportsUpdate: (update: UserReportUpdatePayload) => void;
  removePostUpdate: (update: RemovePostUpdatePayload) => void;
  reportDismissedUpdate: (update: ReportDismissedUpdatePayload) => void;
  notificationUpdate: (notification: NotificationResponse) => void;
  endorsementUpdate: (data: { aid: string; endorsed: boolean }) => void;
}
