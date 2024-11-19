import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, Tag, User, UserReport } from '../types';
import { R1_TEXT, R2_TEXT, R3_TEXT } from '../data/posts_strings';

const addUserSpy = jest.spyOn(util, 'addUser');
const updateUserModStatusSpy = jest.spyOn(util, 'updateUserModStatus');
const findUserSpy = jest.spyOn(util, 'findUser');

describe('GET /authenticateUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should authenticate a user in the database', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockUser: User = {
      _id: validUId,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
    };

    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    findUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).get('/user/authenticateUser').query(mockReqBody);
    expect(response.status).toBe(200);
    const fixed = { ...mockUser, _id: validUId.toString() };
    expect(response.body).toEqual(fixed);
  });

  it('should return an error if user is not in the database', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    findUserSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/user/authenticateUser').query(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when authenticating user: User not found in database');
  });

  it('should return an error if user is not in the database', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    findUserSpy.mockRejectedValueOnce('err');

    const response = await supertest(app).get('/user/authenticateUser').query(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when authenticating user');
  });

  it('should return an error if username is not in the request', async () => {
    const mockReqBody = {
      password: 'Password1!',
    };

    const response = await supertest(app).get('/user/authenticateUser').query(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });

  it('should return an error if password is not in the request', async () => {
    const mockReqBody = {
      username: 'user1',
    };

    const response = await supertest(app).get('/user/authenticateUser').query(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });

  it('should return an error if no request is sent', async () => {
    const response = await supertest(app).get('/user/authenticateUser');
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });
});

describe('POST /createUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should create a user in the database', async () => {
    const mockUser: User = {
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
    };

    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    addUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should throw an error if user is already in the database', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    addUserSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Username cannot be used');
  });

  it('should throw an error if request has no username', async () => {
    const mockReqBody = {
      password: 'Password1!',
    };

    addUserSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });

  it('should throw an error if the request has no password', async () => {
    const mockReqBody = {
      username: 'user1',
    };

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });

  it('should throw an error if no request is sent', async () => {
    const response = await supertest(app).post('/user/createUser');
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Invalid user body');
  });

  it('should throw an error if an Error is returned from the database operations', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    addUserSpy.mockRejectedValueOnce(new Error('err'));

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Username cannot be used');
  });

  it('should throw an error unexpected if result is thrown', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    addUserSpy.mockRejectedValueOnce('err');

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when authenticating user: err');
  });

  it('should throw an error unexpected if result is thrown', async () => {
    const mockReqBody = {
      username: 'user1',
      password: 'Password1!',
    };

    addUserSpy.mockRejectedValueOnce('');

    const response = await supertest(app).post('/user/createUser').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when authenticating user');
  });
});

describe('POST /makeUserModerator', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should make a user a moderator', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockUser: User = {
      _id: validUId,
      username: 'user1',
      password: 'Password1!',
      isModerator: true,
      infractions: [],
    };

    const mockReqBody = {
      username: 'user1',
    };

    updateUserModStatusSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).post('/user/makeUserModerator').send(mockReqBody);
    expect(response.status).toBe(200);
    const fixed = { ...mockUser, _id: validUId.toString() };
    expect(response.body).toEqual(fixed);
  });

  it('should return an error if mongoDB operations fail', async () => {
    const mockReqBody = {
      username: 'user1',
    };

    updateUserModStatusSpy.mockRejectedValueOnce(new Error('err'));

    const response = await supertest(app).post('/user/makeUserModerator').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating user moderator status: err');
  });

  it('should return an error if mongoDB operations fail', async () => {
    const mockReqBody = {
      username: 'user1',
    };

    updateUserModStatusSpy.mockRejectedValueOnce('err');

    const response = await supertest(app).post('/user/makeUserModerator').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating user moderator status');
  });
});
