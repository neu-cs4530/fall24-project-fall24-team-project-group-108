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
}

/**
 * Represents a mod application.
 */
export interface ModApplication {
  _id?: string;
  username: string;
  applicationText: string;
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
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
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
}

/**
 * Interface representing the structure of a Notification object.
 *
 * - notificationDateTime - The date and time the notification was sent
 * - notificationText - The content of the notification
 * - referencedUsers - A list of users who are being referenced in the notification
 * - referencedPage - A link to the page that is being referenced
 */
export interface Notification {
  notificationDateTime: Date,
  notificationText: string,
  referencedUsers: string[],
  referencedPage: string

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
  messageText: string;
  messageDateTime: Date;
  messageBy: string;
  messageTo: string[];
}

export interface Correspondence {
  messages: Message[];
  messageMembers: string[];
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
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
  notificationUpdate: (notification: Notification) => void;
}
