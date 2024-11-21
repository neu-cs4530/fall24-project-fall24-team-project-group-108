import { useNavigate } from 'react-router-dom';
import { getMetaData } from '../../../tool';
import { UserReport } from '../../../types';
import ReviewReportHeader from './Header';
import './index.css';
import useReportReviewPage from '../../../hooks/useReportReviewPage';
import useModNavigationPrivileges from '../../../hooks/useModNavigationPrivileges';
import useBan from '../../../hooks/useBan';

/**
 * ReviewReportsPage component that renders a page where a mod can review reported Questions and Answers.
 */
const ReviewReportsPage = () => {
  useModNavigationPrivileges();
  useBan();
  const { numReports, allReports, err, reportsVisible, handleReportDecision, handleReportVisible } =
    useReportReviewPage();
  const navigate = useNavigate();

  if (!allReports.length) {
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
        const qid = isQ ? reportedObject._id : reportedObject.qid;
        const reports = isQ ? reportedObject.reports : reportedObject.answer.reports;
        const reportedQAns = isQ ? reportedObject : reportedObject.answer;

        if (!objId || !qid) {
          return <div key='error'>Cannot retrieve ID</div>;
        }

        return (
          <div className='accent-container' key={objId}>
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
              {reportsVisible[objId] && (
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
              <span onClick={() => handleReportVisible(objId)} style={{ cursor: 'pointer' }}>
                {reportsVisible[objId] ? 'Hide' : 'Show'} Reports
              </span>
            </div>
            <div className='button-container'>
              <button
                className='application-button application-button-accept'
                onClick={() =>
                  handleReportDecision(
                    reportedQAns,
                    qid,
                    'askedBy' in reportedObject ? 'question' : 'answer',
                    false,
                  )
                }>
                Dismiss
              </button>
              <button
                className='application-button application-button-reject'
                onClick={() =>
                  handleReportDecision(
                    reportedQAns,
                    qid,
                    'askedBy' in reportedObject ? 'question' : 'answer',
                    true,
                  )
                }>
                Remove
              </button>
            </div>
            {err && (
              <div>
                <p>{err[objId]}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ReviewReportsPage;
