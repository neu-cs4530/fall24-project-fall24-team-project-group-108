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


describe('POST /addMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new message', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(message1);
    jest.spyOn(util, 'addMessageToCorrespondence').mockResolvedValueOnce(correspondence2);
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: message1
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);
    const responseMessage = response.body.messages[response.body.messages.length-1] as Message;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseMessage._id).toEqual(message1._id);
    expect(responseMessage.messageText).toEqual(message1.messageText);
    expect(responseMessage.messageTo).toEqual(message1.messageTo);
    expect(responseMessage.messageBy).toEqual(message1.messageBy);
    expect(responseMessage.isCodeStyle).toEqual(message1.isCodeStyle);
    expect(responseMessage.views).toEqual(message1.views);

  });

  it('should return 500 if error occurs in `saveCorrespondence` while adding a new correspondence', async () => {
    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce({ error: 'Error while saving correspondence' });
    jest.spyOn(util, 'addMessageToCorrespondence').mockResolvedValueOnce({ error: 'Error while saving correspondence' });

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: message1
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return 500 if error occurs in `addMessageToCorrespondence` while adding a new message to an existing correspondence', async () => {
    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(message1);
    jest.spyOn(util, 'addMessageToCorrespondence').mockResolvedValueOnce({ error: 'Error while saving correspondence' });

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: message1
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request if corresponding correspondence id is not given', async () => {
    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(message1);
    jest.spyOn(util, 'addMessageToCorrespondence').mockResolvedValueOnce({ error: 'Error while saving correspondence' });

    const body = {
        // cid: '65e9b58910afe6e94fc6e6bb',
        message: message1
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request if message text is empty string', async () => {

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: {...message1, messageText: ''}
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message');
  });

  it('should return bad request if message by field is empty string', async () => {

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: {...message1, messageBy: ''}
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message');
  });

  it('should return bad request if one of the fields is not given (in this case, userStyle)', async () => {

    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: {
            _id: '65e9b58910afe6e94fc6e6aa',
            messageText: 'What is your favorite smartphone?',
            messageDateTime: new Date('2023-11-19T09:24:00'),
            messageBy: 'isuzuki',
            messageTo: ['tgwynn'],
            views: ['isuzuki'],
            // isCodeStyle: false,
          }
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message');
  });

  it('should return bad request if message userTyping is not a subset of the message members ([...messageTo, messageBy])', async () => {
    // Making the request
    const body = {
        cid: '65e9b58910afe6e94fc6e6bb',
        message: {
            _id: '65e9b58910afe6e94fc6e6aa',
            messageText: 'What is your favorite smartphone?',
            messageDateTime: new Date('2023-11-19T09:24:00'),
            messageBy: 'isuzuki',
            messageTo: ['tgwynn'],
            views: ['isuzuki', 'prose'],
            isCodeStyle: false,
          }
    }

    // Making the request
    const response = await supertest(app).post('/message/addMessage').send(body);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message');
  });
});
