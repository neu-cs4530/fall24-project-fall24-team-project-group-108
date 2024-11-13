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
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param correspondence - The question object containing question details.
 */
const CorrespondenceView = ({ correspondence }: CorrespondenceProps) => (
  <div className='question right_padding'>
    <div className='correspondenceTime'>
      {getMetaData(
        new Date(correspondence.messages[correspondence.messages.length - 1].messageDateTime),
      )}
    </div>
    <div className='correspondenceData'>
      <div>
        {correspondence.messageMembers.map((memberName, idx) => (
          <div key={idx}>{memberName}</div>
        ))}
      </div>
      <div>{correspondence.messages[correspondence.messages.length - 1].messageText}</div>
    </div>
  </div>
);

export default CorrespondenceView;
