import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, UserReport } from '../types';
import { R1_TEXT, R2_TEXT, R3_TEXT } from '../data/posts_strings';

const saveReportSpy = jest.spyOn(util, 'saveUserReport');
const addReportSpy = jest.spyOn(util, 'addReport');
const popDocSpy = jest.spyOn(util, 'populateDocument');
const fetchUnresolvedReportsSpy = jest.spyOn(util, 'fetchUnresolvedReports');
const updateReportStatusSpy = jest.spyOn(util, 'updateReportStatus');
const reportResolvedNotificationSpy = jest.spyOn(util, 'reportResolvedNotification');

const simplifyQuestion = (question: Question) => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id?.toString(),
    ansDateTime: (answer as Answer).ansDateTime.toISOString(),
    reports: (answer as Answer).reports.map(r => ({
      ...r,
      _id: r._id?.toString(),
      reportDateTime: (r as UserReport).reportDateTime.toISOString(),
    })),
  })),
  reports: question.reports.map(r => ({
    ...r,
    _id: r._id?.toString(),
    reportDateTime: (r as UserReport).reportDateTime.toISOString(),
  })),
  askDateTime: question.askDateTime.toISOString(),
});

describe('POST /addReport', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should add a new report to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      } as UserReport,
    };

    const mockUserReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    saveReportSpy.mockResolvedValueOnce(mockUserReport);

    addReportSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      reports: [mockUserReport],
      isRemoved: false,
    } as Question);

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      reports: [mockUserReport],
      isRemoved: false,
    });

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validRid.toString(),
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: mockUserReport.reportDateTime.toISOString(),
      status: 'unresolved',
    });
  });

  it('should add a new report to the answer', async () => {
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validAid.toString(),
      type: 'answer',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const mockUserReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    saveReportSpy.mockResolvedValueOnce(mockUserReport);

    addReportSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockUserReport],
      isRemoved: false,
    } as Answer);

    popDocSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockUserReport],
      isRemoved: false,
    } as Answer);

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validRid.toString(),
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: mockUserReport.reportDateTime.toISOString(),
      status: 'unresolved',
    });
  });

  it('should return bad request error if id property missing', async () => {
    const mockReqBody = {
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      report: {
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is not `question` or `answer` ', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'invalidType',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if report text property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      report: {
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if text property of report is empty', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      report: {
        text: '',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid report body');
  });

  it('should return bad request error if reportBy property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'question',
      com: {
        text: 'This is a test report',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if reportDateTime property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'answer',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/userReport/addReport');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if qid is not a valid ObjectId', async () => {
    const mockReqBody = {
      id: 'invalidObjectId',
      type: 'question',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error in response if saveReport method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    saveReportSpy.mockResolvedValueOnce({ error: 'Error when saving a report' });

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding report: Error when saving a report');
  });

  it('should return error in response if operation fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    saveReportSpy.mockRejectedValueOnce('err');

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding report');
  });

  it('should return database error in response if `addReport` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
        status: 'unresolved',
      },
    };

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    saveReportSpy.mockResolvedValueOnce(mockReport);
    addReportSpy.mockResolvedValueOnce({
      error: 'Error when adding report',
    });

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding report: Error when adding report');
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      report: {
        text: 'This is a test report',
        reportBy: 'dummyUserId',
        reportDateTime: new Date('2024-06-03'),
      },
    };

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    saveReportSpy.mockResolvedValueOnce(mockReport);
    addReportSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/userReport/addReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding report: Error when populating document');
  });
});

describe('POST /updateReportStatus', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should remove question and set report status to removed', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const validNotifId = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockQuestion: Question = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockQuestion,
      qid: validQid.toString(),
      postid: validQid.toString(),
      type: 'question',
      isRemoved: true,
    };

    const mockNotification = {
      _id: validNotifId,
      user: 'dummyUserId',
      caption: 'caption',
      redirectUrl: 'url',
      read: false,
      qid: validQid.toString(),
      type: 'report',
      message: 'report.',
      createdAt: new Date(),
    };

    reportResolvedNotificationSpy.mockResolvedValueOnce(mockNotification);
    saveReportSpy.mockResolvedValueOnce(mockReport);
    updateReportStatusSpy.mockResolvedValueOnce({
      ...mockQuestion,
      isRemoved: true,
      reports: [{ ...mockReport, status: 'removed' }],
    });

    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.isRemoved).toBe(true);
    expect(response.body.reports[0].status).toEqual('removed');
  });

  it('should set status of reports to remove and remove answer', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const validNotifId = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockAns: Answer = {
      _id: validAid,
      text: 'This is a test question',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockAns,
      qid: validQid.toString(),
      postid: validAid.toString(),
      type: 'answer',
      isRemoved: true,
    };

    const mockNotification = {
      _id: validNotifId,
      user: 'dummyUserId',
      caption: 'caption',
      redirectUrl: 'url',
      read: false,
      qid: validQid.toString(),
      type: 'report',
      message: 'report.',
      createdAt: new Date(),
    };

    reportResolvedNotificationSpy.mockResolvedValueOnce(mockNotification);
    saveReportSpy.mockResolvedValueOnce(mockReport);
    updateReportStatusSpy.mockResolvedValueOnce({
      ...mockAns,
      isRemoved: true,
      reports: [{ ...mockReport, status: 'removed' }],
    });
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.isRemoved).toBe(true);
    expect(response.body.reports[0].status).toEqual('removed');
  });

  it('should dismiss reports and not remove question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const validNotifId = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockQuestion: Question = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockQuestion,
      qid: validQid.toString(),
      postid: validQid.toString(),
      type: 'question',
      isRemoved: false,
    };

    const mockNotification = {
      _id: validNotifId,
      user: 'dummyUserId',
      caption: 'caption',
      redirectUrl: 'url',
      read: false,
      qid: validQid.toString(),
      type: 'report',
      message: 'report.',
      createdAt: new Date(),
    };

    reportResolvedNotificationSpy.mockResolvedValueOnce(mockNotification);
    saveReportSpy.mockResolvedValueOnce(mockReport);
    updateReportStatusSpy.mockResolvedValueOnce({
      ...mockQuestion,
      isRemoved: false,
      reports: [{ ...mockReport, status: 'dismissed' }],
    });
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.isRemoved).toBe(false);
    expect(response.body.reports[0].status).toEqual('dismissed');
  });

  it('should dismiss reports and not remove answer', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();
    const validNotifId = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockAns: Answer = {
      _id: validAid,
      text: 'This is a test question',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockAns,
      qid: validQid.toString(),
      postid: validAid.toString(),
      type: 'answer',
      isRemoved: false,
    };

    const mockNotification = {
      _id: validNotifId,
      user: 'dummyUserId',
      caption: 'caption',
      redirectUrl: 'url',
      read: false,
      qid: validQid.toString(),
      type: 'report',
      message: 'report.',
      createdAt: new Date(),
    };

    reportResolvedNotificationSpy.mockResolvedValueOnce(mockNotification);
    saveReportSpy.mockResolvedValueOnce(mockReport);
    updateReportStatusSpy.mockResolvedValueOnce({
      ...mockAns,
      isRemoved: false,
      reports: [{ ...mockReport, status: 'dismissed' }],
    });
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.isRemoved).toBe(false);
    expect(response.body.reports[0].status).toEqual('dismissed');
  });

  it('should return an error if there is an error saving notification', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockAns: Answer = {
      _id: validAid,
      text: 'This is a test question',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockAns,
      qid: validQid.toString(),
      postid: validAid.toString(),
      type: 'answer',
      isRemoved: false,
    };

    reportResolvedNotificationSpy.mockRejectedValueOnce(new Error('error'));
    saveReportSpy.mockResolvedValueOnce(mockReport);
    updateReportStatusSpy.mockResolvedValueOnce({
      ...mockAns,
      isRemoved: false,
      reports: [{ ...mockReport, status: 'dismissed' }],
    });
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return an error when a mongoDB operation fails with an Error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockAns: Answer = {
      _id: validAid,
      text: 'This is a test question',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockAns,
      qid: validQid.toString(),
      postid: validAid.toString(),
      type: 'answer',
      isRemoved: false,
    };

    updateReportStatusSpy.mockRejectedValueOnce(new Error('err'));
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating reported object: err');
  });

  it('should return an error when a mongoDB operation fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const validRid = new mongoose.Types.ObjectId();

    const mockReport: UserReport = {
      _id: validRid,
      text: 'This is a test report',
      reportBy: 'dummyUserId',
      reportDateTime: new Date('2024-06-03'),
      status: 'unresolved',
    };

    const mockAns: Answer = {
      _id: validAid,
      text: 'This is a test question',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      reports: [mockReport],
      isRemoved: false,
    };

    const mockReqBody = {
      reportedPost: mockAns,
      qid: validQid.toString(),
      postid: validAid.toString(),
      type: 'answer',
      isRemoved: false,
    };

    updateReportStatusSpy.mockRejectedValueOnce('err');
    const response = await supertest(app).post('/userReport/resolveReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when updating reported object');
  });
});

describe('GET /getUnresolvedReport', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const r1 = {
    _id: new mongoose.Types.ObjectId('65e9b786ff0e893116b2af73'),
    text: R1_TEXT,
    reportBy: 'user1',
    reportDateTime: new Date('2024-06-03'),
    status: 'unresolved',
  };

  const r2 = {
    _id: new mongoose.Types.ObjectId('65e9b786ff0e893116b2af74'),
    text: R2_TEXT,
    reportBy: 'user2',
    reportDateTime: new Date('2024-06-03'),
    status: 'dismissed',
  };

  const r3 = {
    _id: new mongoose.Types.ObjectId('65e9b786ff0e893116b2af75'),
    text: R3_TEXT,
    reportBy: 'user1',
    reportDateTime: new Date('2024-06-03'),
    status: 'removed',
  };

  const tag1 = {
    _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
    name: 'tag1',
    description: 'test',
  };

  const tag2 = {
    _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
    name: 'tag2',
    description: 'test',
  };

  const ans1 = {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    text: 'Answer 1 Text',
    ansBy: 'answer1_user',
    ansDateTime: new Date('2024-06-03'),
    comments: [],
    reports: [],
    isRemoved: false,
  };

  const ans2 = {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
    text: 'Answer 2 Text',
    ansBy: 'answer2_user',
    ansDateTime: new Date('2024-06-03'),
    comments: [],
    reports: [],
    isRemoved: false,
  };

  const ans3 = {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
    text: 'Answer 3 Text',
    ansBy: 'answer3_user',
    ansDateTime: new Date('2024-06-03'),
    comments: [],
    reports: [r1, r2, r3],
    isRemoved: false,
  };

  const ans4 = {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
    text: 'Answer 4 Text',
    ansBy: 'answer4_user',
    ansDateTime: new Date('2024-06-03'),
    comments: [],
    reports: [r1, r2],
    isRemoved: false,
  };

  const mockQuestions = [
    {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 1 Title',
      text: 'Question 1 Text',
      tags: [tag1],
      answers: [ans1],
      askedBy: 'question1_user',
      askDateTime: new Date('2024-06-03'),
      views: ['question1_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
      reports: [r1, r2, r3],
      isRemoved: false,
    },
    {
      _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2, ans3],
      askedBy: 'question2_user',
      askDateTime: new Date('2024-06-04'),
      views: ['question1_user', 'question2_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
      reports: [r2, r1],
      isRemoved: false,
    },
    {
      _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans4],
      askedBy: 'question3_user',
      askDateTime: new Date('2024-06-03'),
      views: ['question1_user', 'question3_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
      reports: [r3],
      isRemoved: true,
    },
  ];

  it('should get all unresolved reports on questions', async () => {
    const mockReqBody = {
      type: 'question',
    };

    const unresolvedReportsQ = mockQuestions.filter(q =>
      q.reports.some(r => r.status === 'unresolved'),
    ) as Question[];

    fetchUnresolvedReportsSpy.mockResolvedValueOnce(unresolvedReportsQ);
    const response = await supertest(app).get('/userReport/getUnresolvedReport').send(mockReqBody);

    expect(response.status).toBe(200);
    const fixed = unresolvedReportsQ.map(q => simplifyQuestion(q));
    expect(response.body).toEqual(fixed);
  });

  it('should return unresolved reports on answers', async () => {
    const mockReqBody = {
      type: 'answer',
    };

    const unresolvedReportsQ = mockQuestions.filter(q =>
      q.reports.some(r => r.status === 'unresolved'),
    ) as Question[];

    fetchUnresolvedReportsSpy.mockResolvedValueOnce(unresolvedReportsQ);
    const response = await supertest(app).get('/userReport/getUnresolvedReport').send(mockReqBody);

    expect(response.status).toBe(200);
    const fixed = unresolvedReportsQ.map(q => simplifyQuestion(q));
    expect(response.body).toEqual(fixed);
  });

  it('should return an error when a mongoDB operation fails with an Error', async () => {
    const mockReqBody = {
      type: 'question',
    };

    fetchUnresolvedReportsSpy.mockRejectedValueOnce(new Error('err'));
    const response = await supertest(app).get('/userReport/getUnresolvedReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when fetching applications: err');
  });

  it('should return an error when a mongoDB operation fails', async () => {
    const mockReqBody = {
      type: 'question',
    };

    fetchUnresolvedReportsSpy.mockRejectedValueOnce('err');
    const response = await supertest(app).get('/userReport/getUnresolvedReport').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when fetching applications');
  });
});
