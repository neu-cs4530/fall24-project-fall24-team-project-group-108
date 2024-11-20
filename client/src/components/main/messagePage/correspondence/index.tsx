import './index.css';
import { getMetaData } from '../../../../tool';
import { Correspondence } from '../../../../types';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface CorrespondenceProps {
  correspondence: Correspondence;
  onClickHandler: (correspondence: Correspondence) => void;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param correspondence - The question object containing question details.
 */
const CorrespondenceView = ({ correspondence, onClickHandler }: CorrespondenceProps) => (
  <button
    className='correspondence right_padding'
    onClick={() => {
      onClickHandler(correspondence);
    }}>
    <div className='correspondenceData'>
      <div className='correspondenceNames'>
        {correspondence.messageMembers.map((memberName, idx) => (
          <div key={idx}>{memberName}</div>
        ))}
      </div>
      <div className='correspondenceLatestMessageText'>
        {correspondence.messages.length > 0
          ? correspondence.messages[correspondence.messages.length - 1].messageText
          : null}
      </div>

      <div className='correspondenceTime'>
        {correspondence.messages.length > 0
          ? getMetaData(
              new Date(correspondence.messages[correspondence.messages.length - 1].messageDateTime),
            )
          : 'No Time'}
      </div>
    </div>
  </button>
);

export default CorrespondenceView;
