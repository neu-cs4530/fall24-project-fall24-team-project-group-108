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
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
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
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
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
 */
export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  isModerator: boolean;
  badges: Badge[];
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
  }
}

/**
 * Interface extending the request body when reseting a password in the database which contains:
 * - username - The user's username.
 * - password - The user's new password.
 */
export interface ResetPasswordRequest extends Request {
  body: {
    username: string;
    password: string;
  }
}

/**
 * Interface extending the request body when making a user a moderator in the db:
 * - username - The user being made a moderator.
 */
export interface MakeUserModeratorRequest extends Request {
  body: {
    username: string;
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
  }
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
 */
export interface ModApplication {
  _id?: ObjectId;
  user: User; 
  applicationText: string;
}

/**
 * Interface extending the request body when adding a ModApplication to the database which contains:
 * - modApplication - contains the information about the ModAplication being added to the database.
 */
export interface AddModApplicationRequest extends Request {
  body: {
    modApplication: ModApplication;
  }
}

/**
 * Interface extending the request body when deleting a ModApplication to the database which contains:
 * - username - the user whose application is being deleted.
 */
export interface DeleteModApplicationRequest extends Request {
  body: {
    username: string
  }
}

/**
 * Interface extending the request body when finding a ModApplication in the database which contains:
 * - username - the user whose application is being found.
 */
export interface FindModApplicationRequest extends Request {
  query: {
    username: string;
  }
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
  messageText: string,
  messageDateTime: Date,
  messageBy: string,
  messageTo: string[]
}

export interface Correspondence {
  messages: Message[],
  messageMembers: string[]
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

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
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
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
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
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
  user: User;
  tag: Tag;
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
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
}
