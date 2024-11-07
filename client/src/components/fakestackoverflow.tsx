import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login/logInPage';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import MessagePage from './main/messagePage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import BanPage from './login/banPage';
import SignUpPage from './login/signUpPage';
import ModApplicationPage from './main/modApplicationPage';
import ReviewApplicationPage from './main/reviewApplicationPage';
import ReviewReportsPage from './main/reviewReportPage';
import ReportPage from './reportPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />
        <Route path='ban' element={<BanPage />} />
        <Route path='signup' element={<SignUpPage />} />

        {/* Protected Routes */}
        {
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='home' element={<QuestionPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/messagePage' element={<MessagePage />} />
            <Route path='report' element={<ReportPage />} />
            <Route path='reviewReports' element={<ReviewReportsPage />} />
            <Route path='modApplication' element={<ModApplicationPage />} />
            <Route path='reviewApplication' element={<ReviewApplicationPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
