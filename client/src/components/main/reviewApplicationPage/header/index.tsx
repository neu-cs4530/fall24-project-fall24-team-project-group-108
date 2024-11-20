import React from 'react';
import './index.css';

/**
 * Interface representing the props for the ReviewModApplicationHeader component.
 *
 * - modAppCount - The number of applications to display in the header.
 */
interface ModApplicationProps {
  modAppCount: number;
}

/**
 * ReviewModApplicationHeader component that displays a header section for the review applications page.
 * It includes the number of mod applications and the title.
 *
 * @param modAppCount The number of applications to display.
 */
const ReviewModApplicationHeader = ({ modAppCount }: ModApplicationProps) => (
  <div id='reviewApplicationsHeader' className='space_between right_padding'>
    <div className='bold_title'>{modAppCount} Moderator Applications</div>
    <div className='bold_title review_application_title'>Review Applications</div>
  </div>
);

export default ReviewModApplicationHeader;
