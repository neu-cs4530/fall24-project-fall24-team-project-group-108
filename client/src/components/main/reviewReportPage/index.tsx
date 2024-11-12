import { useNavigate } from 'react-router-dom';
import useReportReviewPage from '../../../hooks/useReportReviewPage';
import { getMetaData } from '../../../tool';
import { UserReport } from '../../../types';
import ReviewReportHeader from './Header';
import './index.css';
import useModStatus from '../../../hooks/useModStatus';

/**
 * SignUp component that renders a page where a user can create a new account or 'user' that will post to the database if not already
 * present. Also allows for navigation back to the login page.
 */
const ReviewReportsPage = () => {
  const { moderatorStatus } = useModStatus();
  const { numReports, allReports, err, reportsVisible, handleReportDecision, handleReportVisible } =
    useReportReviewPage();
  const navigate = useNavigate();

  if (!moderatorStatus) {
    navigate('/home');
  }

  if (numReports === 0) {
    return (
      <>
        <ReviewReportHeader reportCount={numReports} />
        <div className='container'>
          <h2>You are all caught up! No reports left.</h2>;
        </div>
      </>
    );
  }

  return (
    <>
      <ReviewReportHeader reportCount={numReports} />
      {allReports.map(reportedObject => {
        const isQ = 'askedBy' in reportedObject;
        const reportedText = isQ ? 'Reported Question' : 'Reported Answer';
        const reportAskedBy = isQ ? reportedObject.askedBy : reportedObject.answer.ansBy;
        const objId = isQ ? reportedObject._id : reportedObject.answer._id;
        const reports = isQ ? reportedObject.reports : reportedObject.answer.reports;
        const reportedQAns = isQ ? reportedObject : reportedObject.answer;

        return (
          <div className='reports-container' key={objId}>
            <h3>{reportedText}</h3>
            <div className='reports-container'>
              <h4 className='reports-username'>{reportAskedBy}</h4>
              {'title' in reportedObject && <h4>{reportedObject.title}</h4>}
              <p
                onClick={() => {
                  const path =
                    'askedBy' in reportedObject
                      ? `/question/${reportedObject._id}`
                      : `/question/${reportedObject.qid}`;
                  navigate(path);
                }}>
                {isQ ? reportedObject.text : reportedObject.answer.text}
              </p>
            </div>
            <div>
              <h3>{reports.length} Reports:</h3>
              {reportsVisible && (
                <div className='reports-container'>
                  {reports.map((report: UserReport, index: number) => (
                    <div key={index}>
                      <div className={index !== reports.length - 1 ? 'reports-separater' : ''}>
                        <h4>{report.reportBy}</h4>
                        <p>{report.text}</p>
                        <p className='reports-date'>
                          {getMetaData(new Date(report.reportDateTime))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span onClick={handleReportVisible} style={{ cursor: 'pointer' }}>
                {reportsVisible ? 'Hide' : 'Show'} Reports
              </span>
            </div>
            <div className='button-container'>
              <button
                className='application-button application-button-accept'
                onClick={() =>
                  handleReportDecision(
                    reportedQAns,
                    'askedBy' in reportedObject ? 'question' : 'answer',
                    true,
                  )
                }>
                Accept
              </button>
              <button
                className='application-button application-button-reject'
                onClick={() =>
                  handleReportDecision(
                    reportedQAns,
                    'askedBy' in reportedObject ? 'question' : 'answer',
                    false,
                  )
                }>
                Reject
              </button>
            </div>
            {err && (
              <div>
                <p>{err}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ReviewReportsPage;
