// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
// startServer() is a function that starts the server
// the server will listen on .env.CLIENT_URL if set, otherwise 8000
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import commentController from './controller/comment';
import { userController } from './controller/user';
import { FakeSOSocket } from './types';
import badgeController from './controller/badge';
import modApplicationController from './controller/modApplication';
import badgeProgressController from './controller/badgeProgress';
import correspondenceController from './controller/correspondence';
import messageController from './controller/message';
import userReportController from './controller/userReport';
import notificationController from './controller/notification';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose.connect(MONGO_URL).catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
  socket.close();
});

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));
app.use('/badge', badgeController(socket));
app.use('/badgeProgress', badgeProgressController(socket));
app.use('/user', userController());
app.use('/modApplication', modApplicationController(socket));
app.use('/userReport', userReportController(socket));
app.use('/correspondence', correspondenceController(socket));
app.use('/message', messageController(socket));
app.use('/modApplication', modApplicationController());
app.use('/notifications', notificationController(socket));

// Export the app instance
export { app, server, startServer };
