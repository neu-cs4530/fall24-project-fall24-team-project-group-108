import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Represents a user in the application.
 */
export interface User {
  _id?: string;
  username: string;
  password: string;
  isModerator: boolean;
  badges: Badge[];
  infractions: string[];
}

/**
 * Represents a mod application.
 */
export interface ModApplication {
  _id?: string;
  username: string;
  applicationText: string;
  status: string;
}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface represents a report.
 *
 * text - The text of the comment.
 * reportBy - Username of the author of the report.
 * reportDateTime - Time at which the comment was created.
 * status - Current status of the report.
 */
export interface UserReport {
  text: string;
  reportBy: string;
  reportDateTime: Date;
  status: 'unresolved' | 'dismissed' | 'removed';
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 * - reports - UserReports associated with the answer.
 * - isRemoved - True if a mod has removed Answer from view.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
  reports: UserReport[];
  isRemoved: boolean;
}

/**
 * Interface represents a badge.
 *
 * name - The name of the badge.
 * description - Description of the badge.
 * category - The category of action required to get the badge.
 * targetValue - The amount of times the action has to be done to obtain the badge.
 * tier - The tier of branch in this category.
 */
export interface Badge {
  name: string;
  description: string;
  category: string;
  targetValue: number;
  tier: string;
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 * - reports - UserReports associated with the question.
 * - isRemoved - True if a mod has removed Question from view.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
  reports: UserReport[];
  isRemoved: boolean;
}

/**
 * Interface representing the structure of a Notification object.
 *
 * - _id - The unique identifier for the notif.
 * - user - The user receiving the notification.
 * - type - The type of notification it is.
 * - caption - The caption of the notification.
 * - read - Whether or not the notification was read.
 * - createdAt - When the notification was made.
 * - redirectUrl - The url to go to when the notification is clicked.
 */
export interface Notification {
  _id?: string;
  user: string;
  type: 'question' | 'answer' | 'comment' | 'badge' | 'leaderboard';
  caption: string;
  read: boolean;
  createdAt: Date;
  redirectUrl: string;
}

/**
 * Interface representing tag counts for the leaderboard.
 *
 * - user - The username.
 * - count - The amount of times they've answered questions about a tag.
 */
export interface TagCounts {
  user: string;
  tagid: string;
  count: number;
}

/**
 * Interface representing the structure of a Message object.
 *
 * - messageText - The content of the message
 * - messageDateTime - The date and time the message was sent
 * - messageBy - The username of the user who sent the message
 * - messageTo - A list of usernames of users who the message was sent to
 */
export interface Message {
  _id?: string;
  messageText: string;
  messageDateTime: Date;
  messageBy: string;
  messageTo: string[];
  views?: string[];
  isCodeStyle: boolean;
}

/**
 * Interface representing the structure of a Correspondence object.
 *
 * - messages - A list of all Messages sent between the users in messsageMembers
 * - messageMembers - A list of usernames of users involved in the messages
 */
export interface Correspondence {
  _id?: string;
  messages: Message[];
  messageMembers: string[];
  views?: string[];
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update socket event.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

/**
 * Interface representing the payload for a comment update socket event.
 */
export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a user report update socket event.
 */
export interface UserReportUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a remove post update socket event.
 */
export interface RemovePostUpdatePayload {
  qid: string;
  updatedPost: Question | Answer;
}

/**
 * Interface representing the payload for a dismiss report update socket event.
 */
export interface ReportDismissedUpdatePayload {
  qid: string;
  updatedPost: Question | Answer;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  correspondenceUpdate: (update: Correspondence) => void;
  messageUpdate: (update: Message) => void;
  modApplicationUpdate: (update: ModApplication) => void;
  userReportsUpdate: (update: UserReportUpdatePayload) => void;
  removePostUpdate: (update: RemovePostUpdatePayload) => void;
  reportDismissedUpdate: (update: ReportDismissedUpdatePayload) => void;
  notificationUpdate: (notification: Notification) => void;
}
