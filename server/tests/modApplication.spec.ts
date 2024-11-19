import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { ModApplication, User } from '../types';

const addModApplicationSpy = jest.spyOn(util, 'addModApplication');
const fetchModApplicationsSpy = jest.spyOn(util, 'fetchModApplications');
const updateAppStatusSpy = jest.spyOn(util, 'updateAppStatus');

const simplifyApplication = (a: ModApplication) => ({
  ...a,
  _id: a._id?.toString(), // Converting ObjectId to string
  user: { ...a.user, _id: a.user._id?.toString() },
});

describe('POST /addModApplication', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new mod application to the database', async () => {
    const validUId = new mongoose.Types.ObjectId();
    const validAppId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: false,
          infractions: [],
          badges: [],
        } as User,
        applicationText: 'hi',
        status: 'unresolved',
      },
    };

    const mockUser: User = {
      _id: validUId,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplicaton: ModApplication = {
      _id: validAppId,
      user: mockUser,
      applicationText: 'hi',
      status: 'unresolved',
    };

    addModApplicationSpy.mockResolvedValueOnce(mockModApplicaton);

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);
    expect(response.status).toBe(200);
    const fixedMockModApplicaton = {
      ...mockModApplicaton,
      _id: validAppId.toString(),
      user: { ...mockUser, _id: validUId.toString() },
    };
    expect(response.body).toEqual(fixedMockModApplicaton);
  });

  it('should return an error if mongoDB operation fails', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: false,
          infractions: [],
          badges: [],
        } as User,
        applicationText: 'hi',
      },
    };

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when adding application: Error when saving the mod application',
    );
  });

  it('should return an error if mongoDB operation fails', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: false,
          infractions: [],
          badges: [],
        } as User,
        applicationText: 'hi',
      },
    };

    addModApplicationSpy.mockRejectedValueOnce('err');
    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding application');
  });

  it('should return a 409 error if another application was', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: false,
          infractions: [],
          badges: [],
        } as User,
        applicationText: 'hi',
        status: 'unresolved',
      },
    };

    addModApplicationSpy.mockResolvedValueOnce({
      error: 'User already created an application request',
    });

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);
    expect(response.status).toBe(409);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/userReport/addReport');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if username property missing', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          password: 'Password1!',
          isModerator: false,
          infractions: [],
        },
        applicationText: 'hi',
        status: 'unresolved',
      },
    };

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid application body');
  });

  it('should return bad request error if password property missing', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          isModerator: false,
          infractions: [],
        },
        applicationText: 'hi',
        status: 'unresolved',
      },
    };

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid application body');
  });

  it('should return bad request error if user is a moderator', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: true,
          infractions: [],
        },
        applicationText: 'hi',
        status: 'unresolved',
      },
    };

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid application body');
  });

  it('should return bad request error if applicationText is missing', async () => {
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      modApplication: {
        user: {
          id: validUId.toString(),
          username: 'user1',
          password: 'Password1!',
          isModerator: false,
          infractions: [],
        },
        status: 'unresolved',
      },
    };

    const response = await supertest(app)
      .post('/modApplication/createModApplication')
      .send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid application body');
  });
});

describe('POST /updateAppStatus', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should accept the application', async () => {
    const validAppId = new mongoose.Types.ObjectId();
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      id: validAppId,
      username: 'user1',
      accepted: true,
    };

    const mockUser: User = {
      _id: validUId,
      username: 'user1',
      password: 'Password1!',
      isModerator: true,
      infractions: [],
      badges: [],
    };

    const mockModApplicaton: ModApplication = {
      _id: validAppId,
      user: mockUser,
      applicationText: 'hi',
      status: 'accepted',
    };

    updateAppStatusSpy.mockResolvedValueOnce(mockModApplicaton);

    const response = await supertest(app)
      .post('/modApplication/updateModApplicationStatus')
      .send(mockReqBody);

    expect(response.status).toBe(200);
    const fixedModApplication = {
      ...mockModApplicaton,
      _id: validAppId.toString(),
      user: { ...mockUser, _id: validUId.toString() },
    };
    expect(response.body).toEqual(fixedModApplication);
  });

  it('should reject the application', async () => {
    const validAppId = new mongoose.Types.ObjectId();
    const validUId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      id: validAppId,
      username: 'user1',
      accepted: false,
    };

    const mockUser: User = {
      _id: validUId,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplicaton: ModApplication = {
      _id: validAppId,
      user: mockUser,
      applicationText: 'hi',
      status: 'rejected',
    };

    updateAppStatusSpy.mockResolvedValueOnce(mockModApplicaton);

    const response = await supertest(app)
      .post('/modApplication/updateModApplicationStatus')
      .send(mockReqBody);

    expect(response.status).toBe(200);
    const fixedModApplication = {
      ...mockModApplicaton,
      _id: validAppId.toString(),
      user: { ...mockUser, _id: validUId.toString() },
    };
    expect(response.body).toEqual(fixedModApplication);
  });

  it('should return an error if the mongo operation returns an Error', async () => {
    const validAppId = new mongoose.Types.ObjectId();

    const mockReqBody = {
      id: validAppId,
      username: 'user1',
      accepted: false,
    };

    updateAppStatusSpy.mockRejectedValueOnce('err');

    const response = await supertest(app)
      .post('/modApplication/updateModApplicationStatus')
      .send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating application');
  });

  it('should return an error if the mongo operation returns an Error', async () => {
    const mockReqBody = {
      id: 'invalidId',
      username: 'user1',
      accepted: false,
    };

    updateAppStatusSpy.mockRejectedValueOnce(new Error('No application found'));

    const response = await supertest(app)
      .post('/modApplication/updateModApplicationStatus')
      .send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating application: No application found');
  });
});

describe('GET /fetchModApplications', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should get all unresolved mod applications', async () => {
    const validAppId1 = new mongoose.Types.ObjectId();
    const validUId1 = new mongoose.Types.ObjectId();

    const mockUser1: User = {
      _id: validUId1,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication1: ModApplication = {
      _id: validAppId1,
      user: mockUser1,
      applicationText: 'hi',
      status: 'unresolved',
    };

    const validAppId2 = new mongoose.Types.ObjectId();
    const validUId2 = new mongoose.Types.ObjectId();

    const mockUser2: User = {
      _id: validUId2,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication2: ModApplication = {
      _id: validAppId2,
      user: mockUser2,
      applicationText: 'hi',
      status: 'rejected',
    };

    const validAppId3 = new mongoose.Types.ObjectId();
    const validUId3 = new mongoose.Types.ObjectId();

    const mockUser3: User = {
      _id: validUId3,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication3: ModApplication = {
      _id: validAppId3,
      user: mockUser3,
      applicationText: 'hi',
      status: 'accepted',
    };

    const mockApplications: ModApplication[] = [
      mockModApplication1,
      mockModApplication2,
      mockModApplication3,
    ];

    const unresolvedMockApplications = mockApplications.filter(
      a => a.status === 'unresolved',
    ) as ModApplication[];

    fetchModApplicationsSpy.mockResolvedValueOnce(unresolvedMockApplications);
    const response = await supertest(app).get('/modApplication/getModApplications');

    expect(response.status).toBe(200);
    const fixed = unresolvedMockApplications.map(a => simplifyApplication(a));
    expect(response.body).toEqual(fixed);
  });

  it('should return empty list when there are no unresolved applications', async () => {
    const validAppId1 = new mongoose.Types.ObjectId();
    const validUId1 = new mongoose.Types.ObjectId();

    const mockUser1: User = {
      _id: validUId1,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication1: ModApplication = {
      _id: validAppId1,
      user: mockUser1,
      applicationText: 'hi',
      status: 'rejected',
    };

    const validAppId2 = new mongoose.Types.ObjectId();
    const validUId2 = new mongoose.Types.ObjectId();

    const mockUser2: User = {
      _id: validUId2,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication2: ModApplication = {
      _id: validAppId2,
      user: mockUser2,
      applicationText: 'hi',
      status: 'rejected',
    };

    const validAppId3 = new mongoose.Types.ObjectId();
    const validUId3 = new mongoose.Types.ObjectId();

    const mockUser3: User = {
      _id: validUId3,
      username: 'user1',
      password: 'Password1!',
      isModerator: false,
      infractions: [],
      badges: [],
    };

    const mockModApplication3: ModApplication = {
      _id: validAppId3,
      user: mockUser3,
      applicationText: 'hi',
      status: 'accepted',
    };

    const mockApplications: ModApplication[] = [
      mockModApplication1,
      mockModApplication2,
      mockModApplication3,
    ];

    const unresolvedMockApplications = mockApplications.filter(
      a => a.status === 'unresolved',
    ) as ModApplication[];

    fetchModApplicationsSpy.mockResolvedValueOnce(unresolvedMockApplications);
    const response = await supertest(app).get('/modApplication/getModApplications');

    expect(response.status).toBe(200);
    const fixed = unresolvedMockApplications.map(a => simplifyApplication(a));
    expect(response.body).toEqual(fixed);
  });

  it('should get all unresolved reports on questions', async () => {
    fetchModApplicationsSpy.mockRejectedValueOnce(new Error('err'));
    const response = await supertest(app).get('/modApplication/getModApplications');

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when fetching applications: err');
  });

  it('should get all unresolved reports on questions', async () => {
    fetchModApplicationsSpy.mockRejectedValueOnce('err');
    const response = await supertest(app).get('/modApplication/getModApplications');

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when fetching applications');
  });
});
