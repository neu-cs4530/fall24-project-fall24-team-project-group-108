import { Schema } from 'mongoose';
/**
 * Mongoose schema for the TagAnswerCount collection.
 *
 * This schema defines the structure for storing data connecting users to the 
 * tags they answer.
 * Each TagAnswerCount includes the following fields:
 * - `user`: The username of the user who answers
 * - `tag`: The id of the tag being answered.
 * - `count`: The amount of times the user has answered questions about the given tag.
 */
const tagAnswerCountSchema: Schema = new Schema(
  {
    user: [{ type: String }],
    tag: [{ type: Schema.Types.ObjectId, ref: 'tag' }],
    count: {
      type: Number,
    },
  },
  { collection: 'TagAnswerCount' },
);

export default tagAnswerCountSchema;
