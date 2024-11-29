import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Message, Correspondence } from '../types';

const message2: Message = {
  _id: '65e9b58910afe6e94fc6e6ab',
  messageText: 'Python is my favorite programming language',
  messageDateTime: new Date('2023-11-19T09:24:00'),
  messageBy: 'isuzuki',
  messageTo: ['tgwynn', 'tcobb'],
  views: ['isuzuki'],
  isCodeStyle: false,
  isDeleted: false,
};

const message3: Message = {
  _id: '65e9b58910afe6e94fc6e6ac',
  messageText: 'What language is easiest to learn?',
  messageDateTime: new Date('2023-11-19T09:24:00'),
  messageBy: 'isuzuki',
  messageTo: ['tgwynn', 'tcobb'],
  views: ['isuzuki'],
  isCodeStyle: true,
  isDeleted: false,
};

const correspondence1 = {
  _id: '65e9b58910afe6e94fc6e6ba',
  messages: [message2, message3],
  messageMembers: ['isuzuki', 'tgwynn', 'tcobb'],
  views: [],
  userTyping: [],
};

describe('POST /updateCorrespondence', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a given correspondences messageMembers', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'updateCorrespondenceById').mockResolvedValueOnce({
      ...correspondence1,
      messageMembers: [...correspondence1.messageMembers, 'extraUser'],
    });

    // Making the request
    const response = await supertest(app)
      .post('/correspondence/updateCorrespondence')
      .send({
        cid: correspondence1._id,
        messageMembers: [...correspondence1.messageMembers, 'extraUser'],
      });
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(
      correspondence1.messages.map(message => message._id || ''),
    );
    expect(responseCorrespondence.messageMembers).toEqual([
      ...correspondence1.messageMembers,
      'extraUser',
    ]);
    expect(responseCorrespondence.views).toEqual(correspondence1.views);
    expect(responseCorrespondence.userTyping).toEqual(correspondence1.userTyping);
  });

  it('should return error 500 if updateCorrespondenceById throws an error', async () => {
    jest
      .spyOn(util, 'updateCorrespondenceById')
      .mockRejectedValueOnce(new Error('Error when updating correspondence'));

    const response = await supertest(app)
      .post('/correspondence/updateCorrespondence')
      .send({
        cid: correspondence1._id,
        messageMembers: [...correspondence1.messageMembers, 'extraUser'],
      });

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
    jest
      .spyOn(util, 'updateCorrespondenceViewsById')
      .mockResolvedValueOnce({ ...correspondence1, views: ['ichiro'] });
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app)
      .post('/correspondence/updateCorrespondenceViews')
      .send({ cid: correspondence1._id, views: ['ichiro'] });
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(
      correspondence1.messages.map(message => message._id || ''),
    );
    expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
    expect(responseCorrespondence.userTyping).toEqual(correspondence1.userTyping);
    expect(responseCorrespondence.views).toEqual(['ichiro']);
  });

  it('should return error 500 if updateCorrespondenceViewsById throws an error', async () => {
    jest
      .spyOn(util, 'updateCorrespondenceViewsById')
      .mockRejectedValueOnce(new Error('Error when updating correspondence'));

    const response = await supertest(app)
      .post('/correspondence/updateCorrespondenceViews')
      .send({ cid: correspondence1._id, userTyping: ['ichiro'] });

    expect(response.status).toBe(500);
  });
});

describe('POST /updateCorrespondenceUserTypingNames', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a given correspondences userTyping when given a name to add', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest
      .spyOn(util, 'updateCorrespondenceUserTypingByIdNames')
      .mockResolvedValueOnce({ ...correspondence1, userTyping: ['ichiro'] });
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app)
      .post('/correspondence/updateCorrespondenceUserTypingNames')
      .send({ cid: correspondence1._id, username: 'ichiro', push: true });
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(
      correspondence1.messages.map(message => message._id || ''),
    );
    expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
    expect(responseCorrespondence.views).toEqual(correspondence1.views);
    expect(responseCorrespondence.userTyping).toEqual(['ichiro']);
  });

  it('should update a given correspondences userTyping when given a name to add', async () => {
    // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest
      .spyOn(util, 'updateCorrespondenceUserTypingByIdNames')
      .mockResolvedValueOnce({ ...correspondence1, userTyping: [] });
    // jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app)
      .post('/correspondence/updateCorrespondenceUserTypingNames')
      .send({ cid: correspondence1._id, username: 'ichiro', push: false });
    const responseCorrespondence = response.body as Correspondence;

    // Asserting the response
    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual(correspondence1._id);
    expect(responseCorrespondence.messages.map(message => message._id || '')).toEqual(
      correspondence1.messages.map(message => message._id || ''),
    );
    expect(responseCorrespondence.messageMembers).toEqual(correspondence1.messageMembers);
    expect(responseCorrespondence.views).toEqual(correspondence1.views);
    expect(responseCorrespondence.userTyping).toEqual([]);
  });

  it('should return error 500 if updateCorrespondenceUserTypingNamesById throws an error', async () => {
    jest
      .spyOn(util, 'updateCorrespondenceUserTypingByIdNames')
      .mockRejectedValueOnce(new Error('Error when updating correspondence'));

    const response = await supertest(app)
      .post('/correspondence/updateCorrespondenceUserTypingNames')
      .send({ cid: correspondence1._id, username: 'ichiro', push: false });

    expect(response.status).toBe(500);
  });
});
