import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, Tag, Message, Correspondence } from '../types';

const message1: Message = {
    _id: '65e9b58910afe6e94fc6e6aa',
    messageText: 'What is your favorite smartphone?',
    messageDateTime: new Date('2023-11-19T09:24:00'),
    messageBy: 'isuzuki',
    messageTo: ['tgwynn'],
    views: ['isuzuki'],
    isCodeStyle: false,
  };
  
  const message2: Message = {
    _id: '65e9b58910afe6e94fc6e6ab',
    messageText: 'Python is my favorite programming language',
    messageDateTime: new Date('2023-11-19T09:24:00'),
    messageBy: 'isuzuki',
    messageTo: ['tgwynn', 'tcobb'],
    views: ['isuzuki'],
    isCodeStyle: false,
  };
  
  const message3: Message = {
    _id: '65e9b58910afe6e94fc6e6ac',
    messageText: 'What language is easiest to learn?',
    messageDateTime: new Date('2023-11-19T09:24:00'),
    messageBy: 'isuzuki',
    messageTo: ['tgwynn', 'tcobb'],
    views: ['isuzuki'],
    isCodeStyle: true,
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
  
  const CORRESPONDENCES: Correspondence[] = [
    correspondence1, correspondence2,
  ];



const simplifyCorrespondence = (correspondence: Correspondence) => ({
    ...correspondence,
    _id: correspondence._id?.toString(), // Converting ObjectId to string
    messages: correspondence.messages.map(message => ({
      ...message,
      _id: message._id?.toString(),
    })), // Converting answer ObjectId
    messageMembers: correspondence.messageMembers.toString(),
    views: correspondence.views.toString(),
    userTyping: correspondence.userTyping.toString()
  });

describe('POST /addCorrespondence', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new correspondence', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveCorrespondence').mockResolvedValueOnce(correspondence1);
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/correspondence/addCorrespondence').send(correspondence1);
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(correspondence1.messages.map(message => message._id || ''));
    expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
    expect(responseCorrespondence.views).toEqual(correspondence1.views);
    expect(responseCorrespondence.userTyping).toEqual(correspondence1.userTyping);

  });

  it('should return 500 if error occurs in `saveCorrespondence` while adding a new correspondence', async () => {
    jest
      .spyOn(util, 'saveCorrespondence')
      .mockResolvedValueOnce({ error: 'Error while saving correspondence' });

    // Making the request
    const response = await supertest(app).post('/correspondence/addCorrespondence').send(correspondence1);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request if correspondence messageMembers is less than 2', async () => {
    // Making the request
    const response = await supertest(app).post('/correspondence/addCorrespondence').send({...correspondence1, messageMembers: ['myself']});

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid correspondence body');
  });

  it('should return bad request if correspondence views is not a subset of correspondence messageMembers', async () => {
    // Making the request
    const response = await supertest(app).post('/correspondence/addCorrespondence').send({...correspondence1, views: ['user1', 'user2', 'user3', 'user4']});

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid correspondence body');
  });

  it('should return bad request if correspondence userTyping is not a subset of correspondence messageMembers', async () => {
    // Making the request
    const response = await supertest(app).post('/correspondence/addCorrespondence').send({...correspondence1, userTyping: ['user1', 'user2', 'user3', 'user4']});

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid correspondence body');
  });
});
