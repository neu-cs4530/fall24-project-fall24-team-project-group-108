import useModApplicationPage from '../../../hooks/useModApplicationPage';
import { ModApplication } from '../../../types';
import ReviewModApplicationHeader from './header';
import './index.css';
import useModNavigationPrivileges from '../../../hooks/useModNavigationPrivileges';
import useBan from '../../../hooks/useBan';

/**
 * ReviewApplicationPage component allows moderators to accept or reject moderator applications by users.
 */
const ReviewApplicationPage = () => {
  useModNavigationPrivileges();
  useBan();
  const { applications, numApps, err, handleApplicationDecision } = useModApplicationPage();

  if (!applications.length) {
    return (
      <>
        <ReviewModApplicationHeader modAppCount={numApps} />
        <div className='container'>
          <h2>You are all caught up! No applications left.</h2>;
        </div>
      </>
    );
  }

  return (
    <>
      <ReviewModApplicationHeader modAppCount={numApps} />
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
