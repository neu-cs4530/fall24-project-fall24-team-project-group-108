import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import ProfileHover from '../../accountPage/profileHover';
import useQuestion from '../../../../hooks/useQuestion';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const {
    handleAnswer,
    clickTag,
    isHovered,
    iconDetails,
    handleAuthorClick,
    handleHoverEnter,
    setIsHovered,
    badges,
  } = useQuestion(q);

  return (
    <div
      className='question right_padding'
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <div className='postStats'>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views.length} views</div>
      </div>
      <div className='question_mid'>
        <div className='postTitle'>{q.title}</div>
        <div className='question_tags'>
          {q.tags.map((tag, idx) => (
            <button
              key={idx}
              className='question_tag_button'
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className={`profile-hover-container ${isHovered ? 'show' : ''}`}>
        <ProfileHover user={q.askedBy} iconData={iconDetails} badges={badges} />
      </div>

      <div className='lastActivity'>
        <div
          className='question_author'
          onClick={e => {
            e.stopPropagation();
            handleAuthorClick();
          }}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={() => setIsHovered(false)}>
          {q.askedBy}
        </div>
        <div>&nbsp;</div>
        <div className='question_meta'>{getMetaData(new Date(q.askDateTime))}</div>
      </div>
    </div>
  );
};

export default QuestionView;
