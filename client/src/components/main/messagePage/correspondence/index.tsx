import './index.css';
import { useNavigate } from 'react-router-dom';
import { getMetaData } from '../../../../tool';
import { Correspondence } from '../../../../types';
import useQuestion from '../../../../hooks/useQuestion';
import ProfileHover from '../../accountPage/profileHover';

/**
 * Interface representing the props for the Correspondence View component.
 *
 * correspondence - The correspondence object containing details about the correspondence.
 * username - The username of the current user
 * onClickHandler - Function that details what to do when correspondence is selected
 */
interface CorrespondenceProps {
  correspondence: Correspondence;
  username: string;
  onClickHandler: (correspondence: Correspondence) => void;
}

/**
 * Correspondence component renders the details of a correspondence including its members and most recent activity
 * Clicking on the component triggers the onClickHandler function,
 * and clicking on another member's name navigates to their user account page.
 *
 * @param correspondence - The correspondence object containing correspondence details.
 * @param username - The username of the current user
 * @param onClickHandler - A function detailing what to do when the correspondence is clicked
 */
const CorrespondenceView = ({ correspondence, username, onClickHandler }: CorrespondenceProps) => {
  const navigate = useNavigate();

  return (
    <div
      className='question right_padding'
      onClick={() => {
        onClickHandler(correspondence);
      }}>
      <div className='postStats'>
        <div>{correspondence.messages.length || 0} messages</div>
        {/* <div className='postStatsMembers'>Members: </div> */}
      </div>
      <div className='messageMembersContainer'>
        <div className='messageMembersTitle'>
          {'Message Members:'}
          <br></br>
        </div>
        <div className='question_tags'>
          {correspondence.messageMembers
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((memberName, idx) => (
              <div
                key={idx}
                className='memberLink'
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/account/${memberName}`);
                }}>
                {memberName} <br></br>
              </div>
            ))}
        </div>
      </div>
      <div className='recentMessageContainer'>
        <div className='messageMembersTitle'>
          {'Recent Message:'}
          <br></br>
        </div>
        <div className='postTitle'>
          {correspondence.messages[correspondence.messages.length - 1].messageText}
        </div>
      </div>

      <div className='lastActivity'>
        <div>&nbsp;</div>
        <div className='question_meta'>
          {getMetaData(
            new Date(correspondence.messages[correspondence.messages.length - 1].messageDateTime),
          )}
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceView;
