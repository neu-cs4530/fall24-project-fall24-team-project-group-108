import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Message, Correspondence } from '../types';

const fetchAndIncrementMessageViewsByIdSpy: jest.SpyInstance = jest.spyOn(
  util,
  'fetchAndIncrementMessageViewsById',
);
const updateMessageByIdSpy: jest.SpyInstance = jest.spyOn(util, 'updateMessageById');
const updateMessageViewsByIdSpy: jest.SpyInstance = jest.spyOn(util, 'updateMessageViewsById');
const updateMessageEmojisByIdSpy: jest.SpyInstance = jest.spyOn(util, 'updateMessageEmojisById');
const updateMessageIsDeletedByIdSpy: jest.SpyInstance = jest.spyOn(
  util,
  'updateMessageIsDeletedById',
);
const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const addMessageToCorrespondenceSpy = jest.spyOn(util, 'addMessageToCorrespondence');

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

describe('POST /addMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return correspondence including the given message', async () => {
    saveMessageSpy.mockResolvedValueOnce({ ...message1 });
    addMessageToCorrespondenceSpy.mockResolvedValueOnce({ ...correspondence2 });

    const mockReqBody = { cid: '65e9b58910afe6e94fc6e6bb', message: { ...message1 } };

    const response = await supertest(app).post(`/message/addMessage`).send(mockReqBody);
    const responseCorrespondence = response.body;
    const responseMessage = response.body.messages[0];

    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual('65e9b58910afe6e94fc6e6bb');
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual(['isuzuki']);
    expect(responseMessage.isDeleted).toEqual(false);
  });

  it('should return error 400 if saveMessage returns an error', async () => {
    saveMessageSpy.mockResolvedValueOnce({ error: 'Error when saving message' });
    addMessageToCorrespondenceSpy.mockResolvedValueOnce({ ...correspondence2 });

    const mockReqBody = { cid: '65e9b58910afe6e94fc6e6bb', messageInfo: { ...message1 } };

    const response = await supertest(app).post(`/message/addMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if addMessageToCorrespondence returns an error', async () => {
    saveMessageSpy.mockResolvedValueOnce({ ...message1 });
    addMessageToCorrespondenceSpy.mockResolvedValueOnce({
      error: 'Error when adding message to correspondence',
    });

    const mockReqBody = { cid: '65e9b58910afe6e94fc6e6bb', messageInfo: { ...message1 } };

    const response = await supertest(app).post(`/message/addMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if an invalid cid is given', async () => {
    saveMessageSpy.mockResolvedValueOnce({ ...message1 });
    addMessageToCorrespondenceSpy.mockResolvedValueOnce({ ...correspondence2 });

    const mockReqBody = { cid: 'fakecid', messageInfo: { ...message1 } };

    const response = await supertest(app).post(`/message/addMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if an messageInfo is not given', async () => {
    saveMessageSpy.mockResolvedValueOnce({ ...message1 });
    addMessageToCorrespondenceSpy.mockResolvedValueOnce({ ...correspondence2 });

    const mockReqBody = { cid: 'fakecid' };

    const response = await supertest(app).post(`/message/addMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if username is undefined', async () => {
    updateMessageIsDeletedByIdSpy.mockResolvedValueOnce({
      ...message1,
      isDeleted: true,
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa' };

    const response = await supertest(app).post(`/message/updateMessageIsDeleted`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /updateMessageIsDeleted', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return message by given id with the given isDeleted value', async () => {
    updateMessageIsDeletedByIdSpy.mockResolvedValueOnce({
      ...message1,
      isDeleted: true,
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa', isDeleted: true };

    const response = await supertest(app).post(`/message/updateMessageIsDeleted`).send(mockReqBody);
    const responseMessage = response.body;

    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual(['isuzuki']);
    expect(responseMessage.isDeleted).toEqual(true);
  });

  it('should return error 400 if an invalid mid is given', async () => {
    updateMessageIsDeletedByIdSpy.mockResolvedValueOnce({
      ...message1,
      isDeleted: true,
    } as Message);

    const mockReqBody = { mid: 'fakemid', isDeleted: true };

    const response = await supertest(app).post(`/message/updateMessageIsDeleted`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if username is undefined', async () => {
    updateMessageIsDeletedByIdSpy.mockResolvedValueOnce({
      ...message1,
      isDeleted: true,
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa' };

    const response = await supertest(app).post(`/message/updateMessageIsDeleted`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /updateMessageEmojis', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return message by given id with the given emojis ', async () => {
    updateMessageEmojisByIdSpy.mockResolvedValueOnce({
      ...message1,
      emojiTracker: { ichiro: 'smile', tgwynn: 'thumbs up' },
    } as Message);

    const mockReqBody = {
      mid: '65e9b58910afe6e94fc6e6aa',
      emojis: { ichiro: 'smile', tgwynn: 'thumbs up' },
    };

    const response = await supertest(app).post(`/message/updateMessageEmojis`).send(mockReqBody);
    const responseMessage = response.body;

    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual(message1.views);
    expect(responseMessage.emojiTracker).toEqual({ ichiro: 'smile', tgwynn: 'thumbs up' });
  });

  it('should return error 500 if updateMessageEmojisById returns null', async () => {
    updateMessageEmojisByIdSpy.mockResolvedValueOnce(null);

    const mockReqBody = {
      mid: '65e9b58910afe6e94fc6e6aa',
      emojis: { ichiro: 'smile', tgwynn: 'thumbs up' },
    };

    const response = await supertest(app).post(`/message/updateMessageEmojis`).send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return error 400 if an invalid mid is given', async () => {
    updateMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      emojiTracker: { ichiro: 'smile', tgwynn: 'thumbs up' },
    } as Message);

    const mockReqBody = { mid: 'fakemid', emojis: { ichiro: 'smile', tgwynn: 'thumbs up' } };

    const response = await supertest(app).post(`/message/updateMessageEmojis`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if emojis is undefined', async () => {
    updateMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      emojiTracker: { ichiro: 'smile', tgwynn: 'thumbs up' },
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa' };

    const response = await supertest(app).post(`/message/updateMessageEmojis`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('GET /getMessageById/:mid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return message by given id with the given user added to the views', async () => {
    fetchAndIncrementMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: [...message1.views, 'fhernandez'],
    });

    const response = await supertest(app).get(
      `/message/getMessageById/65e9b58910afe6e94fc6e6aa?username=fhernandez`,
    );
    const responseMessage = response.body;

    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual([...message1.views, 'fhernandez']);
  });

  it('should return error 500 if getMessageById returns null', async () => {
    fetchAndIncrementMessageViewsByIdSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get(
      `/message/getMessageById/65e9b58910afe6e94fc6e6aa?username=fhernandez`,
    );

    expect(response.status).toBe(500);
  });

  it('should return error 400 if an invalid mid is given', async () => {
    fetchAndIncrementMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: [...message1.views, 'fhernandez'],
    });

    const response = await supertest(app).get(
      `/message/getMessageById/fakemid?username=fhernandez`,
    );

    expect(response.status).toBe(400);
  });

  it('should return error 400 if username is undefined', async () => {
    fetchAndIncrementMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: [...message1.views, 'fhernandez'],
    });

    const response = await supertest(app).get(`/message/getMessageById/fakemid`);

    expect(response.status).toBe(400);
  });
});

describe('POST /updateMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return message by given id with the given message contents', async () => {
    updateMessageByIdSpy.mockResolvedValueOnce({
      messages: [
        {
          ...message1,
          messageText: 'mock text',
          isCodeStyle: true,
        } as Message,
      ],
      messageMembers: ['ichiro', 'tgwynn'],
      views: [],
      userTyping: [],
    } as Correspondence);

    const mockReqBody = {
      mid: '65e9b58910afe6e94fc6e6aa',
      updatedMessageText: 'mock text',
      isCodeStyle: true,
    };

    const response = await supertest(app).post(`/message/updateMessage`).send(mockReqBody);
    const responseMessage = response.body.messages[0];

    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual('mock text');
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(true);
    expect(responseMessage.views).toEqual([...message1.views]);
  });

  it('should return error 500 if updateMessage returns null', async () => {
    updateMessageByIdSpy.mockResolvedValueOnce(null);

    const mockReqBody = {
      mid: '65e9b58910afe6e94fc6e6aa',
      updatedMessageText: 'mock text',
      isCodeStyle: true,
    };

    const response = await supertest(app).post(`/message/updateMessage`).send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return error 400 if an invalid mid is given', async () => {
    updateMessageByIdSpy.mockResolvedValueOnce({
      messages: [
        {
          ...message1,
          messageText: 'mock text',
          isCodeStyle: true,
        } as Message,
      ],
      messageMembers: ['ichiro', 'tgwynn'],
      views: [],
      userTyping: [],
    } as Correspondence);

    const mockReqBody = { mid: 'fakemid', updatedMessageText: 'mock text', isCodeStyle: true };

    const response = await supertest(app).post(`/message/updateMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if updatedMessageText is undefined', async () => {
    updateMessageByIdSpy.mockResolvedValueOnce({
      messages: [
        {
          ...message1,
          messageText: 'mock text',
          isCodeStyle: true,
        } as Message,
      ],
      messageMembers: ['ichiro', 'tgwynn'],
      views: [],
      userTyping: [],
    } as Correspondence);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa', isCodeStyle: true };

    const response = await supertest(app).post(`/message/updateMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if isCodeStyle is undefined', async () => {
    updateMessageByIdSpy.mockResolvedValueOnce({
      messages: [
        {
          ...message1,
          messageText: 'mock text',
          isCodeStyle: true,
        } as Message,
      ],
      messageMembers: ['ichiro', 'tgwynn'],
      views: [],
      userTyping: [],
    } as Correspondence);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa', updatedMessageText: 'mock text' };

    const response = await supertest(app).post(`/message/updateMessage`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /updateMessageViews', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return message by given id with the given username added to the views', async () => {
    updateMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: ['isuzuki'],
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa', username: 'ichiro' };

    const response = await supertest(app).post(`/message/updateMessageViews`).send(mockReqBody);
    const responseMessage = response.body;

    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual(['isuzuki']);
  });

  it('should return error 400 if an invalid mid is given', async () => {
    updateMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: ['ichiro'],
    } as Message);

    const mockReqBody = { mid: 'fakemid', username: 'ichiro' };

    const response = await supertest(app).post(`/message/updateMessageViews`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return error 400 if username is undefined', async () => {
    updateMessageViewsByIdSpy.mockResolvedValueOnce({
      ...message1,
      views: ['ichiro'],
    } as Message);

    const mockReqBody = { mid: '65e9b58910afe6e94fc6e6aa' };

    const response = await supertest(app).post(`/message/updateMessageViews`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});
