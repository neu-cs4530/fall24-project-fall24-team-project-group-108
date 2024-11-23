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

describe('POST /updateCorrespondence', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a given correspondences messageMembers', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'updateCorrespondenceById').mockResolvedValueOnce({...correspondence1, messageMembers: [...correspondence1.messageMembers, 'extraUser']});
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/correspondence/updateCorrespondence').send({cid: correspondence1._id, messageMembers: [...correspondence1.messageMembers, 'extraUser']});
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(correspondence1.messages.map(message => message._id || ''));
    expect(responseCorrespondence.messageMembers).toEqual([...correspondence1.messageMembers, 'extraUser']);
    expect(responseCorrespondence.views).toEqual(correspondence1.views);
    expect(responseCorrespondence.userTyping).toEqual(correspondence1.userTyping);

  });

  it('should return error 500 if updateCorrespondenceById throws an error', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    jest.spyOn(util, 'updateCorrespondenceById').mockRejectedValueOnce(new Error('Error when updating correspondence'));

    const response = await supertest(app).post('/correspondence/updateCorrespondence').send({cid: correspondence1._id, messageMembers: [...correspondence1.messageMembers, 'extraUser']});

    expect(response.status).toBe(500);
  });
});

describe('POST /updateCorrespondenceViews', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a given correspondences views', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'updateCorrespondenceViewsById').mockResolvedValueOnce({...correspondence1, views: ['ichiro']});
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/correspondence/updateCorrespondenceViews').send({cid: correspondence1._id, views: ['ichiro']});
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(correspondence1.messages.map(message => message._id || ''));
    expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
    expect(responseCorrespondence.userTyping).toEqual(correspondence1.userTyping);
    expect(responseCorrespondence.views).toEqual(['ichiro']);

  });

  it('should return error 500 if updateCorrespondenceViewsById throws an error', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    jest.spyOn(util, 'updateCorrespondenceViewsById').mockRejectedValueOnce(new Error('Error when updating correspondence'));

    const response = await supertest(app).post('/correspondence/updateCorrespondenceViews').send({cid: correspondence1._id, userTyping: ['ichiro']});

    expect(response.status).toBe(500);
  });
});


describe('POST /updateCorrespondenceUserTyping', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });
  
    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });
  
    it('should update a given correspondences userTyping', async () => {
      // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
      jest.spyOn(util, 'updateCorrespondenceUserTypingById').mockResolvedValueOnce({...correspondence1, userTyping: ['ichiro']});
      // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);
  
      // Making the request
      const response = await supertest(app).post('/correspondence/updateCorrespondenceUserTyping').send({cid: correspondence1._id, userTyping: ['ichiro']});
      const responseCorrespondence = response.body as Correspondence;
  
      // Asserting the response
      expect(response.status).toBe(200);
      expect(responseCorrespondence._id).toEqual(correspondence1._id);
      expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(correspondence1.messages.map(message => message._id || ''));
      expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
      expect(responseCorrespondence.views).toEqual(correspondence1.views);
      expect(responseCorrespondence.userTyping).toEqual(['ichiro']);
  
    });
  
    it('should return error 500 if updateCorrespondenceUserTypingById throws an error', async () => {
      const mockReqBody = { 
        params: {cid: '65e9b58910afe6e94fc6e6ba'}
      };
      jest.spyOn(util, 'updateCorrespondenceUserTypingById').mockRejectedValueOnce(new Error('Error when updating correspondence'));
  
      const response = await supertest(app).post('/correspondence/updateCorrespondenceUserTyping').send({cid: correspondence1._id, userTyping: ['ichiro']});
  
      expect(response.status).toBe(500);
    });
  });
