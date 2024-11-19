import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Badge, Comment } from '../../../../types';
import { fetchBadgesByUser, getBadgeDetailsByUsername } from '../../../../services/badgeService';
import ProfileHover from '../../accountPage/profileHover';
import { BadgeCategory, BadgeTier } from '../../../../hooks/useBadgePage';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, handleAddComment }: AnswerProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [iconDetails, setIconDetails] = useState<{
    category: BadgeCategory;
    tier: BadgeTier;
  } | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  /**
   * Function to fetch details about the user's profile icon.
   */
  const fetchProfileIconDetails = async (user: string) => {
    try {
      const details = await getBadgeDetailsByUsername(user);
      return {
        category: (details.category as BadgeCategory) || 'Unknown Category',
        tier: (details.tier as BadgeTier) || 'Unknown Tier',
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch details for user: ${user}`, error);
      return null; // Return null in case of an error
    }
  };

  /**
   * Function to fetch all badges obtained by the user.
   */
  const fetchUserBadges = async (user: string) => {
    try {
      const res = await fetchBadgesByUser(user);
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return [];
    }
  };

  const handleHoverEnter = async () => {
    setIsHovered(true);

    const details = await fetchProfileIconDetails(ansBy);
    setIconDetails(details);

    const userBadges = await fetchUserBadges(ansBy);
    if (userBadges) {
      setBadges(userBadges);
    }
  };

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = () => {
    navigate(`/account/${ansBy}`); // Assuming you have an ID for the author
  };

  return (
    <div className='answer right_padding'>
      <div id='answerText' className='answerText'>
        {handleHyperlink(text)}
      </div>
      <div className={`profile-hover-container ${isHovered ? 'show' : ''}`}>
        <ProfileHover user={ansBy} iconData={iconDetails} badges={badges} />
      </div>
      <div className='answerAuthor'>
        <div
          className='answer_author'
          onClick={e => {
            e.stopPropagation(); // prevent triggering the parent div's click event
            handleAuthorClick();
          }}
          onMouseEnter={handleHoverEnter} // Set hover state to true when the mouse enters
          onMouseLeave={() => setIsHovered(false)}>
          {ansBy}
        </div>
        <div className='answer_question_meta'>{meta}</div>
      </div>
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
    </div>
  );
};

export default AnswerView;
