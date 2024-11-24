import './index.css';
import { useNavigate } from 'react-router-dom';
import { getMetaData } from '../../../../tool';
import { Correspondence } from '../../../../types';
import useQuestion from '../../../../hooks/useQuestion';
import ProfileHover from '../../accountPage/profileHover';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface CorrespondenceProps {
  correspondence: Correspondence;
  username: string;
  onClickHandler: (correspondence: Correspondence) => void;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param correspondence - The question object containing question details.
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
        {/* <div
    className='question_author'
    onClick={e => {
      e.stopPropagation();
      handleAuthorClick();
    }}
    onMouseEnter={handleHoverEnter}
    onMouseLeave={() => setIsHovered(false)}>
    {q.askedBy}
  </div> */}

        {/* <div className='postTitle'>
          {correspondence.messages[correspondence.messages.length - 1].messageText}
        </div> */}
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
