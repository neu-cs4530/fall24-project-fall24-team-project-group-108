import { Form, useLocation } from 'react-router-dom';
import './index.css';
import useReportPage from '../../../hooks/useReportPage';
import TextArea from '../baseComponents/textarea';
import useBan from '../../../hooks/useBan';

/**
 * ReportPage component that renders a page where a user can create a report on a question or answer.
 */
const ReportPage = () => {
  useBan();
  const location = useLocation();
  const { targetId, targetType, targetText, targetBy, targetLink } = location.state;
  const { text, setText, reportErr, handleNewReport } = useReportPage();

  if (!targetId || !targetType || !targetText || !targetBy || !targetLink) {
    return <div className='container'>Cannot find information on question/answer</div>;
  }

  return (
    <div className='container'>
      <h2>Report the Following {targetType === 'question' ? 'Question' : 'Answer'}:</h2>
      <div className='report-container'>
        <h3>{targetText}</h3>
        <p>{targetBy}</p>
      </div>
      <Form>
        <TextArea
          title={'Please elaborate'}
          id={'formTextInput'}
          val={text}
          setState={setText}
          err={reportErr}
        />
        <div className='btn_indicator_container'>
          <button
            className='form_postBtn'
            onClick={() => {
              handleNewReport(targetType, targetId, targetLink);
            }}>
            Report
          </button>
          <div className='mandatory_indicator'>* indicates mandatory fields</div>
        </div>
      </Form>
    </div>
  );
};

export default ReportPage;
