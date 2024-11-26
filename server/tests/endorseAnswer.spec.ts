import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';

const endorseAnswerSpy = jest.spyOn(util, 'endorseAnswer');

describe('PATCH /endorseAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should endorse an answer successfully', async () => {
    const validAid = new ObjectId('507f191e810c19729de860ea');
    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [],
      isRemoved: false,
      endorsed: false,
    };

    endorseAnswerSpy.mockImplementation(async (aid, endorsed) => ({ ...mockAnswer, endorsed }));

    const response = await supertest(app)
      .patch('/answer/endorseAnswer')
      .send({ aid: validAid, endorsed: true });

    expect(response.status).toBe(200);
    expect(response.body.endorsed).toEqual(true);
  });

  it('should return error if endorseAnswer method throws an error', async () => {
    const validAid = new mongoose.Types.ObjectId().toString();
    const validQid = new mongoose.Types.ObjectId().toString();

    endorseAnswerSpy.mockResolvedValueOnce({ error: 'Error while endorsing the answer' });

    const response = await supertest(app)
      .patch('/answer/endorseAnswer')
      .send({ qid: validQid, aid: validAid, endorsed: true });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error updating endorsement' });
  });

  it('should allow the question author to endorse and unendorse an answer', async () => {
    const validAid = new ObjectId('507f191e810c19729de860ea');
    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [],
      isRemoved: false,
      endorsed: false,
    };

    endorseAnswerSpy.mockImplementation(async (aid, endorsed) => ({ ...mockAnswer, endorsed }));

    // Endorse the answer
    let response = await supertest(app)
      .patch('/answer/endorseAnswer')
      .send({ aid: validAid, endorsed: true });

    expect(response.status).toBe(200);
    expect(response.body.endorsed).toBe(true);

    // Unendorse the answer
    response = await supertest(app)
      .patch('/answer/endorseAnswer')
      .send({ aid: validAid, endorsed: false });

    expect(response.status).toBe(200);
    expect(response.body.endorsed).toBe(false);
  });
});
