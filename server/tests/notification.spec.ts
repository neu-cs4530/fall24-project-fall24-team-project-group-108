import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import NotificationModel from '../models/notifications';
import { Notification } from '../types';

describe('GET /notifications/getAll', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should properly return existing notifications', async () => {
    const mockNotifications = [
      {
        user: 'user1',
        read: false,
        message: 'Test notification',
        createdAt: new Date(),
      },
    ];

    // Mock the find and sort chain
    const mockFind = jest.spyOn(NotificationModel, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockNotifications),
    } as unknown as mongoose.Query<Notification[], Notification>);

    const response = await supertest(app).get('/notifications/getAll').query({
      username: 'user1',
      readStatus: 'unread',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ user: 'user1', read: false })]),
    );
    expect(mockFind).toHaveBeenCalledWith({ user: 'user1', read: false });
  });

  it('should return 400 if username is missing', async () => {
    const response = await supertest(app).get('/notifications/getAll').query({
      readStatus: 'read',
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Username is required');
  });

  it('should return 500 if an error occurs while fetching notifications', async () => {
    // Mock the find method to throw an error
    const mockFind = jest.spyOn(NotificationModel, 'find').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await supertest(app).get('/notifications/getAll').query({
      username: 'user3',
      readStatus: 'unread',
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching notifications: Database error');

    expect(mockFind).toHaveBeenCalledWith({ user: 'user3', read: false });
  });
});

describe('POST /notifications/markRead', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully mark a notification as read', async () => {
    const mockNotification = {
      _id: '123456789',
      user: 'testUser',
      read: true,
      message: 'Test notification',
      createdAt: new Date(),
    };

    const mockFindByIdAndUpdate = jest
      .spyOn(NotificationModel, 'findByIdAndUpdate')
      .mockResolvedValue(mockNotification);

    const response = await supertest(app)
      .post('/notifications/markRead')
      .query({ nid: '123456789' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '123456789',
        read: true,
      }),
    );
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('123456789', { read: true }, { new: true });
  });

  it('should return 400 if notification id is missing', async () => {
    const response = await supertest(app).post('/notifications/markRead').query({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Notification id is required');
  });

  it('should return 404 if notification is not found', async () => {
    const mockFindByIdAndUpdate = jest
      .spyOn(NotificationModel, 'findByIdAndUpdate')
      .mockResolvedValue(null);

    const response = await supertest(app)
      .post('/notifications/markRead')
      .query({ nid: 'nonexistentid' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Notification not found');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'nonexistentid',
      { read: true },
      { new: true },
    );
  });

  it('should return 500 if database operation fails', async () => {
    const mockFindByIdAndUpdate = jest
      .spyOn(NotificationModel, 'findByIdAndUpdate')
      .mockRejectedValue(new Error('Database error'));

    const response = await supertest(app)
      .post('/notifications/markRead')
      .query({ nid: '123456789' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when marking notification as read: Database error');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('123456789', { read: true }, { new: true });
  });

  it('should return 500 if unknown error occurs', async () => {
    const mockFindByIdAndUpdate = jest
      .spyOn(NotificationModel, 'findByIdAndUpdate')
      .mockRejectedValue('Unknown error');

    const response = await supertest(app)
      .post('/notifications/markRead')
      .query({ nid: '123456789' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when marking notification as read');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('123456789', { read: true }, { new: true });
  });
});
