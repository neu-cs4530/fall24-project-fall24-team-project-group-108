import React from 'react';
import './index.css';

/**
 * Interface representing the props for the ReviewModApplicationHeader component.
 *
 * - reportCount - The number of reports to display in the header.
 */
interface UserReportProps {
  reportCount: number;
}

/**
 * ReviewModApplicationHeader component that displays a header section for the review applications page.
 * It includes the number of mod applications and the title.
 *
 * @param modAppCount The number of applications to display.
 */
const ReviewReportHeader = ({ reportCount }: UserReportProps) => (
  <div id='reviewApplicationsHeader' className='space_between right_padding'>
    <div className='bold_title'>{reportCount} Reported Questions/Answers</div>
    <div className='bold_title review_application_title'>Review Reports</div>
  </div>
);

export default ReviewReportHeader;
