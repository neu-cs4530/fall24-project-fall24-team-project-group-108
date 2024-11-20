import { UploadedFile, Message } from '../types';
import api from './config';

const UPLOADED_FILE_API_URL = `${process.env.REACT_APP_SERVER_URL}/uploadedFile`;

/**
 * Function to get all uploaded files
 *
 * @throws Error if there is an issue fetching uploaded files
 */
const getUploadedFiles = async (): Promise<UploadedFile[]> => {
  const res = await api.get(`${UPLOADED_FILE_API_URL}/getUploadedFiles`);
  if (res.status !== 200) {
    throw new Error('Error when fetching uploaded files');
  }
  return res.data;
};

/**
 * Function to get uploaded file by id
 *
 * @throws Error if there is an issue fetching uploaded file by id
 */
const getUploadedFileById = async (ufid: string): Promise<UploadedFile> => {
  const res = await api.get(`${UPLOADED_FILE_API_URL}/getUploadedFileById/${ufid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching uploaded files');
  }
  return res.data;
};

/**
 * Function to add a new uploaded file.
 *
 * @param mid - The id of the message containing the uploaded file
 * @param uploadedFile - the file to uploaded
 * @throws Error if there is an issue creating the new uploaded file.
 */
const addUploadedFile = async (mid: string, uploadedFile: UploadedFile): Promise<Message> => {
  console.log('Start addUploadedFile');
  console.log(mid);
  const res = await api.post(`${UPLOADED_FILE_API_URL}/addUploadedFile`, { mid, uploadedFile });
  console.log(res);
  console.log('End addUploadedFile');

  if (res.status !== 200) {
    throw new Error('Error while creating a new uploaded file');
  }

  return res.data;
};

export { getUploadedFileById, getUploadedFiles, addUploadedFile };
