import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Message, Correspondence } from '../types';

const getCorrespondencesByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getCorrespondencesByOrder');
const fetchCorrespondenceByIdSpy: jest.SpyInstance = jest.spyOn(util, 'fetchCorrespondenceById');
const fetchAndIncrementCorrespondenceViewsByIdSpy: jest.SpyInstance = jest.spyOn(util, 'fetchAndIncrementCorrespondenceViewsById');
// const getCorrespondencesByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getCorrespondencesByOrder');
// const getCorrespondencesByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getCorrespondencesByOrder');

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

describe('GET /getCorrespondence', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return correspondences', async () => {
    getCorrespondencesByOrderSpy.mockResolvedValueOnce(CORRESPONDENCES);

    const response = await supertest(app).get('/correspondence/getCorrespondence');
    const responseCorrespondences = (response.body as Correspondence[]).map(correspondence => correspondence._id)

    expect(response.status).toBe(200);
    expect(responseCorrespondences).toEqual(CORRESPONDENCES.map(correspondence => correspondence._id));
  });

  it('should return error 500 if getCorrespondencesByOrder returns null', async () => {
    getCorrespondencesByOrderSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/correspondence/getCorrespondence');

    expect(response.status).toBe(500);
  });

  it('should return error 500 if getCorrespondencesByOrder throws an error', async () => {
    getCorrespondencesByOrderSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get('/correspondence/getCorrespondence');

    expect(response.status).toBe(500);
  });
});

describe('GET /getCorrespondenceById/:cid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return correspondence by given id', async () => {
    const mockReqBody = { 
      cid: '65e9b58910afe6e94fc6e6ba'
    };
    fetchCorrespondenceByIdSpy.mockResolvedValueOnce(correspondence1);

    const response = await supertest(app).get(`/correspondence/getCorrespondenceById/65e9b58910afe6e94fc6e6ba`);
    const responseCorrespondenceId = (response.body as Correspondence)._id || '';

    expect(response.status).toBe(200);
    expect(responseCorrespondenceId).toEqual('65e9b58910afe6e94fc6e6ba');
  });

  it('should return error 500 if getCorrespondencesByOrder returns null', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    fetchCorrespondenceByIdSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get(`/correspondence/getCorrespondenceById/65e9b58910afe6e94fc6e6ba`);

    expect(response.status).toBe(500);
  });

  it('should return error 500 if getCorrespondencesByOrder throws an error', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    fetchCorrespondenceByIdSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get(`/correspondence/getCorrespondenceById/65e9b58910afe6e94fc6e6ba`);

    expect(response.status).toBe(500);
  });
});

describe('GET /getCorrespondenceByIdWithViews/:cid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return correspondence by given id with the correct amount of views', async () => {
    const mockReqBody = { 
      cid: '65e9b58910afe6e94fc6e6ba'
    };
    fetchAndIncrementCorrespondenceViewsByIdSpy.mockResolvedValueOnce({...correspondence1, views: [...correspondence1.views, 'brother']});

    const response = await supertest(app).get(`/correspondence/getCorrespondenceByIdWithViews/65e9b58910afe6e94fc6e6ba?username=brother`);
    const responseCorrespondence = response.body as Correspondence;

    expect(response.status).toBe(200);
    expect(responseCorrespondence._id).toEqual('65e9b58910afe6e94fc6e6ba');
    expect(responseCorrespondence.views).toEqual([...correspondence1.views, 'brother']);
  });

  it('should return error 500 if getCorrespondencesByOrder returns null', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    fetchCorrespondenceByIdSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get(`/correspondence/getCorrespondenceByIdWithViews/65e9b58910afe6e94fc6e6ba?username=brother`);

    expect(response.status).toBe(500);
  });

  it('should return error 500 if getCorrespondencesByOrder throws an error', async () => {
    const mockReqBody = { 
      params: {cid: '65e9b58910afe6e94fc6e6ba'}
    };
    fetchCorrespondenceByIdSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get(`/correspondence/getCorrespondenceByIdWithViews/65e9b58910afe6e94fc6e6ba?username=brother`);

    expect(response.status).toBe(500);
  });
});