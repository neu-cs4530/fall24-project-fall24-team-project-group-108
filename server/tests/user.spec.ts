import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, Tag, UserReport } from '../types';
import { R1_TEXT, R2_TEXT, R3_TEXT } from '../data/posts_strings';

const addModApplicationSpy = jest.spyOn(util, 'findUser');
const fetchModApplicationsSpy = jest.spyOn(util, 'addUser');
const updateAppStatusSpy = jest.spyOn(util, 'updateUserModStatus');

describe('GET /authenticateUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new mod application to the database', async () => {});
});

describe('POST /createUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
});

describe('POST /makeUserModerator', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
});
