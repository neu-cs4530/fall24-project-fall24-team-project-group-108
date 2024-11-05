import useModApplicationPage from '../../../hooks/useModApplicationPage';
import { ModApplication } from '../../../types';
import ReviewModApplicationHeader from './header';
import './index.css';

const ReviewApplicationPage = () => {
  const { applications, err, handleAccept, handleReject } = useModApplicationPage();

  if (err) {
    return (
      <div className='container'>
        <h2>{err}</h2>;
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className='container'>
        <h2>You are all caught up! No applications left.</h2>;
      </div>
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
              onClick={() => handleAccept(application)}>
              Accept
            </button>
            <button
              className='application-button application-button-reject'
              onClick={() => handleReject(application)}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReviewApplicationPage;
