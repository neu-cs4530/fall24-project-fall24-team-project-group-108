import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Message, Correspondence } from '../../../../types';

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
const CorrespondenceView = ({ correspondence }: CorrespondenceProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <div className='question right_padding'>
      <div className='correspondenceTime'>
        {correspondence.messages.length > 0
          ? getMetaData(
              new Date(correspondence.messages[correspondence.messages.length - 1].messageDateTime),
            )
          : null}
      </div>
      <div className='correspondenceData'>
        <div>
          {correspondence.messageMembers.map((memberName, idx) => (
            <div key={idx}>{memberName}</div>
          ))}
        </div>
        <div>
          {correspondence.messages.length > 0
            ? correspondence.messages[correspondence.messages.length - 1].messageText
            : null}
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceView;
