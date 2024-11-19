import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Badge, Question } from '../../../../types';
import ProfileHover from '../../accountPage/profileHover';
import { fetchBadgesByUser, getBadgeDetailsByUsername } from '../../../../services/badgeService';
import { BadgeCategory, BadgeTier } from '../../../../hooks/useBadgePage';

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

    const details = await fetchProfileIconDetails(q.askedBy);
    setIconDetails(details);

    const userBadges = await fetchUserBadges(q.askedBy);
    if (userBadges) {
      setBadges(userBadges);
    }
  };

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

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = () => {
    navigate(`/account/${q.askedBy}`); // Assuming you have an ID for the author
  };

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
            e.stopPropagation(); // prevent triggering the parent div's click event
            handleAuthorClick();
          }}
          onMouseEnter={handleHoverEnter} // Set hover state to true when the mouse enters
          onMouseLeave={() => setIsHovered(false)}>
          {q.askedBy}
        </div>
        <div>&nbsp;</div>
        <div className='question_meta'>asked {getMetaData(new Date(q.askDateTime))}</div>
      </div>
    </div>
  );
};

export default QuestionView;
