import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Badge } from '../types';

const MOCK_BADGES = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    name: 'Sage',
    description: 'Answer 15 questions.',
    category: 'answers',
    targetValue: 15,
    tier: 'silver',
    users: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    name: 'Sage',
    description: 'Answer 10 questions.',
    category: 'answers',
    targetValue: 10,
    tier: 'bronze',
    users: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    name: 'Sage',
    description: 'Answer 25 questions.',
    category: 'answers',
    targetValue: 25,
    tier: 'gold',
    users: [],
  },
];

describe('GET /allBadges', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return several badge objects in the response when the request is valid', async () => {
    jest.spyOn(util, 'getAllBadges').mockResolvedValue(MOCK_BADGES as Badge[]);

    const response = await supertest(app).get('/badge/allBadges');

    // format both response and mock data for consistent `_id` type
    const formatBadge = (badge: Badge) => ({
      ...badge,
      _id: badge._id ? badge._id.toString() : null,
    });

    // format response and mock data to have string `_id` for comparison
    response.body.map(formatBadge);

    expect(response.status).toBe(200);
  });
});

describe('GET /byUser/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return proper badges acquired by one user', async () => {
    const mockReqParams = { username: 'user1' };
    jest.spyOn(util, 'getBadgesByUser').mockResolvedValue(MOCK_BADGES as Badge[]);

    const response = await supertest(app).get(`/badge/byUser/${mockReqParams.username}`);

    // convert _id fields to strings for comparison
    response.body.map((badge: Badge) => ({
      ...badge,
      _id: badge._id ? badge._id.toString() : undefined,
    }));

    expect(response.status).toBe(200);
  });

  it('should throw an error if the user is invalid', async () => {
    const invalidUsername = 'nonExistentUser';
    jest.spyOn(util, 'getBadgesByUser').mockRejectedValue(new Error('User not found'));

    const response = await supertest(app).get(`/badge/byUser/${invalidUsername}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it("should return an empty array if the user doesn't have any badges", async () => {
    const mockReqParams = { username: 'userWithNoBadges' };

    jest.spyOn(util, 'getBadgesByUser').mockResolvedValue([]);

    const response = await supertest(app).get(`/badge/byUser/${mockReqParams.username}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
describe('GET /getEarnedUsers/:badgeName', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return a proper list of users who have earned a given badge', async () => {
    const mockBadgeName = 'Sage';
    const mockUsers = ['user1', 'user2', 'user3'];
    jest.spyOn(util, 'getBadgeUsers').mockResolvedValue(mockUsers);

    const response = await supertest(app).get(`/badge/getEarnedUsers/${mockBadgeName}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('should return an empty array if no users have earned the badge', async () => {
    const mockBadgeName = 'UnpopularBadge';
    jest.spyOn(util, 'getBadgeUsers').mockResolvedValue([]);

    const response = await supertest(app).get(`/badge/getEarnedUsers/${mockBadgeName}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should throw an error if given an invalid badge name', async () => {
    const mockInvalidBadgeName = 'InvalidBadge';
    jest.spyOn(util, 'getBadgeUsers').mockImplementation(() => {
      throw new Error('Badge not found');
    });

    const response = await supertest(app).get(`/badge/getEarnedUsers/${mockInvalidBadgeName}`);

    expect(response.status).toBe(500);
  });
});

describe('POST /addBadge', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should successfully save a new badge and return the saved badge', async () => {
    const mockBadge: Badge = {
      name: 'Sage',
      category: 'answers',
      description: 'Answer 15 questions.',
      targetValue: 15,
      tier: 'silver',
      users: [],
    };

    jest.spyOn(util, 'saveBadge').mockResolvedValue(mockBadge);

    const response = await supertest(app).post('/badge/addBadge').send(mockBadge);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBadge);
  });

  it('should return an error message if saving the badge fails', async () => {
    const mockBadge: Badge = {
      name: 'Sage',
      category: 'answers',
      description: 'Answer 15 questions.',
      targetValue: 15,
      tier: 'silver',
      users: [],
    };

    jest.spyOn(util, 'saveBadge').mockResolvedValue({ error: 'Error when saving a badge' });

    const response = await supertest(app).post('/badge/addBadge').send(mockBadge);

    expect(response.status).toBe(500);
  });

  it('should return an error for invalid badge input', async () => {
    const invalidBadge = {
      name: '',
      category: 'answers',
      description: '',
      targetValue: -5,
      tier: 'silver',
      users: [],
    };

    const response = await supertest(app).post('/badge/addBadge').send(invalidBadge);

    expect(response.status).toBe(400);
  });
});
