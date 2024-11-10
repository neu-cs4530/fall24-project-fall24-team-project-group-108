import { useNavigate } from 'react-router-dom';
import useModApplicationPage from '../../../hooks/useModApplicationPage';
import { ModApplication } from '../../../types';
import ReviewModApplicationHeader from './header';
import './index.css';
import useModStatus from '../../../hooks/useModStatus';

/**
 * ReviewApplicationPage component allows moderators to accept or reject moderator applications by users.
 */
const ReviewApplicationPage = () => {
  const { moderatorStatus } = useModStatus();
  const { applications, err, handleApplicationDecision } = useModApplicationPage();
  const navigate = useNavigate();

  if (!moderatorStatus) {
    navigate('/home');
  }

  if (!applications.length) {
    return (
      <>
        <ReviewModApplicationHeader modAppCount={applications.length} />
        <div className='container'>
          <h2>You are all caught up! No applications left.</h2>;
        </div>
      </>
    );
  }

  return (
    <>
      <ReviewModApplicationHeader modAppCount={applications.length} />
      {applications.map((application: ModApplication) => (
        <div className='application-container' key={application._id}>
          <h4 className='username'>{application.username}</h4>
          <p>{application.applicationText}</p>
          <div className='button-container'>
            <button
              className='application-button application-button-accept'
              onClick={() => handleApplicationDecision(application, true)}>
              Accept
            </button>
            <button
              className='application-button application-button-reject'
              onClick={() => handleApplicationDecision(application, false)}>
              Reject
            </button>
          </div>
          {err && (
            <div>
              <p>{err}</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ReviewApplicationPage;
