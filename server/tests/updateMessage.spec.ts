import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Message } from '../types';
import CorrespondenceModel from '../models/correspondence';

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

const correspondence2 = {
  _id: '65e9b58910afe6e94fc6e6bb',
  messages: [message1],
  messageMembers: ['isuzuki', 'tgwynn'],
  views: ['isuzuki'],
  userTyping: [],
};

describe('POST /updateMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a given messages messageText and isCodeStyle values', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    const mockCorrespondence = {
      ...correspondence2,
      messages: [{ ...message1, messageText: 'new message text', isCodeStyle: false }],
    };
    jest.spyOn(util, 'updateMessageById').mockResolvedValueOnce(mockCorrespondence);
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/message/updateMessage').send({
      mid: '65e9b58910afe6e94fc6e6aa',
      updatedMessageText: 'new message text',
      isCodeStyle: false,
    });
    const responseMessage = response.body.messages[response.body.messages.length - 1] as Message;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageBy).toEqual(message1.messageBy);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.views).toEqual(message1.views);
    expect(responseMessage.messageText).toEqual('new message text');
    expect(responseMessage.isCodeStyle).toEqual(false);
    expect(responseMessage.emojiTracker).toEqual(message1.emojiTracker);
  });

  it('should return error 500 if updateMessageById throws an error', async () => {
    jest
      .spyOn(util, 'updateMessageById')
      .mockRejectedValueOnce(new Error('Error when updating message'));

    const response = await supertest(app).post('/message/updateMessage').send({
      mid: '65e9b58910afe6e94fc6e6aa',
      updatedMessageText: 'new message text',
      isCodeStyle: false,
    });

    expect(response.status).toBe(500);
  });
});

describe('POST /updateMessageViews', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a message views by adding the given user', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    const mockMessage = { ...message1, views: [...message1.views, 'rclemens'] };
    jest.spyOn(util, 'updateMessageViewsById').mockResolvedValueOnce(mockMessage);
    mockingoose(CorrespondenceModel).toReturn(correspondence2, 'findOne');
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app)
      .post('/message/updateMessageViews')
      .send({ mid: '65e9b58910afe6e94fc6e6aa', username: 'rclemens' });
    const responseMessage = response.body as Message;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageBy).toEqual(message1.messageBy);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.views).toEqual([...message1.views, 'rclemens']);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.emojiTracker).toEqual(message1.emojiTracker);
  });

  it('should return error 500 if updateMessageViewsById throws an error', async () => {
    jest
      .spyOn(util, 'updateMessageViewsById')
      .mockRejectedValueOnce(new Error('Error when updating message'));

    const response = await supertest(app)
      .post('/message/updateMessageViews')
      .send({ mid: '65e9b58910afe6e94fc6e6aa', username: 'rclemens' });

    expect(response.status).toBe(500);
  });
});

describe('POST /updateMessageEmojis', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a message emojis by setting the given emojis', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    const mockMessage = { ...message1, emojiTracker: { trichards: 'like', jromano: 'heart' } };
    jest.spyOn(util, 'updateMessageEmojisById').mockResolvedValueOnce(mockMessage);
    mockingoose(CorrespondenceModel).toReturn(correspondence2, 'findOne');
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app)
      .post('/message/updateMessageEmojis')
      .send({ mid: '65e9b58910afe6e94fc6e6aa', emojis: { trichards: 'like', jromano: 'heart' } });
    const responseMessage = response.body as Message;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageBy).toEqual(message1.messageBy);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.views).toEqual(message1.views);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.emojiTracker).toEqual({ trichards: 'like', jromano: 'heart' });
  });

  it('should return error 500 if updateMessageEmojisById throws an error', async () => {
    jest
      .spyOn(util, 'updateMessageEmojisById')
      .mockRejectedValueOnce(new Error('Error when updating message'));

    const response = await supertest(app)
      .post('/message/updateMessageEmojis')
      .send({ mid: '65e9b58910afe6e94fc6e6aa', emojis: { trichards: 'like', jromano: 'heart' } });

    expect(response.status).toBe(500);
  });
});
