import React from 'react';
import './index.css';
import NewCorrespondenceButton from '../../newCorrespondenceButton';

/**
 * Interface representing the props for the MessageHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * ccnt - The number of correspondences to be displayed in the header.
 */
interface MessageHeaderProps {
  titleText: string;
  ccnt: number;
}

/**
 * MessageHeader component displays the header section for a list of messages.
 * It includes the title, a button to create a new correspondence, the number of the correspondences
 *
 * @param titleText - The title text to display in the header.
 * @param ccnt - The number of correspondences displayed in the header.
 */
const MessageHeader = ({ titleText, ccnt }: MessageHeaderProps) => (
  <div>
    <div className='space_between right_padding'>
      <div className='bold_title'>{titleText}</div>
      <NewCorrespondenceButton />
    </div>
    <div className='space_between right_padding'>
      <div id='correspondence_count'>{ccnt} correspondences</div>
    </div>
  </div>
);

export default MessageHeader;
