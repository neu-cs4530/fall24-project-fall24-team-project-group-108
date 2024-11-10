import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

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
 * - _id - The unique identifier for the message. Optional field.
 * - messageText - The content of the message
 * - messageDateTime - The date and time the message was sent
 * - messageBy - The username of the user who sent the message
 * - messageTo - A list of usernames of users who the message was sent to
 * - views - A list of usernames of users who have viewed the message
 */
 export interface Message {
  _id?: string,
  messageText: string,
  messageDateTime: Date,
  messageBy: string,
  messageTo: string[],
  views?: string[]
}

/**
 * Interface representing the structure of a Correspondence object.
 *
 * - _id - The unique identifier for the correspondence. Optional field.
 * - messages - A list of all Messages sent between the users in messsageMembers
 * - messageMembers - A list of usernames of users involved in the messages
 * - views - A list of usernames of users who have viewed the correspondence
 */
export interface Correspondence {
  _id?: string,
  messages: Message[],
  messageMembers: string[],
  views?: string[]
}

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
    order: OrderType;
    askedBy: string;
  };
}

/**
 * Interface for the request query to find correspondences using a search string, which contains:
 * - order - The order in which to sort the correspondences
 * - askedBy - The username of the user who asked the correspondences
 */
 export interface FindCorrespondenceRequest extends Request {
  query: {
  };
}


/**
 * Interface for the request parameters when finding a message by its ID.
 * - mid - The unique identifier of the message.
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
  query: {
    username: string;
  };
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
  correspondenceUpdate: (message: CorrespondenceResponse) => void;
}
