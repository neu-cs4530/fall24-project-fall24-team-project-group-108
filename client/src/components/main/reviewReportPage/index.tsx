import useReportReviewPage from '../../../hooks/useReportReviewPage';
import { getMetaData } from '../../../tool';
import { UserReport } from '../../../types';
import ReviewReportHeader from './Header';
import './index.css';

/**
 * SignUp component that renders a page where a user can create a new account or 'user' that will post to the database if not already
 * present. Also allows for navigation back to the login page.
 */
const ReviewReportsPage = () => {
  const { numReports, allReports, err, reportsVisible, handleReportDecision, handleReportVisible } =
    useReportReviewPage();

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
      {allReports.map(reportedObject => (
        <div className='reports-container' key={reportedObject._id}>
          <h3>{'askedBy' in reportedObject ? 'Reported Question' : 'Reported Answer'}</h3>
          <div className='reports-container'>
            <h4 className='reports-username'>
              {'askedBy' in reportedObject ? reportedObject.askedBy : reportedObject.ansBy}
            </h4>
            {'title' in reportedObject && <h4>{reportedObject.title}</h4>}
            <p>{reportedObject.text}</p>
          </div>
          <div>
            <h3>{reportedObject.reports.length} Reports:</h3>
            {reportsVisible && (
              <div className='reports-container'>
                {reportedObject.reports.map((report: UserReport, index: number) => (
                  <div key={index}>
                    <div
                      className={
                        index !== reportedObject.reports.length - 1 ? 'reports-separater' : ''
                      }>
                      <h4>{report.reportBy}</h4>
                      <p>{report.text}</p>
                      <p className='reports-date'>{getMetaData(new Date(report.reportDateTime))}</p>
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
                  reportedObject,
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
                  reportedObject,
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
      ))}
    </>
  );
};

export default ReviewReportsPage;
