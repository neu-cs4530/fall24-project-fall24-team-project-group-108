import express, { Request, Response, Router } from 'express';
import { ObjectId } from 'mongodb';
// import { getTagCountMap } from '../models/application';
// import TagModel from '../models/tags';
// import TagAnswerCountModel from '../models/tagAnswerCounts';
import {
    UploadedFile,
    AddUploadedFileRequest,
    FakeSOSocket,
    FindUploadedFileByIdRequest
  } from '../types';
  import {
      saveUploadedFile,
      fetchUploadedFileById,
      fetchUploadedFiles,
      addUploadedFileToMessage
  } from '../models/application';


const uploadedFileController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  const multer = require('multer');
  const fs = require('fs');
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  /**
   * Validates the uploaded file object to ensure it contains all the necessary fields.
   *
   * @param uploadedFile The uploaded file object to validate.
   *
   * @returns `true` if the uploaded file is valid, otherwise `false`.
   */
   const isUploadedFileBodyValid = (uploadedFile: UploadedFile): boolean => 
   uploadedFile.fileName !== undefined &&
   uploadedFile.data !== undefined;
   

  const getUploadedFiles = async (
    _: Request,
    res: Response,
  ): Promise<void> => {

    try {
      const c = await fetchUploadedFiles();
      res.json(c);
      return;

    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching uploaded files list: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching uploaded files list`);
      }
    }
  };

  const getUploadedFileById = async (
    req: FindUploadedFileByIdRequest,
    res: Response,
  ): Promise<void> => {
    const { ufid } = req.params;

    if (!ObjectId.isValid(new ObjectId(ufid))) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const uf = await fetchUploadedFileById(ufid);
      res.json(uf);
      return;

    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching uploaded file by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching uploaded file by id`);
      }
    }
  };

  /**
   * Adds a new uploaded file to the database. The uploaded file is first validated and then saved.
   * If saving the uploaded file fails, the HTTP response status is updated.
   *
   * @param req The AddUploadedFileRequest object containing the uploaded file data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUploadedFile = async (req: AddUploadedFileRequest, res: Response): Promise<void> => {
    if (!isUploadedFileBodyValid(req.body.uploadedFile)) {
      res.status(400).send('Invalid uploaded file body');
      return;
    }
    const { uploadedFile , mid } = req.body;
    try {
        console.log('Start saveUploadedFile');
        console.log(uploadedFile);
      const messageFromDb = await saveUploadedFile(uploadedFile);
      console.log('End saveUploadedFile');
      console.log(messageFromDb);
      if ('error' in messageFromDb) {
        throw new Error(messageFromDb.error);
      }

      console.log('Start addUploadedFileToMessage');
      console.log(messageFromDb);
      const status = await addUploadedFileToMessage(mid, messageFromDb);
      console.log('End addUploadedFileToMessage');
      console.log(status);
      console.log(mid);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      socket.emit('uploadedFileUpdate', messageFromDb);
      socket.emit('messageUpdate', status)
      res.json(status);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving correspondence: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving correspondence`);
      }
    }
  };


  // Add appropriate HTTP verbs and their endpoints to the router.
  router.get('/getUploadedFiles', getUploadedFiles);
  router.get('/getUploadedFileById/:ufid', getUploadedFileById);
  router.post('/addUploadedFile', upload.single('file'),  addUploadedFile);

  return router;
};

export default uploadedFileController;
