import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import BadgeProgressModel from '../models/badgeProgresses';

describe('GET /getProgress', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return the progress count for a valid user and category', async () => {
    const mockProgress = { currentValue: 5 };

    jest.spyOn(BadgeProgressModel, 'findOne').mockResolvedValue(mockProgress);

    const response = await supertest(app)
      .get('/badgeProgress/getProgress')
      .query({ username: 'user1', category: 'answers' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ count: 5 });
  });

  it('should return 0 if no progress exists for the user and category', async () => {
    jest.spyOn(BadgeProgressModel, 'findOne').mockResolvedValue(null);

    const response = await supertest(app)
      .get('/badgeProgress/getProgress')
      .query({ username: 'user1', category: 'answers' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ count: 0 });
  });

  it('should return a 400 error if username or category is missing', async () => {
    const response = await supertest(app)
      .get('/badgeProgress/getProgress')
      .query({ username: 'user1' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Username and category are required.' });
  });

  it('should return an error for server issues', async () => {
    jest.spyOn(BadgeProgressModel, 'findOne').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await supertest(app)
      .get('/badgeProgress/getProgress')
      .query({ username: 'user1', category: 'answers' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});

describe('POST /update', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 400 for an invalid request', async () => {
    const response = await supertest(app).post('/badgeProgress/update').send({}); // Sending an empty body to simulate an invalid request

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should increment existing badge progress entries', async () => {
    const mockProgress = {
      _id: 'progress1',
      user: 'user1',
      badge: 'badge1',
      category: 'answers',
      targetValue: 10,
      currentValue: 5,
      save: jest.fn(),
    };

    jest.spyOn(BadgeProgressModel, 'find').mockResolvedValue([mockProgress]);

    const response = await supertest(app)
      .post('/badgeProgress/update')
      .send({ username: 'user1', category: 'answers' });

    expect(response.status).toBe(200);
    expect(mockProgress.currentValue).toBe(6);
    expect(mockProgress.save).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs during update', async () => {
    jest.spyOn(BadgeProgressModel, 'find').mockRejectedValue(new Error('Database error'));

    const response = await supertest(app)
      .post('/badgeProgress/update')
      .send({ username: 'user1', category: 'answers' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when update badge progress');
  });
});
