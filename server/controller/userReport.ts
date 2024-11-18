import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  AddUserReportRequest,
  UserReport,
  ResolveReportedRequest,
  GetUserReportRequest,
} from '../types';
import {
  addReport,
  fetchUnresolvedReports,
  populateDocument,
  saveUserReport,
  updateReportStatus,
} from '../models/application';

const userReportController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided report request contains the required fields.
   *
   * @param req - The request object containing the report data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddUserReportRequest): boolean =>
    !!req.body.id &&
    !!req.body.type &&
    (req.body.type === 'question' || req.body.type === 'answer') &&
    !!req.body.report &&
    req.body.report.text !== undefined &&
    req.body.report.reportBy !== undefined &&
    req.body.report.reportDateTime !== undefined;

  /**
   * Validates the report object to ensure it is not empty.
   *
   * @param report - The report to validate.
   *
   * @returns `true` if the report is valid, otherwise `false`.
   */
  const isReportValid = (report: UserReport): boolean =>
    report.text !== undefined &&
    report.text !== '' &&
    report.reportBy !== undefined &&
    report.reportBy !== '' &&
    report.reportDateTime !== undefined &&
    report.reportDateTime !== null;

  /**
   * Handles adding aF new report to the specified question or answer. The report is first validated and then saved.
   * If the report is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req - The AddReportRequest object containing the report data.
   * @param res - The HTTP response object used to send back the result of the operation.
   * @param type - The type of the report, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const addReportRoute = async (req: AddUserReportRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { report, type } = req.body;

    if (!isReportValid(report)) {
      res.status(400).send('Invalid report body');
      return;
    }

    try {
      const reportFromDb = await saveUserReport(report);

      if ('error' in reportFromDb) {
        throw new Error(reportFromDb.error);
      }

      const status = await addReport(id, type, reportFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the question or answer that this report
      // was added to, and emits the updated object
      const populatedDoc = await populateDocument(id, type);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      socket.emit('userReportsUpdate', { result: populatedDoc, type });
      res.json(reportFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding report: ${(err as Error).message}`);
      } else {
        res.status(500).send(`Error when adding report`);
      }
    }
  };

  /**
   * Retrieves all unresolved reported objects in the database. If fetching the reported objects fails, the HTTP response status is updated.
   *
   * @param _ - Placeholder value.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUnresolvedReport = async (req: GetUserReportRequest, res: Response): Promise<void> => {
    const { type } = req.query;
    try {
      const reports = await fetchUnresolvedReports(type);
      res.json(reports);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching applications: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching applications`);
      }
    }
  };

  /**
   * Resolves a reported question or answer. If resolving fails, the HTTP response status is updated.
   *
   * @param req - The ResolveReportedRequest object containing the reported object data.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const resolveReport = async (req: ResolveReportedRequest, res: Response): Promise<void> => {
    const { reportedPost, qid, postId, type, isRemoved } = req.body;
    try {
      const resolved = await updateReportStatus(reportedPost, postId, type, isRemoved);
      if (isRemoved === true) {
        socket.emit('removePostUpdate', {
          qid,
          updatedPost: resolved,
        });
      } else {
        socket.emit('reportDismissedUpdate', {
          qid,
          updatedPost: resolved,
        });
      }
      res.json(resolved);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating reported object: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating reported object`);
      }
    }
  };

  router.post('/addReport', addReportRoute);
  router.get('/getUnresolvedReport', getUnresolvedReport);
  router.post('/resolveReport', resolveReport);

  return router;
};

export default userReportController;
